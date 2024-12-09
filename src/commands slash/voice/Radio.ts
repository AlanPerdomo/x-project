import { ActionRowBuilder, ButtonBuilder, SlashCommandBuilder } from 'discord.js';
import { voiceService } from '../../services/VoiceService';
import { radioRow } from '../../buttons/PlayerButtons';

module.exports = {
  data: new SlashCommandBuilder().setName('radio').setDescription('Join a voice channel and play a radio'),

  async execute(interaction: {
    reply: (arg0: string) => any;
    editReply: (arg0: { content: string; components: ActionRowBuilder<ButtonBuilder>[] }) => any;
  }) {
    const radios = ['https://play.ilovemusic.de/ilm_iloveradio/'];
    radioRow.components[0]?.setDisabled(true);
    radioRow.components[1]?.setDisabled(false);
    radioRow.components[2]?.setDisabled(false);

    await interaction.reply('Tentando conectar ao rádio...');

    try {
      if (await voiceService.play(interaction, radios[0]!, 'radio')) {
        return await interaction.editReply({
          content: `playing ${radios[0]}`,
          components: [radioRow],
        });
      }
    } catch (error) {
      console.error(error);
    }
  },
};
