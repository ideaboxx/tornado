async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    referrerPolicy: "no-referrer",
    body: JSON.stringify(data),
  });
  return response.json();
}

export function addTorrent(input) {
  let payload = {};
  switch (input.type) {
    case "file":
      payload = { torrentFile: input.value };
      break;
    case "magnet":
      payload = { magnet: input.value };
      break;
    default:
      payload = { url: input.value };
      break;
  }
  return postData("/api/addTorrent", payload);
}

export function getAllTorrent() {
  return fetch("/api/getAllTorrents").then((data) => data.json());
}

export function getFiles(infoHash) {
  return postData("/api/getFiles", { infoHash });
}

export function deleteTorrent(infoHash) {
  return postData("/api/actionDelete", { infoHash });
}

export function getLogs() {
  return fetch("/api/getLogs").then((data) => data.json());
}

export function deleteLog(id) {
  return postData("/api/deleteLog", { id });
}

export function signin(email, password) {
  return postData("/api/signin", { email, password });
}

export function signup(email, password, key) {
  return postData("/api/signup", { email, password, key });
}
