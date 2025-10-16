import { StyleSheet, View } from "react-native";
import { LeafletView } from "react-native-leaflet-view";

const DEFAULT_LOCATION = {
  latitude: 51.7731091,
  longitude: 19.3980023,
};

const CalmSpotsMap = () => {
  return (
    <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  mapContainer: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
  },
});

export default CalmSpotsMap;
