import { useRouter } from "next/router";

interface propType {
    icon: any;
    text: string;
    isActive: boolean;
}

export default function SidebarListItem({ icon, text, isActive }: propType) {
    return (
        <div
            className={`${
                isActive ? "bg-gray-700 text-white" : "text-gray-400"
            } rounded-md px-2 py-1 cursor-pointer`}
        >
            <div className="inline-block p-2 align-middle">{icon}</div>
            <div className="font-semibold inline-block align-middle px-2 text-sm">
                {text}
            </div>
        </div>
    );
}
