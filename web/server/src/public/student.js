window.onload = async function() {
    reset()
}

function reset() {
    load_tests()
    
}

test_focused = undefined
function load_tests() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var res = JSON.parse(xhttp.responseText);
                if (res.success) {
                    console.log(res.tests)
                    let root = document.getElementById("tests_list")
                    root.innerHTML = ""
                    for (let i in res.tests) {
                        var child = document.createElement("li");
                        child.classList.add("in");
                        if (res.tests[i][0].results == undefined) {
                            child.innerHTML = `<span class="keks">${res.tests[i][0].name}</span><span class="keks1"><button onclick = "start_test(this.value)"class = "start_test_btn" value = "${res.tests[i][0]._id}">Начать тест</button></span>`
                            child.value = res.tests[i]._id
                            root.appendChild(child);
                            continue
                        }  
                        if (res.tests[i][0].results.status == 1) {
                            child.innerHTML = `<span class="keks">${res.tests[i][0].name}</span><span class="keks1"><button onclick = "view_test(this.value)"class = "start_test_btn" value = "${res.tests[i][0]._id}">Тест идет...</button></span>`
                        }
                        if (res.tests[i][0].results.status == 2) {
                            child.innerHTML = `<span class="keks">${res.tests[i][0].name}</span><span class="keks1">${res.tests[i][0].results.mark} / 100</span>`
                        }
                        child.value = res.tests[i]._id
                        root.appendChild(child);
                    }
                } else {
                    console.log(res)
                }
            }
    };
    
    xhttp.open("GET", "/api/student/get_tests", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send();
}

function start_test(_id) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var res = JSON.parse(xhttp.responseText);
                if (res.success) {
                    console.log(res)
                    reset()
                } else {
                    console.log(res)
                }
            }
    };
    
    xhttp.open("POST", "/api/student/start_test", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify({
        "_id": _id
    }));
}

function view_test(_id) {
    reset()
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var res = JSON.parse(xhttp.responseText);
                if (res.success) {
                    console.log(res)
                    let root = document.getElementById("yes")
                    root.innerHTML = ""
                    for (let i in res.tasks) {
                        var child = document.createElement("div");
                        child.classList.add("kekss");
                        child.classList.add("bords");
                        child.innerHTML = 
                        `
                        <label for="uname"><b>${res.tasks[i].name}</b></label>
                        <div>${res.tasks[i].description}</div>
                        <input id = "${res.tasks[i]._id}" type="text" placeholder="Ответ" name="username" required>
                        <button value = ${res.tasks[i]._id} onclick="save_ans(this.value)" >Cохранить ответ</button>
                        `
                        root.appendChild(child)
                    }
                    var child = document.createElement("button");
                    child.onclick = function() {end_test()} 
                    child.style = "width: auto; background-color: coral; float: left"
                    child.innerHTML = "Закончить тест"
                    root.appendChild(child)
                } else {
                    console.log(res)
                }
            }
    };
    
    xhttp.open("POST", "/api/student/get_test", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    test_focused = _id
    xhttp.send(JSON.stringify({
        "_id": _id
    }));
}

function save_ans(_id) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var res = JSON.parse(xhttp.responseText);
                if (res.success) {
                    alert("Ответ сохранен")
                } else {
                    console.log(res)
                }
            }
    };
    
    xhttp.open("POST", "/api/student/save_ans", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify({
        "test_id": test_focused,
        "task_id": _id,
        "ans": document.getElementById(_id).value
    }));
}

function end_test() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var res = JSON.parse(xhttp.responseText);
                if (res.success) {
                    alert("Ответ сохранен")
                } else {
                    console.log(res)
                }
            }
    };
    
    xhttp.open("POST", "/api/student/end_test", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify({
        "test_id": test_focused,
    }));
}