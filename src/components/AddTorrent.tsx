import {
    Button,
    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    Input,
    Center,
    VStack,
    ModalFooter,
    useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { useRef } from "react";
import { VscAdd } from "react-icons/vsc";
import If from "./If";

export default function AddTorrent(props) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const input = useRef<HTMLInputElement>();

    const submit = async () => {
        const magnet = input.current.value;
        if (magnet) {
            const { data } = await axios.post("/api/submitTorrent", {
                magnet,
            });
        }
        onClose();
    };

    return (
        <>
            <If condition={props.size != "sm"}>
                <Button width={"full"} leftIcon={<VscAdd />} onClick={onOpen}>
                    Add Torrent
                </Button>
            </If>
            <If condition={props.size == "sm"}>
                <Button onClick={onOpen}>
                    <VscAdd />
                </Button>
            </If>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add Torrent</ModalHeader>
                    <ModalBody>
                        <Input variant={"filled"} placeholder="Magnet link" ref={input} />
                        <div className="p-2 border-dashed border-2 border-gray-600 rounded my-3">
                            <Center h="28" className="bg-gray-700 rounded">
                                <VStack spacing={"4"}>
                                    <Text color={"gray.400"}>
                                        Upload or drop .torrent file
                                    </Text>
                                    <Button size="sm">Upload file</Button>
                                </VStack>
                            </Center>
                        </div>
                    </ModalBody>

                    <ModalFooter>
                        <Button mr={3} onClick={submit}>
                            Add
                        </Button>
                        <Button variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
