// ************ Require's ************
const express = require('express');
const router = express.Router();
//***********path ****************/
const path = require('path');

//*********multer ********/

const multer = require("multer")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../../public/images/products"))
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname))
    }
}
)
const upload = multer({ storage })

// ************ Controller Require ************
const productsController = require('../controllers/productsController');

/*** GET ALL PRODUCTS ***/
router.get('/', productsController.index);

/*** CREATE ONE PRODUCT ***/
router.get('/create/', productsController.create);
router.post('/', upload.single("img") , productsController.store);




/*** GET ONE PRODUCT ***/
router.get('/detail/:id/', productsController.detail);

/*** EDIT ONE PRODUCT ***/
router.get('/edit/:id', productsController.edit);

router.put('/edit/:id', upload.single("img"), productsController.update);


/*** DELETE ONE PRODUCT***/
router.delete('/delete/:id', productsController.destroy);


module.exports = router;
