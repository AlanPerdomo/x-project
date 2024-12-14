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
  AudioPlayer,
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
  // ButtonInteraction,
  // CacheType,
} from 'discord.js';
import { spawn } from 'child_process';
import ytdl from '@distube/ytdl-core';
import { playerRow, radioRow } from '../buttons/PlayerButtons';

const adapters = new Map<string, any>();
const trackedClients = new Set<Client>();
const trackedShards = new Map<number, Set<string>>();
const voiceConnections = new Map<string, any>();
const voicePlayers = new Map<string, ReturnType<typeof createAudioPlayer>>();
const musicQueues = new Map<string, { link: string; title: string }[]>();
const initialInteractions = new Map();
const playingNow = new Map();

class VoiceService {
  private currentVolume: number = 0.1;

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

  async trackVoiceConnection(
    interaction: { guild: { id: string; name: any }; member: { voice: { channel: any } } },
    voiceConnection: any,
  ) {
    voiceConnections.set(interaction.guild.id, voiceConnection);

    voiceConnection.on(VoiceConnectionStatus.Disconnected, async () => {
      console.log(
        'Disconnected from voice channel',
        interaction.member.voice.channel.name,
        'at guild',
        interaction.guild.name,
      );
      voiceConnections.delete(interaction.guild.id);
      return;
    });
  }

  async handleQueue(interaction: any) {
    const guildId = interaction.guild.id;
    const queue = musicQueues.get(guildId);

    if (queue && queue.length > 0) {
      const nextSong = queue.shift();
      if (nextSong) {
        await this.play(interaction, nextSong.link, 'yt', nextSong.title);
      }
    } else {
      const player = voicePlayers.get(guildId);
      player?.stop();
      playerRow.components[4]?.setDisabled();
      await interaction.editReply({ content: 'Fila de músicas vazia.', components: [] });
    }
  }

  async getQueue(interaction: any) {
    const queue = musicQueues.get(interaction.guild.id);

    if (queue && queue.length > 0) {
      const queueString = queue.map((song, index) => `**${index + 1}.** ${song.title}`).join('\n');
      await interaction.update({
        content: `**Tocando:** ${playingNow.get(interaction.guild.id)}\n**Fila de musicas:**\n${queueString}`,
        components: [playerRow],
      });
    } else {
      await interaction.update({
        content: `**Tocando:** ${playingNow.get(interaction.guild.id)}\nFila de musicas vazia.`,
      });
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

  async connect(interaction: { member: any; guild: any; editReply: any }, deaf = true, mute = false) {
    const channel = interaction.member.voice.channel;
    const guildId = interaction.guild.id;
    if (!initialInteractions.has(guildId)) {
      initialInteractions.set(guildId, interaction);
    }
    let voiceConnection = voiceConnections.get(guildId);
    if (!channel) {
      await interaction.editReply('Você não está em um canal de voz!');
      return;
    }

    if (!voiceConnection) {
      voiceConnection = joinVoiceChannel({
        channelId: interaction.member.voice.channelId,
        guildId: guildId,
        adapterCreator: await this.createDiscordJSAdapter(channel),
        selfDeaf: deaf,
        selfMute: mute,
      });
      await this.trackVoiceConnection(interaction, voiceConnection);

      try {
        await entersState(voiceConnection, VoiceConnectionStatus.Ready, 30_000);
        console.log('Connected to voice channel');
        const player = createAudioPlayer({
          behaviors: {
            noSubscriber: NoSubscriberBehavior.Play,
          },
        });
        voicePlayers.set(guildId, player);
        voiceConnection.subscribe(player);
      } catch (error) {
        voiceConnection.destroy();
        voiceConnections.delete(guildId);
        throw error;
      }
    }
    return voiceConnection;
  }

  async play(interaction: any, src: string, _type: string, title?: string, link?: string) {
    const guildId = interaction.guild.id;

    if (!musicQueues.has(guildId)) {
      musicQueues.set(guildId, []);
    }
    const queue = musicQueues.get(guildId);
    let resource;

    const voiceConnection = await this.connect(interaction);
    const player = voicePlayers.get(guildId);

    if (!player || !voiceConnection) {
      await interaction.editReply('Erro ao iniciar o player!');
      return;
    }
    if (queue!.length == 0) {
      playerRow.components[4]?.setDisabled();
    }

    if (player.state.status === AudioPlayerStatus.Playing || queue!.length > 0) {
      await interaction.editReply(`**Adicionado à fila:** ${title}`);
      queue?.push({ link: src, title: title || 'Música Desconhecida' });

      return;
    }
    switch (_type) {
      case 'radio': {
        resource = createAudioResource(await this.startStream(player, src), {
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
        try {
          const stream = ytdl(src, { filter: 'audioonly', highWaterMark: 1 << 25 });
          resource = createAudioResource(stream, {
            inputType: StreamType.Arbitrary,
            inlineVolume: true,
          });
          resource!.volume!.setVolume(this.currentVolume);
          player.play(resource!);

          playingNow.set(guildId, `[${title}](${link})`);
          console.log(playingNow.get(guildId));

          try {
            await interaction.editReply({ content: `**Tocando:** [${title}](${link})`, components: [playerRow] });
            console.log('editReply');
          } catch (error) {
            await interaction.update({ content: `**Tocando:** [${title}](${link})`, components: [playerRow] });
            console.log('update');
          }

          player?.on(AudioPlayerStatus.Idle, () => {
            this.handleQueue(interaction);
          });
          return await entersState(player, AudioPlayerStatus.Playing, 5000);
        } catch (error) {
          console.error('Erro ao obter o áudio do YouTube:', error);
          await interaction.editReply('Não foi possível reproduzir a música do YouTube.');
          return;
        }
      }
    }

    resource!.volume!.setVolume(this.currentVolume);
    player.play(resource!);

    return entersState(player, AudioPlayerStatus.Playing, 5000);
  }

  async resume(interaction: {
    guild: { id: string };
    message: { content: string; components: { components: { data: { custom_id: string } }[] }[] };
    update: any;
  }) {
    const voiceConnection = voiceConnections.get(interaction.guild.id);
    const player = voicePlayers.get(interaction.guild.id);
    try {
      let row: any = [];
      if (interaction.message.components[0]?.components[3]?.data.custom_id === 'volume-down') {
        row = radioRow;
      } else if (interaction.message.components[0]?.components[3]?.data.custom_id === 'queue') {
        row = playerRow;
      }

      row.components[0]?.setDisabled();
      row.components[1]?.setDisabled(false);
      row.components[2]?.setDisabled(false);
      if (!voiceConnection) return;
      if (!player) return;
      player.unpause();
      entersState(player, AudioPlayerStatus.Playing, 5000);
      const playing = playingNow.get(interaction.guild.id);
      return await interaction.update({ content: `**Tocando:** ${playing}`, components: [row] });
    } catch (error) {
      console.error(error);
      return interaction.update({ content: 'Algo deu errado ao tentar tocar!' });
    }
  }

  async pause(interaction: {
    guild: { id: string };
    message: { content: string; components: { components: { data: { custom_id: string } }[] }[] };
    update: any;
  }) {
    const voiceConnection = voiceConnections.get(interaction.guild.id);
    const player = voicePlayers.get(interaction.guild.id);

    try {
      let row: any = [];
      if (interaction.message.components[0]?.components[3]?.data.custom_id === 'volume-down') {
        row = radioRow;
      } else if (interaction.message.components[0]?.components[3]?.data.custom_id === 'queue') {
        row = playerRow;
      }

      row.components[0]?.setDisabled(false);
      row.components[1]?.setDisabled();
      row.components[2]?.setDisabled();
      const playing = playingNow.get(interaction.guild.id);
      await interaction.update({ content: `${playing} Pausado com sucesso!`, components: [row] });
    } catch (error) {
      console.error(error);
      return interaction.update({ content: 'Algo deu errado ao tentar pausar!' });
    }
    if (!voiceConnection) return;
    if (!player) return;
    player.pause();
    return entersState(player, AudioPlayerStatus.Paused, 5000);
  }

  async next(interaction: { guild: { id: string } }) {
    const player = voicePlayers.get(interaction.guild.id);

    player!.stop();

    return;
  }
  async stop(interaction: { guild: { id: string }; update: any }) {
    const voiceConnection = voiceConnections.get(interaction.guild.id);
    const player = voicePlayers.get(interaction.guild.id);
    const queue = musicQueues.get(interaction.guild.id);
    if (!voiceConnection) return;
    if (!player) return;
    try {
      queue!.length = 0;
      initialInteractions.delete(interaction.guild.id);

      player.stop();

      await voiceConnection.disconnect();
      return await interaction.update({ content: 'Parado com sucesso!', components: [] });
    } catch (error) {
      console.error(error);
      return interaction.update('Algo deu errado ao tentar parar!');
    }
  }

  async startStream(player: AudioPlayer, url: string) {
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
    if (player.state.status === AudioPlayerStatus.Playing) {
      ffmpeg.stderr.on('data', data => console.error(`FFmpeg Error: ${data}`));
    }
    return ffmpeg.stdout;
  }

  async setVolume(newVolume: number, interaction: { guild: { id: string; name: string } }) {
    this.currentVolume = Math.max(0.0, Math.min(newVolume, 1.5));
    const player = voicePlayers.get(interaction.guild!.id);
    console.log(`Volume atual: ${(this.currentVolume * 100).toFixed(0)}% no servidor ${interaction.guild?.name}`);
    if (player) {
      const state = player.state as AudioPlayerPlayingState;
      state.resource.volume!.setVolume(this.currentVolume);
    }
  }

  async increaseVolume(interaction: any, step: number = 0.1) {
    const currentContent = interaction.message.content.split('\n')[0];
    radioRow.components[3]?.setDisabled(false);
    try {
      this.setVolume(this.currentVolume + step, interaction);
      if (this.currentVolume >= 1.5) {
        radioRow.components[4]?.setDisabled();
        return await interaction.update({
          content: `${currentContent} \nVolume atual: Max`,
          components: [radioRow],
        });
      }
      return await interaction.update({
        content: `${currentContent} \nVolume atual: ${(this.currentVolume * 100).toFixed(0)}%`,
        components: [radioRow],
      });
    } catch (error) {
      console.error(error);
      return interaction.update('Algo deu errado ao tentar aumentar o volume!');
    }
  }

  async decreaseVolume(interaction: any, step: number = 0.1) {
    const currentContent = interaction.message.content.split('\n')[0];
    radioRow.components[4]?.setDisabled(false);
    try {
      this.setVolume(this.currentVolume - step, interaction);
      if (this.currentVolume <= 0) {
        radioRow.components[3]?.setDisabled();
        return await interaction.update({
          content: `${currentContent} \nVolume atual: Min`,
          components: [radioRow],
        });
      }
      return await interaction.update({
        content: `${currentContent} \nVolume atual: ${(this.currentVolume! * 100).toFixed(0)}%`,
        components: [radioRow],
      });
    } catch (error) {
      console.error(error);
      return interaction.update('Algo deu errado ao tentar diminuir o volume!');
    }
  }

  async record(interaction: any) {}

  async disconnect(interaction: any) {
    const guildId = interaction.guild.id;
    const voiceConnection = voiceConnections.get(guildId);
    if (!voiceConnection) {
      await interaction.editReply('Não há nenhuma conexão ativa para desconectar!');
      return;
    }

    const player = voicePlayers.get(guildId);
    player?.stop();
    voicePlayers.delete(guildId);

    voiceConnection.destroy();
    voiceConnections.delete(guildId);
    await interaction.editReply('Desconectado com sucesso!');
  }
}

const voiceService = new VoiceService();
export { voiceService };
