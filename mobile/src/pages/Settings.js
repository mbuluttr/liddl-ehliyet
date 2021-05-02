import React, { useState, useEffect } from "react";
import { Image, StyleSheet, Text, TextInput, View, Keyboard, TouchableOpacity } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { colors } from "../theme/colors";
import { sizes } from "../theme/sizes";
import Navbar from "../components/Navbar";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AdMobBanner } from "react-native-admob";
import { env } from "../../environments";

const Settings = () => {
  const navigation = useNavigation();
  const [contentHeight, setContentHeight] = useState(hp("85%"));
  const [imageHeight, setImageHeight] = useState(hp("35%"));
  const [keyboardStatus, setKeyboardStatus] = useState(false);
  const [questionCount, setQuestionCount] = useState(null);
  const [error, setError] = useState(false);
  const [onlyNumberError, setOnlyNumberError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [valueFromStore, setValueFromStore] = useState(null);

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

    return () => {
      Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
      Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
    };
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem("@questionCount");
        if (value !== null) {
          setValueFromStore(value);
        } else {
          setValueFromStore("25");
        }
      } catch (e) {
        console.log("getData useEffect");
      }
    };
    getData();
  }, []);

  const _keyboardDidShow = (e) => {
    setKeyboardStatus(true);
    setContentHeight(hp("85%") - e.endCoordinates.height);
    setImageHeight(hp("30%"));
  };

  const _keyboardDidHide = () => {
    setKeyboardStatus(false);
    setContentHeight(hp("85%"));
    setImageHeight(hp("35%"));
  };

  const saveHandler = () => {
    const validate = /[^0-9]/g.test(questionCount);

    if (validate && questionCount !== null) {
      setOnlyNumberError(true);
    }

    if (!validate && questionCount) {
      setOnlyNumberError(false);
      const num = Number(questionCount);
      if (num < 10 || num > 50) {
        setError(true);
        setSuccess(false);
      } else {
        setError(false);
        setSuccess(true);
        storeData(questionCount);
      }
    }
  };

  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem("@questionCount", value);
    } catch (e) {
      // saving error
    }
  };

  return (
    <View style={styles.container}>
      <Navbar title={"Ayarlar"} noModal />
      <View style={[styles.wrongQuestionsEmptyContent, { height: contentHeight }]}>
        <View style={[styles.imageView, { height: imageHeight }]}>
          <Image source={require("../assets/images/settings.png")} resizeMode="contain" style={styles.image} />
        </View>

        <View>
          {keyboardStatus ? null : <Text style={styles.settingsTitle}>Sınavlarda ki soru adedi</Text>}
          <View style={styles.inputGroup}>
            <TextInput
              defaultValue={valueFromStore}
              style={styles.countInput}
              keyboardType="numeric"
              onChangeText={(e) => setQuestionCount(e)}
              maxLength={2}
            />
            <TouchableOpacity style={styles.saveButton} activeOpacity={0.7} onPress={() => saveHandler()}>
              <Text style={styles.buttonText}>Kaydet</Text>
            </TouchableOpacity>
          </View>
          {error ? <Text style={styles.inputError}>Soru adedi 10 ile 50 arasında olmalı</Text> : null}
          {success ? <Text style={styles.inputSuccess}>Soru adedi kayıt edildi</Text> : null}
          {onlyNumberError ? <Text style={styles.inputError}>Lütfen sadece sayı giriniz</Text> : null}
        </View>

        {keyboardStatus ? null : (
          <View>
            <TouchableOpacity style={styles.button} activeOpacity={0.7} onPress={() => navigation.navigate("Home")}>
              <Text style={styles.buttonText}>Ana Sayfa</Text>
            </TouchableOpacity>
            <View style={{ alignSelf: "center", marginTop: 15 }}>
              <AdMobBanner adSize="banner" adUnitID={env.SETTINGS_BANNER} onAdFailedToLoad={(e) => console.log(e)} />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
  wrongQuestionsEmptyContent: {
    width: wp("90%"),
    backgroundColor: "white",
    padding: sizes.hiki * 15,
    borderWidth: sizes.wiki * 2,
    borderRadius: sizes.wiki * 5,
    borderColor: colors.primary,
    justifyContent: "space-between",
    elevation: 5,
  },
  imageView: { width: wp("75%"), alignSelf: "center" },
  image: { width: "100%", height: "100%" },

  countInput: {
    backgroundColor: colors.smokewhite,
    borderWidth: sizes.wiki * 2,
    borderRadius: sizes.wiki * 5,
    borderColor: colors.primary,
    paddingHorizontal: sizes.wiki * 10,
    fontFamily: "Poppins",
    fontSize: sizes.hiki * 8.5,
    width: wp("35%"),
    height: hp("7%"),
    paddingBottom: 5,
    textAlignVertical: "center",
  },

  button: {
    backgroundColor: colors.positive,
    borderRadius: sizes.hiki * 5,
    height: hp("7%"),
    width: wp("50%"),
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: sizes.wiki * 5,
    alignSelf: "center",
    marginTop: sizes.hiki * 10,
  },

  buttonText: {
    color: colors.smokewhite,
    fontSize: sizes.hiki * 10,
    fontFamily: "Poppins-Medium",
  },

  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: sizes.hiki * 5,
    height: hp("7%"),
    width: wp("35%"),
    justifyContent: "center",
    alignItems: "center",
  },

  settingsTitle: {
    fontFamily: "Poppins",
    fontSize: sizes.hiki * 12,
    alignSelf: "center",
    textAlign: "center",
    color: colors.disabled,
    marginBottom: sizes.hiki * 10,
  },

  inputError: {
    fontFamily: "Poppins",
    fontSize: sizes.hiki * 8,
    color: colors.negative,
    marginTop: sizes.hiki * 2,
  },

  inputSuccess: {
    fontFamily: "Poppins",
    fontSize: sizes.hiki * 8,
    color: colors.positive,
    marginTop: sizes.hiki * 2,
  },

  inputGroup: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
});
