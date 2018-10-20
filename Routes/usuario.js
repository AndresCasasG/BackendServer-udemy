//Require
var express = require("express");
var bcrypt = require("bcryptjs");

var auth = require("../middlewares/autenticacion");

var app = express();
var Usuario = require("../Models/Usuario");

// ==============================================
// Obtener todos los usuarios
// ==============================================
app.get("/", (req, res, next) => {
    Usuario.find({}, "name email img role")
        .exec((err, Usuarios) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "Error cargando usuario",
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                Usuarios: Usuarios
            });
        });
});

// ==============================================
// Actualizar un usuario
// ==============================================

app.put("/:id", auth.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al buscar usuario",
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: `El usuario con el id: ${id} no existe`,
                errors: { message: "No existe un usuario con ese ID" }
            });
        }

        usuario.name = body.name;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "Error al actualizar usuario",
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });
    });
});

// ==============================================
// Postear un usuario
// ==============================================

app.post("/", auth.verificaToken ,(req, res) => {
    var body = req.body;
    var usuario = new Usuario({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: "Error al crear usuario",
                errors: err
            });
        }
        usuarioGuardado.password = "XD";

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        });
    });
});

// ==============================================
// Actualizar un usuario
// ==============================================

app.delete("/:id", auth.verificaToken, (req, res) => {
    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al buscar usuario",
                errors: err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: "No existe un usuario con ese ID",
                errors: { message: "No existe un usuario con ese ID" }
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });

    });
});

module.exports = app;