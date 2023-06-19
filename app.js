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

    // Load default sample
    const defaultSample = "940";
    dropdown.value = defaultSample;
    updateSampleInfo(data.metadata, defaultSample);
    createBarChart(data.samples, defaultSample);
    createBubbleChart(data.samples, defaultSample);

    // Handle dropdown selection change event
    dropdown.addEventListener("change", function() {
      const selected_sample = this.value;
      updateSampleInfo(data.metadata, selected_sample);
      createBarChart(data.samples, selected_sample);
      createBubbleChart(data.samples, selected_sample);
    });
  })
  .catch(error => console.log(error));

// Function to update the sample information display
function updateSampleInfo(metadata, selected_sample) {
  const sample_info = metadata.find(obj => obj.id === parseInt(selected_sample));

  if (sample_info) {
    const info_element = document.getElementById("sample-metadata");
    info_element.innerHTML = `
      <div><strong>ID:</strong> ${sample_info.id}</div>
      <div><strong>Ethnicity:</strong> ${sample_info.ethnicity}</div>
      <div><strong>Gender:</strong> ${sample_info.gender}</div>
      <div><strong>Age:</strong> ${sample_info.age}</div>
      <div><strong>Location:</strong> ${sample_info.location}</div>
      <div><strong>Bbtype:</strong> ${sample_info.bbtype}</div>
      <div><strong>Wfreq:</strong> ${sample_info.wfreq}</div>
    `;
  }
}

// Function to create a horizontal bar chart
function createBarChart(samples, selected_sample) {
  const sample_data = samples.find(obj => obj.id === selected_sample);

  if (sample_data) {
    const otu_ids = sample_data.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
    const otu_labels = sample_data.otu_labels.slice(0, 10).reverse();

    let bar_data = [{
      x: sample_data.sample_values.slice(0, 10).reverse(),
      y: otu_ids,
      text: otu_labels,
      name: "OTU IDs",
      type: "bar",
      orientation: "h"
    }];

    let bar_layout = {
      margin: { l: 100, r: 100, t: 100, b: 100 }
    };

    Plotly.newPlot("bar", bar_data, bar_layout);
  }
}

// Function to create a bubble chart
function createBubbleChart(samples, selected_sample) {
  const sample_data = samples.find(obj => obj.id === selected_sample);

  if (sample_data) {
    let bubble_data = [{
      x: sample_data.otu_ids,
      y: sample_data.sample_values,
      text: sample_data.otu_labels,
      mode: "markers",
      marker: {
        size: sample_data.sample_values,
        color: sample_data.otu_ids,
        colorscale: "Earth"
      }
    }];

    let bubble_layout = {
      xaxis: { title: { text: "OTU ID" }},
    };

    Plotly.newPlot("bubble", bubble_data, bubble_layout);
  }
}
