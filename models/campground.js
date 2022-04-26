const mongoose = require('mongoose');
const campGroundSch = new mongoose.Schema({
  title: { type: String, required: [true, 'Title cannot be blank'] },
  price: { type: Number, required: true },
  description: { type: String, required: false },
  location: { type: String, required: true },
  image: { type: String, required: false }
});
const CG_Revision = mongoose.model('CG_Revision', campGroundSch);
module.exports = CG_Revision;