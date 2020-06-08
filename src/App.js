import React, {useState, useEffect} from 'react'
import Navbar from './components/Navbar'
import Torrent from './components/Torrent'
import TorrentInput from './components/TorrentInput';
import { addTorrent, getAllTorrent } from './library/ajax'
import './App.css'

function App() {
  const [torrentList, setTorrentList] = useState([])
  const onInput = (data)=>{
    addTorrent(data).then(console.log)
  }

  useEffect(() => {
    const event = setInterval(()=>{
      getAllTorrent().then((data)=>{
        if(data.status === 'success') setTorrentList(data.torrentList)
        else console.log('error', data)
      })
    }, 10000)
    return ()=>clearInterval(event)
  });

  return (
    <div>
      <div className="w-full max-w-3xl mx-auto h-screen">
        <Navbar />
        <TorrentInput onUpdate={onInput}/>
        { torrentList.map(data=><Torrent data={data}/>) }
      </div>
    </div>
  )
}

export default App;
