import axios from 'axios';

const { apiUrl, botServiceToken } = require('../../config.json');

class TcgService {
  async buscarDeck(userId: string) {
    const token = (await getUserToken(userId)).access_token;

    return await axios({
      url: `${apiUrl}/tcg/decks/my-deck`,
      method: 'get',
      timeout: 5000,
      headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
    })
      .then(response => {
        return Promise.resolve(response.data.result);
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  async buscarCartas(cardId: string) {
    return await axios({
      url: `${apiUrl}/tcg/cards/card/${cardId}`,
      method: 'get',
      timeout: 5000,
      headers: { Accept: 'application/json' },
    })
      .then(response => {
        return Promise.resolve(response.data.result);
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }
}

async function getUserToken(userId: string) {
  return await axios({
    url: `${apiUrl}/token/get-user-token`,
    method: 'post',
    timeout: 5000,
    headers: { Accept: 'application/json' },
    data: {
      hash: botServiceToken,
      discordId: userId,
    },
  })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      return error;
    });
}

export const tcgService = new TcgService();
module.exports = { tcgService };
