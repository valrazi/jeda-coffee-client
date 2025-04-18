import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import Favorite from "../../../models/favorites";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions)
        if(!session) {
            console.log('Session Missing');
            return NextResponse.json(
                {error: 'unauthorized'},
                {status: 401}
            );
        }
        const body = await req.json()
        let data = await Favorite.findOne({
            where: {
                customer_id: session.user.id,
                product_id: body.product_id
            }
        })
        if(!data) {
            data = await Favorite.create({
                customer_id: session.user.id,
                product_id: body.product_id
            })
        }
        return NextResponse.json({
            data
        }, {
            status: 200
        })
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: error.message || 'fetch subject failed' },
            { status: 500 }
        )
    }
}

export async function DELETE(req) {
    try {
        const session = await getServerSession(authOptions)
        if(!session) {
            console.log('Session Missing');
            return NextResponse.json(
                {error: 'unauthorized'},
                {status: 401}
            );
        }
        const productId = req.nextUrl.searchParams.get('product_id')
        
        const data = await Favorite.findOne({
            where: {
                customer_id: session.user.id,
                product_id: parseInt(productId)
            }
        })
        if(!data) return NextResponse.json({error: 'Product not found'}, {status: 404})
        await data.destroy()
        return NextResponse.json({message: 'success deleted'}, {status: 200})
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: error.message || 'fetch subject failed' },
            { status: 500 }
        )
    }
}