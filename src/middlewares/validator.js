const {body,check} = require("express-validator")

let validator = [
    body("name","poner un nombre").notEmpty(),

    body("edad", "edad").notEmpty().bail().isNumeric().withMessage("debes ingresar un numero"),

    body("email", "poner un mail valido").isEmail(),

    body("password","password valido").notEmpty()

]

module.exports = validator