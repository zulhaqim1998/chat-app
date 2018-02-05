var AuthController = require('../controllers/authentication'),
    ChatController = require('../controllers/chat'),
    express = require('express'),
    passportService = require('../config/passport'),
    passport = require('passport');

var requireAuth = passport.authenticate('jwt', { session: false });
var requireLogin = passport.authenticate('local', { session: false });

module.exports = function(app) {
  // Initializing route groups
  const apiRoutes = express.Router(),
        authRoutes = express.Router(),
        chatRoutes = express.Router();

  // Set routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/auth', authRoutes);
  apiRoutes.use('/chat', chatRoutes);

  //-----------------------------------------------------------------//
  //                          Auth Routes                            //
  //-----------------------------------------------------------------//

  // Registration route
  authRoutes.post('/register', AuthController.register);

  // Login route
  authRoutes.post('/login', requireLogin, AuthController.login);

  //-----------------------------------------------------------------//
  //                          Chat Routes                            //
  //-----------------------------------------------------------------//

  // View messages to and from authenticated user
  chatRoutes.get('/', requireAuth, ChatController.getConversations);

  // Retrieve single conversation
  chatRoutes.get('/:conversationId', requireAuth, ChatController.getConversation);

  // Send reply
  chatRoutes.post('/:conversationId', requireAuth, ChatController.sendReply);

  // new conversation
  chatRoutes.post('/new/:recipient', requireAuth, ChatController.newConversation);

//   Set url for API group routes
  app.use('/api', apiRoutes);
};
