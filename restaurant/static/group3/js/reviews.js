var buttons;

function initialize() {
  console.log("Initializing javascript...")
  buttons = document.getElementsByClassName("dropbtn");
  console.log("\tButton: " + buttons + " - Length: " + buttons.length);
  for (var index = 0; index < buttons.length; index++) {
    buttons[index].addEventListener("click", function() { btnHandler(this); }, false)
  }
  console.log("Javascript initialized!")
}

var btnHandler = function(input){
  console.log("Handling button...")
  var btnID = input.id;
  var IDSplit = String(btnID).split("-");
  var ID = IDSplit[IDSplit.length -1];
  var current = document.getElementById("myDropdown-" + ID)
  console.log("Button ID: " + btnID + " - ID: " + ID);
  if (current.classList.contains('show')) {
    current.classList.remove('show');
  } else {
    for (var i = 0; i < buttons.length; i++) {
      var id = String(buttons[i].id).split("-")[IDSplit.length -1]
      document.getElementById("myDropdown-" + id).classList.remove('show');
    }
    current.classList.toggle('show');
  }
}
            
window.onloadeddata = initialize();