var socket = io.connect();
var template = '<div>File: :name<br>Downloaded: :downloaded/:size (:percentage)</div>';

function formatBytes(bytes,decimals) {
  if(bytes == 0) return '0 Bytes';
  var k = 1024,
      dm = decimals <= 0 ? 0 : decimals || 2,
      sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

socket.on('disconnect',function(){
  alert("Disconnected from server..");
});

socket.on('alert-message',function(msg){
  $("#status_msg").text(msg)
});

socket.on('get-update', function (data) {

  var name = data.name;
  var downloadSpeed = formatBytes(data.downloadSpeed) + '/s'
  var progress = (data.progress * 100).toFixed(2) + '%';
  var downloaded = formatBytes(data.downloaded);

  $('#torrent-name').text(name)
  $('#torrent-downloadSpeed').text(downloadSpeed)
  $('#torrent-progress').text(progress)
  $('#torrent-downloaded').text(downloaded)

  var temp = "";
  for(var i=0, length=data.files.length; i < length; i++){
    var progress = ((data.files[i].downloaded/data.files[i].length) * 100).toFixed(2);
    var downloaded = formatBytes(data.files[i].downloaded);
    var size = formatBytes(data.files[i].length);

    var t = template.replace(':name', data.files[i].filename)
            .replace(':downloaded', downloaded)
            .replace(':size', size)
            .replace(':percentage', progress)
    temp += t;
  }
  $("#torrent-files").html(temp);
  if(data.progress != 1){
    setTimeout(function(){
      socket.emit('get-update','');
    }, 1000)
  }
});

$(document).ready(function(){
  $("#submit_btn").click(function(){
    var magnet = $(".mgnt_link").val();
    socket.emit('magnet', { magnet: magnet});

    setTimeout(function(){
      socket.emit('get-update','');
    }, 1000)
  })

  $("#delete_btn").click(function(){
    socket.emit('destroy-torrent');
  })

  $("#progress_btn").click(function(){
    socket.emit('get-update');
  })

})

