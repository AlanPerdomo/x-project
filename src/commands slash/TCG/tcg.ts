import { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder().setName('tcg').setDescription('Exibe informações sobre o TCG'),

  async execute(interaction: {
    reply: (arg0: { content: string; components: ActionRowBuilder<ButtonBuilder>[]; ephemeral: boolean }) => any;
    user: { id: any };
    editReply: (arg0: { content: string; components: never[] }) => any;
  }) {
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

    await interaction.reply({
      content: 'Bem-vindo ao TCG!',
      components: [row],
      ephemeral: false,
    });
  },
};
