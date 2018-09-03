const fn = require("../../fn");

module.exports.addRole = function(msg, con) {
    let allowed = con.query("SELECT*FROM moderators WHERE mod_id = " + msg.author.id).length;
    try 
    {
    if(allowed != 0) {
            if(checkData(msg)){
                let addRoleName = getData(msg);
                let newUserId = getUserId(msg);
                let roleId = getRoleId(msg, addRoleName);
                
                if(checkPerm(msg,con, addRoleName)) addNewRole(msg, newUserId, roleId);
            } else throw "Niepoprawna składnia, poprawna to: ?addRole [nazwaRoli] nazwaUżytkownika";
        } else throw "Nie masz uprawień do tej operacji!";
    } 
    catch (err) 
    {
        msg.reply(err);
        console.log(msg.author.username + ": " + err);
    }
}

module.exports.removeRole = function(msg, con) {
    let allowed = con.query("SELECT*FROM moderators WHERE mod_id = " + msg.author.id).length;
    try 
    {
    if(allowed != 0) {
            if(checkData(msg)) {
                let removeRoleName = getData(msg);
                let newUserId = getUserId(msg);
                let roleId = getRoleId(msg, removeRoleName);

                if(checkPerm(msg, con, removeRoleName)) removeNewRole(msg, newUserId, roleId);
            } else throw "Niepoprawna składnia, poprawna to: ?removeRole [nazwaRoli] nazwaUżytkownika";
        } else throw "Nie masz uprawień do tej operacji!";
    }
    catch (err) 
    {
        msg.reply(err);
        console.log(msg.author.username + ": " + err);
    }
}

module.exports.addMod = function(msg, con) {
    let allowed = con.query("SELECT*FROM moderators WHERE mod_id =" + msg.author.id + " AND perm = 0").length;
    try 
    {
        if(allowed != 0) {
            if(checkData(msg)) {
                let newModId = getUserId(msg);
                let permLvl = getData(msg);
                
                if(isInDatabase(newModId, con)) throw "Operacja jest zbędna.";
                addModToDatabase(newModId, permLvl, con);
                msg.reply("Dodano Moderatora pomyślnie");
                console.log(fn.getCurrentTime() + "User: " + msg.author.username + " dodał użytkownika do roli moderatora.");
            } else throw "Niepoprawna składnia, poprawna to: ?addMod nazwaUżytkownika [poziomDostępu]";
        } else throw "Nie masz uprawień do tej operacji!";
    }
    catch (err)
    {
        msg.reply(err);
        console.log(msg.author.username + ": " + err);
    }
}

module.exports.removeMod = function(msg, con) {
    let allowed = con.query("SELECT*FROM moderators WHERE mod_id =" + msg.author.id + " AND perm = 0").length;
    try 
    {
        if(allowed != 0) {
            if(checkDataR(msg)) {
                let newModId = getUserId(msg);
                
                if(!isInDatabase(newModId, con)) throw "Operacja jest zbędna.";
                removeModFromDatabase(newModId, con);
                msg.reply("Usunięto Moderatora pomyślnie");
                console.log(fn.getCurrentTime() + "User: " + msg.author.username + " usunął użytkownika z roli moderatora.");
            } else throw "Niepoprawna składnia, poprawna to: ?removeMod nazwaUżytkownika";
        } else throw "Nie masz uprawień do tej operacji!";
    }
    catch (err)
    {
        msg.reply(err);
        console.log(msg.author.username + ": " + err);
    }
}
function checkPerm(msg, con, role) {
    let userPermLvl = con.query("SELECT perm FROM moderators WHERE mod_id = " + msg.author.id);  
    let requirePermLvl = con.query("SELECT perm FROM roles WHERE role_name = '" + role + "' LIMIT 1");

    // console.log(requirePermLvl[0]);
    if(!requirePermLvl[0]) throw "Tą rolą nie można zarządzać z poziomu komend.";
    if(userPermLvl[0].perm<=requirePermLvl[0].perm) return true;
    else throw "Nie masz wystarczającego dostępu aby zarządzać tą rolą.";
    // return false;
}

function getUserId(msg) {
    let start = msg.content.indexOf('<@')+2;
    let stop = msg.content.indexOf('>');

    return msg.content.substring(start, stop);
}

function getData(msg) {
    let start = msg.content.indexOf('[')+1;
    let stop = msg.content.indexOf(']')

    return msg.content.substring(start, stop);
}

function getRoleId(msg, addRoleName) {
    let roleId = msg.guild.roles.find('name', addRoleName);
    if(roleId == null) throw "Podana rola nie istnieje!";
    return roleId.id;
}

function checkData(msg) {
    if(msg.content.indexOf('[') == -1) return false;
    if(msg.content.indexOf(']') == -1) return false;
    if(msg.content.indexOf('<@') == -1) return false;
    
    return true;
}

function checkDataR(msg) {
    if(msg.content.indexOf('<@') == -1) return false;
    
    return true;
}

function isInDatabase(id, con) {
    let chk = con.query("SELECT*FROM moderators WHERE mod_id="+id).length;
    if(chk != 0) return true;
    return false;
}

function addNewRole(msg, newUserId, roleId) {
    let member = msg.guild.members.get(newUserId);
    try 
    {
        if(member.roles.has(roleId)) throw "Użytkownik ma rolę, pomijam dodanie roli.";
        member.addRole(roleId);
        msg.reply("Dodano pomyślnie!");
        console.log(fn.getCurrentTime() + "User: " + msg.author.username + " dał użytkownikowi: " + member.user.username + " Rolę: " + msg.guild.roles.get(roleId).name);
    }
    catch (err) 
    {
        console.log(err);
        msg.reply("Dodano pomyślnie.");
    }
}

function removeNewRole(msg, newUserId, roleId) {
    let member = msg.guild.members.get(newUserId);
    try 
    {
        if(!member.roles.has(roleId)) throw "Użytkownik nie ma roli, pomijam usuwanie roli.";
        member.removeRole(roleId);
        msg.reply("Usunięto pomyślnie!");
        console.log(fn.getCurrentTime() + "User: " + msg.author.username + " zabrał użytkownikowi: " + member.user.username + " Rolę: " + msg.guild.roles.get(roleId).name)
    }
    catch (err) 
    {
        console.log(err);
        msg.reply("Usunięto pomyślnie.");
    }
}

function addModToDatabase(newModId, permLvl, con) {
    con.query("INSERT INTO moderators (mod_id, perm) VALUES ("+ newModId +","+ permLvl +")");
}
function removeModFromDatabase(newModId, con) {
    con.query("DELETE FROM moderators WHERE mod_id=" + newModId); //389188371337052162
}