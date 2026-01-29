import authOptions from "@/app/lib/auth";
import uploadOnCloudinary from "@/app/lib/cloudinary";
import connectDB from "@/app/lib/db";
import User from "@/app/model/user.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)
    if (!session || !session.user.email || !session.user.id) {
      return NextResponse.json(
        { message: "user does not have session" },
        { status: 400 }
      )
    }

    const formData = await req.formData()
    const name = formData.get("name") as string
    const file = formData.get("file") as Blob | null

    let imageUrl;

    if (file) {
      imageUrl = await uploadOnCloudinary(file)
    }


    const updateData: { name: string; image?: string } = { name };

    if (imageUrl) {
      updateData.image = imageUrl;
    }

    const user = await User.findByIdAndUpdate(
      session.user.id,
      updateData,
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { message: "user not found" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      user,
      { status: 200 }
    )

  } catch (error) {
    return NextResponse.json(
      { message: `edit error ${error}` },
      { status: 500 }
    )
  }
}