import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { ImageObjectParser } from "../scripts/ImageObjectParser";
import { colors } from "../theme/colors";
import { sizes } from "../theme/sizes";
import { useSelector, useDispatch } from "react-redux";
import { setSelected, selectSelected, selectSelectedArray } from "../redux/slice/examSlice";

const AnswerItemBox = ({ answers, question_id, correct_answer }) => {
  const choices = ["A)", "B)", "C)", "D)"];

  const [withImageAnswer, setWithImageAnswer] = useState(false);

  const selected = useSelector(selectSelected);

  const selectedArray = useSelector(selectSelectedArray);

  const dispatch = useDispatch();

  useEffect(() => {
    const exists = selectedArray.find((item) => item.id === question_id);
    if (exists) {
      dispatch(setSelected({ id: exists.id, answer: exists.answer, correct: exists.correct }));
    }
  }, [question_id, selectedArray, dispatch]);

  const selectedHandler = (answer) => {
    dispatch(setSelected({ id: question_id, answer: answer, correct: correct_answer }));
  };

  return (
    <View style={[styles.answerItemBox, withImageAnswer ? styles.withImageAnswer : null]}>
      {answers.map((answer, index) => {
        if (answer.startsWith("TEXT_")) {
          return (
            <TouchableOpacity
              key={index}
              style={[styles.textAnswerChoice, answer === selected.answer ? styles.selected : null]}
              activeOpacity={0.7}
              onPress={() => selectedHandler(answer)}
            >
              <Text style={[styles.answerText, answer === selected.answer ? styles.selectedText : null]}>
                {choices[index] + " " + answer.replace("TEXT_", "")}
              </Text>
            </TouchableOpacity>
          );
        } else {
          const image_data = ImageObjectParser(answer);
          if (!withImageAnswer) {
            setWithImageAnswer(true);
          }

          if (image_data.width < wp("30%")) {
            image_data.height = image_data.height * 1.3;
            image_data.width = image_data.width * 1.3;
          }

          if (image_data.width > wp("35%") && image_data.width < wp("40%")) {
            image_data.height = image_data.height * 0.7;
            image_data.width = image_data.width * 0.7;
          }

          if (image_data.width > wp("80%")) {
            image_data.height = image_data.height * 0.7;
            image_data.width = image_data.width * 0.7;
          }

          return (
            <TouchableOpacity
              key={index}
              style={[styles.imageAnswerChoice, answer === selected.answer ? styles.selected : null]}
              activeOpacity={0.7}
              onPress={() => selectedHandler(answer)}
            >
              <Text style={[styles.answerText, answer === selected.answer ? styles.selectedText : null]}>
                {choices[index] + " "}
              </Text>
              <Image
                source={{ uri: image_data.url }}
                resizeMode="contain"
                style={{ height: image_data.height, width: image_data.width }}
              />
            </TouchableOpacity>
          );
        }
      })}
    </View>
  );
};

export default AnswerItemBox;

const styles = StyleSheet.create({
  answerItemBox: {
    width: wp("90%"),
    borderWidth: sizes.wiki * 2,
    borderRadius: sizes.wiki * 5,
    borderColor: colors.primary,
    backgroundColor: "white",
    marginVertical: sizes.hiki * 5,
    padding: sizes.hiki * 5,
    elevation: 5,
  },

  withImageAnswer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  answerText: {
    color: "black",
    fontFamily: "Poppins",
    fontSize: sizes.hiki * 8.5,
  },

  selected: {
    backgroundColor: colors.primary,
    paddingVertical: sizes.hiki * 5,
    paddingHorizontal: sizes.wiki * 2.5,
    borderRadius: sizes.hiki * 5,
  },

  selectedText: { color: "white" },

  textAnswerChoice: {
    marginVertical: sizes.hiki,
  },

  imageAnswerChoice: {
    flexDirection: "row",
    marginVertical: sizes.hiki * 5,
  },
});
