const mongoose = require('mongoose')

const JobsSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    jobType:{
        type:String,
        required:true
    },
    salary:{
        type:String,
        required:true
    },
    qualification:{
        type:String,
        required:true
    },
    experience:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }
})  

const Jobs = mongoose.model("Jobs",JobsSchema)

module.exports = Jobs