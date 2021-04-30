import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { colors } from "../theme/colors";
import { sizes } from "../theme/sizes";
import Navbar from "./Navbar";

const Loading = ({ connection }) => {
  return (
    <View>
      <Navbar title={"Lütfen Bekleyiniz"} />
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size={75} color={colors.primary} />
        {!connection ? (
          <View style={styles.infoView}>
            <Text style={styles.infoText}>Internet bağlantısı bulunamadı.</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  infoView: {
    width: wp("75%"),
    marginTop: sizes.hiki * 25,
    justifyContent: "flex-start",
  },

  infoText: {
    fontFamily: "Poppins",
    fontSize: sizes.hiki * 12,
    textAlign: "center",
    color: colors.disabled,
    marginVertical: sizes.hiki * 20,
    backgroundColor: colors.smokewhite,
    paddingVertical: sizes.hiki * 20,
    paddingHorizontal: sizes.wiki * 10,
    borderRadius: sizes.wiki * 10,
  },
});
