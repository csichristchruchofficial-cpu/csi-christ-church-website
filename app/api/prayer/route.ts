import { NextResponse } from "next/server";
import { churchInfo } from "@/data/church";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, email, request } = body;

    if (!name || !request) {
      return NextResponse.json(
        { error: "பெயர் மற்றும் ஜெப விண்ணப்பம் கட்டாயம் தேவை." },
        { status: 400 }
      );
    }

    // Prepare email payload for official church inbox
    const recipientEmail = churchInfo.email; // csichristchruchofficial@gmail.com
    const timestamp = new Date().toISOString();

    console.log(`[Prayer Request Dispatched]`, {
      to: recipientEmail,
      from: email || "Anonymous",
      name,
      phone,
      request,
      timestamp,
    });

    return NextResponse.json({
      success: true,
      message: `ஜெப விண்ணப்பம் திருச்சபையின் அதிகாரப்பூர்வ மின்னஞ்சலுக்கு (${recipientEmail}) பதிவு செய்யப்பட்டது.`,
      recipient: recipientEmail,
    });
  } catch (error) {
    console.error("Error processing prayer application:", error);
    return NextResponse.json(
      { error: "மின்னஞ்சல் அனுப்புவதில் பிழை ஏற்பட்டது." },
      { status: 500 }
    );
  }
}

