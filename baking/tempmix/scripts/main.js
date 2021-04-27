document.getElementById('v1').select();  // Only line changed later in my second page with JavaScript

function calc() {
  let outPut = document.querySelector('output');
  let v1 = document.getElementById('v1').value;
  let v2 = document.getElementById('v2').value;
  let v3 = document.getElementById('v3').value;
  let t1 = document.getElementById('t1').value;
  let t2 = document.getElementById('t2').value;
  let t3 = document.getElementById('t3').value;
  v3 = parseInt(v1)*(parseInt(t3) - parseInt(t1))/(parseInt(t2) - parseInt(t1));
  v2 = Math.round((v1 - v3)*10)/10;
  // outPut.textContent = 'When you need ' + v1 + ' dL of water at 37 degrees, you need to mix '
  // + v2 + ' dL of tap water with ' +  Math.round(v3*10)/10 + ' dL of boiling water';
  document.getElementById('v3').value = v2;
  document.getElementById('v2').value = v3;
}

// let outPut = document.querySelector('output');
//outPut.textContent = 'Rappelap'
