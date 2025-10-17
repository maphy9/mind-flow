export const kilometersToGCS = (km) => {
  const lat = km / 110.574;
  const lng = km / (111.32 * Math.cos(lat));

  return { lat, lng };
};
