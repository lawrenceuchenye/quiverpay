import React from "react";
import "./index.css";

import UserOverview from "../../../components/UserOverview";
import UserFinanceInfo from "../../../components/UserFinanceInfo";

const Dashboard:React.FC=()=>{
    return(
<div className="userDashboard">
<UserOverview />
<UserFinanceInfo />
</div>
    );
}

export default Dashboard;