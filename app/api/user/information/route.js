import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Customer from "../../../../models/customer";

export async function PUT(req) {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { full_name, email, kota_asal } = await req.json();

        if (!full_name || full_name.length < 3) {
            return NextResponse.json({ error: "Full name must be at least 3 characters" }, { status: 400 });
        }

        if (!email || email.length < 3) {
            return NextResponse.json({ error: "Email required" }, { status: 400 });
        }

        if (!kota_asal || kota_asal.length < 3) {
            return NextResponse.json({ error: "Kota Asal must be at least 3 characters" }, { status: 400 });
        }
        await Customer.update({ full_name, email, kota_asal }, { where: { email: session.user.email } });

        return NextResponse.json({ message: "Information updated successfully", updatedUser: { full_name, email, kota_asal } });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
