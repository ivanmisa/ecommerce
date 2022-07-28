const jwt = require('jsonwebtoken');
const moment = require('moment');
const sercretUser = 'ASDasdASD123ASD12';


function verifyToken(req, res, next){
    const token = req.headers.authorization;
    if(!token){
        return res.status(401).json({
            error:'No tiene token de autenticacion'
        });
    }

    try{
        const decoded = jwt.verify(token, sercretUser);

        if(decoded.exp <= moment().unix()){
            return res.status(401).json({error: 'El token no es valido'});
            
        }
        UserDecoded = decoded;
    }catch(err){
        return res.status(404).json({error: 'El token no es valido'});
    }
    next();
}

module.exports = {
    verifyToken
}