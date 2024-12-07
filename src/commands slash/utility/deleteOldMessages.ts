import { SlashCommandBuilder } from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('delete-old-messages')
    .setDescription('Deleta todas as messagens com mais de 14 dias')
    .addChannelOption(option =>
      option.setName('channel').setDescription('The channel to delete messages from').setRequired(true),
    ),
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');

    if (!channel.isTextBased()) {
      return interaction.reply('Por favor, escolha um canal de texto.');
    }

    if (channel.name === 'heimer-bot-test') {
      try {
        await interaction.reply('Deletando todas as mensagens...');

        let lastMessageId = null;

        while (true) {
          const messages = await channel.messages.fetch({
            limit: 50,
            ...(lastMessageId && { before: lastMessageId }),
          });

          const oldMessages = messages.filter(
            (msg: { createdTimestamp: number }) => Date.now() - msg.createdTimestamp > 14 * 24 * 60 * 60 * 1000,
          );

          if (oldMessages.size === 0) {
            break;
          }

          for (const msg of oldMessages.values()) {
            console.log(`Deletando mensagem: ${msg.id} + ${messages.size}`);
            await msg.delete();
          }

          lastMessageId = messages.last()?.id;

          if (messages.size < 50) break;
        }

        await interaction.editReply('Todas as mensagens antigas foram deletadas.');
      } catch (error) {
        console.error(error);
        await interaction.editReply('Houve um erro ao deletar as mensagens.');
      }
    } else {
      await interaction.reply('Você so pode deletar mensagens no "heimer-bot-test".');
    }
  },
};
