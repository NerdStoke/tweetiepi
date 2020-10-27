// change these two variables
let channel = process.env.TWITCH_CHANNEL || "nerdstoke";

module.exports = {
  // twitch channel to connect to
  channel,

  // Delay between each user can send a tweet
  timeToWait: 86400000,
};
