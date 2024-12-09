import { voiceService } from '../../services/VoiceService';
import { radioRow, playerRow } from '../../buttons/PlayerButtons';

module.exports = {
  customId: 'play',
  async execute(interaction: any) {
    try {
      const currentContent = interaction.message.content.split(' ')[0];
      let row: any = [];
      if (interaction.message.components[0]?.components[3]?.data.custom_id === 'volume-down') {
        row = radioRow;
      } else if (interaction.message.components[0]?.components[3]?.data.custom_id === 'previous') {
        row = playerRow;
      }

      await voiceService.resume(interaction);
      row.components[0]?.setDisabled();
      row.components[1]?.setDisabled(false);
      row.components[2]?.setDisabled(false);
      return await interaction.update({ content: `Tocando! ${currentContent}.`, components: [row] });
    } catch (error) {
      console.error(error);
      return interaction.update('Algo deu errado ao tentar tocar!');
    }
  },
};
