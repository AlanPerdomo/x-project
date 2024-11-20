import { SlashCommandBuilder } from 'discord.js';
import { userService } from '../../services/UserService';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('novo-usuario')
    .setDescription('Registra um email e libera uma senha para o usuário')
    .addStringOption(option => option.setName('email').setDescription('Informe seu email').setRequired(true)),
  async execute(interaction: {
    options: { getString: (arg0: string) => any };
    user: { globalName: any; id: any; username: any };
    reply: (arg0: { content: string; ephemeral: boolean }) => any;
  }) {
    let password = Math.random().toString(36).slice(-8);

    let data = {
      email: interaction.options.getString('email'),
      name: interaction.user.globalName,
      discordId: interaction.user.id,
      username: interaction.user.username,
      password: password,
      type: 'user',
    };

    try {
      await userService.cadastrar(data).then(async result => {
        if (result.status == true) {
          await userService.login({ email: data.email, password: password });
          return interaction.reply({ content: result.message + '\n Sua senha é: ' + password, ephemeral: true });
        } else {
          return interaction.reply(result.message);
        }
      });
    } catch (error) {
      console.log(error);
    }
  },
};
