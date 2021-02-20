function log_in() {
    var kf = document.getElementById("fail_log_in")
    var ks = document.getElementById("success_log_in")
    kf.innerHTML = ""
    ks.innerHTML = ""
    var username = undefined
    
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var res = JSON.parse(xhttp.responseText);

            if (res.success) {
                var session_id = res.session_id
                var time_of_death = res.time_of_death
                setCookie('session_id', session_id);
                setCookie('username', username);
                ks.innerHTML = "Success"
                setTimeout(() => {
                  location.reload();
                }, 400)
            } else {
                kf.innerHTML = res.err
            }
        }
    };
    xhttp.open("POST", "/api/public/auth", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    username = document.getElementById("log_in_username").value
    xhttp.send(JSON.stringify({
        username: username,
        password: document.getElementById("log_in_password").value,
    }));
}

window.onload = async function() {
  var session_id = getCookie('session_id')
  var username = getCookie('username')
  if (username != undefined && session_id != undefined) {

    console.log(session_id, username)
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var res = JSON.parse(xhttp.responseText);

            if (res.success) {
              console.log(res)
              switch (res.role) {
                case 1:
                  window.location.replace("/organizer");
                  break;

                case 2:
                  window.location.replace("/admin");
                  break;
  
                case 3:
                  window.location.replace("/teacher");
                  break;
  
                case 4:
                  window.location.replace("/student");
                  break;
              }
            } else {
              console.log(res.err)
            }
        }
    };

    xhttp.open("GET", "/api/private/ping", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    username = document.getElementById("log_in_username").value
    xhttp.send();
  }

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
  