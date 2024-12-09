import { voiceService } from '../../services/VoiceService';
import { radioRow, playerRow } from '../../buttons/PlayerButtons';
module.exports = {
  customId: 'pause',

  async execute(interaction: any) {
    try {
      const currentContent = interaction.message.content.split(' ')[1].replace(/\./g, '');
      let row: any = [];

      if (interaction.message.components[0]?.components[3]?.data.custom_id === 'volume-down') {
        row = radioRow;
      } else if (interaction.message.components[0]?.components[3]?.data.custom_id === 'previous') {
        row = playerRow;
      }

      await voiceService.pause(interaction);
      row.components[0]?.setDisabled(false);
      row.components[1]?.setDisabled();
      row.components[2]?.setDisabled();
      await interaction.update({ content: `${currentContent} Pausado com sucesso!`, components: [row] });
    } catch (error) {
      console.error(error);
      return interaction.update('Algo deu errado ao tentar pausar!');
    }
  },
};
