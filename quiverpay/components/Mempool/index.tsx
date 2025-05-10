import React from "react";
import "./index.css";


const colors=["#FF7A00","#00BFFF","#FFD700","#6A0DAD","#2ECC71"];
interface TxProps{
    Icon:any;
    payout:number;
    serviceID:number;
}


const TxContainer:React.FC<TxProps>=({Icon,payout,serviceID})=>{
    return(
        <div className="txContainer">
            <div className="txHeader">
                <h3>From:<span>0xa1E***2aE</span></h3>
                <div style={{ background:colors[serviceID]}}>{Icon}</div>
            </div>
            <button>
                <p>PROCESS | payout {payout} USDC <i className="fa-solid fa-key"></i></p>
            </button>
        </div>
    )
}

const index:React.FC=()=>{
    return(
        <div className="txMempoolContainer">
            <h1>Tx Mempool</h1>
            <div className="txsHolder">
            <TxContainer Icon={<i className="fa-solid fa-sim-card"></i>} payout={15.2} serviceID={0}/>
                
            <TxContainer Icon={<i className="fa-solid fa-wifi"></i>} payout={2.2} serviceID={1}/>
                
            <TxContainer Icon={<i className="fa-solid fa-bolt"></i>} payout={1.2} serviceID={2}/>
                
               
            </div>
        </div>
    );
}
export default index;