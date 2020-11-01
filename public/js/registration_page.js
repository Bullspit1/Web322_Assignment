// Stephen Ditta
// scditta@myseneca.ca
// WEB322NBB
// Sharmin Ahmed

var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

window.onload = function(){

    //generate months
    for(let i = 0; i < months.length; i++){
        var monthOption = document.createElement("option");
        var month = document.getElementById("month").appendChild(monthOption);
        month.innerHTML = months[i];
    }

    //generate days
    for(let i = 1; i < 31 + 1; i++){
        var dayOption = document.createElement("option");
        var day = document.getElementById("day").appendChild(dayOption);
        day.innerHTML = i;
    }

    //generate years
    for(let i = 2020; i > 1940 - 1; i--){
        var yearOption = document.createElement("option");
        var year = document.getElementById("year").appendChild(yearOption);
        year.innerHTML = i;
    }

}

