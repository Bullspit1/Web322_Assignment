window.onload = function(){
    const card = document.getElementsByClassName("card");

    for(let i = 0; i < card.length; i++){
        card[i].addEventListener("click", function(e){
            const selectedCard = card[i].parentElement.children[i];

            fetch('/roomDescription/' + selectedCard.id, {method : 'POST'})
            .then(function(response){
                console.log(response);
            // if(response.ok){
            //     console.log(response);
            // }else{
            //     console.log("error");
            // }
            });
        });
    }
}