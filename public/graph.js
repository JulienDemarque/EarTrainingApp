/*jslint browser:true */
/*jslint es6 */

document.addEventListener("DOMContentLoaded", function() {
  "use strict";

  const triggerButton = document.getElementById("graphBtn");
  const graphDiv = document.getElementById("graph");

  triggerButton.addEventListener("click", displayGraph);

  //---------------------------------------------------
  /* callback of button */
  function displayGraph() {
    /* We need to empty our grah (it still have the prvious graph there) */
    graphDiv.innerHTML = "";
    /* first we want to get the data from the database */
    makeGetRequest();
    /* in the callback we will display the graph */
  }

  //---------------------------------------------------
  /* getting the json from server */
  function makeGetRequest() {
    const http = new XMLHttpRequest();
    http.open('GET', '/graph', true);
    http.setRequestHeader('Content-type', 'application/json');
    http.onload = function() {
      // Do whatever with response
      console.log("got json from server : ", JSON.parse(http.responseText));
      buildD3Graph(JSON.parse(http.responseText));
    };
    http.onerror = function() {
      console.log("** An error occurred during the transaction");
    };
    http.send(); // Make sure to stringify
  }

  function buildD3Graph(dataFromMongodb) {
    //-----------------------------------------------
    /* Format the database into an array we can work with: */

    var dataset = [{
        level: 0,
        scores: []
      },
      {
        level: 1,
        scores: []
      },
      {
        level: 2,
        scores: []
      },
      {
        level: 3,
        scores: []
      },
      {
        level: 4,
        scores: []
      },
      {
        level: 5,
        scores: []
      },
      {
        level: 6,
        scores: []
      },
      {
        level: 7,
        scores: []
      },
      {
        level: 8,
        scores: []
      },
      {
        level: 9,
        scores: []
      },
      {
        level: 10,
        scores: []
      }
    ];

    dataFromMongodb.forEach(function(level, index) {
      Object.keys(level).map(function(key) {
        let rightAnswers = level[key].rightAnswers;
        let wrongAnswers = level[key].wrongAnswers;
        if (key !== "level") {
          dataset[index].scores.push({
            date: key,
            score: level[key],
            percent: (rightAnswers / (rightAnswers + wrongAnswers))
          });
        }
      });
    });


    //---------------------------------
    /* This array will be for defining domain : */
    var datesForDomain = [];
    dataFromMongodb.forEach(function(level, index) {
      Object.keys(level).map(function(key) {
        if (key !== "level") {
          datesForDomain.push({
            date: key
          });
        }
      });
    });

    //---------------------------------
    /* Declare our constants for styling: */
    const w = 800;
    const h = 500;
    const paddingLeftRight = 100;
    const paddingTopBottom = 40;
    const duration = 250;
    const lineOpacity = "0.25";
    const lineOpacityHover = "0.85";
    const lineStroke = "2.5px";
    const lineStrokeHover = "4.5px";
    const otherLinesOpacityHover = "0.1";
    const circleOpacity = '0.85';
    const circleOpacityOnLineHover = "0.25";
    const circleRadius = 3;
    const circleRadiusHover = 6;

    //--------------------------------
    /* Set the parse and formating time: */
    var parseTime = d3.timeParse("%d-%m-%Y");
    var formatTime = d3.timeFormat("%B %d, %Y");
    // if we want the day also in the axis :
    // var formatTime = d3.timeFormat("%B %d, %Y");

    //---------------------------------
    /* declare our scales: */
    const xScale = d3.scaleTime()
      .domain([d3.min(datesForDomain, d => parseTime(d.date)), d3.max(datesForDomain, d => parseTime(d.date))])
      .range([paddingLeftRight, w - paddingLeftRight]);

    const yScale = d3.scaleLinear()
      .domain([1, 0])
      .range([paddingTopBottom, h - paddingTopBottom]);

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    //--------------------------------
    /* Basic style for the graph: */
    const svg = d3.select("#graph")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    //-----------------------------------------
    // Tring on lines
    /* Add line into SVG */
    var line = d3.line()
      .x(d => xScale(parseTime(d.date)))
      .y(d => yScale(d.percent));

    let lines = svg.append('g')
      .attr('class', 'lines');

    lines.selectAll('.line-group')
      .data(dataset).enter()
      .append('g')
      .attr('class', 'line-group')
      .on("mouseover", function(d, i) {
        svg.append("text")
          .attr("class", "title-text")
          .style("fill", color(i))
          .text("level : " + d.level)
          .attr("text-anchor", "middle")
          .attr("x", w / 2)
          .attr("y", paddingTopBottom - 5);
      })
      .on("mouseout", function(d) {
        setTimeout(function() {
          svg.select(".title-text").remove();
        }, 100);
      })
      .append('path')
      .attr('class', 'line')
      .attr('d', d => line(d.scores))
      .style('stroke', (d, i) => color(i))
      .style('opacity', lineOpacity)
      .style("stroke-width", lineStroke)
      .on("mouseover", function(d) {
        d3.selectAll('.line')
         .style('opacity', otherLinesOpacityHover);
        d3.selectAll('.circle')
         .style('opacity', circleOpacityOnLineHover);
        d3.select(this)
          .style('opacity', lineOpacityHover)
          .style("stroke-width", lineStrokeHover)
          .style("cursor", "pointer");
      })
      .on("mouseout", function(d) {
        d3.selectAll(".line")
					.style('opacity', lineOpacity);
        d3.selectAll('.circle')
					.style('opacity', circleOpacity);
        d3.select(this)
          .style('opacity', lineOpacity)
          .style("stroke-width", lineStroke)
          .style("cursor", "none");
      });

    //--------------------------------
    /* Adding axis: */
    const xAxis = d3.axisBottom(xScale).tickFormat(formatTime);
    svg.append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${h - paddingTopBottom})`)
      .call(xAxis);

    const yAxis = d3.axisLeft(yScale)
      .tickFormat(d3.format(".0%"));
    svg.append("g")
      .attr("id", "y-axis")
      .attr("transform", `translate(${paddingLeftRight}, 0)`)
      .call(yAxis)
      .append('text')
      .attr("y", 15)
      .attr("x", -paddingLeftRight)
      .attr("transform", "rotate(-90)")
      .attr("fill", "#000")
      .text("Percentage of success");;

    //---------------------------------
    /* Add circles in the line */
    lines.selectAll("circle-group")
      .data(dataset).enter()
      .append("g")
      .style("fill", (d, i) => color(i))
      .selectAll("circle")
      .data(d => d.scores).enter()
      .append("g")
      .attr("class", "circle")
      .on("mouseover", function(d) {
        d3.select(this)
          .style("cursor", "pointer")
          .append("text")
          .attr("class", "text")
          .text(`Correct: ${d.score.rightAnswers} \n
               Wrong: ${d.score.wrongAnswers}`)
          .attr("x", d => xScale(parseTime(d.date)) - 50)
          .attr("y", d => yScale(d.percent) - 12);
      })
      .on("mouseout", function(d) {
        d3.select(this)
          .style("cursor", "none")
          .transition()
          .duration(duration)
          .selectAll(".text").remove();
      })
      .append("circle")
      .attr("cx", d => xScale(parseTime(d.date)))
      .attr("cy", d => yScale(d.percent))
      .attr("r", circleRadius)
      .style('opacity', circleOpacity)
      .on("mouseover", function(d) {
        d3.select(this)
          .transition()
          .duration(duration)
          .attr("r", circleRadiusHover);
      })
      .on("mouseout", function(d) {
        d3.select(this)
          .transition()
          .duration(duration)
          .attr("r", circleRadius);
      });
  }

});
