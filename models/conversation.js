var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ConversationSchema = Schema({
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

var Conversation = mongoose.model('Conversation', ConversationSchema);
module.exports = Conversation;
