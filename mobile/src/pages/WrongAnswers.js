import React, { useState, useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import Navbar from "../components/Navbar";
import WrongAnswersEmpty from "../components/WrongAnswersEmpty";
import WrongAnswersExam from "./WrongAnswersExam";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { GET_WRONG_QUESTIONS_FROM_DB } from "../graphql/queries";
import { useQuery } from "@apollo/client";
import { colors } from "../theme/colors";

const WrongAnswers = ({ route }) => {
  const [dataFromStorage, setDataFromStorage] = useState(null);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  const { data } = useQuery(GET_WRONG_QUESTIONS_FROM_DB, {
    variables: {
      data: route.params.questionCount,
      arr: dataFromStorage,
    },
    onCompleted() {
      setLoading(false);
      if (data.getWrongQuestionsFromDB.length === 0) {
        removeWrongQuestionIds();
      }
    },
  });

  const removeWrongQuestionIds = async () => {
    try {
      await AsyncStorage.removeItem("@wrongQuestionIds");
    } catch (e) {
      console.log("removeWrongQuestionIds | catch");
    }
  };

  useEffect(() => {
    const getDataFromStorage = async () => {
      try {
        const questionIdsFromStore = await AsyncStorage.getItem("@wrongQuestionIds");
        const ids = JSON.parse(questionIdsFromStore);
        if (ids !== null) {
          setDataFromStorage(ids);
        } else {
          setDataFromStorage([]);
        }
      } catch (e) {
        console.log("wrongAnswers getDatafromStorage useEffect Error, ", e);
      }
    };
    if (isFocused) {
      getDataFromStorage();
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      {loading ? <Navbar title={"Lütfen Bekleyiniz"} /> : null}
      {loading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size={75} color={colors.primary} />
        </View>
      ) : data.getWrongQuestionsFromDB.length ? (
        <WrongAnswersExam data={data} />
      ) : (
        <View>
          <Navbar title={"Yanlış Çözdükleriniz"} noModal />
          <WrongAnswersEmpty />
        </View>
      )}
    </View>
  );
};

export default WrongAnswers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
});
