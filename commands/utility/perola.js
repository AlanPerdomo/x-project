const {SlashCommandBuilder} = require('discord.js');

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
        console.log(interaction.options);
        await interaction.reply(`${interaction.options.getString('perola')}`);
    },
}