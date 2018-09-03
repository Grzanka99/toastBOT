const con = require("../conn");
const fn = require("../fn");
const datab = require("../../json/data.json");
const timeToRole = datab.czas;

var licz = new Array;

function voiceTime(oldMember, newMember) {
    let newUserChannel = newMember.voiceChannel;
    let oldUserChannel = oldMember.voiceChannel;
    let onlineTime;
    let userID = newMember.user.id;
    function liczOnline() {
        onlineTime+=10;
        con.query("UPDATE users set time = " + onlineTime + " where user_id = "+userID+";");
        if(onlineTime >= timeToRole && !newMember.guild.roles.has('name','User')) { 
            let rola = newMember.guild.roles.find('name','User');
            newMember.addRole(rola);
            if(onlineTime === timeToRole) {
                console.log(fn.getCurrentTime() + newMember.user.username+" jest aktywnym użytkownikiem");
            }
        }
    }
    
    function getTimeOnline() {
        let getTime = "select time from users where user_id =" + userID + ";";
        let result = con.query(getTime);
        onlineTime = result[0].time;
    }
    
    if(oldUserChannel === undefined && newUserChannel !== undefined) {
        console.log(fn.getCurrentTime() + 'User: ' + newMember.user.username + ' join to '+ newUserChannel.name);
        if(fn.if_exist(userID)) {
            getTimeOnline();
            licz[userID] = setInterval(liczOnline,10000);
        } else {
            console.log(fn.getCurrentTime() + 'Nie istnieje!, Tworzę użytkownika w bazie');
            
            let addUser = "insert into users (user_id, time) values ("+ userID +", 0);";
            con.query(addUser);
            
            getTimeOnline();
            licz[userID] = setInterval(liczOnline,10000);
        }
    } else if(newUserChannel === undefined) {
        console.log(fn.getCurrentTime() + 'User: ' + newMember.user.username + ' left from '+oldUserChannel.name);
        clearInterval(licz[userID]);
    }
}


module.exports.timeOnVoiceChannel = voiceTime;