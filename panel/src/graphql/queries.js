import { gql } from "@apollo/client";

export const GET_QUESTIONS = gql`
  query getQuestionsFromAPI($id: String!) {
    getQuestionsFromAPI(id: $id) {
      question
      answer
      correct_answer
      image_exists
      item_exists
    }
  }
`;

export const GET_SIGNS = gql`
  query getSingsFromAPI {
    getSignsFromAPI {
      url
      title
      category
    }
  }
`;

export const CREATE_QUESTION = gql`
  mutation createQuestion($question: [String]!, $answer: [String]!, $correct_answer: String!, $image_exists: Boolean!, $item_exists: Boolean!) {
    createQuestion(
      data: { question: $question, answer: $answer, correct_answer: $correct_answer, image_exists: $image_exists, item_exists: $item_exists }
    ) {
      question
      answer
      correct_answer
      image_exists
      item_exists
    }
  }
`;

export const CREATE_SIGN = gql`
  mutation createSign($url: String!, $title: String!, $category: String!) {
    createSign(data: { url: $url, title: $title, category: $category }) {
      url
      title
      category
    }
  }
`;

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(data: { username: $username, password: $password }) {
      token
      username
      role
    }
  }
`;

export const GET_USER_ROLE = gql`
  query getUserRole {
    getUserRole
  }
`;

// export const LOGIN_USER = gql`
//   mutation LoginUser($username: String!, $password: String!) {
//     loginUser(data: { username: $username, password: $password }) {
//       token
//       userType
//     }
//   }
// `;
