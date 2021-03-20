const { gql } = require('apollo-server')

module.exports = gql`
  # All types
  type User{
    username: String!
    email: String!
    token:String
    createdAt: String!
  }

  type Message {
    uuid: String!
    content: String!
    from: String!
    to: String!
    createdAt: String!
  }

  type Query{
    getUsers:[User]!
    login(username:String! password: String!):User!
    getMessages(from:String!):[Message]!
  }

  # All Mutation
  type Mutation{
    register(username: String!
    password: String!
    confirmPassword: String!
    email: String!):User!

    # Message mutation
    sendMessage(to:String! content:String!): Message!
  }
`