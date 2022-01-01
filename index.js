const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const fileUpload = require('express-fileupload');

// const Stripe = require('stripe');
// const stripe = Stripe(`${process.env.STRIPE_SECRET}`);

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload());

// hero_rider
// HGSoPzqxHVI39Gbs

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.f1hps.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('heroRider');
        const learnerCollection = database.collection('learners');
        const riderCollection = database.collection('riders');
    
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
                status: "active",
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
                status: "active",
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