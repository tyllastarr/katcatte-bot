const Discord = require("discord.js");
const client = new Discord.Client;
const config = require("./config.json");

client.once('ready', () => {
	console.log('Ready!');
});

client.login(config.token);

client.on('message', message => {
	console.log(message.content);
});