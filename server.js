const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const db = require('./database')
const mysql = require('mysql')
var jwt = require('jsonwebtoken')

var app = express()

app.use(cors())
app.use(bodyParser.json({limit: '25mb'}))
app.use(bodyParser.urlencoded({limit: '25mb', extended: false}))

var mysqlCon = mysql.createConnection(db.mysqlData)
mysqlCon.connect()

setInterval(() => {
    mysqlCon.query('SELECT 1')
}, 100000)

const server = require('http').createServer(app)

const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

app.use(express.static(__dirname + '/public/'))

app.post('/login', (req, res) => {
    let query = `SELECT * FROM users WHERE username = '${req.body.username}' AND password = '${req.body.password}'`
    mysqlCon.query(query, (err, rows) => {
        if(err){
            console.log(err)
            res.json({status: false, error: "Server error 0001"})
        }
        else{
            if(rows.length > 0){
                var tmpUser = {
                    id: rows[0].id,
                    username: rows[0].username,
                    name: rows[0].name,
                    type: rows[0].type
                }
                jwt.sign({user: tmpUser}, db.jwtPass, (errJ, token) => {
                    if(errJ){
                        res.json({status: false, error: 'Server Error'})
                    }
                    else{
                        res.json({status: true, user: tmpUser, token: token})
                    }
                })
            }
            else{
                res.json({status: false, error: "Usuario o contraseña incorrecto !"})
            }
        }
    })
})

const dates = require('./routes/dates')
app.use('/dates', dates)

io.on('connection', (socket) => {
    console.log(`A user conected ${socket.id} !`)

    // ESCUCHA EL EVENTO DE DESCONEXION
    socket.on('disconnect', ()=> {
        console.log('User disconnected')
    })

    // ESCUCHA EL ENVIO DE CITA
    socket.on('addCita', (data)=> {
        io.emit('addCita2', data)
    })
})

server.listen(7090, ()=> {
    console.log('Sever listening on port 7090')
})

