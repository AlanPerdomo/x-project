import {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  NoSubscriberBehavior,
  VoiceConnectionStatus,
} from '@discordjs/voice';

class VoiceService {
  async joinVoice(interaction: { reply?: any; editReply?: any; member: any; guild: any }) {
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
      resource.volume.setVolume(0.5);
    }

    voiceConnection.subscribe(player);

    player.play(resource);

    let date = new Date();

    voiceConnection.on(VoiceConnectionStatus.Ready, () => {
      console.log('Voice ready');
    });

    player.on('error', error => {
      console.error(`Player error: ${error.message}`);
    });

    player.on('stateChange', (oldState, newState) => {
      console.log(`\nPlayer transitioned from ${oldState.status} to ${newState.status} \n\t${date}\n`);
    });
  }
}

const voiceService = new VoiceService();
export { voiceService };
