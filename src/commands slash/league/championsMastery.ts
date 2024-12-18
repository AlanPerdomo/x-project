import { SlashCommandBuilder } from 'discord.js';
import { lolService } from '../../services/LolService';

module.exports = {
  cooldown: 60,
  data: new SlashCommandBuilder()
    .setName('champions-mastery')
    .setDescription('Exibe informações sobre o Champions Mastery')
    .addStringOption(option =>
      option.setName('summoner-name').setDescription('Informe o nome do invocador.').setRequired(true),
    )
    .addStringOption(option => option.setName('tag').setDescription('Informe a regiao').setRequired(true))
    .addNumberOption(option =>
      option
        .setName('number-of-champions')
        .setDescription('Number de champions retornados, padrao é 3.')
        .setRequired(false),
    ),

  async execute(interaction: any) {
    const summonerName = interaction.options.getString('summoner-name');
    const tag = interaction.options.getString('tag');
    const champions = interaction.options.getNumber('number-of-champions') || 3;
    await lolService.getSummonerMastery(interaction, tag, summonerName, champions);
  },
};
