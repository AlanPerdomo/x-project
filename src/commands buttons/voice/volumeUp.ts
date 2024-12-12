import { voiceService } from '../../services/VoiceService';

module.exports = {
  customId: 'volume-up',
  async execute(interaction: any) {
    await voiceService.increaseVolume(interaction);
  },
};
