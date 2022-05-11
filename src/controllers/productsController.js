const { privateDecrypt } = require('crypto');
const fs = require('fs');
const path = require('path');
//para estos 3 no se puede usar const ya que mas abajo cuando reescribamos los json hay q volver a declarar las variables
// y las variables declaradas con const no se pueden modificar
let productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
let productJSON = fs.readFileSync(productsFilePath, 'utf-8')
let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {

		res.render("products.ejs", { products: products })
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		let product = products.find(product => product.id == req.params.id)
		res.render("detail.ejs", { product: product })
	},

	// Create - Form to create
	create: (req, res) => {
		res.render("product-create-form.ejs")
	},

	// Create -  Method to store
	store: (req, res) => {
		let ultimo = products.length -1  
		let idnuevo = products[ultimo].id + 1

		let productoForm = {
			id: idnuevo,
            name: req.body.name,
            price: req.body.price,
            discount: req.body.discount,
			category : req.body.category,
			description : req.body.description

        }
		    // primero : leer que cosas ya habia por que si yo ya tenia usuarios registrados no quiero pisarlos
        //let archivoUsuario = fs.readFileSync("usuarios.json", { encoding: "utf-8" })
		let productosNuevo
		// el archivo usuarios.json puede estar vacio( este es el caso ) por eso hacemos un if para q arranque vacio el array
		if (productJSON == "") {
			productosNuevo = []
		} else {
			// por el contrario, si el archivo ya tenia contenido lo descomprimimos pasandolo con json.parse a objeto literal para poder
			//manipularlo con JS
			productosNuevo = JSON.parse(productJSON)
		}

		productosNuevo.push(productoForm)

		// ahora ya tenemos el array con los usuarios pero es justamente un array entonces lo pasamos a json de nuevo
		products = JSON.stringify(productosNuevo)
		// una vez terminado este proceso si lo podemos escribir y siempre reemplaza pero esta creando todo el tiempo
		// un array nuevo con lo que hicimos arriba entonces no hay problema con usar la funcion write
		fs.writeFileSync(productsFilePath, products)

		res.redirect("/")
	},

	// Update - Form to edit
	edit: (req, res) => {
		let product = products.find(item => item.id == req.params.id)

		res.render("product-edit-form", { product: product })
	},
	// Update - Method to update
	update: (req, res) => {
		res.send("producto updated")
	},

	// Delete - Delete one product from DB
	destroy: (req, res) => {
		res.send("producto eliminado")
	}
};

module.exports = controller;