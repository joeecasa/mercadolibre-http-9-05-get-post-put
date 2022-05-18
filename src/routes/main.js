// ************ Require's ************
const express = require('express');
const router = express.Router();
//***********path ****************/
const path = require('path');

//*********multer ********/

const multer = require("multer")

const {body} = require("express-validator")


const validations = [
body("nombre").notEmpty().withMessage("tienes que escribir un nombre"),
body("usuario").notEmpty().withMessage("tienes que escribir un usuario"),
body("email").notEmpty().withMessage("tienes que escribir un email valido"),
body("domicilio1").notEmpty().withMessage("tienes que escribir un domicilio"),
body("fecha").notEmpty().withMessage("Tienes que poner una fecha valida"),
body("pass").notEmpty().withMessage("tienes que escribir un pass"),
body("pass2").notEmpty().withMessage("tienes que escribir un pass"),
body("img").custom((value, {req}) => {
    let file = req.file
    let acceptedExtensions = [".jpg",".png", ".gif", ".jpeg"]
    if(!file){
        throw new Error("Tienes que subir una imagen")
    }else{
        let fileExtension = path.extname(file.originalname)
        if(!acceptedExtensions.includes(fileExtension)){
            throw new Error(`las extensiones de archivo validas son ${acceptedExtensions.join(" , ")}`)
        }
    }


    return true;
})



]

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../../public/images/users"))
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname))
    }
}
)
const upload = multer({ storage })

// ************ Controller Require ************
const mainController = require('../controllers/mainController');

router.get('/', mainController.index); 
router.get('/search', mainController.search); 
//registro//
router.get('/register', mainController.register);
router.post('/register' ,upload.single("img"),validations, mainController.createUser);
module.exports = router;
