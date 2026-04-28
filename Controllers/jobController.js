const jobs = require('../Models/jobModel')

// add Job Post

exports.addJobPost = async (req, res) => {
    try {
        const { title, location, jobType, salary, qualification, experience, description } = req.body
        const existingJob = await jobs.findOne({ title: title, location: location })
        if (existingJob) {
            res.status(400).json("Job Post Already Exist")
        }
        else {
            const newJob = new jobs({
                title, location, jobType, salary, qualification, experience, description
            })
            await newJob.save()
            res.status(200).json(newJob)
        }
    }
    catch (err) {
        console.log(err)
        res.status(400).json(err)
    }
}

// get all job posts
exports.getAllJobPost = async (req, res) => {
    try {
        const { search } = req.query
        console.log(search)
        let filter = {}
        search ? filter = { title: { $regex: search, $options: 'i' } } : filter = {}

        const jobPosts = await jobs.find(filter)
        res.status(200).json(jobPosts)
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

// remove job post by id
exports.deleteJopPost = async (req,res) => {
    try{
        const {id} = req.params
        const jobPost = await jobs.findByIdAndDelete(id)
        res.status(200).json(jobPost)
    }
    catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}