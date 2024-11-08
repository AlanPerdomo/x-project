import { AttachmentBuilder, SlashCommandBuilder } from 'discord.js';
import { perolaService } from '../../services/PerolaService';
const Canvas = require('@napi-rs/canvas');

module.exports = {
  data: new SlashCommandBuilder().setName('perola-do-dia').setDescription('retorna uma perola aleatoria'),

  async execute(interaction: { reply: (arg0: { files: any; ephemeral: boolean; content: string }) => any }) {
    const perola = await perolaService.sorte();
    const canvas = Canvas.createCanvas(200, 200);
    const context = canvas.getContext('2d');
    const background = await Canvas.loadImage('src/assets/private_assets/gabriel.jpg');

    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'profile-image.png' });

    interaction.reply({
      content: `\n**"${perola.perola}"** \n\t\t\t-REIS, Gabriel-\n`,
      files: [attachment],
      ephemeral: false,
    });
  },
};
