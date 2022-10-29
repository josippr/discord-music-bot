require("dotenv").config();

//discordJS libraries
const {REST} = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { Client, Intents, Collection } = require("discord.js");
const { Player } = require("discord-player");

//node packages for commands from commands folder
const fs = require("node:fs");
const path = require("node:path");

//client
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES    
    ]
})

//Load all commands
//discord-player library
const commands = [];
client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON);
}

client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
});


//we get the guild id that the bot is currently inside of and then we register all the commands 
//that we have loaded from the commands folder by using the REST API imported earlier from discordJS
client.on("ready", () => {
    const guild_ids = client.guilds.cache.map(guild => guild.id);

    const rest = new REST ({version : "9"}).setToken(process.env.token);
    for (const guildID of guild_ids) {
        rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guildID), {
            body: commands
        })
        .then(() => console.log('Added commands to ${guildID}'))
        .catch(console.error);
    }
})

//execute command when user enters it
client.on("interactionCreate", async interaction => {

    //check if interaction is command, if not then do nothing
    if(!interaction.isCommand()) return;

    //get command name from interaction
    const command = client.commands.get(interaction.commandName);
    if(!command) return;

    try {
        //execute command 
        await command.execute({client, interaction});
    }
    catch(err) {
    console.error(err);
    await interaction.reply("Error occured while executing entered command. Check your command again, and if problem prersists, contact bot creator.")
    }
});

//log in client
client.login(process.env.TOKEN);