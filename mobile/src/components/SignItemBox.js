import React, { PureComponent } from "react";
import { StyleSheet, Text, View } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { colors } from "../theme/colors";
import { sizes } from "../theme/sizes";
import FastImage from "react-native-fast-image";

class SignItemBox extends PureComponent {
  render() {
    return (
      <View>
        <View style={styles.itemBox}>
          <FastImage
            style={styles.image}
            source={{
              uri: this.props.uri,
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>
        <Text style={styles.imageText}>{this.props.title}</Text>
      </View>
    );
  }
}

export default SignItemBox;

const styles = StyleSheet.create({
  itemBox: {
    width: wp("43%"),
    height: wp("43%"),
    marginVertical: wp("2%"),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: sizes.wiki * 2,
    borderRadius: sizes.wiki * 5,
    borderColor: colors.primary,
    backgroundColor: "white",
    padding: sizes.hiki * 5,
    elevation: 5,
  },

  image: { width: "100%", height: "100%" },
  imageText: { width: wp("43%"), textAlign: "center", fontFamily: "Poppins", fontSize: sizes.hiki * 8.5 },
});
