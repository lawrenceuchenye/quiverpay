
import React from "react";
import "./index.css";

const index:React.FC=()=>{
    return(
        <div className="txContainerHolder">
            <div className="header">
                <h2>Transaction Hash</h2>
                <h2>Type</h2>
                <h2>Block ID</h2>
                <h2>Age</h2>
                <h2>To</h2>
                <h2>From</h2>
                <h2>Amount</h2>
                <h2>Status</h2>
            </div>
            <hr />
        </div>
    );
}

export default index;