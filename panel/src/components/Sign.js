import React from "react";
import { Text, Box, Image, Center } from "@chakra-ui/react";

function Question({ url, title }) {
  return (
    <Box>
      <Image src={url} my={5} />
      <Center>
        <Text my={1}>{title}</Text>
      </Center>
    </Box>
  );
}

export default Question;
