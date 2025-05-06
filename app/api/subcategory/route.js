import { NextResponse } from "next/server";
import Subcategory from "../../../models/subcategory";

export async function GET(req) {
    try {
        let data = await Subcategory.findAll()
        return NextResponse.json({
            data
        }, {
            status: 200
        })
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {error: error.message || 'fetch subcategory failed'},
            {status: 500}
        )
    }
}