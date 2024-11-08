import axios from 'axios';

const { apiUrl, botServiceToken } = require('../../config.json');

class TcgService {
  async buscarDeck(data: any) {
    data = data + botServiceToken;
    try {
      return await axios({
        url: `${apiUrl}/token/mytoken`,
        method: 'post',
        data: data.toJSON(),
        timeout: 5000,
        headers: { Accept: 'application/json' },
      })
        .then(response => {
          return Promise.resolve(response.data);
        })
        .catch(error => {
          return Promise.reject(error);
        });
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export const tcgService = new TcgService();
module.exports = { tcgService };
