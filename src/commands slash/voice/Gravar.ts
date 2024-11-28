import { SlashCommandBuilder } from 'discord.js';
import { voiceService } from '../../services/VoiceService';

module.exports = {
  data: new SlashCommandBuilder().setName('gravar').setDescription('Grava o canal de voz'),

  async execute(interaction) {
    await interaction.reply('iniciando gravação...');
    try {
      await voiceService.record(interaction);
    } catch (error) {
      return await interaction.editReply('Algo deu errado!');
    }
  },
};
