const { Client, GatewayIntentBits } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const fs = require('fs')

client.on('ready', () => {
    console.log(client.user.tag)
});

{var smack = 0};

function add(){ 
    smack = smack + 1;
};

function sub(){
    smack = smack - 1;
}


async function lenny_spawn() {
    const channel = await client.channels.fetch('917926628561150046')
    const bobEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle("A WILD JELLYFISH APPPEARS")
        .setImage('http://drawcentral.com/wp-content/uploads/2015/03/Spongebob-Jellyfish.jpg')

    channel.send({ embeds: [bobEmbed] });

    add()
    console.log(smack)
};

client.on('interactionCreate', async interaction => {
    const { commandName } = interaction;
    if (commandName === 'lenny') {
        await interaction.reply('hi')
    }
});

client.on('interactionCreate', async interaction => {
    const { commandName } = interaction;
    if (commandName ===  'catch') {
        if (smack === 1) {
            const bobEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('Caught!')

            var catPath = "./db.json"
            var catRead = fs.readFileSync(catPath);
            var catFile = JSON.parse(catRead);
            var userId = `${interaction.user}`

            if (!catFile[userId]) {
                catFile[userId] = {catches: 1};
                fs.writeFileSync(catPath, JSON.stringify(catFile, null, 2))

            } else {
                console.log(catFile[userId].catches)
                var catVar = Number(catFile[userId].catches);
                newVar = catVar + 1;
                
                console.log(newVar)
                catFile[userId] = {catches: newVar};
                fs.writeFileSync(catPath, JSON.stringify(catFile, null, 2));

                console.log(`changed users catch count to ${newVar}`)
            }

            await interaction.reply({ embeds: [bobEmbed] });
            sub()
            console.log(smack)
        }
        else {
            await interaction.reply("No jellyfish here")
        }
    }

    if (commandName === 'leaderboard') {
        var catPath = "./db.json"
        var catRead = fs.readFileSync(catPath);
        var data = JSON.parse(catRead);
        sorted = []
        sorted.push(data);
        function sortData(){
            sorted.sort(function(a, b) {
                return b-a
            });
        }
        
        sortData()
        
        console.log(data)
        
        const bobEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Leaderboard')
            .setDescription(data)
        
            await interaction.reply({ embeds: [bobEmbed]})
    }
})


function spawn_lenny() {
    lenny_spawn()
}

setInterval(spawn_lenny, 30*1000);

client.login('MTAyNTYxNTY0NDkyMzgwOTg0Mw.G_WcbZ.0oQxRzqT70WSrbfIqUWeDSxFzzp_EgaTsMKJK8')
