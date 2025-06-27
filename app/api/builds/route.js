import { NextResponse } from "next/server";
import { get_all_builds, add_build, delete_build, update_build } from "@/lib/db";

export async function GET(request) {

    //const formData = await request.formData()
    const data = await get_all_builds();
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
    const {id} = await request.json();

    if (!id) {
        console.error("Fehlende ID:", id);
        return NextResponse.json({error: "Fehlende ID"}, { status: 400 })
    }

    console.log("Received ID for deletion:", id);
    const response = await delete_build(id);

    if (!response) {
        return NextResponse.json({error: "Fehler beim Löschen des Eintrags"}, { status: 400 })
    }

    return NextResponse.json({data: response}, { status: 200 })
}


export async function PUT(request) {
    const updatedBuild = await request.json();
    const components = updatedBuild
    if (!components
        || typeof components.frame === 'number'
        || typeof components.battery === 'number'
        || typeof components.camera === 'number'
        || typeof components.esc === 'number'
        || typeof components.fc === 'number'
        || typeof components.motors === 'number'
        || typeof components.props=== 'number'
        || !components.build_id) {
        console.log("Fehlende erforderliche Felder", components);
        return NextResponse.json({error: "Fehlende erforderliche Felder"}, { status: 400 })
    }

    console.log("Received updated build data:", components);

    const response = await update_build(components);

    console.log("Received data:", response);

    if (!response) {
        return NextResponse.json({data: data}, { status: 400 })
    }

    return NextResponse.json({data: "response"}, { status: 200 })
}