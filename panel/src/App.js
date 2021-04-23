import React, { useState } from "react";
import { VStack } from "@chakra-ui/react";
import { useLazyQuery, useQuery } from "@apollo/client";
import { GET_QUESTIONS, GET_SIGNS, GET_USER_ROLE } from "./graphql/queries";
import Navbar from "./components/Navbar";
import QuestionCard from "./components/QuestionCard";
import QuestionLoader from "./components/QuestionLoader";
import WelcomeText from "./components/WelcomeText";
import SignCard from "./components/SignCard";
import Login from "./components/Login";

function App() {
  const [quizID, setQuizID] = useState("");
  const [showQuestion, setShowQuestion] = useState(false);
  const [showSign, setShowSign] = useState(false);
  const [role, setRole] = useState("");

  // 342
  const [loadQuestions, { loading: questionLoading, error: questionError, data: questionData }] = useLazyQuery(GET_QUESTIONS);
  const [loadSigns, { loading: signsLoading, error: signError, data: signsData }] = useLazyQuery(GET_SIGNS);
  const { data: user } = useQuery(GET_USER_ROLE, {
    onCompleted() {
      setRole(user.getUserRole);
    },
  });

  const token = localStorage.getItem("token");

  const getQuestionsButtonClick = () => {
    if (quizID) {
      setShowQuestion(true);
      setShowSign(false);
      loadQuestions({
        variables: { id: quizID },
      });
    }
  };

  const getSignsButtonClick = () => {
    setShowQuestion(false);
    setShowSign(true);
    loadSigns();
  };

  const onLogoutButtonClick = () => {
    window.location.reload();
    localStorage.removeItem("token");
  };

  if (!token) {
    return <Login />;
  } else {
    return (
      <VStack spacing={10} d="flex">
        <Navbar
          getInputValue={(value) => setQuizID(value)}
          getQuestionsButtonClick={() => getQuestionsButtonClick()}
          getSignsButtonClick={() => getSignsButtonClick()}
          onLogoutButtonClick={() => onLogoutButtonClick()}
        />
        {questionData && showQuestion ? (
          <QuestionCard data={questionData["getQuestionsFromAPI"]} role={role} />
        ) : questionLoading ? (
          <QuestionLoader />
        ) : null}
        {signsData && showSign ? <SignCard data={signsData["getSignsFromAPI"]} role={role} /> : signsLoading ? <QuestionLoader /> : null}
        {!showSign && !showQuestion && !questionData && !signsData ? <WelcomeText message="welcome" icon /> : null}
        {questionError || signError ? <WelcomeText message="Login Required!" icon /> : null}
      </VStack>
    );
  }
}

export default App;
