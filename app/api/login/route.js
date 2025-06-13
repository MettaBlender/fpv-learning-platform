import { NextResponse } from "next/server";
import { setSessionUser } from "@/lib/session";

export async function POST(request) {

    const contentType = request.headers.get("content-type")
    if (contentType !== "application/json") {
        return NextResponse.json({ "error" : "Invalid request"}, { status: 415 })
    }
    const data = await request.json()
    const {username, password} = data;
    const isValidData = (username && password)
    if (!isValidData) {
        return NextResponse.json({ "message" : "Benutzername und Passwort werden benötigt!"}, { status: 400 })
    }
    if(password !== process.env.PW || username !== process.env.USERNAMEID) {
        console.error("Login failed for user:", username, password, process.env.PW, process.env.USERNAMEID);
        return NextResponse.json({ "message" : "Benutzername oder Passwort ist falsch!"}, { status: 400 })
    }
    const session = await setSessionUser(0)
    console.log("Login successful for user:", session);
    return NextResponse.json({session: session}, { status: 200 })
}