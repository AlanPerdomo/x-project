// needs to be fix

import { SlashCommandBuilder } from 'discord.js';
import { voiceService } from '../../services/VoiceService';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play-song')
    .setDescription('Join a voice channel and play a song')
    .addStringOption(option => option.setName('song').setDescription('The song to play').setRequired(true)),

  async execute(interaction) {
    const radios = ['https://play.ilovemusic.de/ilm_iloveradio/'];

    const song = interaction.options.getString('song');

    await interaction.reply('trying to connect...');
    try {
      await voiceService.play(interaction, song, true);
      return await interaction.editReply(`playing ${song}`);
    } catch (error) {
      console.error(error);
    }
  },
};
