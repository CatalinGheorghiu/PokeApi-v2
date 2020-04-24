//
let pokeListIds = document.querySelectorAll(".id");
let pokeListItems = document.querySelectorAll(".item");
let pokeListItemsDetails = document.querySelectorAll(".item-details");
let details = document.querySelector(".item-detail");
let img = document.querySelectorAll(".img");
let itemIds = document.querySelectorAll(".item-id");
let title = document.querySelectorAll(".section-title");
let showClass = document.querySelectorAll(".show");

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
        $(".section-title").text("Berrys");
    });

    /* Contest data #######################################*/
    $("#contest").click(function () {
        $("div").removeClass("show");
        //Make request to PokeAPI
        fetchData("contest-type", 10);
        $(".section-title").text("Contests");
    });

    /* Encounter data #####################################*/
    $("#encounters").click(function () {
        //Make request to PokeAPI
        fetchData("encounter-method", 10);
        $(".section-title").text("Encounters");
    });

    /* Evolution data #######################################*/
    $("#evolution").click(function () {
        //Make request to PokeAPI
        fetchData("evolution-chain", 10);
        $(".section-title").text("Evolution");
    });

    /* Generation data ########################################*/
    $("#games").click(function () {
        $("div").removeClass("show");
        //Make request to PokeAPI
        fetchData("generation", 10);
        $(".section-title").text("Games");
    });

    /* Item data ################################################*/
    $("#items").click(function () {
        //Make request to PokeAPI
        fetchData("item", 10);
        $(".section-title").text("Items");
    });

    /* Location data #############################################*/
    $("#location").click(function () {
        //Make request to PokeAPI
        fetchData("location", 10);
        $(".section-title").text("Locations");
    });

    /* Machines data #############################################*/
    $("#machines").click(function () {
        //Make request to PokeAPI
        fetchData("machine", 10);
        $(".section-title").text("Machines");
    });

    /* Move data #################################################*/
    $("#moves").click(function () {
        //Make request to PokeAPI
        fetchData("move", 10);
        $(".section-title").text("Moves");
    });

    /* Move data #################################################*/
    $("#pokemon").click(function () {
        // $("div").removeClass("show");
        //Make request to PokeAPI
        fetchData("pokemon", 10);
        $(".section-title").text("Pokemons");
    });

    /* 
#############################################################
##        Fetch  data from the API                                                             ####
#############################################################        
*/
    function fetchOnClick(item, limit, offset = 0) {
        $("div").removeClass("show");
        // $(".section-title").empty();
        return function (e) {
            fetchData(item, limit, offset);
            e.preventDefault();
        };
    }

    for (const pokeListItem of pokeListItems) {
        pokeListItem.addEventListener("click", function (e) {
            e.preventDefault();
            const itemUrl = pokeListItem.getAttribute("data-id");
            const dataType = pokeListItem.getAttribute("data-type-list");
            fetchDetails(itemUrl, dataType);
        });
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function fetchData(item, limit, offset = 0) {
        $.ajax({
            type: "GET",
            url: `https://pokeapi.co/api/v2/${item}/?offset=${offset}&&limit=${limit}`,
            success: function (data) {
                console.log(data);
                $(".section-title").empty();
                let itemName = capitalizeFirstLetter(`${item}`);
                $(".section-title").append(`${itemName} (${data.count})`);
                $(".id").empty();
                $(".item").empty();
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

                    //Data object
                    const resultData = dataResults[i];
                    //Name
                    let name = resultData["name"];
                    //Id from Url
                    const url = resultData["url"];
                    let splitUrl = url.split("/");
                    let idFromUrl = splitUrl[splitUrl.length - 2];
                    let dataType = splitUrl[splitUrl.length - 3];

                    //Fill the HTML with the data
                    pokeListItem.textContent = name;
                    pokeListId.textContent = idFromUrl;

                    // pokeListItemsDetail.textContent = url;
                    pokeListItem.setAttribute("data-id", `${url}`);
                    pokeListItem.setAttribute("data-type-list", `${dataType}`);

                    if (pokeListItem.innerHTML == "") {
                        pokeListItem.textContent = "Details";
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

    function fetchDetails(url, dataType) {
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
                    $(".item-img-1").hide();
                    $(".item-img-2").hide();

                    $(".item-ability-1").show();
                    $(".item-ability-2").show();
                    $(".item-id").show();
                    $(".item-weight").show();
                    $(".item-name").show();
                    $(".item-exp").show();
                    $(".item-height").show();
                    $(".item-type-1").show();
                    $(".item-type-2").show();

                    let firmness = data["firmness"]["name"];
                    let growth = data["growth_time"];
                    let id = data["id"];
                    let item = data["item"]["name"];
                    let harvest = data["max_harvest"];
                    let name = data["name"];
                    let power = data["natural_gift_power"];
                    let gift = data["natural_gift_type"]["name"];
                    let size = data["size"];
                    let smooth = data["smoothness"];
                    let soil = data["soil_dryness"];

                    $(".item-ability-1").text(`Firmness : ${firmness}`);
                    $(".item-ability-2").text(`Growth time : ${growth}`);
                    $(".item-id").text(`ID: ${id}`);
                    $(".item-weight").text(`Item : ${item}`);
                    $(".item-name").text(`Item : ${name}`);
                    $(".item-exp").text(`Max harvest : ${harvest}`);
                    $(".item-height").text(`Name: ${size}`);
                    $(".item-type-1").text(`Natural gift power : ${power}`);
                    $(".item-type-2").text(`Natural gift type : ${gift}`);
                },
            });
        }

        function fetchDetailsContests(url) {
            $.ajax({
                type: "GET",
                url: `${url}`,
                success: function (data) {
                    $(".item-img-1").hide();
                    $(".item-img-2").hide();
                    $(".item-height").hide();
                    $(".item-weight").hide();
                    $(".item-type-1").hide();
                    $(".item-type-2").hide();
                    $(".item-name").hide();

                    $(".item-ability-1").show();
                    $(".item-ability-2").show();
                    $(".item-id").show();
                    $(".item-exp").show();

                    let flavor = data["berry_flavor"]["name"];
                    let id = data["id"];
                    let name = data["name"];
                    let color = data["names"][0]["color"];

                    $(".item-ability-1").text(`Flavor : ${flavor}`);
                    $(".item-ability-2").text(`Name : ${name}`);
                    $(".item-id").text(`ID: ${id}`);
                    $(".item-exp").text(`Color : ${color}`);
                },
            });
        }

        function fetchDetailsEncounter(url) {
            $.ajax({
                type: "GET",
                url: `${url}`,
                success: function (data) {
                    $(".item-img-1").hide();
                    $(".item-img-2").hide();
                    $(".item-height").hide();
                    $(".item-weight").hide();
                    $(".item-type-1").hide();
                    $(".item-type-2").hide();
                    $(".item-name").hide();

                    $(".item-ability-1").show();
                    $(".item-ability-2").show();
                    $(".item-id").show();
                    $(".item-exp").show();

                    let id = data["id"];
                    let name = data["name"];
                    let description = data["names"][1]["name"];
                    let order = data["order"];

                    $(".item-id").text(`ID: ${id}`);
                    $(".item-ability-2").text(`Name : ${name}`);
                    $(".item-ability-1").text(`Description : ${description}`);
                    $(".item-exp").text(`Order : ${order}`);
                },
            });
        }

        function fetchDetailsEvolution(url) {
            $.ajax({
                type: "GET",
                url: `${url}`,
                success: function (data) {
                    console.log(data);
                    $(".item-img-1").hide();
                    $(".item-img-2").hide();
                    $(".item-height").hide();
                    $(".item-weight").hide();
                    $(".item-type-1").hide();
                    $(".item-type-2").hide();
                    $(".item-ability-2").hide();
                    $(".item-ability-1").hide();
                    $(".item-exp").hide();
                    $(".item-name").hide();

                    $(".item-id").text(
                        "There is no data available for this section"
                    );
                },
            });
        }

        function fetchDetailsGeneration(url) {
            $.ajax({
                type: "GET",
                url: `${url}`,
                success: function (data) {
                    $(".item-img-1").hide();
                    $(".item-img-2").hide();

                    $(".item-ability-1").show();
                    $(".item-ability-2").show();
                    $(".item-id").show();
                    $(".item-weight").show();
                    $(".item-name").show();
                    $(".item-exp").show();
                    $(".item-height").show();
                    $(".item-type-1").show();
                    $(".item-type-2").show();

                    let abilities = data["abilities"].length;
                    let id = data["id"];
                    let region = data["main_region"]["name"];
                    let moves = data["moves"].length;
                    let name = data["names"][3]["name"];
                    let species = data["pokemon_species"].length;
                    let types = data["types"].length;
                    let versionGroups1 = data["version_groups"][0]["name"];
                    let versionGroups2 = data["version_groups"][1]["name"];

                    $(".item-id").text(`ID: ${id}`);
                    $(".item-ability-1").text(`Abilities : ${abilities}`);
                    $(".item-ability-2").text(`Main region : ${region}`);
                    $(".item-weight").text(`Moves : ${moves}`);
                    $(".item-height").text(`Name: ${name}`);
                    $(".item-name").text(`Pokemon species : ${species}`);
                    $(".item-exp").text(`Types : ${types}`);
                    $(".item-type-1").text(
                        `Version group 1 : ${versionGroups1}`
                    );
                    $(".item-type-2").text(
                        `Version group 2 : ${versionGroups2}`
                    );
                },
            });
        }

        function fetchDetailsItem(url) {
            $.ajax({
                type: "GET",
                url: `${url}`,
                success: function (data) {
                    $(".item-img-2").hide();
                    $(".item-weight").hide();
                    $(".item-exp").hide();
                    $(".item-height").hide();
                    $(".item-type-1").hide();
                    $(".item-type-2").hide();

                    $(".item-img-1").show();
                    $(".item-id").show();
                    $(".item-name").show();
                    $(".item-ability-1").show();
                    $(".item-ability-2").show();

                    let id = data["id"];
                    let effect = data["effect_entries"][0]["effect"];
                    let flavor = data["flavor_text_entries"][2]["text"];
                    let name = data["names"][2]["name"];
                    let img = data["sprites"]["default"];

                    $(".item-img-1").attr("src", `${img}`);
                    $(".item-id").html(`ID: ${id} <br><br>`);
                    $(".item-name").text(`Name : ${name}`);
                    $(".item-ability-1").html(
                        `Effect description : ${effect} <br><br>`
                    );
                    $(".item-ability-2").html(`Details : ${flavor}<br><br>`);
                },
            });
        }

        function fetchDetailsLocation(url) {
            $.ajax({
                type: "GET",
                url: `${url}`,
                success: function (data) {
                    // console.log(data);
                    $(".item-img-1").hide();
                    $(".item-img-2").hide();
                    $(".item-height").hide();
                    $(".item-weight").hide();
                    $(".item-type-1").hide();
                    $(".item-type-2").hide();

                    // $(".item-name").show();
                    // $(".item-ability-1").show();
                    // $(".item-ability-2").show();
                    // $(".item-id").show();
                    // $(".item-exp").show();

                    let id = data["id"];
                    let gameIndex = data["game_indices"][0]["game_index"];
                    let generation =
                        data["game_indices"][0]["generation"]["name"];
                    let name = data["names"][0]["name"];
                    let region = data["region"]["name"];

                    $(".item-id").text(`ID: ${id}`);
                    $(".item-ability-2").text(`Game index : ${gameIndex}`);
                    $(".item-ability-1").text(`Generation : ${generation}`);
                    $(".item-name").text(`Name : ${name}`);
                    $(".item-exp").text(`Region: ${region}`);
                },
            });
        }

        function fetchDetailsMachine(url) {
            $.ajax({
                type: "GET",
                url: `${url}`,
                success: function (data) {
                    console.log(data);
                    $(".item-img-1").hide();
                    $(".item-img-2").hide();
                    $(".item-height").hide();
                    $(".item-weight").hide();
                    $(".item-type-1").hide();
                    $(".item-type-2").hide();
                    $(".item-ability-2").hide();

                    $(".item-name").show();
                    $(".item-id").show();
                    $(".item-ability-1").show();
                    $(".item-exp").show();

                    let id = data["id"];
                    let item = data["item"]["name"];
                    let move = data["move"]["name"];
                    let version = data["version_group"]["name"];

                    $(".item-name").text(`Item name : ${item}`);
                    $(".item-id").text(`ID : ${id}`);
                    $(".item-ability-1").text(`Move name : ${move}`);
                    $(".item-exp").text(`Version group : ${version}`);
                },
            });
        }

        function fetchDetailsMove(url) {
            $.ajax({
                type: "GET",
                url: `${url}`,
                success: function (data) {
                    console.log(data);
                    $(".item-img-1").hide();
                    $(".item-img-2").hide();

                    $(".item-height").show();
                    $(".item-weight").show();
                    $(".item-type-1").show();
                    $(".item-type-2").show();
                    $(".item-ability-1").show();
                    $(".item-ability-2").show();
                    $(".item-exp").show();
                    $(".item-name").show();
                    $(".item-id").show();

                    let id = data["id"];
                    let accuracy = data["accuracy"];
                    let type = data["contest_type"]["name"];
                    let damage = data["damage_class"]["name"];
                    let effect = data["effect_entries"][0]["short_effect"];
                    let text = data["flavor_text_entries"][2]["flavor_text"];
                    let generation = data["generation"]["name"];
                    let name = data["names"][2]["name"];
                    let power = data["power"];

                    $(".item-height").html(`Power : ${power} <br><br>`);
                    $(".item-weight").text(`Generation : ${generation}`);
                    $(".item-type-1").html(`Description : ${text} <br><br>`);
                    $(".item-type-2").text(`Effect : ${effect}`);
                    $(".item-ability-1").text(`Damage : ${damage}`);
                    $(".item-ability-2").text(`Type : ${type}`);
                    $(".item-exp").text(`Accuracy : ${accuracy}`);
                    $(".item-name").text(`Name : ${name}`);
                    $(".item-id").text(`ID : ${id}`);
                },
            });
        }

        function fetchDetailsPokemon(url) {
            $.ajax({
                type: "GET",
                url: `${url}`,
                success: function (data) {
                    $(".item-img-1").show();
                    $(".item-img-2").show();
                    $(".item-height").show();
                    $(".item-weight").show();
                    $(".item-type-1").show();
                    $(".item-type-2").show();
                    $(".item-ability-2").show();
                    $(".item-ability-1").show();
                    $(".item-exp").show();
                    $(".item-name").show();

                    let ability = data["abilities"];
                    if (ability > 1) {
                        let ability2 = data["abilities"][1]["ability"]["name"];
                        $(".item-ability-2").text(
                            `Ability no. 2 : ${ability2}`
                        );
                    }
                    let ability1 = data["abilities"][0]["ability"]["name"];
                    let exp = data["base_experience"];
                    let height = data["height"];
                    let id = data["id"];
                    let name = data["name"];
                    let img1 = data["sprites"]["front_default"];
                    let img2 = data["sprites"]["back_default"];
                    let type = data["types"];
                    if (type.length > 1) {
                        let type2 = data["types"][1]["type"]["name"];
                        $(".item-type-2").text(`Type no. 2: ${type2}`);
                    }
                    let type1 = data["types"][0]["type"]["name"];
                    let weight = data["weight"];

                    $(".item-ability-1").text(`Ability no. 1 : ${ability1}`);
                    $(".item-exp").text(`Experience: ${exp}`);
                    $(".item-height").text(`Height: ${height}`);
                    $(".item-id").text(`ID: ${id}`);
                    $(".item-name").text(`Name: ${name}`);
                    $(".item-img-1").attr("src", `${img1}`);
                    $(".item-img-2").attr("src", `${img2}`);
                    $(".item-type-1").text(`Type no. 1 : ${type1}`);
                    $(".item-weight").text(`Weight: ${weight}`);
                },
            });
        }

        function showError(dataType) {
            console.log(`${dataType} error`);
        }
    }
});

// Get the current year for the copyright
$("#year").text(new Date().getFullYear());
