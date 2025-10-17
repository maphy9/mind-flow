import { DEFAULT_DISTANCE } from "@/constants/location";
import { CalmSpot } from "@/types/calmSpot";
import { kilometersToGCS } from "@/utils/location";
import {
  query,
  where,
  collection,
  getFirestore,
} from "@react-native-firebase/firestore";
import { createContext, useContext, useState } from "react";

export const CalmSpotsContext = createContext(null);

export function useCalmSpots() {
  return useContext(CalmSpotsContext);
}

export const CalmSpotsProvider = ({ children }) => {
  const [calmSpots, setCalmSpots] = useState(null);

  const getNearbyCalmSpots = async (location, distance = DEFAULT_DISTANCE) => {
    const { lat: dLat, lng: dLng } = kilometersToGCS(distance);

    const calmSpotsRef = await collection(getFirestore(), "calm-spots");

    const q = query(
      calmSpotsRef,
      where("lat", "<=", location.lat + dLat),
      where("lat", ">=", location.lat - dLat),
      where("lng", "<=", location.lng + dLng),
      where("lng", ">=", location.lng - dLng)
    );

    const result = (await q.get()).docs.map((doc) => doc.data());
    setCalmSpots(result);
  };

  const value = {
    calmSpots,
    getNearbyCalmSpots,
  };

  return (
    <CalmSpotsContext.Provider value={value}>
      {children}
    </CalmSpotsContext.Provider>
  );
};
