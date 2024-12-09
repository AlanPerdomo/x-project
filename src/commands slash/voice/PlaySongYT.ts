import { ActionRowBuilder, ButtonBuilder, SlashCommandBuilder } from 'discord.js';
import { voiceService } from '../../services/VoiceService';
import { playerRow } from '../../buttons/PlayerButtons';
const YouTubeSearchApi = require('youtube-search-api');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('play-youtube')
    .setDescription('Pesquise e reproduza uma música do YouTube')
    .addStringOption(option =>
      option.setName('query').setDescription('Nome ou link da música para tocar').setRequired(true),
    ),

  async execute(interaction: {
    options: { getString: (arg0: string) => any };
    reply: (arg0: { content: string }) => any;
    editReply: (arg0: { content: string; components: never[] | ActionRowBuilder<ButtonBuilder>[] }) => any;
  }) {
    const query = interaction.options.getString('query');

    await interaction.reply({
      content: 'Pesquisando no YouTube...',
    });
    try {
      const searchResults = await YouTubeSearchApi.GetListByKeyword(query, false, 1);
      if (!searchResults || !searchResults.items.length) {
        return interaction.editReply({ content: 'Nenhuma música encontrada.', components: [] });
      }
      const video = searchResults.items[0];
      const link = `https://www.youtube.com/watch?v=${video.id}`;

      await voiceService.play(interaction, link, 'yt');
      return await interaction.editReply({ content: `Tocando: [${video.title}](${link})`, components: [playerRow] });
    } catch (error) {
      console.error(error);
      return interaction.editReply({ content: 'Algo deu errado!', components: [] });
    }
  },
};
