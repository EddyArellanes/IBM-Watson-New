const express = require('express')
const router = express.Router()
const Botkit = require('botkit')
const AssistantV1 = require('watson-developer-cloud/assistant/v1');
const sharedCode = require('../lib/HandleWatsonResponse')()
require('dotenv').load()
/*
Version is basically wherever you want
iam_apikey you can get in Watson/Assistant/Menu/View API Details/Service Credentials/Password. Password is the iam_apikey
url you can get it  Watson/Assistant/Menu/View API Details/Skill Details/Skill URL and copy until api

*/

const assistant = new AssistantV1({
  version: '2018-11-26',
  iam_apikey: '61lYsGDaoq6iIrBX8lndmWX4XG0Uq95nXTryWnpkJ4of',
  url: 'https://gateway.watsonplatform.net/assistant/api'
})
const middleware = require('botkit-middleware-watson')({
    username: process.env.CONVERSATION_USERNAME,
    password: process.env.CONVERSATION_PASSWORD,
    workspace_id: process.env.WORKSPACE_ID,
    version_date: '2018-11-28'
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

router.get('/', async(req, res) => {
    //res.send('API Tasks is goes here')
    //const tasks = await Task.find()
    console.log(assistant)
    assistant.message({
        workspace_id: '9032e579-4d2d-40d1-90b1-7a019bed3e31',
        input: {'text': 'Hello'}
      },  function(err, response) {
        if (err)
          console.log('error:', err);
        else
          console.log(JSON.stringify(response, null, 2));
    })
    
    res.json({greet:'hi'})
})
router.get('/:id', async(req, res) =>{
    const task = await Task.findById(req.params.id)
    res.json(task)
})

router.post('/', async(req, res) => {

    const task = new Task(req.body)
    await task.save()
    res.json({
        status: "Task Saved"
    })
})

router.put('/:id', async(req, res) => {
    //req.params get parameters in the url
    //console.log(req.params)
    await Task.findByIdAndUpdate(req.params.id, req.body)
    res.json({
        status: "Task Updated",      
    })
})

router.delete('/:id', async(req, res) =>{
    await Task.findByIdAndRemove(req.params.id)
    res.json({
        status: "Task Deleted"
    })
})
//Re-utilize in all app
module.exports = router