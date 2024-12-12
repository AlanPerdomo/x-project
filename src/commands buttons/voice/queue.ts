import { voiceService } from '../../services/VoiceService';

module.exports = {
  customId: 'queue',
  async execute(interaction: any) {
    await voiceService.getQueue(interaction);
  },
};
