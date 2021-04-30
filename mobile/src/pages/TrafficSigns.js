import React, { useState, useCallback } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import Navbar from "../components/Navbar";
import SignItemBox from "../components/SignItemBox";
import Loading from "../components/Loading";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { useQuery } from "@apollo/client";
import { GET_SIGNS } from "../graphql/queries";
import { colors } from "../theme/colors";
import { Picker } from "@react-native-picker/picker";
import { sizes } from "../theme/sizes";
import { useSelector } from "react-redux";
import { selectConnection } from "../redux/slice/examSlice";

const TrafficSigns = () => {
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Tehlike ve Uyarı İşaretleri");
  const connection = useSelector(selectConnection);

  const { data } = useQuery(GET_SIGNS, {
    onCompleted() {
      setLoading(false);
    },
  });

  const renderItem = useCallback(({ item }) => {
    const image_url = item.url.split(",");
    return <SignItemBox uri={image_url[0]} title={item.title} />;
  }, []);

  const keyExtractor = useCallback((item) => item.hash, []);

  const getItemLayout = useCallback((_, index) => ({ length: hp("43%"), offset: hp("43%") * index, index }), []);

  return (
    <View style={styles.container}>
      {loading ? (
        <Loading connection={connection} />
      ) : (
        <View>
          <Navbar title="Trafik İşaretleri" noModal />
          <View style={styles.pickerView}>
            <Picker
              selectedValue={selectedCategory}
              mode="dropdown"
              dropdownIconColor={colors.primary}
              onValueChange={(itemValue) => setSelectedCategory(itemValue)}
            >
              <Picker.Item
                style={styles.pickerItem}
                label="Tehlike ve Uyarı İşaretleri"
                value="Tehlike ve Uyarı İşaretleri"
              />
              <Picker.Item
                style={styles.pickerItem}
                label="Trafik Tanzim İşaretleri"
                value="Trafik Tanzim İşaretleri"
              />
              <Picker.Item style={styles.pickerItem} label="Bilgi İşaretleri" value="Bilgi İşaretleri" />
              <Picker.Item
                style={styles.pickerItem}
                label="Durma ve Parketme İşaretleri"
                value="Durma ve Parketme İşaretleri"
              />
              <Picker.Item style={styles.pickerItem} label="Paneller" value="Paneller" />
              <Picker.Item
                style={styles.pickerItem}
                label="Şerit Düzenleme İşaretleri"
                value="Şerit Düzenleme İşaretleri"
              />
            </Picker>
          </View>
          <FlatList
            data={data.getSignsFromDB.filter((item) => item.category === selectedCategory)}
            keyExtractor={keyExtractor}
            contentContainerStyle={{ paddingBottom: 150 }}
            columnWrapperStyle={{ justifyContent: "space-between", width: wp("90%") }}
            showsVerticalScrollIndicator={false}
            initialNumToRender={6}
            getItemLayout={getItemLayout}
            maxToRenderPerBatch={6}
            numColumns={2}
            renderItem={renderItem}
          />
        </View>
      )}
    </View>
  );
};

export default TrafficSigns;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },

  pickerView: {
    height: hp("7%"),
    borderWidth: sizes.wiki * 2,
    borderRadius: sizes.wiki * 5,
    borderColor: colors.primary,
    backgroundColor: "white",
    elevation: 5,
    justifyContent: "center",
  },
  pickerItem: {
    fontSize: sizes.hiki * 10,
  },
});
