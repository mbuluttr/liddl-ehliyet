package com.liddlapp.ehliyet;


import android.os.Bundle;

import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */

  @Override
  protected void onCreate(Bundle savedInstanceState) {
      SplashScreen.show(this, R.style.SplashScreenTheme);
      // super.onCreate(savedInstanceState); // https://github.com/software-mansion/react-native-screens/issues/114#issuecomment-529597084 - java.lang.IllegalStateException -com.swmansion.rnscreens.ScreenFragment.<init>
      super.onCreate(null);
  }

  @Override
  protected String getMainComponentName() {
    return "ehliyetcepte";
  }
}
