const { privateDecrypt } = require('crypto');
const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {

		res.render("products.ejs", { products:products })
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		let product = products.find(product => product.id == req.params.id)
		res.render("detail.ejs",{product:product})
	},

	// Create - Form to create
	create: (req, res) => {

		res.render("product-create-form.ejs")
	},

	// Create -  Method to store
	store: (req, res) => {

		res.send("producto creado")
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