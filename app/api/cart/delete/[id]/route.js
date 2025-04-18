import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next"
import {authOptions} from '@/lib/auth'
import {deleteItem} from '../../function'
export async function POST(req, {params}) {
    try {
        const {id} = await params
        const body = await req.json()
        const {cart_item_id} = body
        const cart = await deleteItem(id, cart_item_id)
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