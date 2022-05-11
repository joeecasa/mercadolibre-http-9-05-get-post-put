const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

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
			inSale: inSale })
	},
	search: (req, res) => {
		
		let busqueda = []
		let formu = req.query.keywords
		products.forEach(product => {
			if (product.name.includes(formu) ) {
				 busqueda.push(product)
			}
			
		});
		res.render("results.ejs", {busqueda:busqueda})
	},
};

module.exports = controller;
