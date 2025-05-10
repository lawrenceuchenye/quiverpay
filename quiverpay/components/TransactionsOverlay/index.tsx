import "./index.css";
import React,{useEffect, useState,useRef} from "react";
import { motion as m } from "framer-motion";
import axios from "axios";
import { dataPlanDB_NG,NG_PREPAID_PROVIDERS} from "../utils";
import useQuiverStore from "../../store";

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

const Send:React.FC<Props>=({ type })=>{
    const [phoneNumber,setPhoneNumber]=useState<string|null>(null);
    const [pricingData,setPricingData]=useState<number|null>(null);
    const [fiatAmountToSend,setFiatAmountToSend]=useState(type=="Electricity" ? 0 : 100);
    const [activeNetwork,setActiveNetwork]=useState("AIRTEL");
    const [activeNetworkType,setActiveNetworkType]=useState("DAILY");
    const [meterNumber,setMeterNumber]=useState<null|string>(null);
    const [meterOwner,setMeterOwner]=useState<null|string>(null);
    const [elctricityProvider,setElectricityProvider]=useState<null|string>(null);

    const setIsPay=useQuiverStore((state)=>state.setIsPay);


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
        const plan=Object.keys(dataPlanDB_NG[activeNetwork ? activeNetwork : "AIRTEL"][event.target.value])[0];
        setFiatAmountToSend(dataPlanDB_NG[activeNetwork ? activeNetwork : "AIRTEL"][event.target.value][plan]);
    }

      const networkPackagePick=(event:any)=>{
        setFiatAmountToSend(dataPlanDB_NG[activeNetwork][activeNetworkType][event.target.value]);
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
                        <select>
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
                        {Object.keys(dataPlanDB_NG[activeNetwork ? activeNetwork : "AIRTEL"]).map((plans)=>{
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
                        {Object.keys(dataPlanDB_NG[activeNetwork ? activeNetwork : "AIRTEL"][activeNetworkType ? activeNetworkType : "DAILY"]).map((data_package)=>{
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
                <m.button whileTap={{ scale:1.2}}>CONFIRM</m.button>
              
               <p style={{ color:"oklch(70.4% 0.04 256.788)"}}>*Tap outside the form to exit</p>
            </m.div>

        </div>
    )
}

export { Send }