import mongoose from 'mongoose';
import applicationException from '../service/applicationException';
import mongoConverter from '../service/mongoConverter';


const productSchema = new mongoose.Schema({
    bottle: String,
    name: String,
    tableLabels: {
        wartoscOdzywcza: String,
        wartoscEnergetyczna: String,
        tluszcz: String,
        wTymKwasyNasycone: String,
        weglowodany: String,
        wTymCukry: String,
        bialko: String,
        sol: String,
        witaminaC: String,
    },
    tableValues: {
        wartoscOdzywcza: String,
        wartoscEnergetyczna: String,
        tluszcz: String,
        wTymKwasyNasycone: String,
        weglowodany: String,
        wTymCukry: String,
        bialko: String,
        sol: String,
        witaminaC: String,
    },
    category: String,
    price: Number,
    netPrice: Number,
    vat: Number,
    hint: String,
    number: Number
}, {
    collection: 'product'
});

const ProductModel = mongoose.model('products', productSchema);

async function getAll() {
    const result = await ProductModel.find().sort({number: 1});
    if (result) {
        return result;
    }
    throw applicationException.new(applicationException.BAD_REQUEST, 'Could not find any products');
}

async function getProductsByCategory(category) {
    const result = await ProductModel.find({category: category});
    if (result) {
        return mongoConverter(result);
    }
    throw applicationException.new(applicationException.BAD_REQUEST, 'No products with that category');
}

export default {
    getAll: getAll,
    getProductsByCategory: getProductsByCategory,
    model: ProductModel,
};
