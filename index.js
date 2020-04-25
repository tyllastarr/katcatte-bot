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
const logger = log4js.getLogger();

var streams = [];

client.once("ready", () => {
    mysqlx.getSession({
        user: config.dbUser,
        password: config.dbPassword,
        host: config.dbHost,
        port: config.dbPort,
        schema: config.dbSchema
    }).then(session => {
        dbSession = session;
        dbSession.sql("SELECT Streamers.StreamerName, Streamers.StreamLink, Streams.StreamDescription, Reminders.Hour, Reminders.Minute, Reminders.DayOfWeek FROM Reminders INNER JOIN Streams ON Reminders.StreamID=Streams.StreamID INNER JOIN Streamers ON Streams.StreamerID=Streamers.StreamerID").execute(row => {
            streams.push({ streamer: row[0], link: row[1], desc: row[2], hour: row[3], minute: row[4], day: row[5] });
            //           logger.debug(`Hour: ${row[3]}.  Minute: ${row[4]}.  Day of week: ${row[5]}`);
            //           logger.debug(streams);
        });
        logger.info("Ready!");
        setInterval(function () {
            //            logger.debug("A minute has passed.");
            let now = new Date();
            let currentHour = now.getHours();
            let currentMinute = now.getMinutes();
            let currentDay = now.getDay();
            //            logger.debug(currentHour);
            //            logger.debug(currentMinute);
            //            logger.debug(currentDay);
            streams.forEach(function (item, index) {
                if (item.hour == currentHour && item.minute == currentMinute && item.day == currentDay) {
//                    logger.warn(`Match!  Stream time is day ${item.day} at ${item.hour}:${item.minute}.  Current time is day ${currentDay} at ${currentHour}:${currentMinute}.`);
                    client.channels.get(timerChannel).send(`Nya!  ${item.streamer} is streaming ${item.desc} at ${item.link}!`);
                }
                else {
 //                   logger.info(`No match!  Stream time is day ${item.day} at ${item.hour}:${item.minute}.  Current time is day ${currentDay} at ${currentHour}:${currentMinute}.`);
                }
                //                logger.debug(item);
            });
        }, 60000);
    });
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
    /*    else if (message.content.startsWith(`${config.prefix}quack`)) {
            dbSession.sql("SELECT Streamers.StreamerName, Streamers.StreamLink, Streams.StreamDescription, Reminders.Hour, Reminders.Minute, Reminders.DayOfWeek FROM Reminders INNER JOIN Streams ON Reminders.StreamID=Streams.StreamID INNER JOIN Streamers ON Streams.StreamerID=Streamers.StreamerID").execute(row => {
                message.channel.send(row);
                logger.debug(row[3]);
            });
        }*/
});