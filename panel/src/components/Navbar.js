import React from "react";
import { Box, Button, Center, NumberInput, NumberInputField, Divider } from "@chakra-ui/react";

function Navbar({ getInputValue, getQuestionsButtonClick, getSignsButtonClick, onLogoutButtonClick }) {
  return (
    <Box minW="full">
      <Box backgroundColor="purple.600" h={2} />
      <Box fontSize="xl" p={5} backgroundColor="purple.900" w="full">
        <Center>
          <NumberInput size="md" minW={50} mr={2}>
            <NumberInputField
              placeholder="ex 659"
              focusBorderColor="purple.600"
              borderColor="purple.600"
              borderWidth="2px"
              _hover={{ borderColor: "purple.500" }}
              _focus
              onChange={(e) => getInputValue(e.target.value)}
            />
          </NumberInput>
          <Button
            backgroundColor="purple.600"
            size="md"
            minW={110}
            mr={2}
            _hover={{ backgroundColor: "purple.500" }}
            _active={{
              backgroundColor: "purple.600",
            }}
            _focus
            onClick={() => {
              getQuestionsButtonClick();
            }}
          >
            Get Questions
          </Button>
          <Center height="40px">
            <Divider orientation="vertical" mr={2} />
          </Center>
          <Button
            backgroundColor="purple.600"
            size="md"
            minW={100}
            _hover={{ backgroundColor: "purple.500" }}
            _active={{
              backgroundColor: "purple.600",
            }}
            mr={2}
            _focus
            onClick={() => {
              getSignsButtonClick();
            }}
          >
            Get Signs
          </Button>
          <Center height="40px">
            <Divider orientation="vertical" mr={2} />
          </Center>
          <Button
            backgroundColor="red.600"
            size="md"
            minW={70}
            _hover={{ backgroundColor: "purple.500" }}
            _active={{
              backgroundColor: "purple.600",
            }}
            _focus
            onClick={() => {
              onLogoutButtonClick();
            }}
          >
            Logout
          </Button>
        </Center>
      </Box>
    </Box>
  );
}

export default Navbar;
