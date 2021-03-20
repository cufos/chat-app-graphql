const messagesResolvers = require('./messages')
const usersResolvers = require('./users')

module.exports = {
  Message: {
    createdAt: parent => parent.createdAt.ToISOString()
  },
  Query: {
    ...usersResolvers.Query,
    ...messagesResolvers.Query
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...messagesResolvers.Mutation
  }
}