import { createContext, useContext, useState } from 'react';
import { baseUrl } from '../config';

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const [opportunitiesData, setOpportunitiesData] = useState(null);

  const loadNextApi = async () => {
    try {
      const response = await fetch(`${baseUrl}/opportunities`);
      const data = await response.json();
      setOpportunitiesData(data);
    } catch (error) {
      console.error('Error loading API:', error);
    }
  };

  return (
    <ApiContext.Provider value={{ opportunitiesData, loadNextApi }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  return useContext(ApiContext);
};
