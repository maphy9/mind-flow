import { showAlert } from "@/redux/states/alerts";
import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
} from "expo-location";
import { DEFAULT_LOCATION } from "@/constants/location";

export const LocationContext = createContext(null);

export function useLocation() {
  return useContext(LocationContext);
}

export function LocationProvider({ children }) {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const dispatch = useDispatch();

  useEffect(() => {
    async function getCurrentLocation() {
      try {
        const { status } = await requestForegroundPermissionsAsync();
        if (status !== "granted") {
          dispatch(
            showAlert({
              text: "Location permission denied. Using default location.",
              type: "info",
            })
          );
          return;
        }

        const location = await getCurrentPositionAsync();

        setLocation({
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        });
      } catch (error) {
        console.error("Location error:", error);
        dispatch(
          showAlert({
            text: "Could not get current location. Using default location.",
            type: "info",
          })
        );
        setLocation(DEFAULT_LOCATION);
      }
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
