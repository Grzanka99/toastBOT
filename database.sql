CREATE DATABASE IF NOT EXISTS discordbot;

CREATE USER 'discordbot'@'localhost' IDENTIFIED BY 'haslo';
GRAND ALL PRIVILEGES ON discordbot.* TO 'discordbot'@'localhost';

USE discordbot;

CREATE TABLE IF NOT EXISTS users (id int(255) PRIMARY KEY auto_increment, user_id bigint, time int);
CREATE TABLE IF NOT EXISTS moderators (id int PRIMARY KEY auto_increment, mod_id bigint, perm int);
CREATE TABLE IF NOT EXISTS roles (id int PRIMARY KEY auto_increment, role_name text, perm int);
CREATE TABLE IF NOT EXISTS commands (id int PRIMARY KEY auto_increment, cmd_name text, cmd_desc text);

INSERT INTO moderators (mod_id, perm) VALUES (--moje id na discordzie--);

INSERT INTO commands (cmd_name, cmd_desc) VALUES 
("?help","Wyswietla to okno."),
("?time","Wyswietla twoj czas na spedzony na kanale glosowym."),
("?id","Podaje Ci twoje ID na discordzie."),
("?addRole","Dodaje role uzytkownikowi"),
("?removeRole","Usuwa role uzytkownikowi"),
("?addMod","Dodaje moderatora w bazie BOTa"),
("?removeMod","Usuwa moderatora z bazy BOTa");

INSERT INTO roles (role_name, perm) VALUES

("User","1"),
("asd","2");

-- INSERT INTO commands (cmd_name, cmd_desc) VALUES ("","") --
-- INSERT INTO roles (role_name, perm) VALUES ("","")--