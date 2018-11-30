const express = require('express')
const app = express()
const morgan = require('morgan')


//Switch Mongo or Not :D
//Settings
app.set('port', process.env.PORT || 4000)
//Middlewares
app.use(morgan('dev'))

//express.json before was apart package called body-parser
app.use(express.json())
//Routes
app.use('/api/',require('./routes/api'))
//Static Files
app.use(express.static(__dirname + '/public'))
//Server is Listening
app.listen(app.get('port') ,()=> {
    console.log('Server on port 4000')

})
