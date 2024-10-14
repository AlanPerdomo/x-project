const {joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');

const connection = getVoiceConnection("753796305922424872");
module.exports = {
    name: 'VoiceStateUpdate',
    once: false,
    execute(oldState, newState) {
        if(oldState.channelId === null && newState.channelId !== null){
            joinVoiceChannel({
                channelId: newState.channelId,
                guildId: newState.guildId,
                adapterCreator: newState.guild.voiceAdapterCreator,
            });
        }
    }
}