import {
  createAudioPlayer,
  DiscordGatewayAdapterCreator,
  DiscordGatewayAdapterLibraryMethods,
  joinVoiceChannel,
  NoSubscriberBehavior,
  VoiceConnectionStatus,
  entersState,
  createAudioResource,
  StreamType,
  AudioPlayerStatus,
  VoiceReceiver,
  EndBehaviorType,
} from '@discordjs/voice';
import {
  Snowflake,
  Client,
  GatewayDispatchEvents,
  GatewayVoiceServerUpdateDispatchData,
  GatewayVoiceStateUpdateDispatchData,
  Guild,
  VoiceBasedChannel,
  Events,
  Status,
  User,
} from 'discord.js';
import { spawn } from 'child_process';
import { device } from '../../config.json';
import prism from 'prism-media';
import fs from 'fs';

const adapters = new Map<Snowflake, DiscordGatewayAdapterLibraryMethods>();
const trackedClients = new Set<Client>();
const trackedShards = new Map<number, Set<Snowflake>>();
const url =
  // 'https://www.youtube.com/watch?v=V9PVRfjEBTI';
  // 'https://www.youtube.com/watch?v=V9PVRfjEBTI&list=RDEMcce0hP5SVByOVCd8UWUHEA&start_radio=1';
  'https://play.ilovemusic.de/ilm_iloveradio/';
// 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
// 'https://ilm.stream35.radiohost.de/ilm_iloveradio_mp3-192?context=fHA6LTE=&listenerid=1ea4520acf9782d82085d00f37940983&awparams=companionAds:true&aw_0_req.userConsentV2=CQImD0AQImD0AAFADBDEBRFsAP_gAAAAAAYgHvQJwACAALAAqABcADIAHAAPAAgABJACcAKIAWABaADKAIwAjgBRAC4AHMAQYAnABXADVgHcAd4BCACJgHAAOqAfsBDoCKgEagJEASeAnEBUoC3gF5gL2AYAA3AB7wJEQAQJEAFhoAMAAQSIEQAYAAgkQCgAwABBIgJABgACCRAqADAAEEiBkAGAAIJEDoAMAAQSIIQAYAAgkQSgAwABBIgpABgACCRBaADAAEEiAAAA.YAAAAAAAAAAA&aw_0_1st.playerid=ilovemusic_web&aw_0_1st.1plusxAudience=2,2k,2l&_art=dD0xNzMyNDk0ODgxJmQ9NDliZjUyYzBjOWM5NjEwOWE3ZTk';

const player = createAudioPlayer({
  behaviors: {
    noSubscriber: NoSubscriberBehavior.Play,
    maxMissedFrames: Math.round(5000 / 20),
  },
  debug: true,
});

class VoiceService {
  async trackClient(client: Client) {
    if (trackedClients.has(client)) return;
    trackedClients.add(client);
    client.ws.on(GatewayDispatchEvents.VoiceServerUpdate, (payload: GatewayVoiceServerUpdateDispatchData) => {
      adapters.get(payload.guild_id)?.onVoiceServerUpdate(payload);
    });
    client.ws.on(GatewayDispatchEvents.VoiceStateUpdate, (payload: GatewayVoiceStateUpdateDispatchData) => {
      if (payload.guild_id && payload.session_id && payload.user_id === client.user?.id) {
        // @ts-expect-error TODO: currently voice is using a different discord-api-types version than discord.js
        adapters.get(payload.guild_id)?.onVoiceStateUpdate(payload);
      }
    });
    client.on(Events.ShardDisconnect, (_, shardId) => {
      const guilds = trackedShards.get(shardId);
      if (guilds) {
        for (const guildID of guilds.values()) {
          adapters.get(guildID)?.destroy();
        }
      }
      trackedShards.delete(shardId);
    });
  }

  async playStream() {
    const ffmpeg = spawn('ffmpeg', [
      '-f',
      'pulse', // 'dshow ' para Windows, 'pulse' para Linux ou macOS
      '-i',
      `${device}`,
      '-f',
      's16le',
      '-ar',
      '48000',
      '-ac',
      '2',
      '-loglevel',
      'error', // Minimize a saída de log
      'pipe:1',
    ]);

    ffmpeg.stderr.on('data', data => console.error(`FFmpeg Error: ${data}`));

    const resource = createAudioResource(ffmpeg.stdout, {
      inputType: StreamType.Raw,
    });

    player.play(resource);
    console.log(`Streaming ${device} to bot...`);
  }

  async createListeningStream(receiver: VoiceReceiver, user: User) {
    const path = '../recordings';
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }

    const opusStream = receiver.subscribe(user.id, {
      end: {
        behavior: EndBehaviorType.AfterSilence,
        duration: 1000,
      },
    });

    // Converte Opus para PCM usando prism-media
    const pcmStream = new prism.opus.Decoder({
      rate: 48000, // Taxa de amostragem
      channels: 2, // Áudio estéreo
      frameSize: 960, // Tamanho do frame
    });
    const filename = `../recordings/${Date.now()}-${user.username}.mp3`;

    const ffmpeg = spawn('ffmpeg', [
      '-loglevel',
      'debug', // Adiciona informações detalhadas
      '-f',
      's16le',
      '-ar',
      '48000',
      '-ac',
      '2',
      '-i',
      'pipe:0',
      '-b:a',
      '192k',
      filename,
    ]);

    console.log(`👂 Started recording with FFmpeg: ${filename}`);

    // Conecta os streams
    opusStream.pipe(pcmStream).pipe(ffmpeg.stdin);

    ffmpeg.on('close', code => {
      if (code === 0) {
        console.log(`✅ Recorded ${filename}`);
      } else {
        console.warn(`❌ FFmpeg exited with code ${code}`);
      }
    });

    ffmpeg.stderr.on('data', data => {
      console.error(`FFmpeg Error: ${data}`);
    });

    ffmpeg.on('error', error => {
      console.error(`❌ FFmpeg error: ${error.message}`);
      ffmpeg.kill();
    });

    pcmStream.on('end', () => {
      ffmpeg.stdin.end();
    });

    setTimeout(() => {
      if (!ffmpeg.killed) {
        console.warn('⚠️ Timeout: FFmpeg pode estar esperando dados do stream.');
        ffmpeg.kill('SIGINT');
      }
    }, 5000); // 5 segundos
  }

  async trackGuild(guild: Guild) {
    let guilds = trackedShards.get(guild.shardId);
    if (!guilds) {
      guilds = new Set();
      trackedShards.set(guild.shardId, guilds);
    }
    guilds.add(guild.id);
  }

  async connect(interaction, deaf = true, mute = false) {
    const channel = interaction.member.voice.channel;

    if (!channel) {
      return await interaction.editReply('Você não está em um canal de voz!');
    }
    const voiceConnection = joinVoiceChannel({
      channelId: interaction.member.voice.channelId,
      guildId: interaction.guild.id,
      adapterCreator: await this.createDiscordJSAdapter(channel),
      selfDeaf: deaf,
      selfMute: mute,
    });
    try {
      await entersState(voiceConnection, VoiceConnectionStatus.Ready, 30_000);
      console.log('Connected to voice channel');
      return voiceConnection;
    } catch (error) {
      voiceConnection.destroy();
      throw error;
    }
  }

  async createDiscordJSAdapter(channel: VoiceBasedChannel): Promise<DiscordGatewayAdapterCreator> {
    return methods => {
      adapters.set(channel.guild.id, methods);
      this.trackClient(channel.client);
      this.trackGuild(channel.guild);
      return {
        sendPayload(data) {
          if (channel.guild.shard.status === Status.Ready) {
            channel.guild.shard.send(data);
            return true;
          }
          return false;
        },
        destroy() {
          return adapters.delete(channel.guild.id);
        },
      };
    };
  }

  async play(interaction: any, audio: string, stream = false) {
    const voiceConnection = await this.connect(interaction);
    if (!voiceConnection) return;

    voiceConnection.subscribe(player);

    if (!stream) {
      const resource = createAudioResource(audio, {
        inputType: StreamType.Arbitrary,
      });
      player.play(resource);
    } else if (stream) {
      await this.playStream();
    }
    return entersState(player, AudioPlayerStatus.Playing, 5000);
  }

  async record(interaction) {
    const voiceConnection = await this.connect(interaction, false);
    const receiver = voiceConnection.receiver;
    if (receiver) {
      await this.createListeningStream(receiver, interaction.user);
      await interaction.editReply('Gravando...');
    } else {
      await interaction.editReply('Algo deu errado!');
    }
  }

  async disconnect(interaction) {
    const voiceConnection = await this.connect(interaction);
    if (!voiceConnection) return;
    try {
      await voiceConnection.destroy();
      return interaction.editReply('Desconectado com sucesso!');
    } catch (error) {
      console.error(error);
      return interaction.editReply('Algo deu errado!');
    }
  }
}
const voiceService = new VoiceService();
export { voiceService };
