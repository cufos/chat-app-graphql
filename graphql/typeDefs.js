const { gql } = require('apollo-server')

module.exports = gql`
  # All types
  type User{
    username: String!
    email: String!
    token:String
    createdAt: String!
  }

  type Query{
    getUsers:[User]!
    login(username:String! password: String!):User!
  }

  # All Mutation
  type Mutation{
    register(input: registerInput):User!
  }

  # All custom input
   input registerInput{
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
`