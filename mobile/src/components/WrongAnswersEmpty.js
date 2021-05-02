import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { colors } from "../theme/colors";
import { sizes } from "../theme/sizes";
import Divider from "./Divider";
import { AdMobBanner } from "react-native-admob";
import { env } from "../../environments";

const WrongAnswersEmpty = () => {
  return (
    <View style={styles.wrongQuestionsEmptyContent}>
      <View style={styles.imageView}>
        <Image source={require("../assets/images/happy.png")} resizeMode="contain" style={styles.image} />
        <Divider width={wp("65")} height={5} mv={10} />
      </View>
      <View style={styles.infoView}>
        <Text style={styles.infoText}>Yanlış çözdüğünüz bir soru bulunamadı.</Text>
      </View>
      <View style={{ alignSelf: "center" }}>
        <AdMobBanner
          adSize="banner"
          adUnitID={env.WRONG_QUESTIONS_EMPTY_BANNER}
          onAdFailedToLoad={(e) => console.log(e)}
        />
      </View>
    </View>
  );
};

export default WrongAnswersEmpty;

const styles = StyleSheet.create({
  wrongQuestionsEmptyContent: {
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
    height: hp("35%"),
  },
  image: { width: "100%", height: "100%" },

  infoView: {
    flex: 1,
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
