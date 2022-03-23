import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Torrent from "./components/Torrent";
import TorrentInput from "./components/TorrentInput";
import Log from "./components/Log";
import Authenticate from "./components/Authenticate";
import { addTorrent, getAllTorrent, getLogs } from "./library/ajax";
import "./App.css";

function populateTorrentList(setTorrentList) {
  getAllTorrent().then((data) => {
    if (data.status === "success") setTorrentList(data.torrentList);
    else console.log("error", data);
  });
}

function App() {
  const [torrentList, setTorrentList] = useState([]);
  const [logs, setLogs] = useState([]);
  const [uid, setUid] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  const onMenuItemSelection = (i) => {
    setActiveTab(i);
    if (i === 1) historyList();
    if (i === 2) {
      localStorage.clear();
      setUid(null);
    }
  };

  const onInput = (data) => {
    addTorrent(data).then(console.log);
  };

  const historyList = () => {
    getLogs().then((resp) => {
      if (resp.status === "success") setLogs(resp.logs);
      else console.log(resp);
    });
  };

  useEffect(() => {
    setUid(window.localStorage.getItem("uid"));
    const event = setInterval(() => {
      populateTorrentList(setTorrentList);
    }, 1500);
    return () => clearInterval(event);
  }, []);

  const reload = (uid) => {
    window.localStorage.setItem("uid", uid);
    setUid(uid);
  };

  return (
    <div>
      <div className="w-full max-w-3xl mx-auto h-screen p-2">
        {uid ? (
          <React.Fragment>
            <Navbar onClick={onMenuItemSelection} active={activeTab} />
            <TorrentInput onUpdate={onInput} />
            {activeTab === 0
              ? torrentList.map((data, i) => <Torrent key={i} data={data} />)
              : logs.map((log) => (
                  <Log key={log.id} onDelete={() => historyList()} data={log} />
                ))}
          </React.Fragment>
        ) : (
          <Authenticate onSuccess={reload} />
        )}
      </div>
    </div>
  );
}

export default App;
