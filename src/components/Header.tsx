import {
    Box,
    Button,
    Drawer,
    DrawerCloseButton,
    DrawerContent,
    DrawerOverlay,
    IconButton,
    Spacer,
    Tag,
    useBreakpointValue,
    useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { GoFileSubmodule } from "react-icons/go";
import { MdMenu } from "react-icons/md";
import AddTorrent from "./AddTorrent";
import If from "./If";
import SettingsBtn from "./SettingsBtn";
import Sidebar from "./Sidebar";

interface propType {
    index?: number;
}

export default function Header({ index }: propType) {
    const router = useRouter();
    const breakpt = useBreakpointValue({ base: "base", md: "md" });
    const { isOpen, onOpen, onClose } = useDisclosure();

    const action = () => {
        router.replace("/dashboard");
    };

    return (
        <React.Fragment>
            <Box display={breakpt == "md" ? "none" : "block"}>
                <IconButton icon={<MdMenu />} aria-label={"menu"} onClick={onOpen} />
                <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                    <DrawerOverlay />
                    <DrawerContent bgColor={"gray.900"} p="4">
                        <DrawerCloseButton />
                        <div className="pt-5">
                            <Sidebar />
                        </div>
                    </DrawerContent>
                </Drawer>
            </Box>
            <Box>
                <Button
                    leftIcon={breakpt == "md" ? <GoFileSubmodule /> : null}
                    variant="ghost"
                    onClick={action}
                >
                    Tornado{" "}
                    <Tag className="mx-2" bg={"teal.700"}>
                        v2.0
                    </Tag>
                </Button>
            </Box>
            <Spacer />
            <Box display={breakpt == "md" ? "block" : "none"}>
                <SettingsBtn />
                <Button
                    variant="ghost"
                    onClick={() => {
                        window.location.href = "/api/logout";
                    }}
                >
                    Logout
                </Button>
            </Box>
            <If condition={breakpt == "md" ? false : true}>
                <AddTorrent size={breakpt == "md" ? "md" : "sm"} />
            </If>
        </React.Fragment>
    );
}
