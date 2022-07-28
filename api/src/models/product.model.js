const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const productSchema = new Schema({
    name: {type: String, required:true},
    description: {type: String, required:true},
    category: {type: String, required:true},
    price: {type: Number, required: true},
    gender: {type: String, required:true},
    color: [{color: String, number: Number}],
    file:  [{secure_url: String, public_id: String}],
    by: { type: ObjectId, ref: 'User' },
    created: {type: Date, default: Date.now},    
});


module.exports = mongoose.model("Product", productSchema);