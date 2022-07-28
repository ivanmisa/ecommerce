const mongoose = require('mongoose');
const port = process.env.PORT || 3800;
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const user_routes = require('./routes/user.routes');
const product_routes = require('./routes/products.routes');


const MONGODB_URI = 'mongodb+srv://ivan:gaiden9559@metropolis1.mrb9j.mongodb.net/?retryWrites=true&w=majority';




//Conexion a la base de datos
mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;

mongoose.connect(MONGODB_URI, {useNewUrlParser:true, useCreateIndex: true, useUnifiedTopology: true})
        .then(() => console.log('Base de datos'));

mongoose.connection.on('error', err => {
    console.log(`DB connection error: ${err.message}`);
});

//cors
app.use(cors());

//Middlewares
app.use(bodyParser.json());  


//Rutas
app.use("/api", user_routes);
app.use("/api", product_routes);


app.listen(port, function () {
    console.log('Server running');
});
  
