/**
 * @file productRoutes.ts
 * @description This file contains all the routes for product operations
 */
import express, { Router } from 'express';

//services - function request handlers for each route
import productAdd from '../services/products/productAdd';
import productGet from '../services/products/productGet';
import productEdit from '../services/products/productEdit';
import productDelete from '../services/products/productRemove';

import userCheckAdmin from '../services/user/auth/userCheckAdmin';


const ProductRouter: Router = express.Router();

ProductRouter.post('/add', userCheckAdmin, productAdd);
ProductRouter.get('/get', productGet);
ProductRouter.put('/:id', productEdit);
ProductRouter.delete('/remove', userCheckAdmin, productDelete);

export default ProductRouter;