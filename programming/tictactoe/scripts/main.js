function allowDrop(ev) {
  if (ev.dataTransfer.getData("text") === "cross1") {
    console.log("Rap", ev.target.id);
  }
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));
}
