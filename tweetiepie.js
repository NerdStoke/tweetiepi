
const config = require("./config.js");
const keys = require("./key.conf.js");

// https://github.com/tmijs/tmi.js#tmijs
const tmi = require("tmi.js");
var Twitter = require('twitter');


// setup client
const twitch_client = new tmi.client({
  connection: {
    // secure: true,
    reconnect: true,
  },
  identity: {
    username: keys.twitch_bot_username,
    password: keys.twitch_chat_oauth
  },
  channels: [config.channel],
});

const twitter_client = new Twitter({
  consumer_key: keys.twitter_api_key,
  consumer_secret: keys.twitter_secret_key,
  access_token_key: keys.twitter_access_token,
  access_token_secret: keys.twitter_access_token_secret
});

twitch_client.connect();



var users = {}


twitch_client.on("message", function aggCommands(channel, tags, message, self) {
  let user = tags.username;
  let can_tweet = true
  if (user.toLowerCase() != "streamelements") {
    let isCorrectChannel = `#${config.channel}` === channel;
    let messageMatches = message.match(/(^\!tweet\:\s)(.*)/) || message.match(/^(\!yes|\!no)$/) || message.match(/^(\!tweettime)$/);
    if (self) {return;}
    if (isCorrectChannel && messageMatches != null) {
      if (users[user] == undefined) {
        users[user] = {};
      }
      if (users[user]['last_tweet'] != undefined) {
        let time_left = new Date().getTime() - users[user]['last_tweet'];
        if (time_left < config.timeToWait) {
          can_tweet = false;
        }
      }
      if (messageMatches[1] == '!tweettime') {
        if (users[user]['last_tweet'] == undefined) {
          twitch_client.say(keys.twitch_channel_name, `@${user}, you can tweet now.`);
        } else {
          time_remaining = time_conversion(config.timeToWait - (new Date().getTime() - users[user]['last_tweet']));
          if (time_remaining <= 0) {
            twitch_client.say(keys.twitch_channel_name, `@${user}, you can tweet now.`);
          } else {
            twitch_client.say(keys.twitch_channel_name, `@${user}, you can tweet again in ${time_remaining}.`);
          }
        }
      }
      if (can_tweet) { 
        if (messageMatches[1] == '!tweet ') {
          users[user]['tweet'] = `Twitch user ${user} says: ${messageMatches[2]}`;
          confirm_tweet(users[user]['tweet'],user);
        }
        else if (users[user]['tweet'] != null && messageMatches[1] == '!yes') {
          twitter_client.post('statuses/update', {status: users[user]['tweet']});
          twitch_client.say(keys.twitch_channel_name, `@${user}, your tweet was sent to @Nerdstoke's twitter. You can tweet again in 24 hours.`);
          users[user]['last_tweet'] = new Date().getTime();
          delete users[user]['tweet'];
        }
        else if (users[user]['tweet'] != null && messageMatches[1] == '!no') {
          cancel_tweet(users[user]['tweet'],user);
        }
      }
    }
  }
});


function confirm_tweet(tweet, user){
  var confirmation = `@${user}, confirm tweet: "${tweet}" to be sent to @NerdStoke twitter account. !yes to confirm; !no to cancel.`;
  twitch_client.say(keys.twitch_channel_name, confirmation);
};


function cancel_tweet(tweet, user){
  delete users[user]['tweet'];
  var cancellation = `@${user}, your tweet was cancelled.`;
  twitch_client.say(keys.twitch_channel_name, cancellation);
};


function time_conversion(time) {
  var seconds = (time / 1000).toFixed(1);
  var minutes = (time / (1000 * 60)).toFixed(1);
  var hours = (time / (1000 * 60 * 60)).toFixed(1);
  var days = (time / (1000 * 60 * 60 * 24)).toFixed(1);
  if (seconds < 60) {
    return seconds + " Sec";
  } else if (minutes < 60) {
    return minutes + " Min";
  } else {
    return hours + " Hrs";
  }
};


twitch_client.addListener("connected", function (address, port) {
  console.log("Connected! Waiting for messages..");
});

twitch_client.addListener("disconnected", function (reason) {
  console.log("Disconnected from the server! Reason: " + reason);
});

if (config.channel === 'nerdstoke') {
  console.log("\n'nerdstoke' is the default channel! Otherwise, run with the environment variable: ");
  console.log("TWITCH_CHANNEL=mychannelhere npm start\n");
}
console.log(`Connecting to /${config.channel}..`);
