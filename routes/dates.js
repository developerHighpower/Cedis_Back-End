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
            res.json({status: true, data: rows})
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
            res.json({status: true, data: rows})
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
    let query = `SELECT * FROM users`
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
    let query = `DELETE FROM users WHERE id = ${req.body.id}`
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

module.exports = router