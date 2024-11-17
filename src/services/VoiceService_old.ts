import {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  NoSubscriberBehavior,
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

    const perolas = [
      'src/assets/ai denuncia gekko maxista.m4a',
      'src/assets/é tudo culpa minha.m4a',
      'src/assets/espero que o abib não tenha gravado isso.m4a',
      'src/assets/foi o audio.m4a',
      'src/assets/se contenta com essa sua vida de merda.m4a',
      'src/assets/um verme como esse vem falar comigo.m4a',
      'src/assets/VAI PRO INFERNO.m4a',
      'src/assets/vai pro show da xuxa.m4a',
      'src/assets/vou te falar nada.m4a',
    ];

    console.log(perolas.length);

    const random = Math.floor(Math.random() * perolas.length - 1);
    console.log(random);
    const audio = perolas[random];
    console.log(audio);

    let resource = createAudioResource(`${audio}`, {
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
