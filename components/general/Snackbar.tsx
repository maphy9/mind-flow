import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Snackbar as _Snackbar } from "react-native-paper";
import { removeAlert } from "@/redux/states/alerts";
import { StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import Text from "./Text";

const Snackbar = () => {
  const { alerts } = useSelector((root: RootState) => root.alerts);
  const dispatch = useDispatch();
  const onDismissSnackBar = () => {
    dispatch(removeAlert());
  };
  const theme = useTheme();

  const backgroundColor =
    alerts[0]?.type === "info" ? theme.surface : theme.red;
  const fontColor = alerts[0]?.type === "info" ? theme.secondary : "#FFFFFF";

  const style = StyleSheet.create({
    snackbar: {
      backgroundColor,
    },
  });

  return (
    <_Snackbar
      visible={alerts.length > 0}
      onDismiss={onDismissSnackBar}
      action={{
        label: "Close",
        onPress: onDismissSnackBar,
        labelStyle: { color: fontColor },
      }}
      duration={5000}
      style={style.snackbar}
    >
      <Text style={{ color: fontColor }}>
        {alerts.length > 0 ? alerts[0].text : ""}
      </Text>
    </_Snackbar>
  );
};

export default Snackbar;
