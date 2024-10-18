const {SlashCommandBuilder} = require('discord.js');
const { userService } = require('../services/UserService');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('cadastrarusuario')
        .setDescription('registra seu usuario no sistema do bot.')
        .addStringOption(option =>
            option.setName('email')
                .setDescription('Informe seu email')
                .setRequired(true)
        ).addStringOption(option =>
            option.setName('senha')
                .setDescription('Informe sua senha')
                .setRequired(true)
        ).addStringOption(option => 
            option.setName('confirmação')
                .setDescription('Confirme sua senha')
                .setRequired(true),
        ),
        async execute(interaction) {
            if(interaction.options.getString('confirmação') !== interaction.options.getString('senha')) {
                await interaction.reply('As senhas devem ser iguais!');
            } else {
                let data = {
                    email: interaction.options.getString('email'),
                    password: interaction.options.getString('senha'),
                    name: interaction.user.globalName,
                    discordId: interaction.user.id,
                    username: interaction.user.username,
                    type: 'user'
                }

                try {
                    await userService.cadastrar(data);
                    await interaction.reply('Cadastrado com sucesso!');
                    console.log('Cadastrado com sucesso!');
                } catch (error) {
                    await interaction.reply('Erro ao cadastrar o usuário!');
                    console.log(error);
                }
                console.log(interaction);
            }
        }
};