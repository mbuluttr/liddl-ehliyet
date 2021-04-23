import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import Ionicons from "react-native-vector-icons/Ionicons";
import { sizes } from "../theme/sizes";
import { colors } from "../theme/colors";
import { useNavigation } from "@react-navigation/native";
import MessageModal from "./MessageModal";

const Navbar = ({ title, home, noModal, withReport, reportHandler, questionID }) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const routeModal = () => {
    setModalVisible(!modalVisible);
    navigation.navigate("Home");
  };

  const reportModalToggle = () => {
    setReportModalVisible(!reportModalVisible);
  };

  const reportModalAction = (report) => {
    if (report.length) {
      reportHandler(questionID, report);
      setReportModalVisible(!reportModalVisible);
    }
  };

  return (
    <View
      style={
        home ? [styles.navView, { justifyContent: "space-between" }] : [styles.navView, { justifyContent: "center" }]
      }
    >
      <Text style={styles.navText}>{title}</Text>

      <MessageModal
        buttonNegativeText={"Hayır"}
        buttonPositiveText={"Evet"}
        isModalVisible={modalVisible}
        modalToggleHandler={toggleModal}
        modalRouteHandler={routeModal}
        message={"Ana sayfaya dönmek istediğinize emin misiniz?"}
      />

      <MessageModal
        buttonNegativeText={"İptal"}
        buttonPositiveText={"Gönder"}
        isModalVisible={reportModalVisible}
        modalToggleHandler={reportModalToggle}
        modalRouteHandler={(report) => reportModalAction(report)}
        withReport
      />

      {home ? (
        <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate("Settings")}>
          <Ionicons name="options-outline" size={sizes.hiki * 20} color={colors.primary} />
        </TouchableOpacity>
      ) : noModal ? (
        <TouchableOpacity activeOpacity={0.7} style={styles.icon} onPress={() => navigation.navigate("Home")}>
          <Ionicons name="arrow-back" size={sizes.hiki * 20} color={colors.primary} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity activeOpacity={0.7} style={styles.icon} onPress={() => toggleModal()}>
          <Ionicons name="arrow-back" size={sizes.hiki * 20} color={colors.primary} />
        </TouchableOpacity>
      )}
      {withReport ? (
        <TouchableOpacity activeOpacity={0.7} style={styles.reportIcon} onPress={() => reportModalToggle()}>
          <Ionicons name="warning-outline" size={sizes.hiki * 20} color={colors.primary} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default Navbar;

const styles = StyleSheet.create({
  navView: {
    width: wp("90%"),
    height: hp("7%"),
    flexDirection: "row",
    borderWidth: sizes.wiki * 2,
    borderRadius: sizes.wiki * 5,
    borderColor: colors.primary,
    backgroundColor: "white",
    marginVertical: sizes.hiki * 5,
    alignItems: "center",
    paddingHorizontal: sizes.wiki * 5,
    elevation: 5,
  },
  navText: {
    fontSize: sizes.hiki * 10,
    fontFamily: "Poppins",
  },

  icon: { position: "absolute", left: sizes.hiki * 5 },
  reportIcon: { position: "absolute", right: sizes.hiki * 5 },
});
