require('dotenv').load()

const Botkit = require('botkit')
const sharedCode = require('./lib/handleWatsonResponse.js')();
const middleware = require('botkit-middleware-watson')({
    username: process.env.CONVERSATION_USERNAME,
    password: process.env.CONVERSATION_PASSWORD,
    workspace_id: process.env.WORKSPACE_ID,
    version: '2016-09-20'
})

const controller = Botkit.facebookbot({
    debug: true,
    log: true,
    access_token: process.env.FACEBOOK_PAGE_TOKEN,
    verify_token: process.env.FACEBOOK_VERIFY_TOKEN,
    app_secret: process.env.FACEBOOK_APP_SECRET,
    validate_requests: true
})

const bot = controller.spawn({
})

controller.setupWebserver(process.env.port || 4000, function(err, webserver) {
    controller.createWebhookEndpoints(webserver, bot, function() {
    })
})

controller.api.messenger_profile.greeting('Hello');
controller.api.messenger_profile.get_started('Hello');

controller.on('message_received', function (bot, message) {    
    middleware.interpret(bot, message, function (err) {
        if (!err) {           
            console.log("New Facebook request")
            console.log(message)
            sharedCode.handleWatsonResponse(bot, message, 'facebook');
        }
        else {            
            bot.reply(message, "I'm sorry, but for technical reasons I can't respond to your message");
        }
    })
})