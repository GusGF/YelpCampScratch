const mongoose = require('mongoose');
const campGroundSch = new mongoose.Schema({
  title: { type: String, required: [true, 'Title cannot be blank'] },
  price: { type: Number, required: true },
  description: { type: String, required: false },
  location: { type: String, required: true },
  image: { type: String, required: false }
});
const CG_Revision1 = mongoose.model('CG_Revision1', campGroundSch);

const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');
// **********************************************************************************
const dbConn = mongoose.createConnection('mongodb://localhost:27017/yelpCampDB');
// **********************************************************************************

const dropDB = async () => {
  await dbConn.dropDatabase();
  console.log("Database dropped?!")
}

const dropCollection = async () => {
  try {
    // **********************************************************************************
    await dbConn.dropCollection('CG_Revision1');
    // **********************************************************************************
    console.log("Collection dropped?!");
  } catch (e) {
    console.log("Collection NOT dropped or didn't exit?!");
  }
}

// **********************************************************************************
const createDB = async () => {
  mongoose.connect('mongodb://localhost:27017/yelpCampDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  // **********************************************************************************
  dbConn.on('error', console.error.bind(console, 'connection error:'));
  dbConn.once('open', () => { console.log('Database connected'); });
}

const getRandIndex = (theArray) => {
  return Math.floor(Math.random() * (theArray.length));
}

const seedDB = async () => {
  for (let i = 0; i <= 5; i++) {
    // Setting location to city & place
    let aCity = cities[getRandIndex(cities)];
    let location = `${aCity.city}, ${aCity.state}`;

    // Making the title from the descriptor & place
    let aDescriptor = descriptors[getRandIndex(descriptors)];
    let aPlace = places[getRandIndex(places)];
    let title = `${aDescriptor} ${aPlace}`;

    // Getting a random price
    let rndPrice = Math.floor(Math.random() * 20);
    // **********************************************************************************
    myCampGround = new CG_Revision1({
      title: title,
      location: location,
      description: "This is a great place to camp!!",
      price: rndPrice,
      image: 'https://source.unsplash.com/collection/483251'
    });
    // **********************************************************************************
    await myCampGround.save();
  }
}


// dropDB();
// dropCollection();

// createDB().then(() => {
//   console.log("DB created");
// }).catch((err) => { console.log(`Error encountered creating DB: ${err}`) });

seedDB().then(() => {
  dbConn.close();
  console.log("DB Populated and connection closed");
}).catch((err) => { console.log(`Error encountered seeding DB: ${err}`) });;