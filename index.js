// start by creating data so we don't have to type it in each time
let restaurantArray = [];

// define a constructor to create restaurant objects
let RestaurantObject = function (pName, pDate, pCity, pStyle, pMenu, pPrice, pURL) {
    this.ID = Math.random().toString(16).slice(5);
    this.Name = pName;
    this.Date = pDate;
    this.City = pCity;
    this.Style = pStyle;
    this.Menu = pMenu;
    this.Price = pPrice;
    this.URL = pURL;
    // store visit info in an array of Visit objects
    this.VisitArray = [new Visit(pDate, pMenu)] ;  // load the 1st visit into the Visit array
}

// create new objects to hold visit data
let Visit = function(pDate, pMenu)
{
    this.Date = pDate;
    this.Menu = pMenu;
}

restaurantArray.push(new RestaurantObject("Dominos", "01/23/2009", "Redmond", "American", "Pepperoni Pizza", "$$$", "", "", ""));
restaurantArray.push(new RestaurantObject("Chipotle", "01/02/2017", "Seattle", "Mexican", "Steak Burrito", "$", "www.asdas.com", "", ""));
restaurantArray.push(new RestaurantObject("Five Guys", "04/04/2019", "Issaquah", "American", "Cheeseburger w/ bacon", "$$", "https://www.fiveguys.com/", "", ""));


document.addEventListener("DOMContentLoaded", function () {

    createList();

    // add button event
    document.getElementById("addBtn").addEventListener("click", function () {
        restaurantArray.push(new RestaurantObject(document.getElementById("name").value, document.getElementById("date").value,
            document.getElementById("city").value, document.getElementById("cuisine").value, document.getElementById("menuTried").value,
            document.getElementById("select-price").value, document.getElementById("website").value));
        document.location.href = "index.html#listPage";
        console.log(restaurantArray);
    });


    // clear button event
    document.getElementById("clearBtn").addEventListener("click", function () {
        document.getElementById("name").value = "";
        document.getElementById("date").value = "";
        document.getElementById("city").value = "";
        document.getElementById("cuisine").value = "";
        document.getElementById("menuTried").value = "";
        document.getElementById("website").value = "";
    });


    // delete button event
    document.getElementById("delete").addEventListener("click", function () {
        let localParm = localStorage.getItem("parm");  // get the unique key back from the dictionary
        deleteRestaurant(localParm);
        createList();  // recreate li list after removing one
        document.location.href = "index.html#listPage";  // go back to restaurant list 
    });


    // website button event
    document.getElementById("websiteBtn").addEventListener("click", function () {
        let websiteURL = document.getElementById("website").value;
        if (websiteURL === "") {
            alert("Website Not Available");
        }
        else {
            window.open(websiteURL, "_blank");
        }
    });


    // sorting options
    let sortBy = document.getElementById("select-sortBy");

    sortBy.addEventListener("change", function () {
        if (sortBy.value == "sortName") {
            sortByName();
        }
        if (sortBy.value == "sortCity") {
            sortByCity();
        }
        if (sortBy.value == "sortStyle") {
            sortByStyle();
        }
        if (sortBy.value == "sortHtoL") {
            sortByHtoL();
        }
        if (sortBy.value == "sortLtoH") {
            sortByLtoH();
        }

        createList();
        document.location.href = "index.html#listPage";
    });


    // page before show code *************************************************************************
    $(document).on("pagebeforeshow", "#listPage", function (event) {   // have to use jQuery 
        createList();
    });

    document.getElementById("updateVisitBtn").addEventListener("click", function () {
        let newDate = document.getElementById("newDate").value;
        let newMenu = document.getElementById("newMenuTried").value;
        let localParm = localStorage.getItem("parm");  // get the unique key back from the storage dictionary called "parm"
        let restaurantID = GetArrayPointer(localParm); // map to which array element it is 
        
        // push new date and menu to VisitArray, which is inside restaurantArray
        restaurantArray[restaurantID].VisitArray.push(new Visit(newDate, newMenu));

        document.getElementById("newDate").value = "";
        document.getElementById("newMenuTried").value = "";

        document.location.href = "index.html#listPage";
    });

    // need one for our details page to fill in the info based on the passed in ID
    $(document).on("pagebeforeshow", "#detailPage", function (event) {
        let localParm = localStorage.getItem("parm");  // get the unique key back from the storage dictionary called "parm"
        let restaurantID = GetArrayPointer(localParm); // map to which array element it is 
        restaurantArray = JSON.parse(localStorage.getItem("restArray"));

        document.getElementById("nameDetail").innerHTML = "Name: " + "<b>" + restaurantArray[restaurantID].Name + "</b>";
        document.getElementById("styleDetail").innerHTML = "Cuisine Style: " + "<b>" + restaurantArray[restaurantID].Style + "</b>";
        document.getElementById("locationDetail").innerHTML = "City: " + "<b>" + restaurantArray[restaurantID].City + "</b>";
        document.getElementById("priceDetail").innerHTML = "Price: " + "<b>" + restaurantArray[restaurantID].Price + "</b>";
       
        // clear prior data
        let theVisitList = document.getElementById("pastVisits");
        theVisitList.innerHTML = "";

        // display updated visit list
        restaurantArray[restaurantID].VisitArray.forEach(function (element) {   
            let li = document.createElement("li");
            li.innerHTML = "Date Visited: " + "<b>" + element.Date + "</b>" + "<br />"  + "Menu(s) Tried: " + "<b>" + element.Menu + "</b>" + "<br /> <br /> ";
            theVisitList.appendChild(li);
        });
    });

        // end of page before show code *************************************************************************
});
// end of wait until document has loaded event  *************************************************************************


function createList() {
    // clear prior data
    let theList = document.getElementById("myRestaurantList");
    theList.innerHTML = "";
    while (myRestaurantList.firstChild) {    // remove any old data so don't get duplicates
        myRestaurantList.removeChild(myRestaurantList.firstChild);
    };

    restaurantArray.forEach(function (element,) {   // use handy array forEach method
        let li = document.createElement('li');
        li.classList.add('oneRestaurant');

        // use the html5 "data-parm" to store the details of this particular restaurant object 
        // that we are currently building an li for so that I can later know which restaurant this li came from
        li.setAttribute("data-parm", element.ID);

        li.innerHTML = element.Name + " / " + element.City + " / " + element.Style + " / " + element.Price;

        theList.appendChild(li);
    });


    let classList = document.getElementsByClassName("oneRestaurant");

    Array.from(classList).forEach(function (element,) {
        element.addEventListener('click', function () {
            let parm = this.getAttribute("data-parm");  // data-parm has this restaurant object's details
            localStorage.setItem("parm", parm);         // now save THIS DETAILS in the localStorage called "parm"
            
            // to get around a "bug" in jQuery Mobile, take a snapshot of the
            // current restaurant array and save it to localStorage     
            let stringRestArray = JSON.stringify(restaurantArray);
            localStorage.setItem("restArray", stringRestArray);

            document.location.href = "index.html#detailPage";
        });
    });

};


// remove a movie from array
function deleteRestaurant(which) {
    let arrayPointer = GetArrayPointer(which);
    restaurantArray.splice(arrayPointer, 1);  // remove 1 element at index 
}


// cycles thru the array to find the array element with a matching ID
function GetArrayPointer(localID) {
    for (let i = 0; i < restaurantArray.length; i++) {
        if (localID === restaurantArray[i].ID) {
            return i;
        }
    }
}


function sortByName() {
    restaurantArray.sort(function (a, b) {
        let x = a.Name.toLowerCase();
        let y = b.Name.toLowerCase();
        if (x < y) { return -1; }
        if (x > y) { return 1; }
        return 0;
    });
}

function sortByCity() {
    restaurantArray.sort(function (a, b) {
        let x = a.City.toLowerCase();
        let y = b.City.toLowerCase();
        if (x < y) { return -1; }
        if (x > y) { return 1; }
        return 0;
    });
}

function sortByStyle() {
    restaurantArray.sort(function (a, b) {
        let x = a.Style.toLowerCase();
        let y = b.Style.toLowerCase();
        if (x < y) { return -1; }
        if (x > y) { return 1; }
        return 0;
    });
}

function sortByHtoL() {
    restaurantArray.sort(function (a, b) {
        let x = a.Price.toLowerCase();
        let y = b.Price.toLowerCase();
        if (x > y) { return -1; }
        if (x < y) { return 1; }
        return 0;
    });
}

function sortByLtoH() {
    restaurantArray.sort(function (a, b) {
        let x = a.Price.toLowerCase();
        let y = b.Price.toLowerCase();
        if (x < y) { return -1; }
        if (x > y) { return 1; }
        return 0;
    });
}