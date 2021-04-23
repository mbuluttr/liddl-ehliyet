import React, { useEffect } from "react";
import { StatusBar } from "react-native";
import { ApolloProvider } from "@apollo/client";
import { client } from "./src/apollo/client";
import HomeStack from "./src/navigations/HomeStack";
import store from "./src/redux/store/store";
import { Provider } from "react-redux";
import { colors } from "./src/theme/colors";
import SplashScreen from "react-native-splash-screen";

function App() {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <StatusBar backgroundColor={colors.primary} barStyle={"light-content"} />
        <HomeStack />
      </ApolloProvider>
    </Provider>
  );
}

export default App;
