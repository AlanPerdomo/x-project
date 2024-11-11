import { SlashCommandBuilder } from 'discord.js';
import { tcgService } from '../../services/TCGService';

module.exports = {
  data: new SlashCommandBuilder().setName('my-deck').setDescription('Exibe seu deck atual'),

  async execute(interaction: { user: { id: string }; reply: (arg0: string) => any }) {
    const deck = await tcgService.buscarDeck(interaction.user.id);

    if (!deck || deck.length === 0) {
      return interaction.reply('Você ainda não tem um deck.');
    } else {
      const deckDisplay = deck
        .map((card: { card: { nome: any; atk: any; def: any; hp: any; special_ability: any }; quantity: any }) => {
          return (
            `**${card.card.nome}** - Quantidade: ${card.quantity}\n` +
            `ATK: ${card.card.atk} | DEF: ${card.card.def} | HP: ${card.card.hp}\n` +
            `Habilidade: ${card.card.special_ability}\n`
          );
        })
        .join('\n');

      return interaction.reply(`**Seu Deck:**\n\n${deckDisplay}`);
    }
  },
};
