import { SlashCommandBuilder } from 'discord.js';
import { voiceService } from '../../services/VoiceService';

module.exports = {
  data: new SlashCommandBuilder().setName('join-voice-channel').setDescription('Join a voice channel'),

  async execute(interaction) {
    await interaction.reply('trying to connect...');
    await voiceService.joinVoice(interaction);
    return await interaction.editReply('Joined voice channel');
  },
};
