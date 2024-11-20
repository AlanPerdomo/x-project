import { AttachmentBuilder, SlashCommandBuilder } from 'discord.js';
import { perolaService } from '../../services/PerolaService';
const Canvas = require('@napi-rs/canvas');

module.exports = {
  cooldown: 3600 * 24,
  data: new SlashCommandBuilder().setName('perola-do-dia').setDescription('retorna uma perola aleatoria'),

  async execute(interaction: { reply: (arg0: { files: AttachmentBuilder[]; ephemeral: boolean }) => void }) {
    const perola = await perolaService.sorte();
    const canvas = Canvas.createCanvas(800, 600);
    const context = canvas.getContext('2d');

    const background = await Canvas.loadImage(await perolaService.PerolaImageUrl());
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    context.font = '30px sans-serif';
    context.fillStyle = '#ffffff';
    const maxWidth = canvas.width - 40;
    const lineHeight = 35;
    const text = perola.perola;

    function getWrappedText(ctx: { measureText: (arg0: string) => any }, text: string, maxWidth: number) {
      const words = text.split(' ');
      let line = '';
      const lines = [];
      for (const word of words) {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && line !== '') {
          lines.push(line);
          line = word + ' ';
        } else {
          line = testLine;
        }
      }
      lines.push(line);
      return lines;
    }

    const lines = getWrappedText(context, text, maxWidth);
    const shadowHeight = lines.length * lineHeight + 20;
    const shadowY = canvas.height - shadowHeight;

    context.fillStyle = 'rgba(0, 0, 0, 0.5)';
    context.fillRect(0, shadowY, canvas.width, shadowHeight);

    context.fillStyle = '#ffffff';
    lines.forEach((line, index) => {
      context.fillText(line.trim(), 20, shadowY + 30 + index * lineHeight);
    });

    const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'image.png' });

    interaction.reply({
      files: [attachment],
      ephemeral: false,
    });
  },
};
