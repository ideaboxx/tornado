import React from 'react';

const menuItems = [
    { lable: 'All Torrents', value: 0 },
    { lable: 'Active', value: 1 },
    { lable: 'Scheduled', value: 2 },
    { lable: 'Completed', value: 3 }
]

export default function Navbar(){
    return (
        <div className="w-64 h-full p-2 m-3">
            <h1 className="p-2 text-gray-700 text-lg">Tornedo</h1>
            {
                menuItems.map(item=>(
                    <div className="my-2 py-2 px-3 hover:bg-gray-200 text-blue-900 rounded-md">
                        {item.lable}
                    </div>
                ))
            }
        </div>
    )
} 