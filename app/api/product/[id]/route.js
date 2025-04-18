import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next"
import {authOptions} from '@/lib/auth'
import Product from "../../../../models/product";
import Favorite from "../../../../models/favorites";
export async function GET(req, {params}) {
    try {
        const session = await getServerSession(authOptions)
        if(!session) {
            console.log("session missing");
            return NextResponse.json(
                {error: 'unauthorized'},
                {status: 401}
            )
        }
        const {id} = await params
        const data = await Product.findOne({
            where: {
                id
            },
            include: [
                {
                    model: Favorite,
                    where: {
                        customer_id: session.user.id
                    },
                    required: false
                }
            ]
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