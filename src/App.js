import React, {useState, useEffect} from 'react'
import Navbar from './components/Navbar'
import Torrent from './components/Torrent'
import TorrentInput from './components/TorrentInput';
import { addTorrent, getAllTorrent } from './library/ajax'
import './App.css'

function populateTorrentList(setTorrentList){
  getAllTorrent().then((data)=>{
    if(data.status === 'success') setTorrentList(data.torrentList)
    else console.log('error', data)
  })
}

function historyList(){
  
}

function App() {

  const [torrentList, setTorrentList] = useState([])
  const [activeTab, setActiveTab] = useState(0)

  const onInput = (data) => {
    addTorrent(data).then(console.log)
  }

  useEffect(() => {
    const event = setInterval(()=>{
      populateTorrentList(setTorrentList)
    }, 2000)
    return ()=>clearInterval(event)
  });

  return (
    <div>
      <div className="w-full max-w-3xl mx-auto h-screen">
        <Navbar onClick={setActiveTab} active={activeTab}/>
        <TorrentInput onUpdate={onInput}/>
        { activeTab === 0 ? torrentList.map(data=><Torrent data={data}/>) : historyList() }
      </div>
    </div>
  )
}

export default App;
