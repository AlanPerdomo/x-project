import axios from 'axios';
import { riotAPIKey, region, LOLserver } from '../../config.json';

class LolService {
  endpoints = {
    summonerByName: (region: any, summonerName: any, tag: any) =>
      `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${summonerName}/${tag}`,
    masteryByPuuid: (LOLserver: any, puuid: any, count: any) =>
      `https://${LOLserver}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top?count=${count}`,
    activeGameBySummoner: (LOLserver: any, puuid: any) =>
      `https://${LOLserver}.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${puuid}`,
    matchHistory: (LOLserver: any, puuid: any, count: any) =>
      `https://${LOLserver}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=${count}`,
    matchDetails: (LOLserver: any, matchId: any) =>
      `https://${LOLserver}.api.riotgames.com/lol/match/v5/matches/${matchId}`,
  };

  async fetchFromRiotAPI(url: string) {
    try {
      const response = await axios.get(`${url}?api_key=${riotAPIKey}`);
      return response.data;
    } catch (error) {
      console.error('Erro na chamada da API:', error.response?.data || error.message);
      throw error;
    }
  }

  async getSummonerPuuid(tag: any, summonerName: any) {
    try {
      const url = this.endpoints.summonerByName(region, summonerName, tag);
      const data = await this.fetchFromRiotAPI(url);
      return data.puuid;
    } catch (error) {
      console.error('Erro ao buscar PUUID:', error);
      return null;
    }
  }

  async getSummonerMastery(
    interaction: { deferReply: () => any; editReply: (arg0: string) => any },
    tag: any,
    summonerName: any,
    champions: any,
  ) {
    try {
      await interaction.deferReply();
      const puuid = await this.getSummonerPuuid(tag, summonerName);
      if (!puuid) {
        return await interaction.editReply('PUUID não encontrado.');
      }

      const url = this.endpoints.masteryByPuuid(LOLserver, puuid, champions);
      const data = await this.fetchFromRiotAPI(url);
      const topChampion = data[0]?.championId;

      if (topChampion) {
        await interaction.editReply(`ID do campeão com maior maestria: ${topChampion}`);
      } else {
        await interaction.editReply('Nenhuma maestria encontrada.');
      }
    } catch (error) {
      console.error('Erro ao buscar maestria:', error);
      await interaction.editReply('Algo deu errado ao buscar a maestria.');
    }
  }

  async getActiveGameDetails(
    interaction: { deferReply: () => any; editReply: (arg0: string) => any },
    summonerName: any,
    tag: any,
  ) {
    try {
      await interaction.deferReply();
      const puuid = await this.getSummonerPuuid(tag, summonerName);
      if (!puuid) {
        return await interaction.editReply('PUUID não encontrado.');
      }

      const url = this.endpoints.activeGameBySummoner(LOLserver, puuid);
      const data = await this.fetchFromRiotAPI(url);

      const participants = data.participants
        .map(
          (p: { summonerName: any; championId: any; teamId: any }) =>
            `Nome: ${p.summonerName}, Campeão: ${p.championId}, Time: ${p.teamId}`,
        )
        .join('\n');

      await interaction.editReply(`Partida ao vivo:\n${participants}`);
    } catch (error) {
      console.error('Erro ao buscar detalhes da partida ao vivo:', error);
      await interaction.editReply('Não foi possível buscar os detalhes da partida ao vivo.');
    }
  }

  async getMatchHistory(
    interaction: { deferReply: () => any; editReply: (arg0: string) => any },
    summonerName: any,
    tag: any,
    count = 5,
  ) {
    try {
      await interaction.deferReply();
      const puuid = await this.getSummonerPuuid(tag, summonerName);
      if (!puuid) {
        return await interaction.editReply('PUUID não encontrado.');
      }

      const urlHistory = this.endpoints.matchHistory(LOLserver, puuid, count);
      const matchIds = await this.fetchFromRiotAPI(urlHistory);

      const matches = await Promise.all(
        matchIds.map(async (matchId: any) => {
          const urlDetails = this.endpoints.matchDetails(LOLserver, matchId);
          return await this.fetchFromRiotAPI(urlDetails);
        }),
      );

      const matchSummaries = matches
        .map(match => `Jogo: ${match.metadata.matchId}, Modo: ${match.info.gameMode}`)
        .join('\n');

      await interaction.editReply(`Histórico de partidas:\n${matchSummaries}`);
    } catch (error) {
      console.error('Erro ao buscar histórico de partidas:', error);
      await interaction.editReply('Não foi possível buscar o histórico de partidas.');
    }
  }
}

export const lolService = new LolService();
