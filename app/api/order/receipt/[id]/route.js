import { NextResponse } from 'next/server'
import { createReceiptPDF } from '@/lib/receipt'
import Orders from '../../../../../models/order'
import OrderItem from '../../../../../models/order_item'
import Customer from '../../../../../models/customer'

export async function GET(request, { params }) {
    const {id} = await params
    const order = await Orders.findOne({
        where: { id: id },
        include: [
            {
                model: OrderItem,
                as: 'order_items'
            },
            {
                model: Customer,
            }
        ]
    })

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    const pdfBuffer = await createReceiptPDF(order)


    return new NextResponse(pdfBuffer, {
        headers: {
            'Content-Type': 'text/plain',
            'Content-Disposition': `attachment; filename="receipt-${order.id}.txt"`,
        },
    })
}
