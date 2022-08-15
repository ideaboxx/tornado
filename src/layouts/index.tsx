import { useBreakpointValue, useInterval } from "@chakra-ui/react";
import Header from "@components/Header";
import Sidebar from "@components/Sidebar";

export default function Layout(props) {
    const breakpt = useBreakpointValue({ base: "base", md: "md" });

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <div className="flex flex-none p-3 border-b border-grey">
                <Header />
            </div>
            <div className="flex-1 overflow-hidden">
                <div className="flex h-full">
                    {breakpt == "md" && (
                        <div className="w-72 h-full px-3 overflow-y-auto">
                            <Sidebar />
                        </div>
                    )}
                    <div className="flex flex-col flex-1 h-full overflow-hidden">
                        {props.children}
                    </div>
                </div>
            </div>
        </div>
    );
}
