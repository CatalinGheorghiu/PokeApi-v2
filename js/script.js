//DOM Elements
let pokeListIds = document.querySelectorAll(".id");
let pokeListItems = document.querySelectorAll(".item");
let pokeListItemsDetails = document.querySelectorAll(".item-details");
let details = document.querySelector(".item-detail");
let img = document.querySelectorAll(".img");
let itemIds = document.querySelectorAll(".item-id");
let title = document.querySelectorAll(".section-title");
let showClass = document.querySelectorAll(".show");
let cards = document.querySelectorAll(".card");

$(document).ready(function () {
    /* Hide buttons ##################################### */
    $(".container").hide();
    // $(".item-details").hide();
    $("#next").hide();
    $("#prev").hide();

    /* Berry data ######################################*/
    $("#berries").click(function () {
        // $("div").removeClass("show");
        //Make request to PokeAPI
        fetchData("berry", 10);
    });

    /* Contest data #######################################*/
    $("#contest").click(function () {
        $("div").removeClass("show");
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

    /* Generation data ########################################*/
    $("#games").click(function () {
        $("div").removeClass("show");
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
        // $("div").removeClass("show");
        //Make request to PokeAPI
        fetchData("pokemon", 10);
    });

    /* 
#############################################################
##                             FUNCTIONS                                                          ####
#############################################################        
*/
    function fetchOnClick(item, limit, offset = 0) {
        $("div").removeClass("show");
        return function (e) {
            fetchData(item, limit, offset);
            e.preventDefault();
        };
    }
    //Add attributes on click
    for (const pokeListItem of pokeListItems) {
        pokeListItem.addEventListener("click", function (e) {
            e.preventDefault();
            const itemUrl = pokeListItem.getAttribute("data-id");
            const dataType = pokeListItem.getAttribute("data-type-list");
            const idCollapse = pokeListItem.getAttribute("aria-controls");
            fetchDetails(itemUrl, dataType, idCollapse);
        });
    }
    //Upper case the first letter
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    //Fetch the DATA
    function fetchData(item, limit, offset = 0) {
        $.ajax({
            type: "GET",
            url: `https://pokeapi.co/api/v2/${item}/?offset=${offset}&&limit=${limit}`,
            success: function (data) {
                $(".card").show();
                $(".section-title").empty();
                //Add the title with the number of items
                let itemName = capitalizeFirstLetter(`${item}`);
                $(".section-title").append(`${itemName} (${data.count})`);
                $(".id").empty();
                $(".item").empty();
                $(".container").show();
                $("#next").show();
                $("#prev").show();

                //NEXT && PREVIOUS URL from the fetched data
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
                            .on(
                                "click",
                                fetchOnClick(item, limit, offset - 10)
                            );
                    }
                    //Display the button
                    $("#next").prop("disabled", false);
                    //Fetch the next 10 items on click
                    $("#next")
                        .off("click")
                        .on("click", fetchOnClick(item, limit, offset + 10));
                } else if (prev === null && next === null) {
                    $("#next").prop("disabled", true);
                    $("#prev").prop("disabled", true);
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

                    //Data object
                    const resultData = dataResults[i];

                    //Name
                    let name = resultData["name"];
                    //Id from Url
                    const url = resultData["url"];
                    //Split the URL
                    let splitUrl = url.split("/");
                    //Get the id from the URL
                    let idFromUrl = splitUrl[splitUrl.length - 2];
                    //Get the type of item from URL
                    let dataType = splitUrl[splitUrl.length - 3];

                    //Fill the HTML with the data
                    pokeListId.textContent = idFromUrl;
                    //Set attributes to the item
                    pokeListItem.setAttribute("data-id", `${url}`);
                    pokeListItem.setAttribute("data-type-list", `${dataType}`);
                    //If the item doesn't have a name...
                    if (name == undefined || name == null) {
                        pokeListItem.textContent = "Details";
                    } else {
                        pokeListItem.textContent = capitalizeFirstLetter(name);
                    }
                }

                //Hide the empty elements
                for (let i = 0; i <= cards.length; i++) {
                    $(".card")
                        .hide()
                        .filter(":nth-child(-n+" + dataResults.length + ")")
                        .show();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            },
        });
    }
    //Fetch the DETAILS
    function fetchDetails(url, dataType, idCollapse) {
        //Hide the DOM elements
        $("#" + idCollapse + " .item-img-1").hide();
        $("#" + idCollapse + " .item-img-2").hide();
        $("#" + idCollapse + " .item-ability-1").hide();
        $("#" + idCollapse + " .item-ability-2").hide();
        $("#" + idCollapse + " .item-id").hide();
        $("#" + idCollapse + " .item-weight").hide();
        $("#" + idCollapse + " .item-name").hide();
        $("#" + idCollapse + " .item-exp").hide();
        $("#" + idCollapse + " .item-height").hide();
        $("#" + idCollapse + " .item-type-1").hide();
        $("#" + idCollapse + " .item-type-2").hide();
        //Check witch type of item is called
        switch (dataType) {
            case "berry":
                fetchDetailsBerry(url);
                break;
            case "contest-type":
                fetchDetailsContests(url);
                break;
            case "encounter-method":
                fetchDetailsEncounter(url);
                break;
            case "evolution-chain":
                fetchDetailsEvolution(url);
                break;
            case "generation":
                fetchDetailsGeneration(url);
                break;
            case "item":
                fetchDetailsItem(url);
                break;
            case "location":
                fetchDetailsLocation(url);
                break;
            case "machine":
                fetchDetailsMachine(url);
                break;
            case "move":
                fetchDetailsMove(url);
                break;
            case "pokemon":
                fetchDetailsPokemon(url);
                break;
            default:
                showError(dataType);
                break;
        }

        function fetchDetailsBerry(url) {
            $.ajax({
                type: "GET",
                url: `${url}`,
                success: function (data) {
                    let firmness = data["firmness"]["name"];
                    let growth = data["growth_time"];
                    let id = data["id"];
                    let item = data["item"]["name"];
                    let harvest = data["max_harvest"];
                    let name = capitalizeFirstLetter(data["name"]);
                    let power = data["natural_gift_power"];
                    let gift = data["natural_gift_type"]["name"];
                    let size = data["size"];
                    //Add the DATA to the DOM element and display it
                    $("#" + idCollapse + " .item-ability-1")
                        .text(`Firmness : ${firmness}`)
                        .show();
                    $("#" + idCollapse + " .item-ability-2")
                        .text(`Growth time : ${growth}`)
                        .show();
                    $("#" + idCollapse + " .item-id")
                        .text(`ID: ${id}`)
                        .show();
                    $("#" + idCollapse + " .item-weight")
                        .text(`Item : ${item}`)
                        .show();
                    $("#" + idCollapse + " .item-name")
                        .text(`Name : ${name}`)
                        .show();
                    $("#" + idCollapse + " .item-exp")
                        .text(`Max harvest : ${harvest}`)
                        .show();
                    $("#" + idCollapse + " .item-height")
                        .text(`Name: ${size}`)
                        .show();
                    $("#" + idCollapse + " .item-type-1")
                        .text(`Natural gift power : ${power}`)
                        .show();
                    $("#" + idCollapse + " .item-type-2")
                        .text(`Natural gift type : ${gift}`)
                        .show();
                },
            });
        }

        function fetchDetailsContests(url) {
            $.ajax({
                type: "GET",
                url: `${url}`,
                success: function (data) {
                    let flavor = data["berry_flavor"]["name"];
                    let id = data["id"];
                    let name = capitalizeFirstLetter(data["name"]);
                    let color = data["names"][0]["color"];
                    //Add the DATA to the DOM element and display it
                    $("#" + idCollapse + " .item-ability-1")
                        .text(`Flavor : ${flavor}`)
                        .show();
                    $("#" + idCollapse + " .item-name")
                        .text(`Name : ${name}`)
                        .show();
                    $("#" + idCollapse + " .item-id")
                        .text(`ID: ${id}`)
                        .show();
                    $("#" + idCollapse + " .item-exp")
                        .text(`Color : ${color}`)
                        .show();
                },
            });
        }

        function fetchDetailsEncounter(url) {
            $.ajax({
                type: "GET",
                url: `${url}`,
                success: function (data) {
                    let id = data["id"];
                    let name = capitalizeFirstLetter(data["name"]);
                    let description = data["names"][1]["name"];
                    let order = data["order"];
                    //Add the DATA to the DOM element and display it
                    $("#" + idCollapse + " .item-id")
                        .text(`ID: ${id}`)
                        .show();
                    $("#" + idCollapse + " .item-ability-2")
                        .text(`Name : ${name}`)
                        .show();
                    $("#" + idCollapse + " .item-ability-1")
                        .text(`Description : ${description}`)
                        .show();
                    $("#" + idCollapse + " .item-exp")
                        .text(`Order : ${order}`)
                        .show();
                },
            });
        }

        function fetchDetailsEvolution(url) {
            $.ajax({
                type: "GET",
                url: `${url}`,
                success: function (data) {
                    $("#" + idCollapse + " .item-id")
                        .text("There is no data available for this section")
                        .show();
                },
            });
        }

        function fetchDetailsGeneration(url) {
            $.ajax({
                type: "GET",
                url: `${url}`,
                success: function (data) {
                    let abilities = data["abilities"].length;
                    let id = data["id"];
                    let region = data["main_region"]["name"];
                    let moves = data["moves"].length;
                    let name = data["names"][3]["name"];
                    let species = data["pokemon_species"].length;
                    let types = data["types"].length;
                    let versionGroups1 = data["version_groups"][0]["name"];
                    let versionGroups2 = data["version_groups"][1]["name"];
                    //Add the DATA to the DOM element and display it
                    $("#" + idCollapse + " .item-id")
                        .text(`ID: ${id}`)
                        .show();
                    $("#" + idCollapse + " .item-ability-1")
                        .text(`Abilities : ${abilities}`)
                        .show();
                    $("#" + idCollapse + " .item-ability-2")
                        .text(`Main region : ${region}`)
                        .show();
                    $("#" + idCollapse + " .item-weight")
                        .text(`Moves : ${moves}`)
                        .show();
                    $("#" + idCollapse + " .item-height")
                        .text(`Name: ${name}`)
                        .show();
                    $("#" + idCollapse + " .item-name")
                        .text(`Pokemon species : ${species}`)
                        .show();
                    $("#" + idCollapse + " .item-exp")
                        .text(`Types : ${types}`)
                        .show();
                    $("#" + idCollapse + " .item-type-1")
                        .text(`Version group 1 : ${versionGroups1}`)
                        .show();
                    $("#" + idCollapse + " .item-type-2")
                        .text(`Version group 2 : ${versionGroups2}`)
                        .show();
                },
            });
        }

        function fetchDetailsItem(url) {
            $.ajax({
                type: "GET",
                url: `${url}`,
                success: function (data) {
                    let id = data["id"];
                    let effect = data["effect_entries"][0]["effect"];
                    let flavor = data["flavor_text_entries"][2]["text"];
                    let name = data["names"][2]["name"];
                    let img = data["sprites"]["default"];
                    //Add the DATA to the DOM element and display it
                    $("#" + idCollapse + " .item-img-1")
                        .attr("src", `${img}`)
                        .show();
                    $("#" + idCollapse + " .item-id")
                        .html(`ID: ${id} <br><br>`)
                        .show();
                    $("#" + idCollapse + " .item-name")
                        .text(`Name : ${name}`)
                        .show();
                    $("#" + idCollapse + " .item-ability-1")
                        .html(`Effect description : ${effect} <br><br>`)
                        .show();
                    $("#" + idCollapse + " .item-ability-2")
                        .html(`Details : ${flavor}<br><br>`)
                        .show();
                },
            });
        }

        function fetchDetailsLocation(url) {
            $.ajax({
                type: "GET",
                url: `${url}`,
                success: function (data) {
                    let id = data["id"];
                    let gameIndex = data["game_indices"][0]["game_index"];
                    let generation =
                        data["game_indices"][0]["generation"]["name"];
                    let name = data["names"][0]["name"];
                    let region = data["region"]["name"];
                    //Add the DATA to the DOM element and display it
                    $("#" + idCollapse + " .item-id")
                        .text(`ID: ${id}`)
                        .show();
                    $("#" + idCollapse + " .item-ability-2")
                        .text(`Game index : ${gameIndex}`)
                        .show();
                    $("#" + idCollapse + " .item-ability-1")
                        .text(`Generation : ${generation}`)
                        .show();
                    $("#" + idCollapse + " .item-name")
                        .text(`Name : ${name}`)
                        .show();
                    $("#" + idCollapse + " .item-exp")
                        .text(`Region: ${region}`)
                        .show();
                },
            });
        }

        function fetchDetailsMachine(url) {
            $.ajax({
                type: "GET",
                url: `${url}`,
                success: function (data) {
                    let id = data["id"];
                    let item = data["item"]["name"];
                    let move = data["move"]["name"];
                    let version = data["version_group"]["name"];
                    //Add the DATA to the DOM element and display it
                    $("#" + idCollapse + " .item-name")
                        .text(`Item name : ${item}`)
                        .show();
                    $("#" + idCollapse + " .item-id")
                        .text(`ID : ${id}`)
                        .show();
                    $("#" + idCollapse + " .item-ability-1")
                        .text(`Move name : ${move}`)
                        .show();
                    $("#" + idCollapse + " .item-exp")
                        .text(`Version group : ${version}`)
                        .show();
                },
            });
        }

        function fetchDetailsMove(url) {
            $.ajax({
                type: "GET",
                url: `${url}`,
                success: function (data) {
                    let id = data["id"];
                    let accuracy = data["accuracy"];
                    let type = data["contest_type"]["name"];
                    let damage = data["damage_class"]["name"];
                    let effect = data["effect_entries"][0]["short_effect"];
                    let text = data["flavor_text_entries"][2]["flavor_text"];
                    let generation = data["generation"]["name"];
                    let name = data["names"][2]["name"];
                    let power = data["power"];
                    //Add the DATA to the DOM element and display it
                    $("#" + idCollapse + " .item-height")
                        .html(`Power : ${power} <br><br>`)
                        .show();
                    $("#" + idCollapse + " .item-weight")
                        .text(`Generation : ${generation}`)
                        .show();
                    $("#" + idCollapse + " .item-type-1")
                        .html(`Description : ${text} <br><br>`)
                        .show();
                    $("#" + idCollapse + " .item-type-2")
                        .text(`Effect : ${effect}`)
                        .show();
                    $("#" + idCollapse + " .item-ability-1")
                        .text(`Damage : ${damage}`)
                        .show();
                    $("#" + idCollapse + " .item-ability-2")
                        .text(`Type : ${type}`)
                        .show();
                    $("#" + idCollapse + " .item-exp")
                        .text(`Accuracy : ${accuracy}`)
                        .show();
                    $("#" + idCollapse + " .item-name")
                        .text(`Name : ${name}`)
                        .show();
                    $("#" + idCollapse + " .item-id")
                        .text(`ID : ${id}`)
                        .show();
                },
            });
        }

        function fetchDetailsPokemon(url) {
            $.ajax({
                type: "GET",
                url: `${url}`,
                success: function (data) {
                    let ability = data["abilities"];
                    //If there is more than one ability ...
                    if (ability > 1) {
                        let ability2 = data["abilities"][1]["ability"]["name"];
                        //Display ability
                        $(".item-ability-2").text(
                            `Ability no. 2 : ${ability2}`
                        );
                    }
                    let ability1 = data["abilities"][0]["ability"]["name"];
                    let exp = data["base_experience"];
                    let height = data["height"];
                    let id = data["id"];
                    let name = capitalizeFirstLetter(data["name"]);
                    let img1 = data["sprites"]["front_default"];
                    let img2 = data["sprites"]["back_default"];
                    let type = data["types"];
                    if (type.length > 1) {
                        let type2 = data["types"][1]["type"]["name"];
                        $(".item-type-2").text(`Type no. 2: ${type2}`);
                    }
                    let type1 = data["types"][0]["type"]["name"];
                    let weight = data["weight"];

                    $("#" + idCollapse + " .item-ability-1")
                        .text(`Ability no. 1 : ${ability1}`)
                        .show();
                    $("#" + idCollapse + " .item-height")
                        .text(`Height: ${height}`)
                        .show();
                    $("#" + idCollapse + " .item-id")
                        .text(`ID: ${id}`)
                        .show();
                    $("#" + idCollapse + " .item-name")
                        .text(`Name: ${name}`)
                        .show();
                    $("#" + idCollapse + " .item-img-1")
                        .attr("src", `${img1}`)
                        .show();
                    $("#" + idCollapse + " .item-img-2")
                        .attr("src", `${img2}`)
                        .show();
                    $("#" + idCollapse + " .item-type-1")
                        .text(`Type no. 1 : ${type1}`)
                        .show();
                    $("#" + idCollapse + " .item-weight")
                        .text(`Weight: ${weight}`)
                        .show();
                },
            });
        }

        //Show errors
        function showError(dataType) {
            console.log(`${dataType} error`);
        }
    }
});

// Get the current year for the copyright
$("#year").text(new Date().getFullYear());
