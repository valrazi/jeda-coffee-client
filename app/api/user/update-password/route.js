import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import Customer from "../../../../models/customer";

export async function PUT(req) {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { current_password, new_password } = await req.json();

        if (!current_password || !new_password) {
            return NextResponse.json({ error: "Both fields are required" }, { status: 400 });
        }

        if (new_password.length < 6) {
            return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 });
        }

        // Fetch user
        const user = await Customer.findOne({
            where: {
                email: session.user.email
            }
        });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        // Verify current password
        const isMatch = await bcrypt.compare(current_password, user.password);
        if (!isMatch) return NextResponse.json({ error: "Incorrect current password" }, { status: 400 });

        // Hash new password
        const hashedPassword = await bcrypt.hash(new_password, 10);
        await Customer.update({ password: hashedPassword }, { where: { email: session.user.email } });

        return NextResponse.json({ message: "Password updated successfully" });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
