const fs = require('fs');
const path = require('path');
const bcrypt = require("bcryptjs")

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const { validationResult } = require("express-validator");
const { resolveNaptr } = require('dns');








const controller = {


    
}

module.exports = controller;