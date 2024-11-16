import { ActionRowBuilder, AnyComponentBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder().setName('tcg').setDescription('Exibe informações sobre o TCG'),

  async execute(interaction: { reply: (arg0: { components: ActionRowBuilder<AnyComponentBuilder>[] }) => any }) {
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

    const getCardToDeck1 = new ButtonBuilder()
      .setCustomId('get-card-to-deck1')
      .setLabel('Adicionar Carta ao Deck')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('🃏');

    const getCardToDeck2 = new ButtonBuilder()
      .setCustomId('get-card-to-deck2')
      .setLabel('Adicionar Carta ao Deck')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('🃏');

    const getCardToDeck3 = new ButtonBuilder()
      .setCustomId('get-card-to-deck3')
      .setLabel('Adicionar Carta ao Deck')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('🃏');

    const row = new ActionRowBuilder().addComponents(
      myDeck,
      getCardToDeck,
      getCardToDeck1,
      getCardToDeck2,
      getCardToDeck3,
    );

    await interaction.reply({
      components: [row],
    });
  },
};
