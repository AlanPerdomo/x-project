import { ActionRowBuilder, ButtonBuilder, SlashCommandBuilder } from 'discord.js';
import { voiceService } from '../../services/VoiceService';
import { row } from '../../buttons/PlayerButtons';

module.exports = {
  data: new SlashCommandBuilder().setName('radio').setDescription('Join a voice channel and play a radio'),

  async execute(interaction: {
    reply: (arg0: { content: string; components: ActionRowBuilder<ButtonBuilder>[]; ephemeral: boolean }) => any;
    editReply: (arg0: string) => any;
  }) {
    const radios = ['https://play.ilovemusic.de/ilm_iloveradio/'];

    await interaction.reply({
      content: 'trying to connect...',
      components: [row],
      ephemeral: false,
    });

    try {
      await voiceService.play(interaction, radios[0]!, 'radio');
      return await interaction.editReply(`playing ${radios[0]}`);
    } catch (error) {
      console.error(error);
    }
  },
};
