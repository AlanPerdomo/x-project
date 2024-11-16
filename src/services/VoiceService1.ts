import { DiscordGatewayAdapterLibraryMethods } from '@discordjs/voice';
import {
  Snowflake,
  Client,
  GatewayDispatchEvents,
  GatewayVoiceServerUpdateDispatchData,
  GatewayVoiceStateUpdateDispatchData,
  Guild,
} from 'discord.js';

const adapters = new Map<Snowflake, DiscordGatewayAdapterLibraryMethods>();
const trackedClients = new Set<Client>();
const trackedShards = new Map<number, Set<Snowflake>>();

function trackClient(client: Client) {
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
  client.on(Events.SHARD_DISCONNECT, (_, shardId) => {
    const guilds = trackedShards.get(shardId);
    if (guilds) {
      for (const guildID of guilds.values()) {
        adapters.get(guildID)?.destroy();
      }
    }
    trackedShards.delete(shardId);
  });
}

function trackGuild(guild: Guild) {
  let guilds = trackedShards.get(guild.shardId);
  if (!guilds) {
    guilds = new Set();
    trackedShards.set(guild.shardId, guilds);
  }
  guilds.add(guild.id);
}

class VoiceService {
  async connect() {}

  async disconnect() {}
}
