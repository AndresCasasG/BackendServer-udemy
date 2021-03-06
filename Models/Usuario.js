var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ["ADMIN_ROLE", "USER_ROLE"],
    message: '{VALUE} no es un rol permitido'
}

var usuarioSchema = new Schema({
    name: { type:String, required: [true, "El nombre es necesario"] },
    email: { type:String, unique: true , required: [true,"El correo es necesario"] },
    password: { type:String, required: [true,"La contraseña es necesaria"] },
    img: { type:String, required: false },
    role: { type:String, required: true, uppercase:true, default: "USER_ROLE", enum: rolesValidos }
},
{
    versionKey: false
});

usuarioSchema.plugin(uniqueValidator, { message: "{PATH} El correo debe de ser único" });

module.exports = mongoose.model("Usuarios", usuarioSchema);