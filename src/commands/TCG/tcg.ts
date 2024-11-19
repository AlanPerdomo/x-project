import { ActionRowBuilder, AnyComponentBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } from 'discord.js';

module.exports = {
  cooldowns: new Map(),
  data: new SlashCommandBuilder().setName('tcg').setDescription('Exibe informações sobre o TCG'),

  async execute(interaction) {
    const myDeck = new ButtonBuilder()
      .setCustomId('my-deck')
      .setLabel('Meu Deck')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('👤');

    const getCardToDeck = new ButtonBuilder()
      .setCustomId('get-card-to-deck')
      .setLabel('Adicionar Carta ao Deck')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('🃏');

    const site = new ButtonBuilder()
      .setLabel('Site')
      .setURL('https://www.google.com')
      .setStyle(ButtonStyle.Link)
      .setEmoji('🌐')
      .setDisabled(true);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(myDeck, getCardToDeck, site);

    const response = await interaction.reply({
      content: 'Bem-vindo ao TCG!',
      components: [row],
      ephemeral: false,
    });

    const collectorFilter = i => i.user.id === interaction.user.id;

    try {
      const selectedOption = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
      console.log(selectedOption.customId === 'my-deck');

      if (selectedOption.customId === 'my-deck') {
        try {
          const command = interaction.client.commands.get(interaction.commandName);

          await selectedOption.update({ content: 'Meu Deck', components: [], ephemeral: false });
        } catch (error) {
          await interaction.Reply({ content: 'Erro ao executar o comando Meu Deck', components: [] });
          console.log(error);
        }
      } else if (selectedOption.customId === 'get-card-to-deck') {
        await selectedOption.update({ content: 'Adicionar Carta ao Deck', components: [], ephemeral: false });
      }
    } catch (error) {
      await interaction.editReply({ content: 'Tempo esgotado!', components: [] });
    }
  },
};
