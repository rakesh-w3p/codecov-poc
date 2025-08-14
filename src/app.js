const express = require('express')
const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' })
})

app.get('/version', (req, res) => {
  res.json({
    version: '1.0.0',
    name: 'codecov-poc',
    description: 'Node.js Express application for Codecov POC'
  })
})

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

app.post('/users', (req, res) => {
  const { name, email } = req.body

  if (name === undefined || email === undefined) {
    return res.status(400).json({
      error: 'Name and email are required'
    })
  }

  if (typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({
      error: 'Name must be a non-empty string'
    })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: 'Invalid email format'
    })
  }

  const user = {
    id: Math.floor(Math.random() * 10000),
    name: name.trim(),
    email: email.toLowerCase(),
    createdAt: new Date().toISOString()
  }

  res.status(201).json(user)
})

app.get('/calculate/:operation/:a/:b', (req, res) => {
  const { operation, a, b } = req.params

  const numA = parseFloat(a)
  const numB = parseFloat(b)

  if (isNaN(numA) || isNaN(numB)) {
    return res.status(400).json({
      error: 'Invalid numbers provided'
    })
  }

  let result
  switch (operation) {
    case 'add':
      result = numA + numB
      break
    case 'subtract':
      result = numA - numB
      break
    case 'multiply':
      result = numA * numB
      break
    case 'divide':
      if (numB === 0) {
        return res.status(400).json({
          error: 'Division by zero is not allowed'
        })
      }
      result = numA / numB
      break
    case 'power':
      result = Math.pow(numA, numB)
      break
    default:
      return res.status(400).json({
        error: 'Invalid operation. Supported operations: add, subtract, multiply, divide, power'
      })
  }

  res.json({
    operation,
    a: numA,
    b: numB,
    result
  })
})

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

module.exports = app
