# Discord Bot - X Project

Bem-vindo ao repositório do **X Project**, um bot para Discord desenvolvido com TypeScript e Node.js. O projeto está em andamento e visa fornecer diversas funcionalidades úteis para gerenciar servidores e interagir com os membros através de comandos de chat e, futuramente, de conexão por voz.

## Funcionalidades Atuais

- **Comandos de Chat**: 
  - Suporte a diversos comandos interativos, que podem ser executados diretamente no chat do Discord.
  - Funcionalidades específicas de gerenciamento de servidor e interação com os usuários.
- **Sistema de Eventos**:
  - Respostas a diferentes eventos no Discord, como o início de novas sessões, mensagens enviadas e muito mais.
- **Player de Áudio (Em Desenvolvimento)**:
  - Em breve, será possível executar comandos que permitirão ao bot participar de canais de voz e reproduzir áudio diretamente no servidor.

## Requisitos

- **Node.js** v18 ou superior
- **npm** v7 ou superior
- FFmpeg instalado e configurado no sistema
- Conta e servidor no Discord com permissão para adicionar bots
- Token de bot do Discord

## Instalação

1. Clone o repositório:

    ```bash
    git clone https://github.com/seu-usuario/x-project.git
    cd x-project
    ```

2. Instale as dependências:

    ```bash
    npm install
    ```

3. Configure o arquivo `config.json` com as credenciais necessárias e configurações de áudio (exemplo):

    ```json
    {
      "token": "SEU_TOKEN_DISCORD",
      "device": "default", // Defina o dispositivo de áudio para a captura de voz
      "maxTransmissionGap": 2000,
      "type": "alsa" // Dependendo do sistema, ajuste para dshow (Windows), alsa (Linux), etc.
    }
    ```

4. Inicie o bot:

    ```bash
    npm run start
    ```

## Comandos Disponíveis

No momento, os seguintes comandos estão disponíveis:

- `/ping`: Retorna "Pong!" para verificar a conexão com o servidor.
- `/help`: Lista todos os comandos disponíveis e suas descrições.
- Outros comandos (em desenvolvimento).

Para visualizar todos os comandos, digite `/help` no canal onde o bot está presente.

## Conexão de Voz

A funcionalidade de conexão por voz está em fase de desenvolvimento. Quando concluída, ela permitirá que o bot se conecte a canais de voz para reproduzir áudio e interagir via comandos de áudio.

## Contribuição

Este é um projeto em desenvolvimento e contribuições são bem-vindas! Se você deseja colaborar:

1. Faça um fork do repositório.
2. Crie um branch para sua feature/fix:
    ```bash
    git checkout -b minha-feature
    ```
3. Envie suas alterações:
    ```bash
    git add .
    git commit -m "Descrição das alterações"
    git push origin minha-feature
    ```
4. Abra um Pull Request no repositório original.

## Licença

Este projeto está licenciado sob a MIT License - consulte o arquivo [LICENSE](./LICENSE) para mais detalhes.
