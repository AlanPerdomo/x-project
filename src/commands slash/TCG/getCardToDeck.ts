import { SlashCommandBuilder, userMention } from 'discord.js';
import { tcgService } from '../../services/TCGService';

function getRandomColor() {
  return Math.floor(Math.random() * 0xffffff);
}

module.exports = {
  cooldown: 60,
  data: new SlashCommandBuilder().setName('get-card-to-deck').setDescription('Adiciona uma carta ao seu deck'),

  async execute(interaction: {
    user: { id: string };
    reply: (arg0: {
      embeds: {
        color: number;
        title: string;
        description: string;
        thumbnail: { url: string };
        fields: { name: string; value: string }[];
      }[];
    }) => any;
  }) {
    const user = userMention(interaction.user.id);
    const card = await tcgService.addCardToDeck(interaction.user.id);
    const cardDisplay = {
      color: getRandomColor(),
      title: `Nova Carta Adicionada ao Seu Deck!`,
      description: `**${user}**, uma nova carta foi adicionada ao seu deck! Confira agora e fortaleça suas estratégias.`,

      thumbnail: {
        url: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${card.nome}_0.jpg`,
      },
      fields: [
        {
          name: `${card.nome}`,
          value: `Raridade: ${card.rarity}\n ATK: ${card.atk} | DEF: ${card.def} | HP: ${card.hp}\n Habilidade: ${card.special_ability}\n`,
        },
      ],
    };

    return interaction.reply({ embeds: [cardDisplay] });
  },
};
