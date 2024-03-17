const express = require('express');
const server = express();
const path = require('path');
const mongoose = require('mongoose');
const session =require('express-session');
const passport=require('passport');
const crypto=require('crypto');
require('dotenv').config()
const cookieParser=require('cookie-parser');
const productRouters=require('./routes/Products')
const categoriesRouter = require('./routes/Categories');
const brandsRouter = require('./routes/Brands');
const usersRouter = require('./routes/Users');
const authRouter = require('./routes/Auth');
const cartRouter = require('./routes/Cart');
const ordersRouter = require('./routes/Order');
const cors=require('cors');
const LocalStrategy=require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const   ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');

const { User } = require('./model/User');
const {isAuth,sanitizeUser,cookieExtractor}= require('./services/common');
const { Order } = require('./model/Order');
const opts = {}
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.JWT_SECRET_KET; 


server.use(express.static(path.join(__dirname, 'build')));

server.use(cookieParser())
server.use(session({
    secret: 'keyboard cat',
    resave: false, 
    saveUninitialized: false, 
  }));
server.use(passport.authenticate('session'));
server.use(cors({
    exposedHeaders:['X-Total-Count']
}));

  // webhook

  const endpointSecret =process.env.ENDPOINT_SECRET;
  server.post('/webhook', express.raw({type: 'application/json'}),async (request, response) => {
    const sig = request.headers['stripe-signature'];
    let event;
    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntentSucceeded = event.data.object;
        const order=await Order.findById(paymentIntentSucceeded.metadata.order_id);
        order.paymentStatus='received';
        await order.save()
        // Then define and call a function to handle the event payment_intent.succeeded
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    // Return a 200 response to acknowledge receipt of the event
    response.send();
  });

server.use(express.json());
server.use('/products',isAuth(),productRouters.router);
server.use('/categories',isAuth(),categoriesRouter.router);
server.use('/brands',isAuth(),brandsRouter.router);
server.use('/users',isAuth(), usersRouter.router)
server.use('/auth', authRouter.router)
server.use('/cart',isAuth(), cartRouter.router)
server.use('/orders',isAuth(), ordersRouter.router)

passport.use('local',new LocalStrategy(
    {usernameField:'email'},
   async   function(email, password, done) {
        try {
            
            const user = await User.findOne(
              { email: email }
            ).exec();
            if (!user) {
              done(null,false,{ message: 'invalid credentials' });
            }
            const salt = crypto.randomBytes(16);
            crypto.pbkdf2(
                password,
                user.salt,
                310000, 
                32, 
                'sha256',
            async function(err, hashedPassword){
              if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
               return done(null,false,{ message: 'invalid credentials' });
            } 
                const token = jwt.sign(sanitizeUser(user), process.env.JWT_SECRET_KET);
                done(null,{id:user.id,role:user.role,token});
            
           });
          } catch (err) {
            done(err);
          }
      }
    
  ));

  passport.use('jwt',new JwtStrategy(opts, async function(jwt_payload, done) {

    try{
        const user= await User.findById( jwt_payload.id);
        if (user) {
            return done(null, sanitizeUser(user));
        } else {
            return done(null, false);
           
        }
    
    }catch(err){
        return done(err, false);
    }
}));
  passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, {id:user.id, role:user.role});
    });
  }); 
  
  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });

  const stripe = require("stripe")(process.env.STRIPE_SERVER_KEY);
  

 
  server.post("/create-payment-intent", async (req, res) => {
    const { totalAmount,selectedAddress,id} = req.body;
    const {name,street,city,state,pinCode}=selectedAddress;
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount*100,
      
      currency: "inr",
      description: 'product buying',
      shipping: {
        name: name,
        address: {
          line1: street,
          postal_code: pinCode,
          city: city,
          state: state,
          country: 'US',
        },
      },
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
      metadata:{
        order_id:id
      }
    });
  
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  });  
  



server.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

main().catch(err=> console.log(err));

async function main(){
    await mongoose.connect(process.env.MONGOBD_URL);
    console.log('database connected')   
}





server.listen(process.env.PORT, ()=>{
    console.log('server started')
});