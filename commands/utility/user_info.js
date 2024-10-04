const {SlashCommandBuilder} = require('discord.js');
const { execute } = require('./ping');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user-info')
        .setDescription('Replies with user info!'),
        
        async execute(interaction) {
            await interaction.reply(`This command was run by ${interaction.user.username},who joined on ${interaction.user.createdAt}.`);
    },
};