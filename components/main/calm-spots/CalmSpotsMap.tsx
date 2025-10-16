import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { useLocation } from "@/context/locationContext";

const CalmSpotsMap = () => {
  const { location } = useLocation();

  useEffect(() => {
    console.log(location?.coords);
  }, [location]);

  return (
    <View>
      <Text>CalmSpotsMap</Text>
    </View>
  );
};

export default CalmSpotsMap;
