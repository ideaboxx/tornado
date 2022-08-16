import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    useDisclosure,
} from "@chakra-ui/react";
import { humanFileSize, round } from "@lib/utils";
import axios from "axios";
import { useState } from "react";

export default function TorrentFilesBtn(props: any) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [data, setData] = useState([]);

    const showFiles = async () => {
        onOpen();
        const { data } = await axios.post("/api/torrentFiles", {
            infoHash: props.infoHash,
        });
        setData(data.files);
    };

    return (
        <>
            <Button {...props} onClick={showFiles}>
                Show Files
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Files</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody p="2">
                        <TableContainer pb={"4"}>
                            <Table size="sm">
                                <Thead>
                                    <Tr>
                                        <Th>Size</Th>
                                        <Th>Name</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {data.map((file) => (
                                        <Tr>
                                            <Td isNumeric>
                                                ({round(file.progress * 100)}%)&nbsp;
                                                {humanFileSize(file.length)}
                                            </Td>
                                            <Td>{file.name}</Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}
