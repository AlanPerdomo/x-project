import { voiceService } from '../../services/VoiceService';
import { row } from '../../buttons/PlayerButtons';

module.exports = {
  customId: 'stop',
  async execute(interaction: any) {
    try {
      await voiceService.stop(interaction);
      row.components[0]?.setDisabled(true);
      row.components[1]?.setDisabled();
      row.components[2]?.setDisabled();
      return await interaction.update({ content: 'Parado com sucesso!', components: [] });
    } catch (error) {
      console.error(error);
      return interaction.update('Algo deu errado ao tentar parar!');
    }
  },
};
