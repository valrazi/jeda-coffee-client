import { NextResponse } from "next/server";
import Customer from "../../../../models/customer";
import bcrypt from 'bcryptjs'
import { Op } from "sequelize";
export async function POST(req) {
    try {
        const body = await req.json()
        const { email, password, full_name, phone_number, security_question, security_answer, kota_asal } = body
        const customerExist = await Customer.findOne({
            where: {
                [Op.or]: {
                    email,
                    phone_number
                }
            }
        })
        if (customerExist) {
            return NextResponse.json(
                { error: 'Email / Phone Number already been used!' },
                { status: 400 }
            )
        }
        const totalCustomers = await Customer.count({ paranoid: false }); // count all including soft-deleted

        const nextNumber = totalCustomers + 1;
        const formattedId = 'CUS' + String(nextNumber).padStart(3, '0');

        let customer = await Customer.create({
            id: formattedId,
            email,
            password: bcrypt.hashSync(password),
            full_name,
            phone_number,
            security_question,
            security_answer,
            kota_asal
        })
        customer = customer.toJSON()
        delete customer.password
        return NextResponse.json(customer, {
            status: 201
        })
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: error.message || 'Register account failed' },
            { status: 500 }
        )
    }
}