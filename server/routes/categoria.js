const express = require('express');

const { verificarToken, verificarAdminRole } = require('../middlewares/autenticacion');

let app = express();

const Categoria = require('../models/categoria');
const Usuario = require('../models/usuario');

//MOSTRAR TODAS LAS CATEGORIAS
app.get('/categoria', verificarToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            });

        })
});

//MOSTRAR UNA CATEGORIA POR ID
app.get('/categoria/:id', verificarToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    })
});

//CREAR NUEVA CATEGORIA
app.post('/categoria', verificarToken, (req, res) => {
    let body = req.body;

    console.log('usuario', req.usuario._id);

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoria) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoria) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoria
        });

    });
});

//ACTUALIZAR  CATEGORIA
app.put('/categoria/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    let body = req.body; //Pasamos que campos queremos modificar

    let desCategoria = {
        descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate(id, desCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    })
});

//ELIMINA  CATEGORIA
app.delete('/categoria/:id', [verificarToken, verificarAdminRole], (req, res) => {
    //Regresa la nueva categoría
    let id = req.params.id;


    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoria borrada'
        });

    })

});

module.exports = app;