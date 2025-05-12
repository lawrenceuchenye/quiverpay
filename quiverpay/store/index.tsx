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
}

interface Data{
  network:string|null;
  phone_number:string|null;
  plan:string|null;
  amount:number|null;
  usdc_amount:string|null;
  fiat_amount:number|null;
  issuer_address:string|undefined;
}


interface Electricity{
  provider:string|null;
  meter_number:string|null;
  meter_owner:string|null;
  amount:number|null;
  usdc_amount:string|null;
  fiat_amount:number;
  issuer_address:string|undefined;
}


interface QuiverState {
  userData:UserData  | null;
  connectClicked: boolean;
  isPay:boolean;
  billType:string|null;
  billInfo:null|Airtime|Data|Electricity;
  setConnectClicked: (clickState: boolean) => void;
  setUserData:(data:null|UserData) => void;
  setIsPay:(isPay:boolean,billType:string) => void;
  setBillInfo:(bill:null|Airtime|Data|Electricity) => void;
}



const useQuiverStore = create<QuiverState>((set) => ({
  userData:null,
  connectClicked: false,
  billType:null,
  isPay:false,
  billInfo:null,
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
