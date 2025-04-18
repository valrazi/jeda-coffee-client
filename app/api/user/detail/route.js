import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Customer from "../../../../models/customer";
import { authOptions } from "@/lib/auth";

export async function GET(req, res) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        console.log({ses: session});
        let customer = await Customer.findOne({ where: { id: session.user.id } });
        customer = customer.toJSON()
        delete customer.password
        return NextResponse.json({ user:  customer});
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
