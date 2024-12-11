import axios from 'axios';
import { riotAPIKey, region } from '../../config.json';

class LolService {
  async getSummonerData(summonerName: string) {
    // console.log('region', region);
    // console.log('riotAPIKey', riotAPIKey);
    // console.log('summonerName', summonerName);
    // console.log(encodeURIComponent(summonerName));
    try {
      const response = await axios.get(
        `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(summonerName)}`,
        { headers: { 'X-Riot-Token': riotAPIKey } },
      );

      //   console.log('Dados do Invocador:', response.data);
      return response.data;
    } catch (error) {
      //   console.error('Erro:', error);
    }
  }
}

export const lolService = new LolService();
module.exports = { lolService };
