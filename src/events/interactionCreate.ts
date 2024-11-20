import { Events, userMention } from 'discord.js';
const wait = require('node:timers/promises').setTimeout;

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction: {
    client: { cooldowns: Map<any, any>; commands: { get: (arg0: any) => any }; buttons: { get: (arg0: any) => any } };
    isChatInputCommand: () => any;
    commandName: any;
    reply: (arg0: { content: string; ephemeral: boolean }) => any;
    isButton: () => any;
    customId: any;
  }) {
    async function handleCooldown(
      interaction: {
        user: { id: any };
        reply: (arg0: { content: string; ephemeral: boolean }) => any;
        editReply: (arg0: { content: string; ephemeral: boolean }) => any;
      },
      commandName: any,
      cooldowns: { get: (arg0: any) => Map<any, any>; has: (arg0: any) => any; set: (arg0: any, arg1: any) => void },
      defaultCooldownDuration = 5,
    ) {
      const now = Date.now();
      const timestamps = cooldowns.get(commandName) || new Map();
      const user = userMention(interaction.user.id);

      if (!cooldowns.has(commandName)) {
        cooldowns.set(commandName, timestamps);
      }

      const cooldownAmount = defaultCooldownDuration * 1000;

      if (timestamps.has(interaction.user.id)) {
        const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

        if (now < expirationTime) {
          const timeLeft = Math.ceil((expirationTime - now) / 1000);
          await interaction.reply({
            content: `Você deve esperar ${timeLeft} segundos antes de usar \`${commandName}\` novamente.`,
            ephemeral: false,
          });
          await wait(cooldownAmount - 1);
        }
        await interaction.editReply({
          content: `${user} You can use \`${commandName}\` again!`,
          ephemeral: false,
        });
        await wait(120000);
        return 'delete';
      }

      timestamps.set(interaction.user.id, now);
      setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
      return false;
    }
    if (!interaction.client.cooldowns) {
      interaction.client.cooldowns = new Map();
    }

    const cooldowns = interaction.client.cooldowns;

    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
      }

      const isCooldownActive = await handleCooldown(interaction, interaction.commandName, cooldowns);
      if (isCooldownActive) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Ocorreu um erro ao executar o comando.', ephemeral: true });
      }
    } else if (interaction.isButton()) {
      const button = interaction.client.buttons.get(interaction.customId);

      if (!button) {
        console.error(`Nenhum botão correspondente ao ID ${interaction.customId}`);
        return;
      }
      const isCooldownActive = await handleCooldown(interaction, interaction.commandName, cooldowns);
      if (isCooldownActive) return;

      try {
        await button.execute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Ocorreu um erro ao processar este botão.', ephemeral: true });
      }
    }
  },
};
