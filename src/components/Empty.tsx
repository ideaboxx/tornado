import { Center, Spinner } from "@chakra-ui/react";

export default function Empty({ showSpinner, placeholder }) {
    return (
        <Center bg="gray.700" color="gray.400" p="6" rounded={"md"}>
            {showSpinner ? <Spinner size={"md"} /> : <p>{placeholder}</p>}
        </Center>
    );
}
