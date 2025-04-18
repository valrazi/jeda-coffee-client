import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next"
import {authOptions} from '@/lib/auth'
import {checkoutCart} from '../../function'
export async function POST(req, {params}) {
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
        const body = await req.json()
        const {table_number, transfer_proof, paid_at_cashier} = body
        const cart = await checkoutCart(id, table_number, transfer_proof, paid_at_cashier)
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