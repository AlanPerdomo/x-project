const { Events } = require('discord.js');
const { playSong } = require('../services/VoiceService');

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    try {
      await playSong();
      console.log('Song is ready to play!');
    } catch (error) {
      console.log(error);
      console.log('Failed to play song!');
    }
  },
};
