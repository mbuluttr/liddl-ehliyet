const axios = require("axios").default;
const cheerio = require("cheerio");

const getHTMLData = async () => {
  const { data } = await axios.get(process.env.SIGN_URL);
  return data;
};

const getParsedSignData = async () => {
  const data = await getHTMLData();
  const $ = cheerio.load(data);
  const arr = [];

  $(".gallerybox").each(async (index, element) => {
    const url = $(element).find("img").attr("src");
    const title = $(element).find(".gallerytext").text().trim();
    let category = null;

    if (title.includes("(T-")) {
      category = "Tehlike ve Uyarı İşaretleri";
    } else if (title.includes("(TT-")) {
      category = "Trafik Tanzim İşaretleri";
    } else if (title.includes("(B-")) {
      category = "Bilgi İşaretleri";
    } else if (title.includes("(P-")) {
      category = "Durma ve Parketme İşaretleri";
    } else if (title.includes("(PL-")) {
      category = "Paneller";
    } else if (title.includes("(YB-")) {
      category = "Şerit Düzenleme İşaretleri";
    } else {
      category = null;
    }

    if (url.includes("-Turkey_road_sign_") && category != null) {
      arr.push({
        url: url.replace(/^/g, "https:").replace(/(\d+)px/g, "512px"),
        title: title,
        category: category,
      });
    }
  });
  return arr;
};

module.exports = getParsedSignData;
