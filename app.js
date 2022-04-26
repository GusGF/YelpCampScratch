const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const CG_Revision = require('./models/campground');
const methodOverride = require('method-override');
const morgan = require('morgan');
const req = require('express/lib/request');
const ejsMate = require('ejs-mate');
const AppError = require('./AppError/AppError');
const ObjectID = require('mongoose').Types.ObjectId;

const app = express();
app.listen(3500, () => {
  console.log('I am listening on port 3500');
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
// Logs info about requests
app.use(morgan('tiny'));

// ##########################################################################
// // Our middleware function
// const requestTime = (req, res, next) => {
//   req.theTime = Date.now();
//   next();
// }
// // Our middleware
// app.use(requestTime);
// // Our test route
// app.get('/', (req, res) => {
//   console.log(`Time is: ${req.theTime}`);
// })
// // Middleware to output the path & method and change the HTML verb
// app.use((req, res, next) => {
//   req.method = 'GET';
//   console.log(req.method, req.path);
//   next();
// })
// // Checking for a password in the route
// app.use((req, res, next) => {
//   const { password } = req.query;
//   if (password)
//     console.log("You entered something");
//   else
//     console.log("You are a failure")
//   next();
// })
// ##########################################################################

mongoose.connect('mongodb://localhost:27017/yelpCampDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

function wrapperFunc(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(e => next(e))
  }
}

app.get('/', (req, res) => {
  console.log("### '/' route ran ###");
  res.render('home');
})

// List of camp grounds
app.get('/campgrounds', async (req, res) => {
  console.log("### '/campgrounds' route ran ###");
  const campgrounds = await CG_Scratch_Mdl.find({});
  // console.log("Num of campgrounds is: " + campgrounds.length);
  res.render('index', { campgrounds });
})

// Present a blank Camp Ground form
app.get('/campgrounds/new', (req, res) => {
  console.log("### '/campgrounds/new' route ran ###");
  res.render('new');
})

// Displaying a single camp ground NEW VERSION with the wrapperFunc
app.get('/campgrounds/:id', wrapperFunc(async (req, res, next) => {
  console.log("### '/campgrounds/:id' route ran okay ###");
  const { id } = req.params;
  // Is this an invalid ObjectId (like a shorter/incomplete id string)
  // if (!ObjectID.isValid(id)) {
  //   return next(new AppError(400, 'Invalid Campground ID format'));
  // }
  const myCampGround = await CG_Scratch_Mdl.findById(id);
  if (!myCampGround) {
    throw new AppError(502, "No campground found");
  }
  res.render('show', { myCampGround });
}
));

// Add a campground
app.post('/campgrounds', wrapperFunc(async (req, res) => {
  console.log("### '/campgrounds' POST route ran ###");
  const newCampCG = new CG_Scratch_Mdl(req.body.campground);
  console.log(newCampCG);
  await newCampCG.save();
  res.redirect(`/campgrounds/${newCampCG._id}`)
}))

// Edit campground form
app.get('/campgrounds/:id/edit', wrapperFunc(async (req, res) => {
  console.log("### '/campgrounds/:id/edit' route ran ###");
  const campground = await CG_Scratch_Mdl.findById(req.params.id);
  // console.log(campground);
  res.render('edit', { campground });
}))

// function wrapperFunc(fn) {
//   return function (req, res, next) {
//     fn(req, res, next).catch(e => next(e))
//   }
// }
// Route for the 'Save Update' button
app.put('/campgrounds/saveEdit/:id', wrapperFunc(async (req, res, next) => {
  console.log("### '/campgrounds/saveEdit/:id' route ran ###");
  try {
    const savedCG = await CG_Scratch_Mdl.findByIdAndUpdate(req.params.id, { ...req.body.cg }, { new: true, runValidators: true });
    res.redirect(`/campgrounds/${savedCG._id}`);
  } catch (e) {
    next(e);
  }
}))

app.delete('/campgrounds/:id', wrapperFunc(async (req, res) => {
  console.log("### '/campgrounds/:id' DELETE route ran ###");
  const delCG = await CG_Scratch_Mdl.findByIdAndDelete(req.params.id);
  // console.log(`${delCG.title} campground deleted`)
}))

// This will only run when a matching route above was not found
app.use((req, res) => {
  res.status(404).send("Page Not found");
});

app.get('/error', (req, res) => {
  throw new AppError(501, "Help");
})

app.use((error, req, res, next) => {
  console.log(error.name);
  next(error);
})

// Error Handler
app.use((error, req, res, next) => {
  console.log("#########################  Error #########################");
  const { status = 500, message = "No idea!" } = error;
  res.status(status).send(message);
});