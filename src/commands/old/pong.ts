import { SlashCommandBuilder } from 'discord.js';

module.exports = {
	data: new SlashCommandBuilder().setName('pong').setDescription('Replies with Ping!'),
	async execute(interaction: { reply: (arg0: string) => any }) {
		await interaction.reply('Ping ling!');
	},
};
