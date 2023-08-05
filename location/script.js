//getting all the required html elements
const latitude = document.getElementById("latitude");
const longitude = document.getElementById("longitude");
const cityElement = document.getElementById("city");
const regionElement = document.getElementById("region");
const organisation = document.getElementById("org");
const hostName = document.getElementById("host-name");
const pinCode = document.getElementById("pincode");
const timeZone = document.getElementById("timeZone");
const map = document.getElementById("map");
const message = document.getElementById("message");
const postOfficesContainer = document.getElementById("nearby-post-offices");

//retrieving current client's ip address from session storage
const ipAdsress = sessionStorage.getItem("userIpAddress");

//showing ip address on the header
document.getElementById("ipAddress").innerText = ipAdsress;

const endpoint = `http://ip-api.com/json/${ipAdsress}`;

//fetching location data from api
async function getLocationInfo() {
  try {
    const response = await fetch(endpoint);
    const responseData = await response.json();
    console.log(responseData);
    //   if(responseData.status !== "success"){
    //     alert("Failed to fetch data ! Refresh to try again");
    //   }
    renderDataOntoUI(responseData);
  } catch {
    alert("Failed to fetch data ! Refresh to try again");
  }
}
getLocationInfo();

async function renderDataOntoUI(data) {
  const { lat, lon, city, region, org, as, zip, timezone } = data;
  //setting header location info
  latitude.innerText = lat;
  longitude.innerText = lon;
  cityElement.innerText = city;
  regionElement.innerText = region;
  organisation.innerText = org;
  hostName.innerText = as;

  //setting more info data
  pinCode.innerText = zip;
  timeZone.innerText = timezone;

  //setting map lat and long
  map.src = `https://maps.google.com/maps?q=${lat}, ${lon}&z=15&output=embed`;

  const postOfficeData = await getNearbyPostOffices(zip);
  message.innerText = postOfficeData.Message;
 console.log(postOfficeData)
  renderNearbyPostOfficesOntoUI(postOfficeData.PostOffice);
}

async function getNearbyPostOffices(pincode) {
  const response = await fetch(
    `https://api.postalpincode.in/pincode/${pincode}`
  );
  const responseData = await response.json();
  console.log(responseData[0]);
  return responseData[0];
}

function renderNearbyPostOfficesOntoUI(postOfficeData){
    postOfficesContainer.innerHTML = "";

    postOfficeData.forEach(postOffice => {
        console.log(postOffice)

        const {Name,BranchType,DeliveryStatus,District,Division}=postOffice;
        postOfficesContainer.innerHTML += `<div class="post-office">
        <div class="name">Name: <span>${Name}</span></div>
        <div class="branch-type">Branch Type: <span>${BranchType}</span>
        </div>
        <div class="delivery-status">Delivery Status: <span>${DeliveryStatus}</span></div>
        <div class="district">District: <span>${District}</span></div>
        <div class="division">Division: <span>${Division}</span></div>
    </div>` 
    })
}
/*
as: "AS135697 Tachyon Communications Pvt Ltd";
city: "Kanpur";
country: "India";
countryCode: "IN";
isp: "Suyog System And Software Pvt Ltd";
lat: 26.4969;
lon: 80.3246;
org: "Suyog System And Software Pvt Ltd";
query: "103.158.183.59";
region: "UP";
regionName: "Uttar Pradesh";
status: "success";
timezone: "Asia/Kolkata";
zip: "208001";
*/

/*
Block: "Kanpur";
BranchType: "Branch Office directly a/w Head Office";
Circle: "Uttar Pradesh";
Country: "India";
DeliveryStatus: "Delivery";
Description: null;
District: "Kanpur Dehat";
Division: "Kanpur Moffusil";
Name: "Aanupur";
Pincode: "208001";
Region: "Kanpur";
State: "Uttar Pradesh";
*/
