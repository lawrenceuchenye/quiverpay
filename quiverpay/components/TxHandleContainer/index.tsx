//@ts-nocheck

import "./index.css";
import React,{useEffect, useState} from "react";
import { motion as m } from "framer-motion";
import axios from "axios";
import QuiverLogo from "../../src/assets/Frame 68.svg";
import { dataPlanDB_NG,NG_PREPAID_PROVIDERS,CA,API_ENDPOINT} from "../utils";
import useQuiverStore from "../../store";
import { toast } from 'react-toastify';
import { useWriteContract } from 'wagmi';
import { parseAbi } from "viem";
import { parseUnits } from 'viem'; // to parse token amount correctly
import { QuiverPayManagerABI } from "../contract/abi";
import { readContract,waitForTransactionReceipt } from "wagmi/actions";

import { getConfig } from "../../config"; // your import path may vary

const roundToThree=(num)=>{
    return Math.round(num * 1000) / 1000;
  }

  const detectNetwork=(phoneNumber:string)=>{
    const prefix = phoneNumber.slice(0, 4); // assumes number is in local format like 0803xxxxxxx
  
    const mtn = ["0803", "0806", "0703", "0706", "0813", "0816", "0810", "0814", "0903", "0906", "0913", "0916"];
    const glo = ["0805", "0807", "0705", "0811", "0815", "0905", "0915"];
    const airtel = ["0802", "0808", "0708", "0812", "0902", "0901", "0907", "0912"];
    const nineMobile = ["0809", "0817", "0818", "0909", "0908", "0918"];
  
    if (mtn.includes(prefix)) return "MTN NG";
    if (glo.includes(prefix)) return "GLO NG";
    if (airtel.includes(prefix)) return "AIRTEL NG";
    if (nineMobile.includes(prefix)) return "9MOBILE NG";
  
    return "";
  }
  

interface Props{
    type:string|null;
}


// Define your ERC20 contract's ABI
const erc20Abi = parseAbi([
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function balanceOf(address account) view returns (uint256)",  // ✅ added
]);




interface Airtime{
  network:string|null;
  amount:number|null;
  phone_number:string|null;
  usdc_amount:string|null;
  fiat_amount:number|null;
  issuer_address:string| undefined;
   orderId:number;
}

interface Data{
  network:string|null;
  phone_number:string|null;
  plan:string|null;
  amount:number|null;
  usdc_amount:string|null;
  fiat_amount:number|null;
  issuer_address:string|undefined;
   orderId:number;
}


interface Electricity{
  provider:string|null;
  meter_number:string|null;
  meter_owner:string|null;
  amount:number|null;
  usdc_amount:string|null;
  fiat_amount:number;
  issuer_address:string|undefined;
   orderId:number;

}

interface summaryProp{
    billInfo:Airtime|Data|Electricity;
    serviceName:string|null;
}

const Summary:React.FC<summaryProp>=({ billInfo})=>{
  const setIsPay=useQuiverStore((state)=>state.setIsPay);
  const userData=useQuiverStore((state)=>state.userData);
   const amountToApprove = parseUnits(`${billInfo.usdc_amount ? roundToThree(parseFloat(billInfo.usdc_amount)+0.25) : 0}`, 6); // 1000 tokens with 18 decimals
   const { writeContractAsync } = useWriteContract();
   const [isProcessing,setIsProcessing]=useState(false);
   const [electrcityToken,setElectricityToken]=useState<null|string>(null);

    const setBillInfo=useQuiverStore((state)=>state.setBillInfo);
  
    const reFund= async ()=>{
      console.log(billInfo.orderId);
      

      const tx=await writeContractAsync({
       address: CA,
       abi: QuiverPayManagerABI,
       functionName: 'refundUser',
       args: [billInfo.orderId],
      });

      const receipt = await waitForTransactionReceipt(getConfig(), {
         hash: tx,
      });
 
      
      await axios.post(`${API_ENDPOINT}/api/handle_tx/`,{
        type:billInfo.type,
        id:billInfo.orderId,
        isRefund:true,
        isFulfilled:false
      });

      toast.success("REFUND SUCCSSFUL", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });

        toast.error("FALSE REFUND WILL RESULT IN YOUR STAKED ETH BEING SLASHED", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
            
      
      setBillInfo(null);
      
    }
       const fulfillOrder= async ()=>{
            const tx=await writeContractAsync({
       address:CA,
       abi: QuiverPayManagerABI,
       functionName: 'fulfillOrder',
       args: [billInfo.orderId],
      });
      
     const receipt = await waitForTransactionReceipt(getConfig(), {
         hash: tx,
      });
 
        await axios.post(`${API_ENDPOINT}/api/handle_tx/`,{
        type:billInfo.type,
        id:billInfo.orderId,
        isRefund:false,
        isFulfilled:true,
        token:electrcityToken
      });

      toast.success("ORDER COMPLETED", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });

       toast.error("FALSE FULFILL WILL RESULT IN YOUR STAKED ETH BEING SLASHED", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
            
        setBillInfo(null);
    }

   

    return(
        <div className="overlays-Container" onClick={()=>setBillInfo(null)}>
            <m.div  initial={{ y:"40px",opacity:0,}} animate={{y:"0px",opacity:1}}  transition={{ delay:0.4,duration: 0.6,    stiffness:100 ,  damping: 5,type:"spring" }} className="summaryForm" onClick={(e)=>e.stopPropagation()}>
                <div className="sfHeader">
                    <img src={QuiverLogo} />
                    <h1>Transaction Packet</h1>
                </div>

                <div className="serviceHeader">
                    <h1>Service</h1>
                    <div className="ServiceDiv">
                      { billInfo.type=="Airtime" &&  <p>Airtime <i className="fa-solid fa-sim-card"></i></p>}
  
         { billInfo.type=="Data" &&  <p>Data <i className="fa-solid fa-wifi"></i></p>}
                    { billInfo.type =="Electricity" &&  <p>Electricity <i className="fa-solid fa-bolt"></i></p>}
                    { billInfo.type=="Tv" &&  <p>TV <i className="fa-solid fa-sim-card"></i></p>}
                               </div>
                </div>
                <hr style={{marginTop:"10px"}}/>
                <h3>Description</h3>
                   <hr />
                {billInfo.type =="Data" &&(
                    <div className="billInfo">
                          <div>
                         <h4>Network</h4>
                        <p>{billInfo.network}</p>
                        </div>
                          <div>
                         <h4>Number</h4>
                        <p>08108454138</p>
                        </div>
                        <div>
                         <h4>{billInfo.plan}</h4>
                        <p>@NGN {billInfo.fiat_amount} ~ {roundToThree(billInfo.usdc_amount-0.2)} USDC</p>
                        </div>
                        </div>
                )}

                  {billInfo.type == "Airtime" &&(
                    <div className="billInfo">
                          <div>
                         <h4>Network</h4>
                        <p>{billInfo.network}</p>
                        </div>
                          <div>
                         <h4>Number</h4>
                        <p>{billInfo.phone_number}</p>
                        </div>
                        <div>
                         <h4>Amount</h4>
                        <p>@NGN {billInfo.fiat_amount} ~ {roundToThree(billInfo.usdc_amount-0.2)} USDC</p>
                        </div>
                        </div>
                )}

              {billInfo.type =="Electricity" &&(
                    <div className="billInfo">
                          <div>
                         <h4>Provider</h4>
                        <p>{billInfo.provider}</p>
                        </div>
                          <div>
                         <h4>Meter Number</h4>
                        <p>{billInfo.meter_number}</p>
                        </div>
                        <div>
                         <h4>Amount</h4>
                            <p>@NGN {billInfo.fiat_amount} ~ {roundToThree(billInfo.usdc_amount-0.2)} USDC</p>
                        </div>
                        <div className="meter_token">
                        <input type="text" placeholder="Electricity Token" onChange={(e)=>setElectricityToken(e.target.value)} />
                        </div>
                        </div>
                )}

                 <hr style={{marginTop:"10px"}}/>
                 <div style={{ display:"flex",justifyContent:"space-between",alignItem:"center"}}>
                   <h3>Payout </h3>
                  <p>{roundToThree(parseFloat(billInfo.usdc_amount))} USDC</p>
                 </div>
                   <hr />
                   <div className="btnActionContainer">
                    <m.button whileTap={{ scale:1.1 }} onClick={()=>setBillInfo(null)}>
                      Drop
                    </m.button>
                    <m.button  whileTap={{ scale:1.1 }} onClick={()=>reFund()}>
                      ReFund +0.1 USDC
                    </m.button>
                    <m.button  whileTap={{ scale:1.1 }}  onClick={()=>fulfillOrder()}>
                      Success
                    </m.button>
                   </div>
                </m.div>
         </div>
    )
}

const index:React.FC=()=>{
     const billType=useQuiverStore((state)=>state.billType);
     const billInfo=useQuiverStore((state)=>state.billInfo);
    

    return(
    <div className="txOverlay">
        <Summary billInfo={billInfo}/>
    </div>
    );
}

export default index;