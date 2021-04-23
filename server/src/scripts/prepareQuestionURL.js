const changeURL = require("./changeURL");

// Example 1

//  question: [
//     'SORU_Şekildeki gibi bir kavşakta karşılaşan araçların geçiş önceliği sıralaması nasıl olmalıdır?',
//     'IMG_https://ehliyetsinavihazirlik.com/images/10subatsorulari/25.gif'
//   ],
//   answer: [
//     'TEXT_1 - 2 - 3',
//     'TEXT_2 - 3 - 1',
//     'TEXT_3 - 2 - 1',
//     'TEXT_3 - 1 - 2'
//   ],
//   correct_answer: '2 - 3 - 1',
//   image_exists: true,
//   item_exists: false

// Example 2

// question: [
//   'SORU_Aralıklarla yanıp sönen kırmızı ışık aşağıdaki trafik işaretlerinden hangisi ile aynı anlamdadır?'
// ],
// answer: [
//   'IMG_https://ehliyetsinavihazirlik.com/images/10subatsorulari/18a.gif',
//   'IMG_https://ehliyetsinavihazirlik.com/images/10subatsorulari/18b.gif',
//   'IMG_https://ehliyetsinavihazirlik.com/images/10subatsorulari/18c.gif',
//   'IMG_https://ehliyetsinavihazirlik.com/images/10subatsorulari/18d.gif'
// ],
// correct_answer: 'https://ehliyetsinavihazirlik.com/images/10subatsorulari/18a.gif',
// image_exists: true,
// item_exists: false

// Buraya gelen data

// changeURL'yi bekleyebilmek için Promise.all() kullanıldı
const prepareQuestion = async (question) => {
  // // Soru url'leri
  await Promise.all(
    question.question.map(async (element, index) => {
      if (element.startsWith("IMG_")) {
        const unChanged = element.replace("IMG_", "");
        const changed = await changeURL(unChanged, "ehliyet/soru-cevap");
        question.question[index] = "IMG_" + changed;
      }
    })
  );
  // Cevap url'leri
  await Promise.all(
    question.answer.map(async (element, index) => {
      if (element.startsWith("IMG_")) {
        const unChanged = element.replace("IMG_", "");
        const changed = await changeURL(unChanged, "ehliyet/soru-cevap");
        question.answer[index] = "IMG_" + changed;
        if (element === question.correct_answer) {
          question.correct_answer = question.answer[index];
        }
      }
    })
  );

  return question;
};

module.exports = prepareQuestion;
