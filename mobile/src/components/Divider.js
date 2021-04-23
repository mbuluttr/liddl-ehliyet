import React from "react";
import { StyleSheet, View } from "react-native";
import { colors } from "../theme/colors";

const Divider = ({ width, height, mv }) => {
  return <View style={[styles.divider, { width: width, height: height, marginVertical: mv }]} />;
};

export default Divider;

const styles = StyleSheet.create({
  divider: {
    backgroundColor: colors.smokewhite,
    alignSelf: "center",
  },
});
