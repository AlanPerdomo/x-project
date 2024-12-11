import axios from 'axios';
import { apiUrl, botServiceToken } from '../../config.json';

class UserService {
  async cadastrar(data: { email: any; name: any; discordId: any; username: any; password: string; type: string }) {
    return axios({
      url: `${apiUrl}/user/cadastrar`,
      method: 'post',
      data: data,
      timeout: 5000,
      headers: { Accept: 'application/json' },
    })
      .then((response: { data: any }) => {
        return Promise.resolve(response.data);
      })
      .catch((error: any) => {
        return Promise.reject(error);
      });
  }

  async login(data: { email: string; password: string }) {
    return axios({
      url: `${apiUrl}/user/login`,
      method: 'post',
      data: data,
      timeout: 5000,
      headers: { Accept: 'application/json' },
    })
      .then((response: { data: any }) => {
        return Promise.resolve(response.data);
      })
      .catch((error: any) => {
        return Promise.reject(error);
      });
  }

  async getUserToken(userId: string) {
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
}

const userService = new UserService();

export { userService };
