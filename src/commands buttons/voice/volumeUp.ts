import { ButtonInteraction } from 'discord.js';
import { voiceService } from '../../services/VoiceService';
import { row } from '../../buttons/PlayerButtons';

module.exports = {
  customId: 'volume-up',
  async execute(interaction: ButtonInteraction) {
    if (interaction.deferred) await interaction.deferReply();
    const currentVolume = await voiceService.increaseVolume(interaction);
    const currentContent = interaction.message.content.split('\n')[0];
    row.components[3]?.setDisabled(false);
    if (currentVolume >= 1.5) {
      row.components[4]?.setDisabled();
      return await interaction.update({
        content: `${currentContent} \nVolume atual: Max`,
        components: [row],
      });
    }
    return await interaction.update({
      content: `${currentContent} \nVolume atual: ${(currentVolume * 100).toFixed(0)}%`,
      components: [row],
    });
  },
};
