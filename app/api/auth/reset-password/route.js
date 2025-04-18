import { NextResponse } from "next/server";
import Customer from "../../../../models/customer";
import bcrypt from 'bcryptjs'
import { Op } from "sequelize";
export async function POST(req) {
    try {
        const body = await req.json()
        const {email, password, security_question, security_answer} = body
        let customerExist = await Customer.findOne({
            where: {
                email
            }
        })
        if(!customerExist) {
            return NextResponse.json(
                {error: 'Account not found'},
                {status: 400}
            )
        }
        if(security_question != customerExist.security_question && security_answer != customerExist.security_answer) {
            return NextResponse.json(
                {error: 'Security Question / Answer is Wrong'},
                {status: 400}
            )
        }
        customerExist.password = bcrypt.hashSync(password)
        await customerExist.save()
        customerExist = customerExist.toJSON()
        delete customerExist.password
        return NextResponse.json(customerExist, {
            status: 201
        })
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {error: error.message || 'Reset Password failed'},
            {status: 500}
        )
    }
}