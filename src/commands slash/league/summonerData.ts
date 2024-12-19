import { SlashCommandBuilder } from 'discord.js';
import { lolService } from '../../services/LolService';

module.exports = {
  cooldown: 60,
  data: new SlashCommandBuilder()
    .setName('summoner-data')
    .setDescription('Exibe informações sobre o summoner')
    .addStringOption(option => option.setName('summoner-name').setDescription('Informe o summoner').setRequired(true))
    .addStringOption(option => option.setName('tag').setDescription('Informe a tag').setRequired(true)),
  async execute(interaction: any) {
    const tag = interaction.options.getString('tag');
    const summonerName = interaction.options.getString('summoner-name');
    await lolService.getMatchHistory(interaction, summonerName, tag);
  },
};
