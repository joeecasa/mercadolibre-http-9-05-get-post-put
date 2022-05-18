const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const { validationResult } = require("express-validator")

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const visited = products.filter(function (product) {
	return product.category == "visited";
})
const inSale = products.filter(function (product) {
	return product.category == "in-sale";
})



const controller = {
	index: (req, res) => {
		const product = products.filter(item => item.id == req.param.id)

		res.render("index.ejs", {
			visited: visited,
			inSale: inSale
		})
	},
	search: (req, res) => {

		let busqueda = []
		let formu = req.query.keywords
		products.forEach(product => {
			if (product.name.includes(formu)) {
				busqueda.push(product)
			}

		});
		res.render("results.ejs", { busqueda: busqueda })
	},
	createUser: function (req, res) {
		// let usersFilePath = path.join(__dirname, '../data/users.json');
		// let users = JSON.parse(fs.readFileSync(usersFilePath,'utf-8')); //de JSON a JS
		let usersFilePath = path.join(__dirname, '../data/users.json');
		let users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
		const errors = validationResult(req)
		if (errors.isEmpty()) {

			let ultimoElemento = users.length - 1
			let idNuevo = users[ultimoElemento].id + 1

			let userForm = {
				id: idNuevo,
				NombreYapellido: req.body.Nombre,
				Usuario: req.body.usuario,
				Email: req.body.email,
				FechaNacimiento: req.body.fecha,
				Domicilio1: req.body.domicilio1,
				Domicilio2: req.body.domicilio2,
				Contraseña: req.body.pass,
				ConfirmarContraseña: req.body.pass2
			}
			

			let NewUser = []
			let UsersJSON = fs.readFileSync(usersFilePath, 'utf-8')
			if (UsersJSON == "") {
				NewUser.push(userForm)
			}
			else {
				NewUser = JSON.parse(UsersJSON) //de JSON a JS
				NewUser.push(userForm)
			}

			fs.writeFileSync(usersFilePath, JSON.stringify(NewUser, null, "\t")) //de JS a JSON

			res.redirect("/products")
			
		} 
		else{

			res.render("registro",{errors : errors.array(),
			old : req.body})
			console.log(errors.array())
			//console.log(req.body)
		}


	},
	register: (req, res) => { res.render("registro", { title: "Registro" }) }


};

module.exports = controller;
