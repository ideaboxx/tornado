import {
    Box,
    Heading,
    useBoolean,
    useBreakpointValue,
    useInterval,
    VStack,
} from "@chakra-ui/react";
import Empty from "@components/Empty";
import Torrent from "@components/Torrent";
import axios from "axios";
import Layout from "layouts";
import { useState } from "react";

export default function dashboard() {
    const [torrents, setTorrents] = useState([]);
    const breakpt = useBreakpointValue({ base: "base", md: "md" });
    const [flag, setFlag] = useBoolean(true);

    useInterval(() => {
        axios
            .get("/api/listTorrents")
            .then(({ data }) => {
                setTorrents(data.torrents);
            })
            .finally(() => setFlag.off());
    }, 1000);

    return (
        <Layout>
            <div className={`${breakpt == "md" ? "p-7" : "p-4"} overflow-y-auto`}>
                <Heading size={"md"} className="mb-4">
                    Active
                </Heading>
                <VStack align="stretch">
                    {torrents.map((t) => (
                        <Torrent {...t} key={t.infoHash} />
                    ))}
                    {torrents.length == 0 && (
                        <Empty showSpinner={flag} placeholder="No active torrents" />
                    )}
                </VStack>
            </div>
        </Layout>
    );
}
