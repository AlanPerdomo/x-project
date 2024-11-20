import { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, CommandInteraction } from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder().setName('tcg').setDescription('Exibe informações sobre o TCG'),

  async execute(interaction: CommandInteraction) {
    const myDeckButton = new ButtonBuilder()
      .setCustomId('my-deck')
      .setLabel('Meu Deck')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('👤');

    const getCardToDeckButton = new ButtonBuilder()
      .setCustomId('get-card-to-deck')
      .setLabel('Adicionar Carta ao Deck')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('🃏');

    const siteButton = new ButtonBuilder()
      .setLabel('Site')
      .setURL('https://www.google.com')
      .setStyle(ButtonStyle.Link)
      .setEmoji('🌐')
      .setDisabled(true);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(myDeckButton, getCardToDeckButton, siteButton);

    await interaction.reply({
      content: 'Bem-vindo ao TCG!',
      components: [row],
      ephemeral: false,
    });
  },
};
