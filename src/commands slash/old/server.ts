import { SlashCommandBuilder } from 'discord.js';

module.exports = {
	data: new SlashCommandBuilder().setName('server').setDescription('Provides information about the server.'),
	async execute(interaction: { reply: (arg0: string) => any; guild: { name: any; memberCount: any } }) {
		if (interaction.guild) {
			await interaction.reply(
				`This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`,
			);
		} else {
			await interaction.reply('This command can only be used in a server.');
		}
	},
};
