const {SlashCommandBuilder, Options} = require('discord.js');
const { perolaService } = require('../services/PerolaService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('perola')
        .setDescription('🍓Salva a Perola🍓')
        .addStringOption(option =>
            option.setName('perola')
                .setDescription('Manda a Braba')
                .setRequired(true)
        ),
    async execute(interaction) {
        let data = {
            perola : interaction.options.getString('perola'),
            userId : interaction.user.id,
            guildId : interaction.guildId,
            channelId : interaction.channelId,
            date : interaction.createdTimestamp,
            username: interaction.user.username,
            name: interaction.user.globalName   
        }
        try {
            await perolaService.cadastrar(data);
            await interaction.reply(`\n**"${interaction.options.getString('perola')}"** \n\t\t\t-REIS, Gabriel-`);
        } catch (error) {
            console.log(error);
            await interaction.reply('Algo deu errado!');
        }
    }
}