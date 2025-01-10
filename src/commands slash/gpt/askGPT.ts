import { SlashCommandBuilder } from 'discord.js';
import { gptService } from '../../services/GPTService';
module.exports = {
  data: new SlashCommandBuilder()
    .setName('ask-gpt')
    .setDescription('Pergunte ao ChatGPT')
    .addStringOption(option => option.setName('question').setDescription('Pergunta para o ChatGPT').setRequired(true)),

  async execute(interaction: any) {
    const question = interaction.options.getString('question');
    await gptService.chatGPTExample(question);
  },
};
