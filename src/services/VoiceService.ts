// Voice recorder removed for better implementation later.
import {
  createAudioPlayer,
  joinVoiceChannel,
  VoiceConnectionStatus,
  entersState,
  createAudioResource,
  StreamType,
  AudioPlayerStatus,
  NoSubscriberBehavior,
  DiscordGatewayAdapterCreator,
  AudioPlayerPlayingState,
} from '@discordjs/voice';
import {
  Client,
  Events,
  Guild,
  VoiceBasedChannel,
  GatewayDispatchEvents,
  GatewayVoiceServerUpdateDispatchData,
  GatewayVoiceStateUpdateDispatchData,
  Status,
  ButtonInteraction,
  CacheType,
} from 'discord.js';
import { spawn } from 'child_process';

const adapters = new Map<string, any>();
const trackedClients = new Set<Client>();
const trackedShards = new Map<number, Set<string>>();
const voiceConnections = new Map<string, any>();

const player = createAudioPlayer({
  behaviors: {
    noSubscriber: NoSubscriberBehavior.Play,
  },
});

class VoiceService {
  private currentVolume: number = 0.5;

  async trackClient(client: Client) {
    if (trackedClients.has(client)) return;
    trackedClients.add(client);

    client.ws.on(GatewayDispatchEvents.VoiceServerUpdate, (payload: GatewayVoiceServerUpdateDispatchData) => {
      adapters.get(payload.guild_id)?.onVoiceServerUpdate(payload);
    });

    client.ws.on(GatewayDispatchEvents.VoiceStateUpdate, (payload: GatewayVoiceStateUpdateDispatchData) => {
      if (payload.guild_id && payload.session_id && payload.user_id === client.user?.id) {
        adapters.get(payload.guild_id)?.onVoiceStateUpdate(payload);
      }
    });

    client.on(Events.ShardDisconnect, (_, shardId) => {
      const guilds = trackedShards.get(shardId);
      if (guilds) {
        guilds.forEach(guildID => adapters.get(guildID)?.destroy());
      }
      trackedShards.delete(shardId);
    });
  }
  async trackGuild(guild: Guild) {
    let guilds = trackedShards.get(guild.shardId);
    if (!guilds) {
      guilds = new Set();
      trackedShards.set(guild.shardId, guilds);
    }
    guilds.add(guild.id);
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

  async connect(interaction: any, deaf = true, mute = false) {
    const channel = interaction.member.voice.channel;
    if (!channel) {
      await interaction.editReply('Você não está em um canal de voz!');
      return null;
    }

    let voiceConnection = voiceConnections.get(interaction.guild.id);
    if (!voiceConnection) {
      voiceConnection = joinVoiceChannel({
        channelId: interaction.member.voice.channelId,
        guildId: interaction.guild.id,
        adapterCreator: await this.createDiscordJSAdapter(channel),
        selfDeaf: deaf,
        selfMute: mute,
      });
      voiceConnections.set(interaction.guild.id, voiceConnection);

      try {
        await entersState(voiceConnection, VoiceConnectionStatus.Ready, 30_000);
        console.log('Connected to voice channel');
      } catch (error) {
        voiceConnection.destroy();
        voiceConnections.delete(interaction.guild.id);
        throw error;
      }
    }
    return voiceConnection;
  }

  async play(interaction: any, src: string, _type: string) {
    let resource;
    const voiceConnection = await this.connect(interaction);
    if (!voiceConnection) return;

    voiceConnection.subscribe(player);
    switch (_type) {
      case 'radio': {
        resource = createAudioResource(await this.startStream(src), {
          inputType: StreamType.Raw,
          inlineVolume: true,
        });
        break;
      }
      case 'audio': {
        resource = createAudioResource(src, { inputType: StreamType.Arbitrary, inlineVolume: true });
        break;
      }
      case 'yt': {
        break;
      }
    }

    resource!.volume!.setVolume(this.currentVolume);
    player.play(resource!);

    return entersState(player, AudioPlayerStatus.Playing, 5000);
  }

  async startStream(url: string) {
    const ffmpeg = spawn('ffmpeg', [
      '-i',
      url,
      '-f',
      's16le',
      '-ar',
      '48000',
      '-ac',
      '2',
      '-loglevel',
      'error',
      'pipe:1',
    ]);
    ffmpeg.stderr.on('data', data => console.error(`FFmpeg Error: ${data}`));
    return ffmpeg.stdout;
  }

  async setVolume(newVolume: number) {
    this.currentVolume = Math.max(0.0, Math.min(newVolume, 1.5));
    if (player.state.status === AudioPlayerStatus.Playing) {
      const state = player.state as AudioPlayerPlayingState;
      state.resource.volume?.setVolume(this.currentVolume);
    }
  }

  async increaseVolume(interaction: ButtonInteraction<CacheType>, step: number = 0.1) {
    this.setVolume(this.currentVolume + step);
    console.log(`Volume atual: ${(this.currentVolume * 100).toFixed(0)}% no servidor ${interaction.guild?.name}`);
    return voiceService.currentVolume;
  }

  async decreaseVolume(interaction: ButtonInteraction<CacheType>, step: number = 0.1) {
    this.setVolume(this.currentVolume - step);
    console.log(`Volume atual: ${(this.currentVolume * 100).toFixed(0)}% no servidor ${interaction.guild?.name}`);
    return voiceService.currentVolume;
  }

  async disconnect(interaction: any) {
    const voiceConnection = voiceConnections.get(interaction.guild.id);
    if (!voiceConnection) {
      await interaction.editReply('Não há nenhuma conexão ativa para desconectar!');
      return;
    }
    voiceConnection.destroy();
    voiceConnections.delete(interaction.guild.id);
    await interaction.editReply('Desconectado com sucesso!');
  }
}

const voiceService = new VoiceService();
export { voiceService };
