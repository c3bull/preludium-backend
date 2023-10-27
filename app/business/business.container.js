'use strict';

import orderManager from './order.manager';
import productManager from './product.manager';
import userManager from './user.manager';

function getter(manager, request) {
  return function () {
    return manager.create(request, this);
  };
}

export default {
    getOrderManager: getter(orderManager),
    getProductManager: getter(productManager),
    getUserManager: getter(userManager)
};
