import { showAlert } from "@/redux/states/alerts";
import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
} from "expo-location";

export const LocationContext = createContext(null);

export function useLocation() {
  return useContext(LocationContext);
}

export function LocationProvider({ children }) {
  const [location, setLocation] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    async function getCurrentLocation() {
      const { status } = await requestForegroundPermissionsAsync();
      if (status !== "granted") {
        dispatch(
          showAlert({
            text: "Unfortunately, we couldn't access your location",
            type: "error",
          })
        );
        return;
      }
      const location = await getCurrentPositionAsync({});
      setLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    }

    getCurrentLocation();
  }, []);

  const value = {
    location,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}
