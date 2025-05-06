import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next"
import {authOptions} from '@/lib/auth'
import Product from "../../../models/product";
import Subcategory from "../../../models/subcategory";
import Favorite from "../../../models/favorites";
import { col, fn } from "sequelize";
export async function GET(req) {
    try {
        const subcategory = req.nextUrl.searchParams.get('subcategory')
        const query = {}
        const order = []
        if(subcategory) {
            query.subcategory_id = subcategory
        }
        if(query.orderBy && query.order && (query.order?.toLowerCase() == 'desc' || query.order?.toLowerCase() == 'asc')) {
            if(query.orderBy == 'favoriteCount') {
               order.push([literal('favoriteCount'), query.order])
            }else {
                order.push([query.orderBy, query.order])
            }
        }
        const data = await Product.findAll({
            include: [
                {
                    model: Subcategory,
                },
                {
                    model: Favorite,
                    required: false,
                    attributes: [] 
                }
            ],
            attributes: {
                include: [
                    [fn('COUNT', col('favorites.id')), 'favoriteCount']
                ]
            },
            group: ['products.id', 'subcategory.id'],
            where: query,
            limit: query.limit && Number(query.limit) ? Number(query.limit) : null,
            order,
        })
        return NextResponse.json({
            data
        }, {
            status: 200
        })
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {error: error.message || 'fetch subject failed'},
            {status: 500}
        )
    }
}