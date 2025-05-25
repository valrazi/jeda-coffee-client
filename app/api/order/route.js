import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import Orders from "../../../models/order";
import OrderItem from "../../../models/order_item";
import Product from "../../../models/product";
import Review from "../../../models/reviews";
export async function GET(req) {
    try {
        const session = await  getServerSession(authOptions)
        if(!session) {
            console.log("session missing");
            return NextResponse.json(
                {error: 'unauthorized'},
                {status: 401}
            )
        }
        const order = await Orders.findAll({
            order: [
                ['createdAt', 'desc']
            ],
            include: [
                {
                    model: OrderItem,
                    as: 'order_items',
                    include: [
                        {
                            model: Product
                        }
                    ]
                },
                {
                    model: Review,
                }
            ],
            where: {
                customer_id: session.user.id
            }
        })
        return NextResponse.json({
            order
        }, {
            status: 200
        })
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {error: error.message || 'fetch order failed'},
            {status: 500}
        )
    }
}