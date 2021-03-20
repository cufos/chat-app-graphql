const { ApolloServer } = require('apollo-server')
const { sequelize } = require('./models')
const resolvers = require('./graphql/resolvers')
const typeDefs = require('./graphql/typeDefs')
require('dotenv').config()
const contextMiddleware = require('./utils/contextMiddleware')

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: contextMiddleware
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);

  sequelize.authenticate()
    .then(() => console.log('Db is connected'))
    .catch(err => console.log(err))
})

