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
import play from 'play-dl';

const adapters = new Map<Snowflake, DiscordGatewayAdapterLibraryMethods>();
const trackedClients = new Set<Client>();
const trackedShards = new Map<number, Set<Snowflake>>();
const url = 'CHIHIRO';

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
    const isSupported = await play.validate(url);
    console.log(isSupported);
    const search = await play.search(url);
    const stream = await play.stream(`${search[0]?.url}`);

    console.log(search[0]?.url);

    const resource = createAudioResource(stream.stream, { inputType: StreamType.Arbitrary });

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
