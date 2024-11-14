import {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  NoSubscriberBehavior,
  AudioPlayerStatus,
  VoiceConnectionStatus,
} from '@discordjs/voice';

class VoiceService {
  async joinVoice(interaction) {
    const voiceConnection = joinVoiceChannel({
      channelId: interaction.member.voice.channelId,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
      selfDeaf: false,
      selfMute: false,
    });

    const player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Play,
        maxMissedFrames: Math.round(5000 / 20),
      },
    });
    let resource = createAudioResource('src/assets/767624__looplicator__short-track-1300-industraumatic.mp3', {
      inlineVolume: true,
    });
    if (resource.volume) {
      resource.volume.setVolume(0.8);
    }

    player.play(resource);
    voiceConnection.on(VoiceConnectionStatus.Ready, () => {
      console.log('Voice ready');
    });

    player.on('error', error => {
      console.error(`Player error: ${error.message}`);
    });

    player.on(AudioPlayerStatus.Idle, () => {
      console.log('Idle ' + new Date());
    });

    player.on(AudioPlayerStatus.Buffering, () => {
      console.log('Buffering ' + new Date());
    });

    player.on(AudioPlayerStatus.Playing, () => {
      console.log('Playing ' + new Date());
    });

    player.on(AudioPlayerStatus.AutoPaused, () => {
      console.log('AutoPaused ' + new Date());
    });

    player.on(AudioPlayerStatus.Paused, () => {
      console.log('Paused ' + new Date());
    });

    voiceConnection.on('stateChange', (oldState, newState) => {
      console.log(`Connection transitioned from ${oldState.status} to ${newState.status}`);
    });
  }
}

const voiceService = new VoiceService();
export { voiceService };
