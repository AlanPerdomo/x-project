import { REST, Routes } from 'discord.js';

const { token, clientId } = require('../config.json');
const fs = require('node:fs');
const path = require('node:path');

interface Command {
	data: {
		toJSON(): unknown;
		name: string;
	};
	execute: (...arg: any[]) => void;
}

async function deployCommands() {
	const commands: unknown[] = [];

	const foldersPath = path.join(__dirname, 'commands');
	const commandFolders = fs.readdirSync(foldersPath);
	for (const folder of commandFolders) {
		let commandsPath = path.join(foldersPath, folder);
		const commandFiles = fs.readdirSync(commandsPath).filter((file: string) => file.endsWith('.js'));
		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);

			const command = (await import(filePath).then(mod => mod.default)) as unknown;

			if (typeof command === 'object' && command !== null && 'data' in command && 'execute' in command) {
				commands.push((command as Command).data.toJSON());
				//console.log(`[COMMAND] ${(command as Command).data.name} has been loaded!`);
			} else {
				console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
			}
		}
	}

	const rest = new REST().setToken(token);

	// rest
	// 	.put(Routes.applicationCommands(clientId), { body: [] })
	// 	.then(() => console.log('Successfully deleted all application commands.'))
	// 	.catch(console.error);

	(async () => {
		try {
			console.log(`Started refreshing ${commands.length} application (/) commands.`);

			const data = (await rest.put(Routes.applicationCommands(clientId), { body: commands })) as any[];

			console.log(`Successfully reloaded ${data.length} application (/) commands.`);
		} catch (error) {
			console.error(error);
		}
	})();
}

export { deployCommands };
