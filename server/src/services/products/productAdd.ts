/**
 * @file productAdd.ts
 * @description This file contains the route for adding a product to the database
 */

import { Request, Response, NextFunction } from "express";

import DatabaseError from "../error/databaseError";

import prisma from "../../repositories/prismaClient";

export default async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { name, price, stock, description, category, brand} = req.body;
		const product = await prisma.product.create({
			data: {
				name,
				sell_price: Number(price),
				stock : Number(stock),
				brand,
				description,
				product_category: {
					connect: {
						category_ID: category,
					}
				},
				avg_value: Number(price) * Number(stock),
				last_updated: new Date(),

			},
		});
		res.json(product);
	} catch (error : any) {
		next(DatabaseError.DBError(error.code));
	}
}