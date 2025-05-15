import React, { useEffect, useState } from "react";
import "./index.css";
import axios from "axios";
import { motion as m  } from "framer-motion";
import useQuiverStore from "../../store";


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
    const setBillInfo=useQuiverStore((state)=>state.setBillInfo);

    return(
        <div className="txContainer">
            <div className="txHeader">
                <h3>From:<span>{bill.issuedBy && sformatWalletAddress(bill.issuedBy)}</span></h3>
                
                <div style={{ background:colors[bill.type == "Airtime" ? 0 : bill.type == "Data" ? 1 : 2]}}>{Icon}</div>
            </div>
            <m.button whileTap={{ scale:1.2 }} onClick={()=>setBillInfo(bill)}>
                <p>PROCESS | payout {roundToThree(bill.usdc_amount)} USDC <i className="fa-solid fa-key"></i></p>
            </m.button>
        </div>
    )
}

const index:React.FC=()=>{
    const [openTxs,setOpenTxs]=useState<null|any>(null);
 
    const getOpenTxs=async()=>{
        const res=await axios.get("http://127.0.0.1:8000/api/get_open_txs/");
         setOpenTxs(res.data.openTxs);
    }

    useEffect(()=>{
        if(!openTxs){
           getOpenTxs();
        }     
    },[openTxs]);

    return(
        <div className="txMempoolContainer">
            <h1>Tx Mempool</h1>
            <div className="txsHolder">
                {openTxs && openTxs.map(sub_arr => {
                    return(
                        sub_arr.map((bill)=>{
                      return(
                              
                          <TxContainer Icon={bill.type == "Airtime" ? <i className="fa-solid fa-sim-card"></i> : bill.type == "Data" ?  <i className="fa-solid fa-wifi"></i>  :  <i className="fa-solid fa-bolt"></i> } bill={bill} />
                        
                    )
                    })
                );
                   
                })}    
               
            </div>
        </div>
    );
}
export default index;