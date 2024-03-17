const express = require('express');
const { createOrder, fetchOrdersByUser, deleteOrder, updateOrder } = require('../controller/Order');

const router = express.Router();

router.post('/', createOrder)
      .get('/own', fetchOrdersByUser)
      .delete('/:id', deleteOrder)
      .patch('/:id', updateOrder)


exports.router = router;