import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import authOptions, { getConnection } from "../auth/[...nextauth]/options";

// eslint-disable-next-line import/prefer-default-export
export async function POST(request: NextRequest) {

    const session = await getServerSession(authOptions)
    const id = session?.user?.id
    if (!id) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const client = await getConnection(session.user)
    if (!client) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }


    const file = (await request.formData()).get("file")

    if (!file) {
        return NextResponse.json({error: "No files accepted."}, {status: 400})
    }

    try {
        return NextResponse.json({message: "File uploaded successfully."}, {status: 200})
    } catch (e) {

    }

}