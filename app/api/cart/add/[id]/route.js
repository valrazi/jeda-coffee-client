import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next"
import {authOptions} from '@/lib/auth'
import {addItem, deleteItem} from '../../function'
export async function POST(req, {params}) {
    try {
        const {id} = await params
        const body = await req.json()
        const {product_id, quantity, note} = body
        const cart = await addItem(product_id, id, {quantity, note})
        return NextResponse.json({
            cart
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
