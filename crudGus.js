const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')
require('dotenv').config()
const PORT  = 3030
const app = express()

app.use(morgan('dev'))
app.use(cors())
app.use(express.json())
app.use(bodyParser.json({limit : "100mb"}))

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

app.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    next()
})

app.get('/', (req, res) => {
    res.send('Hi User:D')
})


app.get('/', (req, res)=>{
    let n1 = 5;
    let n2 = 7;
    res.send(`You have 2 numbers: ${n1} and ${n2}`);
});

app.get('/add', (req, res)=>{
    let n1 = 5;
    let n2 = 7;
    res.send(`If u add your numbers: ${n1+n2}`)
});

app.get('/subs', (req, res)=>{
    let n1 = 5;
    let n2 = 7;
    res.send(`If u substract your numbers: ${n1-n2}`)
});

app.get('/mult', (req, res)=>{
    let n1 = 5;
    let n2 = 7;
    res.send(`If u multiply your numbers: ${n1*n2}`)
});

const items = {
    data: [
        { id: 1, name: 'user 1' },
        { id: 2, name: 'user 2' },
        { id: 3, name: 'user 3' },
    ],
}

app.get('/items', (req, res) => {

    res.send(items.data)
    
})

app.get('/items/:id', (req, res) => {

    const { id } = req.params
    const item = items.data.find(item => item.id === Number(id))
    res.send(item)

})

app.post('/items', (req, res) => {

    const { id } = req.body
    const { name } = req.body
    const item = {
        id,name,
    }
    items.data.push(item)
    res.send(item)

})

app.delete('/items/:id', (req, res) => {

    const { id } = req.params
    const item = items.data.find(item => item.id === Number(id))
    items.data = items.data.filter(item => item.id !== Number(id))
    res.send(item)

})

app.put('/items/:id', (req, res) => {

    const { id } = req.params
    const { name } = req.body
    const item = items.data.find(item => item.id === Number(id))
    item.name = name
    res.send(item)

})

