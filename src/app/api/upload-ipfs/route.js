// app/api/upload-ipfs/route.js
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Upload to Pinata
    const pinataFormData = new FormData();
    pinataFormData.append("file", file);

    // Use API key/secret method for Pinata
    const headers = {
      pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
      pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET_KEY,
    };

    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers,
        body: pinataFormData,
      },
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Pinata upload failed:", response.status, errorData);
      return NextResponse.json(
        { error: "Pinata upload failed", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (!data.IpfsHash) {
      console.error("No IPFS hash in Pinata response:", data);
      return NextResponse.json(
        { error: "No IPFS hash returned from Pinata", details: data },
        { status: 500 }
      );
    }

    console.log("✅ File uploaded to IPFS:", data.IpfsHash);

    return NextResponse.json({
      hash: data.IpfsHash,
      url: `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`,
    });
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
