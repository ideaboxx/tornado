import { Box, Button, Flex, useBreakpointValue, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { VscCheckAll, VscCloudDownload, VscDebugContinue } from "react-icons/vsc";
import AddTorrent from "./AddTorrent";
import If from "./If";
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
    const [active, setActive] = useState(0);

    return (
        <Box>
            <Flex direction={"column"} my="4">
                <VStack align="stretch">
                    <ul>
                        <li className="mb-6">
                            <AddTorrent />
                        </li>
                        {menuItems.map((item, i) => (
                            <li key={i} className="my-2" onClick={() => setActive(i)}>
                                <SidebarListItem
                                    icon={item.icon}
                                    text={item.text}
                                    path={item.path}
                                    isActive={i == active}
                                />
                            </li>
                        ))}
                    </ul>
                </VStack>
            </Flex>

            <If condition={breakpt == "base"}>
                <Button
                    variant="solid"
                    w="full"
                    onClick={() => {
                        window.location.href = "/api/logout";
                    }}
                >
                    Logout
                </Button>
            </If>
        </Box>
    );
}
