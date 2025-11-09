import { showAlert } from "@/redux/states/alerts";
import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as Location from "expo-location";
import { DEFAULT_LOCATION } from "@/constants/location";

export const LocationContext = createContext(null);

export function useLocation() {
  return useContext(LocationContext);
}

export function LocationProvider({ children }) {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [errorMsg, setErrorMsg] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          dispatch(
            showAlert({
              text: "Location permission denied. Using default location.",
              type: "info",
            })
          );
          return;
        }

        try {
          const currentLocation = await Location.getCurrentPositionAsync({});
          setLocation({
            lat: currentLocation.coords.latitude,
            lng: currentLocation.coords.longitude,
          });
        } catch (error) {
          console.log("Location error:", error.message);
          setErrorMsg("Location unavailable");
          setLocation(DEFAULT_LOCATION);
        }
      } catch {}
    })();
  }, []);

  const value = {
    location,
    errorMsg,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}
