const { Client, GatewayIntentBits, UserFlags, SelectMenuOptionBuilder, Collection, codeBlock } = require('discord.js');
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


const Tags = sequelize.define('tags', {
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



client.on('ready', () => {
    Tags.sync();
    console.log(client.user.tag)
});


const sleep = ms => new Promise(res => setTimeout(res, ms));

{var smack = 0};


async function lenny_spawn() {
    const channel = await client.channels.fetch('1020187811594391622')
    const bobEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle("A WILD JELLYFISH APPPEARS")
        .setImage('http://drawcentral.com/wp-content/uploads/2015/03/Spongebob-Jellyfish.jpg')

    channel.send({ embeds: [bobEmbed] });

    smack = 1
    console.log(smack)
    await sleep(20*1000);
    smack=0
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
        if (smack === 0) {
            await interaction.reply("No jellyfish here")
        }

        if (smack === 1) {
            const bobEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('Caught!')

            await interaction.reply({ embeds: [bobEmbed] });
            smack = 0
            console.log(smack)


            var tagUser = `${interaction.user}`

            try {
                const tag = await Tags.create({
                    user: tagUser,
                    catches: 1,
                });
                return interaction.followUp(`User ${tag.user} now logged into database`);
            }

            catch (error) {
                if (error.name === "SequelizeUniqueConstraintError") {
                    const tag = await Tags.findOne({ where: {user: tagUser}});

                    if (tag) {
                        tag.increment('catches')
                        return interaction.followUp(tagUser + " has " + String(tag.get('catches'))+" catches total")
                    }
                    }
                }
            }
        }
    
    if (commandName === 'leaderboard') {
        board = []
        const top10 = await sql.prepare("SELECT * FROM tags ORDER BY catches DESC LIMIT 10;").all();
        top10.map(({ user, catches }) => {
            board.push(`${user} ${catches}`)
        });
        board = board.toString();
        board = board.replace(",", "\n")

        const embed = new EmbedBuilder()
            .setTitle("Leaderboard")
            .setColor(0x0099FF)
            .addFields({ name: '------------------', value: board});
        return interaction.reply({ embeds: [embed] });
        
    }

    if (commandName === 'lennyhelp') {
        const embed = new EmbedBuilder()
            .setTitle("Command List")
            .setColor(0x0099FF)
            .setDescription("~ /lenny *a simple command that replies hi\n~ /catch *when you see a jellyfish enter this command to catch it*\n~ /leaderboard *replies with a leaderboard of catches in the server*")

        return interaction.reply({ embeds: [embed]})
    }

});


function spawn_lenny() {
    lenny_spawn()
}

setInterval(spawn_lenny, 650*1000);

client.login('')
