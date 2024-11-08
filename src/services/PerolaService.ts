import axios from 'axios';
const { apiUrl } = require('../../config.json');

class PerolaService {
  async cadastrar(data: any) {
    return axios({
      url: `${apiUrl}/perolas/cadastrar`,
      method: 'post',
      data: data,
      timeout: 5000,
      headers: { Accept: 'application/json' },
    })
      .then(response => {
        return Promise.resolve(response.data);
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  async sorte() {
    return axios({
      url: `${apiUrl}/perolas/sorte`,
      method: 'get',
      timeout: 5000,
      headers: { Accept: 'application/json' },
    })
      .then(response => {
        return Promise.resolve(response.data);
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }
}

export const perolaService = new PerolaService();
module.exports = { perolaService };
