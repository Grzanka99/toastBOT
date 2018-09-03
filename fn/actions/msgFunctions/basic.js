module.exports.help = function(msg, con) {
    try 
    {
        let asd = con.query("SELECT*FROM commands ORDER BY cmd_name");
        msg.reply("Dostępne komendy: \n" + getCommands(asd));
    }
    catch (err) 
    {
        console.log(err);
    }
}
module.exports.time = function(msg, con, fn) {
    if(fn.if_exist(msg.author.id)) {
        let result = con.query('select time from users where user_id =' + msg.author.id +';');
        msg.reply("Twój czas na czacie głosowym to: "+ fn.convertedTime(result[0].time));
    } else {
        msg.reply("Twój czas na czacie głosowym to: 0 minut");
    }
}

function getCommands(asd) {
    let out = "";
    asd.forEach(line => {
        out += "        " + line.cmd_name  + ":   " + line.cmd_desc + "\n";
    });
    return out;
}