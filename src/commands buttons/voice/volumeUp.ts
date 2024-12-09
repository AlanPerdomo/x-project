import { voiceService } from '../../services/VoiceService';
import { radioRow } from '../../buttons/PlayerButtons';
import { ButtonInteraction, CacheType } from 'discord.js';

module.exports = {
  customId: 'volume-up',
  async execute(interaction: ButtonInteraction<CacheType>) {
    try {
      const currentVolume = await voiceService.increaseVolume(interaction);
      const currentContent = interaction.message.content.split('\n')[0];
      radioRow.components[3]?.setDisabled(false);
      if (currentVolume! >= 1.5) {
        radioRow.components[4]?.setDisabled();
        return await interaction.update({
          content: `${currentContent} \nVolume atual: Max`,
          components: [radioRow],
        });
      }
      return await interaction.update({
        content: `${currentContent} \nVolume atual: ${(currentVolume! * 100).toFixed(0)}%`,
        components: [radioRow],
      });
    } catch (error) {
      console.error(error);
      return interaction.update('Algo deu errado ao tentar aumentar o volume!');
    }
  },
};
