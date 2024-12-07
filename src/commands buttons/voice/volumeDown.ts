import { ButtonInteraction } from 'discord.js';
import { voiceService } from '../../services/VoiceService';
import { row } from '../../buttons/PlayerButtons';

module.exports = {
  customId: 'volume-down',
  async execute(interaction: ButtonInteraction) {
    try {
      const currentVolume = await voiceService.decreaseVolume(interaction);
      const currentContent = interaction.message.content.split('\n')[0];
      row.components[4]?.setDisabled(false);
      if (currentVolume! <= 0) {
        row.components[3]?.setDisabled();
        return await interaction.update({
          content: `${currentContent} \nVolume atual: Min`,
          components: [row],
        });
      }
      return await interaction.update({
        content: `${currentContent} \nVolume atual: ${(currentVolume! * 100).toFixed(0)}%`,
        components: [row],
      });
    } catch (error) {
      console.error(error);
      return interaction.update('Algo deu errado ao tentar diminuir o volume!');
    }
  },
};
