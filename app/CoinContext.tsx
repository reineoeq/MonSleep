import React, { createContext, useContext, useState } from 'react';

type CoinContextType = {
  coins: number;
  setCoins: (coins: number) => void;
};

const CoinContext = createContext<CoinContextType>({
  coins: 0,
  setCoins: () => {},
});

export const CoinProvider = ({ children }: { children: React.ReactNode }) => {
  const [coins, setCoins] = useState(0);

  return (
    <CoinContext.Provider value={{ coins, setCoins }}>
      {children}
    </CoinContext.Provider>
  );
};

export const useCoinContext = () => useContext(CoinContext);