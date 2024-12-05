import { ActionRowBuilder, ButtonBuilder, SlashCommandBuilder } from 'discord.js';
import { voiceService } from '../../services/VoiceService';
import { row } from '../../buttons/PlayerButtons';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play-youtube')
    .setDescription('Pesquise e reproduza uma música do YouTube')
    .addStringOption(option =>
      option.setName('query').setDescription('Nome ou link da música para tocar').setRequired(true),
    ),

  async execute(interaction: {
    options: { getString: (arg0: string) => any };
    reply: (arg0: { content: string; components: ActionRowBuilder<ButtonBuilder>[]; ephemeral: boolean }) => any;
  }) {
    const query = interaction.options.getString('query');

    await interaction.reply({
      content: 'Pesquisando no YouTube...',
      components: [row],
      ephemeral: false,
    });

    try {
      await voiceService.play(interaction, query, 'yt');
    } catch (error) {
      console.error(error);
    }
  },
};
