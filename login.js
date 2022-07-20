var socket = io();

var user = document.getElementById("user");
var pass = document.getElementById("pass");

function checkLogin(){
  if(user.value == "" || pass.value == "")
    alert("missing field");

  else
    socket.emit('checkLogin', user.value, pass.value);
}

function signUp(){
  if(user.value == "" || pass.value == "")
    alert("missing field");
  
  if(user.value.length < 6 || pass.value.length < 6)
    alert("your fields need to be at least 6 characters long");
  
  else
    socket.emit('signUp', user.value, pass.value);
  
}

socket.on('checkLogin', function (user, pass, elo) {
  sessionStorage.setItem("user", user);
  sessionStorage.setItem("pass", pass);
  sessionStorage.setItem("elo", elo);
  console.log(sessionStorage.getItem("elo"));

 $("body").load("room.html");
});

socket.on('alert', function (msg) {
  alert(msg);
});