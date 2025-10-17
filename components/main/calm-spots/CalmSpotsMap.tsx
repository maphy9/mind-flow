import Text from "@/components/general/Text";
import { DEFAULT_LOCATION } from "@/constants/map";
import { useTheme } from "@/hooks/useTheme";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { LeafletView } from "react-native-leaflet-view";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const CalmSpotsMap = () => {
  const theme = useTheme();

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1, padding: 16, gap: 16 }}
    >
      <View style={styles.mapContainer}>
        <LeafletView
          mapCenterPosition={{
            lat: DEFAULT_LOCATION.latitude,
            lng: DEFAULT_LOCATION.longitude,
          }}
          zoom={13}
          mapMarkers={[
            {
              position: { lat: 51.7731091, lng: 19.3980023 },
              icon: "🌿",
              size: [32, 32],
              title: "Peaceful Park\nA quiet spot for meditation",
            },
            {
              position: { lat: 51.78, lng: 19.4 },
              icon: "🧘",
              size: [32, 32],
              title: "Yoga Studio\nMorning sessions available",
            },
            {
              position: { lat: 51.765, lng: 19.39 },
              icon: "🌳",
              size: [32, 32],
              title: "Forest Trail\nPerfect for mindful walks",
            },
          ]}
        />
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.button, { backgroundColor: theme.surface }]}
        onPress={() => {}}
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
