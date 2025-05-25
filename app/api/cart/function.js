import dayjs from "dayjs";
import Cart from "../../../models/cart";
import CartItem from "../../../models/cart_item";
import Orders from "../../../models/order";
import OrderItem from "../../../models/order_item";
import Product from "../../../models/product";
import { Op } from "sequelize";

export async function getDetail(id) {
    try {
        let cart = await Cart.findOne({
            where: {
                id
            },
            include: [
                {
                    model: CartItem,
                    as: 'cart_items',
                    include: [
                        {
                            model: Product
                        }
                    ]
                }
            ]
        })
        if (!cart) throw new Error('Cart not found')
        if (cart.cart_items && cart.cart_items.length) {
            let total = 0
            cart.cart_items.forEach((c) => {
                total += +c.total_price
            })
            cart.total_price = total
        } else {
            cart.total_price = 0
        }
        await cart.save()
        return cart
    } catch (error) {
        console.log(error);
        throw error
    }
}

export async function getByCustomer(customer_id) {
    try {
        let cart = await Cart.findOne({
            where: {
                customer_id,
                checkout_at: null
            },
            include: [
                {
                    model: CartItem
                }
            ]
        })
        if (!cart) {
            const total = await Cart.count({ paranoid: false }); // count all including soft-deleted

            const nextNumber = total + 1;
            const formattedId = 'CAR' + String(nextNumber).padStart(3, '0');

            cart = await Cart.create({
                id: formattedId,
                customer_id
            })
        }
        cart = await getDetail(cart.id)
        return cart
    } catch (error) {
        console.log(error);
        throw error
    }
}

export async function addItem(product_id, cart_id, {
    quantity, note
}) {
    try {
        const product = await Product.findOne({
            where: {
                id: product_id
            }
        })
        if (!product) throw new Error('Product not found')
        if (!quantity || quantity <= 0) throw new Error('Quantity must be more than 1')
        let cart = await getDetail(cart_id)
        if (cart.cart_items.length) {
            const cartItem = cart.cart_items.find((c) => c.product_id == product_id)
            if (cartItem) {
                cartItem.quantity = quantity
                cartItem.total_price = product.price * quantity
                cartItem.note = note
                await cartItem.save()
                await cart.save()
            } else {
                const cartItem = await CartItem.create({
                    cart_id,
                    product_id: product.id,
                    quantity,
                    name: product.name,
                    note,
                    price: product.price,
                    total_price: product.price * quantity
                })
                cartItem.save()
                cart.save()
            }
        } else {
            const cartItem = await CartItem.create({
                cart_id,
                product_id: product.id,
                quantity,
                name: product.name,
                note,
                price: product.price,
                total_price: product.price * quantity
            })
        }
        cart = await getDetail(cart_id)
        return cart
    } catch (error) {
        console.log(error);
        throw error
    }
}

export async function deleteItem(cart_id, cart_item_id) {
    try {
        let cart = await getDetail(cart_id)
        const isExist = cart.cart_items.find((c) => c.id == cart_item_id)
        if (isExist) {
            await isExist.destroy()
        }
        await cart.save()
        cart = await getDetail(cart_id)
        return cart
    } catch (error) {
        console.log(error);
        throw error
    }
}

export async function checkoutCart(cart_id, table_number, transfer_proof, paid_at_cashier) {
    try {
        const cart = await getDetail(cart_id)
        const total = await Orders.count({ paranoid: false }); // count all including soft-deleted

        const nextNumber = total + 1;
        const formattedId = 'ORD' + String(nextNumber).padStart(3, '0');
        console.log({formattedId});
        const order = await Orders.create({
            id: formattedId,
            customer_id: cart.customer_id,
            total_price: cart.total_price,
            payment_status: 'pending',
            order_status: 'pending',
            payment_method: 'card',
            checkout_at: new Date(),
            table_number,
            transfer_proof,
            paid_at_cashier: paid_at_cashier ? true : false
        })
        const today = dayjs().format('DDMMYY')
        const orderCount = await Orders.count({
            where: {
                createdAt: {
                    [Op.gte]: dayjs().startOf('day').toDate(),
                    [Op.lte]: dayjs().endOf('day').toDate(),
                }
            }
        })

        const orderNumber = String(orderCount).padStart(4, '0') // 0001
        const orderIdFormatted = `ORD${today}${orderNumber}`

        order.order_id = orderIdFormatted
        await order.save()

        for (const item of cart.cart_items) {
            await OrderItem.create({
                order_id: order.id,
                product_id: item.product_id,
                name: item.name,
                note: item.note,
                quantity: item.quantity,
                price: item.price,
                total_price: item.total_price
            });

            const product = await Product.findOne({
                where: {
                    id: item.product_id
                }
            })

            product.stock = product.stock - item.quantity
            await product.save()
        }
        cart.checkout_at = new Date()
        await cart.save()
        return order
    } catch (error) {
        console.log(error);
        throw error
    }
}