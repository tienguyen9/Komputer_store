let computerData;
let bankBalance = 0;
let outstandingLoan = 0;
let hasLoan = false;
let workBalance = 0;

let repay = document.getElementById("repay");
repay.style.display = "none";

async function getComputers() {
    const computers = await fetch('https://noroff-komputer-store-api.herokuapp.com/computers')
        .then(response => response.json())
        .then(computer => computerData=computer)
        .catch(err => console.log(err));

    appendComputerItems()
    updateLaptopView()
}

function updateLaptopView(){
    document.getElementById("currentLaptop").innerHTML = "";
    let laptopId = document.getElementById("laptops").value;
    let tagTitle = document.createElement("h3");
    let textTitle = document.createTextNode(computerData[laptopId]["title"]);
    let tagDesc = document.createElement("p");
    let textDesc = document.createTextNode(computerData[laptopId]["description"]);

    tagTitle.appendChild(textTitle);
    tagDesc.appendChild(textDesc);
    let laptopWindow = document.getElementById("currentLaptop");
    laptopWindow.appendChild(tagTitle);
    laptopWindow.appendChild(tagDesc);

    addimage()
    document.getElementById("price").innerHTML = computerData[laptopId]["price"];


}

function appendComputerItems(){
    let laptopList = document.getElementById("laptops")
    for (let c of computerData){
        let option = document.createElement("option");
        option.text = c["title"];
        option.value = c["id"];
        laptopList.appendChild(option)
    }
}

function work(){
    workBalance += 100;
    updateHtmlMoney()
}

function updateHtmlMoney(){
    document.getElementById("balanceBank").innerHTML = bankBalance;
    document.getElementById("balanceWork").innerHTML = workBalance;
    if(hasLoan){
        document.getElementById("outstandingAmount").innerHTML = outstandingLoan;
    }



}

function getLoan(amount){
    if(!hasLoan && amount < bankBalance*2 && amount > 0){
        bankBalance += amount;
        outstandingLoan = amount;
        hasLoan = true;
        updateHtmlMoney()
        repay.style.display = "block";
        document.getElementById("outstandingRow").innerHTML = "Outstanding Loan";
        document.getElementById("outstandingAmount").innerHTML = outstandingLoan;
        document.getElementById("outstandingKr").innerHTML = "Kr";
    }else if (amount > bankBalance*2) {
        alert("You cannot borrow more than twice your balance!")
    }else if(amount <= 0) {
        alert("You cannot borrow negative money!")
    }else{
        alert("You already have a loan!")
    }

}

function loanDialog() {
    let text;
    let amount = prompt("Please enter the amount you want to loan:");

    getLoan(parseInt(amount));
}

function checkLoan(){
    let repay = document.getElementById("repay");
    if(outstandingLoan > 0){
        return true;
    }
    //if bank balance is negative, refund
    repay.style.display = "none";
    document.getElementById("outstandingRow").innerHTML = "";
    document.getElementById("outstandingAmount").innerHTML = "";
    document.getElementById("outstandingKr").innerHTML = "";
    bankBalance -= outstandingLoan;
    outstandingLoan = 0;
    hasLoan = false;
    return false;
}

function repayLoan(){
    let diff = outstandingLoan - workBalance;
    outstandingLoan -= workBalance;
    console.log(diff);
    //if work balance is higher than outstanding loan
    if (diff < 0){
        workBalance = -diff;
    }else{
        workBalance = 0;
    }


    updateHtmlMoney();
    checkLoan();
}


function bankWorkMoney(){
    if(hasLoan){
        bankBalance += workBalance*0.9;
        outstandingLoan -= workBalance*0.1;
    }else{
        bankBalance += workBalance;
    }
    workBalance = 0;

    updateHtmlMoney()
    checkLoan()

}


function buyLaptop(){
    let laptopId = document.getElementById("laptops").value;
    let price = computerData[laptopId]["price"]
    if (bankBalance >= price){
        bankBalance -= price
        alert("Congrats, you are now a owner of " + computerData[laptopId]["title"]);
    }
    else{
        alert("You need more money to buy " + computerData[laptopId]["title"]);
    }
    console.log(price)
    updateHtmlMoney()
}

//https://noroff-komputer-store-api.herokuapp.com/assets/images/1.png

function addimage() {
    document.getElementById("img_home").innerHTML = "";
    let laptopId = document.getElementById("laptops").value;

    let img = new Image();
    img.src = "https://noroff-komputer-store-api.herokuapp.com/assets/images/" + laptopId + ".png"
    img.height = 150
    img.width = 150
    //TODO add on error


    img_home.appendChild(img);
}