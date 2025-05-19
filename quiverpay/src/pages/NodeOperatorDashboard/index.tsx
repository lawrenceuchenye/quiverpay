import React from "react";
import "./index.css";

import UserOverview from "../../../components/UserOverview";
import NodeInfo from "../../../components/NodeInfo";
import Mempool from "../../../components/Mempool";

const Dashboard:React.FC=()=>{
    return(
<div className="userDashboard">
<UserOverview isNode={true} />
<div className="dataContainer">
    <Mempool />
    <NodeInfo />
</div>

</div>
    );
}

export default Dashboard;