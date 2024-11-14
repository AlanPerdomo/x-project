import { Events } from 'discord.js';

const fs = require('fs');

module.exports = {
  name: Events.MessageCreate,
  once: false,
  async execute(message: {
    author: { id: any; username: any };
    content: any;
    guild: { name: any };
    channel: { name: any };
    createdTimestamp: any;
    member: { voice: { channel: any } };
    reply: (arg0: string) => any;
  }) {
    let data = {
      userId: message.author.id,
      user: message.author.username,
      mensagem: message.content,
      guild: message.guild.name,
      channel: message.channel.name,
      date: message.createdTimestamp,
    };
    try {
      fs.appendFileSync('./log.txt', JSON.stringify(data) + '\n', 'utf-8');
    } catch (error) {
      console.log(error);
    }
  },
};
