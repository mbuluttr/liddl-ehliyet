import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { colors } from "../theme/colors";
import { sizes } from "../theme/sizes";
import { useSelector, useDispatch } from "react-redux";
import { selectSelected, setSelectedArray } from "../redux/slice/examSlice";

const BottomButtonGroupView = ({ currentIndex, dataLength, backHandler, nextHandler, modalToggleHandler }) => {
  const selected = useSelector(selectSelected);
  const selectedLength = Object.keys(selected).length;
  const dispatch = useDispatch();

  return (
    <View style={styles.bottomButtonGroupView}>
      {currentIndex > 0 ? (
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.7}
          onPress={() => {
            backHandler();
          }}
        >
          <Text style={styles.buttonText}>Geri</Text>
        </TouchableOpacity>
      ) : (
        <View style={{ width: wp("35%") }} />
      )}
      <Text style={styles.questionCountText}>
        {currentIndex + 1}/{dataLength}
      </Text>
      {currentIndex < dataLength - 1 ? (
        selectedLength ? (
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.7}
            onPress={() => {
              nextHandler();
              dispatch(setSelectedArray(selected));
            }}
          >
            <Text style={styles.buttonText}>İleri</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.button, { backgroundColor: colors.disabled }]} activeOpacity={0.7} disabled>
            <Text style={styles.buttonText}>İleri</Text>
          </TouchableOpacity>
        )
      ) : selectedLength ? (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.positive }]}
          activeOpacity={0.7}
          onPress={() => {
            dispatch(setSelectedArray(selected));
            modalToggleHandler();
          }}
        >
          <Text style={styles.buttonText}>Sınavı Bitir!</Text>
        </TouchableOpacity>
      ) : (
        <View style={{ width: wp("35%") }} />
      )}
    </View>
  );
};

export default BottomButtonGroupView;

const styles = StyleSheet.create({
  bottomButtonGroupView: {
    width: wp("90%"),
    alignItems: "center",
    height: hp("10%"),
    flexDirection: "row",
    borderTopWidth: sizes.wiki,
    borderTopColor: colors.smokewhite,
    marginHorizontal: wp("5%"),
    justifyContent: "space-between",
    position: "absolute",
    bottom: 0,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: sizes.hiki * 5,
    height: hp("7%"),
    width: wp("35%"),
    justifyContent: "center",
    alignItems: "center",
  },
  questionCountText: {
    fontSize: sizes.hiki * 9,
    color: colors.primaryDarker,
    fontFamily: "Poppins",
  },
  buttonText: {
    color: colors.smokewhite,
    fontFamily: "Poppins-Medium",
    fontSize: sizes.hiki * 8.5,
  },
});
