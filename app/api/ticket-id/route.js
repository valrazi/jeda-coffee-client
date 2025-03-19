import { NextResponse } from "next/server";
import Tenant from "../../../models/tenant";
import Ticket from '../../../models/ticket'
import { getServerSession } from "next-auth/next"
import {authOptions} from '@/lib/auth'
import dayjs from "dayjs";
import { Op } from "sequelize";
export async function GET(req) {
    try {
        const session = await getServerSession(authOptions)
        if(!session) {
            console.log("session missing");
            return NextResponse.json(
                {error: 'unauthorized'},
                {status: 401}
            )
        }
        const {user} = session
        const {name} = user
        const tenant = await Tenant.findOne({
            where: {
                username: name
            }
        })
        if(!tenant) return NextResponse.json(
            {
                error: 'Tenant not found'
            },
            {
                status: 500
            }
        )
        const {prefix} = tenant
        const date = dayjs().format('YYYYMMDD')
        const totalTicket = await countTickets()
        const id = `${prefix}_${date}_${totalTicket}`
        return NextResponse.json({
            data: {id}
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

export async function countTickets(){
    const ticketCount = await Ticket.count({
        where: {
            createdAt: {
                [Op.gte] : dayjs().startOf('day').toDate()
            }
        }
    })
    return String((ticketCount + 1)).padStart(4, "0")
}
