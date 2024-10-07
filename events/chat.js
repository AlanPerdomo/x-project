const {Events} = require('discord.js');

module.exports = {
    name: Events.MessageUpdate,
    once: false,
    execute(oldMessage, newMessage) {
        if(oldMessage.content === newMessage.content) return;
        console.log(oldMessage.content);
        console.log(newMessage.content);
    }
}