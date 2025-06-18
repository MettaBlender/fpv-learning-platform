import { NextResponse } from "next/server";
import { get_components_with_options, add_component } from "../../lib/db";

export async function GET(request) {

    //const formData = await request.formData()
    const data = await get_components_with_options();
    return NextResponse.json({data: data}, { status: 200 })
}

export async function POST(request) {

    //const formData = await request.formData()
    const data = await request.json();
    if (!data || !data.component || !data.title || !data.description || !data.price || !data.shop || !data.link || !data.imageUrl) {
        return NextResponse.json({error: "Fehlende erforderliche Felder"}, { status: 400 })
    }

    const response = await add_component(data);

    console.log("Received data:", response);

    if (!response) {
        return NextResponse.json({data: data}, { status: 400 })
    }

    return NextResponse.json({data: response}, { status: 200 })
}