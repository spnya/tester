function log_in() {
    var kf = document.getElementById("fail_log_in")
    var ks = document.getElementById("success_log_in")
    kf.innerHTML = ""
    ks.innerHTML = ""

    
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var res = JSON.parse(xhttp.responseText);

            if (res.success) {
                var session_id = res.session_id
                var time_of_death = res.time_of_death
                setCookie('session_id', session_id)
                ks.innerHTML = "Success"
            } else {
                kf.innerHTML = res.err
            }
        }
    };
    xhttp.open("POST", "/api/public/auth", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify({
        username: document.getElementById("log_in_username").value,
        password: document.getElementById("log_in_password").value,
    }));
}

function setCookie(cname, cvalue) {
    var d = new Date
    d.setTime(d.getTime() + (1 * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
  
  function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  