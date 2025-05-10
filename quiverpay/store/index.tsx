import { create } from 'zustand';


interface UserData{
   walletAddr:string;
   role:string;
   reg_date:string;
}


interface QuiverState {
  userData:UserData  | null;
  connectClicked: boolean;
  isPay:boolean;
  billType:string|null;
  setConnectClicked: (clickState: boolean) => void;
  setUserData:(data:null|UserData) => void;
  setIsPay:(isPay:boolean,billType:string) => void;
}



const useQuiverStore = create<QuiverState>((set) => ({
  userData:null,
  connectClicked: false,
  billType:null,
  isPay:false,
  
  setConnectClicked: (clickState: boolean) => {
    set(() => ({ connectClicked: clickState }));
  },
  setUserData: (data:UserData | null) => {
    set(() => ({ userData:data }));
  },
  setIsPay: (isPay:boolean,billType:string) => {
    set(() => ({ isPay:isPay,billType:billType }));
  },
}));

export default useQuiverStore;
