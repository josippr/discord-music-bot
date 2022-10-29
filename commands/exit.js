const {SlashCommandBuilder} =  require("@discordjs/builders");
const {MessageEmbed} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("exit")
        .setDescription("Kick bot from voice channel"),
    execute: async ({client, interaction}) => {

        const queue = client.player.getQueue(interaction.guild);

        //check if there are songs in queue
        if(!queue) {
            await interaction.reply("Queue is empty!");
            return;
        }

        

        //kick bot from voice channel
        queue.destroy();

        await interaction.reply ("Leaving voice channel now...");
    }
}