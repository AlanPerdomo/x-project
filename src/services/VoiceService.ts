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
} from 'discord.js';
import { spawn } from 'child_process';

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

  async attachRecorder() {
    const ffmpeg = spawn('ffmpeg', [
      '-i',
      url, // Input URL
      '-f',
      's16le', // Format to PCM
      '-ar',
      '48000', // Sample rate
      '-ac',
      '2', // Number of audio channels
      'pipe:1', // Output to stdout
    ]);

    const resource = createAudioResource(ffmpeg.stdout, {
      inputType: StreamType.Raw,
    });

    player.play(resource);
  }

  async trackGuild(guild: Guild) {
    let guilds = trackedShards.get(guild.shardId);
    if (!guilds) {
      guilds = new Set();
      trackedShards.set(guild.shardId, guilds);
    }
    guilds.add(guild.id);
  }

  async connect(interaction: { reply?: any; editReply?: any; member: any; guild: any }) {
    const channel = interaction.member.voice.channel;

    if (!channel) {
      return await interaction.editReply('Você não está em um canal de voz!');
    }
    const voiceConnection = joinVoiceChannel({
      channelId: interaction.member.voice.channelId,
      guildId: interaction.guild.id,
      adapterCreator: await this.createDiscordJSAdapter(channel),
      // selfDeaf: false,
      // selfMute: false,
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
      await this.attachRecorder();
    }
    return entersState(player, AudioPlayerStatus.Playing, 5000);
  }

  async disconnect() {}
}
const voiceService = new VoiceService();
export { voiceService };
