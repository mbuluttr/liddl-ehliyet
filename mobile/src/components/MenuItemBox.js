import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { colors } from "../theme/colors";
import { sizes } from "../theme/sizes";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

const MenuItemBox = ({ title, imagePath, route, questionCount }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.itemBox}
      activeOpacity={0.7}
      onPress={() =>
        navigation.navigate(route, {
          questionCount: questionCount,
        })
      }
    >
      <View style={styles.imageView}>
        <Image source={imagePath} resizeMode="contain" style={styles.image} />
      </View>
      <View style={styles.titleView}>
        <Text style={styles.text}>{title}</Text>
      </View>
      <View style={styles.iconView}>
        <Ionicons name="arrow-forward" size={sizes.hiki * 18} color={colors.smokewhite} style={styles.icon} />
      </View>
    </TouchableOpacity>
  );
};

export default MenuItemBox;

const styles = StyleSheet.create({
  itemBox: {
    width: wp("90%"),
    height: hp("20%"),
    flexDirection: "row",
    borderWidth: sizes.wiki * 2,
    borderRadius: sizes.wiki * 5,
    borderColor: colors.primary,
    backgroundColor: "white",
    marginVertical: sizes.hiki * 5,
    elevation: 5,
  },
  imageView: {
    width: wp("30%"),
    alignItems: "center",
    justifyContent: "center",
    padding: sizes.hiki * 2.5,
  },
  image: { width: "100%", height: "100%" },

  titleView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    textAlign: "center",
    padding: sizes.hiki * 5,
    fontSize: sizes.hiki * 10,
    fontFamily: "Poppins",
  },
  iconView: {
    width: wp("15%"),
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  icon: {
    width: wp("15%"),
    height: hp("5%"),
    backgroundColor: colors.primary,
    borderTopLeftRadius: sizes.wiki * 5,
    textAlign: "center",
    textAlignVertical: "center",
  },
});
