import { NextResponse } from "next/server";
import Tenant from "../../../models/tenant";
import Ticket from '../../../models/ticket'
import { getServerSession } from "next-auth/next"
import {authOptions} from '@/lib/auth'
import dayjs from "dayjs";
import { countTickets } from "../ticket-id/route";

function setArgostart(pdatetime) {
    let todayEightAM = pdatetime.hour(8).minute(0).second(0).millisecond(0);
    if (pdatetime.hour() >= 15) {
      return todayEightAM.add(1, 'day');
    } else if (pdatetime.hour() < 8) {
      return todayEightAM;
    } else {
      return pdatetime;
    }
  }

export async function POST(req) {
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
        let tenant = await Tenant.findOne({
            where: {
                username: name
            }
        })
        if(!tenant) {
            tenant = await Tenant.findOne({
                where: {
                    username : 'Unifiber'
                }
            })
        }
        const {prefix} = tenant
        const date = dayjs().format('YYYYMMDD')
        const totalTicket = await countTickets()
        const ticketId = `${prefix}_${date}_${totalTicket}`

        const body = await req.json()
        const {subject, description} = body
        const newTicket = await Ticket.create({
            customer_id: 'Non_Customer',
            ticket_id: ticketId,
            subject,
            detail: description,
            department: 'ONM',
            amt_ticket_id: ticketId,
            created_by: session.user.email,
            created_at: dayjs().toDate(),
            category: 'Service Request',
            severity: 'Major',
            partner: 'Unifiber',
            argo_start: setArgostart(dayjs())
        })
        return NextResponse.json({
            data: {
                newTicket
            }
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

