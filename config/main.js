module.exports = {
  // Secret key for JWT signing and encryption
  'secret': 'super secret passphrase',
  // Database connection information
  'database': 'mongodb://localhost:27017/chat-app',
  // Setting port for server
  'port': process.env.PORT || 3000
}
