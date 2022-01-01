const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const fileUpload = require('express-fileupload');

const Stripe = require('stripe');
const stripe = Stripe(`${process.env.STRIPE_SECRET}`);

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.f1hps.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('heroRider');
        const learnerCollection = database.collection('learners');
        const riderCollection = database.collection('riders');
        const packageCollection = database.collection('packages');
        const orderCollection = database.collection('orders');
    
        // POST API FOR LEARNERS
        app.post('/learners', async (req, res) => {
            const name = req.body.name;
            const email = req.body.email;
            const age = req.body.age;
            const address = req.body.address;
            const phone = req.body.phone;
            const nidImg = req.files.nidImg;
            const nidImgData = nidImg.data;
            const encodedNidImg = nidImgData.toString('base64');
            const nidImageBuffer = Buffer.from(encodedNidImg, 'base64');

            const profileImg = req.files.profileImg;
            const profileImgData = profileImg.data;
            const encodedProfileImg = profileImgData.toString('base64');
            const profileImageBuffer = Buffer.from(encodedProfileImg, 'base64');

            const learner = {
                name,
                email,
                age,
                address,
                phone,
                type: "learner",
                status: "Active",
                role: "User",
                nidImg: nidImageBuffer,
                profileImg: profileImageBuffer
            }
            const result = await learnerCollection.insertOne(learner);
            res.json(result);
        });    

        // POST API FOR RIDERS
        app.post('/riders', async (req, res) => {
            const name = req.body.name;
            const email = req.body.email;
            const age = req.body.age;
            const address = req.body.address;
            const phone = req.body.phone;

            const drivingLicenceImg = req.files.drivingLicenceImg;
            const drivingLicenceImgData = drivingLicenceImg.data;
            const encodedDrivingLicenceImg= drivingLicenceImgData.toString('base64');
            const drivingLicenceImgBuffer = Buffer.from(encodedDrivingLicenceImg, 'base64');

            const area = req.body.area;

            const nidImg = req.files.nidImg;
            const nidImgData = nidImg.data;
            const encodedNidImg = nidImgData.toString('base64');
            const nidImageBuffer = Buffer.from(encodedNidImg, 'base64');

            const profileImg = req.files.profileImg;
            const profileImgData = profileImg.data;
            const encodedProfileImg = profileImgData.toString('base64');
            const profileImageBuffer = Buffer.from(encodedProfileImg, 'base64');

            const carName = req.body.carName;
            const carModel = req.body.carModel;
            const carNamePlate = req.body.carNamePlate;

            const rider = {
                name,
                email,
                age,
                address,
                phone,
                type: "rider",
                status: "Active",
                role: "User",
                drivingLicenceImg: drivingLicenceImgBuffer,
                area,
                nidImg: nidImageBuffer,
                profileImg: profileImageBuffer,
                carName,
                carModel,
                carNamePlate
            }
            const result = await riderCollection.insertOne(rider);
            res.json(result);
        });

         // GET PACKAGES API 
         app.get('/packages', async (req, res) => {
            const cursor = packageCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
        });

        // GET API FOR A SINGLE PACKAGE
        app.get('/packages/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const package = await packageCollection.findOne(query);
            res.json(package);
        });
        
        // GET RIDER INFO
        app.get('/riders', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
        
            const cursor = riderCollection.find(query);
            const rider = await cursor.toArray();
            res.json(rider);
        });

        // GET LEARNER INFO
        app.get('/learners', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
        
            const cursor = learnerCollection.find(query);
            const learner = await cursor.toArray();
            res.json(learner);
        });

        // POST API FOR ORDERS
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const newOrder = {...order, status: "Pending"};
            const result = await orderCollection.insertOne(newOrder);
            // console.log("new order added");
            res.json(result);
        });

         // GET RIDER USERS API 
         app.get('/riderUsers', async (req, res) => {
            const cursor = riderCollection.find({});
            const riders = await cursor.toArray();
            res.send(riders);
        });

         // GET RIDER USERS API 
         app.get('/learnerUsers', async (req, res) => {
            const cursor = learnerCollection.find({});
            const learners = await cursor.toArray();
            res.send(learners);
        });

        // UPDATE API FOR USERS
        app.put('/riderUsers/:id', async (req, res) => {
            const id = req.params.id;
            const updatedRider = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    status: updatedRider.status
                }
            };
            const result = await riderCollection.updateOne(filter, updatedDoc, options);
            res.json(result);
        });

        // UPDATE API FOR USERS
        app.put('/riderUsers/:id', async (req, res) => {
            const id = req.params.id;
            const updatedRider = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    role: updatedRider.role
                }
            };
            const result = await riderCollection.updateOne(filter, updatedDoc, options);
            res.json(result);
        });

        // UPDATE API FOR USERS
        app.put('/learnerUsers/:id', async (req, res) => {
            const id = req.params.id;
            const updatedLearner = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    status: updatedLearner.status
                }
            };
            const result = await learnerCollection.updateOne(filter, updatedDoc, options);
            res.json(result);
        });

        // UPDATE API FOR USERS
        app.put('/learnerUsers/:id', async (req, res) => {
            const id = req.params.id;
            const updatedLearner = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    role: updatedLearner.role
                }
            };
            const result = await learnerCollection.updateOne(filter, updatedDoc, options);
            res.json(result);
        });

        // STRIPE PAYMENT API
        app.post('/create-payment-intent', async (req, res) => {
            const paymentInfo = req.body;
            const amount = paymentInfo.price * 100;
          
            const paymentIntent = await stripe.paymentIntents.create({
              amount: amount,
              currency: 'usd',
              payment_method_types: ['card']
            });
            // console.log(paymentIntent.client_secret)
            res.send({
              clientSecret: paymentIntent.client_secret,
            });
          });
    

    }
    finally {
        // await client.close();
    }

}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("Hero Rider Server in running");
});

app.listen(port, () => {
    console.log("Hero Rider server port", port);
});