import React, { useEffect, useCallback } from "react";
import { StyleSheet, View, BackHandler } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCorrectCount,
  selectWrongCount,
  calculateExamResult,
  selectWrongQuestionIds,
  selectExamLength,
  selectCorrectQuestionIds,
} from "../redux/slice/examSlice";
import Navbar from "../components/Navbar";
import ResultBox from "../components/ResultBox";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ExamResult = () => {
  const dispatch = useDispatch();
  const examLength = useSelector(selectExamLength);
  const correctCount = useSelector(selectCorrectCount);
  const wrongCount = useSelector(selectWrongCount);
  const wrongQuestionIds = useSelector(selectWrongQuestionIds);
  const correctQuestionIds = useSelector(selectCorrectQuestionIds);

  useEffect(() => {
    dispatch(calculateExamResult());
  }, [dispatch]);

  const handleBackButtonClick = useCallback(() => {
    return true;
  }, []);

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
    };
  }, [handleBackButtonClick]);

  useEffect(() => {
    const prepareIdsForStore = async (wrong, correct) => {
      try {
        let dataFromStore = await AsyncStorage.getItem("@wrongQuestionIds");
        if (dataFromStore !== null) {
          dataFromStore = JSON.parse(dataFromStore);
          if (wrong.length) {
            wrong.forEach((item) => {
              const exists = dataFromStore.includes(item);
              // Yanlış sorular arasında olmayan soru diziye pushlanır
              if (!exists) {
                dataFromStore.push(item);
              }
            });
          }
          if (correct.length) {
            correct.forEach((item) => {
              const exists = dataFromStore.includes(item);
              // Doğru sorular diziden çıkarılır
              if (exists) {
                dataFromStore = dataFromStore.filter((element) => item !== element);
              }
            });
          }
          const changedStore = JSON.stringify(dataFromStore);
          await AsyncStorage.setItem("@wrongQuestionIds", changedStore);
        } else {
          // Store oluşturulmamış ise
          const newValue = JSON.stringify(wrong);
          await AsyncStorage.setItem("@wrongQuestionIds", newValue);
        }
      } catch (e) {
        console.log("useEffect prepareIdsForStore ERROR > ", e);
      }
    };
    prepareIdsForStore(wrongQuestionIds, correctQuestionIds);
  }, [wrongQuestionIds, correctQuestionIds]);

  return (
    <View style={styles.container}>
      <Navbar title={"Sınav Sonucunuz"} noModal />
      <ResultBox examLength={examLength} correctCount={correctCount} wrongCount={wrongCount} />
    </View>
  );
};

export default ExamResult;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
});
