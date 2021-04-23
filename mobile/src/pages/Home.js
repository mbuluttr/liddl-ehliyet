import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import MenuItemBox from "../components/MenuItemBox";
import Navbar from "../components/Navbar";
import { useDispatch } from "react-redux";
import { clearAllStates } from "../redux/slice/examSlice";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = () => {
  const [questionCountFromStore, setQuestionCountFromStore] = useState(null);

  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isFocused) {
      dispatch(clearAllStates());
      getData();
    }
  }, [isFocused, dispatch]);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("@questionCount");
      if (value !== null) {
        setQuestionCountFromStore(value);
      } else {
        setQuestionCountFromStore("25");
      }
    } catch (e) {
      console.log("Home getData useEffect");
    }
  };

  // const clearAll = async () => {
  //   try {
  //     await AsyncStorage.clear();
  //   } catch (e) {
  //     // clear error
  //   }

  //   console.log("Done.");
  // };

  // clearAll();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Navbar title={"Hoş geldiniz"} home />
        <MenuItemBox
          imagePath={require("../assets/images/50_default_exam.png")}
          title={`${questionCountFromStore} soruluk deneme sınavı`}
          route={"Default Exam"}
          questionCount={questionCountFromStore}
        />
        <MenuItemBox
          imagePath={require("../assets/images/50_image_exam.png")}
          title={`${questionCountFromStore} resimli deneme sınavı`}
          route={"Image Exam"}
          questionCount={questionCountFromStore}
        />
        <MenuItemBox
          imagePath={require("../assets/images/50_option_exam.png")}
          title={`${questionCountFromStore} soruluk çoktan seçmeli deneme sınavı`}
          route={"Multiple Option Exam"}
          questionCount={questionCountFromStore}
        />
        <MenuItemBox
          imagePath={require("../assets/images/wrong_answer.png")}
          title={"Yanlış çözdükleriniz"}
          route={"Wrong Answers"}
          questionCount={questionCountFromStore}
        />
        <MenuItemBox
          imagePath={require("../assets/images/traffic_sign.png")}
          title={"Trafik işaretleri"}
          route={"Traffic Signs"}
        />
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
  scrollView: {
    paddingBottom: 100,
  },
});
