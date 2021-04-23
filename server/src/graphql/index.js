const { gql, AuthenticationError } = require("apollo-server-express");
const hash = require("object-hash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Question = require("../models/question");
const User = require("../models/user");
const Sign = require("../models/sign");
const Report = require("../models/report");

const typeDefs = gql`
  input UserInput {
    username: String!
    password: String!
    role: String
  }

  type User {
    id: ID!
    username: String!
    password: String!
    role: String!
  }

  type AuthPayload {
    token: String!
    username: String!
    role: String!
  }

  input QuestionInput {
    question: [String]!
    answer: [String]!
    correct_answer: String!
    image_exists: Boolean!
    item_exists: Boolean!
  }

  type QuestionFromAPI {
    question: [String]!
    answer: [String]!
    correct_answer: String!
    image_exists: Boolean!
    item_exists: Boolean!
  }

  input SignInput {
    url: String!
    title: String!
    category: String!
  }

  type SignFromAPI {
    url: String!
    title: String!
    category: String!
  }

  type SignFromDB {
    _id: ID!
    url: String!
    title: String!
    category: String!
    hash: String!
  }

  type QuestionFromDB {
    _id: ID!
    hash: String!
    question: [String]!
    answer: [String]!
    correct_answer: String!
    image_exists: Boolean!
    item_exists: Boolean!
  }

  input ReportInput {
    question_id: String!
    report: String!
  }

  type Report {
    _id: ID!
    question_id: String!
    report: String!
  }

  type Query {
    getQuestionsFromAPI(id: String!): [QuestionFromAPI!]!
    getImageExistsQuestionsFromAPI(id: ID!): [QuestionFromAPI]
    getItemExistsQuestionsFromAPI(id: ID!): [QuestionFromAPI]
    getQuestionsFromDB(data: String!): [QuestionFromDB!]!
    getImageExistsQuestionsFromDB(data: String!): [QuestionFromDB!]!
    getItemExistsQuestionsFromDB(data: String!): [QuestionFromDB!]!
    getWrongQuestionsFromDB(data: String!, arr: [String!]!): [QuestionFromDB!]!
    getSignsFromAPI: [SignFromAPI!]!
    getSignsFromDB: [SignFromDB!]!
    getReportFromDB: [Report!]!
    getUserRole: String!
  }

  type Mutation {
    createQuestion(data: QuestionInput): QuestionFromDB
    createSign(data: SignInput): SignFromDB
    createUser(data: UserInput): String!
    login(data: UserInput): AuthPayload!
    createReport(data: ReportInput): Report!
  }
`;

const resolvers = {
  Query: {
    getQuestionsFromAPI: async (parent, args, { getParsedQuestionData, currentUser }) => {
      if (currentUser) {
        const data = await getParsedQuestionData(args.id);
        return data;
      } else {
        throw new Error("Login required 🙄");
      }
    },

    getImageExistsQuestionsFromAPI: async (parent, args, { getParsedQuestionData, currentUser }) => {
      if (currentUser) {
        const data = await getParsedQuestionData(args.id);
        return data.filter((e) => {
          if (e.image_exists === true) {
            return e.image_exists;
          }
        });
      } else {
        throw new Error("Login required 🙄");
      }
    },

    getItemExistsQuestionsFromAPI: async (parent, args, { getParsedQuestionData, currentUser }) => {
      if (currentUser) {
        const data = await getParsedQuestionData(args.id);
        return data.filter((e) => {
          if (e.item_exists === true) {
            return e.item_exists;
          }
        });
      } else {
        throw new Error("Login required 🙄");
      }
    },

    getSignsFromAPI: async (parent, args, { getParsedSignData, currentUser }) => {
      if (currentUser) {
        const data = await getParsedSignData();
        return data;
      } else {
        throw new Error("Login required 🙄");
      }
    },

    getSignsFromDB: async () => {
      const signs = await Sign.find({});
      return signs;
    },

    getQuestionsFromDB: async (parent, { data }) => {
      const questions = await Question.aggregate([{ $sample: { size: Number(data) } }]);
      return questions;
    },

    getImageExistsQuestionsFromDB: async (parent, { data }) => {
      const questions = await Question.aggregate([{ $match: { image_exists: true } }, { $sample: { size: Number(data) } }]);
      return questions;
    },

    getItemExistsQuestionsFromDB: async (parent, { data }) => {
      const questions = await Question.aggregate([{ $match: { item_exists: true } }, { $sample: { size: Number(data) } }]);
      return questions;
    },

    getWrongQuestionsFromDB: async (parent, { data, arr }) => {
      const questions = await Question.find({ _id: { $in: arr } }).limit(Number(data));
      return questions;
    },

    getReportFromDB: async () => {
      const reports = await Report.find({});
      return reports;
    },

    getUserRole: async (parent, args, { currentUser }) => {
      return currentUser.role;
    },
  },

  Mutation: {
    // Gelen soru eğer db de kayıtlı değil ise soru kaydedilmeden önce
    // Soru resimli ise url'ler değişir ve db'ye kaydedilir
    // Soru resimsiz ise direk olarak db'ye kaydedilir
    createQuestion: async (parent, { data }, { prepareQuestionURL, currentUser }) => {
      data.hash = hash(data);
      const exists = await Question.findOne({ hash: data.hash });

      if (currentUser.role === "admin") {
        if (!exists) {
          if (data.image_exists) {
            const preparedQuestion = await prepareQuestionURL(data);
            const newQuestion = new Question(preparedQuestion);
            await newQuestion.save();
            console.log("Soru db'ye kaydedildi ✅ 🎈");
            return newQuestion;
          } else {
            const newQuestion = new Question(data);
            await newQuestion.save();
            console.log("Soru db'ye kaydedildi ✅");
            return newQuestion;
          }
        } else {
          // db'de kayıtlı olan sorular
          console.log("Bu soru db'de zaten kayıtlı ❌");
          throw new Error("Bu soru db'de zaten kayıtlı ❌");
        }
      } else {
        throw new Error("Bu işlem için yetkiniz yok ❌");
      }
    },

    createSign: async (parent, { data }, { changeURL, currentUser }) => {
      data.hash = hash(data);
      const exists = await Sign.findOne({ hash: data.hash });

      if (currentUser.role === "admin") {
        if (!exists) {
          data.url = await changeURL(data.url, "ehliyet/sign");
          const newSign = new Sign(data);
          await newSign.save();
          console.log("Trafik işareti db'ye kaydedildi ✅");
          return newSign;
        } else {
          // db'de kayıtlı olan işaretler
          console.log("Bu işaret db'de zaten kayıtlı ❌");
          throw new Error("Bu işaret db'de zaten kayıtlı ❌");
        }
      } else {
        throw new Error("Bu işlem için yetkiniz yok ❌");
      }
    },

    createUser: async (parent, { data }, { currentUser }) => {
      data.username = data.username.trim().toLowerCase();
      data.password = await bcrypt.hash(data.password, 5);

      if (data.role !== "admin") {
        data.role = "user";
      }

      const exists = await User.findOne({ username: data.username });

      if (currentUser.role === "admin") {
        if (!exists) {
          const newUser = new User(data);
          await newUser.save();
          console.log("User db'ye kaydedildi ✅");
          return jwt.sign({ id: newUser.id }, process.env.JWT_SECRET);
        } else {
          console.log("User db'de zaten kayıtlı ❌");
          throw new Error("Bu user db'de zaten kayıtlı ❌");
        }
      } else {
        throw new Error("Bu işlem için yetkiniz yok ❌");
      }
    },

    login: async (parent, { data }) => {
      data.username = data.username.trim().toLowerCase();
      const user = await User.findOne({ username: data.username });

      if (!user) {
        throw new AuthenticationError("User doesn't exists");
      }

      const valid = await bcrypt.compare(data.password, user.password);

      if (!valid) {
        throw new AuthenticationError("Password doesn't match");
      }

      const payload = {
        token: jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET),
        username: user.username,
        role: user.role,
      };

      return payload;
    },

    createReport: async (parent, { data }) => {
      data.question_id = data.question_id.trim();
      const exists = await Report.findOne({ question_id: data.question_id });
      if (!exists) {
        const newReport = new Report(data);
        await newReport.save();
        return newReport;
      } else {
        throw new Error("Bu ID zaten rapor edilmiş ❌");
      }
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
