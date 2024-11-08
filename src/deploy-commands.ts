import { REST, Routes } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { token, clientId } from '../config.json';

interface Command {
  data: {
    toJSON(): { name: string }; // Ajuste para um objeto que tenha 'name' como string
    name: string;
  };
  execute: (...args: any[]) => void;
}

async function deployCommands() {
  const commands: { name: string }[] = []; // Definir comandos para aceitar objetos com propriedade `name`

  const foldersPath = path.join(__dirname, 'commands');
  const commandFolders = fs.readdirSync(foldersPath);

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter((file: string) => file.endsWith('.js'));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);

      try {
        const importedCommand = (await import(filePath)).default;
        if (
          importedCommand &&
          typeof importedCommand === 'object' &&
          'data' in importedCommand &&
          'execute' in importedCommand &&
          typeof (importedCommand as Command).data.toJSON === 'function'
        ) {
          const command = importedCommand as Command;
          commands.push(command.data.toJSON());
          console.log(`[COMMAND] ${command.data.name} has been loaded!`);
        } else {
          console.warn(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
      } catch (error) {
        console.error(`[ERROR] Failed to load command at ${filePath}:`, error);
      }
    }
  }

  const rest = new REST().setToken(token);

  try {
    // console.log('Deleting all existing application commands...');
    // await rest.put(Routes.applicationCommands(clientId), { body: [] });
    // console.log('Successfully deleted all application commands.');

    console.log(`Started refreshing ${commands.length} application (/) commands.`);
    const data = (await rest.put(Routes.applicationCommands(clientId), { body: commands })) as any[];
    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    console.log('Bot is ready!');
  } catch (error) {
    console.error('Error deploying commands:', error);
  }
}

export { deployCommands };
