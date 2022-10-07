const { token, guildId, clientId } = require('./config.json')
const { REST, SlashCommandBuilder, Routes } = require('discord.js')


const commands = [
    new SlashCommandBuilder().setName('lenny').setDescription("replies hi"),
    new SlashCommandBuilder().setName('catch').setDescription('Catch a jellyfish'),
    new SlashCommandBuilder().setName('leaderboard').setDescription('Catch count leaderboard'),
]

    .map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands})
    .then((data) => console.log(`Successfully registered ${data.length} application commands`))
    .catch(console.error)
    
