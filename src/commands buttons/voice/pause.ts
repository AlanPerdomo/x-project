import { voiceService } from '../../services/VoiceService';
import { row } from '../../buttons/PlayerButtons';
module.exports = {
  customId: 'pause',

  async execute(interaction: any) {
    try {
      await voiceService.pause(interaction);
      row.components[0]?.setDisabled(false);
      row.components[1]?.setDisabled();
      row.components[2]?.setDisabled();
      return await interaction.update({ content: 'Pausado com sucesso!', components: [row] });
    } catch (error) {
      console.error(error);
      return interaction.update('Algo deu errado ao tentar pausar!');
    }
  },
};
