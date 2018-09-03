const con = require("../conn");
const fn = require("../fn");
const basic = require("./msgFunctions/basic");
const moderateServer = require("./msgFunctions/moderateServer");

function actionMessage(msg) {
    switch(msg.content) {      
        case '?help':
            basic.help(msg, con);
            break;
        case '?time':
            basic.time(msg, con, fn);
            break;
        case '?id':
            msg.reply(msg.author.id);
            break;
        default: 
            switchIf(msg);
            break;
    }
}

function switchIf(msg) {
    if(checkString(msg) == "?addRole") moderateServer.addRole(msg, con);
    if(checkString(msg) == "?addMod") moderateServer.addMod(msg, con);
    if(checkString(msg) == "?removeRole") moderateServer.removeRole(msg, con);
    if(checkString(msg) == "?removeMod") moderateServer.removeMod(msg, con);
}

function checkString(msg) {
    return msg.content.substring(0, contain());
    function contain() {
        if(msg.content.indexOf(" ") > -1) return msg.content.indexOf(" ");
        else return msg.content.lenght;
    }
}
module.exports.actionMessage = actionMessage;