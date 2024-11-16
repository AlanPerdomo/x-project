const { Events } = require('discord.js');
// import { playSong, attachRecorder } from '../services/VoiceService';

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client: { user: { tag: any } }) {
    console.log(`Ready! Logged in as ${client.user.tag}!`);
  },
};
