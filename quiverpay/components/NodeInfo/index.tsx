import React from "react";
import "./index.css";



const UserMoneyCard:React.FC=()=>{
    return(
        <div className="cardContainer">
            <div className="cardInfo-1">
            <button>GET ID <i className="fas fa-id-card"></i></button>
            <h3>Base</h3>
            </div>
            <h2>0x48Ea12*****A7eC42259f</h2>
            <div className="cardInfo-2">
            <h3>$300 USDC</h3>
            <h3>10/2/2025</h3>
            </div>
            <p>*Only USDC stablecoin is currently supported.</p>
            <div className="blob">

            </div>
            <div className="blob-2">

           </div>
        </div>
    )
}

const NodeInfo:React.FC=()=>{
    return(
    <div className="infoCardContainer">
        <div className="infoData">
            <h1>STAKED ETH:</h1>
            <p>0.02 ETH</p>
        </div>
        <div className="infoData">
            <h1>LIFETIME EARNING:</h1>
            <p>100 USDC</p>
        </div>
        <div className="infoData">
            <h1>TRANSACTIONS(24 HRS):</h1>
            <p>50</p>
        </div>
        <div className="infoData">
            <h1>EARNINGS(24 HRS):</h1>
            <p>15 USDC</p>
        </div>
           <div className="blob">

</div>
<div className="blob-2">

</div>
    </div>
    );
}

const index:React.FC=()=>{
    return(
        <div className="infoHolder">
          
            <div className="utils-Container">
                <div className="uf-Header">
            <h1>Hi,0xDe..A3d <i className="fa-solid fa-copy"></i></h1>
           
            </div>
            
                    <UserMoneyCard />
                    <NodeInfo />
                    <div className="userActionsContainer" >
            <div className="btn-Container">
           
            <button>To Wallet <i className="fa-solid fa-wallet"></i></button>
            <button className="btn2" style={{ background:"oklch(72.3% 0.219 149.579)"}}>To Bank <i className="fa-solid fa-arrow-right"></i></button>
            </div>
         </div>
                </div>
            </div>

        
    )
}

export default index;