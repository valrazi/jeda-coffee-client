import { getServerSession } from "next-auth"
import Review from "../../../../../models/reviews"
import { NextResponse } from "next/server"
import Customer from "../../../../../models/customer"
import { authOptions } from "@/lib/auth"

export async function POST(req, {params}) {
    const session = await getServerSession(authOptions)
    const {id} = await params
    const body = await req.json()
    const {rate, message} = body

    const review = await Review.create({
        customer_id: session.user.id,
        rate,
        message,
        order_id: id
    })

    return NextResponse.json({
        data: review.toJSON()
    }, {
        status: 201
    })
}