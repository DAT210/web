$(document).ready(function(){

    //Restaurant Selection
    $("label").on({
        mouseenter: function(){
            var className = this.className;
            var changeThis = "#opening_hours" + className[className.length - 1];
            console.log(changeThis);
            $(changeThis).show();
        },
        mouseleave: function(){
            var className = this.className;
            var checkThis = ".radio" + className[className.length - 1];
            if ($(checkThis).is(":checked")){
                return
            }
            var changeThis = "#opening_hours" + className[className.length - 1];
            $(changeThis).hide();
        }
    });

    $("input[type=radio]").change(function(){
        var className = this.className;
        var changeThis = "#opening_hours" + className[className.length - 1];

        $(".opnhrs").each(function(){
            $(this).hide();
        });

        $(changeThis).show();


    });

    $("#formSearchRestaurant").submit(function(event)
    {
        event.preventDefault();
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                $("#main").html(this.responseText);
                $(".cp-spinner").remove();
                $("#selectNumberPeople").on("change",function(e){
                    selectPeople(e,this);
                });
            }
        };
        xhttp.open("POST", "http://127.0.0.1:4001/step_1/people");
        var formData=$(this).serialize();
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(formData);
    });

    //Number of people selection
    function selectPeople(e,itemClicked)
    {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                $("#peopleColumn").remove();
                var response= JSON.parse(this.responseText);
                $("#rowButton").append(response["buttonsCalendar"]);
                $("#restaurantInfo").parent().append(response["calendar"]);
                disableCalendarDays(response["currentDay"]);
                attendanceColor(response["restaurantCapacity"]);
                $(".cp-spinner").remove();
                $(".calendarItem:not(.disabled)").on("click",function(e){
                    selectDay(e,this);
                });
                $("#selectDate").on("change",function(e){
                    changeCalendar(e,this);
                });
                $("#selectPeriod").on("change",function(e){
                    changeCalendar(e,this);
                });
                fullDays();
                console.log(response["people"]);
                $("#peopleInfo").val(response["people"]);
                $("#bookingInfo").show();
            }
        };
        xhttp.open("POST", "http://127.0.0.1:4001/step_2/date");
        var data=$(itemClicked).val();
        var formData="people="+data;
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(formData);
    }
    function selectDay(e,itemClicked)
    {

        var day=$(itemClicked).children().first().children("a").data("dateday");
        console.log(day);
        e.preventDefault();
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                $("#bookingCalendar").remove();
                $("#restaurantInfo").parent().append(this.responseText);
                $(".cp-spinner").remove();
                $("#bookingInfo .card-body").append("<div class=\"form-group\">" +
                    "<label class=\"form-label\" for=\"dateInfo\">Booking date</label>" +
                    "<input name=\"dateInfo\" id=\"dateInfo\" disabled=\"\" class=\"form-control\">" +
                    "</div>");
                $("#dateInfo").val(day);
                $("#selectDate").remove();
                $("#selectPeriod").remove();
                $(".btnTime:not(.fullTimeTrue)").on("click",function(e){
                    selectTime(e,this);
                });
                $(".fullTimeTrue").attr("disabled","true");
            }
        };
        xhttp.open("POST", "http://127.0.0.1:4001/step_3/time");
        var data=$("#selectPeriod").val();
        var formData="period="+data+"&dateSelected="+day;
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(formData);
    }

    function fullDays()
    {
        $(".fullTrue").parent().parent().children(".text-right").children("p").html("<span class=\"badge badge-danger\"><b>FULL</b></span>");
        $(".fullTrue").parent().parent().addClass("disabled");
    }
    function attendanceColor(restaurantCapacity)
    {
        var numbersPeople=$(".numberPeople");
        var lengthCalendar=numbersPeople.length;
        for(var i=0;i<lengthCalendar;i++)
        {
            if($(numbersPeople[i]).text()>(restaurantCapacity*0.75))
                $(numbersPeople[i]).parent().parent().addClass("attendanceHigh");
            else if($(numbersPeople[i]).text()>(restaurantCapacity/2))
                $(numbersPeople[i]).parent().parent().addClass("attendanceMiddle");
            else
                $(numbersPeople[i]).parent().parent().addClass("attendanceLow");

        }
    }
    function changeCalendar(e,itemClicked)
    {

        var beginDate=$("#selectDate").val();
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                $("#bookingCalendar").remove();
                var response= JSON.parse(this.responseText);
                $("#restaurantInfo").parent().append(response["calendar"]);
                $(".cp-spinner").remove();
                disableCalendarDays(response["currentDay"]);
                attendanceColor(response["restaurantCapacity"]);
                $(".calendarItem:not(.disabled)").on("click",function(e){
                    selectDay(e,this);
                });
                fullDays();
            }
        };
        xhttp.open("POST", "http://127.0.0.1:4001/changeCalendar");
        var period=$("#selectPeriod").val();
        var formData="beginDate="+beginDate+"&period="+period;
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(formData);
    }
    function disableCalendarDays(activeDate)
    {
        var dayNumbers=$(".dayNumber a");
        var activeDateFound=false;
        var i=0;
        var lengthCalendar=dayNumbers.length;
        activeDate=activeDate.split("-");
        activeDate=new Date(activeDate[0],activeDate[1],activeDate[2]);
        while(i<lengthCalendar && !activeDateFound)
        {
            var date=$(dayNumbers[i]).data("dateday").split("-");
            date=new Date(date[0],date[1],date[2]);
            if(date>=activeDate)
                activeDateFound=true;
            else
            {
                $(dayNumbers[i]).parent().parent().addClass("disabled");
                i++;
            }
        }
    }
    function selectTime(e,itemClicked)
    {

        var time=$(itemClicked).text();
        console.log(time);
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                $("#timeColumn").remove();
                $("#restaurantInfo").parent().append(this.responseText);
                $(".cp-spinner").remove();
                $("#bookingInfo .card-body").append("<div class=\"form-group\">" +
                    "<label class=\"form-label\" for=\"timeInfo\">Booking time</label>" +
                    "<input name=\"timeInfo\" id=\"timeInfo\" disabled=\"\" class=\"form-control\">" +
                    "</div>");
                $("#timeInfo").val(time);
                $("#chooseTable").on("click", function(e){
                    tableVis(e);
                });
                $("#randomTable").on("click", function(e){
                    randomTable(e);
                });
            }
        };
        xhttp.open("POST", "http://127.0.0.1:4001/step_4/tableVisualization");
        var formData="selectedTime="+time;
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(formData);
    }
    function submitBooking(e,itemClicked)
    {
        e.preventDefault();
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                $("#main").html(this.responseText);
                $("#bookingInfo").show();
                $(".cp-spinner").remove();
            }
        };
        xhttp.open("POST", "http://127.0.0.1:4001/confirmPage/step_7");
        people=$("#peopleInfo").val();
        time=$("#timeInfo").val();
        date=$("#dateInfo").val();
        rid=$("#restaurantIdInfo").val();
        tables=$("#bookedTables").val();
        var formData="restaurant="+rid+"&people="+people+"&date="+date+"&time="+time+"&tables="+tables+"&";
        formData+=$(itemClicked).serialize();
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
        xhttp.send(formData);
    }

    function checkBooking(event)
    {
        event.preventDefault();
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                $("#main").html(this.responseText);
                $("#bookingInfo").show();
                $(".cp-spinner").remove();
                $("#formConfirmBooking").submit(function(event)
                {
                    submitBooking(event,this)
                });
            }
        };
        console.log("tamere");
        xhttp.open("POST", "http://127.0.0.1:4001/confirmPage/step_7");
        people=$("#peopleInfo").val();
        time=$("#timeInfo").val();
        date=$("#dateInfo").val();
        rid=$("#restaurantIdInfo").val();
        var formData="restaurant="+rid+"&people="+people+"&date="+date+"&time="+time+"&";
        formData+=$("#formCheck").serialize();
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
        xhttp.send(formData);
    }

    function tableVis(event){
        event.preventDefault();
        if ($("#tableSelection").length) {
            return
        }
        time=$("#timeInfo").val();
        date=$("#dateInfo").val();
        rid=$("#restaurantIdInfo").val();
        people=$("#peopleInfo").val();

        showTableVisualization(rid);
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200){
                var bookedTables = sendTableVisRequest(this.responseText);
                sendBookedTables(bookedTables);
            }
        };
        xhttp.open("POST", "http://127.0.0.1:4001/tableVisualization/step_5");

        var formData="date="+date+"&period="+time+"&rid="+rid+"&people="+people;
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(formData);
    }

    function sendTableVisRequest(dataJSON) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log(this.responseText);
                return this.responseText;
            }
        };
        xhttp.open("POST", "http://127.0.0.1:4001/tableVisualization");   // ?their url
        var formData="data=" + dataJSON;
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(formData);
    }


    function showTableVisualization(restaurantID){
        // $("#chooseTableVisualisation").remove();
        var theUrl = "http://127.0.0.1:5000/";   // ? their url + /restaurantName
        var theFrame = $("<iframe></iframe>").attr({"id":"tableSelection","src": theUrl, "height": "350", "width": "600", "scrolling": "no"});
        $("#chooseTableVisualisation").append(theFrame);
    }

    function sendBookedTables(dataJSON) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                if (!$("#checkBooking").length){
                    $("#restaurantInfo").parent().append(this.responseText);
                    $("#formCheck").on("click",function(e){
                        checkBooking(e);
                    });
                }
                else {
                    $("#formCheck").parent().remove();
                    $("#restaurantInfo").parent().append(this.responseText);
                    $("#formCheck").on("click",function(e){
                        checkBooking(e);
                    });
                }
            }
        };
        xhttp.open("POST", "http://127.0.0.1:4001/confirmPage/step_6");
        var formData = dataJSON;
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(formData);
    }

    function randomTable(event){
        event.preventDefault();

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                if (!$("#checkBooking").length){
                    $("#restaurantInfo").parent().append(this.responseText);
                    $("#formCheck").on("click",function(e){
                        checkBooking(e);
                    });
                }
                else {
                    $("#formCheck").parent().remove();
                    $("#restaurantInfo").parent().append(this.responseText);
                    $("#formCheck").on("click",function(e){
                        checkBooking(e);
                    });
                }
            }
        };
        xhttp.open("POST", "http://127.0.0.1:4001/confirmPage/step_6");
        var tablejson = {tables: [1, 2, 3]};  // without checking if tables are already taken this will often error
        // var check = checkTableAvailability(tablejson);
        // console.log(check);
        // while (check === "0") {
        //     for (var a = 0; a < tablejson.tables.length; a++){
        //         tablejson.tables[a] += 3;
        //     }
        //     check = checkTableAvailability(tablejson);
        //     console.log(tablejson.tables)
        // }
        var formData = JSON.stringify(tablejson);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(formData);
    }
    /*function tableVis(){

        showTableVisualization($("#restaurantIdInfo").val());
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200){
                var bookedTables = sendTableVisRequest(this.responseText);
                sendBookedTables(bookedTables);
                }
        };
        xhttp.open("POST", "/dateAndTime/step_5");

        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send();
    }

    function sendTableVisRequest(dataJSON) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                return this.responseText;
            }
        };
        xhttp.open("POST", "/tableVisualization");   // ?their url
        var formData="data=" + dataJSON;
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(formData);
    }


    function showTableVisualization(restaurantName){
        var theUrl = "http://127.0.0.1:5000/";   // ? their url + /restaurantName
        var theFrame = $("<iframe></iframe>").attr({"id":"tableSelection","src": theUrl, "height": "350", "width": "600", "scrolling": "no"});
        $("#restaurantInfo").parent().append(theFrame);
    }

    function sendBookedTables(dataJSON) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                $("#restaurantInfo").parent().append(this.responseText);
                $("#checkBooking").on("click",function(e){
                    checkBooking(e);
                });
            }
        };
        xhttp.open("POST", "/dateTime/step_6");
        var formData = "data=" + dataJSON;
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(formData);
    }*/

});