import { SlashCommandBuilder } from 'discord.js';
import { lolService } from '../../services/LolService';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('summoner-data')
    .setDescription('Exibe informações sobre o summoner')
    .addStringOption(option => option.setName('summoner-name').setDescription('Informe o summoner').setRequired(true)),
  async execute(interaction: {
    deferReply: () => any;
    options: { getString: (arg0: string) => any };
    editReply: (arg0: any) => any;
  }) {
    await interaction.deferReply();
    const summonerName = interaction.options.getString('summoner-name');
    const response = await lolService.getSummonerData(summonerName);
    console.log(response);
    await interaction.editReply(response.data);
  },
};
