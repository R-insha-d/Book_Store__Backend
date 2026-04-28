const multer=require('multer')

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./bookImages')
    },
    filename:(req,file,cb)=>{
        const filename=`Images-${Date.now()}-${file.originalname}`
        cb(null,filename)
    }
})

const fileFilter=(req,file,cb)=>{
    if(file.mimetype==="image/jpeg" || file.mimetype==="image/png" || file.mimetype==="image/jpg"){
        cb(null,true)
    }else{
        cb(null,false)
    }
}

const multerConfig=multer({storage,fileFilter})

module.exports=multerConfig