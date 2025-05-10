import React from "react";
import QuiverState from "../../../components/QuiverState";
import TransactionsState from "../../../components/TransactionsState";
const index:React.FC=()=>{
    return(
        <div>
            <QuiverState />
            <TransactionsState />
        </div>
    )
}

export default index;