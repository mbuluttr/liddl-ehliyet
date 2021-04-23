import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

//height
// hp("0.25%") > 2

//width
// wp("0.45%") > 2

export const sizes = {
  hiki: hp("0.25%"),
  wiki: wp("0.45%"),
};

// use only padding, margin, fontsize
// DONT use width and height
