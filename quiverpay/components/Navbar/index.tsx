
import React from 'react';
import QuiverLogo from "../../src/assets/Frame 68.svg";
import "./index.css";

import { motion as m} from "framer-motion";
import useQuiverStore from "../../store/";
import { useDisconnect } from 'wagmi';
import { useNavigate } from 'react-router-dom';

const Navbar:React.FC=()=>{
    const setConnectClicked=useQuiverStore((state)=>state.setConnectClicked);
    const setUserData=useQuiverStore((state)=>state.setUserData);
    const { disconnect } = useDisconnect();
    const userData=useQuiverStore(state=>state.userData);
    const navigate=useNavigate();


    const disconnectUser=()=>{
        navigate("");
        setUserData(null);
        disconnect();
    }

    return(
  <div className="qn-mainNavContainer">
    <div>
    <h3>About us</h3>
    <h3>Services</h3>
    <h3>QuiverScan</h3>
    </div>
    <div>
    <img src={QuiverLogo} />
    <h3>QuiverPay</h3>
    </div>
    <div>
        <m.button whileTap={{ scale:1.2}} onClick={()=>!userData ? setConnectClicked(true) : disconnectUser()}>{ userData ? "Disconnect" : "Connect"}  <i className="fa-solid fa-wallet"></i></m.button>
    </div>
  
    
</div>
    );
};


const MobileNav:React.FC=()=>{

    const setConnectClicked=useQuiverStore((state)=>state.setConnectClicked);
    const setUserData=useQuiverStore((state)=>state.setUserData);
    const { disconnect } = useDisconnect();
    const userData=useQuiverStore(state=>state.userData);
    const navigate=useNavigate();


    const disconnectUser=()=>{
        navigate("");
        setUserData(null);
        disconnect();
    }
    return(
<>
<div className="qn-mobileNavContainer">
<div><h1>About Us</h1><h1>Services</h1></div>
<m.button whileTap={{ scale:1.2}} onClick={()=>!userData ? setConnectClicked(true) : disconnectUser() }>{ userData ? "Disconnect" : "Connect"} <i className="fa-solid fa-wallet"></i></m.button>
</div>
</>
    );
}

export { Navbar,MobileNav };