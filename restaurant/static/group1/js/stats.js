var radioButtons = document.getElementsByName("theRestaurant");
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();

if(dd<10) {
    dd = '0'+dd
} 
if(mm<10) {
    mm = '0'+mm
} 
today = yyyy + '-' + mm + '-' + dd;


for(var i=0; i<radioButtons.length; i++) {
    radioButtons[i].onclick = function() {
        // This is the onclick of each restaurant
        getStats(today);
    }
}


function getStats(date, restaurantIndex) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            purchaseAmountJSON = JSON.parse(this.responseText);
            purchaseAmount = purchaseAmountJSON["amount_of_purchases"];

            document.getElementById("statsResponse").innerHTML = purchaseAmount + " purchases " +
            "have been made in this restaurant today!";
        }
    };
    xhttp.open("GET", "/statistics/purchases/" + date, true);
    xhttp.send();
}