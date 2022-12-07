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

app.use(express.static(__dirname + '/public/'))

app.post('/login', (req, res) => {
    let query = `SELECT * FROM users WHERE username = '${req.body.username}' AND password = '${req.body.password}'`
    console.log(query)
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

app.listen(7070, ()=> {
    console.log('Sever listening on port 7070')
})
