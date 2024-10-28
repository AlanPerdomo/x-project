const axios = require('axios');
const { apiUrl } = require('../config.json');


class UserService {
    async cadastrar(data){
        return axios({
            url: `${apiUrl}/user/cadastrar`,
            method: 'post',
            data: data,
            timeout: 5000,
            headers:{Accept: 'application/json'}
        }).then((response) => {
            return Promise.resolve(response.data);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
    }
}

const userService = new UserService();

module.exports = { userService }