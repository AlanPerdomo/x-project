import { SlashCommandBuilder } from 'discord.js';
import { voiceService } from '../../services/VoiceService';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('perola-do-dia-audio')
    .setDescription('Join a voice channel and play a perola'),

  async execute(interaction: {
    reply?: any;
    editReply?: any;
    member?: { voice: { channel: any; channelId: any } };
    guild?: { id: any };
  }) {
    const perolas = [
      'ai denuncia gekko maxista.m4a',
      'é tudo culpa minha.m4a',
      'espero que o abib não tenha gravado isso.m4a',
      'foi o audio.m4a',
      'se contenta com essa sua vida de merda.m4a',
      'um verme como esse vem falar comigo.m4a',
      'VAI PRO INFERNO.m4a',
      'vai pro show da xuxa.m4a',
      'vou te falar nada.m4a',
    ];

    const random = Math.floor(Math.random() * (perolas.length - 1));
    const audio = perolas[random];

    await interaction.reply('trying to connect...');

    try {
      await voiceService.play(interaction, `src/assets/${audio}`, 'audio');
      return await interaction.editReply(`playing ${audio}`);
    } catch (error) {
      console.log(error);
    }
  },
};
