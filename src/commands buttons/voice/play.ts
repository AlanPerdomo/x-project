import { voiceService } from '../../services/VoiceService';

module.exports = {
  customId: 'play',
  async execute(interaction: any) {
    await voiceService.resume(interaction);
  },
};
