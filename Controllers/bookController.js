const books = require('../Models/bookModel')
const stripe = require('stripe')(process.env.STRIPE_SECRET)

// User Based Controllers


exports.addBook = async (req, res) => {
  // console.log("Add Book API")
  try {
    const { title, author, noOfPages, image, price, discountPrice, abstract, publisher, language, isbn, category } = req.body
    const uploadImg = []
    const userMail = req.payload
    req.files.map(item => { uploadImg.push(item.filename) })
    console.log(title, author, noOfPages, image, price, discountPrice, abstract, publisher, language, isbn, category, uploadImg, userMail)
    // console.log(req.Body)
    // console.log(req.files)
    const existingBook = await books.findOne({ userMail, title })
    console.log(existingBook)
    if (existingBook) {
      res.status(401).json("You Have already Added the book ")
    }
    else {
      const newBook = new books({
        title, author, noOfPages, image, price, discountPrice, abstract, publisher, language, isbn, category, uploadImg, userMail
      })
      await newBook.save()
      res.status(200).json("Book Added Successfully")
    }
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

// all books
exports.allBooksList = async (req, res) => {
  try {
    const userMail = req.payload
    const { search } = req.query
    console.log(search)
    let filter = {}
    search ? filter = { userMail: { $ne: userMail }, title: { $regex: search, $options: 'i' } } : filter = { userMail: { $ne: userMail } }
    const bookList = await books.find(filter)
    res.status(200).json(bookList)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }

}

// latest books
exports.getLatestBooks = async (req, res) => {
  try {
    const latestBooks = await books.find().sort({ _id: -1 }).limit(4)

    res.status(200).json(latestBooks)
    // console.log(latestBooks)    
  } catch (err) {
    res.status(500).json(err)
  }
}

// get book by id
exports.getBookById = async (req, res) => {
  try {
    const book = await books.findById(req.params.id)
    res.status(200).json(book)
  } catch (err) {
    res.status(500).json(err)
  }
}

// get logged in user's books
exports.getUserBooks = async (req, res) => {
  try {
    const userMail = req.payload
    const userBooks = await books.find({ userMail })
    res.status(200).json(userBooks)
  } catch (err) {
    res.status(500).json(err)
  }
}

// delete user added book by id
exports.deleteBookById = async (req, res) => {
  try {
    const { id } = req.params
    const deleteBook = await books.findByIdAndDelete(id)
    res.status(200).json("Book Deleted Successfully")
  }
  catch (err) {
    res.status(500).json(err)
  }
}

// get purchased books by user mail
exports.getPurchasedBooks = async (req, res) => {
  try {
    const userMail = req.payload
    const purchasedBooks = await books.find({ bought: userMail })
    res.status(200).json(purchasedBooks)
  } catch (err) {
    res.status(500).json(err)
  }
}

// Payment integration
exports.StipePaymentIntegration = async (req,res) => {
  try {
    const email = req.payload
    const { _id, title, author, noOfPages, image, price, discountPrice, abstract, publisher, language, isbn, category, userMail } = req.body
    const updateBook = await books.findByIdAndUpdate({ _id }, { _id, title, author, noOfPages, image, price, discountPrice, abstract, publisher, language, isbn, category, userMail, bought: email, status: "sold" }, { new: true })
    // checkout session
    const line_items = [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: title,
          images: [image],
          description: `${author} | ${publisher}`
          
        },
        unit_amount: Math.round(discountPrice * 100)
      },
      quantity: 1
    }]
    const metadata = {
      _id, title, author, noOfPages, image, price, discountPrice, abstract, publisher, language, isbn, category, userMail, bought: email, status: "sold"
    }
    const session = await stripe.checkout.sessions.create({
      success_url: "https://book-store-full-stack-two.vercel.app/payment-success",
      cancel_url: "https://book-store-full-stack-two.vercel.app/payment-failed",
      payment_method_types: ['card','upi'],
      line_items,
      metadata,
      mode: "payment"
    })
    // console.log(session)
    res.status(200).json({checkoutPayment:session?.url})
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}







// ****************** Admin Based Conrollers *************************


exports.getAllAdminBooks = async (req, res) => {
  try {
    const booklist = await books.find()
    res.status(200).json(booklist)
  }
  catch (err) {
    res.status(500).json(err)
  }
}

// approve book by id
exports.approveBookById = async (req, res) => {
  try {
    const { id } = req.params
    const approveBook = await books.findByIdAndUpdate(id, { status: "approved" }, { new: true })
    approveBook.save()
    res.status(200).json(approveBook)
  }
  catch (err) {
    res.status(500).json(err)
  }
}