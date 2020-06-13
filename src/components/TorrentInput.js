import React, { useState } from 'react'

export default function TorrentInput({ onUpdate }){
    const [ inputText, setInputText ] = useState('')

    const onChange = (e) => {
        if(e.target.type === 'file'){
            const reader = new FileReader()
            reader.addEventListener('load', (event) => {
                const base64 = event.target.result
                onUpdate({
                    type: 'file',
                    value: base64.replace('data:application/x-bittorrent;base64,','')
                })
            })
            reader.readAsDataURL(e.target.files[0])
        } else {
            onUpdate({
                type: inputText.startsWith("magnet") ? 'magnet':'url',
                value: inputText
            })
            setInputText('')
        }
    }

    return (
        <div className="flex my-3 p-1 border border-gray-400 rounded-md">
            <input type="text" placeholder="Enter magnet link or torrent file"
                value={inputText}
                onChange={(e)=>setInputText(e.target.value)}
                className="w-full focus:outline-none px-2"/>
            <button className="bg-green-100 px-3 hover:bg-green-200 focus:outline-none" onClick={onChange}>
                <svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M8 3.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5H4a.5.5 0 0 1 0-1h3.5V4a.5.5 0 0 1 .5-.5z"/>
                    <path fillRule="evenodd" d="M7.5 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0V8z"/>
                    <path fillRule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                </svg>
            </button>
            <input onChange={onChange} type="file" id="BtnBrowseHidden" name="files" style={{"display": "none"}} />
            <label htmlFor="BtnBrowseHidden" className="bg-gray-100 p-2 px-3 hover:bg-gray-200">
                <svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 1H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h5v-1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h5v2.5A1.5 1.5 0 0 0 10.5 6H13v2h1V6L9 1z"/>
                    <path fillRule="evenodd" d="M13.5 10a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1H13v-1.5a.5.5 0 0 1 .5-.5z"/>
                    <path fillRule="evenodd" d="M13 12.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0v-2z"/>
                </svg>
            </label>
        </div>
    )
}