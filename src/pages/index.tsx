import {
    Box,
    Button,
    Center,
    Checkbox,
    Container,
    FormControl,
    FormLabel,
    Icon,
    Input,
    Spinner,
    Text,
    useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { VscKey } from "react-icons/vsc";

export default function index() {
    const [isLoading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setLoading(true);
        axios
            .get("/api/getLoggedInUser")
            .then(() => router.replace("/dashboard"))
            .catch(() => router.replace("/loginSignup"))
            .finally(() => setLoading(false));
    }, []);

    return (
        <Container h="100vh">
            <Center h="100vh">
                <Box
                    rounded="md"
                    p="6"
                    w="full"
                    maxW="25em"
                    bg={"gray.700"}
                    className="shadow-2xl text-center"
                >
                    <Text my="4">Checking login status..</Text>
                    <Spinner />
                </Box>
            </Center>
        </Container>
    );
}
