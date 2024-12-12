import { voiceService } from '../../services/VoiceService';

module.exports = {
  customId: 'pause',
  async execute(interaction: any) {
    await voiceService.pause(interaction);
  },
};
