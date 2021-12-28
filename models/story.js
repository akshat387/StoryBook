const mongoose = require('mongoose')

const storySchema = new mongoose.Schema({
      title: {
          type: String,
          required: true,
          trim: true

 },

 body: {
    type: String,
    required: true

},
status: {
    type: String,
    default: 'public',
    enum: ['public', 'private'] 

},
// for who is creating which story
user: {
    type: mongoose.Schema.Types.ObjectId, //giving it a special mongoose ID
    ref: 'User'

},


createdAt: {
    type: Date,
    default: Date.now
}
})


module.exports = mongoose.model('story', storySchema )