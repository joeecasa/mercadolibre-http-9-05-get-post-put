// ************ Require's ************
const express = require('express');
const router = express.Router();
//***********path ****************/
const path = require('path');

//*********multer ********/

const multer = require("multer")

const {body,check} = require("express-validator")


const validations = [
check("nombre").notEmpty().withMessage("tienes que escribir un nombre"),
body("usuario").notEmpty().withMessage("tienes que escribir un usuario"),
body("email").notEmpty().withMessage("tienes que escribir un email valido").bail()
.isEmail().withMessage(" correo valido"),
body("domicilio1").notEmpty().withMessage("tienes que escribir un domicilio"),
body("fecha").notEmpty().withMessage("Tienes que poner una fecha valida"),
body("pass").notEmpty().withMessage("tienes que escribir un pass"),
body("pass2").notEmpty().withMessage("tienes que escribir un pass"),
body("img").custom((value, {req}) => {
    let file = req.file
    if(!file){
        throw new Error("Tienes que subir una imagen")
    }else{
        let acceptedExtensions = [".jpg",".png", ".gif", ".jpeg"]
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


const authMiddleware = require("../middlewares/authMiddleware")
const guestMiddleware = require("../middlewares/guestMiddleware")


const user = require("./user")
router.use("/user", user)

// ************ Controller Require ************
const mainController = require('../controllers/mainController');
const userController = require("../controllers/userControllers")
const app = require('../app');

router.get('/', mainController.index); 
router.get('/search', mainController.search); 
//registro//
router.get('/register',guestMiddleware , mainController.register);
router.post('/register' ,upload.single("img"),validations, mainController.createUser);


router.get("/pruebaSession",function(req,res){
    if(req.session.numeroVisitas == undefined){
        req.session.numeroVisitas = 0;
    }
    req.session.numeroVisitas++ 
    res.send("sesion tiene el numero" + req.session.numeroVisitas )
})

let validator = [
    check("email").isEmail().withMessage("poner mail valido"),
    check("password").isLength({min:2}).withMessage("la contra debe tener 8")
]
router.get("/login",mainController.login)
router.post("/login", validator,mainController.processLogin)

router.get("/check", function(req,res){
    if(req.session.usuarioALoguearse == undefined){
        res.send("no estas logueado")
    }else{
       
        res.send("el usuario logueado es " + req.session.usuarioALoguearse.Email)
    }
})

module.exports = router;
