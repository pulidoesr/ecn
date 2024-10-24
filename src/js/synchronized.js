
async function loadjson() {
  // JSON data
  const response = await fetch('/src/json/synchronizedfields.json');
  const table = document.getElementById('jsonTable');
  const thead = table.querySelector('thead tr');
  const tbody = table.querySelector('tbody');

  try {
    // Check if the response is successful
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const jsonData = await response.json(); // Parse JSON data
    console.log(jsonData);

    // Get keys (column headers) from the first object
    const headers = Object.keys(jsonData[0]);

    // Dynamically create table headers
    headers.forEach(header => {
      const th = document.createElement('th');
      const value2 = jsonData[1][header] || ''; // Handle the values from the second object
      th.textContent = header + ' (Id:) ' + value2;
      thead.appendChild(th);
    });

    // Get the number of rows based on the longest array in the first object
    const rowCount = Math.max(...Object.values(jsonData[0]).map(val => Array.isArray(val) ? val.length : 1));

    // Dynamically create rows and fill data
    for (let i = 0; i < rowCount; i++) {
      const row = document.createElement('tr');

      headers.forEach(header => {
        const td = document.createElement('td');
        const value1 = jsonData[0][header][i] || ''; // Handle the array values from the first object
        td.textContent = `${value1}`; // Combine both values into one cell
        row.appendChild(td);
      });

      tbody.appendChild(row);
    }
  } catch (error) {
    console.error('Error fetching or parsing the JSON file:', error);
  }
}
loadjson();