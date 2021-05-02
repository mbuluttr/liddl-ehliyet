import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { colors } from "../theme/colors";
import { sizes } from "../theme/sizes";
import Divider from "./Divider";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { AdMobBanner } from "react-native-admob";
import { env } from "../../environments";

const ResultBox = ({ examLength, correctCount, wrongCount }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.modalContent}>
      <View style={styles.imageView}>
        <Image source={require("../assets/images/result.png")} resizeMode="contain" style={styles.image} />
      </View>
      <View style={styles.infoView}>
        <Text style={styles.infoText}>{examLength} soru arasından</Text>
        <Divider width={wp("45%")} height={2} mv={10} />
        <View style={styles.countView}>
          <Text style={styles.infoText}>{correctCount} Doğru</Text>
          <Ionicons name="checkmark-sharp" size={sizes.hiki * 20} color={colors.positive} />
        </View>
        <View style={styles.countView}>
          <Text style={styles.infoText}>{wrongCount} Yanlış</Text>
          <Ionicons name="close-sharp" size={sizes.hiki * 20} color={colors.negative} />
        </View>
        <Divider width={wp("45%")} height={2} mv={10} />
        <TouchableOpacity style={styles.button} activeOpacity={0.7} onPress={() => navigation.navigate("Home")}>
          <Text style={styles.buttonText}>Ana Sayfa</Text>
        </TouchableOpacity>
      </View>
      <View style={{ alignSelf: "center", marginTop: 15 }}>
        <AdMobBanner adSize="banner" adUnitID={env.RESULT_BANNER} onAdFailedToLoad={(e) => console.log(e)} />
      </View>
    </View>
  );
};

export default ResultBox;

const styles = StyleSheet.create({
  modalContent: {
    width: wp("90%"),
    height: hp("85%"),
    backgroundColor: "white",
    padding: sizes.hiki * 15,
    borderWidth: sizes.wiki * 2,
    borderRadius: sizes.wiki * 5,
    borderColor: colors.primary,
    elevation: 5,
    alignItems: "center",
    justifyContent: "space-between",
  },

  imageView: {
    width: wp("75%"),
    height: hp("25%"),
  },
  image: { width: "100%", height: "100%" },

  infoView: {
    flex: 1,
    width: wp("75%"),
    marginTop: sizes.hiki * 25,
  },

  infoText: {
    fontFamily: "Poppins",
    fontSize: sizes.hiki * 12,
    textAlign: "center",
  },

  countView: {
    flexDirection: "row",
    width: "50%",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "center",
  },

  button: {
    backgroundColor: colors.positive,
    borderRadius: sizes.hiki * 5,
    height: hp("7%"),
    width: wp("50%"),
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: sizes.hiki * 10,
  },

  buttonText: {
    color: colors.smokewhite,
    fontSize: sizes.hiki * 10,
    fontFamily: "Poppins-Medium",
  },
});
