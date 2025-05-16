//@ts-nocheck

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx'
import OnChainKitWrapper from './onChainKitWrapper.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <head>
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Limelight&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Limelight&family=Rowdies:wght@300;400;700&display=swap');
</style>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    </head>
         
    <BrowserRouter>
    <OnChainKitWrapper>
    <App />
    </OnChainKitWrapper>
      
    </BrowserRouter>
       </StrictMode>,
)
