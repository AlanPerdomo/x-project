import { SlashCommandBuilder } from 'discord.js';
import { tcgService } from '../../services/TCGService';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('create-card')
    .setDescription('Cria uma carta para o TCG.')
    .addStringOption(option => option.setName('nome').setDescription('Nome da carta').setRequired(true))
    .addStringOption(option => option.setName('tipo').setDescription('Tipo da carta').setRequired(true))
    .addNumberOption(option => option.setName('atk').setDescription('Ataque da carta').setRequired(true))
    .addNumberOption(option => option.setName('def').setDescription('Defesa da carta').setRequired(true))
    .addNumberOption(option => option.setName('hp').setDescription('Vida da carta').setRequired(true))
    .addNumberOption(option =>
      option.setName('rarity').setDescription('Raridade da carta').setRequired(true).setMinValue(1).setMaxValue(5),
    )
    .addStringOption(option =>
      option.setName('special_ability').setDescription('Habilidade da carta').setRequired(true),
    ),

  async execute(interaction: { deferReply?: any; user?: any; editReply?: any; options?: any }) {
    await interaction.deferReply();
    const { options } = interaction;
    const { value: cardName } = options.get('nome');
    const { value: cardType } = options.get('tipo');
    const { value: atk } = options.get('atk');
    const { value: def } = options.get('def');
    const { value: hp } = options.get('hp');
    const { value: rarity } = options.get('rarity');
    const { value: specialAbility } = options.get('special_ability');

    const data = {
      nome: cardName,
      tipo: cardType,
      atk: atk,
      def: def,
      hp: hp,
      rarity: rarity,
      special_ability: specialAbility,
    };

    try {
      await tcgService.createCard(interaction.user.id, data);
      return await interaction.editReply(`Carta ${cardName} criada com sucesso!`);
    } catch (error) {
      console.log(error);
      return await interaction.editReply('Algo deu errado!');
    }
  },
};
