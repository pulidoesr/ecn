document.getElementById('jsonForm').addEventListener('submit', function(event) {
  event.preventDefault();
  
  const fileName = document.getElementById('fileName').value;
  if (!fileName) {
    console.log("No file name provided.");
  } else {
    loadjson(fileName);
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
document.getElementById("Group1").style.display = "block";
document.querySelector(".tablinks").classList.add("active");


async function loadjson(fileName) {
  try {
    const response = await fetch(`/src/json/${fileName}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const jsonData = await response.json();
    console.log("Response status:", response.status);
    console.log("Fetched JSON data:", jsonData);

    // Extract headers and fields from JSON
    const headers = jsonData[1]; // Second entry contains headers
    const fields = jsonData[0];  // First entry contains fields

     // Separate fields into three groups based on desired distribution
     const group1Fields = {};
     const group2Fields = {};
     const group3Fields = {};
     const group4Fields = {};
     const group5Fields = {};
     const group6Fields = {};
     const group7Fields = {};
     const group8Fields = {};
     const group9Fields = {};

     const fieldKeys = Object.keys(fields);
     fieldKeys.forEach((key, index) => {
      if (index < fieldKeys.length / 3) {
        group1Fields[key] = fields[key];
      } else if (index < (2 * fieldKeys.length) / 3) {
        group2Fields[key] = fields[key];
      } else {
        group3Fields[key] = fields[key];
      }
    });

        // Populate tables with fields and headers
        populateTable('jsonTable1', group1Fields, headers);
        populateTable('jsonTable2', group2Fields, headers);
        populateTable('jsonTable3', group3Fields, headers);

  } catch (error) {
    console.error('Error fetching or parsing the JSON file:', error);
  }
}

 // Update populateTable function to handle fields and headers
function populateTable(tableId, fields, headers) {
  const table = document.getElementById(tableId);
  const thead = table.querySelector('thead tr');
  const tbody = table.querySelector('tbody');
  
  // Clear previous content
  thead.innerHTML = '';
  tbody.innerHTML = '';

  // Create headers based on provided header definitions
  Object.keys(fields).forEach(key => {
    const th = document.createElement('th');
    console.log(key);
    console.log(headers[key]);
    th.textContent = key || headers[key]; // Use header if available, or key as fallback
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