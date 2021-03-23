const { User, Message } = require('../../models')
const bcrypt = require('bcrypt')
const { AuthenticationError, UserInputError } = require('apollo-server')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const { Op } = require('sequelize')

module.exports = {
  Query: {
    async getUsers(_, __, { user }) {
      try {
        if (!user) throw new AuthenticationError('Unauthenticated')

        let users = await User.findAll({
          attributes: ['username', 'imageUrl', 'createdAt'],
          where: { username: { [Op.ne]: user.username } },
        })

        const allUserMessages = await Message.findAll({
          where: {
            [Op.or]: [{ from: user.username }, { to: user.username }],
          },
          order: [['createdAt', 'DESC']],
        })

        users = users.map((otherUser) => {
          const latestMessage = allUserMessages.find(
            (m) => m.from === otherUser.username || m.to === otherUser.username
          )
          otherUser.latestMessage = latestMessage
          return otherUser
        })

        return users
      } catch (err) {
        console.log(err)
        throw err
      }
    }, login: async (_, { username, password }) => {
      const errors = {}
      try {
        if (username.trim() === '') errors.username = 'Username must be empty'
        if (password === '') errors.username = 'Password must be empty'

        if (Object.keys(errors).length > 0) {
          throw new UserInputError('Errors', { errors })
        }

        const user = await User.findOne({ where: { username } })

        if (!user) {
          errors.username = 'User not found'
          throw new UserInputError('User not found', { errors })
        }


        const correctPass = await bcrypt.compare(password, user.password)
        console.log(correctPass)

        if (!correctPass) {
          errors.password = 'Password is incorrect'
          throw new UserInputError('password incorrect', errors)
        }

        const token = jwt.sign({ username }, process.env.SECRET, {
          expiresIn: '2h'
        })

        user.token = token

        return {
          ...user.toJSON(),
          token
        }
      } catch (err) {
        console.log(err)
        throw err
      }
    }
  },
  Mutation: {
    register: async (_, args) => {
      let { username, email, password, confirmPassword } = args
      const errors = {}

      try {
        // Validate the data
        if (username.trim() === '') errors.username = 'Username must not be empty'
        if (email.trim() === '') errors.email = 'Email must not be empty'
        if (password.trim() === '') errors.password = 'Password must not be empty'
        if (confirmPassword.trim() === '') errors.confirmPassword = 'ConfirmPassword must not be empty'
        if (password !== confirmPassword) errors.confirmPassword = 'The password and confirm password must be equal'

        if (Object.keys(errors) > 0) throw errors

        // hash the password
        password = await bcrypt.hash(password, 6)

        // create user
        const user = await User.create({
          username, email, password
        })

        return user
      } catch (err) {
        if (err.name = 'SequelizeUniqueConstraintError') {
          err.errors.forEach(e => (errors[e.path] = `${e.path} already exists`))
        } else if (err.name === 'SequelizeValidationError') {
          err.errors.forEach(e => (errors[e.path] = e.message))
        }
        throw new UserInputError('Bad input', { errors })
      }
    }
  }
}

