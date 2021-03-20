const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = context => {
  if (context.req && context.req.headers.authorization) {
    const token = context.req.headers.authorization.split('Bearer ')[1]

    jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
      context.user = decodedToken
    })
  }

  return context
}