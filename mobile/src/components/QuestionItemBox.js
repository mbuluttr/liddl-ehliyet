import React, { PureComponent } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { ImageObjectParser } from "../scripts/ImageObjectParser";
import { colors } from "../theme/colors";
import { sizes } from "../theme/sizes";

class QuestionItemBox extends PureComponent {
  render() {
    return (
      <View style={styles.questionItemBox}>
        {this.props.data.map((e, index) => {
          if (e.startsWith("ITEM_")) {
            return (
              <Text key={index} style={styles.questionItemText}>
                {e.replace("ITEM_", "")}
              </Text>
            );
          } else if (e.startsWith("IMG_")) {
            const image_data = ImageObjectParser(e);

            if (image_data.width > wp("80%")) {
              image_data.height = image_data.height * 0.8;
              image_data.width = "100%";
            }

            if (image_data.width < wp("30%")) {
              image_data.height = image_data.height * 1.4;
              image_data.width = image_data.width * 1.4;
            }

            return (
              <Image
                key={index}
                source={{ uri: image_data.url }}
                resizeMode="contain"
                style={{ height: image_data.height, width: image_data.width }}
              />
            );
          } else {
            return (
              <Text key={index} style={styles.questionText}>
                {e.replace("SORU_", "")}
              </Text>
            );
          }
        })}
      </View>
    );
  }
}

export default QuestionItemBox;

const styles = StyleSheet.create({
  questionItemBox: {
    width: wp("90%"),
    borderWidth: sizes.wiki * 2,
    borderRadius: sizes.wiki * 5,
    borderColor: colors.primary,
    backgroundColor: "white",
    marginVertical: sizes.hiki * 5,
    padding: sizes.hiki * 5,
    elevation: 5,
  },

  questionItemText: {
    color: "black",
    fontFamily: "Poppins",
    marginVertical: sizes.hiki,
    fontSize: sizes.hiki * 8.5,
  },

  questionText: {
    color: "black",
    fontFamily: "Poppins-Medium",
    marginVertical: sizes.hiki,
    fontSize: sizes.hiki * 8.5,
  },
});
