import { SlashCommandBuilder } from 'discord.js';
// import { voiceService } from '../../services/VoiceService';

module.exports = {
  data: new SlashCommandBuilder().setName('gravar').setDescription('Grava o canal de voz'),

  async execute(interaction: { reply: (arg0: string) => any; editReply: (arg0: string) => any }) {
    await interaction.reply('iniciando gravação...');
    try {
      // await voiceService.record(interaction);
    } catch (error) {
      return await interaction.editReply('Algo deu errado!');
    }
  },
};
