import { SlashCommandBuilder } from 'discord.js';
module.exports = {
  data: new SlashCommandBuilder()
    .setName('delete-messages')
    .setDescription('Deleta as mensagens do canal')
    .addChannelOption(option =>
      option.setName('channel').setDescription('O canal de texto onde deseja deletar as mensagens').setRequired(true),
    ),
  async execute(interaction: { options: { getChannel: (arg0: string) => any }; reply: (arg0: string) => any }) {
    const channel = interaction.options.getChannel('channel');
    if (!channel.isTextBased()) {
      return interaction.reply('Por favor, escolha um canal de texto.');
    }

    if (channel.name === 'heimer-bot-test') {
      try {
        // Buscar mensagens no canal.
        const messages = await channel.messages.fetch({ limit: 100 });
        const messagesToDelete = messages.filter(
          (msg: { createdTimestamp: number }) => Date.now() - msg.createdTimestamp < 14 * 24 * 60 * 60 * 1000, // Menos de 14 dias
        );

        if (messagesToDelete.size === 0) {
          return interaction.reply('Neh, nenhuma mensagem para deletar.');
        }

        // Deletar mensagens em massa.
        await channel.bulkDelete(messagesToDelete);

        await interaction.reply(` ${messagesToDelete.size} mensagem(s) deletada(s).`);
      } catch (error) {
        console.error(error);
        await interaction.reply('Houve um erro ao deletar as mensagens.');
      }
    } else {
      await interaction.reply('Você so pode deletar mensagens no "heimer-bot-test".');
    }
  },
};
