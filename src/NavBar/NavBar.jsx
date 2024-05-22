import { HamburgerIcon } from "@chakra-ui/icons";
import { Box, Button, Heading, Image, Text, useDisclosure } from "@chakra-ui/react";
import { useRef } from "react";

export default function NavBar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  return (
    <Box
      bg={'gray.50'}
      color="white"
      display={"flex"}
      px={12}
      py={4}
      fontWeight="bold"
      shadow={"md"}
    >
      <Button ref={btnRef} colorScheme="none" onClick={onOpen}>
          <Image src="./logo2.png" w={75}/>
          <Heading size="md" ml={4} color="blue.500">SmartDrop</Heading>
      </Button>

    </Box>
  );
}
