import { ButtonInteraction, userMention } from 'discord.js';
import { tcgService } from '../../services/TCGService';

module.exports = {
  customId: 'my-deck', // Identificador único do botão
  async execute(interaction: ButtonInteraction) {
    const user = userMention(interaction.user.id);
    const deck = await tcgService.buscarDeck(interaction.user.id);

    if (!deck || deck.length === 0) {
      return interaction.reply({ content: 'Você ainda não tem um deck.', ephemeral: true });
    } else {
      const deckDisplay = deck
        .sort((a: { card: { nome: string } }, b: { card: { nome: any } }) => a.card.nome.localeCompare(b.card.nome))
        .map((card: { quantity: any; card: { nome: any } }) => `Qtd: ${card.quantity} - **${card.card.nome}**`)
        .join('\n');

      return interaction.reply({ content: `**${user}, este é seu Deck:**\n\n${deckDisplay}`, ephemeral: true });
    }
  },
};
