import { Box, Button, Flex, useBreakpointValue, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { VscCheckAll, VscCloudDownload, VscDebugContinue } from "react-icons/vsc";
import AddTorrent from "./AddTorrent";
import If from "./If";
import SettingsBtn from "./SettingsBtn";
import SidebarListItem from "./SidebarListItem";

const menuItems = [
    {
        icon: <VscCloudDownload />,
        text: "Active Transfer",
        path: "/dashboard",
    },
    {
        icon: <VscCheckAll />,
        text: "Completed Transfer",
        path: "/completed",
    },
    {
        icon: <VscDebugContinue />,
        text: "Cancelled Transfer",
        path: "/cancelled",
    },
];

export default function Sidebar() {
    const breakpt = useBreakpointValue({ base: "base", md: "md" });
    const router = useRouter();
    return (
        <Box>
            <Flex direction={"column"} my="4">
                <VStack align="stretch">
                    <ul>
                        <li className="mb-6">
                            <AddTorrent />
                        </li>
                        {menuItems.map((item, i) => (
                            <li
                                key={i}
                                className="my-2"
                                onClick={() => router.replace(item.path)}
                            >
                                <SidebarListItem
                                    icon={item.icon}
                                    text={item.text}
                                    isActive={router.pathname == item.path}
                                />
                            </li>
                        ))}
                    </ul>
                </VStack>
            </Flex>

            <If condition={breakpt == "base"}>
                <VStack spacing={2}>
                    <SettingsBtn w="full" />
                    <Button
                        variant="solid"
                        w="full"
                        onClick={() => {
                            window.location.href = "/api/logout";
                        }}
                    >
                        Logout
                    </Button>
                </VStack>
            </If>
        </Box>
    );
}
