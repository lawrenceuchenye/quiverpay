import React, { useState,useEffect } from "react";
import "./index.css";
import { motion as m } from "framer-motion";
import useQuiverStore from "../../store";
import { coinbaseWallet, injected } from 'wagmi/connectors'
import { useConnect,useDisconnect,Connector } from 'wagmi';
import axios from 'axios';
import { useNavigate } from "react-router-dom";


const index:React.FC=()=>{
    const [useEOAWallet,setUseEOAWallet]=useState(false);
    const setConnectClicked=useQuiverStore(state=>state.setConnectClicked);
    const setUserData=useQuiverStore(state=>state.setUserData);
    const [role,setRole]=useState<string | null>(null);
    const { disconnect } = useDisconnect()
    const { connectAsync,connectors,status }=useConnect();

    const coinbaseWalletConnector = connectors.find(
        (connector) => connector.id == "coinbaseWalletSDK"
      ) as Connector;
    let nc_address:string|undefined|null=null;
    const navigate=useNavigate();


    
    const connectWallet=async (role:string)=>{
   
      setRole(role);
        disconnect();
        const { accounts,chainId}=await connectAsync({ connector:useEOAWallet ? injected(): coinbaseWalletConnector});
        axios.post("http://127.0.0.1:8000/api/create_user/",{
          walletAddr: accounts[0],
          role:role
       }) .then(function (response) {
        setConnectClicked(false);
         if(response.data.success){
          setUserData({
            walletAddr:response.data.user_data.walletaddress,
            role:response.data.user_data.role,
            reg_date:response.data.user_data.reg_date
          });

          console.log(response.data)
    
          if(response.data.user_data.role==2){
            navigate("/mempool");
            return
          }
          navigate("/home");
    
         }
       })
       .catch(function (error) {
         console.log(error);
       });
   }


    useEffect(()=>{
       
    },[]);
   
   return(
<div className="overlayContainer" onClick={()=>setConnectClicked(false)}>
<m.div  initial={{ y:"40px",opacity:0,}} animate={{y:"0px",opacity:1}}  transition={{ delay:0.4,duration: 0.6,    stiffness:100 ,  damping: 5,type:"spring" }} className="connectForm" onClick={(e)=>e.stopPropagation()}>
  <div className="roleContainer">

    <div className="walletChoice">
        <p>Use Existing Wallet? <input type="checkbox" onChange={(e)=>setUseEOAWallet(e.target.checked)}/></p> 
    </div>
   
  <div className="roleBtnContainer">
    <m.h1 onClick={()=>connectWallet("REG_USER")} whileTap={{scale:1.2}}>Spend Stables Frictionlessly <i className="fa-solid fa-credit-card"></i></m.h1>
    <m.h1 onClick={()=>connectWallet("NODE_USER")} whileTap={{ scale:1.2}}>Become a Node and Earn USDC <i className="fas fa-hand-holding-usd"></i></m.h1>
  </div>

  <p className="info">*Click outside the form to close.</p>
  </div>
 
</m.div>
</div>
    );
}

export default index;