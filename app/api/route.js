import { NextResponse } from "next/server";
import { get_components_with_options, add_component, delete_component } from "../../lib/db";

export async function GET(request) {

    //const formData = await request.formData()
    const data = await get_components_with_options();
    return NextResponse.json({data: data}, { status: 200 })
}

export async function POST(request) {

    //const formData = await request.formData()
    const data = await request.json();
    if (!data || !data.component || !data.name || !data.description || !data.price || !data.shop || !data.link || !data.imageurl) {
        console.log("Fehlende erforderliche Felder", data);
        return NextResponse.json({error: "Fehlende erforderliche Felder"}, { status: 400 })
    }

    const response = await add_component(data);

    console.log("Received data:", response);

    if (!response) {
        return NextResponse.json({data: data}, { status: 400 })
    }

    return NextResponse.json({data: response}, { status: 200 })
}

export async function DELETE(request) {
    const {id, type} = await request.json();

    if (!id || !type) {
        console.error("Fehlende ID oder Typ:", id, type);
        return NextResponse.json({error: "Fehlende ID oder Typ"}, { status: 400 })
    }

    console.log("Received ID for deletion:", id, type);
    const response = await delete_component(type, id);

    if (!response) {
        return NextResponse.json({error: "Fehler beim Löschen des Eintrags"}, { status: 400 })
    }

    return NextResponse.json({data: response}, { status: 200 })
}