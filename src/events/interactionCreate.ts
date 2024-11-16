import { Events } from 'discord.js';
import { Collection } from 'discord.js';
const wait = require('node:timers/promises').setTimeout;

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    const { cooldowns } = interaction.client;
    const command = interaction.client.commands.get(interaction.commandName);

    if (!cooldowns.has(interaction.commandName)) {
      cooldowns.set(interaction.commandName, new Collection());
    }

    // cooldown system
    if (command.data.name) {
      try {
        const now = Date.now();
        const timestamps = cooldowns.get(command.data.name);
        const defaultCooldownDuration = 1;
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
      } catch (error) {
        console.log(error);
      }
    }

    if (interaction.isChatInputCommand()) {
      if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
      }
      try {
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
      console.log('Button');
    } else if (interaction.isStringSelectMenu()) {
      console.log('StringSelectMenu');
    }
  },
};
