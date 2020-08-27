const { Client, MessageEmbed } = require('discord.js');

const emojiCharacters = require('./emojiCharacters');

const config = require('./config.json');

const client = new Client();
const prefix = config.prefix;
const fetch = require('node-fetch');

const ytdl = require('ytdl-core-discord');
const queue = new Map();

let date_ob = new Date();

const fs = require('fs');

client.once('ready', () => {
    console.log('Ready! Knechting Kurt now :D');
    client.user.setStatus('available')
    client.user.setActivity("mit seinem Prefix (+)", { type: "PLAYING" });
    //client.on('debug', console.log);
});

client.on('shardError', error => {
    console.error('A websocket connection encountered an error:', error);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

const embed2 = new MessageEmbed()
    .setColor('#EFFF00')
    .setTitle(emojiCharacters.h + emojiCharacters.i + emojiCharacters['!'] + " My Name is: Rubrechter der Knechter")
    .addFields(
        { name: 'Was mache ich?', value: ("Ich bin Rubrechter der Knechter ich bin ein Bot der vieles aber noch nicht alles kann.") },
        { name: 'Hauptfunktionen', value: ("Ich bin mit der Skyblock API und der Steam Web API verknüpft. Ich kann dein aktuellen Kontostand mit +bankinfo ausgeben, dir die letzten 5 Transaktionen mit +banking sagen und ein aktuelles Steamlevel ermitteln.") },
        { name: 'Nebenfunktionen', value: ("Da hab ich soooo viele, ich bin ein mini Musik Bot, ich antworte auf Memes, knechte Personen und kann dir Discord Avatare ausgeben.") },
        { name: 'Alles aufgelistet?', value: ("Comming Soon :)") });

const skyblockapi = config.skyblockapicode;
const skyblockid = '4a84584886904e40afc159aa3571e173';

const steamapikey = config.steamapikey;

client.on('message', async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix) && message.author != '287658496261095426') {

        const withoutPrefix = message.content.slice(prefix.length);
        const split = withoutPrefix.split(/ +/);
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        if (command === 'creeper') {
            message.channel.send("Aw Man" + emojiCharacters['!']);
        }

        if (command.includes('hello there')) {
            message.channel.send("General Kenobi!");
        }

        if (command.includes('orangensaft')) {
            message.channel.send("Einfach Orangensaft!");
        }

        if (command.includes('racist')) {
            message.channel.send("Don't be racist, I am a Building :homes: !");
        }

        if (command.includes('raid shadow legends')) {
            message.channel.send("This Bot was sponsored by Raid Shadow Legends!");
        }

        if (command.includes('knecht')) {
            message.channel.send("Hab ich gehört jemand soll geknechtet werden :thinking: ");
        }

        if (command.includes('prefix')) {
            message.channel.send("Mein Prefix ist " + prefix);
        }

    } else {

        const withoutPrefix = message.content.slice(prefix.length);
        const split = withoutPrefix.split(/ +/);
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        const serverQueue = queue.get(message.guild.id);

        if (command === 'help' || command === 'hilfe') {
            message.channel.send('Check mal deine DM\'s :smile:');
            message.author.send(embed2);
        }

        if (command === 'ping') {
            message.channel.send("Pong");
        }

        if (command === 'play') {
            execute(message, serverQueue);
            return;
        }

        if (command === 'skip') {
            skip(message, serverQueue);
            return;
        }

        if (command === 'stop') {
            stop(message, serverQueue);
            return;
        }

        if (command === 'bankinfo') {
            fetch('https://api.hypixel.net/skyblock/profile?key=' + skyblockapi + '&profile=' + skyblockid)
                .then(response => response.json())
                .then(function (response) {
                    bankingbalance = response.profile.banking.balance;
                    roundedbalance = Math.round(bankingbalance * 10) / 10;
                    message.channel.send("Wir haben im Moment " + roundedbalance + " Coins!");
                    console.log("Wir haben im Moment " + roundedbalance + " Coins!");
                })
                .then(json => console.log(json));
        }

        if (command === 'banking') {
            fetch('https://api.hypixel.net/skyblock/profile?key=' + skyblockapi + '&profile=' + skyblockid)
                .then(response => response.json())
                .then(function (response) {
                    for (i = 45; i < response.profile.banking.transactions.length; i++) {
                        ammount = Math.round(response.profile.banking.transactions[i].amount * 10) / 10;
                        initiator = response.profile.banking.transactions[i].initiator_name.substr(2);
                        if (response.profile.banking.transactions[i].action == "DEPOSIT") {
                            actions = "eingezahlt."
                        } else if (response.profile.banking.transactions[i].action == "WITHDRAW") {
                            actions = "abgehoben."
                        }
                        if (response.profile.banking.transactions[i].initiator_name != "Bank Interest") {
                            message.channel.send("Es wurden " + ammount + " Coins von " + initiator + " " + actions);
                            console.log("Es wurden " + ammount + " Coins von " + initiator + " " + actions);
                        } else {
                            message.channel.send("Es wurden " + ammount + " Coins durch den " + initiator + " dazuverdient.");
                            console.log("Es wurden " + ammount + " Coins durch den " + initiator + " dazuverdient.");
                        }
                    }
                })
                .then(json => console.log(json));
        }

        if (command == "bank") {
            if (!args.length) {
                message.channel.send("Von wem willst du die Bank Info sehen?");
            } else {
                fetch('https://api.hypixel.net/skyblock/profile?key=' + skyblockapi + '&profile=' + skyblockid)
                    .then(response => response.json())
                    .then(function (response) {
                        for (i = 40; i < response.profile.banking.transactions.length; i++) {
                            initiator = response.profile.banking.transactions[i].initiator_name.substr(2);
                            ammount = Math.round(response.profile.banking.transactions[i].amount * 10) / 10;
                            if (response.profile.banking.transactions[i].action == "DEPOSIT") {
                                actions = "eingezahlt."
                            } else if (response.profile.banking.transactions[i].action == "WITHDRAW") {
                                actions = "abgehoben."
                            }
                            if (initiator == args[0]) {
                                message.channel.send("Es wurden " + ammount + " Coins von " + initiator + " " + actions);
                                console.log("Es wurden " + ammount + " Coins von " + initiator + " " + actions);
                            } else {
                                //message.channel.send("Es wurden " + ammount + " Coins durch den " + initiator + " dazuverdient.");
                                //console.log("Es wurden " + ammount + " Coins durch den " + initiator + " dazuverdient.");
                            }
                        }
                    })
                    .then(json => console.log(json));
            }
        }



        //    if (command === 'adt'){
        //        fs.writeFile("/home/container/adt", date_ob.getDate + " " + date_ob.getMonth + " " + date_ob.getFullYear +  ": " + args[1] + args[2] + args[3] + args[4] + args[5] + args[6] + args[7] + args[8] + args[9] + args[10], function(err) {
        //           if(err) {
        //                return console.log(err);
        //            }
        //            console.log("The file was saved!");
        //        }); 
        //    }

        if (command === 'avatar') {
            if (args[0]) {
                const user = getUserFromMention(args[0]);
                if (!user) {
                    return message.reply('Please use a proper mention if you want to see someone else\'s avatar.');
                }

                return message.channel.send(`${user.username}'s avatar: ${user.displayAvatarURL({ dynamic: true })}`);
            }

            return message.channel.send(`${message.author.username}, your avatar: ${message.author.displayAvatarURL({ dynamic: true })}`);
        }

        if (command === 'knecht') {
            if (args => 1) {
                message.channel.send("Jetzt wird " + args[0] + " geknechtet!");
                client.user.setActivity(args[0] + "\'s Knechtigung", { type: "WATCHING" });
                console.log("Jetzt wird " + args[0] + " geknechtet!");
            } else {
                message.channel.send("Junge du Knecht... Du musst mir schon jemand zum knechten geben.");
            }
        }

        if (command === 'steamlvl') {
            if (!args.length) {
                return message.channel.send(`DU HURENKIND ${message.author} DU MUSST SCHON NE STEAMID ANGEBEN!`)
            }
            steamid = args[0];
            fetch('https://api.steampowered.com/IPlayerService/GetSteamLevel/v1/?key=' + steamapikey + '&steamid=' + steamid)
                .then(response => response.json())
                .then(function (response) {
                    playerLevel = response.response.player_level;
                    message.channel.send("Das gesuchte Steam Level ist " + playerLevel + "!");
                    console.log("Das gesuchte Steam Level ist " + playerLevel + "!");
                })
                .then(json => console.log(json));
        }
    }
})

function getUserFromMention(mention) {
    if (!mention) return;

    if (mention.startsWith('<@') && mention.endsWith('>')) {
        mention = mention.slice(2, -1);

        if (mention.startsWith('!')) {
            mention = mention.slice(1);
        }

        return client.users.cache.get(mention);
    }
}

async function execute(message, serverQueue) {
    const args = message.content.split(" ");

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
        return message.channel.send("You need to be in a voice channel to play music!");
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send("I need the permissions to join and speak in your voice channel!");
    }

    const songInfo = await ytdl.getInfo(args[1]);
    const song = {
        title: songInfo.title,
        url: songInfo.video_url
    };

    if (!serverQueue) {
        const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };

        queue.set(message.guild.id, queueContruct);

        queueContruct.songs.push(song);

        try {
            var connection = await voiceChannel.join();
            queueContruct.connection = connection;
            play(message.guild, queueContruct.songs[0]);
        } catch (err) {
            console.log(err);
            queue.delete(message.guild.id);
            return console.log(err);
        }
    } else {
        serverQueue.songs.push(song);
        return message.channel.send(`${song.title} has been added to the queue!`);
    }
}

function skip(message, serverQueue) {
    if (!message.member.voice.channel)
        return message.channel.send("You have to be in a voice channel to stop the music!");
    if (!serverQueue)
        return message.channel.send("There is no song that I could skip!");
    serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
    if (!message.member.voice.channel)
        return message.channel.send("You have to be in a voice channel to stop the music!");
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    const dispatcher = serverQueue.connection
        .play(ytdl(song.url), { highWaterMark: 512 })
        .on("finish", () => {
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })
        .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    dispatcher.on('error', console.error);
    serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}



client.login(config.token);