import CalmSpots from "@/app/(main)/calm-spots";

export interface CalmSpot {
  description: string;
  icon: string;
  lat: number;
  lng: number;
}

export const calmSpotEquals = (cs1: CalmSpot | null, cs2: CalmSpot | null) => {
  if (cs1 === null || cs2 === null) {
    return false;
  }
  for (const key in cs1) {
    const v1 = cs1[key];
    const v2 = cs2[key];
    if (v1 !== v2) {
      return false;
    }
  }
  return true;
};
