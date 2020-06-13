import React, { useState, useEffect} from 'react'
import Navbar from './components/Navbar'
import Torrent from './components/Torrent'
import TorrentInput from './components/TorrentInput';
import Log from './components/Log'
import { addTorrent, getAllTorrent, getLogs } from './library/ajax'
import './App.css'

function populateTorrentList(setTorrentList) {
    getAllTorrent().then((data) => {
        if (data.status === 'success') setTorrentList(data.torrentList)
        else console.log('error', data)
    })
}

function App() {

    const [torrentList, setTorrentList] = useState([])
    const [logs, setLogs] = useState([])
    const [activeTab, setActiveTab] = useState(0)

    const onInput = (data) => {
        addTorrent(data).then(console.log)
    }

    const historyList = () => {
        getLogs().then((resp)=>{
            if(resp.status === 'success')
                setLogs(resp.logs)
            else
                console.log(resp)
        })
    }

    useEffect(() => {
        const event = setInterval(() => {
            populateTorrentList(setTorrentList)
        }, 1500)
        return () => clearInterval(event)
    });

    return (
        <div>
            <div className="w-full max-w-3xl mx-auto h-screen p-2">
                <Navbar onClick={(i)=>{setActiveTab(i);historyList()}} active={activeTab}/>
                <TorrentInput onUpdate={onInput}/>
                { activeTab === 0 ? torrentList.map((data,i)=><Torrent key={i} data={data}/>) 
                    : logs.map(log=><Log key={log.id} onDelete={()=>historyList()} data={log}/>)
                }
            </div>
        </div>
    )
}

export default App;