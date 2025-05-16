//@ts-nocheck

import React,{useState,useEffect} from "react";
import "./index.css";

import { motion as m } from "framer-motion";
import { getName } from "@coinbase/onchainkit/identity";
import { base } from "wagmi/chains";
import useQuiverStore from "../../store";
import { QuiverPayManagerABI} from "../contract/abi";
import { readContract,waitForTransactionReceipt} from "wagmi/actions";
import { parseAbi } from "viem";
import { getConfig } from "../../config"; // your import path may vary
import { useWriteContract } from "wagmi";
import {CA,TA} from "../utils";

const formatWalletAddress=(address)=> {
    // Ensure the address is a valid Ethereum address
    if (typeof address !== 'string' || address.length !== 42 || !address.startsWith('0x')) {
      throw new Error('Invalid Ethereum address');
    }
  
    // Format the address by keeping the first 6 and last 4 characters, replacing the middle part with '*****'
    const firstPart = address.slice(0, 8);  // First 6 characters (e.g., 0x48Ea12)
    const lastPart = address.slice(-8);     // Last 4 characters (e.g., 59f)
    const middlePart = '*****';             // The part we want to replace with stars
  
    const formattedAddress = `${firstPart}${middlePart}${lastPart}`;
  
    return formattedAddress;
  }
  

  function sformatWalletAddress(address) {
    // Ensure the address is a valid Ethereum address
    if (typeof address !== 'string' || address.length !== 42 || !address.startsWith('0x')) {
      throw new Error('Invalid Ethereum address');
    }
  
    // Format the address by keeping the first 6 and last 4 characters, replacing the middle part with '*****'
    const firstPart = address.slice(0, 4);  // First 6 characters (e.g., 0x48Ea12)
    const lastPart = address.slice(-4);     // Last 4 characters (e.g., 59f)
    const middlePart = '*****';             // The part we want to replace with stars
  
    const formattedAddress = `${firstPart}${middlePart}${lastPart}`;
  
    return formattedAddress;
  }
  


const erc20Abi = parseAbi([
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function balanceOf(address account) view returns (uint256)",  // ✅ added
]);

const UserMoneyCard:React.FC=()=>{
    const userData=useQuiverStore((state)=>state.userData);
    const [usdcBal,setUSDCBal]=useState<number|null>(null);
    const [baseName,setBaseName]=useState<any|null>(null);
    const billInfo=useQuiverStore((state)=>state.billInfo);
    

    const getBaseName=async()=>{
      
        const ensName=await getName({
            address:userData.walletAddr,
            chain:base
          });
       
        setBaseName(ensName);
    }
   

    const truncateBaseName = (name: string) => {
        return name.length < 30 ? name : name.slice(0, 18) + "...";
      };

      const getUSDBal=async ()=>{

       const usdc_Bal:string=await readContract(getConfig(),{
               address:TA,
               abi: erc20Abi,
               functionName: "balanceOf",
               args: [userData?.walletAddr],
             });  
             console.log(parseFloat(usdc_Bal)/(10**6));
             setUSDCBal(parseFloat(usdc_Bal)/(10**6));
             console.log("updataed");
          }


      useEffect(()=>{
        getBaseName();

      },[]);

      useEffect(()=>{
        console.log("Called");
       getUSDBal();
      },[billInfo]);

       
    return(
        <div className="card-Container">
            <div className="cardInfo-1">
            <m.button whileTap={{scale:!baseName && 1.2}} onClick={()=>{
                if(!baseName){
                 window.location.href="https://www.base.org/names?utm_source=dotorg&medium=hero";
                }
            }}><span style={{ textTransform:!baseName && "uppercase"}}>{baseName ? `${truncateBaseName(baseName)}`:"GET  ID"}</span> <i className="fas fa-id-card"></i></m.button>
            <h3>Base</h3>
            </div>
            <h2>{formatWalletAddress(userData?.walletAddr)}</h2>
            <div className="cardInfo-2">
            <h3>{ usdcBal ? `${usdcBal}` : "****"} USDC</h3>
            <h3>{userData?.reg_date}</h3>
            </div>
            <p>*Only USDC stablecoin is currently supported.</p>
            <div className="blob">

            </div>
            <div className="blob-2">

           </div>
        </div>
    );
}


const NodeInfo:React.FC=()=>{
    const userData=useQuiverStore((state)=>state.userData);
     const [stakedBal,setStakedBal]=useState<number|null>(0);
     const [totalTxs,setTotalTxs]=useState<number|null>();
     const isStaked=useQuiverStore((state)=>state.isStaked);


     const getNodeInfo=async ()=>{
          const nodeInfo:any=await readContract(getConfig(),{
               address: CA,
               abi: QuiverPayManagerABI,
               functionName: "getNodeInfo",
               args: [userData?.walletAddr],
             });  
             setStakedBal(parseFloat(nodeInfo[0])/10**18);
              setTotalTxs(parseInt(nodeInfo[1]));
     }

     useEffect(()=>{
       
        getNodeInfo();

     },[isStaked])

    
    return(
    <div className="infoCardContainer">
        <div className="infoData">
            <h1>STAKED ETH:</h1>
            <p>{`${stakedBal}`} ETH</p>
        </div>
        <div className="infoData">
            <h1>LIFETIME EARNING:</h1>
            <p>100 USDC</p>
        </div>
        <div className="infoData">
            <h1>LIFETIME TRANSACTIONS</h1>
            <p>{totalTxs  ? `${totalTxs}` : 0 }</p>
        </div>
           <div className="blob">

</div>
<div className="blob-2">

</div>
    </div>
    );
}

const index:React.FC=()=>{
     const userData=useQuiverStore((state)=>state.userData);
     const setIsStake=useQuiverStore((state)=> state.setIsStake);
     const setIsStaked=useQuiverStore((state)=> state.setIsStaked);
     const isStaked=useQuiverStore((state)=> state.isStaked);
     
     const { writeContractAsync }=useWriteContract();
     const [copied,setIsCopied]=useState(false);
    
    const copyToClipboard=(text)=>{
        navigator.clipboard.writeText(text)
          .then(() => {
            setIsCopied(true);
            setTimeout(()=>setIsCopied(false),600);
          })
          .catch(err => {
            setIsCopied(false);
            console.error("Failed to copy text: ", err);
          });
      }

     const [stakedBal,setStakedBal]=useState<number|null>(null);

     const getNodeInfo=async ()=>{
          const nodeInfo:any=await readContract(getConfig(),{
               address: CA,
               abi: QuiverPayManagerABI,
               functionName: "getNodeInfo",
               args: [userData?.walletAddr],
             });  
             if((parseFloat(nodeInfo[0])) > 0){
              setIsStaked(true);
             }
             setStakedBal(parseFloat(nodeInfo[0])/10**18);
     }

    
      const unStake=async ()=>{
         const tx= await writeContractAsync({
               address: CA,
               abi: QuiverPayManagerABI,
               functionName: "unStake",
               args: [],
             });  
                await waitForTransactionReceipt(getConfig(), {
                      hash: tx,
                   });
           setIsStake(false);
              const nodeInfo:any=await readContract(getConfig(),{
               address: CA,
               abi: QuiverPayManagerABI,
               functionName: "getNodeInfo",
               args: [userData?.walletAddr],
             });  

             if((parseFloat(nodeInfo[0])/10**18) <= 0){
              setIsStaked(false);
             }
            
             setStakedBal(parseFloat(nodeInfo[0])/10**18);
     }



     useEffect(()=>{
        getNodeInfo();
     },[])


    return(
        <div className="infoHolder">
          
            <div className="utils-Container">
                <div className="uf-Header">
          
              <h1>Hi,{sformatWalletAddress(userData?.walletAddr)} { copied ?  <i className="fa-solid fa-clipboard"></i> : <i onClick={()=>copyToClipboard(userData?.walletAddr)} className="fa-solid fa-copy"></i>}</h1>
          
            </div>
            
                    <UserMoneyCard />
                    <NodeInfo />
                    <div className="userActions-Container" >
                    <div className="btn-Container">
           
             <m.button style={{ opacity:"0.5"}} whileTap={{ scale:1.2 }}>To Wallet <i className="fa-solid fa-wallet"></i></m.button>
             <m.button className="btn2" style={{ background:"oklch(72.3% 0.219 149.579)",opacity:"0.5"}} whileTap={{ scale:1.2 }}>To Bank <i className="fa-solid fa-arrow-right"></i></m.button>
             <m.button style={{ background:isStaked ?  "oklch(63.7% 0.237 25.331)" : "oklch(72.3% 0.219 149.579)" }} whileTap={{ scale:1.2 }} onClick={()=>isStaked  ? unStake() : setIsStake(true)}>{ isStaked  ? "UNSTAKE" : "STAKE"}</m.button>
            </div>
         </div>
                </div>
            </div>

        
    )
}

export default index;