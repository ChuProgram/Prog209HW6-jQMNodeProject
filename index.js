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

// let UpdatedRestaurantObject = function (pNewDate, pNewMenu) {
//     this.NewDate = pNewDate;
//     this.NewMenu = pNewMenu;
// }

restaurantArray.push(new RestaurantObject("Dominos", "01/23/2009", "Redmond", "American", "Pepperoni Pizza", "$$$", "", "", ""));
restaurantArray.push(new RestaurantObject("Chipotle", "01/02/2017", "Seattle", "Mexican", "Steak Burrito", "$", "www.asdas.com", "", ""));
restaurantArray.push(new RestaurantObject("Five Guys", "04/04/2019", "Issaquah", "American", "Cheeseburger w/ bacon", "$$", "https://www.fiveguys.com/", "", ""));


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
    });


    // need one for our details page to fill in the info based on the passed in ID
    $(document).on("pagebeforeshow", "#detailPage", "#updatePage", function (event) {
        let restaurantID = localStorage.getItem("parm");  // get the unique key back from the storage dictionary called "parm"
        restaurantArray = JSON.parse(localStorage.getItem("restArray"));

        document.getElementById("nameDetail").innerHTML = "Name: " + restaurantArray[restaurantID - 1001].Name;
        document.getElementById("styleDetail").innerHTML = "Cuisine Style: " + restaurantArray[restaurantID - 1001].Style;
        document.getElementById("locationDetail").innerHTML = "City: " + restaurantArray[restaurantID - 1001].City;
        document.getElementById("priceDetail").innerHTML = "Price: " + restaurantArray[restaurantID - 1001].Price;
        document.getElementById("dateDetail").innerHTML = "Date Visited: " + restaurantArray[restaurantID - 1001].Date;
        document.getElementById("menuDetail").innerHTML = "Menu(s) Tried: " + restaurantArray[restaurantID - 1001].Menu;

        document.getElementById("updateDetailsPage").innerHTML = "Date & Menu(s) you've tried at " + "<b>" + restaurantArray[restaurantID - 1001].Name + "</b>";
        document.getElementById("dateDetail2").innerHTML = "Date Visited: " + restaurantArray[restaurantID - 1001].Date;
        document.getElementById("menuDetail2").innerHTML = "Menu(s) Tried: " + restaurantArray[restaurantID - 1001].Menu;



        document.getElementById("updateBtn").addEventListener("click", function () {
            let restaurantID = localStorage.getItem("parm");
            restaurantArray = JSON.parse(localStorage.getItem("restArray"));

            let newDate = document.getElementById("dateUpdate").value;
            let newMenu = document.getElementById("menuTriedUpdate").value;
            console.log(restaurantID);
            restaurantArray[restaurantID - 1001].NewDate = newDate;
            restaurantArray[restaurantID - 1001].NewMenu = newMenu;

            let oldDate = newDate;
            let oldMenu = newMenu;

            let newArray = restaurantArray.map(item => {
                if (item.NewDate === oldDate || item.NewMenu === oldMenu) {
                    return {...item, NewDate: newDate, NewMenu: newMenu};
                }
                else {
                    return item;
                }
            });

            console.log(newArray);   
            document.getElementById("dateUpdate").value = "";
            document.getElementById("menuTriedUpdate").value = "";

            let output = document.createElement("p");
            document.getElementById("updatedList").appendChild(output);
            console.log(newDate);
            console.log(newMenu);
            if (newDate === "" || newMenu === "") {
                output.innerHTML = "";
            }
            else {
                output.innerHTML = "Date Visited: " + restaurantArray[restaurantID - 1001].NewDate + "<br />" +
                                        "Menu(s) Tried: " + restaurantArray[restaurantID - 1001].NewMenu + "<br />";
            }
        });

    });

    // end of page before show code *************************************************************************
});
// end of wait until document has loaded event  *************************************************************************


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
        li.setAttribute("data-parm", element.ID);

        theList.appendChild(li);
    });


    let classList = document.getElementsByClassName("oneRestaurant");
    let newRestaurantArray = Array.from(classList);

    newRestaurantArray.forEach(function (element,) {
        element.addEventListener('click', function () {
            let parm = this.getAttribute("data-parm");  // data-parm has this restaurant object's details
            localStorage.setItem("parm", parm);         // now save THIS DETAILS in the localStorage called "parm"

            let stringRestArray = JSON.stringify(restaurantArray);
            localStorage.setItem("restArray", stringRestArray);

            document.location.href = "index.html#detailPage";
        });
    });

};


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