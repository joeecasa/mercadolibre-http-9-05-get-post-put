const fs = require('fs');
const path = require('path');
const bcryptjs = require("bcryptjs")
const User = require("../../models/User")
const { validationResult } = require("express-validator");
const { is } = require('express/lib/request');





const controller = {


	login: (req, res) => {
		res.render("login")
	},


	processLogin: (req, res) => {

		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			res.render("login", { errors: errors.mapped(), old: req.body })
		} else {
			res.send(`"hola" + ${req.body.name}, elegiste el color : ${req.body.color}, tu email es : ${req.body.email}`)
		}

	},
	login2: (req, res) => {
		res.render("login2")
	},


	processLogin2: (req, res) => {
		const errors = validationResult(req)
		let userToLogin = User.findByField("email", req.body.email)
		if (userToLogin) {
			let isOkpassword = bcryptjs.compareSync(req.body.password, userToLogin.password)
			if (isOkpassword) {
				req.session.userLogged = userToLogin
				if(req.body.recordame){
					res.cookie("userEmail", req.body.email, {maxAge : (1000 * 60)*2})
				}
				return res.redirect("/profile")
			} 
			res.render("login2", {
				errors: {
					email: {
						msg: "la credenciales son invalidas"
					}
				}
			})
		}

		res.render("login2", {
			errors: {
				email: {
					msg: " No se encuentra ese email en nuestra base de datos"
				}
			}
		})

	},
	createUser: function (req, res) {
		const errors = validationResult(req)

		if (errors.errors.length > 0) {
			return res.render("registro", {
				errors: errors.mapped(),
				old: req.body
			})
		}
		let userInDb = User.findByField("email", req.body.email)

		if (userInDb) {
			return res.render("registro", {
				errors: {
					email: {
						msg: " este email ya esta registrado"
					}
				},
				old: req.body
			})
		}

		let userToCreate = {
			...req.body,
			avatar: req.file.filename,
			password: bcryptjs.hashSync(req.body.password, 10)
		}

		let userCreated = User.create(userToCreate)

		return res.redirect("/login2")


	},
	register: (req, res) => {
		
		res.render("registro", { title: "Registro" }) },
	
	profile :  (req, res) => { 
		
		
		res.render("profile",{
		user : req.session.userLogged
	}) },
	logout : (req, res) => { 
		res.clearCookie("userEmail")
		req.session.destroy() 
	return res.redirect("/login2")
	},






}





module.exports = controller;
