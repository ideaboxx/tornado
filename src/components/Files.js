import React, { useEffect, useState } from "react";
import { formatBytes, round } from "../library/helper";
import { getFiles } from "../library/ajax";

export default function Files({ infoHash }) {
  const [files, setFiles] = useState([{ name: "Loading.." }]);

  useEffect(() => {
    const i = setInterval(async () => {
      const res = await getFiles(infoHash);
      if (res.status === "success") setFiles(res.files);
      else console.log(res);
    }, 1500);
    return () => clearInterval(i);
  });

  return (
    <table className="table-auto w-full text-gray-800 text-sm">
      <tbody>
        {files.map((file) => (
          <tr key={file.name}>
            <td className="border px-2 py-2">
              <a
                href={"/downloads/" + file.path}
                target="_blank"
                className="hover:text-blue-600"
              >
                {file.name}
              </a>
            </td>
            <td className="border px-2 py-2">{formatBytes(file.length)}</td>
            <td className="border px-2 py-2">
              {round(file.progress * 100, 1)}%
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
