// start by creating data so we don't have to type it in each time
let restaurantArray = [];
let updatedRestaurantArray = [];

// define a constructor to create restaurant objects
let RestaurantObject = function (pName, pDate, pCity, pStyle, pMenu, pPrice, pURL, pNewDate, pNewMenu) {
    this.Name = pName;
    this.Date = pDate;
    this.ID = 1000 + restaurantArray.length + 1;
    this.City = pCity;
    this.Style = pStyle;
    this.Menu = pMenu;
    this.Price = pPrice;
    this.URL = pURL;
    this.NewDate = pNewDate;
    this.NewMenu = pNewMenu;
}

let UpdatedRestaurantObject = function (pNewDate, pNewMenu) {
    this.NewDate = pNewDate;
    this.NewMenu = pNewMenu;
}

restaurantArray.push(new RestaurantObject("Pizza Hut", "01/23/2009", "Redmond", "American", "Pepperoni Pizza", "$$$", ""));
restaurantArray.push(new RestaurantObject("Chipotle", "01/02/2017", "Seattle", "Mexican", "Steak Burrito", "$", "www.asdas.com"));
restaurantArray.push(new RestaurantObject("Five Guys", "04/04/2019", "Issaquah", "American", "Cheeseburger w/ bacon", "$$", "https://www.fiveguys.com/"));


document.addEventListener("DOMContentLoaded", function () {

    //createList();

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
        document.getElementById("select-price").value = "blank";   // why not working?????
        document.getElementById("website").value = "";
    });


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
        //createUpdatedList();
    });

    // need one for our details page to fill in the info based on the passed in ID
    $(document).on("pagebeforeshow", "#detailPage", function (event) {
        let restaurantDetailsList = localStorage.getItem("parm");  // get the unique key back from the storage dictionary called "parm"
        document.getElementById("restaurantDetailsList").innerHTML = restaurantDetailsList;
        document.getElementById("restaurantDetailsListOnUpdatedPage").innerHTML = restaurantDetailsList;

        console.log(restaurantDetailsList);
    });

    // end of page before show code *************************************************************************
    document.getElementById("updateBtn").addEventListener("click", function () {
        let newDate = document.getElementById("dateUpdate").value;
        let newMenu = document.getElementById("menuTriedUpdate").value;
    
        restaurantArray.push(new RestaurantObject ("", "", "", "", "", "", "", newDate, newMenu));
    
        console.log(restaurantArray);
        document.getElementById("dateUpdate").value = "";
        document.getElementById("menuTriedUpdate").value = "";
    
        let updatedRestaurantDetailsList = localStorage.getItem("updated");
        document.getElementById("updatedRestaurantList").innerHTML = updatedRestaurantDetailsList;
        document.getElementById("updatedRestaurantDetailsListOnUpdatedPage").innerHTML = updatedRestaurantDetailsList;
        console.log(updatedRestaurantDetailsList);
    
        document.location.href = "index.html#detailPage";
    });
});
// end of wait until document has loaded event  *************************************************************************


// update button event
//document.getElementById("updateBtn").addEventListener("click", updateList);


function createList() {
    // clear prior data
    let theList = document.getElementById("myul");
    theList.innerHTML = "";

    restaurantArray.forEach(function (element,) {   // use handy array forEach method
        let li = document.createElement('li');
        li.classList.add('oneRestaurant');
        li.innerHTML = element.Name + " / " + element.City + " / " + element.Style + " / " + element.Price;

        // use the html5 "data-parm" to store the details of this particular restaurant object 
        // that we are currently building an li for so that I can later know which restaurant this li came from
        li.setAttribute("data-parm", "Name: " + element.Name + "<br><br>" +
                                     "Cuisine Style: " + element.Style + "<br><br>" +
                                     "Location: " + element.City + "<br><br>" +
                                     "Price: " + element.Price + "<br><br><br>" +
                                     "Date Visited: " + element.Date + "<br><br>" +
                                     "Menu(s) Tried: " + element.Menu + "<br><br>");

        li.setAttribute("data-updated", "Date Visited: " + element.NewDate + "<br><br>" +
                                        "Menu(s) Tried: " + element.NewMenu + "<br><br>");

        theList.appendChild(li);
    });


    let classList = document.getElementsByClassName("oneRestaurant");
    let newRestaurantArray = Array.from(classList);

    newRestaurantArray.forEach(function (element,) {
        element.addEventListener('click', function () {
            let parm = this.getAttribute("data-parm");  // data-parm has this restaurant object's details
            let updated = this.getAttribute("data-updated");  // data-parm has this restaurant object's details
            localStorage.setItem("parm", parm);         // now save THIS DETAILS in the localStorage called "parm"
            localStorage.setItem("updated", updated);
            document.location.href = "index.html#detailPage";
        });
    });

};


// function updateList() {
//     let updatedList = new UpdatedRestaurantObject (
//         document.getElementById("dateUpdate").value,
//         document.getElementById("menuTriedUpdate").value
//     );
//     updatedRestaurantArray.push(updatedList);
//     document.getElementById("dateUpdate").value = "";
//     document.getElementById("menuTriedUpdate").value = "";

//     // clear all list when user clicks "Show Movies" button
//     document.getElementById("updatedRestaurantList").innerHTML = "";
//     document.getElementById("updatedRestaurantDetailsListOnUpdatedPage").innerHTML = "";

//     // create "unordered list" element 
//     let liList = document.createElement('li');

//     // convert "movieList" section into unordered list
//     document.getElementById("updatedRestaurantList").appendChild(liList);
//     document.getElementById("updatedRestaurantDetailsListOnUpdatedPage").appendChild(liList);

//     for (let i in updatedRestaurantArray) {             
//         let li = document.createElement('li');  // create "list" element   
//         liList.appendChild(li);                     // add list to unordered list
//         liList.innerHTML = updatedRestaurantArray[i].GetAll();  // display string output
//     }
// };


// UpdatedRestaurantObject.prototype.GetAll = function() {
//     return "Date Visited: " + this.NewDate + "<br><br>" +
//            "Menu(s) Tried: " + this.NewMenu + "<br><br>";
// };

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