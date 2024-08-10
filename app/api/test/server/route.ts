import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";

export async function GET(request: NextRequest) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const file = await fs.readFile(
    process.cwd() + `/lib/dummy/server.json`,
    "utf8",
  );
  const data = JSON.parse(file);

  return NextResponse.json(data);
}
