require('./config/config');

const mongoose = require('mongoose');
const path = require('path');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
//Cada petición que hagamos pasa por el parser
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//parse application/json
app.use(bodyParser.json());



//Habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));


//Configuracion global de rutas
app.use(require('./routes/index'));

app.get('/', (req, res) => {
    res.json('Hola Mundo');
});

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true },
    (err, res) => {

        if (err) throw err;

    });


app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto ${process.env.PORT}`);
});