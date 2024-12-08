import { voiceService } from '../../services/VoiceService';
import { row } from '../../buttons/PlayerButtons';

module.exports = {
  customId: 'play',
  async execute(interaction: any) {
    try {
      await voiceService.resume(interaction);
      row.components[0]?.setDisabled();
      row.components[1]?.setDisabled(false);
      row.components[2]?.setDisabled(false);
      return await interaction.update({ content: 'Tocando!', components: [row] });
    } catch (error) {
      console.error(error);
      return interaction.update('Algo deu errado ao tentar tocar!');
    }
  },
};
