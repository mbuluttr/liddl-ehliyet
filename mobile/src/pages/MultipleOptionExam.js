import React, { useState, useEffect, useCallback } from "react";
import QuestionItemBox from "../components/QuestionItemBox";
import AnswerItemBox from "../components/AnswerItemBox";
import BottomButtonGroupView from "../components/BottomButtonGroup";
import MessageModal from "../components/MessageModal";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import { StyleSheet, View, ScrollView, BackHandler, ToastAndroid } from "react-native";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ITEM_EXISTS_QUESTIONS_FROM_DB, CREATE_REPORT } from "../graphql/queries";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { setSelected, selectConnection } from "../redux/slice/examSlice";
import { AdMobRewarded, AdMobInterstitial } from "react-native-admob";
import { env } from "../../environments";

const MultipleOptionExam = ({ route }) => {
  const [loading, setLoading] = useState(true);
  const [exitCount, setExitCount] = useState(0);
  const [index, setIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [dataLength, setDataLength] = useState(0);
  const [rewardedAdStatus, setRewardedAdStatus] = useState(false);
  const [interstitialAdStatus, setInterstitialAdStatus] = useState(false);
  const navigation = useNavigation();
  const connection = useSelector(selectConnection);
  const dispatch = useDispatch();

  const { data, refetch } = useQuery(GET_ITEM_EXISTS_QUESTIONS_FROM_DB, {
    variables: {
      data: route.params.questionCount,
    },
    onCompleted() {
      if (data.getItemExistsQuestionsFromDB.length) {
        setDataLength(data.getItemExistsQuestionsFromDB.length);
        setLoading(false);
      }
    },
  });

  const [createReport] = useMutation(CREATE_REPORT);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const modalToggleHandler = () => {
    setModalVisible(!modalVisible);
  };

  const modalRouteHandler = () => {
    setModalVisible(!modalVisible);
    navigation.navigate("Exam Result");
  };

  const nextHandler = () => {
    setIndex(index + 1);

    const firstAd = Math.trunc(dataLength / 2);
    const finalAd = dataLength - 1;

    if (index + 1 === finalAd) {
      if (rewardedAdStatus) {
        AdMobRewarded.showAd()
          .then(() => setRewardedAdStatus(false))
          .catch(() => setRewardedAdStatus(false));
      }
    }
    if (index + 1 === firstAd) {
      if (interstitialAdStatus) {
        AdMobInterstitial.showAd()
          .then(() => setInterstitialAdStatus(false))
          .catch(() => setInterstitialAdStatus(false));
      }
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
    if (!loading) {
      const question = data.getItemExistsQuestionsFromDB.find((el) => el._id === questionID);
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
    }
  };

  const getRewardedAd = () => {
    AdMobRewarded.setAdUnitID(env.MULTIPLE_OPTION_EXAM_REWARDED);
    AdMobRewarded.addEventListener("adLoaded", () => {
      console.log("rewarded loaded success");
      setRewardedAdStatus(true);
    });

    AdMobRewarded.requestAd()
      .then(() => {
        console.log("rewarded request success");
        setRewardedAdStatus(true);
      })
      .catch((e) => {
        if (e.message === "Ad is already loaded.") {
          console.log("rewarded ad is already loaded");
          setRewardedAdStatus(true);
        }
      });
  };

  const getInterstitialAd = () => {
    AdMobInterstitial.setAdUnitID(env.MULTIPLE_OPTION_EXAM_INTERSTITIAL);
    AdMobInterstitial.addEventListener("adLoaded", () => {
      console.log("interstitial loaded success");
      setInterstitialAdStatus(true);
    });
    AdMobInterstitial.requestAd()
      .then(() => {
        console.log("interstitial request success");
        setInterstitialAdStatus(true);
      })
      .catch((e) => {
        if (e.message === "Ad is already loaded.") {
          console.log("interstitial ad is already loaded");
          setInterstitialAdStatus(true);
        }
      });
  };

  useEffect(() => {
    getRewardedAd();
    getInterstitialAd();

    return () => {
      AdMobRewarded.removeAllListeners();
      AdMobInterstitial.removeAllListeners();
    };
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <Loading connection={connection} />
      ) : (
        <View key={data.getItemExistsQuestionsFromDB[index]._id} style={{ alignItems: "center" }}>
          <MessageModal
            buttonNegativeText={"İptal"}
            buttonPositiveText={"Tamam"}
            isModalVisible={modalVisible}
            modalToggleHandler={modalToggleHandler}
            modalRouteHandler={modalRouteHandler}
            message={"Sınavı bitirmek istediğinize emin misiniz?"}
          />
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ marginBottom: hp("10%"), marginHorizontal: wp("5%") }}
            contentContainerStyle={{ paddingBottom: 50 }}
          >
            <Navbar
              title={`${index + 1}. Soru`}
              reportHandler={(questionID, report) => reportHandler(questionID, report)}
              withReport
              questionID={data.getItemExistsQuestionsFromDB[index]._id}
            />
            <QuestionItemBox data={data.getItemExistsQuestionsFromDB[index].question} />
            <AnswerItemBox
              answers={data.getItemExistsQuestionsFromDB[index].answer}
              question_id={data.getItemExistsQuestionsFromDB[index]._id}
              correct_answer={data.getItemExistsQuestionsFromDB[index].correct_answer}
            />
          </ScrollView>
          <BottomButtonGroupView
            backHandler={backHandler}
            nextHandler={nextHandler}
            currentIndex={index}
            dataLength={dataLength}
            modalToggleHandler={modalToggleHandler}
          />
        </View>
      )}
    </View>
  );
};
export default MultipleOptionExam;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
});
