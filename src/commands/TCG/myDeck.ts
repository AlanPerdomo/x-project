import { SlashCommandBuilder } from 'discord.js';
import { tcgService } from '../../services/TCGService';

module.exports = {
  data: new SlashCommandBuilder().setName('my-deck').setDescription('Cria uma carta de treino'),

  async execute(interaction: { user: { id: any }; reply: (arg0: string) => any }) {
    const deck = await tcgService.buscarDeck(interaction.user);
    await interaction.reply('\n deck:' + deck);
  },
};
