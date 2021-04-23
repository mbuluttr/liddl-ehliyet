import React from "react";
import { Text, Image, VStack } from "@chakra-ui/react";
import sad from "./../assets/sad.png";
import happy from "./../assets/happy.png";

function WelcomeText({ message, icon }) {
  return (
    <VStack>
      {icon ? <Image src={happy} h="30vh" mt={20} /> : <Image src={sad} h="30vh" mt={20} />}
      <Text fontWeight="extrabold" fontSize="15vh" color="purple.200">
        {message}
      </Text>
    </VStack>
  );
}

export default WelcomeText;
