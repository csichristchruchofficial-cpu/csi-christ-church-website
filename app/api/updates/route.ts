import { NextResponse } from "next/server";
import { churchUpdates } from "@/data/updates";

export async function GET() {
  return NextResponse.json({ updates: churchUpdates });
}
