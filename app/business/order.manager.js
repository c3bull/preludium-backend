import OrderDAO from '../DAO/orderDAO';


function create() {

  function get() {
    return OrderDAO.get();
  }

  function getOrderByUserEmail(email) {
    return OrderDAO.getByUserEmail(email);
  }

  function getAllOrders() {
    return OrderDAO.getAllOrders();
  }

  function makeOrder(orderDetails) {
    return OrderDAO.makeOrder(orderDetails);
  }

  function deleteLastOrder() {
    return OrderDAO.deleteLastOrder();
  }

  function deleteOrderById(orderId) {
    return OrderDAO.deleteOrderById(orderId);
  }

  function updateStatusById(orderId, status) {
    return OrderDAO.updateStatusById(orderId, status);
  }

  return {
    get: get,
    getOrderByUserEmail: getOrderByUserEmail,
    getAllOrders: getAllOrders,
    makeOrder: makeOrder,
    deleteLastOrder: deleteLastOrder,
    deleteOrderById: deleteOrderById,
    updateStatusById: updateStatusById,
  };
}

export default {
  create: create
};
