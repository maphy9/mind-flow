import React from "react";
import { LocationProvider } from "@/context/locationContext";
import CalmSpotsMap from "@/components/main/calm-spots/CalmSpotsMap";
import { CalmSpotsProvider } from "@/context/calmSpotsContext";

const CalmSpots = () => {
  return (
    <LocationProvider>
      <CalmSpotsProvider>
        <CalmSpotsMap />
      </CalmSpotsProvider>
    </LocationProvider>
  );
};

export default CalmSpots;
