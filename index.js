const Discord = require("discord.js");
const client = new Discord.Client;
const config = require("./config.json");
const timerChannel = config.timerChannel;
const mysqlx = require('@mysql/xdevapi');
const dbConnection = mysqlx.getSession({
    user: config.dbUser,
    password: config.dbPassword,
    host: config.dbHost,
    port: config.dbPort
});

client.once('ready', () => {
    console.log('Ready!');
});

client.login(config.token);

client.on('message', message => {
    console.log(message.content);
    if (message.content.startsWith(`${config.prefix}d`)) {
        var numSides = message.content.slice(2);
        var result;
        console.log(numSides);
        if (numSides.length == 0) {
            console.log("Something's nyot quite right here!  You need to put the number of sides for the dice!");
        } else if (numSides < 1) {
            console.log("Something's nyot quite right here!  A die can't have zero or negative sides!");
        } else {
            result = Math.floor(Math.random() * numSides) + 1;
            message.channel.send(`Nya!  You rolled a ${result} on your ${numSides}-sided die!`);
        }
    }
    else if(message.content.startsWith(`${config.prefix}quack`)) {
        dbConnection.getSchema(config.dbSchema).getTable("Streamers").select(["*"]).execute(row => {message.channel.send(row)});
    }
});