const axios = require('axios');


class UserService {
    async cadastrar(data){
        return axios({
            url: 'http://localhost:3000/user/cadastrar',
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