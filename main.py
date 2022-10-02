from http.client import SWITCHING_PROTOCOLS
from re import L
import time
import discord
import asyncio
from threading import Timer
import datetime
from datetime import datetime, timedelta
import sched, time
import itertools
from discord.ext import tasks

TOKEN=""
TOKEN1=""
client=discord.Client()
client1=discord.Client()

@client1.event
async def on_ready():
    print("reliable online")

start=time.time()
switch = 0

def add():
    global switch
    switch=switch+1

def sub():
    global switch
    switch=switch-1

@client.event
async def lenny_spawn():

    time.sleep(10)
    await client.wait_until_ready()
    channel = client.get_channel(1020187811594391622)

    bobembed=discord.Embed(title='A WILD JELLYFISH APPEARS')
    bobembed.set_image(url='http://drawcentral.com/wp-content/uploads/2015/03/Spongebob-Jellyfish.jpg')

    await channel.send(embed=bobembed, delete_after=20)

    add()

@client.event
async def on_ready():
    print("lenny online")

@client1.event
async def on_message(message):
    if client1.user.mentioned_in(message):
        global switch
        if switch == 1:
            sub()

            bobembed=discord.Embed(title="CAUGHT!", delete_after = 10)
            await message.reply(embed=bobembed)
            
            switch = 0

            user=message.author.id
            user=str(user)
            user="<@!"+user+">"

            with open('leaderboard.txt', 'a') as f:
                f.write("["+user+' catch'+"]\n")
        time.sleep(10)
        await message.delete()

@tasks.loop(seconds = 300)
async def loop1():
    await client.loop.create_task(lenny_spawn())

loop1.start()

loop = asyncio.get_event_loop()
loop.create_task(client.start(TOKEN))
loop.create_task(client1.start(TOKEN1))
loop.run_forever()


