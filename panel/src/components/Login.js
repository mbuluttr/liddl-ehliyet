import React, { useState } from "react";
import { Flex, Box, Heading, FormControl, FormLabel, Input, Button, InputGroup, InputRightElement, Text } from "@chakra-ui/react";
import { LOGIN } from "../graphql/queries";
import { useMutation } from "@apollo/client";

function Login() {
  const [show, setShow] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const handleClick = () => setShow(!show);
  const [login] = useMutation(LOGIN, {
    onCompleted({ login }) {
      localStorage.setItem("token", login.token);
      setUsernameError(false);
      setPasswordError(false);
      window.location.reload();
    },
  });

  return (
    <Flex width="full" height="100vh" align="center" justifyContent="center">
      <Box p={10} maxW={500} borderWidth="2px" borderColor="purple.600" borderRadius={"md"}>
        <Box textAlign="center">
          <Heading>Login</Heading>
        </Box>
        <Box mt={10}>
          <form>
            <FormControl isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                placeholder="Username"
                size="lg"
                focusBorderColor="purple.600"
                borderColor="purple.600"
                borderWidth="2px"
                _hover={{ borderColor: "purple.500" }}
                _focus
                onChange={(e) => setUsername(e.target.value)}
              />
              {usernameError ? (
                <Text color="red.900" fontSize="xs" mt={1}>
                  Username doesn't exists
                </Text>
              ) : null}
            </FormControl>
            <FormControl mt={6} isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup size="lg">
                <Input
                  pr="4.5rem"
                  focusBorderColor="purple.600"
                  borderColor="purple.600"
                  borderWidth="2px"
                  _hover={{ borderColor: "purple.500" }}
                  _focus
                  type={show ? "text" : "password"}
                  placeholder="Enter password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={() => handleClick()}
                    backgroundColor="purple.600"
                    _hover={{ backgroundColor: "purple.500" }}
                    _active={{
                      backgroundColor: "purple.600",
                    }}
                    _focus
                  >
                    {show ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
              {passwordError ? (
                <Text color="red.900" fontSize="xs" mt={1}>
                  Password didn't match
                </Text>
              ) : null}
            </FormControl>

            <Button
              backgroundColor="purple.600"
              type="submit"
              width="full"
              mt={6}
              size="lg"
              _hover={{ backgroundColor: "purple.500" }}
              _active={{
                backgroundColor: "purple.600",
              }}
              _focus
              onClick={async (e) => {
                e.preventDefault();
                try {
                  await login({
                    variables: {
                      username: username,
                      password: password,
                    },
                  });
                } catch (e) {
                  if (e.message.includes("User")) {
                    setUsernameError(true);
                  } else {
                    setPasswordError(true);
                  }
                }
              }}
            >
              Login
            </Button>
          </form>
        </Box>
      </Box>
    </Flex>
  );
}

export default Login;
