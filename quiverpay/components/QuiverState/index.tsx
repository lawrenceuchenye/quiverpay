import React from "react";
import "./index.css";


interface TsProps{
    isPending:boolean;
    amount:string;
    volume:boolean;
}

const TransactionState:React.FC<TsProps>=({isPending,amount,volume})=>{
    return(
        <div className={isPending && !volume ? "tab" : "s-tab"} >
            <h1>{volume ? `$${amount}`:amount}</h1>
            <h3>{ isPending ? "Pending Transactions" : !volume ? "Successful Transaction" : "Volume"}</h3>
        </div>
    )
}
const index:React.FC=()=>{
    return(
        <div className="statsContainer">
            <TransactionState isPending={true} amount={"17,000"} volume={false}/>
            <TransactionState isPending={false} amount={"10,000"} volume={false}/>
            <TransactionState isPending={false} amount={"80,000"} volume={true}/>
        </div>
    );
}

export default index;