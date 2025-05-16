import { create } from 'zustand';


interface UserData{
   walletAddr:string;
   role:string;
   reg_date:string;
}

interface Airtime{
  network:string|null;
  amount:number|null;
  phone_number:string|null;
  usdc_amount:string|null;
  fiat_amount:number|null;
  issuer_address:string| undefined;
  orderId:number;
}

interface Data{
  network:string|null;
  phone_number:string|null;
  plan:string|null;
  amount:number|null;
  usdc_amount:string|null;
  fiat_amount:number|null;
  issuer_address:string|undefined;
  orderId:number;
}


interface Electricity{
  provider:string|null;
  meter_number:string|null;
  meter_owner:string|null;
  amount:number|null;
  usdc_amount:string|null;
  fiat_amount:number;
  issuer_address:string|undefined;
   orderId:number;
}


interface QuiverState {
  userData:UserData  | null;
  connectClicked: boolean;
  isPay:boolean;
  billType:string|null;
  billInfo:null|Airtime|Data|Electricity;
  isStake:boolean;
  isStaked:boolean;
  setConnectClicked: (clickState: boolean) => void;
  setUserData:(data:null|UserData) => void;
  setIsPay:(isPay:boolean,billType:string) => void;
  setBillInfo:(bill:null|Airtime|Data|Electricity) => void;
  setIsStake:(isStake:boolean) => void;
  setIsStaked:(isStaked:boolean) => void;
}



const useQuiverStore = create<QuiverState>((set) => ({
  userData:null,
  connectClicked: false,
  billType:null,
  isPay:false,
  billInfo:null,
  isStake:false,
  isStaked:false,
  setIsStake:(isStake:boolean)=>{
    set(() => ({ isStake: isStake }));
  },
   setIsStaked:(isStaked:boolean)=>{
    set(() => ({ isStaked: isStaked }));
  },
  setConnectClicked: (clickState: boolean) => {
    set(() => ({ connectClicked: clickState }));
  },
  setUserData: (data:UserData | null) => {
    set(() => ({ userData:data }));
  },
  setIsPay: (isPay:boolean,billType:string|null) => {
    set(() => ({ isPay:isPay,billType:billType,billInfo:null }));
  },
  setBillInfo:(bill:null|Airtime|Data|Electricity)=>{
     set(() => ({ billInfo:bill}));
  }
}));

export default useQuiverStore;
