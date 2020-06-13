import React from 'react';
import { deleteLog } from '../library/ajax'

function getStatus(statusCode) {
    console.log(statusCode)
    return {
        0: {lable: 'Active', style:'border-blue-500 text-blue-600'},
        1: {lable: 'Completed', style:'border-orange-500 text-orange-600'},
        2: {lable: 'Uploaded to drive', style:'border-green-500 text-green-600'},
        3: {lable: 'Deleted', style:'border-red-500 text-red-600'}
    }[statusCode]
}

function copyToClipboard(text) {
    var dummy = document.createElement("textarea");
    // dummy.style.display = 'none'
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
}

export default function Logs({data, onDelete}) {
    const status = getStatus(data.status)
    return (
        <div className="border p-2 m-1 rounded-md">
            <div className={"mb-2 px-2 text-sm border-l-2 " + status.style}>
                { status.lable }
            </div>
            <h1>{data.torrent_name}</h1>
            <h2 className="text-sm text-gray-700">InfoHash: {data.info_hash}</h2>
            <button onClick={()=>copyToClipboard(data.magnet)} 
                className="p-2 my-2 text-sm bg-blue-100 text-blue-800 rounded-md">
                Copy Magnet
            </button>
            <button onClick={()=>deleteLog(data.id).then(()=>onDelete(data.id))}
                className="p-2 m-2 text-sm bg-red-100 text-red-800 rounded-md">
                Delete
            </button>
        </div>
    )
}