const Discord = require("discord.js");
const client = new Discord.Client;
const config = require("./config.json");

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
            console.log("Error: No parameters");
        } else if (numSides < 1) {
            console.log("Error: Dice cannot have zero or negative sides");
        } else {
            result = Math.floor(Math.random() * numSides) + 1;
            message.channel.send(`You rolled a ${result} on your ${numSides}-sided die!`);
        }
    }
});