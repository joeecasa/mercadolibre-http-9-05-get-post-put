// ************ Require's ************
const express = require('express');
const router = express.Router();
//***********path ****************/
const path = require('path');

//*********multer ********/
const multer = require("multer")

const {body,check} = require("express-validator")

const authMiddleware = require("../middlewares/authMiddleware")
const guestMiddleware = require("../middlewares/guestMiddleware")// este se lo pasamos a registro y a login
// si estas logueado o sea que si userLogged existe, no te deja entrar a registro ni a login
const validator = require("../middlewares/validator")

const validations = [
    check("nombre").notEmpty().withMessage("tienes que escribir un nombre"),
    body("email").notEmpty().withMessage("tienes que escribir un email valido").bail()
    .isEmail().withMessage(" correo valido"),
    body("password").notEmpty().withMessage("tienes que escribir un pass"),
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
            cb(null,  req.body.email + "-" + file.fieldname + "-" + Date.now() + path.extname(file.originalname))
        }
    }
    )
    const upload = multer({ storage })


// ************ Controller Require ************
const mainController = require('../controllers/mainController');
const req = require('express/lib/request');




router.get("/",mainController.login)

router.post("/", validator ,mainController.processLogin)

router.get("/login2",guestMiddleware,mainController.login2)

router.post("/login2", validator ,mainController.processLogin2)

router.get('/registro', guestMiddleware , mainController.register);

router.post('/registro' ,upload.single("img"),validations, mainController.createUser);

router.get("/profile",authMiddleware, mainController.profile)
router.get("/logout", mainController.logout)



module.exports = router;
