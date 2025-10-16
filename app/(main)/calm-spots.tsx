import React from "react";
import { LocationProvider } from "@/context/locationContext";
import CalmSpotsMap from "@/components/main/calm-spots/CalmSpotsMap";

const CalmSpots = () => {
  return (
    <LocationProvider>
      <CalmSpotsMap />
    </LocationProvider>
  );
};

export default CalmSpots;
