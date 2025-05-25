// src/app/api/balance/route.js
import { NextResponse } from "next/server";
import { Connection, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";

export async function GET() {
  try {
    const wallet = process.env.SOL_WALLET_ADDRESS;
    if (!wallet) throw new Error("Wallet not configured");

    // talk to Solana RPC from Node
    const conn = new Connection(clusterApiUrl("mainnet-beta"));
    const lamports = await conn.getBalance(new PublicKey(wallet));
    const sol = lamports / LAMPORTS_PER_SOL;

    // fetch USD price from CoinGecko
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
    );
    const json = await res.json();
    const price = json.solana?.usd;
    if (price == null) throw new Error("Price lookup failed");

    const usd = (sol * price).toFixed(2);
    return NextResponse.json({ usd });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
