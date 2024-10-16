const {SlashCommandBuilder, Options} = require('discord.js');
const { userService } = require('../services/UserService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('perola')
        .setDescription('🍓Salva a Perola🍓')
        .addStringOption(option =>
            option.setName('perola')
                .setDescription('Manda as Braba')
                .setRequired(true)
        ),
    async execute(interaction) {
        let data = {
            // guildId: interaction.guildId,
            // channelId: interaction.channelId,
            name: interaction.user.username,
            discordId: interaction.user.id,
            username: interaction.user.username,
            type: 'user'

        }
        try {
            await userService.cadastrar(data);
            console.log('Cadastrado com sucesso!');
        } catch (error) {
            console.log(error);
        }
        await interaction.reply(`\n**"${interaction.options.getString('perola')}"** \n\t\t\t-REIS, Gabriel-`);
    }
}