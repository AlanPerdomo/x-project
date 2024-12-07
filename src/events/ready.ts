const { Events } = require('discord.js');

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client: { user: { tag: any } }) {
    console.log(`Logged in as ${client.user.tag}!`);
  },
};
