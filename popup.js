//xhr object
var xhr = new XMLHttpRequest()
var url = 'http://kinice.top/api/qrimage'
var qrurl = localStorage.qrurl || '';
//Elements
var textarea = document.getElementById('text'),
    btn = document.getElementById('btn'),
    thisbtn = document.getElementById('this-btn'),
    qrcon = document.getElementById('qr')
//get function
var postRequest = function(text){
    xhr.open('POST',url,true)
    xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded")
    xhr.send('text='+encodeURIComponent(text))
}

if(qrurl!==''){
    textarea.value = qrurl
}

btn.onclick = function(e){
    e.preventDefault()
    if(textarea.value == '') return
    localStorage.qrurl = textarea.value
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
            if(xhr.status == 200){
                var data = JSON.parse(xhr.responseText)
                qrcon.innerHTML = data.qr_string
            }else{
                console.log(xhr.statusText)
            }
        }
    }
    postRequest(textarea.value)
}

thisbtn.onclick = function(e){
    e.preventDefault()
    
    chrome.tabs.getSelected(null, function (tab) {
        textarea.value = tab.url
        if(textarea.value == '') return
        localStorage.qrurl = textarea.value
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4){
                if(xhr.status == 200){
                    var data = JSON.parse(xhr.responseText)
                    qrcon.innerHTML = data.qr_string
                }else{
                    console.log(xhr.statusText)
                }
            }
        }
        postRequest(textarea.value)
    });
}