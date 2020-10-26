
// https://github.com/tmijs/tmi.js#tmijs
const tmi = require("tmi.js");
const config = require("./config.js");
const keys = require("./key.conf.js");


// setup client
const client = new tmi.client({
  connection: {
    secure: true,
    reconnect: true,
  },
  channels: [config.channel],
});


client.on("message", function aggCommands(channel, tags, message, self) {
  if (tags.username.toLowerCase() != "streamelements") {
    let isCorrectChannel = `#${config.channel}` === channel;
    let messageMatches = message.match(/(^\!tweet\:\s)(.*)/);
    if (self) return;
    if (messageMatches != null) {
      if (isCorrectChannel && messageMatches[2]) {
        let tweet = messageMatches[2]
        console.log(`Twitch user ${tags.username} says: ${tweet}`);
      }
    }
  }
});




client.addListener("connected", function (address, port) {
  console.log("Connected! Waiting for messages..");
});

client.addListener("disconnected", function (reason) {
  console.log("Disconnected from the server! Reason: " + reason);
});

client.connect();
if (config.channel === 'nerdstoke') {
  console.log("\n'nerdstoke' is the default channel! Otherwise, run with the environment variable: ");
  console.log("TWITCH_CHANNEL=mychannelhere npm start\n");
}
console.log(`Connecting to /${config.channel}..`);
