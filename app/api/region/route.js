import { NextResponse } from "next/server";
import Region from "../../../models/region";
import { getServerSession } from "next-auth/next"
import {authOptions} from '@/lib/auth'
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
        const data = await Region.findAll()
        return NextResponse.json({
            data
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