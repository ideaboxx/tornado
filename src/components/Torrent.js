import React, {useState} from 'react'
import Files from './Files'
import { deleteTorrent } from '../library/ajax'
import { formatBytes, round } from '../library/helper'

export default function Torrent({data}){
    const [showFiles, setShowFiles] = useState(false)

    const deleteTorr = ()=>{
        deleteTorrent(data.infoHash).then(console.log)
    }

    return (
        <div className="my-2 border border-gray-300 p-2 md:p-4 py-3 rounded-md">
            <div className="mb-2 px-2 text-sm border-l-2 text-blue-600 border-blue-500">
                <button onClick={deleteTorr} className="float-right text-red-500 rounded-lg focus:outline-none">
                    <svg className="inline-block" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                    </svg> Delete
                </button>
                <span>{formatBytes(data.downloaded)} of {formatBytes(data.length)} - {round(data.progress*100)}%</span>
            </div>
            <h2 className="mt-1 text-gray-800 break-words">{ data.name }</h2>
            <h3 className="text-xs text-gray-700">{data.numPeers} Peers &nbsp; Ratio: { round(data.ratio) }</h3>
            <div className="my-2 bg-blue-100 rounded-md overflow-hidden my-4 mb-2">
                <div className="bg-blue-500 h-2" style={{"width":`${round(data.progress*100)}%`}}></div>
            </div>
            <div className="text-xs md:text-sm text-gray-600 py-2">
                <div className="float-right">
                    <span className="px-4">
                        <svg className="inline" width="1.2em" height="1.2em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M4.646 7.646a.5.5 0 0 1 .708 0L8 10.293l2.646-2.647a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 0-.708z"/>
                            <path fillRule="evenodd" d="M8 4.5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5z"/>
                        </svg>
                        <span>{formatBytes(data.downloadSpeed)}/s</span>
                    </span>
                    <span>
                        <svg className="inline" width="1.2em" height="1.2em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M8 5.5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5z"/>
                            <path fillRule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8 5.707 5.354 8.354a.5.5 0 1 1-.708-.708l3-3z"/>
                        </svg>
                        <span>{formatBytes(data.uploadSpeed)}/s</span>
                    </span>
                </div>
                <span onClick={()=>setShowFiles(!showFiles)}>{ (showFiles ? 'HIDE' : 'SHOW') + ' FILES' }</span>
            </div>
            { showFiles ? 
                <div className="mt-2 w-full overflow-scroll">
                    <Files infoHash={data.infoHash}/>
                </div> : ''
            }
        </div>
    )
}