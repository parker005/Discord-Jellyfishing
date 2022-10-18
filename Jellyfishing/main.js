const { Client, GatewayIntentBits } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const Sequelize = require('sequelize');
const SQLite = require('better-sqlite3')
const sql = SQLite('./database.sqlite')
const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: console.log,
    storage: 'database.sqlite'
});


//sequelize db formatting
const Tags = sequelize.define('tags', {
    //tag column definitions
    user: {
        type: Sequelize.STRING,
        unique: true,
    },
    catches: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
});


//init confirmation
client.on('ready', () => {
    Tags.sync();
    console.log(client.user.tag)
});

//define sleep
const sleep = ms => new Promise(res => setTimeout(res, ms));


//set smack initial being 0
{var smack = 0};


//function to spawn lenny
async function lenny_spawn() {
    //get channel
    const channel = await client.channels.fetch('1020187811594391622')
    //embed
    const bobEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle("A WILD JELLYFISH APPPEARS")
        .setImage('http://drawcentral.com/wp-content/uploads/2015/03/Spongebob-Jellyfish.jpg')

    //send message then delete after 200*1000ms
    channel.send({ embeds: [bobEmbed] }).then(msg => {
        setTimeout(() => msg.delete(), 200000)
    });

    //set smack for lenny spawn
    smack = 1
    console.log(smack)
    //wait 200*1000ms
    await sleep(200*1000);
    //set smack for lenny gone
    smack=0
    
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
        if (smack === 0) {
            await interaction.reply("No jellyfish here")
        }

        //if jellyfish in chat
        if (smack === 1) {
            const bobEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('Caught!')

            await interaction.reply({ embeds: [bobEmbed] });
            //set smack for lenny being gone
            smack = 0
            console.log(smack)

            //define the user catching
            var tagUser = `${interaction.user}`

            try {
                //if user not in database
                const tag = await Tags.create({
                    user: tagUser,
                    catches: 1,
                });
                return interaction.followUp(`User ${tag.user} now logged into database`);
            }

            catch (error) {
                //if user already in database
                if (error.name === "SequelizeUniqueConstraintError") {
                    const tag = await Tags.findOne({ where: {user: tagUser}});

                    //formate reply
                    if (tag) {
                        tag.increment('catches')
                        return interaction.followUp(tagUser + " has " + String(tag.get('catches')+1)+" catches total")
                    }
                    }
                }
            }
        }
    
    if (commandName === 'leaderboard') {

        //assign null value as array
        board = []

        //SQLite db request
        const top10 = await sql.prepare("SELECT * FROM tags ORDER BY catches DESC LIMIT 10;").all();

        //map database response to board variable array
        top10.map(({ user, catches }) => {
            board.push(`${user} ${catches}`)
        });

        //database formatting x10
        board = board.toString();
        board = board.replace(",", "\n")
        board = board.replace(",", "\n")
        board = board.replace(",", "\n")
        board = board.replace(",", "\n")
        board = board.replace(",", "\n")
        board = board.replace(",", "\n")
        board = board.replace(",", "\n")
        board = board.replace(",", "\n")
        board = board.replace(",", "\n")
                              

        //embed
        const embed = new EmbedBuilder()
            .setTitle("Leaderboard")
            .setColor(0x0099FF)
            .addFields({ name: '------------------', value: board});
        return interaction.reply({ embeds: [embed] });
        
    }

    if (commandName === 'lennyhelp') {
        //embed
        const embed = new EmbedBuilder()
            .setTitle("Command List")
            .setColor(0x0099FF)
            .setDescription("~ /lenny *a simple command that replies hi\n~ /catch  when you see a jellyfish enter this command to catch it*\n~ /leaderboard *replies with a leaderboard of catches in the server*")

        return interaction.reply({ embeds: [embed]})
    }

});


//async function in normal function format
function spawn_lenny() {
    lenny_spawn()
}

//spawn every 5 minutes
setInterval(spawn_lenny, 300*1000);

client.login('')
