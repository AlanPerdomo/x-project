import { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } from 'discord.js';

module.exports = {
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
      .setURL('https://www.leagueoflegends.com/pt-br/')
      .setStyle(ButtonStyle.Link)
      .setEmoji('🌐')
      .setDisabled(true);

    const row = new ActionRowBuilder().addComponents(myDeck, getCardToDeck, site);

    const response = await interaction.reply({
      content: 'Bem-vindo ao TCG!',
      components: [row],
      ephemeral: true,
    });
    const collectorFilter = i => i.user.id === interaction.user.id;
    try {
      const confirmation = await response.awaitMessageComponent({
        filter: collectorFilter,
        componentType: 'BUTTON',
        time: 60000,
      });

      if (confirmation.customId === 'my-deck') {
        console.log('my-deck');
        await interaction.update({ content: `Seu deck: deck`, components: [] });
      } else if (confirmation.customId === 'get-card-to-deck') {
        try {
          await confirmation.update({ content: 'Adicionando carta ao deck...', components: [] });
        } catch (error) {
          console.error(error);
        }
      }
    } catch (error) {
      console.error(error);
    }
  },
};
