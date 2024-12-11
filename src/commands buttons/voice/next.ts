import { voiceService } from '../../services/VoiceService';
module.exports = {
  customId: 'next',
  async execute(interaction) {
    try {
      await interaction.deferUpdate();
      await voiceService.next(interaction);
    } catch (error) {
      console.error(error);
    }
  },
};
