const db = require('../database')
const express = require('express')
const mysql = require('mysql')
const multer = require('multer')
const veryfyToken = require('../authentication')
var router = express.Router()

//---------------  CONFIGURACION DE MYSQL ----------------

var mysqlCon = mysql.createConnection(db.mysqlData)

mysqlCon.connect()

setInterval(function () {   
    mysqlCon.query('SELECT 1')
}, 10000)

//let savePath = `\\\\192.168.1.229\\Desarrollos\\CedisDocs\\`
let savePath = './images/'

const storageDates = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, savePath)
    },
    filename: function(req, file, cb){
        let extension = file.originalname.split(".")
        cb(null, new Date().getTime() + '.' + extension[extension.length - 1])
    }
})

var uploadDate = multer({ storage: storageDates })

router.post('/add', veryfyToken, uploadDate.array('files'), (req, res) => {
    let vls = JSON.parse(req.body.values)
    let query = `INSERT INTO dates SET ?`
    mysqlCon.query(query, vls, (err, rows) => {
        if(err){
            console.log(err)
            res.json({status: false, error: err})
        }
        else{
            let pictures = []
            for(let i in req.files){
                let tmp  = []
                tmp.push(rows.insertId)
                tmp.push(req.files[i].filename)
                tmp.push(vls.visit_date)
                pictures.push(tmp)
            }
            let query2 = `INSERT INTO identifications (id_date, picture, date) VALUES ?`
            mysqlCon.query(query2, [pictures], (err2, rows2) => {
                if(err2){
                    console.log(err2)
                    res.json({status: false, error: err})
                }
                else{
                    res.json({status: true})
                }
            })
        }
    })
})

router.post('/getAll', veryfyToken, (req, res) => {
    if(req.body.type == 3){
        query = `SELECT * FROM dates WHERE id_user = ${req.body.id}`
    }
    else{
        query = `SELECT * FROM dates`
    }
    mysqlCon.query(query, (err, rows) => {
        if(err){
            console.log(err)
            res.json({status: false, error: err})
        }
        else{
            let query2 = `SELECT * FROM identifications`
            mysqlCon.query(query2, (err2, rows2) => {
                if(err2){
                    console.log(err2)
                    res.json({status: false, error: err2})
                }
                else{
                    res.json({status: true, data: rows, pictures: rows2})
                }
            })
        }
    })
})

router.post('/getDate', veryfyToken, (req, res) => {
    let query
    if(req.body.type == 3){
        query = `SELECT * FROM dates WHERE visit_date = '${req.body.data}' AND id_user = ${req.body.id}`
    }
    else{
        query = `SELECT * FROM dates WHERE visit_date = '${req.body.data}'`
    }
    mysqlCon.query(query, (err, rows) => {
        if(err){
            console.log(err)
            res.json({status: false, error: err})
        }
        else{
            let query2
            if(req.body.type == 3){
                query2 = `SELECT t0.id_date, t0.picture FROM identifications t0 INNER JOIN dates t1 ON t0.id_date = t1.id WHERE t1.visit_date = 
                '${req.body.data}' AND t1.id_user = ${req.body.id}`
            }
            else{
                query2 = `SELECT t0.id_date, t0.picture FROM identifications t0 INNER JOIN dates t1 ON t0.id_date = t1.id WHERE t1.visit_date = 
                '${req.body.data}'`
            }
            mysqlCon.query(query2, (err2, rows2) => {
                if(err2){
                    console.log(err2)
                    res.json({status: false, error: err2})
                }
                else{
                    res.json({status: true, data: rows, pictures: rows2})
                }
            })
        }
    })
})

router.post('/desicion', veryfyToken, (req, res) => {
    let query 
    if(req.body.type == 1){
        query = `UPDATE dates SET status = 1 WHERE id = ${req.body.id}`
    }
    else{
        query = `UPDATE dates SET status = 2 WHERE id = ${req.body.id}`
    }
    mysqlCon.query(query, (err, rows) => {
        if(err){
            console.log(err)
            res.json({status: false, error: err})
        }
        else{
            res.json({status: true})
        }
    })
})

router.post('/checks', veryfyToken, (req, res) => {
    let query 
    if(req.body.type == 1){
        query = `UPDATE dates SET check_in = '${req.body.date}' WHERE id = ${parseInt(req.body.id)}`
    }
    else{
        query = `UPDATE dates SET check_out = '${req.body.date}' WHERE id = ${parseInt(req.body.id)}`
    }
    mysqlCon.query(query, (err, rows) => {
        if(err){
            console.log(err)
            res.json({status: false, error: err})
        }
        else{
            res.json({status: true})
        }
    })
})

router.post('/users', veryfyToken, (req, res) => {
    let query = `SELECT * FROM users WHERE active = 1`
    mysqlCon.query(query, (err, rows) => {
        if(err){
            res.json({status: false, error: err})
        }
        else{
            res.json({status: true, data: rows})
        }
    })
})

router.post('/delete', veryfyToken, (req, res) => {
    let query = `UPDATE users SET active = 0 WHERE id = ${req.body.id}`
    mysqlCon.query(query, (err, rows) => {
        if(err){
            console.log(err)
            res.json({status: false, error: err})
        }
        else{
            res.json({status: true})
        }
    })
})

router.post('/createUser', veryfyToken, (req, res) => {
    let vls = {
        username: req.body.user,
        name: req.body.name,
        type: req.body.type.value,
        password: req.body.password
    }
    let query = `INSERT INTO users SET ?`
    mysqlCon.query(query, vls, (err, rows) => {
        if(err){
            console.log(err)
            res.json({status: false, error: err})
        }
        else{
            res.json({status: true})
        }
    })
})

router.post('/update', veryfyToken, (req, res) => {
    let query = `UPDATE users SET username = '${req.body.user}', name = '${req.body.name}', password = '${req.body.password}', 
    type = ${parseInt(req.body.type.value)} WHERE id = ${parseInt(req.body.id)}`
    mysqlCon.query(query, (err, rows) => {
        if(err){
            console.log(err)
            res.json({status: false, error: err})
        }
        else{
            res.json({status: true})
        }
    })
})

router.post('/getfiles', veryfyToken, (req, res) => {
    res.sendFile(savePath + '' + req.body.name)
})

module.exports = router