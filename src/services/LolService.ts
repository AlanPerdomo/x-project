import axios from 'axios';
import { riotAPIKey, region, LOLserver } from '../../config.json';

class LolService {
  async getSummonerPuuid(tag: string, summonerName: string) {
    try {
      const response = await axios.get(
        `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${summonerName}/${tag}?api_key=${riotAPIKey}`,
      );

      return response.data.puuid;
    } catch (error) {
      console.log(error);
    }
  }
  async getSummonerMastery(interaction: any, tag: string, summonerName: string, champions: number) {
    interaction.deferReply();
    const puuid = await this.getSummonerPuuid(tag, summonerName);
    await axios
      .get(
        `https://${LOLserver}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top?count=${champions}&api_key=${riotAPIKey}`,
      )
      .then(response => {
        interaction.editReply(response.data[0].championId.toString());
        console.log(response.data);
      })
      .catch(error => {
        interaction.editReply('Algo deu errado!');
        console.log(error);
      });
  }

  async getSummonerGame(interaction: any, puuid: string) {
    // interaction.deferReply();
    try {
      const response = await axios.get(
        `https://${LOLserver}.api.riotgames.com/lol/spectator/v5/active-games/by-summoner/${puuid}?api_key=${riotAPIKey}`,
      );
      // await interaction.editReply(response.data);
      console.log(response.data);
    } catch (error) {
      // await interaction.editReply('Algo deu errado!');
      console.log('try update API Key');
    }
  }
}

export const lolService = new LolService();
module.exports = { lolService };
