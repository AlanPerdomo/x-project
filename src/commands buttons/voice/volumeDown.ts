import { voiceService } from '../../services/VoiceService';
import { radioRow } from '../../buttons/PlayerButtons';
import { ButtonInteraction, CacheType } from 'discord.js';

module.exports = {
  customId: 'volume-down',
  async execute(interaction: ButtonInteraction<CacheType>) {
    try {
      const currentVolume = await voiceService.decreaseVolume(interaction);
      const currentContent = interaction.message.content.split('\n')[0];
      radioRow.components[4]?.setDisabled(false);
      if (currentVolume! <= 0) {
        radioRow.components[3]?.setDisabled();
        return await interaction.update({
          content: `${currentContent} \nVolume atual: Min`,
          components: [radioRow],
        });
      }
      return await interaction.update({
        content: `${currentContent} \nVolume atual: ${(currentVolume! * 100).toFixed(0)}%`,
        components: [radioRow],
      });
    } catch (error) {
      console.error(error);
      return interaction.update('Algo deu errado ao tentar diminuir o volume!');
    }
  },
};
