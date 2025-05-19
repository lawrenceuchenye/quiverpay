import React, { useEffect } from "react";
import "./index.css";
import { motion as m} from "framer-motion";
import { useDisconnect } from 'wagmi';


const Home:React.FC=()=>{
    const { disconnect } = useDisconnect();

    useEffect(()=>{
    disconnect();
    },[]);

    return(
        <div className="parent-hmContainer">
        <div className="main-hmContainer">
            <div className="txt-container">
           
<p>Spend your crypto effortlessly</p>
<h1 className="hm-hero-txt">DePIN <br /><i>meets</i> <span>Stablecoins</span></h1>
<p>
  A DePIN-powered stablecoin app that cuts out middlemen, resists censorship, and brings fast, borderless payments to everyone—permissionlessly.
  </p>
  <m.button whileTap={{ scale:1.2}}>JOIN THE NETWORK</m.button>
  </div>
  
  <div className="hm-paneContainer">
  <div className="network-pane"></div>
  
    <div className="network-pane"></div>
  </div>
      </div>
      <p className="slogan">POWERED BY PEOPLE</p>
      </div>
    );
}

export default Home;