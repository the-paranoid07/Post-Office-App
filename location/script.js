//getting all the required html elements
const latitude = document.getElementById("latitude");
const longitude = document.getElementById("longitude");
const cityElement = document.getElementById("city");
const regionElement = document.getElementById("region");
const organisation = document.getElementById("org");
const hostName = document.getElementById("host-name");
const pinCode = document.getElementById("pincode");
const timeZone = document.getElementById("timeZone");
const dateTime = document.getElementById("date-time");
const map = document.getElementById("map");
const message = document.getElementById("message");
const postOfficesContainer = document.getElementById("nearby-post-offices");
const searchBar = document.getElementById("search");

//post offices data used to filter 
let postOfficeData = [];

//retrieving current client's ip address from session storage
const ipAddress = sessionStorage.getItem("userIpAddress");

//showing ip address on the header
document.getElementById("ipAddress").innerText = ipAddress;

const endpoint = `https://ipinfo.io/${ipAddress}?token=220c7375191b11`;

//fetching location data from api
getLocationInfo();
async function getLocationInfo() {
  try {
    const response = await fetch(endpoint);
    const responseData = await response.json();
    // console.log(responseData);
    renderDataOntoUI(responseData);
  } catch (Error) {
    // console.log(Error);
    alert("Failed to fetch data ! Refresh to try again");
  }
}

//rendering data onto UI
async function renderDataOntoUI(data) {
  const {city, region, org,postal,timezone } = data;
  const lat = data.loc.split(",")[0]
  const lon = data.loc.split(",")[1]
  //setting header location info
  latitude.innerText = lat;
  longitude.innerText = lon;
  cityElement.innerText = city;
  regionElement.innerText = region;
  organisation.innerText = org;
  hostName.innerText = org;

  //setting more info data
  pinCode.innerText = postal;
  timeZone.innerText = timezone;

  //setting map lat and long
  map.src = `https://maps.google.com/maps?q=${lat}, ${lon}&z=15&output=embed`;

  //setting date and time
  const dateAndTime = new Date().toLocaleString("en-US", { timeZone: timezone });
  dateTime.innerText=dateAndTime;

  //fetch post offices
  const postOfficeDataResponse = await getNearbyPostOffices(postal);
  postOfficeData =postOfficeDataResponse.PostOffice;
//   console.log(postOfficeData)

  //setting message 
  message.innerText = postOfficeDataResponse.Message;

  //display post offices data onto UI
  renderNearbyPostOfficesOntoUI(postOfficeDataResponse.PostOffice);
}

//getting list of post offices nearby based on pincode
async function getNearbyPostOffices(pincode) {
  const response = await fetch(
    `https://api.postalpincode.in/pincode/${pincode}`
  );
  const responseData = await response.json();
//   console.log(responseData[0]);
  return responseData[0];
}

//rendering nearby post office onto the UI
function renderNearbyPostOfficesOntoUI(postOfficeData) {
  postOfficesContainer.innerHTML = "";

  postOfficeData.forEach((postOffice) => {
    // console.log(postOffice);

    const { Name, BranchType, DeliveryStatus, District, Division } = postOffice;
    postOfficesContainer.innerHTML += `<div class="post-office">
        <div class="name">Name: <span>${Name}</span></div>
        <div class="branch-type">Branch Type: <span>${BranchType}</span>
        </div>
        <div class="delivery-status">Delivery Status: <span>${DeliveryStatus}</span></div>
        <div class="district">District: <span>${District}</span></div>
        <div class="division">Division: <span>${Division}</span></div>
    </div>`;
  });
}


searchBar.addEventListener("keyup",(event)=>{
    const searchValue = event.target.value.trim().toLowerCase();
    const filteredData = [];
    // console.log(searchValue)
    // console.log(postOfficeData)
    postOfficeData.forEach(postOffice => {
        const name = postOffice.Name.toLowerCase();
        const branch = postOffice.BranchType.toLowerCase();

        if(name.includes(searchValue) || branch.includes(searchValue)){
            filteredData.push(postOffice);
        }
    });

    renderNearbyPostOfficesOntoUI(filteredData);

})