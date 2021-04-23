import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from "react-native";
import Modal from "react-native-modal";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { colors } from "../theme/colors";
import { sizes } from "../theme/sizes";
import Divider from "./Divider";

const MessageModal = ({
  message,
  buttonNegativeText,
  buttonPositiveText,
  isModalVisible,
  modalToggleHandler,
  modalRouteHandler,
  withReport,
}) => {
  const [report, setReport] = useState("");
  const [emptyReport, setEmptyReport] = useState(false);

  return (
    <Modal
      isVisible={isModalVisible}
      backdropColor={colors.primary}
      backdropOpacity={0.8}
      onBackdropPress={() => modalToggleHandler()}
      animationIn="zoomInDown"
      animationOut="zoomOutUp"
      animationInTiming={500}
      backdropTransitionInTiming={500}
    >
      <View style={styles.modalContent}>
        <Divider width={wp("45%")} height={2} mv={10} />
        <View style={styles.infoView}>
          {withReport ? (
            <View style={{ alignItems: "center" }}>
              <Text style={styles.reportTextInputHeader}>Eksik veya hatalı soru bildir</Text>
              <TextInput
                multiline
                defaultValue={report}
                numberOfLines={3}
                maxLength={120}
                onChangeText={(e) => setReport(e)}
                textAlignVertical="top"
                placeholder={"Soru da tespit ettiğiniz eksiklikten kısaca bahsediniz.."}
                placeholderTextColor={colors.disabled}
                style={styles.inputView}
              />
              {emptyReport ? <Text style={styles.reportEmptyText}>Bu alan boş bırakılamaz!</Text> : null}
            </View>
          ) : (
            <Text style={styles.infoText}>{message}</Text>
          )}
        </View>
        <Divider width={wp("45%")} height={2} mv={10} />

        <View style={styles.buttonView}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.negative }]}
            activeOpacity={0.7}
            onPress={() => modalToggleHandler()}
          >
            <Text style={styles.buttonText}>{buttonNegativeText}</Text>
          </TouchableOpacity>
          {withReport ? (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.positive }]}
              activeOpacity={0.7}
              onPress={() => {
                if (report.length) {
                  modalRouteHandler(report);
                  setEmptyReport(!emptyReport);
                } else {
                  setEmptyReport(!emptyReport);
                }
              }}
            >
              <Text style={styles.buttonText}>{buttonPositiveText}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.positive }]}
              activeOpacity={0.7}
              onPress={() => modalRouteHandler()}
            >
              <Text style={styles.buttonText}>{buttonPositiveText}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default MessageModal;

const styles = StyleSheet.create({
  modalContent: {
    width: wp("90%"),
    backgroundColor: "white",
    padding: sizes.hiki * 15,
    borderWidth: sizes.wiki * 2,
    borderRadius: sizes.wiki * 5,
    borderColor: colors.primary,
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
  },

  infoText: {
    fontFamily: "Poppins",
    fontSize: sizes.hiki * 12,
    textAlign: "center",
  },

  buttonView: {
    flexDirection: "row",
    width: wp("80%"),
    justifyContent: "space-between",
    alignSelf: "center",
  },

  button: {
    backgroundColor: colors.negative,
    borderRadius: sizes.hiki * 5,
    height: hp("7%"),
    width: wp("35%"),
    justifyContent: "center",
    alignItems: "center",
    marginTop: sizes.hiki * 10,
  },

  buttonText: {
    color: colors.smokewhite,
    fontFamily: "Poppins-Medium",
    fontSize: sizes.hiki * 8.5,
  },

  inputView: {
    height: hp("20%"),
    width: wp("75%"),
    borderWidth: sizes.wiki * 2,
    borderRadius: sizes.wiki * 5,
    borderColor: colors.primary,
    backgroundColor: "white",
    elevation: 5,
    fontSize: sizes.hiki * 8.5,
    padding: 10,
  },
  reportTextInputHeader: {
    marginBottom: sizes.hiki * 5,
    fontFamily: "Poppins",
    fontSize: sizes.hiki * 10,
    textAlign: "center",
    color: colors.disabled,
  },
  reportEmptyText: {
    marginTop: sizes.hiki * 5,
    fontFamily: "Poppins",
    fontSize: sizes.hiki * 7,
    paddingLeft: 10,
    color: colors.negative,
  },
});
