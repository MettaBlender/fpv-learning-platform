import { NextResponse } from "next/server";
import { get_components_with_options } from "../../lib/db";

export async function GET(request) {

    //const formData = await request.formData()
    const data = await get_components_with_options();
    return NextResponse.json({data: data}, { status: 200 })
}