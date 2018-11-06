window.onload = init;

//site needs ajax for getting the information from the database
var cartamount;
function init(){
    console.log("Script loaded");
    var detailsdivs = $(".details");
    $(detailsdivs).hide();
    
    var item = $(".item");
    // $(item).click(showdetails);
    var cancel = $(".cancel");
    $(cancel).click(hidedetails);

    var addbutton = $(".additem");
    addbutton.click(addtocart);
    cartamount = 0;
    //WTF Leon
    var allCourses = $(".course");
    $.each(allCourses, function(index, course) {
        var course_id =course.id
        var course_name_tag = $(this).find("#"+course.id+"_name");
        var course_name = $(this).find("#"+course.id+"_name").text();
        var course_price = $(course).find("#"+course.id+"_price").text();
        var course_info1_tag = $(course).find("#"+course.id+"_info1");
        var course_info1 = course_info1_tag.text();
        var course_info2_tag = $(course).find("#"+course.id+"_info2");
        $(course).find("#"+course.id+"_details").hide()
        course_name_tag.click(function (){
            $("#"+course.id+"_info1").hide(0);
        })
        
        course_name_tag.click(function(){
            $("#"+course.id+"_details").toggle("fast");
            return false
        })
        
    });
}

function showdetails() {
    var parentdiv = $(this).parent();
    var siblingdiv = $(parentdiv).siblings("div");
    var detailsdivs = $(".details");
   
    for (var i=0;i<detailsdivs.length;i++)
    {
        if (siblingdiv[0] === detailsdivs[i])
        {
            $(siblingdiv[0]).toggle("fast");
        }
        else
        {
            $(detailsdivs[i]).hide("fast");
        }
    }
    return false
}

function hidedetails()
{
    var parent = $(this).parent();
    $(parent).hide("fast")

}

/*This function will need to be changed to use ajax in order to get most of the information about the specified course from the server*/
/*Therefore this function needs to be changed!*/
function addtocart()
{
    var cart = $("#shoppingcart");
    var items = $("#shoppingitems");
    var parent = $(this).parent();
    var item = parent.siblings("a")[0];
    var select = $(this).siblings("select");
    //console.log(parent);
    //console.log($(select).val());
    var elementexist = false;

    if (cartamount > 0) {
        elementexist = checkcart(item);
    }

    if (elementexist === false)
    {
        var itemvalue = $(item).text();
        var cartitem = $("<div></div>");
        cartitem.attr("id", itemvalue);
        cartitem.attr("class", "cartitem");

        var name = $("<p></p>");
        $(name).text($(select).val() + "x" + itemvalue);

        var removebutton = $("<span></span>");
        removebutton.attr("class", "glyphicon glyphicon-remove-sign cancel");
        removebutton.click(deletecartitem);



        cartitem.append(removebutton);
        cartitem.append(name);
        items.append(cartitem);
        cartamount++;
        //console.log(cartamount);
        cart.show();
    }
    parent.hide("fast");
}

function deletecartitem()
{
    var chosencartitem = $(this).parent()[0];
    $(chosencartitem).remove();
    cartamount--;
    if (cartamount === 0){
        $("#shoppingcart").hide();
    }
}

//checks if it is already a part of the cart or not, if it is edit the cart entry.
//This will also be changed once addtocart method is edited!
function checkcart(item)
{
    console.log(item);
    var elementfound = false;
    var cartitems = $(".cartitem");
        //for loop through all the cart items and look at the ids, if one of them match with the current item add 1 higher amount.
        for (var c=0;c<cartitems.length;c++)
        {

            if ($(cartitems[c]).attr("id") === $(item).text())
            {
                //console.log("Ids match");
                var id = $(item).parent().attr("id");
                var secondchild =  $(cartitems[c]).find("p")[0];
                var oldtext = $(secondchild).text();
                console.log(oldtext);
                var textarr = oldtext.split("x");
                var oldamount = parseInt(textarr[0]);
                var chosenvalue = parseInt($("#select"+id).val());
                var newamount = oldamount + chosenvalue;
                //console.log(chosenvalue);
                //var newtext = newamount + textarr[1];
                //console.log(newtext);
                $(secondchild).text(newamount+"x"+textarr[1]);
                elementfound = true;
                break;
            }
        }
        return elementfound
}

/*Will be finished once the cart is fully functional!*/
function updatetotalcost()
{
    var items = $(".cartitem");
    var totalcost = 0;

    for (var t=0;items.length;t++)
    {
        var currentitem = items[t];
        var currentinfo = $(currentinfo).text();
        var textarr = currentinfo.split("x");

    }
}


function course(id, name, info) 
{
    this.id = id;
    this.name = name;
    this.info = info;
}