
//@ts-nocheck

import React, { useEffect, useState } from "react";
import "./index.css";
import axios from "axios";
import { motion as m  } from "framer-motion";
import useQuiverStore from "../../store";
import { toast } from 'react-toastify';
import { QuiverPayManagerABI } from "../contract/abi";
import { readContract } from "wagmi/actions";
import { getConfig } from "../../config"; // your import path may vary
import {CA,TA,API_ENDPOINT} from "../utils";

const colors=["#FF7A00","#00BFFF","#FFD700","#6A0DAD","#2ECC71"];
interface TxProps{
    Icon:any;
    bill:any;
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
  

const roundToThree=(num)=>{
    return Math.round(num * 1000) / 1000;
  }

const TxContainer:React.FC<TxProps>=({Icon,bill})=>{
    const userData=useQuiverStore((state)=>state.userData);
    const setBillInfo=useQuiverStore((state)=>state.setBillInfo);
    const [stakedBal,setStakedBal]=useState<number|null>(0);
    const [totalTxs,setTotalTxs]=useState<number|null>();
    
    
    const getNodeInfo=async ()=>{
        console.log('hee;l')
        const nodeInfo:any=await readContract(getConfig(),{
                   address: CA,
                   abi: QuiverPayManagerABI,
                   functionName: "getNodeInfo",
                   args: [userData?.walletAddr],
                 });  
                 setStakedBal(parseFloat(nodeInfo[0])/10**18);
                 setTotalTxs(parseInt(nodeInfo[1]));
                 console.log(nodeInfo);
         }
    
         useEffect(()=>{    
            console.log("NodeData");
            getNodeInfo();
         },[])

    return(
        <div className="txContainer">
            <div className="txHeader">
                <h3>From:<span>{bill.issuedBy && sformatWalletAddress(bill.issuedBy)}</span></h3>
                
                <div style={{ background:colors[bill.type == "Airtime" ? 0 : bill.type == "Data" ? 1 : 2]}}>{Icon}</div>
            </div>
            <m.button whileTap={{ scale:1.2 }} onClick={()=>stakedBal > 0 ? setBillInfo({...bill,orderId:bill.orderId}) :  
             toast.error("STAKE ETH TO PROCESS TRANSACTIONS", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                  })}>
                <p>PROCESS | payout {roundToThree(bill.usdc_amount)} USDC <i className="fa-solid fa-key"></i></p>
            </m.button>
        </div>
    )
}

const index:React.FC=()=>{
    const [openTxs,setOpenTxs]=useState<null|any>(null);
    const bill=useQuiverStore((state)=>state.billInfo);
    const getOpenTxs=async()=>{
        const res=await axios.get(`${API_ENDPOINT}/api/get_open_txs/`);
    
         setOpenTxs(res.data.openTxs);
         console.log(res.data.openTxs);
    }

    useEffect(()=>{
        if(!openTxs){
           getOpenTxs();
           const intervalId = setInterval(() => {
               getOpenTxs();
}, 20000);
        }     
    },[openTxs,bill]);

    return(
        <div className="txMempoolContainer">
            <h1>Tx Mempool</h1>
            <div className="txsHolder">
                {(openTxs && (openTxs[0]?.length>0 || openTxs[1]?.length>0 || openTxs[2]?.length>0 )) ? openTxs.map(sub_arr => {
                    return(
                        sub_arr.map((bill)=>{
                      return(
                              
                          <TxContainer Icon={bill.type == "Airtime" ? <i className="fa-solid fa-sim-card"></i> : bill.type == "Data" ?  <i className="fa-solid fa-wifi"></i>  :  <i className="fa-solid fa-bolt"></i> } bill={bill} />
                        
                    )
                    })
                );
                   
                }):(
                <div style={{ padding:"20px 10px",fontFamily:"Poppins"}}>
                    <p>*No Transactions currently</p>
                 </div>
                )}    
               
            </div>
        </div>
    );
}
export default index;