// const {Events}  = require('discord.js');

// module.exports = {
//     name: Events.MessageCreate,
//     once: false,
//     async execute(message){
//         if(!message.guild) return;

//         if(message.content ==='-join'){
//             const channel = message.member?.voice.channel;
//             if(channet){
//                 try {
//                     const connection = await connectToChannel(channel);
//                     connection.subscribe(player);
//                     await message.reply('Joined the voice channel!');
//                 } catch (error) {
//                     console.log(error);
//                 }
//             } else {
//                 void message.reply('You are not in a voice channel!');
//             }
//         }
//     },
// };
