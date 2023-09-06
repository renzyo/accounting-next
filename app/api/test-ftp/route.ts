import * as ftp from "basic-ftp";
import fs from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file: File | null = data.get("image") as unknown as File;

    if (!file) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await fs.writeFile(path.join(process.cwd(), "tmp", file.name), buffer);
    const realPath = path.join(process.cwd(), "tmp", file.name);

    const fileName = file.name;
    const fileExtension = fileName.split(".").pop();
    const newFileName = `${Date.now()}.${fileExtension}`;

    const client = new ftp.Client();
    client.ftp.verbose = true;

    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USERNAME,
      password: process.env.FTP_PASSWORD,
      secure: true,
      secureOptions: { rejectUnauthorized: false },
    });

    await client.ensureDir("/public_html/management/upload");

    const remotePath = "/public_html/management/upload/" + newFileName;

    await client.uploadFrom(realPath, remotePath);

    client.close();

    console.log("File uploaded successfully!");

    await fs.unlink(realPath);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
