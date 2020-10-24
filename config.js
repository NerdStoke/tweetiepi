// change these two variables
let channel = process.env.TWITCH_CHANNEL || "nerdstoke";

let filteredCommands = [
  "democracy",
  "anarchy",];

let throttledCommands = [
  "shake",
];

module.exports = {
  // twitch channel to connect to
  channel,

  // If you need to filter the commands sent to the program
  // Ex: democracy/anarchy since they don't affect the program itself
  // Ex: ["democracy","anarchy","shake"]
  filteredCommands,

  // If you want to prevent people from using from command too often
  // Ex: ["shake"]
  throttledCommands,

  // Throttle time in seconds
  // Ex: you can limit 'shake' so it's only used once per day
  timeToWait: 86400000,

  // Delay between each knob turns in milliseconds so it can collect and average the inputs
  aggTime: 10000,
};
