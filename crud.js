const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
const PORT = 3031

app.use(morgan('dev'))
app.use(cors())
app.use(express.json())

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

app.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    next()
})

let items = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' },
]

app.use(express.json())

// Create
app.post('/items', (req, res) => {
  const newItem = req.body
  items.push(newItem)
  res.send(newItem)
})

// Retrieve
app.get('/items/:id', (req, res) => {
  const item = items.find(item => item.id === parseInt(req.params.id))
  if (!item) {
    res.status(404).send('Item not found')
  }
  res.send(item)
})

// Update
app.put('/items/:id', (req, res) => {
  const item = items.find(item => item.id === parseInt(req.params.id))
  if (!item) {
    res.status(404).send('Item not found')
  }
  item.name = req.body.name
  res.send(item)
})

// Delete
app.delete('/items/:id', (req, res) => {
  const item = items.find(item => item.id === parseInt(req.params.id))
  if (!item) {
    res.status(404).send('Item not found')
  }
  const index = items.indexOf(item)
  items.splice(index, 1)
  res.send(item)
})

app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`)
})