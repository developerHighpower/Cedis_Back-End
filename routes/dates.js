const db = require('../database')
const express = require('express')
const mysql = require('mysql')
const veryfyToken = require('../authentication')
var router = express.Router()

//---------------  CONFIGURACION DE MYSQL ----------------

var mysqlCon = mysql.createConnection(db.mysqlData)

mysqlCon.connect()

setInterval(function () {
    mysqlCon.query('SELECT 1')
}, 10000)

router.post('/add', veryfyToken, (req, res) => {
    let query = `INSERT INTO dates SET ?`
    mysqlCon.query(query, req.body.data, (err, rows) => {
        if(err){
            console.log(err)
            res.json({status: false, error: err})
        }
        else{
            res.json({status: true})
        }
    })
})

router.post('/getAll', veryfyToken, (req, res) => {
    let query = `SELECT * FROM dates`
    mysqlCon.query(query, (err, rows) => {
        if(err){
            console.log(err)
            res.json({status: false, error: err})
        }
        else{
            res.json({status: true, data: rows})
        }
    })
})

router.post('/getDate', veryfyToken, (req, res) => {
    console.log(req.body)
})

module.exports = router