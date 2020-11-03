# tweetiepi

## You legit can give your twitch chat the ability to control your channel

This is the code that runs on the Raspberry Pi Zero W.  
It is a node app and I use pm2 to keep it up and running.  
If you are wondering why I listen to twitch to send commands to the pi instead of funneling user traffic straight to it through a web server or something, it is because I don't know how many people would be connecting to it at a time. This way, there is only one point of connection to the pi and one source of commands going to the GPIOs


## Node Requirements
Just use npm to install these...
- `tmi`
- `twitter`
- `pm2`


## Configuration
- After everything is installed, it is just a matter of changing the twitch channel in the `config.js` file and setting the timeToWait variable to whatever you want it to be - currently it is 24 hours.

- The next part of configuration is just to create a file called `key.conf.js` and add the following.
```
let twitter_api_key = "your twitter_api_key here";
let twitter_secret_key = "your twitter_secret_key here";
let twitter_access_token = "your twitter_access_token here";
let twitter_access_token_secret = "your twitter_access_token_secret here";

let twitch_bot_username = "your twitch_bot_username here";
let twitch_chat_oauth = "your twitch_chat_oauth here";
let twitch_channel_name = "your twitch_channel_name here";


module.exports = {
  twitter_api_key,
  twitter_secret_key,
  twitter_access_token,
  twitter_access_token_secret,
  twitch_client_id,
  twitch_client_secret,
  twitch_chat_oauth,
  twitch_channel_name,
  twitch_bot_username
};
```
- Create developer accounts on twitch and twitter in order to make your own keys. 


## Running
- Run it with `node tweetiepi.js` or if you are using pm2, `pm2 tweetiepi.js`


## Usage In Chat

### To Tweet
- `!tweet: <<user tweet here>>`

### To check next available tweet time
- `!tweettime`