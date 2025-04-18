// lib/pdf.js

import receipt from 'receipt'
export async function createReceiptPDF(order) {
    receipt.config.currency = 'Rp.';
    receipt.config.width = 50;
    receipt.config.ruler = '=';
    const receiptText = receipt.create([
        { type: 'text', value: ['Jeda Coffee Receipt'], align: 'center' },
        { type: 'empty' },
        {
            type: 'properties', lines: [
                { name: 'Order Number', value: order.order_id ?? order.id },
                { name: 'Table Number', value: order.table_number },
                { name: 'Customer', value: `${order.customer.full_name} (${order.customer.phone_number})` },
                { name: 'Date', value: order.createdAt.toLocaleString() }
            ]
        },
        {
            type: 'table', lines: [
                ...order.order_items.map((item) => ({ item: item.name, qty: item.quantity, cost:  Number(item.price * 100)})),
            ]
        },
        { type: 'empty' },
        {
            type: 'properties', lines: [
                { name: 'Total Price', value: 'Rp.' + Number(order.total_price).toLocaleString('id-ID') }
            ]
        },
    ])

    return receiptText
}
