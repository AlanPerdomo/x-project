import { Events } from 'discord.js';
import { Collection } from 'discord.js';
const wait = require('node:timers/promises').setTimeout;

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction: {
    client: { commands?: any; cooldowns?: any };
    commandName: any;
    isChatInputCommand: () => any;
    user: { id: any };
    reply: (arg0: { content: string; ephemeral: boolean }) => any;
    editReply: (arg0: { content: string; ephemeral: boolean }) => any;
    deleteReply: () => any;
    replied: any;
    deferred: any;
    followUp: (arg0: { content: string; ephemeral: boolean }) => any;
    isButton: () => any;
    message: { fetch: () => any };
    customId: any;
  }) {
    const { cooldowns } = interaction.client;

    if (!cooldowns.has(interaction.commandName)) {
      cooldowns.set(interaction.commandName, new Collection());
    }

    async function timer(command: any) {
      console.log(command.data.name);
      const now = Date.now();
      const timestamps = cooldowns.get(command.data.name);
      console.log(timestamps);
      const defaultCooldownDuration = 30;
      const cooldownAmount = (command.cooldowns ?? defaultCooldownDuration) * 1000;

      if (timestamps.has(interaction.user.id)) {
        const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

        if (now < expirationTime) {
          const expiredTimestamp = Math.round(expirationTime / 1_000);
          await interaction.reply({
            content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`,
            ephemeral: true,
          });
          await wait(cooldownAmount - 1);
        }
        await interaction.editReply({ content: `You can use \`${command.data.name}\` again!`, ephemeral: true });
        await wait(3000);
        return interaction.deleteReply();
      }

      timestamps.set(interaction.user.id, now);
      setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
    }

    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);
      await timer(command);
      if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
      }
      try {
        // console.log(command);
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
          await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
      }
    } else if (interaction.isButton()) {
      const command = interaction.client.commands.get(interaction.customId);
      if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
      }
      try {
        // console.log(command);
        // await timer(command);
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
          await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
      }
    }
  },
};
