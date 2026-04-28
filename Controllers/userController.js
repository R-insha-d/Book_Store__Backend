const users=require('../Models/userModel')
const jwt=require('jsonwebtoken')
exports.signup=async(req,res)=>{
    try{
        const {username,password,email}=req.body
        console.log(req.body)
        if(!username || !email || !password){
        res.status(400).json("Invalid Data ")
        }
        else{
            const existuser=await users.findOne({email})
            if(existuser){
                res.status(400).json("User Already exist")
            }
            else{
                const user=new users({
                    username:username,email:email,password:password
                })
                await user.save()
                res.status(200).json("Signup Success")
            }
        }
    }
    catch(err){
        console.log(err)
        res.status(404).json("Something went Wrong!!")
    }
    
}
exports.signin=async(req,res)=>{
    const {password,email}=req.body
    if(!email || !password){
        res.status(400).json("Invalid Data")
    }
    else{
        const user=await users.findOne({email,password})
        if(user){
            const token=jwt.sign({email:user?.email,role:user?.role},process.env.SECURITY_KEY)
            res.status(200).json({token,username:user?.username,profile:user?.profile,role:user?.role,bio:user?.bio})
        }
        else{
            res.status(400).json("Invalid Email/Password")
        }
        
    }
}
exports.googleSignin=async(req,res)=>{
    try{
        const {username,email,profile}=req.body
        const existingUser=await users.findOne({email})
        let role=""
        if(!existingUser){
            const newUser=new users({
                username,email,profile
            })
            await newUser.save()
            role=newUser?.role
        }
        else{
            role=existingUser?.role
        }
        const token=jwt.sign({email:email,role:role},process.env.SECURITY_KEY)
        res.status(200).json({token, username:username,profile:profile,role,bio:existingUser?.bio})
    }
    catch(err){
        console.log(err)
        res.status(404).json(err)
    }
}

exports.getProfile=async(req,res)=>{
    try{
        const email=req.payload
        const userProfile=await users.findOne({email})
        res.status(200).json(userProfile)
    }
    catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}


exports.profileUpdate = async(req,res)=>{
    try{
        const {username,password,bio,profile,role} = req.body
        const profilePicture = req.file ? req.file.filename : profile
        const email = req.payload
        const updatedUser = await users.findOneAndUpdate({email}, {username,email, password, bio, profile: profilePicture, role}, {new: true})
        updatedUser.save()
        res.status(200).json(updatedUser)
    }
    catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}

// Admin based Controllers

exports.getAdminAllUsers=async(req,res)=>{
    try{
        const userMail=req.payload
        const userList=await users.find({email:{$ne:userMail}})
        res.status(200).json(userList)
    }   
    catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}