import Text from "@/components/general/Text";
import { DEFAULT_LOCATION } from "@/constants/location";
import { useTheme } from "@/hooks/useTheme";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { LeafletView } from "react-native-leaflet-view";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useLocation } from "@/context/locationContext";
import { useEffect, useState } from "react";
import { useCalmSpots } from "@/context/calmSpotsContext";
import { useDispatch } from "react-redux";
import { showAlert } from "@/redux/states/alerts";
import { CalmSpot } from "@/types/calmSpot";

const CalmSpotsMap = () => {
  const theme = useTheme();
  const { location } = useLocation();
  const {
    calmSpots,
    selectedCalmSpot,
    selectRandomCalmSpot,
    getNearbyCalmSpots,
  } = useCalmSpots();
  const [centerPosition, setCenterPosition] = useState(DEFAULT_LOCATION);
  const dispatch = useDispatch();

  useEffect(() => {
    getNearbyCalmSpots(DEFAULT_LOCATION);
  }, [location]);

  useEffect(() => {
    if (selectedCalmSpot === null) {
      return;
    }
    setCenterPosition({
      lat: selectedCalmSpot.lat,
      lng: selectedCalmSpot.lng,
    });
  }, [selectedCalmSpot]);

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1, padding: 16, gap: 16 }}
    >
      <View style={styles.mapContainer}>
        <LeafletView
          mapCenterPosition={centerPosition}
          zoom={13}
          doDebug={false}
          onMessageReceived={() => {}}
          onError={() => {
            dispatch(
              showAlert({
                text: "An error occured when showing the map",
                type: "error",
              })
            );
          }}
          mapMarkers={(calmSpots ?? []).map((calmSpot: CalmSpot) => ({
            icon: calmSpot.icon,
            title: calmSpot.description,
            iconSize: [32, 32],
            position: {
              lat: calmSpot.lat,
              lng: calmSpot.lng,
            },
          }))}
        />
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.button, { backgroundColor: theme.surface }]}
        onPress={selectRandomCalmSpot}
      >
        <Text style={[styles.buttonText, { color: theme.secondary }]}>
          <FontAwesome name="map-marker" size={28} color={theme.secondary} />
          {"  "}
          Find another calm spot
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
    minHeight: 420,
  },
  buttonText: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
  },
  button: {
    width: "100%",
    paddingVertical: 10,
    borderRadius: 100,
    paddingHorizontal: 20,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 2,
  },
});

export default CalmSpotsMap;
