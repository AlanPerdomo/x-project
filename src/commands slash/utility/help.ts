import { SlashCommandBuilder } from 'discord.js';

module.exports = {
	data: new SlashCommandBuilder().setName('help').setDescription('show commands and description'),

	async execute(interaction: { reply: (arg0: { content: string; ephemeral: boolean }) => any }) {
		await interaction.reply({
			content: `**Commands:**\n
                **/help** - show commands and description\n
                **/ping** - replies with Pong!\n
                **/pong** - replies with Ping!\n
                **/server** - provides information about the server\n
                **/perola** - cadastro de perolas\n
                **/novo-usuario** - registra um email e libera uma senha para o usuário`,
			ephemeral: true,
		});
	},
};
