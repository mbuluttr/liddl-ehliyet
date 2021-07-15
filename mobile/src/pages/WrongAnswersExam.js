import React, { useState, useEffect, useCallback } from "react";
import QuestionItemBox from "../components/QuestionItemBox";
import AnswerItemBox from "../components/AnswerItemBox";
import BottomButtonGroupView from "../components/BottomButtonGroup";
import MessageModal from "../components/MessageModal";
import Navbar from "../components/Navbar";
import { StyleSheet, View, ScrollView, ToastAndroid, BackHandler } from "react-native";
import { useMutation } from "@apollo/client";
import { CREATE_REPORT } from "../graphql/queries";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { setSelected } from "../redux/slice/examSlice";
import { AdMobInterstitial } from "react-native-admob";
import { env } from "../../environments";

const WrongAnswersExam = ({ data }) => {
  const [exitCount, setExitCount] = useState(0);
  const [index, setIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [createReport] = useMutation(CREATE_REPORT);

  const modalToggleHandler = () => {
    setModalVisible(!modalVisible);
  };

  const modalRouteHandler = () => {
    setModalVisible(!modalVisible);
    navigation.navigate("Exam Result");
  };

  const getInterstitialAd = (id) => {
    AdMobInterstitial.setAdUnitID(id);
    AdMobInterstitial.addEventListener("adLoaded", () => {
      console.log("interstitial loaded success");
    });
    AdMobInterstitial.requestAd()
      .then(() => {
        console.log("interstitial request success");
      })
      .catch((e) => {
        console.log(e.message, "catch | requestAd");
      });
  };

  useEffect(() => {
    return () => {
      AdMobInterstitial.removeAllListeners();
    };
  }, []);

  const nextHandler = () => {
    setIndex(index + 1);

    const firstAd = Math.trunc(data.getWrongQuestionsFromDB.length / 2);
    const finalAd = data.getWrongQuestionsFromDB.length - 1;

    if (index === 0 || (finalAd > 8 && index === firstAd)) {
      getInterstitialAd(env.INTERSTITIAL);
    }

    if (index + 1 === firstAd || (finalAd > 8 && index + 1 === finalAd)) {
      AdMobInterstitial.showAd()
        .then(() => {
          console.log("ad show correctly");
          AdMobInterstitial.removeAllListeners();
        })
        .catch((e) => console.log(e.message, "catch | showAd"));
    }
  };

  const backHandler = () => {
    setIndex(index - 1);
  };

  const exitToast = () => {
    ToastAndroid.show("Sınavdan çıkmak için iki kez daha dokunun", ToastAndroid.SHORT);
  };

  const reportToast = () => {
    ToastAndroid.show(
      "Teşekkürer! Bu soruyu dikkate almadan devam edin. En kısa sürede düzeltilecektir.",
      ToastAndroid.LONG
    );
  };

  const handleBackButtonClick = useCallback(() => {
    if (exitCount === 0) {
      exitToast();
      setExitCount(exitCount + 1);
    } else {
      setExitCount(exitCount + 1);
      if (exitCount === 2) {
        navigation.navigate("Home");
      }
    }
    return true;
  }, [exitCount, navigation]);

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
    };
  }, [handleBackButtonClick]);

  const reportHandler = async (questionID, report) => {
    const question = data.getWrongQuestionsFromDB.find((el) => el._id === questionID);
    dispatch(setSelected({ id: question._id, answer: question.correct_answer, correct: question.correct_answer }));
    reportToast();

    try {
      await createReport({
        variables: {
          question_id: questionID,
          report: report,
        },
      });
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <View style={styles.container}>
      <View key={data.getWrongQuestionsFromDB[index]._id} style={{ alignItems: "center" }}>
        <MessageModal
          buttonNegativeText={"İptal"}
          buttonPositiveText={"Tamam"}
          isModalVisible={modalVisible}
          modalToggleHandler={modalToggleHandler}
          modalRouteHandler={modalRouteHandler}
          message={"Sınavı bitirmek istediğinize emin misiniz?"}
        />
        <Navbar
          title={`${index + 1}. Soru`}
          reportHandler={(questionID, report) => reportHandler(questionID, report)}
          withReport
          questionID={data.getWrongQuestionsFromDB[index]._id}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ marginBottom: hp("10%"), marginHorizontal: wp("5%") }}
          contentContainerStyle={{ paddingBottom: 50 }}
        >
          <QuestionItemBox data={data.getWrongQuestionsFromDB[index].question} />
          <AnswerItemBox
            answers={data.getWrongQuestionsFromDB[index].answer}
            question_id={data.getWrongQuestionsFromDB[index]._id}
            correct_answer={data.getWrongQuestionsFromDB[index].correct_answer}
          />
        </ScrollView>
        <BottomButtonGroupView
          backHandler={backHandler}
          nextHandler={nextHandler}
          currentIndex={index}
          dataLength={data.getWrongQuestionsFromDB.length}
          modalToggleHandler={modalToggleHandler}
        />
      </View>
    </View>
  );
};
export default WrongAnswersExam;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
});
