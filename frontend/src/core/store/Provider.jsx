import React, { createContext, useContext } from "react";
import store from './store'

export const StoreContext = createContext(store);

//@ts-ignore
export const StoreProvider = ({ children, store }) => {
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

export const useStores = () => useContext(StoreContext);