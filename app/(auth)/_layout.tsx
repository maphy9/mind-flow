import { ScrollView } from "react-native";
import React from "react";
import Header from "@/components/auth/Header";
import { Slot } from "expo-router";

const _layout = () => {
  return (
    <ScrollView
      style={{
        flex: 1,
      }}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <Header />

      <Slot />
    </ScrollView>
  );
};

export default _layout;
