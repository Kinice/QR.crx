 //xhr object
    var xhr = new XMLHttpRequest()
    var url = 'http://kinice.top/api/qrimage'
    //Elements
    var textarea = document.getElementById('text'),
        btn = document.getElementById('btn'),
        qrcon = document.getElementById('qr')
    //get function
    var postRequest = function(text){
        xhr.open('POST',url,true)
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        xhr.send('text='+encodeURIComponent(text))
    }
    btn.onclick = function(e){
        e.preventDefault()
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