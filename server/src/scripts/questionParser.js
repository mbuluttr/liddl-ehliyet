const axios = require("axios").default;
const qs = require("qs");
const cheerio = require("cheerio");

const fixString = (data) => {
  data = data.replace(/Soru (\d+)./g, "");
  data = data.replaceAll(/<[^>]*>/g, "");
  data = data.replaceAll(/(\w)\)/g, "");
  data = data.replaceAll("•", "-");
  data = data.replaceAll("&nbsp;", "");
  data = data.trim();
  return data;
};

const getHTMLData = async (quiz_id) => {
  const { data } = await axios({
    method: "post",
    url: process.env.URL,
    data: qs.stringify({
      quiz_id: quiz_id,
      simplequiz_post: process.env.SIMPLEQUIZ_POST,
      user_name: process.env.USER_NAME,
      user_email: process.env.USER_EMAIL,
      submit_button: process.env.SUBMIT_BUTTON,
    }),
    headers: {
      "content-type": "application/x-www-form-urlencoded;charset=utf-8",
    },
  });
  return data;
};

const getParsedQuestionData = async (quiz_id) => {
  const data = await getHTMLData(quiz_id);
  const $ = cheerio.load(data);

  const questions = [];

  $(".simplequiz_question_result").each((index, element) => {
    const question = [];
    const answer = [];
    let correct_answer = "";

    let image_exists = false;
    let item_exists = false;
    $(element)
      .find("p")
      .each((index, element) => {
        if ($(element).find("img").length) {
          if ($(element).html().includes(process.env.IMG_ANSWER_OK) || $(element).html().includes(process.env.IMG_ANSWER_EM)) {
            if ($(element).eq(0).find("img").next("img").attr("src")) {
              image_exists = true;
              // Soru cevapları resim
              const image = process.env.IMG_LINK + $(element).eq(0).find("img").next("img").attr("src");
              answer.push("IMG_" + image);

              if ($(element).html().includes(process.env.IMG_ANSWER_OK)) {
                // Doğru cevap resim
                const image = process.env.IMG_LINK + $(element).eq(0).find("img").next("img").attr("src");
                correct_answer = "IMG_" + image;
              }
            } else {
              // Soru cevapları yazı
              const text = fixString($(element).text());
              answer.push("TEXT_" + text);
              if ($(element).html().includes(process.env.IMG_ANSWER_OK)) {
                // Doğru cevap yazı
                correct_answer = "TEXT_" + text;
              }
            }
          } else {
            image_exists = true;
            // Soru resmi
            const image = process.env.IMG_LINK + $(element).find("img").attr("src");
            question.push("IMG_" + image);
          }
        } else {
          if ($(element).html().includes("<br>")) {
            // ex.
            // <p>
            //   I. Kesik yol çizgisi <br>
            //   II. Devamlı yol çizgisi <br>
            //   III. Yan yana iki devamlı yol çizgisi
            // </p>
            const arr = $(element).html().split("<br>");
            arr.forEach((text, index) => {
              arr[index] = fixString(text);
              if (arr[index].length) {
                question.push("ITEM_" + arr[index]);
              }
            });
            item_exists = true; // Maddeli soru ise
          } else {
            if ($(element).html().includes("<strong>")) {
              // Soru başlıkları <strong>
              const text = fixString($(element).html());
              question.push("SORU_" + text);
            } else {
              // Maddeli sorularda ki maddeler <br> içermeyenler
              const text = fixString($(element).html());
              if (text.length) {
                question.push("ITEM_" + text);
                item_exists = true; // Maddeli soru ise
              }
            }
          }
        }
      });
    if (question.length && answer.length) {
      const banned = ["doğru ceva", "cevap ", "cevab", "cevab:", "cevap:", "çözüm:", "çözüm ", "şıkkı", "şıkkıdır"];
      let exists = false;
      question.forEach((item) => {
        if (banned.some((e) => item.toLowerCase().includes(e))) {
          exists = true;
        }
      });
      if (!exists) {
        questions.push({
          question,
          answer,
          correct_answer,
          image_exists,
          item_exists,
        });
      }
    }
  });

  return questions;
};

module.exports = getParsedQuestionData;
