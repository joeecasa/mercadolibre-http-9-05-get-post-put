const { privateDecrypt } = require('crypto');
const fs = require('fs');
const { findSourceMap } = require('module');
const path = require('path');




//let productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
//let productJSON = fs.readFileSync(productsFilePath, 'utf-8')
//let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {
		//para estos 3 no se puede usar const ya que mas abajo cuando reescribamos los json hay q volver a declarar las variables
		// y las variables declaradas con const no se pueden modificar
		let productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
		let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
		let productJSON = fs.readFileSync(productsFilePath, 'utf-8')
		res.render("products", { products: products })
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		let productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
		let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

		let productJSON = fs.readFileSync(productsFilePath, 'utf-8')

		let product = products.find(product => product.id == req.params.id)
		res.render("detail", { product: product })
	},

	// Create - Form to create
	create: (req, res) => {
		let productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
		let productJSON = fs.readFileSync(productsFilePath, 'utf-8')
		let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
		res.render("product-create-form.ejs")
	},

	// Create -  Method to store
	store: (req, res) => {
		let productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
		let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
		let productJSON = fs.readFileSync(productsFilePath, 'utf-8')

		let ultimo = products.length - 1
		let idnuevo = products[ultimo].id + 1
		let image = ""
		
		if (req.file) {
			img = req.file.filename
		}

		let productoForm = {
			id: idnuevo,
			name: req.body.name,
			price: req.body.price,
			discount: req.body.discount,
			category: req.body.category,
			description: req.body.description,
			image: image,
			otro: req.body.otro,
			check: req.body.check

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

		let dani = JSON.stringify(productosNuevo, null, "\t")
		//products = JSON.stringify(productosNuevo,null,"\t")
		// una vez terminado este proceso si lo podemos escribir y siempre reemplaza pero esta creando todo el tiempo
		// un array nuevo con lo que hicimos arriba entonces no hay problema con usar la funcion write
		fs.writeFileSync(productsFilePath, dani)

		res.redirect("/products")
	},

	// Update - Form to edit
	edit: (req, res) => {
		let productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
		let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
		let productJSON = fs.readFileSync(productsFilePath, 'utf-8')

		let product = products.find(item => item.id == req.params.id)

		res.render("product-edit-form", { product: product })
	},
	// Update - Method to update
	update: (req, res) => {
		let productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
		let productJSON = fs.readFileSync(productsFilePath, 'utf-8')
		let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

		products.find(e => {
			if (e.id === parseInt(req.params.id)) {
				e.name = req.body.name;// validar 
				e.price = req.body.price;
				e.discount = req.body.discount;
				e.category = req.body.category;
				e.description = req.body.description;
				e.image = req.file.filename
			}
		})

		fs.writeFileSync(productsFilePath, JSON.stringify(products, null, "\t"))


		res.redirect("/products")
	},

	// Delete - Delete one product from DB
	destroy: (req, res) => {
		let productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
		let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
		let productJSON = fs.readFileSync(productsFilePath, 'utf-8')

		//let newList = products.find(product => product.id === parseInt(req.params.id));// se puede hacer asi tmb
		let newList = products.filter(product => product.id !== parseInt(req.params.id))
		fs.writeFileSync(productsFilePath, JSON.stringify(newList));
		products = newList


		res.redirect("/products")
	}
};

module.exports = controller;


