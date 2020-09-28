////////////////////////////////////////////////////
// define global varable 
////////////////////////////////////////////////////
// init the range size
var svgHeight, svgWidth, width, height, censusData = [];
// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

var margin = {
    top: 70,
    right: 80,
    bottom: 80,
    left: 100
};

////////////////////////////////////////////////////
// function 1: updating x-scale var upon click on axis label
////////////////////////////////////////////////////
function xScale(chosenXAxis) {


    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.9,
        d3.max(censusData, d => d[chosenXAxis]) * 1.05
        ])
        .range([0, width]);

    return xLinearScale;

}

////////////////////////////////////////////////////
// function 2:  updating y-scale var upon click on axis label
////////////////////////////////////////////////////
function yScale(chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenYAxis]) * 0.8,
        d3.max(censusData, d => d[chosenYAxis] * 1.05)
        ])
        .range([height, 0]);

    return yLinearScale;
}

////////////////////////////////////////////////////
// function 3: used for updating xAxis var upon click on axis label
////////////////////////////////////////////////////
function renderXAxes(newXScale, xAxis) {

    var bottomAxis = d3.axisBottom(newXScale).ticks(8 * window.innerWidth / 1295);

    xAxis.transition()
        .duration(800)
        .call(bottomAxis);

    return xAxis;
}
////////////////////////////////////////////////////
// function 4: used for updating yAxis var upon click on axis label
////////////////////////////////////////////////////
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale).ticks(8 * window.innerHeight / 754);

    yAxis.transition()
        .duration(800)
        .call(leftAxis);

    return yAxis;
}

////////////////////////////////////////////////////
// function 5: used for updating circles group with a transition to
////////////////////////////////////////////////////
function renderXCircles(circlesGroup, newXScale, chosenXAxis) {
    circlesGroup.transition()
        .duration(800)
        .attr("cx", d => newXScale(d[chosenXAxis]));
    return circlesGroup;
}

////////////////////////////////////////////////////
// function 6: used for updating circles group with a transition to
////////////////////////////////////////////////////
function renderYCircles(circlesGroup, newYScale, chosenYAxis) {
    circlesGroup.transition()

        .duration(800)
        .attr("cy", d => newYScale(d[chosenYAxis]));
    return circlesGroup;
}


////////////////////////////////////////////////////
// function 7: used for updating circles group with new tooltip
////////////////////////////////////////////////////
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
    var label1, label2, label1_tail, label2_tail;
    //select lables for the X axis
    switch (chosenXAxis) {
        case 'poverty':
            label1 = "Poverty Rate: ";
            label1_tail = "%";
            break;
        case 'age':
            label1 = "Age(Median): ";
            label1_tail = "";
            break;
        case 'income':
            label1 = "Household: ";
            label1_tail = "";
            break;
        default:
            label1 = "Poverty Rate: ";
            label1_tail = "%";
    }
    //select lables for the y axis
    switch (chosenYAxis) {
        case 'healthcare':
            label2 = "Healthcare Rate: ";
            label2_tail = "%";
            break;
        case 'obesity':
            label2 = "Obesity Rate: ";
            label2_tail = "%";
            break;
        case 'smokes':
            label2 = "Smoke Rate: ";
            label2_tail = "%";
            break;
        default:
            label2 = "Healthcare Rate: ";
            label2_tail = "%";
    }

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        // .offset([80, -60])
        .html(function (d) {
            incomeOutput = "";
            if (chosenXAxis === 'income') {
                incomeOutput = d[chosenXAxis].toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                });
            }

            return (`${d.state}<hr>${label1}${incomeOutput != '' ? incomeOutput : d[chosenXAxis]}${label1_tail} 
                <hr>${label2}${d[chosenYAxis]}${label2_tail}`);

        });


    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function (data) {
        toolTip.show(data);
    })
        // onmouseout event
        .on("mouseout", function (data, index) {
            toolTip.hide(data);
        });

    return circlesGroup;
}

////////////////////////////////////////////////////
// function 8: used for adding lable
////////////////////////////////////////////////////

function addLabels(circleLabels, chosenXAxis, chosenYAxis, xLinearScale, yLinearScale, duration) {
    circleLabels.transition()
        .duration(duration)
        .attr("x", function (d) {
            return xLinearScale(d[chosenXAxis]);
        })
        .attr("y", function (d) {
            return yLinearScale(d[chosenYAxis]);
        })
        .text(function (d) {


            if ((window.innerHeight / 754) < 0.7 || (window.innerWidth / 1295) < 0.7) {
                // if window too small, the label will be disabled.
                return "";
            }

            return d.abbr;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", `${12 * window.innerWidth / 1295}px`)
        .attr("text-anchor", "middle")
        .attr("fill", "white");

    return circleLabels;

}

////////////////////////////////////////////////////
// function 9: setup active tag
////////////////////////////////////////////////////

function setActiveXTag(chosenXAxis, povertyRateLabel, ageRateLabel, incomeLabel) {
    // enable selected tag and disable other tags
    switch (chosenXAxis) {
        case 'poverty':
            povertyRateLabel
                .classed("active", true)
                .classed("inactive", false);
            ageRateLabel
                .classed("active", false)
                .classed("inactive", true);
            incomeLabel
                .classed("active", false)
                .classed("inactive", true);
            break;
        case 'age':
            povertyRateLabel
                .classed("active", false)
                .classed("inactive", true);
            ageRateLabel
                .classed("active", true)
                .classed("inactive", false);
            incomeLabel
                .classed("active", false)
                .classed("inactive", true);
            break;
        case 'income':
            povertyRateLabel
                .classed("active", false)
                .classed("inactive", true);
            ageRateLabel
                .classed("active", false)
                .classed("inactive", true);
            incomeLabel
                .classed("active", true)
                .classed("inactive", false);
            break;
        default:
            povertyRateLabel
                .classed("active", true)
                .classed("inactive", false);
            ageRateLabel
                .classed("active", false)
                .classed("inactive", true);
            incomeLabel
                .classed("active", false)
                .classed("inactive", true);
    }
}
////////////////////////////////////////////////////
// function 10: setup active tag in Y axis
////////////////////////////////////////////////////

function setActiveYTag(chosenYAxis, healthcareLable, obesityLable, smokesLable) {

    // enable selected tag and disable other tags
    switch (chosenYAxis) {
        case 'healthcare':
            healthcareLable
                .classed("active", true)
                .classed("inactive", false);
            obesityLable
                .classed("active", false)
                .classed("inactive", true);
            smokesLable
                .classed("active", false)
                .classed("inactive", true);
            break;
        case 'obesity':
            healthcareLable
                .classed("active", false)
                .classed("inactive", true);
            obesityLable
                .classed("active", true)
                .classed("inactive", false);
            smokesLable
                .classed("active", false)
                .classed("inactive", true);
            break;
        case 'smokes':
            healthcareLable
                .classed("active", false)
                .classed("inactive", true);
            obesityLable
                .classed("active", false)
                .classed("inactive", true);
            smokesLable
                .classed("active", true)
                .classed("inactive", false);
            break;
        default:
            healthcareLable
                .classed("active", true)
                .classed("inactive", false);
            obesityLable
                .classed("active", false)
                .classed("inactive", true);
            smokesLable
                .classed("active", false)
                .classed("inactive", true);
    }
}
////////////////////////////////////////////////////
// function 11: when window size changes, event will call the function
////////////////////////////////////////////////////
function makeResponsive() {

    //select svg area anchor 
    var svgArea = d3.select("body").select("svg");
    // if svg exists, windows will clear the content
    if (!svgArea.empty()) {
        svgArea.remove();
    }

    // init the range size
    svgHeight = window.innerHeight - 100;
    svgWidth = window.innerWidth - 100;
    //setup the margin size for the chart


    //actual size of the chart
    width = svgWidth - margin.left - margin.right;
    height = svgHeight - margin.top - margin.bottom;

    // Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
    var svg = d3.select(".chart")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);
    //setup started point of the chart
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);


    // Import Data

    ////////////////////////////////////////////////////
    // loading data from json data.csv 
    ////////////////////////////////////////////////////

    d3.csv("data/data.csv").then(function (census) {
        census.forEach(function (data) {
            //change the import data into numbers 
            data.id = +data.id;
            data.age = +data.age;
            data.ageMoe = +data.ageMoe;
            data.healthcare = +data.healthcare;
            data.healthcareHigh = +data.healthcareHigh;
            data.healthcareLow = +data.healthcareLow;
            data.income = +data.income;
            data.incomeMoe = +data.incomeMoe;
            data.obesity = +data.obesity;
            data.obesityHigh = +data.obesityHigh;
            data.obesityLow = +data.obesityLow;
            data.poverty = +data.poverty;
            data.povertyMoe = +data.povertyMoe;
            data.smokes = +data.smokes;
            data.smokesHigh = +data.smokesHigh;
            data.smokesLow = +data.smokesLow;
        });
        censusData = census;


        // xLinearScale function above csv import
        var xLinearScale = xScale(chosenXAxis);

        // Create y scale function
        var yLinearScale = yScale(chosenYAxis);

        // Create axis functions
        var bottomAxis = d3.axisBottom(xLinearScale).ticks(8 * window.innerWidth / 1295);
        var leftAxis = d3.axisLeft(yLinearScale).ticks(8 * window.innerHeight / 754);

        var xAxis = chartGroup.append("g")
            .classed("x-axis", true)
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);

        // append y axis
        var yAxis = chartGroup.append("g")
            .call(leftAxis);

        // append initial circles
        var circlesGroup = chartGroup.selectAll("circle")
            .data(censusData)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d[chosenXAxis]))
            .attr("cy", d => yLinearScale(d[chosenYAxis]))
            .attr("r", 15 * window.innerWidth / 1295)
            .attr("fill", "SteelBlue")
            .attr("opacity", ".5");


        // append circle label 
        var circleLabels = chartGroup.selectAll(null).data(censusData).enter().append("text");

        // Create group for three x-axis labels
        var xlabelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${width / 2}, ${height + 20})`);

        var povertyRateLabel = xlabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 20)
            .attr("value", "poverty") // value to grab for event listener
            .classed("active", true)
            .text("Poverty rate (%)");

        var ageRateLabel = xlabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 40)
            .attr("value", "age") // value to grab for event listener
            .classed("inactive", true)
            .text("Age(Median)");

        var incomeLabel = xlabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 60)
            .attr("value", "income") // value to grab for event listener
            .classed("inactive", true)
            .text("Household income(median) $");

        // Create group for three y-axis labels
        // turn 90 digree 
        var ylabelsGroup = chartGroup.append("g")
            .attr("transform", "rotate(-90)")

        var healthcareLable = ylabelsGroup.append("text")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "4em")
            .attr("value", "healthcare") // value to grab for event listener
            .classed("active", true)
            .text("Lacks Healthcare (%)");

        var obesityLable = ylabelsGroup.append("text")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "3em")
            .attr("value", "obesity") // value to grab for event listener
            .classed("inactive", true)
            .text("Obesity Rate(%)");

        var smokesLable = ylabelsGroup.append("text")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "2em")
            .attr("value", "smokes") // value to grab for event listener
            .classed("inactive", true)
            .text("Smokes Rate(%)");

        // updateToolTip function
        var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // updateCircleLabel function

        circleLabels = addLabels(circleLabels, chosenXAxis, chosenYAxis, xLinearScale, yLinearScale, 0);

        if (!((chosenXAxis === "poverty") && (chosenYAxis === "healthcare"))) {
            setActiveXTag(chosenXAxis, povertyRateLabel, ageRateLabel, incomeLabel);
            setActiveYTag(chosenYAxis, healthcareLable, obesityLable, smokesLable);

        }


        // x axis labels event listener
        xlabelsGroup.selectAll("text")
            .on("click", function () {
                // get value of selection
                var value = d3.select(this).attr("value");

                //if select different tag
                if (value !== chosenXAxis) {
                    // replaces chosenXAxis with value
                    chosenXAxis = value;
                    // updates x scale for new data
                    xLinearScale = xScale(chosenXAxis);

                    // updates x axis with transition
                    xAxis = renderXAxes(xLinearScale, xAxis);

                    // updates circles with new x values
                    circlesGroup = renderXCircles(circlesGroup, xLinearScale, chosenXAxis);

                    // updates tooltips with new info
                    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                    //updates label with new info
                    circleLabels = addLabels(circleLabels, chosenXAxis, chosenYAxis, xLinearScale, yLinearScale, 800);

                    setActiveXTag(chosenXAxis, povertyRateLabel, ageRateLabel, incomeLabel);

                }
            });


        // y axis labels event listener
        ylabelsGroup.selectAll("text")
            .on("click", function () {
                // get value of selection
                var value = d3.select(this).attr("value");

                if (value !== chosenYAxis) {
                    // replaces chosenXAxis with value
                    chosenYAxis = value;
                    // updates y scale for new data
                    yLinearScale = yScale(chosenYAxis);
                    // updates y axis with transition
                    yAxis = renderYAxes(yLinearScale, yAxis);
                    // updates circles with new y values
                    circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis);
                    // updates tooltips with new info
                    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
                    //updates label with new info
                    circleLabels = addLabels(circleLabels, chosenXAxis, chosenYAxis, xLinearScale, yLinearScale, 800);

                    setActiveYTag(chosenYAxis, healthcareLable, obesityLable, smokesLable);
                }
            });

    }).catch(function (error) {
        console.log(error);
    });

}

//initial default page
makeResponsive();
// Event listener for window resize.
// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);




