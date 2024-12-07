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
  .setDisabled(false);

const stop = new ButtonBuilder()
  .setCustomId('stop')
  .setLabel('Stop')
  .setStyle(ButtonStyle.Danger)
  .setEmoji('⏹️')
  .setDisabled(false);

const volumeDown = new ButtonBuilder()
  .setCustomId('volume-down')
  .setLabel('Volume Down')
  .setStyle(ButtonStyle.Secondary)
  .setEmoji('🔉')
  .setDisabled(false);

const volumeUp = new ButtonBuilder()
  .setCustomId('volume-up')
  .setLabel('Volume Up')
  .setStyle(ButtonStyle.Secondary)
  .setEmoji('🔊')
  .setDisabled(false);

const row = new ActionRowBuilder<ButtonBuilder>().addComponents(play, pause, stop, volumeDown, volumeUp);

export { play, pause, stop, volumeDown, volumeUp, row };
