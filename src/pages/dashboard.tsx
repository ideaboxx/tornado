import { Box, Heading, useBreakpointValue, useInterval, VStack } from "@chakra-ui/react";
import Torrent from "@components/Torrent";
import axios from "axios";
import Layout from "layouts";
import { useState } from "react";

export default function dashboard() {
    const [torrents, setTorrents] = useState([]);
    const breakpt = useBreakpointValue({ base: "base", md: "md" });

    useInterval(() => {
        axios.get("/api/listTorrents").then(({ data }) => {
            setTorrents(data.torrents);
        });
    }, 1000);

    return (
        <Layout>
            <div className={`${breakpt == "md" ? "p-7" : "p-4"}`}>
                <Heading size={"md"} className="mb-4">
                    Active
                </Heading>
                <VStack align="stretch">
                    {torrents.map((t) => (
                        <Torrent {...t} />
                    ))}
                    {torrents.length == 0 && (
                        <Box color={"gray.500"} bg="gray.700" p="8" rounded={"md"} my="4">
                            No active downloads
                        </Box>
                    )}
                </VStack>
            </div>
        </Layout>
    );
}
