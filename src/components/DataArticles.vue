<template>
    <div class="chart-cont">
        <div ref="chart" class="chart"></div>
        <div id="chart" class="chart"></div>
    </div>
</template>

<script>
import * as d3 from "d3";
import { mapActions, mapGetters } from "vuex";

export default {
    name: "DataArticles",
    data() {
        return {
            articles: [],
            chart: null,
            overallCount: 0
        };
    },
    computed: {
        ...mapGetters(["responseData"]),
    },
    methods: {
        ...mapActions(["fetchArticlesFromAPI"]),
        async renderData() {
            try {
                let response = await this.fetchArticlesFromAPI();
                this.articles = response.data;
                let articleData = this.articles;
                articleData.forEach(obj => {
                    this.overallCount = this.overallCount + obj.attributes.article_persons.length
                })

                const articleTree = {
                    children: []
                };

                articleData.forEach(obj => {
                    const articleNumber = obj.attributes.article_number;
                    const articleTip = obj.attributes.article_description_en || obj.attributes.article_name_en;
                    const articleName = obj.attributes.article_substance_en || "none";
                    const people = obj.attributes.article_persons || [];

                    if (people.length >= 10) {
                        let articleNode = articleTree.children.find(node => node.name === articleNumber);
                        if (!articleNode) {
                            articleNode = { name: articleNumber, children: [] };
                            articleTree.children.push(articleNode);
                        }

                        let nameNode = articleNode.children.find(node => node.name === articleName);
                        if (!nameNode) {
                            nameNode = { name: articleName, count: 0, desc: articleTip };
                            articleNode.children.push(nameNode);
                        }
                        nameNode.count += people.length;
                    }
                });


                const nodesRemoved = [];

                articleTree.children.forEach((articleNode) => {
                    if (articleNode.children.length === 1) {
                        articleNode.children.forEach(nameNode => {
                            if (nameNode.name !== "none") {
                                nodesRemoved.push(articleNode);
                            }
                        })
                    } else {
                        nodesRemoved.push(articleNode);
                    }
                });

                // Remove nodes in reverse order to avoid index shift
                articleTree.children = nodesRemoved

                // Filter out articles that don't have article_substance_en at the name node level (child)
                articleTree.children.forEach(articleNode => {
                    if (articleNode.children.length === 2) {
                        const noneNodeIndex = articleNode.children.findIndex(nameNode => nameNode.name === "none");
                        if (noneNodeIndex !== -1) {
                            const noneNode = articleNode.children[noneNodeIndex];
                            articleNode.children.splice(noneNodeIndex, 1);
                            const otherNode = articleNode.children[0];

                            // Distribute the counts of the "none" node to the other node
                            otherNode.count += noneNode.count;
                        }
                    } else {
                        articleNode.children.forEach(nameNode => {
                            if (nameNode.name === "none") {
                                nameNode.name = nameNode.desc;

                            }
                        })
                    }
                });



                const terrorismGroup = { name: "terrorism", children: [] };
                const infoGroup = { name: "information", children: [] };
                const protestGroup = { name: "protest", children: [] };
                const govGroup = { name: "military", children: [] };
                const otherGroup = { name: "other", children: [] };
                // Iterate through articleTree children
                articleTree.children.forEach(articleNode => {
                    let containsTerrorism = false;
                    let containsInfo = false;
                    let containsProtest = false;
                    let containsOther = true;

                    articleNode.children.forEach(nameNode => {
                        if (nameNode.name.toLowerCase().includes("terrorist") ||
                            nameNode.name.toLowerCase().includes("terrorism") ||
                            nameNode.name.toLowerCase().includes("extremist") ||
                            nameNode.name.toLowerCase().includes("extremism") ||
                            nameNode.name.toLowerCase().includes("ngo") ||
                            nameNode.name.toLowerCase().includes("undesirable") ||
                            nameNode.name.toLowerCase().includes("separatism")) {
                            containsTerrorism = true;
                        }
                    });


                    articleNode.children.forEach(nameNode => {
                        if (nameNode.name.toLowerCase().includes("public calls") ||
                            nameNode.name.toLowerCase().includes("incitement of") ||
                            nameNode.name.toLowerCase().includes("incitement to terrorism") ||
                            nameNode.name.toLowerCase().includes("public insult") ||
                            nameNode.name.toLowerCase().includes("information") ||
                            nameNode.name.toLowerCase().includes("disrespect") ||
                            nameNode.name.toLowerCase().includes("discrediting")
                        ) {
                            containsInfo = true;
                        }
                    });
                    articleNode.children.forEach(nameNode => {
                        if (nameNode.name.toLowerCase().includes("riots") ||
                            nameNode.name.toLowerCase().includes("property") ||
                            nameNode.name.toLowerCase().includes("hooliganism") ||
                            nameNode.name.toLowerCase().includes("vandalism") ||
                            nameNode.name.toLowerCase().includes("events") ||
                            nameNode.name.toLowerCase().includes("illness")
                        ) {
                            containsProtest = true;
                        }
                    });
                    articleNode.children.forEach(nameNode => {
                        if (nameNode.name.toLowerCase().includes("documents") ||
                            nameNode.name.toLowerCase().includes("minor") ||
                            nameNode.name.toLowerCase().includes("fraud")

                        ) {
                            containsOther = false;
                        }
                    });
                    // Push to appropriate group
                    if (containsTerrorism && !containsInfo) {
                        terrorismGroup.children.push(articleNode);
                    } else if (containsInfo) {
                        infoGroup.children.push(articleNode);
                    } else if (containsProtest) {
                        protestGroup.children.push(articleNode);
                    } else if (containsOther) {
                        govGroup.children.push(articleNode);
                    } else if (!containsOther) {
                        otherGroup.children.push(articleNode);
                    }
                });
                // Sort children of each group by name
                terrorismGroup.children.sort((a, b) => b.name - a.name);
                infoGroup.children.sort((a, b) => b.name - a.name);
                protestGroup.children.sort((a, b) => b.name - a.name);
                govGroup.children.sort((a, b) => b.name - a.name);
                otherGroup.children.sort((a, b) => b.name - a.name);

                articleTree.children = [terrorismGroup, infoGroup, protestGroup, govGroup, otherGroup];
                console.log(articleTree);

                return articleTree;

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
    },
    mounted() {
        this.renderData()
            .then((articleTree) => {
                //measurements
                let overallCount = this.overallCount
                const width = 1200
                let outerRadius = width / 2 + 100
                let innerRadius = outerRadius - 550

                const cluster = d3.cluster()
                    .size([360, innerRadius])
                    .separation(() => 1);

                function maxLength(d) {
                    return d.data.length + (d.children ? d3.max(d.children, maxLength) : 0);
                }

                function setRadius(d, y0, k) {
                    d.radius = (y0 += d.data.count) * k;
                    if (d.children) d.children.forEach(child => setRadius(child, y0, k));
                }

                //color
                const customColors = ["#871124", "#de755f", "#f5b599", "#3984bb", "#888888"];

                const color = d3.scaleOrdinal()
                    .domain(["terrorism", "information", "protest", "military", "other"])
                    .range(customColors);


                function setColor(d) {
                    var name = d.data.name;
                    d.color = color.domain().indexOf(name) >= 0 ? color(name) : d.parent ? d.parent.color : null;
                    if (d.children) d.children.forEach(setColor);
                }
                const legend = svg => {
                    const customText = {
                        "terrorism": "Terrorism: articles related to interaction with forbidden organisations",
                        "information": "Information: articles related to misinformation, discrediting Russian Army, and insult of religiois feelings",
                        "military": "Military: articles related to trafficing arms, violent uprisings, treason and disobeying orders",
                        "protest": "Protest: articles associate with protesting",
                        "other": "Other"
                    };
                    const g = svg
                        .selectAll("g")
                        .data(color.domain())
                        .join("g")
                        .attr("transform", (d, i) => `translate(${-width / 2 + 100} ,${-width / 2  + i * 20})`);

                    g.append("rect")
                        .attr("width", 18)
                        .attr("height", 18)
                        .attr("fill", color);

                    g.append("text")
                        .attr("x", 24)
                        .attr("y", 9)
                        .attr("dy", "0.35em")
                        .text(d => customText[d]);
                }



                function linkVariable(d) {
                    return linkStep(d.source.x, d.source.radius, d.target.x, d.target.radius, d.source.data.name);
                }

                function linkConstant(d) {
                    return linkStep(d.source.x, d.source.y, d.target.x, d.target.y, d.source.data.name);
                }

                function linkExtensionVariable(d) {
                    return linkStep(d.target.x, d.target.radius, d.target.x, innerRadius + 100, d.target.parent ? d.target.parent.data.name : null);
                }

                function linkExtensionConstant(d) {
                    return linkStep(d.target.x, d.target.y, d.target.x, innerRadius, d.target.parent ? d.target.parent.data.name : null);
                }

                function linkStep(startAngle, startRadius, endAngle, endRadius) {
                    const c0 = Math.cos(startAngle = (startAngle - 90) / 180 * Math.PI);
                    const s0 = Math.sin(startAngle);
                    const c1 = Math.cos(endAngle = (endAngle - 90) / 180 * Math.PI);
                    const s1 = Math.sin(endAngle);

                    let path = "M" + startRadius * c0 + "," + startRadius * s0;

                    // Check if the startRadius is equal to the innerRadius to determine if it's a branch point
                    if (startRadius === innerRadius) {
                        path += "L" + startRadius * c1 + "," + startRadius * s1;
                        path += "M" + endRadius * c1 + "," + endRadius * s1;
                    } else {
                        path += (endAngle === startAngle ? "" : "A" + startRadius + "," + startRadius + " 0 0 " + (endAngle > startAngle ? 1 : 0) + " " + startRadius * c1 + "," + startRadius * s1);
                        path += "L" + endRadius * c1 + "," + endRadius * s1;
                    }

                    return path;
                }





                const chart = (articleTree) => {
                    const root = d3.hierarchy(articleTree)
                        .sum(d => d.children ? 0 : 1)

                    cluster(root);
                    setRadius(root, root.data.length = 0, innerRadius / maxLength(root));
                    setColor(root);

                    const svg = d3.create("svg")
                        .attr("viewBox", [-width / 2, -width / 2, width, width])
                        .attr("font-family", "sans-serif")
                        .attr("font-size", 10);

                    // // Create tooltip
                    const tooltip = d3.select("#chart")
                        .append("div")
                        .style("opacity", 0)
                        .attr("class", "tooltip")
                        .style("background-color", "white")
                        .style("border", "solid")
                        .style("position", "absolute")
                        .style("top", "160vh")
                        .style("width", "32vw")
                        .style("left", "34vw")
                        .style("text-align", "left")
                        .style("border-width", "1px")
                        .style("padding", "10px")

                    // Append legend
                    svg.append("g")
                        .call(legend);

                    // Append style
                    svg.append("style").text(`

                    .link--active {
                    stroke: #000 !important;
                    stroke-width: 1.5px;
                    }

                    .link-extension--active {
                    stroke-opacity: .6;
                    }

                    .label--active {
                    font-weight: bold;
                    }

                    `);


                    // Append color pie chart
                    // var arc = d3.arc()
                    //     .innerRadius(innerRadius)
                    //     .outerRadius(outerRadius - 150)

                    // var pie = d3.pie().value(d => d.value)

                    // svg.append("g")
                    //     .selectAll("path")
                    //     .data(pie(root.leaves()))
                    //     .join("g")
                    //     .append("path")
                    //     .attr("d", arc)
                    //     .style("fill", d => d.data.color)
                    //     .style("opacity", 0.3)


                    // Append link extension
                    const linkExtension = svg.append("g")
                        .attr("fill", "none")
                        .attr("stroke", "#000")
                        .style("stroke-dasharray", "3, 3")
                        .attr("stroke-opacity", 0.5)
                        .selectAll("path")
                        .data(root.links().filter(d => !d.target.children))
                        .join("path")
                        .each(function (d) { d.target.linkExtensionNode = this; })
                        .attr("d", linkExtensionConstant);

                    // Append links
                    const link = svg.append("g")
                        .attr("fill", "none")
                        .attr("stroke", "#000")
                        .selectAll("path")
                        .data(root.links())
                        .join("path")
                        .each(function (d) { d.target.linkNode = this; })
                        .attr("d", linkConstant)
                        .attr("stroke", d => d.target.color);

                    const printedNames = new Set();

                    //Append rect
                    svg.append("g")
                        .selectAll("rect")
                        .data(root.leaves())
                        .join("rect")
                        .attr("transform", d => {
                            const angle = d.x - 90;
                            const x = innerRadius - 50;
                            const rotation = d.x < 180 ? "" : " rotate(180)";
                            return `rotate(${angle}) translate(${x},0)${rotation}`;
                        })
                        .attr("width", 24)
                        .attr("height", 20)
                        .attr("fill", "rgb(250, 249, 245)")
                        .attr("x", d => (d.x < 180 ? -32 : 8))
                        .attr("y", -10)
                        .attr("rx", 5)
                        .attr("ry", 5);


                    // Append values representing the parent of further leaves to the beginning of the link
                    svg.append("g")
                        .selectAll("text")
                        .data(root.links())
                        .join("text")
                        .attr("dy", ".31em")
                        .style("font-size", "8px")
                        .each(function (d) {
                            const parentName = d.source.data.name; // Get the parent node's name
                            if (/\d/.test(parentName) && !printedNames.has(parentName)) {
                                printedNames.add(parentName); // Add the name to the set
                                d3.select(this).text(parentName); // Set the text to the parent name
                            } else {
                                d3.select(this).text(""); // If the name doesn't contain digits or has already been printed, set the text to an empty string
                            }
                        })
                        .attr("text-anchor", d => {
                            const x = (d.source.x + d.target.x) / 2;
                            return x < 180 ? "start" : "end"
                        })
                        .attr("transform", d => {
                            const x = (d.source.x + d.target.x) / 2; // Calculate the x position of the text
                            return `rotate(${x - 90}) translate(${innerRadius - 80},0)${x < 180 ? "" : " rotate(180)"}`;
                        })
                        .on("mouseover", mouseovered(true))
                        .on("mouseout", mouseovered(false))


                    // Append radial scale
                    var x = d3.scaleBand()
                        .range([0, 2 * Math.PI])
                        .domain(root.leaves().map((d) => d.data.name));

                    var y = d3.scaleRadial()
                        .range([innerRadius, outerRadius - 150])
                        .domain([0, d3.max(root.leaves(), d => d.data.count)]); // Adjust the domain to fit the maximum count value




                    // Append line chart
                    const offsetAngle = 18 * (2 * Math.PI / root.leaves().length); // Calculate the offset angle

                    // Append line chart
                    svg.append("g")
                        .selectAll("line")
                        .data(root.leaves())
                        .enter()
                        .append("line")
                        .style("stroke", d => d.color) // Set the color of the lines
                        .style("stroke-width", "3.5px") // Set the width of the lines
                        .attr("x1", d => y(0) * Math.cos(x(d.data.name) - offsetAngle)) // Calculate the x coordinate of the start point with offset
                        .attr("y1", d => y(0) * Math.sin(x(d.data.name) - offsetAngle)) // Calculate the y coordinate of the start point with offset
                        .attr("x2", d => y(d.data.count) * Math.cos(x(d.data.name) - offsetAngle)) // Calculate the x coordinate of the end point with offset
                        .attr("y2", d => y(d.data.count) * Math.sin(x(d.data.name) - offsetAngle)); // Calculate the y coordinate of the end point with offset

                    //Append text inner
                    svg.append("g")
                        .selectAll("text")
                        .data(root.leaves())
                        .join("text")
                        .attr("dy", ".31em")
                        .attr("transform", d => `rotate(${d.x - 90}) translate(${innerRadius},0)${d.x < 180 ? "" : " rotate(180)"}`)
                        .attr("text-anchor", d => d.x < 180 ? "start" : "end")
                        .attr("x", 0)
                        .attr("y", 0)
                        .each(function (d) {
                            d.parent.data.name;
                        })
                        .on("mouseover", mouseovered(true))
                        .on("mouseout", mouseovered(false));


                    // Append text
                    svg.append("g")
                        .selectAll("text")
                        .data(root.leaves())
                        .join("text")
                        .attr("dy", ".31em")
                        .attr("transform", d => `rotate(${d.x - 90}) translate(${innerRadius + 10},0)${d.x < 180 ? "" : " rotate(180)"}`)
                        .attr("text-anchor", d => d.x < 180 ? "start" : "end")
                        .text(d => {
                            let name = d.data.name.replace(/_/g, " ");
                            name = name.replace("(motivated by hooliganism, targeting social infrastructure or causing significant damage)", ""); // Replace a specific phrase
                            name = name.replace("(part unknown)", "");
                            name = name.replace("(motivated by hooliganism, using dangerous methods, or resulting in serious consequences)", "(motivated by hooliganism or resulting in serious consequences)"); // Replace a specific phrase
                            name = name.replace("(by a group, using official position or the Internet)", "(by a group or online)");
                            name = name.replace("(knowingly not authorized to enter or by a group of individuals)", "")
                            name = name.replace("of the Criminal Code", "")
                            name = name.replace("a threat to the safety of citizens or property", "a threat to the safety")
                            name = name.replace("(using an official position, a group of individuals, falsification of evidence, for selfish motives, or out of hatred)", "")
                            name = name.replace("(resulting in a mass illness or posing such a threat)", "")
                            name = name.replace(", government agencies, or mercenaries", "")


                            name = name.replace("(motivated by hooliganism or resulting in serious consequences)", " ")
                            name = name.replace("(by a group of people or using the media or the Internet)", "(by a group or online)")

                            name = name.replace("(by a group, using official position, mass media, or the internet)", "(by a group or via the Internet)")
                            return name;
                        })
                        .on("mouseover", mouseovered(true))
                        .on("mouseout", mouseovered(false));


                    function mouseovered(active) {
                        return function (event, d) {
                            if (active === true) {
                                tooltip
                                    .style("opacity", 1)
                                    .html(`<span style="background-color: var(--light-grey); padding: 5px; border-radius: 2px; ">${d.parent.parent.data.name}</span><br><br>` + "<b>People prosecuted: </b>" + d.data.count + " (" + (d.data.count / overallCount * 100).toFixed(2) + "%) " + "<br><b>Article: </b>" + d.parent.data.name + " " + d.data.name + "<br><br><b>Description: </b>" + d.data.desc);
                            } else {
                                tooltip
                                    .style("opacity", 0)
                                    .html("None");

                            }

                            d3.select(this).classed("label--active", active);
                            d3.select(d.linkExtensionNode).classed("link-extension--active", active).raise();
                            let currentNode = d; // Store the current node in a variable
                            do {
                                d3.select(currentNode.linkNode).classed("link--active", active).raise();
                                currentNode = currentNode.parent; // Move to the parent node
                            } while (currentNode); // Check if there's a parent node
                        };
                    }

                    return {
                        update: (checked) => {
                            const t = d3.transition().duration(750);
                            linkExtension.transition(t).attr("d", checked ? linkExtensionVariable : linkExtensionConstant);
                            link.transition(t).attr("d", checked ? linkVariable : linkConstant);
                        },
                        svg: svg.node()
                    };
                };

                const chartObj = chart(articleTree);
                d3.select(this.$refs.chart).node().appendChild(chartObj.svg);

            })
    },
}
</script>

<style scoped>
text {
    width: 100px;
    height: 20px;
    overflow-wrap: break-word;
    white-space: wrap;
}



#chart,
.chart {

    width: 100vw;
}
</style>