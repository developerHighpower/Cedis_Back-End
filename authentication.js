var jwt = require('jsonwebtoken')
function verifyToken (req, res, next) {
    let token = null
    if(req.headers['authorization']){
        token = req.headers['authorization'].substring(7, req.headers['authorization'].length)
        token = token.substring(1, (token.length - 1))
    }
    else{
        token = req.body.token
    }

    jwt.verify(token, 'aHigh12Key%%', (err, authData) => {
        if(err){
            console.log(err)
            res.json({status: false, error: "Iniciar sesión de nuevo"})
        }
        else{
            req.authData = authData.user
            next()
        }
    })
}

module.exports = verifyToken