import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next"
import Orders from "../../../../../models/order";
export async function POST(req, {params}) {
    try {
        const {id} = await params
        // const body = await req.json()
        const order = await Orders.findOne({
            where: {
                id
            }
        })
        if(!order) return NextResponse.json(
            {error: 'Order not found'},
            {status: 404}
        )
        if(order.order_status != 'ready') return NextResponse.json(
            {error: 'Order not ready, it cannot be canceled'},
            {status: 400}
        )
        order.order_status = 'completed'
        await order.save()
        return NextResponse.json({
            order
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