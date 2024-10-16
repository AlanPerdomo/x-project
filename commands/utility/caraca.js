const {SlashCommandBuilder} = require('discord.js');
const wait = require('node:timers/promises').setTimeout; 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('caraca')
        .setDescription('responds with execution data.')
        .addStringOption(option =>
            option.setName('caraca')
                .setDescription('caraca')
                .setRequired(false)
        ),
    async execute(interaction) {
        console.log(interaction.options);


        await interaction.reply('Pong!');
    },
};