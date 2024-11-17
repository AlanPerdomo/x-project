import axios from 'axios';
import { apiUrl } from '../../config.json';
import fs from 'fs';

class PerolaService {
  async cadastrar(data: any) {
    return await axios({
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
    return await axios({
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

  async PerolaImageUrl() {
    const filePath = 'src/assets/private_assets/gabriel.txt';
    const content = fs.readFileSync(filePath, 'utf-8');
    const strings = content.split(',');
    const randomIndex = Math.floor(Math.random() * strings.length);
    const randomString = strings[randomIndex];
    return randomString;
  }
}

export const perolaService = new PerolaService();
module.exports = { perolaService };
