import { ButtonBuilder, ButtonStyle, SlashCommandBuilder, ActionRowBuilder, AnyComponentBuilder } from 'discord.js';

module.exports = {
	data: new SlashCommandBuilder().setName('test-buttons').setDescription('test Buttons'),

	async execute(interaction: {
		options: { getUser: (arg0: string) => any; getString: (arg0: string) => string };
		reply: (arg0: { content: string; components: ActionRowBuilder<AnyComponentBuilder>[] }) => any;
	}) {
		const target = interaction.options.getUser('target');
		const reason = interaction.options.getString('reason') ?? 'No reason provided';

		const confirm = new ButtonBuilder().setCustomId('confirm').setLabel('Confirm Ban').setStyle(ButtonStyle.Danger);

		const cancel = new ButtonBuilder().setCustomId('cancel').setLabel('Cancel').setStyle(ButtonStyle.Secondary);

		const row = new ActionRowBuilder().addComponents(cancel, confirm);

		await interaction.reply({ content: `Are you sure you want to ban ${target} for ${reason}?`, components: [row] });
	},
};
