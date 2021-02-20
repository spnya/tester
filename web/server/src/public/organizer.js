function see_student_marks() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var res = JSON.parse(xhttp.responseText);
        console.log(res)
                if (res.success) {
                    let root = document.getElementById("select_person")
                    root.innerHTML = ""
                    for (let i in res.students) {
                        var child = document.createElement("option");
                        child.innerHTML = res.students[i].first_name + ' ' + res.students[i].second_name
                        child.value = res.students[i]._id
                        root.appendChild(child);
                    }
                } else {
                    console.log(res.err)
                }
            }
    };
    
    xhttp.open("GET", "/api/organizer/get_students", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send();
}

function load_student_marks() {

    document.getElementById('see_stundets_marks_from').style.display='none'
    document.getElementById('marks_table_form').style.display='block';
    let _id = document.getElementById("select_person").value

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var res = JSON.parse(xhttp.responseText);
                if (res.success) {
                    console.log(res)
                    var element = document.querySelector("#marks_table");
                    element.innerHTML = ""
                    for (let i in res.ans) {
                        var child = document.createElement("tr");
                        child.innerHTML = 
                            "<td>"+res.ans[i].name+"</td>"+
                            "<td>"+res.ans[i].mark+"/100</td>"
          
                        element.appendChild(child);
                    }
                } else {
                    console.log(res.err)
                }
            }
    };
    
    xhttp.open("POST", "/api/organizer/get_student_marks", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify({
        '_id': _id
    }));
}

function reset() {

}

function load_teachers_to_form() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var res = JSON.parse(xhttp.responseText);
        console.log(res)
                if (res.success) {
                    let root = document.getElementById("select_teacher_groups_k")
                    root.innerHTML = ""
                    for (let i in res.teachers) {
                        var child = document.createElement("option");
                        child.innerHTML = res.teachers[i].first_name + ' ' + res.teachers[i].second_name
                        child.value = res.teachers[i]._id
                        root.appendChild(child);
                    }
                } else {
                    console.log(res.err)
                }
            }
    };
    
    xhttp.open("GET", "/api/organizer/get_teachers", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send();
}

function load_groups_of_teacher() {

    document.getElementById('focus_teacher_form').style.display='none'
    document.getElementById('focus_teacher_groups_form').style.display='block';
    let _id = document.getElementById("select_teacher_groups_k").value

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var res = JSON.parse(xhttp.responseText);
                if (res.success) {
                    console.log(res)
                    //select_group_of_teacher
                    let root = document.getElementById("select_group_of_teacher")
                    root.innerHTML = ""
                    for (let i in res.groups) {
                        var child = document.createElement("option");
                        child.innerHTML = res.groups[i].name
                        child.value = res.groups[i]._id
                        root.appendChild(child);
                    }
                } else {
                    console.log(res.err)
                }
            }
    };
    xhttp.open("POST", "/api/organizer/get_teacher_groups", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify({
        '_id': _id
    }));
}

function load_students_in_groups() {
    document.getElementById('focus_teacher_groups_form').style.display='none'
    document.getElementById('list_groups_table_form').style.display='block';
    let _id = document.getElementById("select_group_of_teacher").value

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var res = JSON.parse(xhttp.responseText);
                if (res.success) {
                    console.log(res.group.students)
                    
                    let xhttp1 = new XMLHttpRequest();
                    xhttp1.onreadystatechange = async function() {
                      if (this.readyState == 4 && this.status == 200) {
                        var res1 = JSON.parse(xhttp1.responseText);
                                if (res1.success) {
                                    
                                    var element = document.querySelector("#users_in_groups");
                                    element.innerHTML = ""
                                    for (let i in res.group.students) {
                                        var child = document.createElement("tr");
                                        for (let j in res1.students) {
                                            if (res1.students[j]._id == res.group.students[i]) {
                                                child.innerHTML = 
                                                "<td>"+res1.students[j].first_name + ' ' + res1.students[j].second_name +"</td>"
                                            }
                                        }

                                        element.appendChild(child);
                                    }
                                    
                                } else {
                                    console.log(res.err)
                                }
                            }
                    };
                    
                    xhttp1.open("GET", "/api/organizer/get_students", true);
                    xhttp1.setRequestHeader('Content-Type', 'application/json');
                    xhttp1.send();

                } else {
                    console.log(res.err)
                }
            }
    };
    
    xhttp.open("POST", "/api/organizer/get_group", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify({
        '_id': _id
    }));
}

function load_tests_to_show() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var res = JSON.parse(xhttp.responseText);
                if (res.success) {
                    var element = document.querySelector("#tests_of_all_time");
                    element.innerHTML = ""
                    for (let i in res.tests) {
                        var child = document.createElement("tr");
                        child.classList.add("date_kek");

                        var a = new Date(res.tests[i].start_time * 1000);
                        child.innerHTML = 
                            "<td>"+res.tests[i].name+"</td>"+
                            "<td>"+a.toString()+"</td>"
          
                        element.appendChild(child);
                    }
                } else {
                    console.log(res.err)
                }
            }
    };
    
    xhttp.open("GET", "/api/organizer/get_tests", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send();
}
/*
function load_tests_to_show() {

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = async function() {
      if (this.readyState == 4 && this.status == 200) {
        var res = JSON.parse(xhttp.responseText);

            if (res.success) {
                    let root = document.getElementById("tests_of_all_time")
                    root.innerHTML = ""
                    for (let i in res.tests) {
                        console.log(res.tests[i].name)
                        let child1 = document.createElement("option");
                        child1.innerHTML = res.tests[i].name
                        child1.value = res.tests[i]._id
                        await root.appendChild(child1);

                    }
                } else {
                    console.log(res.err)
                }
            }
    };
    
    xhttp.open("GET", "/api/organizer/get_tests", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send();
}*/
//select_test_to_show super_table
function load_new_show_marks_form() {
    document.getElementById('select_test_mark_show').style.display='none'
    document.getElementById('new_marks_table').style.display='block';
    let _id = document.getElementById("select_test_to_show").value
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var res = JSON.parse(xhttp.responseText);
                if (res.success) {
                    let xhttp1 = new XMLHttpRequest();
                    xhttp1.onreadystatechange = function() {
                      if (this.readyState == 4 && this.status == 200) {
                        var res1 = JSON.parse(xhttp1.responseText);
                                if (res1.success) {
                                    

                                    var element = document.querySelector("#super_table");
                                    element.innerHTML = ""
                                    for (let i in res.tests.results) {
                                        var child = document.createElement("tr");
                                        for (let j in res1.students) {
                                            console.log(i, res1.students[j]._id, res1.students[j]._id == i)
                                            if (res1.students[j]._id == i) {
                                                child.innerHTML = 
                                                "<td>"+res1.students[j].first_name + ' ' + res1.students[j].second_name +"</td>"
                                              + "<td>"+res.tests.results[i].mark+"/100</td>"
                                            
                                            }
                                        }
                                        element.appendChild(child);
                                    }

                                } else {
                                    console.log(res1.err)
                                }
                            }
                    };
                    
                    xhttp1.open("GET", "/api/organizer/get_students", true);
                    xhttp1.setRequestHeader('Content-Type', 'application/json');
                    xhttp1.send();
                } else {
                    console.log(res.err)
                }
            }
    };
    
    xhttp.open("POST", "/api/organizer/get_test", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify({
        '_id': _id
    }));
}

function load_tasks_kkk() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var res = JSON.parse(xhttp.responseText);
        console.log(res)
                if (res.success) {
                    let root = document.getElementById("super_selector")
                    root.innerHTML = ""
                    for (let i in res.tasks) {
                        var child = document.createElement("option");
                        child.innerHTML = res.tasks[i].name
                        child.value = res.tasks[i]._id
                        root.appendChild(child);
                    }
                } else {
                    console.log(res.err)
                }
            }
    };


    xhttp.open("GET", "/api/organizer/get_tasks", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send();
}


function chouse_task() {

    document.getElementById('load_all_tasks_form_d').style.display='none'
    document.getElementById('loaded_tasks_kekekek').style.display='block';
    let _id = document.getElementById("super_selector").value

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var res = JSON.parse(xhttp.responseText);
                if (res.success) {
                    console.log(res)
                    document.getElementById('ftask_name').innerHTML = res.tasks.name
                    document.getElementById('ftask_dicr').innerHTML = res.tasks.description
                    document.getElementById('ansssdasd').innerHTML = res.tasks.ans

                } else {
                    console.log(res.err)
                }
            }
    };
    
    xhttp.open("POST", "/api/organizer/get_task", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify({
        '_id': _id
    }));
}

function load_tests_to_show123() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var res = JSON.parse(xhttp.responseText);
        console.log(res)
                if (res.success) {
                    let root = document.getElementById("select_test_to_show")
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
    
    xhttp.open("GET", "/api/organizer/get_tests", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send();
}
