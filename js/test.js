$.ajax({
    type: "GET",
    url: `https://pokeapi.co/api/v2/pokemon/1/`,
    success: function (data) {
        // console.log(data["name"]);
        // console.log(data["id"]);
        // console.log(data["weight"]);
        // console.log(data["height"]);
        // console.log(data["types"][0]['type']['name']);
        // console.log(data["types"][1]['type']['name']);
    },
});
$.ajax({
    type: "GET",
    url: `https://pokeapi.co/api/v2/berry/`,
    success: function (data) {
        console.log(data["results"]);
        data["results"].forEach((element, index) => {
            // console.log(index);
            console.log(element["name"]);
            const url = element["url"];
            const urlSplit = url.split("/");
            console.log(urlSplit[urlSplit.length - 2]);
        });

        // for (let i = 0; i < 20; i++) {
        //     const name = data["results"][i]["name"];
        //     console.log(name);
        //     const url = data["results"][i]["url"];
        //     const splitURL = url.split('/');
        //     console.log(url);
        //     console.log(splitURL[splitURL.length - 2]);
        // }
        // console.log(data["name"]);
        // console.log(data["id"]);
        // console.log(data["weight"]);
        // console.log(data["height"]);
        // console.log(data["types"][0]['type']['name']);
        // console.log(data["types"][1]['type']['name']);
    },
});

// data.results.forEach((element, index) => {
//     let name;
//     if (typeof element.name == "undefined") {
//         name = `${index + offset + 1}`;
//     } else {
//         name =
//             element.name.charAt(0).toUpperCase() +
//             element.name.slice(1);
//     }

//     //Select the id from the URL
//     const url = element["url"];
//     const splitUrl = url.split("/");
//     const elemId = splitUrl[splitUrl.length - 2];

//     const pokeListItem = pokeListItems[elemId - 1];
//     console.log(pokeListItem);
//     resultData = data.results[elemId];

// });
