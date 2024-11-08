const { Events } = require('discord.js');
// import { playSong, attachRecorder } from '../services/VoiceService';

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client: { user: { tag: any } }) {
		console.log(`Logging in as ${client.user.tag}...`);
		// attachRecorder();
		// try {
		// await playSong();
		// console.log('Song is ready to play!');
		// } catch (error) {
		// console.log(error);
		// console.log('Failed to play song!');
		// }
	},
};
