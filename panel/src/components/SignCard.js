import React, { useState } from "react";
import { Box, SimpleGrid, Center, Button, Text } from "@chakra-ui/react";
import Sign from "./Sign";
import WelcomeText from "./WelcomeText";
import { CREATE_SIGN } from "../graphql/queries";
import { useMutation } from "@apollo/client";

function SignCard({ data, role }) {
  const [createSign] = useMutation(CREATE_SIGN);
  const [exists, setExists] = useState(false);

  return (
    <Center paddingBottom={100}>
      {data.length ? (
        <Box d="flex" flexDirection="column">
          {exists ? (
            <Text alignSelf="center" mb={5} fontSize="x-large">
              Bazı trafik işaretleri db'de zaten kayıtlı ❌
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
                data.forEach(async (e) => {
                  try {
                    await createSign({
                      variables: {
                        url: e.url,
                        title: e.title,
                        category: e.category,
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
              Save Signs
            </Button>
          ) : null}
          <SimpleGrid columns={[1, null, 3]} spacing={25}>
            {data.map((e, index) => {
              return (
                <Box key={index} maxW={300} border="1px" borderRadius={"xl"} borderColor="purple.600" p={3}>
                  <Sign url={e["url"]} title={e["title"]} />
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

export default SignCard;
