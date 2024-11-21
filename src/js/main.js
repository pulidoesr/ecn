// Develop by: Eduardo Pulido
// Date: 11/06/2024

document.addEventListener('DOMContentLoaded', function() {
const categorySelect = document.getElementById('categorySelect');
let categories = []; // Categories from the master JSON
let i = 0; // Count files to process

// Load main JSON file and populate category dropdown
fetch('/src/json/ecn_master.json') 
  .then(response => response.json())
  .then(data => {
    categories = data; 
    populateCategorySelect(data);
  })
  .catch(error => console.error('Error loading categories:', error));

 // Function to clear existing content
 function resetScreen() {
  // Clear all dynamically created tables or elements
  const tabContentContainers = document.querySelectorAll(".tabcontent");
  tabContentContainers.forEach(table => {
    table.querySelector('thead').innerHTML = '';  // Clear the header row
    table.querySelector('tbody').innerHTML = '';  // Clear the body rows
  });
  
  // Optionally, reset visibility of tabs and active states
  const tabLinks = document.querySelectorAll(".tablinks");
  tabLinks.forEach(link => link.classList.remove("active"));
  document.getElementById("Group1").style.display = "none"; // Hide initial group
  document.getElementById("Group2").style.display = "none"; // Hide initial group
  document.getElementById("Group3").style.display = "none"; // Hide initial group
  document.getElementById("Group4").style.display = "none"; // Hide initial group
  document.getElementById("Group5").style.display = "none"; // Hide initial group
  document.getElementById("Group6").style.display = "none"; // Hide initial group
  document.getElementById("Group7").style.display = "none"; // Hide initial group
}

 // Populate category dropdown
 function populateCategorySelect(categories) {
  categories.forEach((category) => {
    const categoryName = Object.keys(category)[0];
    const option = document.createElement('option');
    option.value = categoryName;
    option.textContent = categoryName;
    categorySelect.appendChild(option);
  });
}

// Event listener for category selection
categorySelect.addEventListener('change', function() {
  const selectedCategory = categorySelect.value;

  if (i > 0) {
    resetScreen();
    i = 0;
  }
  if (selectedCategory) {
    const selectedCategoryFiles = getFilesForCategory(selectedCategory);
     // Show Group1 and set the first tab link as active
     document.getElementById("Group1").style.display = "block";
     const firstTabLink = document.querySelector(".tablinks");
     if (firstTabLink) {
       firstTabLink.classList.add("active");
     }
    selectedCategoryFiles.forEach(file => {
      i +=1;
      if (file){
         loadjson(file,i);
         console.log(file);
      }
    });
  }
});

 // Function to get files for the selected category
function getFilesForCategory(selectedCategory) {
  console.log("Selected Category:", selectedCategory); // Check the selected category value

  // Attempt to find the matching category object
  const categoryObj = categories.find(cat => Object.keys(cat)[0] === selectedCategory);

  if (categoryObj) {
    console.log("Matching category object found:", categoryObj); // Log the found object
    return categoryObj[selectedCategory];
  } else {
    console.log("No matching category found for:", selectedCategory);
    return [];
  }
}
});


// Tab function to show/hide content
window.openTab = function openTab(evt, groupName) {
  // Hide all tab content
  const tabcontent = document.getElementsByClassName("tabcontent");
  for (let i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  
  // Remove active class from all tab buttons
  const tablinks = document.getElementsByClassName("tablinks");
  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  // Show current tab content and add active class to the button
  document.getElementById(groupName).style.display = "block";
  evt.currentTarget.className += " active";
}

async function loadjson(fileName,i) {
  try {
    const response = await fetch(`/src/json/${fileName}`);
    if (!response.ok) {
      throw new Error(`Error fetching file: ${fileName} (status: ${response.status})`);
    }
    const jsonData = await response.json();

    if (!Array.isArray(jsonData) || jsonData.length < 2) {
      throw new Error(`Unexpected JSON structure in file: ${fileName}`);
    }
    // Extract headers and fields from JSON
    const headers = jsonData[1]; // Second entry contains headers
    const fields = jsonData[0];  // First entry contains fields
    const groupFields = {};
    const fieldKeys = Object.keys(fields);
    fieldKeys.forEach((key) => { 
        groupFields[key] = fields[key];
      });
    // Populate tables with fields and headers
    populateTable('jsonTable'+ i, groupFields, headers);
  } catch (error) {
    console.error('Error fetching or parsing the JSON file:', error);
  }
}

 // Update populateTable function to handle fields and headers
function populateTable(tableId, fields, headers) {
  const table = document.getElementById(tableId);
   // Ensure <thead> and <tbody> are present
   let dthead = table.querySelector('thead');
   let dtbody = table.querySelector('tbody');
   
   if (!dthead) {
     dthead = document.createElement('thead');
     table.appendChild(dthead);
   }
   if (!dtbody) {
     dtbody = document.createElement('tbody');
     table.appendChild(dtbody);
   }
    // Ensure there's a <tr> in <thead> for headers
    let theadRow = dthead.querySelector('tr');
    if (!theadRow) {
       theadRow = document.createElement('tr');
       dthead.appendChild(theadRow);
       }
  
  const thead = table.querySelector('thead tr');
  const tbody = table.querySelector('tbody');
  
  // Create headers based on provided header definitions
  Object.keys(fields).forEach(key => {
    const th = document.createElement('th');
    th.textContent = headers[key][0] + " | ID: " + headers[key][1]; // Use header if available, or key as fallback
    thead.appendChild(th);
  });
  
  // Determine the maximum number of rows needed for fields with varying entry counts
  const maxRows = Math.max(...Object.values(fields).map(field => field.length || 1));


  for (let rowIndex = 0; rowIndex < maxRows; rowIndex++) {
    const row = document.createElement('tr');
    Object.keys(fields).forEach(header => {
      const td = document.createElement('td');
      const input = document.createElement('input');
      input.type = 'text';
      input.value = fields[header][rowIndex] || ''; // Use empty string if the field has fewer entries
      td.appendChild(input);
      row.appendChild(td);
    });
    tbody.appendChild(row);
 }
}