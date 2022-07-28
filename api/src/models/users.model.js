const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');


const userSchema = new Schema({
    name: {type: String, required:true},
    email: {type: String, trim:true, required:true, unique: true},
    password: {type: String, required: true},
    role: {type: String, default: 'ROLE_USER'},
    created: {type: Date, default: Date.now},    
});

userSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

userSchema.methods.validatePassword = function (password) {
    return bcrypt.compare(password, this.password);
}



module.exports = mongoose.model("User", userSchema);