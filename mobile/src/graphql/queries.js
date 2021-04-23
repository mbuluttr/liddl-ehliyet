import { gql } from "@apollo/client";

export const GET_QUESTIONS_FROM_DB = gql`
  query getQuestionsFromDB($data: String!) {
    getQuestionsFromDB(data: $data) {
      _id
      question
      answer
      correct_answer
      image_exists
      item_exists
      hash
    }
  }
`;

export const GET_IMAGE_EXISTS_QUESTIONS_FROM_DB = gql`
  query getImageExistsQuestionsFromDB($data: String!) {
    getImageExistsQuestionsFromDB(data: $data) {
      _id
      question
      answer
      correct_answer
      image_exists
      item_exists
      hash
    }
  }
`;

export const GET_ITEM_EXISTS_QUESTIONS_FROM_DB = gql`
  query getItemExistsQuestionsFromDB($data: String!) {
    getItemExistsQuestionsFromDB(data: $data) {
      _id
      question
      answer
      correct_answer
      image_exists
      item_exists
      hash
    }
  }
`;

export const GET_SIGNS = gql`
  query getSignsFromDB {
    getSignsFromDB {
      _id
      url
      title
      category
      hash
    }
  }
`;

export const GET_WRONG_QUESTIONS_FROM_DB = gql`
  query getWrongQuestionsFromDB($data: String!, $arr: [String!]!) {
    getWrongQuestionsFromDB(data: $data, arr: $arr) {
      _id
      question
      answer
      correct_answer
      image_exists
      item_exists
      hash
    }
  }
`;

export const CREATE_REPORT = gql`
  mutation createReport($question_id: String!, $report: String!) {
    createReport(data: { question_id: $question_id, report: $report }) {
      _id
      question_id
      report
    }
  }
`;
