import { SlashCommandBuilder } from 'discord.js';
module.exports = {
  data: new SlashCommandBuilder()
    .setName('delete-messages')
    .setDescription('Delete messages in a channel')
    .addChannelOption(option =>
      option.setName('channel').setDescription('The channel to delete messages from').setRequired(true),
    ),
  async execute(interaction: { options: { getChannel: (arg0: string) => any }; reply: (arg0: string) => any }) {
    const channel = interaction.options.getChannel('channel');
    if (!channel.isTextBased()) {
      return interaction.reply('Please select a valid text channel.');
    }

    if (channel.name === 'heimer-bot-test') {
      try {
        // Buscar mensagens no canal.
        const messages = await channel.messages.fetch({ limit: 100 });
        const messagesToDelete = messages.filter(
          (msg: { createdTimestamp: number }) => Date.now() - msg.createdTimestamp < 14 * 24 * 60 * 60 * 1000, // Menos de 14 dias
        );

        if (messagesToDelete.size === 0) {
          return interaction.reply('No messages to delete within the last 14 days.');
        }

        // Deletar mensagens em massa.
        await channel.bulkDelete(messagesToDelete);

        await interaction.reply(`Deleted ${messagesToDelete.size} messages from the channel.`);
      } catch (error) {
        console.error(error);
        await interaction.reply('There was an error trying to delete messages.');
      }
    } else {
      await interaction.reply('You can only delete messages in the "heimer-bot-test" channel.');
    }
  },
};
