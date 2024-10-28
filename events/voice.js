const {Events} = require('discord.js');
const { connectToChannel } = require('../services/VoiceService');

module.exports = {
    name: Events.MessageCreate,
    once: false,
    async execute(message) {
        console.log(message.content)
            if(!message.guild) return;
            if(message.content === '-join'){
                const channel = message.member?.voice.channel;
                if(channel){
                    try { 
                        const connection = await connectToChannel(channel);
                        connection.subscribe(player);
                        await message.reply("Playing audio in voice channel");
                    } catch (error) {
                        console.log(error);
                    }
                } else {
                    void message.reply('You are not in a voice channel!');
                }
            }
    },
};

                        
