import React,{ useEffect,useState } from "react";
import useQuiverStore from "../../store";
import "./index.css";
import axios from "axios";


const colors=["#FF7A00","#00BFFF","#FFD700","#6A0DAD","#2ECC71"];
const MAX_BILLS_OVERFLOW=100;
interface ServiceStatProps{
    serviceName:string;
    Icon:any;
    color:string;
    amount:number;
}

const ServiceStats:React.FC<ServiceStatProps>=({ serviceName,Icon,color,amount})=>{
    const userData=useQuiverStore((state)=>state.userData);
    const [percentage,setPercentage]=useState(0);

   // const percentage=(amount/MAX_BILLS_OVERFLOW)*100;

    const getStats=async ()=>{
          switch(serviceName){
            case "Airtime":
                const resa=await axios.post("http://127.0.0.1:8000/api/wallet_airtime_tx/",{"walletAddr":userData?.walletAddr});
                setPercentage((JSON.parse(resa.data.data).length/MAX_BILLS_OVERFLOW)*100);
                break;
            case "Data":
                const resdt=await axios.post("http://127.0.0.1:8000/api/wallet_data_tx/",{"walletAddr":userData?.walletAddr});
                setPercentage((JSON.parse(resdt.data.data).length/MAX_BILLS_OVERFLOW)*100);
                break;
            case "Electricity":
                const rese=await axios.post("http://127.0.0.1:8000/api/wallet_electricity_tx/",{"walletAddr":userData?.walletAddr});
                setPercentage((JSON.parse(rese.data.data).length/MAX_BILLS_OVERFLOW)*100);
                break;   
            default:
                console.log("Nothing");
        }
    }

    useEffect(()=>{
        getStats();
    },[])

    return(
        <div className="serviceStatContainer">
            <div className="bar" style={{ background:`${color}`,width:`${percentage > 100 ? 100 : percentage}%`}}>

            </div>
          <h1>{serviceName} {Icon}</h1>
        </div>
     );
}

const Overview:React.FC=()=>{
     return(
        <div className="ovContainer">
            <h1>Overview</h1>
            <div className="insideOvContainer">
                <p>What's eating your budget?</p>
                <ServiceStats serviceName="Airtime" Icon={<i className="fa-solid fa-sim-card" style={{ color:`${colors[0]}`}} ></i>} color={colors[0]} amount={50}/>
                <ServiceStats serviceName="Data" Icon={<i className="fa-solid fa-wifi" style={{ color:`${colors[1]}`}}></i>} color={colors[1]} amount={30} />
              <ServiceStats serviceName="Electricity" Icon={<i className="fas fa-bolt" style={{ color:`${colors[2]}`}}></i>}  color={colors[2]} amount={10}/>
               <ServiceStats serviceName="Tv" Icon={<i className="fa-solid fa-tv" style={{ color:`${colors[3]}`}}></i>}  color={colors[3]}  amount={70}/>
               <ServiceStats serviceName="Transfers" Icon={<i className="fa-solid fa-money-bill-transfer"  style={{ color:`${colors[4]}`}}></i>} color={colors[4]} amount={40} />
           </div>
            <p>View transaction history</p>
        </div>
     );
}

export default Overview;