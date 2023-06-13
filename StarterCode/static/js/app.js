const bb_json = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch data from the JSON endpoint
fetch(bb_json)
  .then(response => response.json())
  .then(data => {
    // Get the dropdown element
    const dropdown = document.getElementById("selDataset");

    // Populate the dropdown with options
    data.names.forEach(name => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      dropdown.appendChild(option);
    });

    // Handle dropdown selection change event
    dropdown.addEventListener("change", function() {
      const selectedSample = this.value;
      updateSampleInfo(data.metadata, selectedSample);
      createBarChart(data.samples, selectedSample);
      createBubbleChart(data.samples, selectedSample);
    });
  })
  .catch(error => console.log(error));

// Function to update the sample information display
function updateSampleInfo(metadata, selectedSample) {
  const sampleInfo = metadata.find(obj => obj.id === parseInt(selectedSample));

  if (sampleInfo) {
    const infoElement = document.getElementById("sample-metadata");
    infoElement.innerHTML = `
      <div><strong>ID:</strong> ${sampleInfo.id}</div>
      <div><strong>Ethnicity:</strong> ${sampleInfo.ethnicity}</div>
      <div><strong>Gender:</strong> ${sampleInfo.gender}</div>
      <div><strong>Age:</strong> ${sampleInfo.age}</div>
      <div><strong>Location:</strong> ${sampleInfo.location}</div>
      <div><strong>Bbtype:</strong> ${sampleInfo.bbtype}</div>
      <div><strong>Wfreq:</strong> ${sampleInfo.wfreq}</div>
    `;
  }
}

// Function to create a horizontal bar chart
function createBarChart(samples, selectedSample) {
  const sampleData = samples.find(obj => obj.id === selectedSample);

  if (sampleData) {
    const otuIds = sampleData.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
    const otuLabels = sampleData.otu_labels.slice(0, 10).reverse();

    let barData = [{
      x: sampleData.sample_values.slice(0, 10).reverse(),
      y: otuIds,
      text: otuLabels,
      name: "OTU IDs",
      type: "bar",
      orientation: "h"
    }];

    let layout = {
      margin: { l: 100, r: 100, t: 100, b: 100 }
    };

    Plotly.newPlot("bar", barData, layout);
  }
}

// Function to create a bubble chart
function createBubbleChart(samples, selectedSample) {
  const sampleData = samples.find(obj => obj.id === selectedSample);

  if (sampleData) {
    let bubbleData = [{
      x: sampleData.otu_ids,
      y: sampleData.sample_values,
      text: sampleData.otu_labels,
      mode: "markers",
      marker: {
        size: sampleData.sample_values,
        color: sampleData.otu_ids,
        colorscale: "Earth"
      }
    }];

    let layout = {
      xaxis: { title: { text: "OTU ID" }},
    };

    Plotly.newPlot("bubble", bubbleData, layout);
  }
}
