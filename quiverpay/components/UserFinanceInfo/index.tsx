import React, { useEffect, useState } from "react";
import "./index.css";
import QuiverLogo from "../../src/assets/Frame 68.svg";
import { motion as m } from "framer-motion";
import { getName } from "@coinbase/onchainkit/identity";
import { base } from "wagmi/chains";
import useQuiverStore from "../../store";

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
  

const UserMoneyCard:React.FC=()=>{
    const userData=useQuiverStore((state)=>state.userData);
    const [baseName,setBaseName]=useState<any|null>(null);

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

      
      useEffect(()=>{
        getBaseName();
       
      },[]);

    return(
        <div className="cardContainer">
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
            <h3>**** USDC</h3>
            <h3>{userData?.reg_date}</h3>
            </div>
            <p>*Only USDC stablecoin is currently supported.</p>
            <div className="blob">

            </div>
            <div className="blob-2">

           </div>
        </div>
    )
}


const colors=["#FF7A00","#00BFFF","#FFD700","#6A0DAD","#2ECC71"];
interface ServiceProps{
    serviceName:string;
    Icon:any;
    color:string;
    isDisabled:boolean;
}

const Service:React.FC<ServiceProps>=({color,Icon,serviceName,isDisabled=false})=>{
  const setIsPay=useQuiverStore((state)=>state.setIsPay);
  
    return(
        <div className="serviceContainer">
        <m.div onClick={()=>setIsPay(true,serviceName)} whileTap={{ scale:1.2 }} className="serviceIconContainer" style={{ background:`${color}`,opacity:`${isDisabled && "0.3"}`}}>
        {Icon}
        </m.div>
        <h3>{serviceName}</h3>
    </div>
    );
}

const UserActionsContainer:React.FC=()=>{

 
    return(
        <div className="userActionsContainer" >
            <div className="btnContainer">
            <m.button whileTap={{ scale:1.2}}><div>To Quiver <img src={QuiverLogo} /></div></m.button>
            <m.button whileTap={{ scale:1.2}}>To Wallet <i className="fa-solid fa-wallet"></i></m.button>
            <m.button whileTap={{ scale:1.2}}>To Bank <i className="fa-solid fa-arrow-right"></i></m.button>
            </div>
            <div className="servicesContainer">
               <Service serviceName="Airtime" color={colors[0]} Icon={<i className="fa-solid fa-sim-card"></i>} />
               <Service serviceName="Data" color={colors[1]} Icon={<i className="fa-solid fa-wifi"></i>} />
      <Service serviceName="Tv" color={colors[3]} isDisabled={true} Icon={<i className="fa-solid fa-tv"></i>} />
      <Service serviceName="Electricity" color={colors[2]} Icon={<i className="fa-solid fa-bolt"></i>} />
         
       
            </div>
        </div>
    );
}

const index:React.FC=()=>{
    const userData=useQuiverStore((state)=>state.userData);
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

    return(
        <div className="infoHolder">
            <div className="uf-Header">
            <h1>Hi,{sformatWalletAddress(userData?.walletAddr)} { copied ?  <i className="fa-solid fa-clipboard"></i> : <i onClick={()=>copyToClipboard(userData?.walletAddr)} className="fa-solid fa-copy"></i>}</h1>
           
            </div>
            <div>
                <div className="utilsContainer">
                    <UserMoneyCard />
                    <UserActionsContainer />
                </div>
            </div>

        </div>
    )
}

export default index;