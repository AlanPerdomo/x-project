import axios from 'axios';
import { riotAPIKey, region } from '../../config.json';

class LolService {
  async getSummonerData(interaction: any, tag: string, summonerName: string) {
    interaction.deferReply();
    try {
      const response = await axios.get(
        `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${summonerName}/${tag}?api_key=${riotAPIKey}`,
      );

      await interaction.editReply(`${response.data}`);
      console.log(response.data);
    } catch (error) {
      await interaction.editReply('Algo deu errado!');
      console.log('try update API Key');
    }
  }
}

export const lolService = new LolService();
module.exports = { lolService };
