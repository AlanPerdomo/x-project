import { Events, userMention, Collection } from 'discord.js';
import { setTimeout as wait } from 'node:timers/promises';

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction: {
    user: any;
    client: { cooldowns: Map<any, any>; commands: { get: (arg0: any) => any }; buttons: { get: (arg0: any) => any } };
    isChatInputCommand: () => any;
    commandName: any;
    reply: (arg0: { content: string; ephemeral: boolean }) => any;
    editReply: (arg0: { content: string; ephemeral: boolean; components: [] }) => any;
    isButton: () => any;
    customId: any;
  }) {
    const cooldowns = interaction.client.cooldowns || new Collection();
    async function handleCooldown(
      interaction: {
        user: { id: any };
        reply: (arg0: { content: string; ephemeral: boolean; components: [] }) => any;
        editReply: (arg0: { content: string; ephemeral: boolean; components: [] }) => any;
      },
      uniqueId: string,
      cooldowns: { get: (arg0: any) => Map<any, any>; has: (arg0: any) => any; set: (arg0: any, arg1: any) => void },
      defaultCooldownDuration: number,
    ) {
      const now = Date.now();
      const timestamps = cooldowns.get(uniqueId) || new Map();
      const user = userMention(interaction.user.id);

      if (!cooldowns.has(uniqueId)) {
        cooldowns.set(uniqueId, timestamps);
      }

      const cooldownAmount = defaultCooldownDuration * 1000;

      if (timestamps.has(interaction.user.id)) {
        const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

        if (now < expirationTime) {
          const timeLeft = Math.round(expirationTime / 1000);

          await interaction.reply({
            content: `Você deve esperar <t:${timeLeft}:R> segundos antes de usar \`${uniqueId}\` novamente.`,
            components: [],
            ephemeral: true,
          });
        }
        await wait(Math.round((timestamps.get(interaction.user.id) + cooldownAmount - now) / 1000) * 1000);
        await interaction.editReply({
          content: `${user} Você pode usar \`${uniqueId}\` novamente!`,
          components: [],
          ephemeral: false,
        });
        await wait(120000);
        return true;
      }

      timestamps.set(interaction.user.id, now);
      setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
      return false;
    }
    if (!interaction.client.cooldowns) {
      interaction.client.cooldowns = new Map();
    }

    if (interaction.isChatInputCommand()) {
      try {
        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) {
          console.error(`Comando "${interaction.commandName}" não encontrado.`);
          return;
        }

        const uniqueId = interaction.commandName;
        const defaultCooldown = command.cooldown ?? 3;
        const isOnCooldown = await handleCooldown(interaction, uniqueId, cooldowns, defaultCooldown);

        if (isOnCooldown) return;

        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Ocorreu um erro ao executar o comando.', ephemeral: true });
      }
    } else if (interaction.isButton()) {
      try {
        const button = interaction.client.buttons.get(interaction.customId);

        if (!button) {
          console.error(`Nenhum botão correspondente ao ID ${interaction.customId}`);
          await interaction.reply({ content: 'Botão nao encontrado, opção em desenvolvimento', ephemeral: true });
          return;
        }

        const uniqueId = interaction.customId;
        const defaultCooldown = button.cooldown ?? 5;
        const isOnCooldown = await handleCooldown(interaction, uniqueId, cooldowns, defaultCooldown);

        if (isOnCooldown) return;

        await button.execute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Ocorreu um erro ao processar este botão.', ephemeral: true });
      }
    }
  },
};
