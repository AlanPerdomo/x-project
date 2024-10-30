const { Events } = require('discord.js');
const fs = require('fs');

module.exports = {
  name: Events.MessageCreate,
  once: false,
  async execute(message) {
    // console.log(message.channel);

    let data = {
      userId: message.author.id,
      user: message.author.username,
      mensagem: message.content,
      guild: message.guild.name,
      channel: message.channel.name,
      date: message.createdTimestamp,
    };

    // console.log(data);

    try {
      fs.appendFileSync('./log.txt', JSON.stringify(data) + '\n', 'utf-8');
    } catch (error) {
      console.log(error);
    }
  },
};
