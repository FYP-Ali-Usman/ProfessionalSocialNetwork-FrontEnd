function createGraph(svg, graph, url, coAUthorUrl, publicatonUrl) {
    var shortestPath = [];
    var shortestPathLen = 0;
    var highlightedPublicationNodes = [];
    var coAuthorId;
    let parentWidthDivider = 2.7;
    let parentHeightDivider = 1.8;
    if (coAUthorUrl != ''){
        for (i = 0; i < graph.nodes.length; i++) {
            if (graph.nodes[i].urlLink.substring(0,graph.nodes[i].urlLink.indexOf("publication")+11) == coAUthorUrl.substring(0,coAUthorUrl.indexOf("publication")+11))
                coAuthorId = graph.nodes[i].id
        }
        for(var prop in graph.shortestPaths) {
            if (prop == coAuthorId){
                // shortestPath.push([])
                for (i = 0; i < graph.shortestPaths[prop].length; i++) {
                    shortestPath.push(graph.shortestPaths[prop][i])
                }
                // shortestPath = graph.shortestPaths[prop][0] // this will consider only first shortest path but there can be multiple shortes paths which it will neglect
            }                
        }
        shortestPathLen = shortestPath.length;
        // console.log(shortestPath)
        // console.log(shortestPathLen)

        // in below for loop i wanted to show that part of graph where the coauhor is shown once user clicks on coauthor
        // but it is behaving awkward
        
        // for(var prop in graph.nodes) {
        //     if (graph.nodes[prop].id == coAuthorId){
        //         console.log(graph.nodes[prop])
        //         var n = graph.nodes[prop].x.toString();
        //         console.log(n);
        //         n = n[0]
        //         parentWidthDivider = n*1.5;
        //         // if(graph.nodes[prop].x > 0){
        //         //     parentWidthDivider = n*1.5;
        //         // }
        //     }                
        // }
    } 

    // alert('Welcome to D3 js');
    // if both d3v3 and d3v4 are loaded, we'll assume
    // that d3v4 is called d3v4, otherwise we'll assume
    // that d3v4 is the default (d3)
    if (typeof d3v4 == 'undefined')
        d3v4 = d3;

    var width = +svg.attr("width"),
        height = +svg.attr("height");

    // let parentWidth = d3v4.select('svg').node().parentNode.clientWidth;
    // console.log(d3v4.select('svg').node());
    // let parentHeight = d3v4.select('svg').node().parentNode.clientHeight;
    // let parentWidth = screen.width;
    let parentWidth = window.innerWidth/parentWidthDivider;
    // let parentWidth = window.innerWidth/9;
    let parentHeight = window.innerHeight/parentHeightDivider;

    var svg = d3v4.select('svg')
    .attr('width', width)
    .attr('height', height)

    var margin = {top: 20, right: 20, bottom: 20, left: 20},
        padding = {top: 60, right: 60, bottom: 60, left: 60}

    console.log(parentHeight)
    console.log(parentWidth)
    // remove any previous graphs
    svg.selectAll('.g-main').remove();

    var gMain = svg.append('g')
    .classed('g-main', true);

    var rect = gMain.append('rect')
    .attr('width', parentWidth)
    .attr('height', parentHeight)
    .style('fill', "snow")

    var gDraw = gMain.append('g');

    var zoom = d3v4.zoom()
    .on('zoom', zoomed)

    svg.call(zoom);

    function zoomed() {
        gDraw.attr('transform', d3v4.event.transform);
    }

    var color = d3v4.scaleOrdinal(d3v4.schemeCategory10);

    if (! ("links" in graph)) {
        console.log("Graph is missing links");
        return;
    }

    var nodes = {};
    var i;
    for (i = 0; i < graph.nodes.length; i++) {
        nodes[graph.nodes[i].id] = graph.nodes[i];
        // graph.nodes[i].weight = 1.01;
    }

    // the brush needs to go before the nodes so that it doesn't
    // get called when the mouse is over a node
    var gBrushHolder = gDraw.append('g');
    var gBrush = null;

    var link = gDraw.append("g")
        .attr("class", "link")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line")
        .attr("stroke-width", function(d) {
            // console.log(d.target.id)
            // console.log(d)
            // console.log(shortestPath)
            if (publicatonUrl != ''){
                if(d.papaerLink == publicatonUrl){
                    if(!highlightedPublicationNodes.includes(d.source)){
                        highlightedPublicationNodes.push(d.source);
                    }
                    if(!highlightedPublicationNodes.includes(d.target)){
                        highlightedPublicationNodes.push(d.target);
                    }
                    return Math.sqrt(30); 
                }
                else{
                    return Math.sqrt(2); 
                }
            }
            if (coAUthorUrl != ''){
                var inIndex = null;
                for (i = 0; i < shortestPathLen; i++){
                    if (shortestPath[i].includes(d.target.id)){
                    // if (true){
                        inIndex = i
                    }
                }
                // console.log(inIndex)
                if (inIndex != null){
                    return Math.sqrt(30); 
                }
            }
            else{
                return Math.sqrt(2);
            }  
            return Math.sqrt(2);
        })
        .style("opacity",(d) => { 
            if (publicatonUrl != ''){
                if(d.papaerLink == publicatonUrl){
                    return 1; 
                }
                else{
                    return 0.3; 
                }
            }
            if (coAUthorUrl != ''){
                var inIndex = null;
                for (i = 0; i < shortestPathLen; i++){
                    if (shortestPath[i].includes(d.target.id)){
                        inIndex = i
                    }
                }
                if (inIndex == null){
                    return 0.3;
                }
            }
            else{
                return 1;
            }  
            // return 1;
        })
        .attr("stroke", function(d) { 
            if ('color' in d){
                // console.log(d.color);
                return d.color;
            }
            else
                // console.log(this.__data__.name);
                return color(d.group);
        })
        .on("mousemove", function moveTooltip() {
                var [posX, posY] = [d3.event.x, d3.event.y];
                posX += posX > width / 2 ? -100 : 50;
                posY += posY > height / 2 ? -100 : 50;
                tooltip.interrupt()
                    .style("opacity", 1)
                    .html(
                    '<ul class="list-group">'+
                        '<li class="list-group-item list-group-item-danger">Title: '+ this.__data__.title +
                        '</li><li class="list-group-item list-group-item-success">Year: ' + this.__data__.year + 
                        '</li><li class="list-group-item list-group-item-success">About: ' + this.__data__.overview + 
                    '</li></ul>')
                    .transition().duration(20000).ease(d3.easeLinear)
                    .style("left", posX + "px")
                    .style("top", posY + "px");
            }
        )
        .on("mouseout", hideTooltip);

        
    var node = gDraw.append("g")
        .attr("class", "node")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("r", (d)=>{
            if (url == d.urlLink){
              // d.group = 3;
              return 20;
            }
            if (coAUthorUrl != ''){
                if(d.id == coAuthorId){
                    return 20;
                }
                else{
                  return 10;
                }
            }
            else{
              return 10;
            }
          })
        .style("opacity",(d) => {
            if (publicatonUrl != ''){
                if(highlightedPublicationNodes.includes(d.id)){
                    return 1;
                }
                else{
                    return 0.3;
                }
            }
            if (coAUthorUrl != ''){
                // if(coAuthorId == d.id)
                //     console.log(d);
                var inIndex = null;
                for (i = 0; i < shortestPathLen; i++){
                    if (shortestPath[i].includes(d.id)){
                        inIndex = i
                    }
                }
                if (inIndex != null){
                    return 1;
                }
                else{
                    return 0.3;
                }
                if (shortestPath.includes(d.id)){
                    return 1;
                }
                else {
                    return 0.3;
                }
            }
            else{
                return 1;
            }  
        })
        .attr("fill", function(d) { 
            // if ('color' in d)
            //     return d.color;
            // else
            //     // console.log(this.__data__.name);
            //     return color(d.group);
            if (d.level == 0){
                return 'Blue';
            }
            else if (d.level == 1){
                return '#00ff99';
            }
            else if (d.level == 2){
                return '#ffad33'
            }
            else{
                return color(d.group);
            }
        })
        .call(d3v4.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
        .on("click", function(d) {
            // console.log("Level of the node is: "+d.level);
            oppositeNode = []
            oppositeNode.push(d.id);
            highlightedLinks = []
            clickedNodeId = d.id;
            var shortestPath = []
            for(var prop in graph.shortestPaths) {
                if (prop == d.id){
                    for (i = 0; i < graph.shortestPaths[prop].length; i++) {
                        shortestPath.push(graph.shortestPaths[prop][i])
                    }
                }                
            }
            // console.log(shortestPath);

            // node.attr("r", (dd)=>{
            //     if (clickedNodeId == dd.id){
            //       return 20;
            //     }
            //     else{
            //       return 10;
            //     }
            // })
            link.attr('stroke-width',(dd) => {
                for(var j in shortestPath){
                    if(shortestPath[j].includes(dd.target.id) && shortestPath[j].includes(dd.source.id)){
                        highlightedLinks.push(dd);
                    }
                }
            })
            node.style("opacity", (dd) => {
                for(var j in shortestPath){
                    if(shortestPath[j].includes(dd.id) && shortestPath[j].includes(dd.id)){
                        oppositeNode.push(dd.id);
                    }
                }
            });  
            link.each( (dd) => {
                if(dd.source.id == clickedNodeId){
                    oppositeNode.push(dd.target.id);
                    highlightedLinks.push(dd);
                }
                else if(dd.target.id == clickedNodeId){
                    oppositeNode.push(dd.source.id);
                    highlightedLinks.push(dd);
                }
            })
            link.attr('stroke-width',(dd) => {
                if(highlightedLinks.includes(dd)){
                    return Math.sqrt(8); 
                }
                else{
                    return Math.sqrt(1); 
                }
            })
            link.style("opacity",(dd) => {
                if(highlightedLinks.includes(dd)){
                    return 1;
                }
                else{
                    return 0.3;
                }
            })
            // console.log(this.oppositeNode);
            node.style("opacity", (dd) => {
                if(oppositeNode.includes(dd.id)){
                    return 1;
                }
                else{
                    return 0.3;
                }
            });      
        })
        .on("mousemove",  function moveTooltip() {
                    var [posX, posY] = [d3.event.x, d3.event.y];
                    posX += posX > width / 2 ? -100 : 50;
                    posY += posY > height / 2 ? -100 : 50;
                    // console.log(this.__data__.name);
                    if (this.__data__.totalPaper != '')
                        if(this.__data__.degreeCentrality == 0 && 
                            this.__data__.closenessCentrality == 0 && 
                            this.__data__.betweennessCentrality == 0 && 
                            this.__data__.eigenvectorCentrality == 0)
                            tooltip.interrupt()
                                .style("opacity", 1)
                                .html(
                                    '<ul class="list-group">'+
                                '<li class="list-group-item list-group-item-danger">Name: '+ this.__data__.name +
                                '</li><li class="list-group-item list-group-item-success">Total Papers: ' + this.__data__.totalPaper + 
                                '</li><li class="list-group-item list-group-item-success">Total Coauthors: ' + this.__data__.totalCoAuthor + 
                                '</li><li class="list-group-item list-group-item-success">Total Citations: ' + this.__data__.totalCitation+
                                '</li></ul>')
                                .transition().duration(20000).ease(d3.easeLinear)
                                .style("left", posX + "px")
                                .style("top", posY + "px");
                        else{
                            tooltip.interrupt()
                                .style("opacity", 1)
                                .html(
                                '<ul class="list-group">'+
                                '<li class="list-group-item list-group-item-danger">Name: '+ this.__data__.name +
                                '</li><li class="list-group-item list-group-item-success">Degree Centrality: ' + this.__data__.degreeCentrality + 
                                '</li><li class="list-group-item list-group-item-success">Closeness Centrality: ' + this.__data__.closenessCentrality + 
                                '</li><li class="list-group-item list-group-item-success">Betweenness Centrality: ' + this.__data__.betweennessCentrality+
                                '</li></ul>'
                                // "<br>Eigen Vector Centrality: " + this.__data__.eigenvectorCentrality 
                                )
                                .transition().duration(20000).ease(d3.easeLinear)
                                .style("left", posX + "px")
                                .style("top", posY + "px");
                        }
                    else {
                        if(this.__data__.degreeCentrality == 0 && 
                            this.__data__.closenessCentrality == 0 && 
                            this.__data__.betweennessCentrality == 0 && 
                            this.__data__.eigenvectorCentrality == 0)
                            tooltip.interrupt()
                                .style("opacity", 1)
                                .html("Name: " + this.__data__.name 
                                // +"<br>URL: " + this.__data__.urlLink 
                                )
                                .transition().duration(20000).ease(d3.easeLinear)
                                .style("left", posX + "px")
                                .style("top", posY + "px");
                        else{
                            tooltip.interrupt()
                                .style("opacity", 1)
                                .html(
                                    '<ul class="list-group">'+
                                    '<li class="list-group-item list-group-item-danger">Name: '+ this.__data__.name +
                                    '</li><li class="list-group-item list-group-item-success">Degree Centrality: ' + this.__data__.degreeCentrality + 
                                    '</li><li class="list-group-item list-group-item-success">Closeness Centrality: ' + this.__data__.closenessCentrality + 
                                    '</li><li class="list-group-item list-group-item-success">Betweenness Centrality: ' + this.__data__.betweennessCentrality+
                                    '</li></ul>'
                                // "<br>Eigen Vector Centrality: " + this.__data__.eigenvectorCentrality  
                                )
                                .transition().duration(5000).ease(d3.easeLinear)
                                .style("left", posX + "px")
                                .style("top", posY + "px");
                        }
                    }
                }
            )
        .on("mouseout", hideTooltip);

    //https://blockbuilder.org/alexmacy/e81c67c1f0db4c4806ffdc4160c6e7d9

    var tooltip = d3.select(".prop")
        .html("")
        .on("mouseover",     function moveTooltip() {
            var [posX, posY] = [d3.event.x, d3.event.y];
            posX += posX > width / 2 ? -100 : 50;
            posY += posY > height / 2 ? -100 : 50;
            
            tooltip.interrupt()
                .style("opacity", 1)
                // .html("Pointer x-axis: " + d3.event.x + "<br>Pointer y-axis: " + d3.event.y)
                .transition().duration(20000).ease(d3.easeLinear)
                .style("left", posX + "px")
                .style("top", posY + "px");
            })
        .on("click", clicked);

    // function moveTooltip() {
    //     var [posX, posY] = [d3.event.x, d3.event.y];
    //     posX += posX > width / 2 ? -100 : 50;
    //     posY += posY > height / 2 ? -100 : 50;
        
    //     tooltip.interrupt()
    //         .style("opacity", 1)
    //         .html("Name: " + 10 + "<br>y: " + 10)
    //         .transition().duration(20000).ease(d3.easeLinear)
    //         .style("left", posX + "px")
    //         .style("top", posY + "px");
    //     }
        
    function hideTooltip() {
        tooltip.interrupt()
            .transition().duration(10000)
            .style("opacity", 0)
        }
        
    function clicked() {
        flashRect
            .transition().duration(20000)
            .style("fill-opacity", 1)
            .transition().duration(20000)
            .style("fill-opacity", 0)
        }
                  
    // add titles for mouseover blurbs
    // node.append("title")
    //     .text("Person");

    node.append("title")
        .text(function(d) {
                return d.id;
    });

    link.append("title")
        .text("Publication");

    // link.append("title")
    //     .text(function(d) {
    //             return d.title;
    // });

    var simulation = d3v4.forceSimulation()
        .force("link", d3v4.forceLink()
                .id(function(d) { return d.id; })
                .distance(function(d) { 
                    return 30;
                    //var dist = 20 / d.value;
                    //console.log('dist:', dist);

                    return dist; 
                })
              )
        // .force('collision', d3.forceCollide().radius(function(d) {
        // return 25;
        // }))
        // .force("charge", d3v4.forceManyBody())
        .force("charge", d3.forceManyBody().strength(function (d, i) {
            var a = i == 0 ? -2000 : -1000;
            return a;
        }).distanceMin(200).distanceMax(1000))
        .force("center", d3v4.forceCenter(parentWidth / 2, parentHeight / 2))
        .force("x", d3v4.forceX(parentWidth/2))
        .force("y", d3v4.forceY(parentHeight/2));

    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(graph.links);

    function ticked() {
        
        // let parentWidth = window.innerWidth;
        // let parentHeight = window.innerHeight/1.8;
        
        // console.log(parentHeight)
        // console.log(parentWidth)
        // update node and line positions at every step of 
        // the force simulation
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
    }

    var brushMode = false;
    var brushing = false;

    var brush = d3v4.brush()
        .on("start", brushstarted)
        .on("brush", brushed)
        .on("end", brushended);

    function brushstarted() {
        // keep track of whether we're actively brushing so that we
        // don't remove the brush on keyup in the middle of a selection
        brushing = true;
 
        node.each(function(d) {
            d.previouslySelected = shiftKey && d.selected;
        });
    }

    rect.on('click', () => {
        node.each(function(d) {
            d.selected = false;
            d.previouslySelected = false;
        });
        node.classed("selected", false);
    });

    function brushed() {
        if (!d3v4.event.sourceEvent) return;
        if (!d3v4.event.selection) return;

        var extent = d3v4.event.selection;

        node.classed("selected", function(d) {
            return d.selected = d.previouslySelected ^
            (extent[0][0] <= d.x && d.x < extent[1][0]
             && extent[0][1] <= d.y && d.y < extent[1][1]);
        });
    }

    function brushended() {
        if (!d3v4.event.sourceEvent) return;
        if (!d3v4.event.selection) return;
        if (!gBrush) return;

        gBrush.call(brush.move, null);

        if (!brushMode) {
            // the shift key has been release before we ended our brushing
            gBrush.remove();
            gBrush = null;
        }

        brushing = false;
    }

    d3v4.select('body').on('keydown', keydown);
    d3v4.select('body').on('keyup', keyup);

    var shiftKey;

    function keydown() {
        shiftKey = d3v4.event.shiftKey;

        if (shiftKey) {
            // if we already have a brush, don't do anything
            if (gBrush)
                return;

            brushMode = true;

            if (!gBrush) {
                gBrush = gBrushHolder.append('g');
                gBrush.call(brush);
            }
        }
    }

    function keyup() {
        shiftKey = false;
        brushMode = false;

        if (!gBrush)
            return;

        if (!brushing) {
            // only remove the brush if we're not actively brushing
            // otherwise it'll be removed when the brushing ends
            gBrush.remove();
            gBrush = null;
        }
    }

    function dragstarted(d) {
      if (!d3v4.event.active) simulation.alphaTarget(0.9).restart();

        if (!d.selected && !shiftKey) {
            // if this node isn't selected, then we have to unselect every other node
            node.classed("selected", function(p) { return p.selected =  p.previouslySelected = false; });
        }

        d3v4.select(this).classed("selected", function(p) { d.previouslySelected = d.selected; return d.selected = true; });

        node.filter(function(d) { return d.selected; })
        .each(function(d) { //d.fixed |= 2; 
          d.fx = d.x;
          d.fy = d.y;
        })

    }

    function dragged(d) {
      //d.fx = d3v4.event.x;
      //d.fy = d3v4.event.y;
            node.filter(function(d) { return d.selected; })
            .each(function(d) { 
                d.fx += d3v4.event.dx;
                d.fy += d3v4.event.dy;
            })
    }

    function dragended(d) {
      if (!d3v4.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
        node.filter(function(d) { return d.selected; })
        .each(function(d) { //d.fixed &= ~6; 
            d.fx = null;
            d.fy = null;
        })
    }

    // var texts = ['=> Use the scroll wheel to zoom', '=> Hold and move nodes'
    // , '=> Click on nodes to highlight', '=> Hover over the node to view properties']

    // svg.selectAll('text')
    //     .data(texts)
    //     .enter()
    //     .append('text')
    //     .attr('x', 50)
    //     .attr('y', function(d,i) { return parentHeight - (i+1) * 20;})
    //     // .attr('y', function(d,i) { return 470 + i * 18; })
    //     .text(function(d) { return d; });

    return graph;
};
