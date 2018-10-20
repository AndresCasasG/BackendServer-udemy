//Require
var express = require("express");
var bcrypt = require("bcryptjs");

var jwt = require("jsonwebtoken");
var seed = require("../Config/config").SEED;

var app = express();
var Usuario = require("../Models/Usuario");

app.post("/", (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al buscar usuarios",
                errors: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: "Credenciales incorrectas",
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                message: "Credenciales incorrectas",
                errors: err
            });
        }

        //Crear un token
        usuarioDB.password = "XD";
        var token = jwt.sign({ usuario: usuarioDB }, seed, { expiresIn: 14400 })

        res.status(200).json({
            ok: true,
            message: "Login post corrector",
            usuario: usuarioDB,
            token: token,
            id: usuarioDB.id
        });
    });
});


module.exports = app;