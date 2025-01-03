const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('../config.json');
const { deployCommands } = require('./deploy-commands');
const { generateDependencyReport } = require('@discordjs/voice');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

// deployCommands();
// console.log(generateDependencyReport());

client.cooldowns = new Collection();
client.commands = new Collection();
client.buttons = new Collection();

// load commands
const commandFoldersPath = path.join(__dirname, 'commands slash');
const commandFolders = fs.readdirSync(commandFoldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(commandFoldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter((file: string) => file.endsWith('.js'));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
      console.log(`[COMMAND] ${command.data.name} has been loaded!`);
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

// load buttons
const buttonsFoldersPath = path.join(__dirname, 'commands buttons');
const buttonFolders = fs.readdirSync(buttonsFoldersPath);

for (const folder of buttonFolders) {
  const buttonsPath = path.join(buttonsFoldersPath, folder);
  const buttonFiles = fs.readdirSync(buttonsPath).filter((file: string) => file.endsWith('.js'));
  for (const file of buttonFiles) {
    const filePath = path.join(buttonsPath, file);
    const button = require(filePath);
    if ('customId' in button && 'execute' in button) {
      client.buttons.set(button.customId, button);
      console.log(`[BUTTON] ${button.customId} has been loaded!`);
    } else {
      console.log(`[WARNING] The button at ${filePath} is missing a required "customId" or "execute" property.`);
    }
  }
}

//load events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter((file: string) => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args: any) => event.execute(...args));
  } else {
    client.on(event.name, (...args: any) => event.execute(...args));
  }
}

client.login(token);
