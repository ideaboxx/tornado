import { Button, Progress } from "@chakra-ui/react";
import { humanFileSize, round } from "@lib/utils";
import axios from "axios";
import { VscArrowDown, VscArrowUp } from "react-icons/vsc";

interface propType {
    name: string;
    infoHash: string;
    downloaded: number;
    uploaded: number;
    downloadSpeed: number;
    uploadSpeed: number;
    progress: number;
    ratio: number;
    numPeers: number;
    path: string;
    ready: boolean;
    paused: boolean;
    done: boolean;
    length: number;
}

export default function Torrent(props: propType) {
    const removeTorrent = async () => {
        await axios.post("/api/deleteTorrent", { infoHash: props.infoHash });
    };

    return (
        <div className="p-4 my-2 bg-gray-800 rounded-md">
            <div className="border-l-2 border-teal-500 text-teal-500 px-2 text-sm mt-2 mb-3 font-semibold">
                {humanFileSize(props.downloaded)} of {humanFileSize(props.length)} -{" "}
                {round(props.progress * 100)}%
            </div>
            <div className="font-semibold my-2">{props.name}</div>
            <div className="text-gray-400 text-sm my-2">
                {props.numPeers} peer &middot; {round(props.ratio)} ratio
            </div>
            <div className="my-3 py-3">
                <Progress
                    value={round(props.progress * 100)}
                    size="xs"
                    colorScheme="teal"
                    hasStripe
                />
            </div>
            <div className="my-3 space-x-2">
                <Button size={"sm"}>Show Files</Button>
                <Button size={"sm"} leftIcon={<VscArrowDown />}>
                    {humanFileSize(props.downloadSpeed)}/s
                </Button>
                <Button size={"sm"} leftIcon={<VscArrowUp />}>
                    {humanFileSize(props.uploadSpeed)}/s
                </Button>
                <Button
                    className="float-right"
                    colorScheme="red"
                    variant="ghost"
                    size={"sm"}
                    onClick={removeTorrent}
                >
                    Cancel
                </Button>
            </div>
        </div>
    );
}
