define(["common"], function (common) {

    //start
    var ChartNodeLink = function (config) {

        var frame,
            exists,
            width,
            height,
            svg,
            data,
            typeColorScale = d3.scale.category20(),
            ratingColorScale = d3.scale.category20(),
            otherColorScale = d3.scale.category10();

        set(config);

        function hightLight(hArray, colorScale){

            var k, h,
                typeColorArray = [];

            for(k in hArray){

                h = hArray[k];
                c = colorScale(h.id);

                d3.selectAll("circle." + h.id).style({fill: c});

                typeColorArray.push({
                    name: h.name,
                    color: c
                });
            }

            return typeColorArray;
        }

        this.highlight = function(type){

            var typeColorArray = null;

            switch(type){

                case 'type':
                    typeColorArray = hightLight(data.get('typeAttrMap'), typeColorScale);
                    break;
                case 'status':
                    typeColorArray = hightLight(data.get('statusAttrMap'), otherColorScale);
                    break;
                case 'rating':
                    typeColorArray = hightLight(data.get('ratingAttrMap'), ratingColorScale);
                    break;
                case 'match':
                    typeColorArray = hightLight(data.get('matchAttrMap'), otherColorScale);
                    break;
                case 'restriction':
                    typeColorArray = hightLight(data.get('ageGateAttrMap'), otherColorScale);
                    break;
                case 'title-type':
                    typeColorArray = hightLight(data.get('titleTypeAttrMap'), otherColorScale);
                    break;
            }

            return typeColorArray;
        };

        this.display = function(){

            var node,
                link,
                nodes = data.get('nodes'),
                links = data.get('links');

            force = d3.layout.force()
                .linkStrength(0.1)
                .friction(0.9)
                .distance(400)
                .gravity(0.05)
                .charge(-50)
                .gravity(0.1)
                .theta(0.8)
                .alpha(0.1)
                .size([width, height]);

            force.nodes(nodes).links(links).start();

            link = svg.selectAll(".link")
                .data(links)
                .enter().append("line")
                .attr("id", function(d, i){
                    return "l-" + d.id;
                })
                .attr("class", "link")
                .style("stroke-width", function (d) {
                    return Math.log(d.weight);
                });

            node = svg.selectAll(".node")
                .data(nodes)
                .enter().append("circle")
                .attr("id", function(d, i){
                    return "n-" + d.id;
                })
                .attr("class", function(d, i){
                    return d.class;
                })
                .attr("r", function(d, i){

                    var weight = 1;
                    if(d.duration > 0){
                        weight = d.duration;
                    }

                    return Math.log(parseInt(weight)* 100);
                });

            node.append("title")
                .text(function (d) {
                    return d.title;
                });

            force.on("tick", function() {

                link.attr("x1", function(d) { return d.source.x; })
                    .attr("y1", function(d) { return d.source.y; })
                    .attr("x2", function(d) { return d.target.x; })
                    .attr("y2", function(d) { return d.target.y; });

                node.attr("cx", function(d) { return d.x; })
                    .attr("cy", function(d) { return d.y; });
            });
        };

        function set(config) {

            if (!common.isUndefined(config)) {

                if (!common.isUndefined(config.selector)) {

                    frame = d3.select(config.selector);
                    exists = !frame.empty();

                    if(exists) {

                        svg = frame.select("svg");
                        width = parseInt(svg.style("width"), 10);
                        height = parseInt(svg.style("height"), 10);
                    }
                }

                if (!common.isUndefined(config.data)) {
                    data = config.data;
                }
            }
        }

        //public setter
        this.set = function(config){
            set(config);
        };

        function get(key){

            var value = null;

            if(key === "data") {
                value = data;
            }

            return value;
        }

        //public getter
        this.get = function(key){
            return get(key);
        };

    };

    return {

        getInstance: function(config) {
            return new ChartNodeLink(config);
        }
    };

});