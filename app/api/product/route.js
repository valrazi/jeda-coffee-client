import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next"
import {authOptions} from '@/lib/auth'
import Product from "../../../models/product";
import Subcategory from "../../../models/subcategory";
import Favorite from "../../../models/favorites";
export async function GET(req) {
    try {
        const subcategory = req.nextUrl.searchParams.get('subcategory')
        const query = {}
        if(subcategory) {
            query.subcategory_id = parseInt(subcategory)
        }
        const data = await Product.findAll({
            include: [
                {
                    model: Subcategory,
                },
                {
                    model: Favorite,
                    required: false
                }
            ],
            where: query
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