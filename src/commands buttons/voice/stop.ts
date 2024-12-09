import { voiceService } from '../../services/VoiceService';

module.exports = {
  customId: 'stop',
  async execute(interaction: any) {
    try {
      await voiceService.stop(interaction);
      return await interaction.update({ content: 'Parado com sucesso!', components: [] });
    } catch (error) {
      console.error(error);
      return interaction.update('Algo deu errado ao tentar parar!');
    }
  },
};
