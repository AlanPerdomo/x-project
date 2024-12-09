import { SlashCommandBuilder } from 'discord.js';
import { lolService } from '../../services/LolService';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('summoner-data')
    .setDescription('Exibe informações sobre o summoner')
    .addStringOption(option => option.setName('summoner-name').setDescription('Informe o summoner').setRequired(true)),
  async execute(interaction) {
    const summonerName = interaction.options.getString('summoner-name');
    await interaction.deferReply();
    const response = await lolService.getSummonerData(summonerName);
    // console.log(response);
    await interaction.reply(response);
  },
};
