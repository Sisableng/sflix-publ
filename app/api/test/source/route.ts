import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const server = searchParams.get("server");

  await new Promise((resolve) => setTimeout(resolve, 2000));

  if (server) {
    const file = await fs.readFile(
      process.cwd() + `/lib/dummy/stream/${server}.json`,
      "utf8",
    );
    const data = JSON.parse(file);

    return NextResponse.json(data);
  } else if (server === "upstream") {
    return new NextResponse("Error", {
      status: 400,
    });
  } else if (server === "mixdrop") {
    return new NextResponse("Error", {
      status: 400,
    });
  }
}
