let url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
let dataPromise = d3.json(url)

function init() {

    dataPromise.then(function(file) {

        data = [{
            x: file.samples[0].sample_values.slice(0, 10).reverse(),
            y: file.samples[0].otu_ids.slice(0, 10).reverse(),
            text: file.samples[0].otu_labels.slice(0, 10).reverse(),
            type: 'bar',
            orientation: "h"
        }];

        let layout = {
            title: "Top 10 OTUs For Selected Subject ID",
            yaxis: { type: 'category', title: "OTU ID"},
            xaxis: { title: "Value"}
          };

    
    Plotly.newPlot("bar", data, layout);

    let downdown = document.getElementById("selDataset");
    
    for(let i = 0; i < file.samples.length; i++) {
        let elt = document.createElement("option");
        
        elt.textContent = i;
        elt.value = i;
        downdown.appendChild(elt);
    }

    });
}


// Call updatePlotly() when a change takes place to the DOM
d3.selectAll("#selDataset").on("change", optionChanged);

// This function is called when a dropdown menu item is selected
function optionChanged() {

    let dropdown = d3.select("#selDataset");
    let sample = dropdown.property("value");

    dataPromise.then(function(file) {

        data = [{
            x: file.samples[sample].sample_values.slice(0, 10).reverse(),
            y: file.samples[sample].otu_ids.slice(0, 10).reverse(),
            text: file.samples[sample].otu_labels.slice(0, 10).reverse(),
            type: 'bar',
            orientation: "h"
        }];

        let layout = {
            title: "Top 10 OTUs For Selected Subject ID",
            yaxis: { type: 'category', title: "OTU ID"},
            xaxis: { title: "Value"}
          };
    
    Plotly.newPlot("bar", data, layout);    

    });

}


init();