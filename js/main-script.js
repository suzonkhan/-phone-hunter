let searchField = document.getElementById("search-field");
let userGuide = document.getElementById("user-guide-wrapper");

document.getElementById("search-btn").addEventListener("click", function(){
    toggleElament("pre-loader", "flex");
    toggleElament("phone-details", "none");

    let searchKeyword = searchField.value;
    const searchURL = `https://openapi.programming-hero.com/api/phones?search=${searchKeyword}`;
    if(searchKeyword.length > 0){
        fetch(searchURL)
        .then(response => response.json())
        .then(ApiData => displayPhone(ApiData.data))
    } else{
        userGuide.innerHTML = "Please use any keywork for search";
        userGuide.style.color = "red";
        toggleElament("pre-loader", "none");
    }
});
function displayPhone(phones){
    if(!phones.length > 0){
        
        userGuide.innerHTML = "Please search with diffrent keyword";
        userGuide.style.color = "red";
        toggleElament("pre-loader", "none");
    } else{
        toggleElament("user-guide-wrapper", "none");
    } 
    limitedPhones = phones.splice(0, 20);
    searchField.value = ""; 
    const resultWrapper = document.getElementById("result-wrapper");
    resultWrapper.innerHTML = "";   
    
    limitedPhones.forEach(phone => {
        const div = document.createElement("div");
        div.classList.add("col-md-3");
        const innerContent = ` 
        <div class='card mb-3'>
            <div class='card-body text-center'>
                <img src="${phone.image}"/>
                <h4 class="my-2">   ${phone.phone_name}</h4>
                <p> Brand: ${phone.brand}</p>
                <button type="button" class="btn btn-primary" onclick="phoneDetails('${phone.slug}')">View Details</button>
            </div>
        </div>
        `;
        div.innerHTML = innerContent;
        resultWrapper.appendChild(div);
        toggleElament("pre-loader", "none");
    });
}
function toggleElament(elementID, display) {
    document.getElementById(elementID).style.display = display;
}
function phoneDetails(phoneSlug) {
    const detailsURL = `https://openapi.programming-hero.com/api/phone/${phoneSlug}`;
    fetch(detailsURL)
    .then(response => response.json())
    .then(apiData => showPhoneDetails(apiData.data)) 
}

function showPhoneDetails(phone) {
   const detailsWrapper =  document.getElementById("phone-details");
   detailsWrapper.innerText ="";
   const div = document.createElement("div");
        const innerContent = ` 
        <div class='card my-5'>
        <div class='card-body p-4'>
        <div class='row'>
        <div class="col-md-4 text-center">
        <img src="${phone.image}"/>
        </div>
        <div class="col-md-8"> 
                <h2>${phone.name}</h2>
                <p>Brand: ${phone.brand ? phone.brand : "Unknown"}</p>
                <p> ${phone.releaseDate ? phone.releaseDate : ""}</p> 
                <div class="main-features">
                    <h4>Main Features</h4>
                    <ul id="features-list"></ul>
                    <h5>Sensors</h5>
                    <ul id="sensors-list"> </ul>
                </div>
                <div class="others-features">
                <h5>Others</h5>
                <ul id="others-list"> </ul>
                </div>
            </div>
        </div>
        </div>
        </div>
        
        `;
        
        div.innerHTML = innerContent;
        detailsWrapper.appendChild(div);
        showListItem(phone.mainFeatures.sensors, "sensors-list");
        showListItem(phone.mainFeatures, "features-list");
        showListItem(phone.others, "others-list");
        toggleElament("phone-details", "block");
        window.scrollTo(0, 210);
}

function showListItem(data, documentID) {
    if(Array.isArray(data)){
        data.forEach(sensor => {
            let listItem = document.createElement("li");
            let elamentContent = `${sensor}`
            listItem.innerHTML = elamentContent;
            document.getElementById(documentID).appendChild(listItem)
       });
    } else{
        for (const key in data) {
            let listItem = document.createElement("li");
            let elamentContent = `${data[key]}`
            listItem.innerHTML = elamentContent;
            document.getElementById(documentID).appendChild(listItem)
        }
    }
}