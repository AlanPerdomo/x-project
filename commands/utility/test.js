const {SlashCommandBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('responds with execution data.'),
    async execute(interaction) {
        await interaction.reply(`${interaction}`);
    },
};