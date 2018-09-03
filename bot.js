const Discord = require("discord.js");
const auth = require("./json/auth.json");
const fn = require("./fn/fn");


const client = new Discord.Client();

try 
{
    client.on("ready", () => {
        console.log(fn.getCurrentTime() + "I am ready!");
        client.user.setActivity('Bot Admin, say ?help');
    });
    //stałe do nasłuchań
    const msg = require("./fn/actions/messages");
    const voiceTime = require("./fn/actions/voiceTime");
    //nałuchiwania
    client.on('voiceStateUpdate', voiceTime.timeOnVoiceChannel);
    client.on('message', msg.actionMessage);
    client.login(auth.token);
}
catch (err) 
{
    console.log(fn.getCurrentTime() + " !!! WYSTĄPIŁ BŁĄD !!!");
    console.log(err);
}