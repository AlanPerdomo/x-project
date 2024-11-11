import { Events } from 'discord.js';
import { connectToChannel } from '../services/VoiceService';
import { createAudioPlayer, NoSubscriberBehavior } from '@discordjs/voice';

const { maxTransmissionGap } = require('../../config.json') as {
	maxTransmissionGap: number;
};

let player = createAudioPlayer({
	behaviors: {
		noSubscriber: NoSubscriberBehavior.Play,
		maxMissedFrames: Math.round(maxTransmissionGap / 20),
	},
});

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
		if (message.content === '-join' && message.guild) {
			const channel = message.member?.voice.channel;
			if (channel) {
				try {
					const connection = await connectToChannel(channel);
					connection.subscribe(player);
					await message.reply('Playing audio in voice channel');
				} catch (error) {
					console.log(error);
				}
			} else {
				void message.reply('You are not in a voice channel!');
			}
		}
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