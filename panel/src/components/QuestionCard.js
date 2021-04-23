import React, { useState, useEffect } from "react";
import { Box, Divider, SimpleGrid, Center, Button, Text } from "@chakra-ui/react";
import Question from "./Question";
import Answer from "./Answer";
import WelcomeText from "./WelcomeText";
import { CREATE_QUESTION } from "../graphql/queries";
import { useMutation } from "@apollo/client";

function QuestionCard({ data, role }) {
  const [createQuestion] = useMutation(CREATE_QUESTION);
  const [exists, setExists] = useState(false);

  const [arr, setArr] = useState([]);

  useEffect(() => {
    setArr(data);
  }, [setArr, data]);

  return (
    <Center paddingBottom={100}>
      {data.length ? (
        <Box d="flex" flexDirection="column">
          {exists ? (
            <Text alignSelf="center" mb={5} fontSize="x-large">
              Bazı sorular db'de zaten kayıtlı ❌
            </Text>
          ) : null}

          {role === "admin" ? (
            <Button
              color="white"
              backgroundColor="green.500"
              _hover={{ backgroundColor: "green.400" }}
              _active={{
                backgroundColor: "green.500",
              }}
              w={300}
              mb={10}
              _focus
              onClick={() => {
                arr.forEach(async (e) => {
                  try {
                    await createQuestion({
                      variables: {
                        question: e.question,
                        answer: e.answer,
                        correct_answer: e.correct_answer,
                        image_exists: e.image_exists,
                        item_exists: e.item_exists,
                      },
                    });
                  } catch (e) {
                    if (e.message.includes("kayıtlı")) {
                      setExists(true);
                    }
                  }
                });
              }}
              alignSelf="center"
            >
              Save Questions
            </Button>
          ) : null}
          <SimpleGrid columns={[1, null, 3]} spacing={25}>
            {arr.map((e, index) => {
              return (
                <Box
                  key={index}
                  maxW={300}
                  border="1px"
                  borderRadius={"xl"}
                  borderColor="purple.600"
                  p={3}
                  onClick={() => {
                    setArr(arr.filter((el) => el !== e));
                  }}
                >
                  <Question data={e["question"]} />
                  <Divider my={3} />
                  <Answer data={e["answer"]} correct_answer={e["correct_answer"]} />
                </Box>
              );
            })}
          </SimpleGrid>
        </Box>
      ) : (
        <WelcomeText message={"404"} />
      )}
    </Center>
  );
}

export default QuestionCard;

// import React from "react";
// import { Box, Divider, Center } from "@chakra-ui/react";
// import Question from "./Question";
// import Answer from "./Answer";

// function QuestionCard({ data }) {
//   return (
//     <Center>
//       <Box
//         padding={4}
//         w="100%"
//         maxW="900px"
//         mx="auto"
//         bg="gray.800"
//         sx={{ columnCount: [1, null, 3], columnGap: "16px" }}
//       >
//         {data.map((e, index) => {
//           return (
//             <Box
//               key={index}
//               maxW={300}
//               border="1px"
//               borderRadius={"xl"}
//               p={3}
//               mb="16px"
//               d="inline-block"
//               onClick={() => console.log("Clicked")}
//             >
//               <Question data={e["question"]} />
//               <Divider my={3} />
//               <Answer data={e["answer"]} correct_answer={e["correct_answer"]} />
//             </Box>
//           );
//         })}
//       </Box>
//     </Center>
//   );
// }
// export default QuestionCard;
