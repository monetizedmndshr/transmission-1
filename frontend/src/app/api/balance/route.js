// src/app/api/balance/route.js
import { NextResponse } from "next/server";
import { Connection, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";

export async function GET() {
  try {
    // Get wallets from environment variable (comma-separated) or use hardcoded list
    const walletsEnv = process.env.SOL_WALLETS;
    const wallets = walletsEnv 
      ? walletsEnv.split(',').map(w => w.trim())
      : [
          "EikiywK4B3xYHnXasUKVCtiduaczgjsYjUyLNSd3e7xb",
          "AaftVoaV6JJ2R4bn87bo97cXhHuoGgDEstPHyaMXecF9", 
          "7L1sarhQFDo89HtF1j7kSt1qzH3ZFXrzMVtxvxfkHLSk",
          "H8dtdh454gYPTNPFbf8RZ4h3s9GaquPvFPPSgfhdSqRj",
          "B4cqTiSf13PrzV5NRLRQ6QjiEhtpRGQ6UtCcsqBs6Td9"
        ];

    // Connect to Solana RPC
    const conn = new Connection(clusterApiUrl("mainnet-beta"));
    
    // Get balances for all wallets in parallel
    const balancePromises = wallets.map(wallet => 
      conn.getBalance(new PublicKey(wallet))
    );
    
    const lamportsArray = await Promise.all(balancePromises);
    
    // Sum all balances and convert to SOL
    const totalLamports = lamportsArray.reduce((sum, lamports) => sum + lamports, 0);
    const totalSol = totalLamports / LAMPORTS_PER_SOL;

    // Fetch USD price from CoinGecko
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
    );
    const json = await res.json();
    const price = json.solana?.usd;
    if (price == null) throw new Error("Price lookup failed");

    const totalUsd = (totalSol * price).toFixed(2);
    
    // Optional: return breakdown by wallet
    const walletBreakdown = wallets.map((wallet, index) => ({
      address: wallet,
      sol: (lamportsArray[index] / LAMPORTS_PER_SOL).toFixed(4),
      usd: ((lamportsArray[index] / LAMPORTS_PER_SOL) * price).toFixed(2)
    }));

    return NextResponse.json({ 
      totalUsd,
      totalSol: totalSol.toFixed(4),
      walletCount: wallets.length,
      breakdown: walletBreakdown // Optional detailed breakdown
    });
    
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}