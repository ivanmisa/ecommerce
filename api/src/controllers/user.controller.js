const User = require("../models/users.model");
const jwt = require('jsonwebtoken');
const sercretUser = 'ASDasdASD123ASD12';


async function signup(req, res){
    try{
        const {name, email, password, } = await req.body;
        const emailExist = await User.findOne({email: email});

        if(emailExist){
            return res.status(403).json({error: "El email ya esta en uso"});
        }

        const user = new User ({
            name: name,
            email: email,
            password: password
        });
        user.password = await user.encryptPassword(user.password);
        const userCurrent = await user.save();

        const token = await jwt.sign({id: userCurrent._id, email: userCurrent.email, name: userCurrent.name, role: userCurrent.role}, sercretUser,{
            expiresIn: 60 * 60 * 720
        });

        return res.json({token, user: {_id: userCurrent._id, name: userCurrent.name, email: userCurrent.email, role:userCurrent.role} });
    } catch(error){
        return res.status(500).json({error: error.message});  
    }
}

async function signin(req, res) {
    const {email, password} = await req.body;

    try{
        const userCurrent = await User.findOne({email: email});
        if(!userCurrent){
            return res.status(404).json({error: 'La direccion de correo electronico no esta registrada'});
        }

        const isMatch = await userCurrent.validatePassword(password);
        if(!isMatch){
            return res.status(401).json({error:'La contraseña es incorrecta'});
        }

        const token = await jwt.sign({id: userCurrent._id, email: userCurrent.email, name: userCurrent.name, role: userCurrent.role}, sercretUser,{
            expiresIn: 60 * 60 * 720
        });
        
        return res.json({token, user: {_id: userCurrent._id, name: userCurrent.name, email: userCurrent.email, role:userCurrent.role} });
    } catch(error){
        return res.status(500).json({error: error.message});
    }
}



module.exports = {
    signup,
    signin
}