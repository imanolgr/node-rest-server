const express = require('express');

const { verificarToken } = require('../middlewares/autenticacion')

let app = express();

let Producto = require('../models/producto');


//====================
// Obtener Productos
//====================

app.get('/producto', verificarToken, (req, res) => {

    let desde = (req.query.desde || 0);
    desde = Number(desde);

    Producto.find({ disponible: true })
        .skip(desde)
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });

        })
});

//====================
// Obtener Productos por ID
//====================
app.get('/producto/:id', verificarToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id, { disponible: true })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (producto) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El producto no existe o está deshabilitado'
                    }
                });
            }

            res.json({
                ok: true,
                producto
            });

        })
});

//====================
// Buscar productos
//====================
app.get('/producto/buscar/:termino', (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i'); //Expresión Regular

    Producto.find({ nombre: regex, disponible: true })
        .populate('usuario', 'nombre email')
        .exec((err, productosDB) => {

            if (err) {
                console.log(err);
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productosDB) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos: productosDB
            });

        })
});

//====================
// Crear Producto
//====================
app.post('/producto', verificarToken, (req, res) => {

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria
    });


    console.log(producto);

    producto.save((err, producto) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!producto) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto: producto
        });

    });

});

//====================
// Actualizar Producto
//====================
app.put('/producto/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    let body = req.body; //Pasamos que campos queremos modificar

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado
            });

        })
    })

});

//====================
// Actualizar Producto
//====================
app.delete('/producto/:id', verificarToken, (req, res) => {
    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }

        productoDB.disponible = false;

        productoDB.save((err, productoBorrado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoBorrado) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Hubo un fallo al borrar el producto'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoBorrado,
                mensaje: 'Producto borrado cambiando el estado'
            });

        })
    });
});

module.exports = app;