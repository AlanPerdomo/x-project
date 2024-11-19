import { Events, userMention } from 'discord.js';
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
    editReply: (arg0: { content: string; ephemeral: boolean; components?: any }) => any;
    deleteReply: () => any;
    replied: any;
    deferred: any;
    followUp: (arg0: { content: string; ephemeral: boolean }) => any;
    isButton: () => any;
    message: {
      edit(arg0: { content: string; components: never[] }): unknown;
      fetch: () => any;
    };
    customId: any;
  }) {
    const { cooldowns } = interaction.client;

    if (!cooldowns.has(interaction.commandName)) {
      cooldowns.set(interaction.commandName, new Collection());
    }

    async function timer(command: { data: { name: any }; cooldowns: any }) {
      const now = Date.now();
      const timestamps = cooldowns.get(command.data.name);
      const defaultCooldownDuration = 5;
      const cooldownAmount = (command.cooldowns ?? defaultCooldownDuration) * 1000;
      const user = userMention(interaction.user.id);

      if (!timestamps) {
        timestamps.set(interaction.user.id, now);
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
        return;
      }

      if (timestamps.has(interaction.user.id)) {
        const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

        if (now < expirationTime) {
          const expiredTimestamp = Math.round(expirationTime / 1_000);
          await interaction.reply({
            content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`,
            ephemeral: false,
          });
          await wait(cooldownAmount - 1);
        }
        await interaction.editReply({
          content: `${user} You can use \`${command.data.name}\` again!`,
          ephemeral: false,
        });
        await wait(120000);
        return 'delete';
      }

      timestamps.set(interaction.user.id, now);
      setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
    }

    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if ((await timer(command)) == 'delete') return interaction.deleteReply();

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
      switch (interaction.customId) {
        case 'my-deck':
          await interaction.message.edit({
            content: 'Meu Deck',
            components: [],
          });
          break;
      }
    }
  },
};
