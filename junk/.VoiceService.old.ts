// import {
//   createAudioPlayer,
//   DiscordGatewayAdapterCreator,
//   DiscordGatewayAdapterLibraryMethods,
//   joinVoiceChannel,
//   NoSubscriberBehavior,
//   VoiceConnectionStatus,
//   entersState,
//   createAudioResource,
//   StreamType,
//   AudioPlayerStatus,
//   VoiceReceiver,
//   EndBehaviorType,
// } from '@discordjs/voice';
// import {
//   Snowflake,
//   Client,
//   GatewayDispatchEvents,
//   GatewayVoiceServerUpdateDispatchData,
//   GatewayVoiceStateUpdateDispatchData,
//   Guild,
//   VoiceBasedChannel,
//   Events,
//   Status,
//   User,
// } from 'discord.js';
// import { spawn } from 'child_process';
// import { device } from '../../config.json';
// import prism from 'prism-media';
// import fs from 'fs';

// const adapters = new Map<Snowflake, DiscordGatewayAdapterLibraryMethods>();
// const trackedClients = new Set<Client>();
// const trackedShards = new Map<number, Set<Snowflake>>();
// const voiceConnections = new Map();

// const url =
//   // 'https://www.youtube.com/watch?v=V9PVRfjEBTI';
//   // 'https://www.youtube.com/watch?v=V9PVRfjEBTI&list=RDEMcce0hP5SVByOVCd8UWUHEA&start_radio=1';
//   'https://play.ilovemusic.de/ilm_iloveradio/';
// // 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
// // 'https://ilm.stream35.radiohost.de/ilm_iloveradio_mp3-192?context=fHA6LTE=&listenerid=1ea4520acf9782d82085d00f37940983&awparams=companionAds:true&aw_0_req.userConsentV2=CQImD0AQImD0AAFADBDEBRFsAP_gAAAAAAYgHvQJwACAALAAqABcADIAHAAPAAgABJACcAKIAWABaADKAIwAjgBRAC4AHMAQYAnABXADVgHcAd4BCACJgHAAOqAfsBDoCKgEagJEASeAnEBUoC3gF5gL2AYAA3AB7wJEQAQJEAFhoAMAAQSIEQAYAAgkQCgAwABBIgJABgACCRAqADAAEEiBkAGAAIJEDoAMAAQSIIQAYAAgkQSgAwABBIgpABgACCRBaADAAEEiAAAA.YAAAAAAAAAAA&aw_0_1st.playerid=ilovemusic_web&aw_0_1st.1plusxAudience=2,2k,2l&_art=dD0xNzMyNDk0ODgxJmQ9NDliZjUyYzBjOWM5NjEwOWE3ZTk';

// const player = createAudioPlayer({
//   behaviors: {
//     noSubscriber: NoSubscriberBehavior.Play,
//     maxMissedFrames: Math.round(5000 / 20),
//   },
//   debug: true,
// });

// class VoiceService {
//   async trackClient(client: Client) {
//     if (trackedClients.has(client)) return;
//     trackedClients.add(client);
//     client.ws.on(GatewayDispatchEvents.VoiceServerUpdate, (payload: GatewayVoiceServerUpdateDispatchData) => {
//       adapters.get(payload.guild_id)?.onVoiceServerUpdate(payload);
//     });
//     client.ws.on(GatewayDispatchEvents.VoiceStateUpdate, (payload: GatewayVoiceStateUpdateDispatchData) => {
//       if (payload.guild_id && payload.session_id && payload.user_id === client.user?.id) {
//         // @ts-expect-error TODO: currently voice is using a different discord-api-types version than discord.js
//         adapters.get(payload.guild_id)?.onVoiceStateUpdate(payload);
//       }
//     });
//     client.on(Events.ShardDisconnect, (_, shardId) => {
//       const guilds = trackedShards.get(shardId);
//       if (guilds) {
//         for (const guildID of guilds.values()) {
//           adapters.get(guildID)?.destroy();
//         }
//       }
//       trackedShards.delete(shardId);
//     });
//   }

//   async playStream() {
//     const ffmpeg = spawn('ffmpeg', [
//       '-f',
//       'pulse', // 'dshow ' para Windows, 'pulse' para Linux ou macOS
//       '-i',
//       `${device}`,
//       '-f',
//       's16le',
//       '-ar',
//       '48000',
//       '-ac',
//       '2',
//       '-loglevel',
//       'error', // Minimize a saída de log
//       'pipe:1',
//     ]);

//     ffmpeg.stderr.on('data', data => console.error(`FFmpeg Error: ${data}`));

//     const resource = createAudioResource(ffmpeg.stdout, {
//       inputType: StreamType.Raw,
//     });

//     player.play(resource);
//     console.log(`Streaming ${device} to bot...`);
//   }

//   async createListeningStream(receiver: VoiceReceiver, interaction: any) {
//     await interaction.editReply('Gravando...');
//     const path = 'src/recordings';

//     if (!fs.existsSync(path)) {
//       fs.mkdirSync(path, { recursive: true });
//     }

//     const opusStream = receiver.subscribe(interaction.user.id, {
//       end: {
//         behavior: EndBehaviorType.AfterSilence,
//         duration: 10000,
//       },
//     });

//     // Converte Opus para PCM usando prism-media
//     const pcmStream = new prism.opus.Decoder({
//       rate: 48000, // Taxa de amostragem
//       channels: 2, // Áudio estéreo
//       frameSize: 1024, // Tamanho do frame
//     });
//     const filename = `src/recordings/${Date.now()}-${interaction.user.username}.mp3`;

//     const ffmpeg = spawn('ffmpeg', [
//       '-loglevel',
//       'debug',
//       '-f',
//       's16le',
//       '-ar',
//       '48000',
//       '-ac',
//       '2',
//       '-i',
//       'pipe:0',
//       '-af',
//       'aresample=async=1',
//       '-c:a',
//       'libmp3lame',
//       '-q:a',
//       '2',
//       filename,
//     ]);

//     console.log(`👂 Started recording with FFmpeg: ${filename}`);

//     // Conecta os streams
//     opusStream.pipe(pcmStream).pipe(ffmpeg.stdin);

//     opusStream.on('error', error => {
//       console.error(`❌ Opus error: ${error.message}`);
//       opusStream.destroy();
//     });

//     opusStream.on('data', chunk => {
//       console.log(`Received chunk of size: ${chunk.length}`);
//     });

//     ffmpeg.on('close', code => {
//       if (code === 0) {
//         console.log(`✅ Recorded ${filename}`);
//       } else {
//         console.warn(`❌ FFmpeg exited with code ${code}`);
//       }
//     });

//     ffmpeg.stderr.on('data', data => {
//       console.error(`FFmpeg Error: ${data}`);
//     });

//     ffmpeg.stdin.on('data', () => {
//       console.log('FFmpeg is receiving audio data...');
//     });

//     ffmpeg.on('error', error => {
//       console.error(`❌ FFmpeg error: ${error.message}`);
//       ffmpeg.kill();
//     });

//     pcmStream.on('end', () => {
//       ffmpeg.stdin.end();
//     });

//     pcmStream.on('data', chunk => {
//       if (chunk.length > 0) {
//         console.log(`PCM data received: ${chunk.length} bytes`);
//       }
//     });

//     setTimeout(() => {
//       if (!ffmpeg.killed) {
//         console.warn('⚠️ Timeout: FFmpeg might be waiting for stream data.');
//       }
//     }, 30000); // Timeout de 30 segundos
//   }

//   async trackGuild(guild: Guild) {
//     let guilds = trackedShards.get(guild.shardId);
//     if (!guilds) {
//       guilds = new Set();
//       trackedShards.set(guild.shardId, guilds);
//     }
//     guilds.add(guild.id);
//   }

//   async connect(
//     interaction: {
//       member: { voice: { channel: any; channelId: any } };
//       editReply: (arg0: string) => any;
//       guild: { id: any };
//     },
//     deaf = true,
//     mute = false,
//   ) {
//     const channel = interaction.member.voice.channel;

//     if (!channel) {
//       return await interaction.editReply('Você não está em um canal de voz!');
//     }

//     let voiceConnection = voiceConnections.get(interaction.guild.id);

//     if (!voiceConnection) {
//       voiceConnection = joinVoiceChannel({
//         channelId: interaction.member.voice.channelId,
//         guildId: interaction.guild.id,
//         adapterCreator: await this.createDiscordJSAdapter(channel),
//         selfDeaf: deaf,
//         selfMute: mute,
//       });
//       voiceConnections.set(interaction.guild.id, voiceConnection);

//       try {
//         await entersState(voiceConnection, VoiceConnectionStatus.Ready, 30_000);
//         console.log('Connected to voice channel');
//       } catch (error) {
//         voiceConnection.destroy();
//         voiceConnections.delete(interaction.guild.id);
//         throw error;
//       }
//     }

//     return voiceConnection;
//   }

//   async createDiscordJSAdapter(channel: VoiceBasedChannel): Promise<DiscordGatewayAdapterCreator> {
//     return methods => {
//       adapters.set(channel.guild.id, methods);
//       this.trackClient(channel.client);
//       this.trackGuild(channel.guild);
//       return {
//         sendPayload(data) {
//           if (channel.guild.shard.status === Status.Ready) {
//             channel.guild.shard.send(data);
//             return true;
//           }
//           return false;
//         },
//         destroy() {
//           return adapters.delete(channel.guild.id);
//         },
//       };
//     };
//   }

//   async play(interaction: any, audio: string, stream = false) {
//     const voiceConnection = await this.connect(interaction);
//     if (!voiceConnection) return;

//     voiceConnection.subscribe(player);

//     if (!stream) {
//       const resource = createAudioResource(audio, {
//         inputType: StreamType.Arbitrary,
//       });
//       player.play(resource);
//     } else if (stream) {
//       await this.playStream();
//     }
//     return entersState(player, AudioPlayerStatus.Playing, 5000);
//   }

//   async record(interaction: {
//     reply?: (arg0: string) => any;
//     editReply: any;
//     guild?: any;
//     user?: any;
//     member?: { voice: { channel: any; channelId: any } };
//   }) {
//     const voiceConnection = voiceConnections.get(interaction.guild.id)
//       ? voiceConnections.get(interaction.guild.id)
//       : await this.connect(interaction, false);
//     console.log(voiceConnection);
//     const receiver = voiceConnection.receiver;
//     console.log(receiver);
//     if (receiver) {
//       await this.createListeningStream(receiver, interaction);
//     } else {
//       await interaction.editReply('Algo deu errado!');
//     }
//   }

//   async disconnect(interaction: {
//     reply?: (arg0: string) => any;
//     member?: { voice: { channel: { leave: () => any } } };
//     guild?: any;
//     editReply?: any;
//   }) {
//     const voiceConnection = voiceConnections.get(interaction.guild.id);
//     if (!voiceConnection) {
//       return await interaction.editReply('Não há nenhuma conexão ativa para desconectar!');
//     }

//     try {
//       voiceConnection.destroy();
//       voiceConnections.delete(interaction.guild.id);
//       return interaction.editReply('Desconectado com sucesso!');
//     } catch (error) {
//       console.error(error);
//       return interaction.editReply('Algo deu errado ao tentar desconectar!');
//     }
//   }
// }
// const voiceService = new VoiceService();
// export { voiceService };
