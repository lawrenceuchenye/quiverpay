import React, { useEffect } from "react"
import "./index.css";
import { useState } from "react";

const convertEthToFiat=async (ethAmount:number)=>{
  if (isNaN(ethAmount)) {
    throw new Error("Invalid ETH amount");
  }

  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd,ngn"
    );
    const data = await response.json();

    const ethToUsd = data.ethereum.usd;
    const ethToNgn = data.ethereum.ngn;

    const usdValue = ethAmount * ethToUsd;
    const ngnValue = ethAmount * ethToNgn;

    return {
      eth: ethAmount,
      usd: usdValue.toFixed(2),
      ngn: ngnValue.toFixed(2),
    };
  } catch (error) {
    console.error("Error fetching ETH price:", error);
    throw error;
  }
}

const index:React.FC=()=>{

    const [priceEq,setPriceEQ]=useState<null|any>(null);
    const [amount,setAmount]=useState<number>(0);

    useEffect(()=>{
    setPriceEQ(convertEthToFiat(amount));
    },[amount]);

    return(
        <div className="stakeOverlay">
            <div className="depositContainer">
                <input type="number" step="0.0001" placeholder="ETH amount" onChange={(e)=>setAmount(parseFloat(e.target.value))} />


                <p>*You must stake/deposit eth to be able to process transactions.</p>
               { priceEq &&  <p style={{ color:"black"}}>{priceEq.eth} ~ ${priceEq.usd} ~ NGN {priceEq.ngn} </p> }
                <button>Stake/Deposite ETH</button>
            </div>
        </div>
    )
}

export default index;