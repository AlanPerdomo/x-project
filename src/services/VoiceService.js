const {
  joinVoiceChannel,
  entersState,
  createAudioPlayer,
  createAudioResource,
  StreamType,
  AudioPlayerStatus,
  VoiceConnectionStatus,
} = require('@discordjs/voice');
const { GatewayDispatchEvents } = require('discord-api-types/v10');
const { Constants } = require('discord.js');

const { Events, Status } = Constants;
const adapters = new Map();
const trackedClients = new Set();
const trackedShards = new Map();
const player = createAudioPlayer();

async function connectToChannel(channel) {
  if (!channel || !channel.guild) {
    throw new Error('Channel or guild is not defined');
  }

  const connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: createDiscordJSAdapter(channel),
  });

  try {
    await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
    return connection;
  } catch (error) {
    connection.destroy();
    throw error;
  }
}

function playSong(connection) {
  const resource = createAudioResource('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', {
    inputType: StreamType.Arbitrary,
  });

  player.play(resource);
  connection.subscribe(player); // Assine a conexão de voz ao player
  return entersState(player, AudioPlayerStatus.Playing, 5000);
}

function trackClient(client) {
  if (trackedClients.has(client)) return;
  trackedClients.add(client);

  client.ws.on('voiceServerUpdate', payload => {
    adapters.get(payload.guild_id)?.onVoiceServerUpdate(payload);
  });

  client.ws.on('voiceStateUpdate', payload => {
    if (payload.guild_id && payload.session_id && payload.user_id === client.user?.id) {
      // @ts-expect-error TODO: currently voice is using a different discord-api-types version than discord.js
      adapters.get(payload.guild_id)?.onVoiceStateUpdate(payload);
    }
  });

  client.on('shardDisconnect', (_, shardId) => {
    const guilds = trackedShards.get(shardId);
    if (guilds) {
      for (const guildID of guilds.values()) {
        adapters.get(guildID)?.destroy();
      }
    }
    trackedShards.delete(shardId);
  });

  player.on('error', error => {
    console.error('Error:', error.message);
  });
}

function trackGuild(guild) {
  let guilds = trackedShards.get(guild.shardId);
  if (!guilds) {
    guilds = new Set();
    trackedShards.set(guild.shardId, guilds);
  }
  guilds.add(guild.id);
}

function createDiscordJSAdapter(channel) {
  return methods => {
    adapters.set(channel.guild.id, methods);
    trackClient(channel.client);
    trackGuild(channel.guild);
    console.log(channel.guild.shard?.status);
    return {
      sendPayload(data) {
        if (channel.guild.shard && channel.guild.shard.status === 'ready') {
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

module.exports = { connectToChannel, playSong };
