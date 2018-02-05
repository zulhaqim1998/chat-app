var User = require('../models/user')
    Conversation = require('../models/conversation'),
    Message = require('../models/message');

exports.getConversations = function(req, res, next){
  Conversation.find({ participants: req.user._id })
    .select('_id')
    .exec(function(err, conversations){
      if(err){
        res.send({ error: err });
        return next(err);
      }
      // get one message from every conversations to put to display
      var fullConversations = [];
      conversations.forEach(function(conversation){
        Message.find({ conversationId: conversation._id })
          .sort('-createdAt')
          .limit(1)
          .populate({
            path: 'author',
            select: 'username'
          })
          .exec(function(err, message){
            if(err){
              res.send({ error: err });
              return next(err);
            }
            fullConversations.push(message);
            if(fullConversations.length === conversations.length){
              return res.status(200).json({ conversations: fullConversations });
            }
          });
      });
    });
};

exports.getConversation = function(req, res, next){
  Message.find({ conversationId: req.params.conversationId })
    .select('createdAt body author')
    .sort('-createdAt')
    .populate({
      path: 'author',
      select: 'username'
    })
    .exec(function(err, messages){
      if(err){
        res.send({ error: err });
        return next(err);
      }
      res.status(200).json({ conversation: messages });
      return next();
    });
};

exports.newConversation = function(req, res, next){
  var recipient = req.params.recipient;
  var composedMessage = req.body.composedMessage;
  if(!recipient){
    res.status(422).send({ error: 'Please select a recipient.' });
  }
  if(!composedMessage){
    res.status(422).send({ error: 'Please type your message.' });
  }

  var conversation = new Conversation({
    partipicants: [req.user._id, recipient]
  });
  conversation.save(function(err, newConversation){
    if(err){
      res.send({ error: err });
      return next(err);
    }
    var message = new Message({
      conversationId: newConversation._id,
      body: composedMessage,
      author: req.user._id
    });
    message.save(function(err, newMessage){
      if(err){
        res.send({ error:err });
        return next(err);
      }
      res.status(200).json({ message: 'Conversation started!', conversationId: newConversation._id });
      return next();
    });
  });
};

exports.sendReply = function(req, res, next){
  var conversationId = req.params.conversationId;
  var body = req.body.composedMessage;
  var author = req.user;

  var reply = new Message({
    conversationId: conversationId,
    body: body,
    author: author
  });
  reply.save(function(err, sentReply){
    if(err){
      res.send({ error: err} );
      return next(err);
    }
    res.status(200).json({ message: 'Reply successfully sent!' });
    return next();
  });
};
