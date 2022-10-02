import discord
import time
import asyncio
import datetime
from collections import Counter
import pprint

TOKEN=''

client = discord.Client()
start=time.time()

@client.event
async def on_message(message):
    if message.content=='$uptime':
        print("worked")
        global start
        print(start)
        end=time.time()
        difference = int(round(end - start))
        uptime= str(datetime.timedelta(seconds=difference))
        uptime = str(uptime)
        bobembed=discord.Embed(title="Uptime", description=uptime)
        await message.reply(embed=bobembed)

    if message.content=='$leaderboard':
        print('worked')
        with open('leaderboard.txt') as f:
            lines = f.readlines()
        score = Counter(lines)
        score = pprint.pformat(dict(score),width=1)
        score = score.replace("{", "")
        score = score.replace("[", "")
        score = score.replace("]", "")
        score = score.replace("}", "")
        score = score.replace("r\n", "")
        score = score.replace("'", "")
        score = score.replace(",", "")
        score = score.replace("\\", "")
        score = score.replace("n", "")
        score = score.replace("catch", "")
        bobembed=discord.Embed(title='leaderboard', description=score)
        await message.reply(embed=bobembed)
    
    if message.content == "$help":
        description = "~ $uptime  *bot(s) uptime*\n~ $leaderboard *jellyfish catch counter board*\n\n#instructions#\n~when a jellyfish appears in chat simply ping <@!1025616270428749844> to catch a jellyfish!"
        bobembed=discord.Embed(title='command list', description=description)
        await message.reply(embed=bobembed)



loop = asyncio.get_event_loop()
loop.create_task(client.start(TOKEN))
loop.run_forever()
