import React from "react";
import { Text, Box, Image } from "@chakra-ui/react";

function Question({ data }) {
  return (
    <Box>
      {data.map((e, index) => {
        if (e.startsWith("SORU_")) {
          return (
            <Text fontWeight="bold" my={4} key={index}>
              {e.replace("SORU_", "")}
            </Text>
          );
        } else if (e.startsWith("IMG_")) {
          return <Image src={e.replace("IMG_", "")} my={5} key={index} />;
        } else {
          return (
            <Text my={1} key={index}>
              {e.replace("ITEM_", "")}
            </Text>
          );
        }
      })}
    </Box>
  );
}

export default Question;
