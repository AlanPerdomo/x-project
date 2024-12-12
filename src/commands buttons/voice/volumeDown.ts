import { voiceService } from '../../services/VoiceService';

module.exports = {
  customId: 'volume-down',
  async execute(interaction: any) {
    await voiceService.decreaseVolume(interaction);
  },
};
