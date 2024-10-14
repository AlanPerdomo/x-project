const {SlashCommandBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('perola')
        .setDescription('Replies with Perola!!!')
        .addStringOption(option =>
            option.setName('perola')
                .setDescription('Perola asdf')
        )
        .addStringOption(option =>
            option.setName('perola2')
                .setDescription('Perola casinhas')
        ),

    async execute(interaction) {
        await interaction.reply('Perola!');
    },
}