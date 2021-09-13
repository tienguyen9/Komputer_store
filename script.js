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
        option.value = c["id"] -1;
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
    img.src = "https://noroff-komputer-store-api.herokuapp.com/" + computerData[laptopId]["image"]
    img.height = 150
    img.width = 150
    //TODO add on error
    img.onerror = () => {
        img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAN0AAADSCAMAAAD5TDX9AAAAYFBMVEX19fWZmZkzMzOEhITZ2dnu7u5HR0dWVlahoaGysrJ7e3vW1ta7u7vc3NxOTk7f399dXV3Ly8upqam4uLg4ODhnZ2fp6ek/Pz+zs7N0dHSKiopubm7ExMSWlpbl5eWlpaUhZLfyAAAEYElEQVR4nO2c65KiMBBGQQdEAbmIoKLM+7/lGm6BkBZ0tibT1Hd+7Gqla+2zSToBg5YFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJjhhMkpTT3b9tL0lISO6Xz+I3mytxXSZCWC4UStYR+azuznRITbGvzyC+0muHAen773Wu5ZZHzTOX5MMOcmCExn+RnOixk3mn0cR2eeLpN7rg789JzFchz1JsMy6BWcyXzcm8z0A6YFZVAc/Ukjr9Iyzd9OZGsybeW0MDiade61nZeby/ZdTtP0Z+zsk7ls3yTSZD+0u+vaI3P5vod2Gb/Ldq0dl7oZ6pKftePSefod2KDo6/efPDrP0eY+b2ez2LHoKuIiu4T+N/8OxAZzUPKJS1oOQ5MYmAvsOAxNfcW07YsMoS78GNxmIabdcNxRdgwmnm4XpthRl34MrhSo1NO3Qv4qC1L/5mtH3eT7liGUnWcu66UQmQ/tyLuc5rJeCpX5oGMY21GpD+wW/Af8Vcg7fTKEimBQVX5gx2CjSa3m0o7aiXK4t0LtxOz+rpf2touAwU6M2kXb3r6FLJkMdtHkuJuHwRUQXVbmYFBUXky8ORhMO8vKieT7rwo0XzLUcBiY5MWpDNC3sxiYZNWUAfp2BhWzRt95sp1z11GdJ9tZdx1xS08261oZ7MI6dN9OvrbzeBTMBl3Rl62aRk7fLGu/KpCN0zYG9/pGTOvmi9WcTb3sWPdpnHWfpFr5KThr3ScYrZWfPn2OzpmTwyemo7Jjzae+BWs+sS9wVvy0RY0TJkH3pEywridlAAAAAAAAAAAAAAAAAABglM3Xb3/i1u2PcQfubPCmZffRZxmw2xy6lzq7/egMyvYaNVQffZYBu23RnVzT2d3GdodpxBsYsHukbtsTGjsnZm53s87X5mVr53hxke0e4pvHW1bPsv7HDUZ2gziZeLgR74/+1+GYFef2mEd1a95kJuyionkQubHL4/gURUG8q3t0R/bdOE6xe7i2X/mPrB70kXu+V+Fl923AbmtZ7dhs7A7nujeccyn+ou3GcYpd1hzb9+ra2kRY+dFEVXn+UdZjs7YLN+3Bmq/6BWmnxCl27ViPNpUIaNs8Q3ZRISRqu7RfymLxlKBit8ka9mqcYtc9PyrM+0jfkJ2VFlVrd7t2LQfRUYpd6Tfkapxi1y0ywq6PzE3ZWWXZ2snBV2dFjkwlTrHrzsQJOxlpzK4q0iV9J+2IvvOndn2kY8zO2hfRvZ53x65FN++knRLX1Zj71M6L2zfG5t2Ta5kIu0qpmaNHdAd2Spzb/t7RY2qXZO1eKDVoV7nber3bxsN1rLyNggfr3Tju2g5wd2pnxU2bszOzmjdcNrWdc94N9iBpEeRVf0UwtBvH+dk2qfz0aGvsfPea5FUQezuDdta13Wd+i/1j9xidd8zc/hdjxvvMUVxSFtnTwtHYtfvMu1X+uh0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMBq+Qcf9zKBTrP28AAAAABJRU5ErkJggg=="
    }


    img_home.appendChild(img);
}