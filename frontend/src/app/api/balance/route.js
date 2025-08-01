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
    
    let totalValueUsd = 0;
    let allTokens = {};
    let walletBreakdown = [];

    // Process each wallet
    for (const walletAddress of wallets) {
      const publicKey = new PublicKey(walletAddress);
      let walletValueUsd = 0;
      let walletTokens = {};

      // 1. Get SOL balance
      const lamports = await conn.getBalance(publicKey);
      const solBalance = lamports / LAMPORTS_PER_SOL;
      
      if (solBalance > 0) {
        walletTokens['SOL'] = {
          amount: solBalance,
          symbol: 'SOL',
          mint: 'So11111111111111111111111111111111111111112'
        };
      }

      // 2. Get all token accounts (SPL tokens)
      try {
        const tokenAccounts = await conn.getTokenAccountsByOwner(publicKey, {
          programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
        });

        for (const { account } of tokenAccounts.value) {
          const accountInfo = await conn.getParsedAccountInfo(account.pubkey);
          const parsedInfo = accountInfo.value?.data?.parsed?.info;
          
          if (parsedInfo && parseFloat(parsedInfo.tokenAmount.uiAmount) > 0) {
            const mint = parsedInfo.mint;
            const amount = parseFloat(parsedInfo.tokenAmount.uiAmount);
            
            // Try to get token metadata
            let symbol = mint.slice(0, 8) + '...'; // fallback
            try {
              const metadataResponse = await fetch(
                `https://api.solana.fm/v1/tokens/${mint}`
              );
              if (metadataResponse.ok) {
                const metadata = await metadataResponse.json();
                symbol = metadata.tokenList?.symbol || symbol;
              }
            } catch (e) {
              // Use fallback symbol
            }

            if (walletTokens[mint]) {
              walletTokens[mint].amount += amount;
            } else {
              walletTokens[mint] = {
                amount,
                symbol,
                mint
              };
            }
          }
        }
      } catch (tokenError) {
        console.warn(`Error fetching tokens for ${walletAddress}:`, tokenError.message);
      }

      // Add wallet tokens to global count
      for (const [mint, tokenData] of Object.entries(walletTokens)) {
        if (allTokens[mint]) {
          allTokens[mint].amount += tokenData.amount;
        } else {
          allTokens[mint] = { ...tokenData };
        }
      }

      walletBreakdown.push({
        address: walletAddress,
        tokens: walletTokens
      });
    }

    // 3. Get prices for all unique tokens
    const tokenMints = Object.keys(allTokens);
    const prices = {};
    
    // Get SOL price
    try {
      const solResponse = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
      );
      const solData = await solResponse.json();
      prices['So11111111111111111111111111111111111111112'] = solData.solana?.usd || 0;
      prices['SOL'] = solData.solana?.usd || 0;
    } catch (e) {
      console.warn("Failed to fetch SOL price:", e.message);
      prices['SOL'] = 0;
    }

    // Get other token prices using Jupiter API (better for Solana tokens)
    const otherMints = tokenMints.filter(mint => 
      mint !== 'SOL' && mint !== 'So11111111111111111111111111111111111111112'
    );
    
    if (otherMints.length > 0) {
      try {
        // Jupiter price API supports multiple tokens
        const jupiterResponse = await fetch(
          `https://price.jup.ag/v4/price?ids=${otherMints.join(',')}`
        );
        
        if (jupiterResponse.ok) {
          const jupiterData = await jupiterResponse.json();
          
          for (const mint of otherMints) {
            prices[mint] = jupiterData.data?.[mint]?.price || 0;
          }
        }
      } catch (e) {
        console.warn("Failed to fetch token prices from Jupiter:", e.message);
        // Set fallback prices to 0
        for (const mint of otherMints) {
          prices[mint] = 0;
        }
      }
    }

    // 4. Calculate total USD value
    let totalBreakdown = [];
    
    for (const [mint, tokenData] of Object.entries(allTokens)) {
      const price = prices[mint] || 0;
      const usdValue = tokenData.amount * price;
      totalValueUsd += usdValue;
      
      totalBreakdown.push({
        symbol: tokenData.symbol,
        mint: mint,
        amount: tokenData.amount.toFixed(6),
        priceUsd: price.toFixed(6),
        valueUsd: usdValue.toFixed(2)
      });
    }

    // Sort by USD value (highest first)
    totalBreakdown.sort((a, b) => parseFloat(b.valueUsd) - parseFloat(a.valueUsd));

    return NextResponse.json({
      totalUsd: totalValueUsd.toFixed(2),
      walletCount: wallets.length,
      tokenCount: Object.keys(allTokens).length,
      breakdown: totalBreakdown,
      // walletBreakdown: walletBreakdown // Uncomment if you want per-wallet details
    });
    
  } catch (err) {
    console.error("Balance API Error:", err);
    return NextResponse.json({ 
      error: err.message,
      totalUsd: "0.00" // Fallback for frontend
    }, { status: 500 });
  }
}