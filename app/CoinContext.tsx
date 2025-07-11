import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

type CoinContextType = {
  coins: number;
  setCoins: (coins: number) => void;
  addCoins: (amount: number) => void;
  refreshCoins: () => void;
};

const CoinContext = createContext<CoinContextType>({
  coins: 0,
  setCoins: () => {},
  addCoins: () => {},
  refreshCoins: () => {},
});

export const CoinProvider = ({ children }: { children: React.ReactNode }) => {
  const [coins, setCoinsState] = useState(0);

  useEffect(() => {
    const loadCoins = async () => {
      const savedCoins = await AsyncStorage.getItem('coins');
      if (savedCoins !== null) {
        setCoinsState(parseInt(savedCoins, 10));
      }
    };
    loadCoins();
  }, []);

  const setCoins = async (newCoins: number) => {
    setCoinsState(newCoins);
    await AsyncStorage.setItem('coins', newCoins.toString());
  };

  const addCoins = async (amount: number) => {
    const newTotal = coins + amount;
    console.log(`Adding coins: ${amount}, New total: ${newTotal}`); 
    setCoinsState(newTotal);
    await AsyncStorage.setItem('coins', newTotal.toString());
  };

  const refreshCoins = async () => {
    const stored = await AsyncStorage.getItem('coins');
    if (stored !== null) {
      setCoins(parseInt(stored));
    }
  };

  return (
    <CoinContext.Provider value={{ coins, setCoins, addCoins, refreshCoins }}>
      {children}
    </CoinContext.Provider>
  );
};

export const useCoinContext = () => useContext(CoinContext);

export default CoinProvider;
