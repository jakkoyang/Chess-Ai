var loadColor = function(color){
  wrap = document.getElementById("wrap");
  document.getElementById("wrap").style.borderColor = color;
  document.getElementById("wrap").style.filter = `drop-shadow(0 0 0.75rem ${color})`;
  var inputs = document.getElementsByTagName('button');
  for(var i = 0; i < inputs.length; i++) {
    inputs[i].style.backgroundColor = color;
  }
  let root = document.documentElement;
  root.style.setProperty('--blackcolor', localStorage.getItem("boardBlack"));
  root.style.setProperty('--whitecolor', localStorage.getItem("boardWhite"));
}
loadColor(localStorage.getItem('color'));
