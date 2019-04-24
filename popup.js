//xhr object
var xhr = new XMLHttpRequest()
var url = 'http://kinice.top/api/qrimage'
//var url = 'http://localhost:3000/api/qrimage'
var qrurl = localStorage.qrurl || ''
var imgBase64 = ''
//Elements
var textarea = document.getElementById('text'),
    btn = document.getElementById('btn'),
    thisbtn = document.getElementById('this-btn'),
    downloadBtn = document.getElementById('download'),
    qrcon = document.getElementById('qr')
//get function
var postRequest = function(text){
    xhr.open('POST',url,true)
    xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded")
    xhr.send('text='+encodeURIComponent(text))
}

if (qrurl !==' ') {
    textarea.value = qrurl
}

function createImg(data) {
    var img = document.createElement('img')
    img.src = `data:image/png;base64,${data}`
    return img
}

function createAhref(data) {
    var a = document.createElement('a')
    a.href = data
    a.download = 'qr.png'
    return a
}

function fakeMouthEvent(target, eventName) {
    const event = document.createEvent('MouseEvents')
    event.initMouseEvent(eventName, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    target.dispatchEvent(event)
}

function base64ToBlob(base64) {
    let contentType = 'image/png'
    let raw = window.atob(base64)
    let rawLength = raw.length

    let uInt8Array = new Uint8Array(rawLength)

    for (let i = 0; i < rawLength; i++) {
        uInt8Array[i] = raw.charCodeAt(i)
    }
    return new Blob([uInt8Array], {type: contentType})
}

btn.onclick = function(e) {
    e.preventDefault()
    if(textarea.value == '') return
    localStorage.qrurl = textarea.value
    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                var data = JSON.parse(xhr.responseText)
                imgBase64 = data.png_string
                qrcon.innerHTML = data.svg_string
            } else {
                console.log(xhr.statusText)
            }
        }
    }
    postRequest(textarea.value)
}

thisbtn.onclick = function(e) {
    e.preventDefault()

    chrome.tabs.getSelected(null, function (tab) {
        textarea.value = tab.url
        if(textarea.value == '') return
        localStorage.qrurl = textarea.value
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4){
                if(xhr.status == 200){
                    var data = JSON.parse(xhr.responseText)
                    imgBase64 = data.png_string
                    qrcon.innerHTML = data.svg_string
                }else{
                    console.log(xhr.statusText)
                }
            }
        }
        postRequest(textarea.value)
    })
}

downloadBtn.onclick = function(e) {
    e.preventDefault()
    if (imgBase64 === '') return
    var a = createAhref(URL.createObjectURL(base64ToBlob(imgBase64)))
    fakeMouthEvent(a, 'click')
}
