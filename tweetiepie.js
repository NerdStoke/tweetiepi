const tmi = require("tmi.js");
const config = require("./config.js");
let exec = require("child_process").exec;

// https://github.com/tmijs/tmi.js#tmijs


// setup client
const client = new tmi.client({
  connection: {
    secure: true,
    reconnect: true,
  },
  channels: [config.channel],
});


// init arrays
var leftArray = [];
var rghtArray = [];

// add to arrays when valid message is sent
client.on("message", function aggCommands(channel, tags, message, self) {
  // console.log(`@${tags.username}: ${message}`);
  let isCorrectChannel = `#${config.channel}` === channel;
  let messageMatches = message.match(/\-?\d+/g);
  if (self) return;
  if (messageMatches != null) {
    if (isCorrectChannel && messageMatches[0] && messageMatches[1]) {
      leftArray.push(parseInt(messageMatches[0]));
      rghtArray.push(parseInt(messageMatches[1]));
    }
  }
});


// function execute the command to turn knobs
function execPython(){
  if (leftArray.length != 0) {

    var leftCmd = String(average(leftArray));
    var rghtCmd = String(average(rghtArray));

    let python_command = "python3 etch.py "+leftCmd+" "+rghtCmd
    // console.log(python_command)

    exec(python_command)

    // reset arrays
    leftArray = [];
    rghtArray = [];
  }
};


// comand averaging function
function average(array){
  var total = 0;
  for(var i = 0; i < array.length; i++) {
    total += array[i];
  }
  return total / array.length;
};


// run the python command in intervals defined in config file
setInterval(execPython,config.aggTime);


client.addListener("connected", function (address, port) {
  console.log("Connected! Waiting for messages..");
});

client.addListener("disconnected", function (reason) {
  console.log("Disconnected from the server! Reason: " + reason);
});

client.connect();
if (config.channel === 'nerdstoke') {
  console.log("");
  console.log("'nerdstoke' is the default channel! Otherwise, run with the environment variable: ");
  console.log("TWITCH_CHANNEL=mychannelhere npm start");
  console.log("");
}
console.log(`Connecting to /${config.channel}..`);
