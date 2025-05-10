import { useEffect, useState } from "react";
import{ Navbar,MobileNav} from "../components/Navbar";
import  ConnectOverlay from "../components/ConnectOverlay";
import { Routes, Route } from 'react-router-dom';

import Home from "./pages/Home";
import UserDashboard from "./pages/UserDashboard";
import NodeOperatorDashboard from "../src/pages/NodeOperatorDashboard";
import QuiverScan from "../src/pages/QuiverScan";


import { Send } from "../components/TransactionsOverlay";

import "./App.css";
import useQuiverStore from "../store";

function App() {

   const [isMobile,setIsMobile]=useState<boolean>(false);
  const connectClicked=useQuiverStore((state)=>state.connectClicked);
  const isPay=useQuiverStore((state)=>state.isPay);
  const billType=useQuiverStore((state)=>state.billType);


  useEffect(()=>{
    setIsMobile(window.innerWidth < 1200 ? true : false);
  },[]);

 
  return (
    <>
      <Navbar />
    <div className="routerContainer">
    <Routes>
     <Route path="/" element={<Home />} />
     <Route path="/home" element={<UserDashboard />} />
     <Route path="/mempool" element={<NodeOperatorDashboard />} />
     <Route path="/quiverscan" element={<QuiverScan />} />
     </Routes>
   
    </div>
        { isPay && <Send type={billType}/>};
       { isMobile && <MobileNav /> }
       { connectClicked && <ConnectOverlay />}
 
    </>
   
  );
}

export default App;
