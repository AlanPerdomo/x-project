import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

const play = new ButtonBuilder()
  .setCustomId('play')
  .setLabel('Play')
  .setStyle(ButtonStyle.Primary)
  .setEmoji('▶️')
  .setDisabled(true);

const pause = new ButtonBuilder()
  .setCustomId('pause')
  .setLabel('Pause')
  .setStyle(ButtonStyle.Secondary)
  .setEmoji('⏸️')
  .setDisabled(true);

const stop = new ButtonBuilder()
  .setCustomId('stop')
  .setLabel('Stop')
  .setStyle(ButtonStyle.Danger)
  .setEmoji('⏹️')
  .setDisabled(true);

const volumeDown = new ButtonBuilder()
  .setCustomId('volume-down')
  .setLabel('Volume Down')
  .setStyle(ButtonStyle.Secondary)
  .setEmoji('🔉');

const volumeUp = new ButtonBuilder()
  .setCustomId('volume-up')
  .setLabel('Volume Up')
  .setStyle(ButtonStyle.Secondary)
  .setEmoji('🔊');

const row = new ActionRowBuilder<ButtonBuilder>().addComponents(play, pause, stop, volumeDown, volumeUp);

export { play, pause, stop, volumeDown, volumeUp, row };
