import { openAIKey } from '../../config.json';
// import { Configuration, OpenAIApi } from 'openai';

import OpenAI from 'openai';
const openai = new OpenAI({
  apiKey: openAIKey,
});

class GPTService {
  async askGPT(question: any, interaction: any) {}

  async chatGPTExample(question: any) {
    console.log('Pergunta:', question);
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        {
          role: 'user',
          content: 'Write a haiku about recursion in programming.',
        },
      ],
    });

    console.log(completion.choices[0]?.message);
  }
}

export const gptService = new GPTService();
