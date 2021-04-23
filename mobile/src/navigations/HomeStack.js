import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../pages/Home";
import TrafficSigns from "../pages/TrafficSigns";
import DefaultExam from "../pages/DefaultExam";
import ImageExam from "../pages/ImageExam";
import MultipleOptionExam from "../pages/MultipleOptionExam";
import WrongAnswers from "../pages/WrongAnswers";
import ExamResult from "../pages/ExamResult";
import Settings from "../pages/Settings";

const Stack = createStackNavigator();
const HomeStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Default Exam" component={DefaultExam} />
        <Stack.Screen name="Image Exam" component={ImageExam} />
        <Stack.Screen name="Multiple Option Exam" component={MultipleOptionExam} />
        <Stack.Screen name="Traffic Signs" component={TrafficSigns} />
        <Stack.Screen name="Wrong Answers" component={WrongAnswers} />
        <Stack.Screen name="Exam Result" component={ExamResult} />
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default HomeStack;
