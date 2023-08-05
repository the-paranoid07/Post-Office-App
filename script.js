const ipAdsress = document.getElementById("ip-address");
const getStarted = document.getElementById("btn");

//fetch ip address of the client
async function getIpAdress(){
const response = await fetch("https://api.ipify.org/?format=json");
const responseData = await response.json();
const ip = responseData.ip;
sessionStorage.setItem("userIpAddress",ip);
ipAdsress.innerText = ip;
}
getIpAdress();

//opening location info in next window
getStarted.addEventListener("click",event => {
    console.log("clicked");
    // window.location.href = './location/index.html';
    window.open('./location/index.html');
})


