var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MessageSchema = Schema({
  conversationId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

var Message = mongoose.model('Message', MessageSchema);
module.exports = Message;
