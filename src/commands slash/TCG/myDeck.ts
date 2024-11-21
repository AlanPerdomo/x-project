import { SlashCommandBuilder, userMention } from 'discord.js';
import { tcgService } from '../../services/TCGService';

module.exports = {
  // cooldown: 60,
  data: new SlashCommandBuilder().setName('my-deck').setDescription('Exibe seu deck atual'),

  async execute(interaction: {
    user: {
      globalName: string;
      id: string;
    };
    reply: (arg0: string) => any;
  }) {
    const user = userMention(interaction.user.id);
    const deck = await tcgService.buscarDeck(interaction.user.id);

    if (!deck || deck.length === 0) {
      return interaction.reply('Você ainda não tem um deck.');
    } else {
      const deckDisplay = deck
        .sort((a: { card: { nome: string } }, b: { card: { nome: any } }) => a.card.nome.localeCompare(b.card.nome))
        .map((card: { card: { nome: any; atk: any; def: any; hp: any; special_ability: any }; quantity: any }) => {
          return `Qtd: ${card.quantity} - **${card.card.nome}**`;
        })
        .join('\n');

      return interaction.reply(`**${user}, este é seu Deck:**\n\n${deckDisplay}`);
    }
  },
};
