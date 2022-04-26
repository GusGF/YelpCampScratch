const mongoose = require('mongoose');
const CG_Scratch = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');

const dropDB = async () => {
  const conn = mongoose.createConnection('mongodb://localhost:27017/yelpCampDB');
  await conn.dropDatabase();
  console.log("Database dropped?!")
}

const createDB = async () => {
  mongoose.connect('mongodb://localhost:27017/yelpCampDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  const dbConn = mongoose.connection;
  dbConn.on('error', console.error.bind(console, 'connection error:'));
  dbConn.once('open', () => { console.log('Database connected'); });
}

const getRandIndex = (theArray) => {
  return Math.floor(Math.random() * (theArray.length));
}

const seedDB = async () => {
  for (let i = 0; i <= 0; i++) {
    // Setting location to city & place
    let aCity = cities[getRandIndex(cities)];
    let location = `${aCity.city}, ${aCity.state}`;

    // Making the title from the descriptor & place
    let aDescriptor = descriptors[getRandIndex(descriptors)];
    let aPlace = places[getRandIndex(places)];
    let title = `${aDescriptor} ${aPlace}`;

    // Getting a random price
    let rndPrice = Math.floor(Math.random() * 20);

    myCampGround = new CG_Scratch({
      title: title,
      location: location,
      description: "This is a great place to camp!!",
      price: rndPrice,
      image: 'https://source.unsplash.com/collection/483251'
    });
    await myCampGround.save();
  }
}

dropDB();
createDB();
seedDB().then(() => {
  const dbConn = mongoose.createConnection('mongodb://localhost:27017/yelpCampDB');
  dbConn.close();
  console.log("DB connection closed");
});