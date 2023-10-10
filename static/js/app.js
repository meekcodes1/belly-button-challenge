// Use the D3 library to read in samples.json from URL
let url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
let dataPromise = d3.json(url)

// function for the initial display
function init() {

    dataPromise.then(function(file) {

        // create initial bar chart
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
        
        // create initial bubble chart
        dataBub = [{
            x: file.samples[0].otu_ids,
            y: file.samples[0].sample_values,
            text: file.samples[0].sample_values,
            mode: 'markers',
            marker: {
                color: file.samples[0].otu_ids, 
                size: file.samples[0].sample_values,
                colorscale: 'Portland'
            }
        }];

        let layoutBub = {
            title: "OTUs by Value Measured",
            yaxis: { title: "Value"},
            xaxis: { title: "OTU ID"}
          };

        Plotly.newPlot("bubble", dataBub, layoutBub);
        
        // populate initial gauge
        dataG = [
            { 
                domain: { x: [0, 1], y: [0, 1] }, 
                value: file.metadata[0].wfreq,
                title: { text: "Washing Frequency per Week" },    
                type: "indicator",     
                mode: "gauge+number",    
                gauge: {
                    axis: {range: [null, 9] },
                    bar: {color: "darkblue" }
                }
            }
        ];
        
        var layoutG = { width: 600, height: 500, margin: { t: 0, b: 0 } };
        Plotly.newPlot('gauge', dataG, layoutG);

        // populate initial demographic info
        arrayIn = Object.keys(file.metadata[0]);
        arrayVal = Object.values(file.metadata[0]);
        
        let table = d3.select(".panel-body");

        // For each metadata row, append a key/value pair separated by :
        for(let i = 0; i < arrayIn.length; i++) {
            
            row = table.append("tr");
        
            row.append("td").text(arrayIn[i].concat(": ").concat(arrayVal[i]));
        }

        // populate the initial dropdown lsit with all subject IDs
        let downdown = document.getElementById("selDataset");
    
        for(let i = 0; i < file.samples.length; i++) {
            let elt = document.createElement("option");

            elt.textContent = file.names[i];
            elt.value = i;
            downdown.appendChild(elt);
        }

    });

}

// added to remove "function option Changed is not defined" error
// It seemed like putting the function within the data promise prevents the html from seeing the funtion early enough
function optionChanged() {};

dataPromise.then(function(file) {

    // Call optionChanged() when a change takes place to the DOM
    d3.select("#selDataset").on("change", optionChanged);

    // This function is called when a dropdown menu item is selected
    function optionChanged() {

        let dropdown = d3.select("#selDataset");
        let sample = dropdown.property("value");

        // create dynamic bar charts based on selection
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

        // create dynamic bubble charts based on selection
        dataBub = [{
            x: file.samples[sample].otu_ids,
            y: file.samples[sample].sample_values,
            text: file.samples[sample].sample_values,
            mode: 'markers',
            marker: {
                color: file.samples[sample].otu_ids, 
                size: file.samples[sample].sample_values,
                colorscale: 'Portland'
            }
        }];

        let layoutBub = {
            title: "OTUs by Value Measured",
            yaxis: { title: "Value"},
            xaxis: { title: "OTU ID"}
          };

        Plotly.newPlot("bubble", dataBub, layoutBub);

        // populate dynamic gauges based on selection
        dataG = [
            { 
                domain: { x: [0, 1], y: [0, 1] }, 
                value: file.metadata[sample].wfreq,
                title: { text: "Washing Frequency per Week" },    
                type: "indicator",     
                mode: "gauge+number",    
                gauge: {
                    axis: {range: [null, 9] },
                    bar: {color: "darkblue" }
                }
            }
        ];
        
        var layoutG = { width: 600, height: 500, margin: { t: 0, b: 0 } };
        Plotly.newPlot('gauge', dataG, layoutG);

        // Function to clear existing demographics table
        function deleteRow() {
            document.getElementsByTagName("tr")[0].remove();
        }

        // populate dynamic demographic info based on selection
        arrayIn = Object.keys(file.metadata[sample]);
        arrayVal = Object.values(file.metadata[sample]);

        let table = d3.select(".panel-body");

        // For each metadata row, append a key/value pair separated by :
        for(let i = 0; i < arrayIn.length; i++) {
            deleteRow();
            row = table.append("tr");
        
            row.append("td").text(arrayIn[i].concat(": ").concat(arrayVal[i]));
        }

    }

});

init();