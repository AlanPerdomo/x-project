const { Events } = require('discord.js');
const { connectToChannel } = require('../services/VoiceService');

module.exports = {
  name: Events.MessageCreate,
  once: false,
  async execute(message) {
    if (message.content === '-join' && message.guild) {
      const channel = message.member?.voice.channel;
      if (channel) {
        try {
          console.log('trying to connect...');
          const connection = await connectToChannel(channel);
          console.log('Connected to voice channel');
          connection.subscribe(player);
          await message.reply('Playing audio in voice channel');
        } catch (error) {
          console.log(error);
        }
      } else {
        void message.reply('You are not in a voice channel!');
      }
    }
  },
};
