//@ts-nocheck

import React, { useEffect } from "react"
import "./index.css";
import { useState } from "react";
import { motion as m } from "framer-motion";
import useQuiverStore from "../../store";
import { QuiverPayManagerABI } from "../contract/abi";
import { readContract,waitForTransactionReceipt } from "wagmi/actions";
import { parseAbi, parseEther } from "viem";
import { getConfig } from "../../config"; // your import path may vary
import { useWriteContract } from "wagmi";



const spenderAddress = "0x47bCFD7D078FDFd696F199911F8a54f2F9B81B81";
const tokenAddress = '0x036CbD53842c5426634e7929541eC2318f3dCF7e';



const erc20Abi = parseAbi([
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function balanceOf(address account) view returns (uint256)",  // ✅ added
]);

const index:React.FC=()=>{

    const [priceEq,setPriceEQ]=useState<null|any>(null);
    const [amount,setAmount]=useState<number>(0);
    const [stakedBal,setStakedBal]=useState<number|null>(null);
    const userData=useQuiverStore((state)=>state.userData);
    const setIsStake=useQuiverStore((state)=>state.setIsStake);
    const setIsStaked=useQuiverStore((state)=>state.setIsStaked);
    
    const { writeContractAsync }=useWriteContract();
    
    
const convertEthToFiat=async (ethAmount:number)=>{
  if(ethAmount <= 0){
    return;
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

    const eq={
      eth: ethAmount,
      usd: usdValue.toFixed(2),
      ngn: ngnValue.toFixed(2),
    };
    setPriceEQ(eq);
    return eq;
  } catch (error) {
    console.error("Error fetching ETH price:", error);
    throw error;
  }
}

    const getNodeInfo=async ()=>{
          const nodeInfo:any=await readContract(getConfig(),{
               address: spenderAddress,
               abi: QuiverPayManagerABI,
               functionName: "getNodeInfo",
               args: [userData?.walletAddr],
             });  
             setStakedBal(parseFloat(nodeInfo[0])/10**18);
     }


    const Stake=async ()=>{
      await getNodeInfo();
      if(stakedBal <=0){
          const tx=await writeContractAsync({
               address: spenderAddress,
               abi: QuiverPayManagerABI,
               functionName: "stake",
               value:parseEther(`${amount}`)
             });  
                await waitForTransactionReceipt(getConfig(), {
                      hash: tx,
                   });

             setIsStake(false);
             setIsStaked(true);
        }
    }

    useEffect(()=>{
    convertEthToFiat(amount);
    },[amount]);

    return(
        <div className="stakeOverlay" onClick={()=>setIsStake(false)}>
            <m.div className="depositContainer"  initial={{ y:"40px",opacity:0,}} animate={{y:"0px",opacity:1}}  transition={{ delay:0.4,duration: 0.6,    stiffness:100 ,  damping: 5,type:"spring" }} onClick={(e)=>e.stopPropagation()}>
                <input type="number" step="0.0001" placeholder="ETH amount" onChange={(e)=>setAmount(parseFloat(e.target.value))} />


                <p>*You must stake/deposit eth to be able to process transactions.</p>
               { priceEq &&  <p style={{ color:"black"}}>{priceEq.eth} ~ ${priceEq.usd} ~ NGN {priceEq.ngn} </p> }
                <m.button whileTap={{ scale:1.1 }} onClick={()=>Stake()}>Stake/Deposite ETH</m.button>
            </m.div>
        </div>
    )
}

export default index;