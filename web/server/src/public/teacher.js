  function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
  }

  function reset() {
      load_groups()
      load_modules()
      load_tasks()
      load_modules_to_menu()
      load_tests()
      load_tests_optiom()
    }
  window.onload = async function() {
      reset()
  }

  groups = {

  }

  function focus_group(id) {
      let xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = async function() {
        if (this.readyState == 4 && this.status == 200) {
          var res = JSON.parse(xhttp.responseText);
                  if (res.success) {

                    let xhttp1 = new XMLHttpRequest();
                    xhttp1.onreadystatechange = async function() {
                      if (this.readyState == 4 && this.status == 200) {
                        var res1 = JSON.parse(xhttp1.responseText);
                                if (res1.success) {
                                    let root = document.getElementById("yes")
                                    root.innerHTML = ""
                                    console.log(res.group[0])
                                    for (let i in res.group[0].tests) {
                                        var child = document.createElement("button");
                                        child.classList.add("midle_menu");
                                        child.value = res.group[0].tests[i]
                                        for (let j in res1.tests) {
                                            if (res1.tests[j]._id == res.group[0].tests[i]) {
                                                child.innerHTML = res1.tests[j].name
                                            }
                                        }
                                        child.onclick = function() {load_students_rez(this.value)}
                                        root.appendChild(child);
                                    }
                                } else {
                                  console.log(res1)
                              }
                            }
                    };
                    
                    xhttp1.open("GET", "/api/teacher/get_tests", true);
                    xhttp1.setRequestHeader('Content-Type', 'application/json');
                    xhttp1.send(JSON.stringify({
                        '_id': id
                    }));




              
                  } else {
                    console.log(res)
                }
              }
      };
      
      xhttp.open("POST", "/api/teacher/get_group", true);
      xhttp.setRequestHeader('Content-Type', 'application/json');
      xhttp.send(JSON.stringify({
          '_id': id
      }));
  } 


  function add_task() {
      let ks = document.getElementById("success_add_task")
      let kf = document.getElementById("fail_add_task")
      kf.innerHTML = ""
      ks.innerHTML = ""

      let xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var res = JSON.parse(xhttp.responseText);
                  if (res.success) {
                    ks.innerHTML = "Success"
                  } else {
                    kf.innerHTML = res.err
                  }
              }
      };
      
      xhttp.open("POST", "/api/teacher/add_task", true);
      xhttp.setRequestHeader('Content-Type', 'application/json');
      xhttp.send(JSON.stringify({
          'name': document.getElementById("add_task_name").value,
          'description': document.getElementById("add_task_stor").value,
          'ans': document.getElementById("add_task_ans").value,
          'module': document.getElementById("select_module").value
      }));
  }
  function load_groups() {
      let xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var res = JSON.parse(xhttp.responseText);
                  if (res.success) {
                    let root = document.getElementById("groups_list")
                    let root2 = document.getElementById("select_group_add")
                    root.innerHTML = ""
                    root2.innerHTML = ""
                    for (let i in res.groups) {
                      var child = document.createElement("button");
                      child.classList.add("side_menu");
                      child.value = res.groups[i]._id;

                      child.onclick =  function() {focus_group(this.value)}
                      child.innerHTML = res.groups[i].name
                      groups[res.groups[i]._id] = {
                            name: res.groups[i].name,
                            students: res.groups[i].students
                      }

                      var kek = document.createElement("option");
                      kek.value = res.groups[i]._id
                      kek.innerHTML = res.groups[i].name


                      root2.appendChild(kek)
                      root.appendChild(child);
                    }
                  } else {
                    console.log(res.err)
                  }
              }
      };
      
      xhttp.open("GET", "/api/teacher/get_groups", true);
      xhttp.setRequestHeader('Content-Type', 'application/json');
      xhttp.send();
  }

  function add_module() {
      let ks = document.getElementById("success_add_module")
      let kf = document.getElementById("fail_add_module")
      ks.innerHTML = ""
      kf.innerHTML = ""

      let xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var res = JSON.parse(xhttp.responseText);
                  if (res.success) {
                      ks.innerHTML = "Success"
                  } else {
                      kf.innerHTML = res.err
                  }
              }
      };
      
      xhttp.open("POST", "/api/teacher/add_module", true);
      xhttp.setRequestHeader('Content-Type', 'application/json');
      xhttp.send(JSON.stringify({
          'name': document.getElementById("add_module_name").value
      }));
  }

  function load_modules() {
    let ks = document.getElementById("success_add_module")
    let kf = document.getElementById("fail_add_module")
    ks.innerHTML = ""
    kf.innerHTML = ""

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var res = JSON.parse(xhttp.responseText);
                if (res.success) {
                    ks.innerHTML = "Success"
                } else {
                    kf.innerHTML = res.err
                }
            }
    };
    
    xhttp.open("POST", "/api/teacher/add_module", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify({
        'name': document.getElementById("add_module_name").value
    }));
}


  function load_tests() {
      let xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var res = JSON.parse(xhttp.responseText);
                  if (res.success) {
                      let root = document.getElementById("select_test_add")
                      root.innerHTML = ""
                      for (let i in res.tests) {
                          var child = document.createElement("option");
                          child.innerHTML = res.tests[i].name
                          child.value = res.tests[i]._id
                          root.appendChild(child);
                      }
                  } else {
                      console.log(res.err)
                  }
              }
      };
      
      xhttp.open("GET", "/api/teacher/get_tests", true);
      xhttp.setRequestHeader('Content-Type', 'application/json');
      xhttp.send();
  }


  function load_tests_optiom() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var res = JSON.parse(xhttp.responseText);
                if (res.success) {
                    console.log(res)
                    let root = document.getElementById("select_module")
                    root.innerHTML = ""
                    for (let i in res.modules) {
                        var child = document.createElement("option");
                        child.innerHTML = res.modules[i].name
                        child.value = res.modules[i]._id
                        root.appendChild(child);
                    }
                } else {
                    console.log(res.err)
                }
            }
    };
    
    xhttp.open("GET", "/api/teacher/get_modules", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send();
}

  async function change_module() {
      let val = document.getElementById("select_module").value
      document.getElementById('chouse_module_form').style.display='none'
      document.getElementById('change_module_form_save_form').style.display='block';
      let xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = async function() {
        if (this.readyState == 4 && this.status == 200) {
          var res = JSON.parse(xhttp.responseText);
                  if (res.success) {
                      await sleep(400)
                      var arr = document.getElementsByClassName('table_group');
                      for(var i=0; i< arr.length; i++){
                        if (res.module.tasks.includes(arr[i].value)) {
                          arr[i].checked = true;                          
                      }
                  }
                  } else {
                      console.log(res.err)
                  }
              }
      };
      
      xhttp.open("POST", "/api/teacher/get_module", true);
      xhttp.setRequestHeader('Content-Type', 'application/json');
      xhttp.send(JSON.stringify({
          '_id': val
      }));
  }

  function rand_clicker() {
    var f = Math.round(Math.random()*10000)
  }
  function load_tasks() {
      let xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var res = JSON.parse(xhttp.responseText);
                  if (res.success) {
                      var element = document.querySelector("#tasks_modules_lel");
                      element.innerHTML = ""
                      for (let i in res.tasks) {
                          var child = document.createElement("tr");
                          child.innerHTML = 
                              "<td>"+res.tasks[i].name+"</td>"+
                              "<td>"+`
                              <label class="switch">
                              <input class = "toggle table_group" value = "${res.tasks[i]._id}" type="checkbox">
                              <span class="slider round"></span>
                              </label>
                              `+"</td>"
            
                          child.value = res.tasks[i]._id
                          //child.classList.add("table_group");
                          element.appendChild(child);
                      }
                  } else {
                      console.log(res)
                  }
              }
      };
      
      xhttp.open("GET", "/api/teacher/get_tasks", true);
      xhttp.setRequestHeader('Content-Type', 'application/json');
      xhttp.send();
  }

function load_modules_to_menu() {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = async function() {
    if (this.readyState == 4 && this.status == 200) {
      var res = JSON.parse(xhttp.responseText);
              if (res.success) {
                  var element = document.querySelector("#modules_creating");
                  element.innerHTML = ""
                  console.log(res.modules)
                  for (let i in res.modules) {
                      var child = document.createElement("tr");
                      let strings_op = ""
                      for (let j = 0; j <= res.modules[i].tasks.length; j+=1) {
                        strings_op += `<option value="${j}">${j}</option>`
                    }
                    await sleep(100)
                      child.innerHTML = 
                          "<td>"+res.modules[i].name+"</td>"+
                          "<td>"+`
                          <select class = "test_modules_selector" id="${res.modules[i]._id}">${strings_op}</select>
                          `+"</td>"

                        await sleep(5)
                      child.value = res.modules[i]._id
                      element.appendChild(child);
                  }
              } else {
                  console.log(res)
              }
          }
  };
  
  xhttp.open("GET", "/api/teacher/get_modules", true);
  xhttp.setRequestHeader('Content-Type', 'application/json');
  xhttp.send();
}

async function add_test() {
    let h = document.getElementById('add_test_h').value
    let min = document.getElementById('add_test_m').value
    let d = document.getElementById('add_test_d').value
    let mou = document.getElementById('add_test_mou').value
    let y = document.getElementById('add_test_y').value
    let datet = new Date(y, mou-1, d, h, min, 0);
    let timestamp = datet.valueOf()
    let test_name = document.getElementById('add_test_name').value
    let test_dur = parseInt(document.getElementById('add_test_duration').value)*60*1000
    var arr = document.getElementsByClassName('test_modules_selector');
    let test_arr = {}
    for (let i = 0; i < arr.length; i += 1) {
        if (arr[i].value > 0) {
            test_arr[arr[i].id] = arr[i].value
        }
    }
    let ks = document.getElementById("add_test_s1")
    let kf = document.getElementById("add_test_f")
    ks.innerHTML = ""
    kf.innerHTML = ""
    await sleep(100)
    console.log(timestamp, test_name, test_dur)

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = async function() {
      if (this.readyState == 4 && this.status == 200) {
        var res = JSON.parse(xhttp.responseText);
                if (res.success) {
                    ks.innerHTML = "Success"    
                } else {
                    kf.innerHTML = res.err
                }
            }
    };
    
    xhttp.open("POST", "/api/teacher/add_test", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify({
        'name': test_name,
        'start_time': timestamp,
        'end_time': timestamp+test_dur,
        'options': test_arr
    }));

}

function add_test_to_group() {
    let ks = document.getElementById("add_test_to_group_s")
    let kf = document.getElementById("add_test_to_group_f")
    ks.innerHTML = ""
    kf.innerHTML = ""

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var res = JSON.parse(xhttp.responseText);
                if (res.success) {
                    ks.innerHTML = "Success"
                } else {
                    kf.innerHTML = res.err
                }
            }
    };
    
    xhttp.open("POST", "/api/teacher/add_test_to_group", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify({
        'test_id': document.getElementById("select_test_add").value,
        'group_id': document.getElementById("select_group_add").value
    }));
}
//<li class="in"><span class="keks">Уханов Саша</span><span class="keks1"><span id="kek">10</span>/ 100</span></li>

function load_students_rez(_id) {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var res = JSON.parse(xhttp.responseText);
              if (res.success) {
                console.log(res)
                let root = document.getElementById("ggg")
                root.innerHTML = ""
                for (let i in res.rez) {
                  var child = document.createElement("li");
                  child.classList.add("in");
                  if (res.rez[i].k.mark != undefined) {
                    child.innerHTML = `<span class="keks">${res.rez[i].second_name} ${res.rez[i].first_name}</span> <span class="keks1"><span id="kek">${res.rez[i].k.mark}</span>/ 100</span>`
                    root.appendChild(child);
                  }
                }
              } else {
                console.log(res)
              }
          }
  };
  
  xhttp.open("POST", "/api/teacher/get_test_rez", true);
  xhttp.setRequestHeader('Content-Type', 'application/json');
  xhttp.send(JSON.stringify({
      '_id': _id,
  }));
}