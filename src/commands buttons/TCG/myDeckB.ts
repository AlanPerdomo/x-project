import { ButtonInteraction, userMention } from 'discord.js';
import { tcgService } from '../../services/TCGService';

module.exports = {
  // cooldown: 60,
  customId: 'my-deck',
  async execute(interaction: ButtonInteraction) {
    const user = userMention(interaction.user.id);
    const deck = await tcgService.buscarDeck(interaction.user.id);

    if (!deck || deck.length === 0) {
      return interaction.update({ content: 'Você ainda não tem um deck.' });
    } else {
      const deckDisplay = deck
        .sort((a: { card: { nome: string } }, b: { card: { nome: any } }) => a.card.nome.localeCompare(b.card.nome))
        .map((card: { quantity: any; card: { nome: any } }) => `Qtd: ${card.quantity} - **${card.card.nome}**`)
        .join('\n');

      return interaction.update({ content: `**${user}, este é seu Deck:**\n\n${deckDisplay}`, components: [] });
    }
  },
};
