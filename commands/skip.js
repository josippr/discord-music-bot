const {SlashCommandBuilder} =  require("@discordjs/builders");
const {MessageEmbed} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skip song"),
    execute: async ({client, interaction}) => {

        const queue = client.player.getQueue(interaction.guild);

        //check if there are songs in queue
        if(!queue) {
            await interaction.reply("Queue is empty!");
            return;
        }

        const CurrentSong = queue.current;

        //skip the song
        queue.skip();

        await interaction.reply ({
            embeds: [
                new MessageEmbed()

                .setDescription("Skipped **${currentSong.title}**")
                .setThumbnail(currentSong.thumbnail)
            ]
        })
    }
}