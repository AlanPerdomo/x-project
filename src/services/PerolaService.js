const axios = require('axios');
const { apiUrl } = require('../../config.json');

class PerolaService {
    async cadastrar(data){
        return axios({
            url: `${apiUrl}/perolas/cadastrar`,
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

const perolaService = new PerolaService();
module.exports = { perolaService }