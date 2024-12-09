import { ButtonInteraction, userMention } from 'discord.js';
import { tcgService } from '../../services/TCGService';

function getRandomColor() {
  return Math.floor(Math.random() * 0xffffff);
}

module.exports = {
  cooldown: 60,
  customId: 'get-card-to-deck',

  async execute(interaction: ButtonInteraction) {
    const user = userMention(interaction.user.id);
    const card = await tcgService.addCardToDeck(interaction.user.id);
    const cardDisplay = {
      color: getRandomColor(),
      title: `Nova Carta Adicionada ao Seu Deck!`,
      description: `**${user}**, uma nova carta foi adicionada ao seu deck! Confira agora e fortaleça suas estratégias.`,

      thumbnail: {
        url: `https://ddragon.leagueoflegends.com/cdn/14.23.1/img/champion/${card.nome}.png`,
      },
      fields: [
        {
          name: `${card.nome}`,
          value: `Raridade: ${card.rarity}\n ATK: ${card.atk} | DEF: ${card.def} | HP: ${card.hp}\n Habilidade: ${card.special_ability}\n`,
        },
      ],
    };

    return interaction.update({ embeds: [cardDisplay], components: [] });
  },
};
