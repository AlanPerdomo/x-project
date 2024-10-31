const axios = require('axios');
const { apiUrl } = require('../../config.json');

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
}

const userService = new UserService();

export { userService };
