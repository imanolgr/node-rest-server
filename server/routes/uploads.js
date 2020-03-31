const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningún archivo'
                }
            });
    }

    //valida tipo
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) { //Si no esta en el vector la extensión pues dará -1
        return res.status(400).json({
                ok: false,
                err: {
                    message: 'El tipo no es correcto, los tipos son:' + tiposValidos.join(', '),
                    tipos: tipo
                }
            }) //el .join une los elementos del vector con lo que pongamos ahí
    }


    let archivo = req.files.archivo;
    let extensionesValidas = ['png', 'jpg', 'gif'];
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];



    if (extensionesValidas.indexOf(extension) < 0) { //Si no esta en el vector la extensión pues dará -1
        return res.status(400).json({
                ok: false,
                err: {
                    message: 'La extensión no es correcta, las extensiones válidas son:' + extensionesValidas.join(', '),
                    ext: extension
                }
            }) //el .join une los elementos del vector con lo que pongamos ahí
    }

    //Cambiar el nombre al archivo
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds()  }.${ extension }`;

    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {

        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }
    })

});

function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            borraArchivo(nombreArchivo, 'usuarios'); //si hay problema con el usuario o no existe pues borro
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuarios'); //si hay problema con el usuario o no existe pues borro
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            })
        }

        borraArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });

        });

    });
}

function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            borraArchivo(nombreArchivo, 'productos'); //si hay problema con el usuario o no existe pues borro
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            borraArchivo(nombreArchivo, 'productos'); //si hay problema con el usuario o no existe pues borro
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            })
        }

        // borraArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                usuario: productoGuardado,
                img: nombreArchivo
            })
        })

    });
}

function borraArchivo(nombreImagen, tipo) {
    //Borra la imagen. La busca primero en el path y si existe la borra
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;