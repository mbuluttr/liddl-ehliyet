import React from "react";
import { Skeleton, Center, SimpleGrid } from "@chakra-ui/react";

function QuestionLoader() {
  return (
    <Center>
      <SimpleGrid columns={[1, null, 3]} spacing={25}>
        <Skeleton minH={300} minW={300} borderRadius={"xl"}></Skeleton>
        <Skeleton minH={300} minW={300} borderRadius={"xl"}></Skeleton>
        <Skeleton minH={300} minW={300} borderRadius={"xl"}></Skeleton>
        <Skeleton minH={300} minW={300} borderRadius={"xl"}></Skeleton>
        <Skeleton minH={300} minW={300} borderRadius={"xl"}></Skeleton>
        <Skeleton minH={300} minW={300} borderRadius={"xl"}></Skeleton>
        <Skeleton minH={300} minW={300} borderRadius={"xl"}></Skeleton>
        <Skeleton minH={300} minW={300} borderRadius={"xl"}></Skeleton>
        <Skeleton minH={300} minW={300} borderRadius={"xl"}></Skeleton>
      </SimpleGrid>
    </Center>
  );
}

export default QuestionLoader;
