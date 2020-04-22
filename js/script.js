// Get the current year for the copyright
$("#year").text(new Date().getFullYear());

//
let pokeListIds = document.querySelectorAll(".id");
let pokeListItems = document.querySelectorAll(".item");
// console.log(pokeListItems)
let pokeListItemsDetails = document.querySelectorAll(".item-details");
let details = document.querySelector(".item-detail");
let img = document.querySelectorAll(".img");
let itemIds = document.querySelectorAll(".item-id");
// console.log(itemId);
// let itemName = document.querySelectorAll(".item-name");
// console.log(detail);

$(document).ready(function () {
    /* Hide buttons ##################################### */
    $(".container").hide();
    // $(".item-details").hide();
    $("#next").hide();
    $("#prev").hide();

    /* Berry data ######################################*/
    $("#berries").click(function () {
        $(".container").show();
        //Make request to PokeAPI
        fetchData("berry", 10);
    });

    /* Contest data #######################################*/
    $("#contest").on("click", function () {
        //Make request to PokeAPI
        fetchData("contest-type", 10);
    });

    /* Encounter data #####################################*/
    $("#encounters").click(function () {
        //Make request to PokeAPI
        fetchData("encounter-method", 10);
    });

    /* Evolution data #######################################*/
    $("#evolution").click(function () {
        //Make request to PokeAPI
        fetchData("evolution-chain", 10);
    });
});

/* Generation data ########################################*/
$("#games").click(function () {
    //Make request to PokeAPI
    fetchData("generation", 10);
});

/* Item data ################################################*/
$("#items").click(function () {
    //Make request to PokeAPI
    fetchData("item", 10);
});

/* Location data #############################################*/
$("#location").click(function () {
    //Make request to PokeAPI
    fetchData("location", 10);
});

/* Machines data #############################################*/
$("#machines").click(function () {
    //Make request to PokeAPI
    fetchData("machine", 10);
});

/* Move data #################################################*/
$("#moves").click(function () {
    //Make request to PokeAPI
    fetchData("move", 10);
});

/* Move data #################################################*/
$("#pokemon").click(function () {
    //Make request to PokeAPI
    fetchData("pokemon", 10);
});

/* 
#############################################################
##        Fetch  data from the API                                                             ####
#############################################################        
*/
function fetchOnClick(item, limit, offset = 0) {
    return function (e) {
        fetchData(item, limit, offset);
        // e.preventDefault();
    };
}

for (const pokeListItem of pokeListItems) {
    pokeListItem.addEventListener("click", function (e) {
        e.preventDefault();
        const itemUrl = pokeListItem.getAttribute("data-id");
        fetchDetails(itemUrl);
    });
}

function fetchData(item, limit, offset = 0) {
    $.ajax({
        type: "GET",
        url: `https://pokeapi.co/api/v2/${item}/?offset=${offset}&&limit=${limit}`,
        data: {},
        success: function (data) {
            $(".item").empty();
            $(".id").empty();
            $(".list-title").empty();
            $(".container").show();
            $("#next").show();
            $("#prev").show();
            const next = data.next;
            const prev = data.previous;
            //If the next URL is available
            if (next !== null) {
                if (prev === null) {
                    $("#prev").prop("disabled", true);
                } else {
                    $("#prev").prop("disabled", false);
                    $("#prev")
                        .off("click")
                        .on("click", fetchOnClick(item, limit, offset - 10));
                }
                //Display the button
                $("#next").prop("disabled", false);
                //Fetch the next 10 items on click
                $("#next")
                    .off("click")
                    .on("click", fetchOnClick(item, limit, offset + 10));
            } else {
                //If the next URL is unavailable , button is deactivated
                $("#next").prop("disabled", true);
            }

            //Display Data
            let dataResults = data["results"];
            for (let i = 0; i < dataResults.length; i++) {
                //Html item && id
                const pokeListItem = pokeListItems[i];
                const pokeListId = pokeListIds[i];
                const pokeListItemsDetail = pokeListItemsDetails[i];
                // console.log(pokeListItemsDetail);

                //Data object
                const resultData = dataResults[i];
                // console.log(resultData);
                //Name
                let name = resultData["name"];
                //Id from Url
                const url = resultData["url"];
                let splitUrl = url.split("/");
                let idFromUrl = splitUrl[splitUrl.length - 2];
                // console.log(idFromUrl);

                //Fill the HTML with the data
                pokeListItem.textContent = name;
                pokeListId.textContent = idFromUrl;

                // pokeListItemsDetail.textContent = url;
                pokeListItem.setAttribute("data-id", `${url}`);
                // console.log(pokeListItem);

                if (pokeListItem.innerHTML == "") {
                    pokeListItem.textContent = "No data available ";
                }
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        },
    });
}

function fetchDetails(url) {
    $.ajax({
        type: "GET",
        url: `${url}`,
        data: {},
        success: function (data) {
            $(".item-id").empty();
            $(".item-name").empty();
            
            console.log(data);
            $(".item-id").text(data.id);
            $(".item-name").text(data.name);
        },
    });
}
