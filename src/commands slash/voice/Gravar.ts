import { SlashCommandBuilder } from 'discord.js';
import { voiceService } from '../../services/VoiceService';

module.exports = {
  data: new SlashCommandBuilder().setName('gravar').setDescription('Grava o canal de voz'),

  async execute(interaction: any) {
    await voiceService.record(interaction);
  },
};
