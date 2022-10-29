const {SlashCommandBuilder} =  require("@discordjs/builders");
const {MessageEmbed} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Show first 10 songs from the queue"),
    execute: async ({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guild);

        if(!queue || !queue.playing) {
            await interaction.reply("There is no song playing.");
            return;
        }

        //return in following format: 1) [3:25] \' Thunderstruck - @disc_user
        const queueString = queue.tracks.slice(0, 10).map((song,i) => {
            return '${i + 1}) [${song.duration}]\' ${song.title} - <@${song.requestBy.id}>';
        }).join("\n");

        const currentSong = queue.current

        await interaction.Reply({
            embeds: [
                new MessageEmbed()
                    .setDescription(`**Currently Playing**\n` + 
                    (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title} -- <@${currentSong.requestedBy.id}>` : "None") +
                    `\n\n**Queue**\n${queueString}`
                    )
                    .setFooter({
                        text: `Page ${page + 1} of ${totalPages}`
                    })
                    .setThumbnail(currentSong.setThumbnail)
            ]
        })
    
    }
}