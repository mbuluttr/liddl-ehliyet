import React from "react";
import { Text, Box, Image, Container } from "@chakra-ui/react";

function Answer({ data, correct_answer }) {
  const option = ["A) ", "B) ", "C) ", "D) "];
  return (
    <Box position="relative">
      {data.map((e, index) => {
        if (e.startsWith("TEXT_")) {
          return (
            <Box my={4} key={index}>
              {e === correct_answer ? (
                <Text backgroundColor="green.500">{option[index] + e.replace("TEXT_", "")}</Text>
              ) : (
                <Text>{option[index] + e.replace("TEXT_", "")}</Text>
              )}
            </Box>
          );
        } else {
          return (
            <Container key={index}>
              {e === correct_answer ? (
                <Box d="flex" backgroundColor="green.500">
                  <Text mt={5} mr={2}>
                    {option[index]}
                  </Text>
                  <Image src={e.replace("IMG_", "")} my={6} />
                </Box>
              ) : (
                <Box d="flex">
                  <Text mt={5} mr={2}>
                    {option[index]}
                  </Text>
                  <Image src={e.replace("IMG_", "")} my={6} />
                </Box>
              )}
            </Container>
          );
        }
      })}
    </Box>
  );
}

export default Answer;
