import { SlashCommandBuilder } from 'discord.js';
import { tcgService } from '../../services/TCGService';

module.exports = {
  data: new SlashCommandBuilder().setName('get-card-to-deck').setDescription('Adiciona uma carta ao seu deck'),

  async execute(interaction: { user: { id: string }; reply: (arg0: string) => any }) {
    try {
      const card = await tcgService.addCardToDeck(interaction.user.id);
      await interaction.reply(
        `**\nCarta adicionada ao deck:**\n\n **${card.nome}** - Raridade: ${card.rarity}\n ATK: ${card.atk} | DEF: ${card.def} | HP: ${card.hp}\n Habilidade: ${card.special_ability}\n`,
      );
    } catch (error) {
      console.log(error);
      await interaction.reply('Algo deu errado!');
    }
  },
};
