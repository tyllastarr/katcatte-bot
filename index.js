const Discord = require("discord.js");
const client = new Discord.Client;
const config = require("./config.json");
const timerChannel = config.timerChannel;
const mysqlx = require("@mysql/xdevapi");
const log4js = require("log4js");
var dbSession;

log4js.configure({
    appenders: {
        file: { type: "file", filename: "katcatte.log" },
        out: { type: "stdout" }
    },
    categories: { default: { appenders: ["file", "out"], level: "debug" } }
});
const logger = log4js.getLogger("katcatte");

client.once("ready", () => {
    mysqlx.getSession({
        user: config.dbUser,
        password: config.dbPassword,
        host: config.dbHost,
        port: config.dbPort,
        schema: config.dbSchema
    }).then(session => { dbSession = session });
    logger.info("Ready!");
});


client.login(config.token);

client.on("message", message => {
    console.log(message.content);
    if (message.content.startsWith(`${config.prefix}d`)) {
        var numSides = message.content.slice(2);
        var result;
        console.log(numSides);
        if (numSides.length == 0) {
            logger.error("Something's nyot quite right here!  You need to put the number of sides for the dice!");
        } else if (numSides < 1) {
            logger.error("Something's nyot quite right here!  A die can't have zero or negative sides!");
        } else {
            result = Math.floor(Math.random() * numSides) + 1;
            message.channel.send(`Nya!  You rolled a ${result} on your ${numSides}-sided die!`);
        }
    }
    else if (message.content.startsWith(`${config.prefix}quack`)) {
        dbSession.sql("SELECT Streamers.StreamerName, Streamers.StreamLink, Streams.StreamDescription, Reminders.Hour, Reminders.Minute, Reminders.DayOfWeek FROM Reminders INNER JOIN Streams ON Reminders.StreamID=Streams.StreamID INNER JOIN Streamers ON Streams.StreamerID=Streamers.StreamerID").execute(row => {
            message.channel.send(row);
        });
    }
});