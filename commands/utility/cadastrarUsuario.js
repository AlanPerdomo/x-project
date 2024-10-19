const {SlashCommandBuilder} = require('discord.js');
const { userService } = require('../services/UserService');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('cadastrarusuario')
        .setDescription('Vincula o seu email ao seu usuario do discord no Heimer-bot.')
        .addStringOption(option =>
            option.setName('email')
                .setDescription('Informe seu email')
                .setRequired(true)
        ),
    async execute(interaction) {
        let data = {
            email: interaction.options.getString('email'),
            name: interaction.user.globalName,
            discordId: interaction.user.id || "",
            username: interaction.user.username,
            type: 'user'
        };

        console.log(data);

        try {
            await userService.cadastrar(data).then(result => {
                return interaction.reply(result.message);
            });
        } catch (error) {
            return interaction.reply(error.message);
        }
    }
};

