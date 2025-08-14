require('dotenv').config();
const express = require('express')
const app = express()
const cors = require('cors')
const Stripe = require('stripe')
const Product = require('./model/productSchema');


const connectDB = require('./db/connectDB')
const categoryRouter = require('./routes/categoryRoute')
const brandRouter = require('./routes/brandRoutes')
const productRouter = require('./routes/productRoutes')
const customerRouter = require('./routes/customerRoutes')
const AuthRouter = require('./routes/authRoutes')
const WishListRouter = require('./routes/wishListRoute');
const CartRouter = require('./routes/CartRoutes');
const orderRouter = require('./routes/orderRoutes');
const adminOrderRouter = require('./routes/AdminOrder');
const commentRouter = require('./routes/commentRoutes');
const {isAdmin,authentication} = require('./middleware/authentication')


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));         

app.use(express.json())

app.use('/api/categories',authentication,isAdmin,categoryRouter);
app.use('/api/brand',authentication,isAdmin,brandRouter);
app.use('/api/product',authentication,productRouter);
app.use('/api/customer',customerRouter);
app.use('/api/auth',AuthRouter);
app.use('/api/wishlist',WishListRouter)
app.use('/api/cart',CartRouter);
app.use('/api/admin/order',adminOrderRouter);
app.use('/api/order',orderRouter);
app.use('/api/comment',commentRouter);


app.get('/',(req,res)=>{
  res.send('this is made by dev sharma');
})
app.get('/success',(req,res)=>{
  res.send('payment success');
})
app.get('/cancel',(req,res)=>{
  res.send('payment failed');
})

app.post("/create-checkout-session", async (req, res) => {
  const { items } = req.body;

  // Fetch product details from DB
  const productIds = items.map(i => i.productId);
  const products = await Product.find({ _id: { $in: productIds } });

  const lineItems = items.map(item => {
    const product = products.find(p => p._id.toString() === item.productId);
    return {
      price_data: {
        currency: "usd",
        product_data: { name: product.name },
        unit_amount: product.price * 100
      },
      quantity: item.quantity
    };
  });

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:4200/success",
      cancel_url: "http://localhost:4200/cancel"
    });
    res.json({ id: session.id });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});


const PORT = process.env.PORT;

const start = async() => {
  await connectDB(process.env.MONGO_URL);
  app.listen(PORT,()=>{
  console.log(`The server is listening on http://localhost:${PORT}`);
})
}

start();