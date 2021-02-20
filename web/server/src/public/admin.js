function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function reg_new() {
  var kf = document.getElementById("fail_add_user")
  var ks = document.getElementById("success_add_user")
  kf.innerHTML = ""
  ks.innerHTML = ""
  
  var xhttp1 = new XMLHttpRequest();
  xhttp1.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          var res = JSON.parse(xhttp1.responseText);
          if (res.success) {
              ks.innerHTML = "Success"
          } else {
              kf.innerHTML = res.err
          }
      }
  };
  xhttp1.open("POST", "/api/admin/reg_user", true);
  xhttp1.setRequestHeader('Content-Type', 'application/json');
  xhttp1.send(JSON.stringify({
      username: document.getElementById("add_user_username").value,     
      password: document.getElementById("add_user_password").value,
      role: parseInt(document.getElementById("add_user_role").value),
      first_name: document.getElementById("add_user_fname").value,
      second_name: document.getElementById("add_user_sname").value
  }));
}

function add_group() {
  var kf = document.getElementById("fail_add_group")
  var ks = document.getElementById("success_add_group")
  kf.innerHTML = ""
  ks.innerHTML = ""
  
  var xhttp2 = new XMLHttpRequest();

  xhttp2.onreadystatechange = function() {
      console.log(xhttp2)
    if (this.readyState == 4 && this.status == 200) {
        var res = JSON.parse(xhttp2.responseText);
        console.log(res)
        if (res.success) {
          ks.innerHTML = "Success"
        } else {
          kf.innerHTML = res.err
        }
      }
  };
  xhttp2.open("POST", "/api/admin/add_group", true);
  xhttp2.setRequestHeader('Content-Type', 'application/json');

  xhttp2.send(JSON.stringify({
    name: document.getElementById("add_group_name").value,
    teacher_id: document.getElementById("select_teacher").value,
  }));
}

async function change_group() {
  var kf = document.getElementById("fail_add_group")
  var ks = document.getElementById("success_add_group")
  document.getElementById('add_user_to_group').style.display='none'
  document.getElementById('change_group').style.display='block';
  await get_users_to_change()
  await get_users_in_group()
}

async function get_users_to_change() {
  let xhttp5 = new XMLHttpRequest();
  xhttp5.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var res = JSON.parse(xhttp5.responseText);
      if (res.success) {
        console.log(res)
        var element = document.querySelector("#users_in_group");
        element.innerHTML = ""
        for (let i in res.students) {
              var child = document.createElement("tr");
              child.innerHTML = 
                  "<td>"+res.students[i].username+"</td>"+
                  "<td>"+res.students[i].first_name+"</td>"+
                  "<td>"+res.students[i].second_name+"</td>"+
                  "<td>"+`
                  <label class="switch">
                  <input class = "toggle table_group" value = "${res.students[i]._id}" type="checkbox">
                  <span class="slider round"></span>
                  </label>
                  `+"</td>"

              child.value = res.students[i]._id
              //child.classList.add("table_group");
              element.appendChild(child);
          }
      } else {
        console.log(res.err)
      }
    }
  };
  
  xhttp5.open("GET", "/api/admin/get_students", true);
  xhttp5.setRequestHeader('Content-Type', 'application/json');
  xhttp5.send();
}

async function save_group() {
  let xhttp7 = new XMLHttpRequest();
  xhttp7.onreadystatechange = async function() {
    if (this.readyState == 4 && this.status == 200) {
      var res = await JSON.parse(xhttp7.responseText);
      if (res.success) {
        var arr = document.getElementsByClassName('table_group');
        console.log(arr)
        for(var i=0; i< arr.length; i++){
          console.log(arr[i].value, arr[i].checked);
          if (arr[i].checked && !(res.group.students.includes(arr[i].value))) {
            await user_add_to_group(arr[i].value, document.getElementById("select_group").value)
          }
          if (!(arr[i].checked) && res.group.students.includes(arr[i].value)) {
            await user_del_from_group(arr[i].value, document.getElementById("select_group").value)
          }
          await sleep(20)
          document.getElementById("kek_change_group").innerHTML = (i+1 + ' / ' +  arr.length).toString();
        }
        document.getElementById("kek_change_group").innerHTML = "Saved";
      } else {
        console.log(res.err)
      }
    }
  };
  
  xhttp7.open("POST", "/api/admin/get_group", true);
  xhttp7.setRequestHeader('Content-Type', 'application/json');
  xhttp7.send(JSON.stringify({
    '_id': document.getElementById("select_group").value
  }));
}


function user_del_from_group(user, group) {
  console.log('del', user, group)
  let xhttp9 = new XMLHttpRequest();
  xhttp9.onreadystatechange = async function() {
    if (this.readyState == 4 && this.status == 200) {
      var res = await JSON.parse(xhttp9.responseText);
      if (res.success) {
        console.log('-')
      } else {
        console.log(res.err)
      }
    }
  };
  
  xhttp9.open("POST", "/api/admin/del_user_from_group", true);
  xhttp9.setRequestHeader('Content-Type', 'application/json');
  xhttp9.send(JSON.stringify({
    "student_id":user,
    "group_id": group,
  }))
}

function user_add_to_group(user, group) {
  console.log('add', user, group)
  let xhttp8 = new XMLHttpRequest();
  xhttp8.onreadystatechange = async function() {
    if (this.readyState == 4 && this.status == 200) {
      var res = await JSON.parse(xhttp8.responseText);
      if (res.success) {
        console.log('+')
      } else {
        console.log(res.err)
      }
    }
  };
  
  xhttp8.open("POST", "/api/admin/add_user_to_group", true);
  xhttp8.setRequestHeader('Content-Type', 'application/json');
  xhttp8.send(JSON.stringify({
    "student_id":user,
    "group_id": group,
  }))
}

async function get_users_in_group() {
  let xhttp6 = new XMLHttpRequest();
  xhttp6.onreadystatechange = async function() {
    if (this.readyState == 4 && this.status == 200) {
      var res = JSON.parse(xhttp6.responseText);
      if (res.success) {
        await sleep(200)
        await sleep(200)
        var arr = document.getElementsByClassName('table_group');
        console.log(arr)
        for(var i=0; i< arr.length; i++){
          console.log(123)
          if (res.group.students.includes(arr[i].value)) {
            arr[i].checked = true;
          }
          console.log(arr[i].value);
        }
    
      } else {
        console.log(res.err)
      }
    }
  };
  
  xhttp6.open("POST", "/api/admin/get_group", true);
  xhttp6.setRequestHeader('Content-Type', 'application/json');
  xhttp6.send(JSON.stringify({
    '_id': document.getElementById("select_group").value
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
  
function load_teachers() {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var res = JSON.parse(xhttp.responseText);
              if (res.success) {
                var element = document.querySelector("#select_teacher");
                element.innerHTML = ""
                for (let i in res.teachers) {
                  console.log(res.teachers[i])
                  var child = document.createElement("option");
                  child.innerHTML = res.teachers[i].first_name + ' ' + res.teachers[i].second_name
                  child.value = res.teachers[i]._id
                  element.appendChild(child);
                }
                console.log(res)
              } else {
                console.log(res.err)
              }
          }
  };
  
      xhttp.open("GET", "/api/admin/get_teachers", true);
      xhttp.setRequestHeader('Content-Type', 'application/json');
      xhttp.send();
}
  
function load_groups() {
  let xhttp3 = new XMLHttpRequest();
  xhttp3.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var res = JSON.parse(xhttp3.responseText);
              if (res.success) {
                var element = document.querySelector("#select_group");
                element.innerHTML = ""
                for (let i in res.groups) {
                  console.log(res.groups[i])
                  var child = document.createElement("option");
                  child.innerHTML = res.groups[i].name
                  child.value = res.groups[i]._id
                  element.appendChild(child);
                }
                console.log(res)
              } else {
                console.log(res.err)
              }
          }
  };
  
  xhttp3.open("GET", "/api/admin/get_groups", true);
  xhttp3.setRequestHeader('Content-Type', 'application/json');
  xhttp3.send();
}
function reset() {
  load_teachers()
  load_groups()
}
window.onload = async function() {
  reset()
}
