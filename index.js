var Botkit = require('botkit');

var token = process.env.SLACK_TOKEN;

var controller = Botkit.slackbot({
  // reconnect to Slack RTM when connection goes bad
  retry: Infinity,
  debug: false
});

// Assume single team mode if we have a SLACK_TOKEN
if (token) {
  console.log('Starting in single-team mode');
  controller.spawn({
    token: token
  }).startRTM(function (err, bot, payload) {
    if (err) {
      throw new Error(err)
    }

    console.log('Connected to Slack RTM')
  });
// Otherwise assume multi-team mode - setup beep boop resourcer connection
} else {
  console.log('Starting in Beep Boop multi-team mode');
  require('beepboop-botkit').start(controller, { debug: true })
}

controller.on('bot_channel_join', function (bot, message) {
  bot.replyWithTyping(message, "Hey gozaaahs");
});

controller.hears(['hey', 'hoi', 'hallo'], ['direct_message','direct_mention','mention'], function (bot, message) {

  controller.storage.users.get(message.user, function(err, user) {
    if (user && user.name) {
      bot.replyWithTyping(message, 'Hey '+ user.name);
    } else {
      bot.replyWithTyping(message, 'Hey man');
    }
  });

  bot.replyWithTyping(message, 'Alles lekkah?');

});

function replyWithRustagh(bot, message){
  var text = "Hey! Rustaaaaagh!";
  bot.reply(message, {
    attachments: [{
      "fallback": text,
      "text": text,
      "image_url": "http://i.makeagif.com/media/9-14-2015/_NQtSL.gif"
    }]
  });
}

controller.hears(['Je lijkt wel een tomaat', 'Rooie'],['direct_message','direct_mention','mention'],function(bot,message) {
  replyWithRustagh(bot,message);
});

controller.hears(['Je ziet er niet uit'],['direct_message','direct_mention','mention'],function(bot,message) {
  bot.reply(message,"Moej een tuintje op je buik ofzo?");
});

controller.hears(['Wat eet je het liefst?'],['direct_message','direct_mention','mention'],function(bot,message) {
  bot.reply(message,"Wat denk jij dan gek?");
  bot.replyWithTyping(message, "Besguitstuiter met sallûf natuurlijk!");
});

