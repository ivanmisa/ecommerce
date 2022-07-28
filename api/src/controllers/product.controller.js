const cloudinary = require('cloudinary');
const Product = require("../models/product.model");
const formidable = require('formidable');
const fs = require('fs');

cloudinary.config({
    cloud_name: 'dhmakvnwf', 
    api_key: '627281849879884', 
    api_secret: 'aXLAlG7uPy_RCLvT6mK8SDxveEQ'
})


async function createProduct(req, res){
    const {name, description, price, color, gender, category} = req.body;
    const userId = UserDecoded.id;

    if(!name || !description || !price || !color || !gender){
        return res.status(400).json({error: "Peticion no valida. Datos incompletos"});
    }

    try{
        if(UserDecoded.role != 'ROLE_ADMIN'){
            return res.status(500).json({error: 'Usuario no tiene autorizacion para crear un producto'});
        }
    
        const product = new Product({
            name: name,
            by:  userId,
            description: description,
            category: category,
            price: price,
            color: color,
            gender: gender
        });
    
        const newproduct = await product.save();
        return res.status(200).json({product: {_id: newproduct._id}});  
    }catch(error){
        return res.status(500).json({error: error.message});
    } 
}



async function getProducts(req, res){
    const gender = req.params.gender;

    try{
        if(gender == 'all'){
            var products = await Product.find().sort('-created').select({'by':0 }).slice({'file':1});
        }else if(gender == 'men' || gender == 'women' || gender == 'unisex'){
            var products = await Product.find({gender: gender}).sort('-created').select({'by':0 }).slice({'file':1});
        }else{
            return res.status(500).json({error: 'Parametro incorrecto'});
        }

        return res.status(200).json({products});  
    }catch(error){
        return res.status(500).json({error: error.message});
    } 
}


function saveImages(req, res){
    const productId = req.params.id;
    const form = formidable({ multiples: true });
    const file = [];


    form.parse(req, async (err, fields, files) => { 
        if(err){ return res.status(500).send({message: err});}
        if(files){
            var filesAmount =  files.image.length; 
            if(filesAmount > 3){
                return res.status(500).send({message: 'Se registraron mas de 3 imagenes'});
            }
            if(filesAmount == undefined){
                filesAmount = 1;
            }
         
            try{           
                if(filesAmount > 1){                  
                    for (const element of files.image){     
                        
                        let fileSave = await cloudinary.uploader.upload(element.path, {folder: 'samples'});                        
                        file.push({public_id: fileSave.public_id, secure_url: fileSave.secure_url});                                                                                                   
                    }   
                }

                const product = await Product.findByIdAndUpdate(productId, {$push: {file: file}}, {new:true});  
                return res.status(200).json({product});
                        
            } catch(error) {
                return res.status(500).json({error: error.message});
            } 
        }  
    });  

}



module.exports = {
    createProduct,
    getProducts,
    saveImages
}