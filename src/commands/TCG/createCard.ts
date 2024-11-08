import { SlashCommandBuilder } from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder().setName('create-card').setDescription('Cria uma carta para o TCG.'),

  async execute(interaction: { reply: (arg0: string) => any }) {
    await interaction.reply('Em desenvolvimento!');
  },
};
