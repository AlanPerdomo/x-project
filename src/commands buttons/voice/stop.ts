import { voiceService } from '../../services/VoiceService';

module.exports = {
  customId: 'stop',
  async execute(interaction: any) {
    await voiceService.stop(interaction);
  },
};