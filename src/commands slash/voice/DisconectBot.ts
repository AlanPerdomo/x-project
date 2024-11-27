import { SlashCommandBuilder } from 'discord.js';
import { voiceService } from '../../services/VoiceService';

module.exports = {
  data: new SlashCommandBuilder().setName('disconect-bot').setDescription('Desconecta o bot do canal de voz'),

  async execute(interaction: { reply: (arg0: string) => any; member: { voice: { channel: { leave: () => any } } } }) {
    await interaction.reply('Desconectando o bot...');
    await voiceService.disconnect(interaction);
  },
};
