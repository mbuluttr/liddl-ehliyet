import React, { useState, useEffect, useCallback, useRef } from "react";
import QuestionItemBox from "../components/QuestionItemBox";
import AnswerItemBox from "../components/AnswerItemBox";
import BottomButtonGroupView from "../components/BottomButtonGroup";
import MessageModal from "../components/MessageModal";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import { StyleSheet, View, ScrollView, BackHandler, ToastAndroid } from "react-native";
import { useQuery, useMutation } from "@apollo/client";
import { GET_QUESTIONS_FROM_DB, CREATE_REPORT } from "../graphql/queries";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { setSelected, selectConnection } from "../redux/slice/examSlice";
import { InterstitialAd, AdEventType, TestIds } from "@react-native-firebase/admob";
import { env } from "../../environments";

const DefaultExam = ({ route }) => {
  const [loading, setLoading] = useState(true);
  const [exitCount, setExitCount] = useState(0);
  const [index, setIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [dataLength, setDataLength] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const navigation = useNavigation();
  const connection = useSelector(selectConnection);
  const dispatch = useDispatch();
  const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : env.DEFAULT_EXAM_INTERSTITIAL;
  const interstitialRef = useRef(
    InterstitialAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
      keywords: [env.KEY1, env.KEY2],
    })
  );

  const { data, refetch } = useQuery(GET_QUESTIONS_FROM_DB, {
    variables: {
      data: route.params.questionCount,
    },
    onCompleted() {
      if (data.getQuestionsFromDB.length) {
        setDataLength(data.getQuestionsFromDB.length);
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

  useEffect(() => {
    let flag = true;
    const eventListener = interstitialRef.current.onAdEvent((type) => {
      if (type === AdEventType.LOADED) {
        console.log("ad loaded");
        setLoaded(true);
      }

      if (type === AdEventType.CLOSED) {
        console.log("ad closed");
        setLoaded(false);

        if (flag) {
          interstitialRef.current.load();
          flag = false;
        }
      }
    });

    interstitialRef.current.load();

    return () => {
      eventListener();
    };
  }, []);

  const nextHandler = () => {
    setIndex(index + 1);

    const firstAd = Math.trunc(dataLength / 2);
    const finalAd = dataLength - 1;

    if (index + 1 === firstAd || index + 1 === finalAd) {
      if (loaded) {
        try {
          interstitialRef.current.show();
        } catch (error) {
          console.log("interstitial show | catch");
        }
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
      const question = data.getQuestionsFromDB.find((el) => el._id === questionID);
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

  return (
    <View style={styles.container}>
      {loading ? (
        <Loading connection={connection} />
      ) : (
        <View key={data.getQuestionsFromDB[index]._id} style={{ alignItems: "center" }}>
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
              questionID={data.getQuestionsFromDB[index]._id}
            />
            <QuestionItemBox data={data.getQuestionsFromDB[index].question} />
            <AnswerItemBox
              answers={data.getQuestionsFromDB[index].answer}
              question_id={data.getQuestionsFromDB[index]._id}
              correct_answer={data.getQuestionsFromDB[index].correct_answer}
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
export default DefaultExam;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
});
