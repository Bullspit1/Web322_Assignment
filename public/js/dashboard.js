

window.onload = function(){
    const btn = document.getElementsByClassName("clk");
    for(let i = 0; i < btn.length; i++){
    btn[i].addEventListener("click", function(e){
        console.log(i);
        btn[0].className = btn[0].className.replace(" active", "");
        btn[1].className = btn[1].className.replace(" active", "");
        btn[2].className = btn[2].className.replace(" active", "");

        if(i === 0){
            e.target.className += " active";
            document.getElementById("createRoomInfo").style.display = "block";
            document.getElementById("updateRoomInfo").style.display = "none";
            document.getElementById("removeRoomInfo").style.display = "none";
        }else if(i === 1){
            e.target.className += " active";
            document.getElementById("createRoomInfo").style.display = "none";
            document.getElementById("updateRoomInfo").style.display = "block";
            document.getElementById("removeRoomInfo").style.display = "none";
        }else{
            e.target.className += " active";
            document.getElementById("createRoomInfo").style.display = "none";
            document.getElementById("updateRoomInfo").style.display = "none";
            document.getElementById("removeRoomInfo").style.display = "block";
        }

        });
    }
}
