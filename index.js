//importing and configuring dataenv for enviornment
require('dotenv').config()

//importing express.js module
const express=require('express')
const routes= require('./Routes/routes')
const cors=require('cors')

//Creating Serever app instance
const app=express()

//importing mongoose connection
require('./Connection/connection')

//configuring cors to use
app.use(cors())

//configuring json middileware into app
app.use(express.json())

//configuring routes into app
app.use(routes)

// setting static folder for uploaded images
app.use('/uploadImg',express.static('bookImages'))

//Setting a specefic port number
const PORT=3000

//Turning to listening node of server , so it turns
app.listen(PORT,(error)=>{
    if(error){
        console.log(error)
    }
    else{
        console.log(`Server running at http://localhost:${PORT}`)
    }
})