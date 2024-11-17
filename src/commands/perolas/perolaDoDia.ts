import { AttachmentBuilder, SlashCommandBuilder } from 'discord.js';
import { perolaService } from '../../services/PerolaService';
const Canvas = require('@napi-rs/canvas');

module.exports = {
  cooldowns: 3600 * 24,
  data: new SlashCommandBuilder().setName('perola-do-dia').setDescription('retorna uma perola aleatoria'),

  async execute(interaction: { reply: (arg0: { files: AttachmentBuilder[]; ephemeral: boolean }) => void }) {
    const perola = await perolaService.sorte();
    const canvas = Canvas.createCanvas(800, 600);
    const context = canvas.getContext('2d');

    const background = await Canvas.loadImage(await perolaService.PerolaImageUrl());
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    context.fillStyle = 'rgba(0, 0, 0, 0.5)'; // Cor de fundo semitransparente
    context.fillRect(0, canvas.height - 50, canvas.width, 50); // Posição e tamanho do fundo sombreado
    context.font = '30px sans-serif';
    context.fillStyle = '#ffffff'; // Cor do texto
    context.fillText(perola.perola, 20, canvas.height - 15); // Posição do texto

    const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'image.png' });

    interaction.reply({
      files: [attachment],
      ephemeral: false,
    });
  },
};
