import { SlashCommandBuilder } from 'discord.js';
import { tcgService } from '../../services/TCGService';

module.exports = {
  data: new SlashCommandBuilder().setName('my-deck').setDescription('Exibe seu deck atual'),

  async execute(interaction: { user: { id: string }; reply: (arg0: string) => any }) {
    const deck = await tcgService.buscarDeck(interaction.user.id);
    console.log(await tcgService.buscarDeck(interaction.user.id));

    // Verifica se o usuário tem um deck
    if (!deck || deck.length === 0) {
      return interaction.reply('Você ainda não tem um deck.');
    } else {
      console.log(`\nBuscando deck de ${interaction.user.id}\n`);

      // Formata a resposta para exibir cada carta do deck
      const deckDisplay = deck
        .map((card: { name: any; quantity: any; atk: any; def: any; hp: any; description: any }) => {
          return (
            `**${card.name}** - Quantidade: ${card.quantity}\n` +
            `ATK: ${card.atk} | DEF: ${card.def} | HP: ${card.hp}\n` +
            `Habilidade: ${card.description}\n`
          );
        })
        .join('\n');

      // Envia a mensagem formatada
      return interaction.reply(`**Seu Deck:**\n\n${deckDisplay}`);
    }
  },
};
