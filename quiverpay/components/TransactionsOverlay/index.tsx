import "./index.css";
import React,{useEffect, useState} from "react";
import { motion as m } from "framer-motion";
import axios from "axios";
import QuiverLogo from "../../src/assets/Frame 68.svg";
import { dataPlanDB_NG,NG_PREPAID_PROVIDERS} from "../utils";
import useQuiverStore from "../../store";

import { useWriteContract } from 'wagmi';
import { readContract,waitForTransaction } from "wagmi/actions";
import { parseAbi } from "viem";
import { parseUnits } from 'viem'; // to parse token amount correctly
import { QuiverPayManagerABI } from "../contract/abi";

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
    type:string;
}

const spenderAddress = "0x28A485c0c896D77F7821027EaD8b24bAe1DFBC51";
const tokenAddress = '0x036CbD53842c5426634e7929541eC2318f3dCF7e';

// Define your ERC20 contract's ABI
const erc20Abi = parseAbi([
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
]);



const Send:React.FC<Props>=({ type })=>{
    const [phoneNumber,setPhoneNumber]=useState<string|null>(null);
    const [pricingData,setPricingData]=useState<number|null>(null);
    const [fiatAmountToSend,setFiatAmountToSend]=useState(type=="Electricity" ? 0 : 100);
    const [activeNetwork,setActiveNetwork]=useState("MTN NG");
    const [activeNetworkType,setActiveNetworkType]=useState("DAILY");
    const [meterNumber,setMeterNumber]=useState<null|string>(null);
    const [meterOwner,setMeterOwner]=useState<null|string>(null);
    const [elctricityProvider,setElectricityProvider]=useState<null|string>("IBADAN ELECTRICITY");
    const setBillInfo=useQuiverStore((state)=>state.setBillInfo);
    const setIsPay=useQuiverStore((state)=>state.setIsPay);
    const userData=useQuiverStore((state)=>state.userData);
    
    const handleChange = async (event:any) => {
        if(!pricingData){
            const res=await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=usd-coin&vs_currencies=ngn`);
            setPricingData(res.data["usd-coin"].ngn);
    
        }
       
      };

      const getPrice=async ()=>{
        const res=await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=usd-coin&vs_currencies=ngn`);
        console.log(res.data["usd-coin"]);
        setPricingData(res.data["usd-coin"].ngn);

      }

      const networkChange=(event:any)=>{
        setActiveNetwork(event.target.value);
        const plan=Object.keys(dataPlanDB_NG[event.target.value]["DAILY"])[0];
        setFiatAmountToSend(dataPlanDB_NG[event.target.value]["DAILY"][plan]);  
        setActiveNetworkType("DAILY");
      }

      const networkTypeChange=(event:any)=>{
        setActiveNetworkType(event.target.value);
        const plan=Object.keys(dataPlanDB_NG[activeNetwork ? activeNetwork : "AIRTEL NG"][event.target.value])[0];
        setFiatAmountToSend(dataPlanDB_NG[activeNetwork ? activeNetwork : "AIRTEL NG"][event.target.value][plan]);
    }

      const networkPackagePick=(event:any)=>{
        setFiatAmountToSend(dataPlanDB_NG[activeNetwork][activeNetworkType][event.target.value]);
      }

      const to_str=(val:any)=>{
        return `${val}`;
      }

      useEffect(()=>{
        getPrice();
      },[]);
      

    return(
        <div className="overlay-Container" onClick={()=>setIsPay(false,null)}>
            <m.div className="connectForm"  initial={{ y:"40px",opacity:0,}} animate={{y:"0px",opacity:1}}  transition={{ delay:0.4,duration: 0.6,    stiffness:100 ,  damping: 5,type:"spring" }} onClick={(e)=>e.stopPropagation()}>
                <h1 style={{ fontWeight:"600"}}>CURRENCY</h1>
                <div className="currency-header">
                <select name="currencies" onClick={handleChange}>
                   <option value="usdc">
                        USDC
                    </option>
                </select>
                <div>
                    <p><b>BALANCE:</b> <i>2,345.00</i></p>
                </div>
                </div>

                <div className="txData">
                    <div style={{ display:"flex",alignItems:"center"}}>
                        <p>NGN</p>
                  { type !="Data" ?
                  (<input type="number" min="100" max="10000" placeholder="NGN 100.00 - NGN 10,000.00" onChange={(e)=>{ 
                      
                    setFiatAmountToSend(e.target.value);
                }} />):(
                         <input type="number" min="100" max="10000" placeholder="NGN 100.00 - NGN 10,000.00"  value={fiatAmountToSend} readOnly/>
                )}

                    </div>
                
                    <div className="estimate">
                        <p><b>Approx.</b> {pricingData ? roundToThree(fiatAmountToSend/pricingData) : "0"} USDC</p>
                        </div>
                </div>
                <p>1 USDC ~ NGN {pricingData}</p>
                { type=="transfer-wallet" &&
                     <div className="recWalletAddress">
                            <input type="text" placeholder="Reciever's Wallet Address" />
                        </div>}

                {type=="Airtime" &&(
                    <div className="airtime-container">
                        <select onChange={(e)=>setActiveNetwork(e.target.value)}>
                            <option>
                                MTN NG
                            </option>
                            <option>
                               AIRTEL NG
                            </option>
                            <option>
                                GLO NG
                            </option>
                            <option>
                                9MOBILE NG
                            </option>
                        </select>
                        <input type="number" placeholder="PHONE NUMBER" onChange={(e)=>setPhoneNumber(`${e.target.value}`)} />
                    </div>
                )}

   
                {type=="Data" &&(
                    <div className="data-container">
                        <div className="data-header">
                        <select onChange={networkChange} value={activeNetwork}>
                            {Object.keys(dataPlanDB_NG).map((network)=>{
                                return(
                                        <option value={network}>
                                         {network}
                                      </option>
                                       );
                                    }
                            )}
                        
                        </select>

                        <select onChange={networkTypeChange}  value={activeNetworkType}>
                        {Object.keys(dataPlanDB_NG[activeNetwork ? activeNetwork : "AIRTEL NG"]).map((plans)=>{
                                return(
                                        <option value={plans}>
                                         {plans}
                                      </option>
                                       );
                                    }
                            )}
                        </select>
                        </div>

                        <select className="plans" onChange={networkPackagePick}>
                        {Object.keys(dataPlanDB_NG[activeNetwork ? activeNetwork : "AIRTEL NG"][activeNetworkType ? activeNetworkType : "DAILY"]).map((data_package)=>{
                                return(
                                        <option value={data_package}>
                                         {data_package}
                                      </option>
                                       );
                                    }
                            )}
                        </select>
                        <input type="number" placeholder="PHONE NUMBER" onChange={(e)=>setPhoneNumber(`${e.target.value}`)} />
                    </div>
                )}

            {type=="Electricity" &&(
                    <div className="airtime-container">
                        <select onChange={(e)=>setElectricityProvider(e.target.value)}>
                          {NG_PREPAID_PROVIDERS.map((provider)=>{
                            return(
                                <option value={provider}>
                                    {provider}
                                </option>
                            )
                          })}
                        </select>
                        <input type="number" placeholder="METER NUMBER" onChange={(e)=>setMeterNumber(`${e.target.value}`)} />
                        <input type="text" placeholder="METER OWNER NAME" onChange={(e)=>setMeterOwner(`${e.target.value}`)} />
                    </div>
                )}


               {detectNetwork(`${phoneNumber}`) != "" && (
                    <div className="netDetector">
                         <h2>{detectNetwork(`${phoneNumber}`)} DETECTED</h2>
                    </div>
                )}
                <m.button whileTap={{ scale:1.2}} onClick={()=>setBillInfo(type == "Airtime" ? {network:activeNetwork,fiat_amount:fiatAmountToSend,usdc_amount: to_str(roundToThree(fiatAmountToSend/pricingData)),amount:fiatAmountToSend,issuer_address:userData?.walletAddr,phone_number:to_str(phoneNumber)} :
                 type=="Data" ?  {network:activeNetwork,plan:activeNetworkType,fiat_amount:fiatAmountToSend,usdc_amount: to_str(roundToThree(fiatAmountToSend/pricingData)),amount:fiatAmountToSend,issuer_address:userData?.walletAddr,phone_number:to_str(phoneNumber)} :
                   {provider:elctricityProvider,meter_number:meterNumber,meter_owner:meterOwner,fiat_amount:fiatAmountToSend,usdc_amount: to_str(roundToThree(fiatAmountToSend/pricingData)),amount:fiatAmountToSend,issuer_address:userData?.walletAddr} )}>CONFIRM</m.button>
              
               <p style={{ color:"oklch(70.4% 0.04 256.788)"}}>*Tap outside the form to exit</p>
            </m.div>

        </div>
    )
}



interface Airtime{
  network:string|null;
  amount:number|null;
  phone_number:string|null;
  usdc_amount:string|null;
  fiat_amount:number|null;
  issuer_address:string| undefined;
}

interface Data{
  network:string|null;
  phone_number:string|null;
  plan:string|null;
  amount:number|null;
  usdc_amount:string|null;
  fiat_amount:number|null;
  issuer_address:string|undefined;
}


interface Electricity{
  provider:string|null;
  meter_number:string|null;
  meter_owner:string|null;
  amount:number|null;
  usdc_amount:string|null;
  fiat_amount:number;
  issuer_address:string|undefined;

}

interface summaryProp{
    billInfo:Airtime|Data|Electricity;
    serviceName:string|null;
}

const Summary:React.FC<summaryProp>=({ billInfo,serviceName})=>{
  const setIsPay=useQuiverStore((state)=>state.setIsPay);
  const userData=useQuiverStore((state)=>state.userData);

   const amountToApprove = parseUnits(`${billInfo.usdc_amount ? roundToThree(parseFloat(billInfo.usdc_amount)+0.25) : 0}`, 6); // 1000 tokens with 18 decimals
   const { writeContractAsync } = useWriteContract();
   const [isProcessing,setIsProcessing]=useState(false);
    const setBillInfo=useQuiverStore((state)=>state.setBillInfo);
  
    const handleApprove=async ()=>{
      console.log(userData?.walletAddr);

   // Check the existing allowance
     const allowance = await readContract(getConfig(),{
         address: tokenAddress,
         abi: erc20Abi,
         functionName: "allowance",
         args: [userData?.walletAddr, spenderAddress],
       });

       console.log(allowance);

  if(allowance < amountToApprove){
    const tx=await writeContractAsync({
       address: tokenAddress,
       abi: erc20Abi,
       functionName: 'approve',
       args: [spenderAddress, amountToApprove],
      });
    }
      
    }

    const createOrder= async ()=>{
      handleApprove();
      const tx=await writeContractAsync({
       address: spenderAddress,
       abi: QuiverPayManagerABI,
       functionName: 'createOrder',
       args: [amountToApprove, serviceName],
      });
      console.log(tx);  
      setIsProcessing(true);   
    }

    return(
        <div className="overlays-Container">
            <m.div  initial={{ y:"40px",opacity:0,}} animate={{y:"0px",opacity:1}}  transition={{ delay:0.4,duration: 0.6,    stiffness:100 ,  damping: 5,type:"spring" }} className="summaryForm" onClick={(e)=>e.stopPropagation()}>
                <div className="sfHeader">
                    <img src={QuiverLogo} />
                    <h1>Summary</h1>
                </div>

                <div className="serviceHeader">
                    <h1>Service</h1>
                    <div className="ServiceDiv">
                      { serviceName=="Airtime" &&  <p>Airtime <i className="fa-solid fa-sim-card"></i></p>}
  
         { serviceName=="Data" &&  <p>Data <i className="fa-solid fa-wifi"></i></p>}
                    { serviceName=="Electricity" &&  <p>Electricity <i className="fa-solid fa-bolt"></i></p>}
                    { serviceName=="Tv" &&  <p>TV <i className="fa-solid fa-sim-card"></i></p>}
                               </div>
                </div>
                <hr style={{marginTop:"10px"}}/>
                <h3>Description</h3>
                   <hr />
                {serviceName =="Data" &&(
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
                        <p>@NGN {billInfo.fiat_amount} ~ {billInfo.usdc_amount} USDC</p>
                        </div>
                         <div>
                            <h4>Charge</h4>
                            <p>0.25 USDC</p>
                         </div>
                        </div>
                )}

                  {serviceName == "Airtime" &&(
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
                        <p>@NGN {billInfo.fiat_amount} ~ {billInfo.usdc_amount} USDC</p>
                        </div>
                         <div>
                            <h4>Charge</h4>
                            <p>0.25 USDC</p>
                         </div>
                        </div>
                )}

              {serviceName =="Electricity" &&(
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
                            <p>@NGN {billInfo.fiat_amount} ~ {billInfo.usdc_amount} USDC</p>
                        </div>
                         <div>
                            <h4>Charge</h4>
                            <p>0.25 USDC</p>
                         </div>
                        </div>
                )}
                 <hr style={{marginTop:"10px"}}/>
                 <div style={{ display:"flex",justifyContent:"space-between",alignItem:"center"}}>
                   <h3>Total </h3>
                  <p>{roundToThree(parseFloat(billInfo.usdc_amount)+0.25)} USDC</p>
                 </div>
                   <hr />
             <div className="btn-container">
          <m.button whileTap={{ scale:1.2}} onClick={()=>!isProcessing && createOrder()}>{ isProcessing ? "Processing 1-5 mins." : "Pay" }</m.button>
          { !isProcessing && (<button  onClick={()=>setBillInfo(null)}>EDIT <i className="fas fa-edit"></i></button>)}
             </div>
                </m.div>
         </div>
    )
}
export { Send,Summary }