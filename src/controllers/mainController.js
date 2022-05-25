const fs = require('fs');
const path = require('path');
const bcrypt = require("bcryptjs")

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const { validationResult } = require("express-validator");
const { resolveNaptr } = require('dns');

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
		

		let validationUser = users.find (user => {
			return user.Email == req.body.email
		})
		if (errors.isEmpty()) {
			
			if(validationUser){
				res.send("registro", {errors : errors.array()})
			} else {
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
				Contraseña: bcrypt.hashSync(req.body.pass, 10),
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

		}
		else {

			res.render("registro", {
				errors: errors.mapped(),
				old: req.body
			})
			//console.log(errors.array())
			//console.log(req.body)
		}


	},
	register: (req, res) => { res.render("registro", { title: "Registro" }) },

	login: (req, res) => {
		res.render("login")
	},
	processLogin: (req, res) => {
		const errors = validationResult(req)
		let usersFilePath = path.join(__dirname, '../data/users.json');
		let users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));

		if (errors.isEmpty()) {
			let users = []
			let UsersJSON = fs.readFileSync(usersFilePath, 'utf-8')
			if (UsersJSON == "") {
				users = []
			}
			else {
				users = JSON.parse(UsersJSON) //de JSON a JS
			}
			// users.forEach(hola=>{
			// 	console.log(hola.Contraseña)
			// })
			let usuarioALoguearse
			for (let i = 0; i < users.length; i++) {
				if (users[i].Email == req.body.email) {
					
					if (bcrypt.compareSync(req.body.password, users[i].Contraseña)) {
						usuarioALoguearse = users[i]
						break;
					}
				}
				
			}
			console.log("hola",usuarioALoguearse)
			req.session.usuarioALoguearse = usuarioALoguearse
			console.log("session",req.session.usuarioALoguearse)
			if (usuarioALoguearse == undefined) {
				//res.send("usuario inexistente")// esto funciona para probar
				// lo que sigue hicieron en el video a mi no me funciona
				res.render("login",{errors:  {msg: "credenciales invalidas"}   })
				console.log
			} else {
				
				
				res.redirect("/check")
			}
			
			console.log("usuario2",usuarioALoguearse)
			if (req.body.recordame != undefined) {
				res.cookie("recordame",
					usuarioALoguearse.Email,
					{ maxAge: 60000 }
				)
			}

		} else {

			res.render("login", {
				errors: errors.mapped(),
				old: req.body
			})
		}
	}



};

module.exports = controller;
