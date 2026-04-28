const express=require('express')


const userController=require('../Controllers/userController')
const bookController=require('../Controllers/bookController')
const multerConfig=require('../Middlewares/multerMiddleware')
const jobController=require('../Controllers/jobController')
const pdfMulterConfig=require('../Middlewares/applicationJwtMiddleware')


const jwtMiddle=require('../Middlewares/jwtMiddlewares')
const adminMiddle=require('../Middlewares/adminJwtMiddleware')
const applicationController=require('../Controllers/applicationController')



const router=express.Router()

// users based routes


router.post('/signup',userController.signup)
router.post('/signin',userController.signin)
router.post('/google-login',userController.googleSignin)

// get user profile details
router.get('/get-profile',jwtMiddle,userController.getProfile)

// user profile update
router.put('/update-profile',jwtMiddle,multerConfig.single('profile'),userController.profileUpdate)

// add books routes
router.post('/add-book',jwtMiddle,multerConfig.array(`uploadImg`,3),bookController.addBook)

// all books list
router.get('/all-books',jwtMiddle,bookController.allBooksList)

// get book by id
router.get('/getbookbyid/:id',jwtMiddle,bookController.getBookById)

// latest books
router.get('/latest-books',bookController.getLatestBooks)

// get logged in user's books
router.get('/user-books',jwtMiddle,bookController.getUserBooks)

// get purchased books
router.get('/purchased-books',jwtMiddle,bookController.getPurchasedBooks)

// delete user added book by id
router.delete('/delete-book/:id/delete',jwtMiddle,bookController.deleteBookById)

// get all Job post for user careerlist
router.get('/list/jobpost',jwtMiddle,jobController.getAllJobPost)

// job application route
router.post('/apply-jopbpost',jwtMiddle,pdfMulterConfig.single('resume'),applicationController.addApplication)

// purchase route
router.post('/purchase-book',jwtMiddle,bookController.StipePaymentIntegration)



// ================== ***************** =====================



// Admin based Routes

router.get('/admin/get-books',adminMiddle,bookController.getAllAdminBooks)

// get all users for admin
router.get('/admin/get-users',adminMiddle,userController.getAdminAllUsers)

// approve book by id
router.patch('/admin/approve-book/:id',adminMiddle,bookController.approveBookById)

// add job post
router.post('/admin/add-job',adminMiddle,jobController.addJobPost)

// get all Job post
router.get('/admin/get-post',adminMiddle,jobController.getAllJobPost)

// delete job post by id
router.delete('/admin/delete-jobpost/:id',adminMiddle,jobController.deleteJopPost)

// application List
router.get('/admin/get-application',adminMiddle,applicationController.listApplication)


module.exports=router