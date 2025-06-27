import { NextResponse } from "next/server";
import { get_components_with_options, add_build, delete_component, update_component } from "@/lib/db";

export async function GET(request) {

    //const formData = await request.formData()
    const data = await get_components_with_options();
    return NextResponse.json({data: data}, { status: 200 })
}

export async function POST(request) {
    const components = await request.json();
    if (!components
        || typeof components.frame === 'number'
        || typeof components.battery === 'number'
        || typeof components.camera === 'number'
        || typeof components.esc === 'number'
        || typeof components.fc === 'number'
        || typeof components.motors === 'number'
        || typeof components.props=== 'number' ) {
        console.log("Fehlende erforderliche Felder", components);
        return NextResponse.json({error: "Fehlende erforderliche Felder"}, { status: 400 })
    }

    const response = await add_build(components);

    console.log("Received data:", response);

    if (!response) {
        return NextResponse.json({data: components}, { status: 400 })
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


export async function PUT(request) {
    const data = await request.json();
    if (!data || !data.component || !data.name || !data.description || !data.price || !data.shop || !data.link || !data.imageurl || !data.id) {
        console.log("Fehlende erforderliche Felder", data);
        return NextResponse.json({error: "Fehlende erforderliche Felder"}, { status: 400 })
    }

    const response = await update_component(data);

    console.log("Received data:", response);

    if (!response) {
        return NextResponse.json({data: data}, { status: 400 })
    }

    return NextResponse.json({data: response}, { status: 200 })
}