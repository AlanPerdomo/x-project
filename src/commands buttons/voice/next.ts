import { voiceService } from '../../services/VoiceService';

module.exports = {
  customId: 'next',
  async execute(interaction: any) {
    await voiceService.next(interaction);
  },
};
