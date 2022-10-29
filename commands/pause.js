const {SlashCommandBuilder} =  require("@discordjs/builders");
const {MessageEmbed} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pause song"),
    execute: async ({client, interaction}) => {

        const queue = client.player.getQueue(interaction.guild);

        //check if there are songs in queue
        if(!queue) {
            await interaction.reply("Queue is empty!");
            return;
        }

        

        //pause the song
        queue.setPaused(true);

        await interaction.reply ("**${currentSong.title}** has been paused.");
    }
}