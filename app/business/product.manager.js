import ProductsDAO from '../DAO/productDAO';

function create() {

  function getAllProducts() {
    return ProductsDAO.getAll();
  }

  function getProductsByCategory(category) {
    return ProductsDAO.getProductsByCategory(category);
  }

  return {
    get: getAllProducts,
    getProductsByCategory: getProductsByCategory,
  };
}

export default {
  create: create
};
