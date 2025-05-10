import { OnchainKitProvider } from "@coinbase/onchainkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { baseSepolia } from "wagmi/chains"; // add baseSepolia for testing
import { type ReactNode, useState } from "react";
import { type State, WagmiProvider } from "wagmi";

import { getConfig } from "../config"; // your import path may vary

const OnChainKitWrapper = (props: {
  children: ReactNode;
  initialState?: State;
}) => {
    const [config] = useState(() => getConfig());
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config} initialState={props.initialState}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={import.meta.env.VITE_ONCHAINKIT_API_KEY}
          chain={baseSepolia} // add baseSepolia for testing
        >
          {props.children}
          </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default OnChainKitWrapper;