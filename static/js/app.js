// DROPDOWN MENU OPTIONS

function dropdownMenuOptions() {
    d3.json('samples.json').then(function(data) {
        // Create array of all test subject IDs (names), append each as an <option> element
        names = data.names;
        dropdownMenu = d3.select('#selDataset');
        names.forEach(name => dropdownMenu.append('option').attr('value', `${name}`).text(`${name}`));
    });
};

dropdownMenuOptions();

// DEFAULT CHARTS

function defaultValues() {
    d3.json('samples.json').then(function(data) {
        gatherIndexData(data, 0);
        // Build bar chart
        let trace1 = {
            x: otuValues,
            y: otuIDStrings,
            text: otuLabels,
            type: 'bar',
            orientation: 'h'
        };
        let data1 = [trace1];
        let layout1 = {
            title: `Subject ID #${name}`,
            xaxis: {title: 'Sample Value'},
            margin: {l: 100, r: 100, t: 100, b: 100}
        };
        Plotly.newPlot('bar', data1, layout1);
        // Build bubble chart
        let trace2 = {
            x: otuIDNumbers,
            y: otuValues,
            mode: 'markers',
            marker: {
                size: otuValues,
                color: otuIDNumbers
            },
            text: otuLabels
        };
        let data2 = [trace2];
        let layout2 = {
            title: `Subject ID #${name}`,
            xaxis: {title: 'OTU ID'},
            yaxis: {title: 'Sample Value'},
            margin: {l: 100, r: 100, t: 100, b: 100}
        };
        Plotly.newPlot('bubble', data2, layout2);
        // Build demographic chart
        loadDemographic(data, 0);
    });
};

// Function to gather all data related to the specified index
function gatherIndexData(data, index) {
    name = data.samples[index].id;
    otuIDNumbers = data.samples[index].otu_ids.slice(0,10).reverse();
    otuIDStrings = otuIDNumbers.map(otuIDNumber => 'OTU ' + otuIDNumber);
    otuValues = data.samples[index].sample_values.slice(0,10).reverse();
    otuLabels = data.samples[index].otu_labels.slice(0,10).reverse();
    // Print to console for viewing
    console.log(`Index: ${index}`);
    console.log(`Name: ${name}`);
    console.log(`OTU IDs (number): ${otuIDNumbers}`);
    console.log(`OTU IDs (string): ${otuIDStrings}`);
    console.log(`OTU Values: ${otuValues}`);
    console.log(`OTU Labels: ${otuLabels}`);
};

// Function to insert all metadata key-value pairs into <li> elements of demographic chart
function loadDemographic(data, index) {
    let metadata = data.metadata[index];
    let unorderedList = d3.select('.list-group');
    unorderedList.html('');
    Object.entries(metadata).forEach(([key, value]) => {
        unorderedList.append('li').attr('class', `list-group-item`).text(`${key}: ${value}`);
    });
};

defaultValues();

// UPDATED CHARTS

d3.selectAll('body').on('change', updateValues);

function updateValues() {
    // Prevent the page from refreshing
    d3.event.preventDefault();
    // Determine index of selection
    let userSelectionName = dropdownMenu.node().value;
    let userSelectionIndex = names.indexOf(userSelectionName);
    // Gather all data related to selected index and update
    d3.json('samples.json').then(function(data) {
        gatherIndexData(data, userSelectionIndex);
        updateCharts(name, otuIDNumbers, otuIDStrings, otuValues, otuLabels);
        updateDemographic(data, userSelectionIndex);
    });
};

function updateCharts(newName, newOtuIDNumbers, newOtuIDStrings, newOtuValues, newOtuLabels) {
    // Update bar chart
    Plotly.restyle('bar', 'x', [newOtuValues]);
    Plotly.restyle('bar', 'y', [newOtuIDStrings]);
    Plotly.restyle('bar', 'text', [newOtuLabels]);
    let newLayout = {title: `Subject ID #${newName}`};
    Plotly.relayout('bar', newLayout);
    //Update bubble chart
    Plotly.restyle('bubble', 'x', [newOtuIDNumbers]);
    Plotly.restyle('bubble', 'y', [newOtuValues]);
    Plotly.restyle('bubble', 'size', [newOtuValues]);
    Plotly.restyle('bubble', 'color', [newOtuIDNumbers]);
    Plotly.restyle('bubble', 'text', [newOtuLabels]);
    Plotly.relayout('bubble', newLayout);
};

function updateDemographic(data, index) {
    let metadata = data.metadata[index];
    let unorderedList = d3.select('.list-group');
    unorderedList.html('');
    Object.entries(metadata).forEach(([key, value]) => {
        unorderedList.append('li').attr('class', `list-group-item`).text(`${key}: ${value}`);
    });
};