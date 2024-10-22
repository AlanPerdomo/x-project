const {SlashCommandBuilder} = require('discord.js');
const { userService } = require('../services/UserService');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('novo-usuario')
        .setDescription('Registra um email e libera uma senha para o usuário')
        .addStringOption(option =>
            option.setName('email')
                .setDescription('Informe seu email')
                .setRequired(true)
        ),
    async execute(interaction) {

        password = Math.random().toString(36).slice(-8);

        let data = {
            email: interaction.options.getString('email'),
            name: interaction.user.globalName,
            discordId: interaction.user.id,
            username: interaction.user.username,
            password: password,
            type: 'user'
        };

        // console.log(data);

        try {
            await userService.cadastrar(data).then(result => {
                if(result.status == true) {
                    return interaction.reply( { content: result.message + "\n Sua senha é: " + password , ephemeral: true });
                } else {
                    return interaction.reply(result.message);
                }
            });
        } catch (error) {
            console.log(error);
        }
    }
}
