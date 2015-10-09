define(["common", "chart/Chart"], function (common, Chart) {

    //start bar chart
    var ChartAdjMatrix = function (config, parent) {

        var frame,
            svg,
            xScale,
            yScale,
            sep = 0.05,
            data,
            colorDefault = "#f5f5f5",
            cScale = d3.scale.ordinal().domain([1, 2, 3, 4, 5]).range(["#edf8e9","#bae4b3","#74c476","#31a354","#006d2c"]);

        //config the object
        set(config);

        //init
        (function init(){

            var exists;

            frame = d3.select(parent.get('selector'));
            exists = !frame.empty();

            if(exists) {

                svg = frame.select("svg");
                width = parseInt(svg.style("width"), 10);
                svg.attr('height', width);
                height = width;

                parent.set({exists: exists, width: width, height: height});
            }

        }());

        function updateScale(dSet){

            var data = parent.get('data'),
                nodeArray0 = data.get('nodes'),
                nodeArray1 = [],
                domainMap = function(d) { return d.id;};

            nodeArray0.sort(function(a, b) {

                if (a.title < b.title) {
                    return 1;
                }
                if (a.title > b.title) {
                    return -1;
                }
                // a must be equal to b
                return 0;
            });

            nodeArray1 = nodeArray0.slice();

            nodeArray1.sort(function(a, b) {

                if (a.title > b.title) {
                    return 1;
                }
                if (a.title < b.title) {
                    return -1;
                }
                // a must be equal to b
                return 0;
            });

            console.log(parent.get("rangeX"));
            console.log(parent.get("rangeY"));

            xScale = d3.scale.ordinal().domain(nodeArray1.map(domainMap)).rangeBands(parent.get("rangeX"), sep);
            yScale = d3.scale.ordinal().domain(nodeArray0.map(domainMap)).rangeBands(parent.get("rangeY"), sep);
        }

        function display(){

            var data = parent.get('data'),
                nodeArray = data.get('nodes'),
                linkGridArray = data.getLinkGridArray(),
                sLabelsGroup = svg.select("g.s-labels"),
                tLabelsGroup = svg.select("g.t-labels"),
                linksGroup = svg.select("g.links");

            if(sLabelsGroup.empty()){
                sLabelsGroup = svg.append("g").attr("class", "s-labels");
            }

            if(tLabelsGroup.empty()){
                tLabelsGroup = svg.append("g").attr("class", "t-labels");
            }

            if(linksGroup.empty()){
                linksGroup = svg.append("g").attr("class", "links");
            }

            sLabelsGroup
                .selectAll("text")
                .data(nodeArray, function(d) { return d.id; })
                .enter()
                .append("text")
                .attr({
                    "id": function(d, i) {
                        return "s-" + d.id;
                    },
                    "class": function(d, i) {
                        return d.class;
                    },
                    "x": function(d, i) {
                        return 0;
                    },
                    "y": function (d, i) {
                        return yScale(d.id) + (yScale.rangeBand() /2);
                    },
                    "textLength":  function (d, i) {
                        return parent.get('padding').left;
                    },
                    "lengthAdjust": "spacing",
                    "font-size": function (d, i) {
                        return Math.log(yScale.rangeBand() * 50);
                    }
                })
                .text(function(d) {
                    return d.title;
                });

            tLabelsGroup
                .selectAll("text")
                .data(nodeArray, function(d) { return d.id; })
                .enter()
                .append("text")
                .attr({
                    "id": function(d, i) {
                        return "t-" + d.id;
                    },
                    "class": function(d, i) {
                        return d.class;
                    },
                    "transform": function(d, i) {

                        var x = xScale(d.id) + (xScale.rangeBand() /2),
                            y = parent.get('padding').top;

                        return "translate(" + x + ", " + y + ") rotate(-90)";
                    },
                    "textLength":  function (d, i) {
                        return parent.get('padding').top;
                    },
                    "lengthAdjust": "spacing",
                    "font-size": function (d, i) {
                        return Math.log(xScale.rangeBand() * 50);
                    }
                })
                .text(function(d) {
                    return d.title;
                });

            linksGroup
                .selectAll("rect")
                .data(linkGridArray, function(d) { return d.id; })
                .enter()
                .append("rect")
                .attr({
                    "x": function(d, i) {
                        return xScale(d.target.id);
                    },
                    "y": function (d, i) {
                        return yScale(d.source.id);
                    },
                    "class": function(d, i) {
                        return d.class;
                    },
                    "width": xScale.rangeBand(),
                    "height": yScale.rangeBand(),
                    "fill": function(d) {

                        var f = colorDefault;
                        if(d.weight > 0){
                            f = cScale(d.weight);
                        }

                        return f;
                    }
                })
                .on('mouseover', function(d, i){

                    var sId = d.source.id,
                        tId = d.target.id;

                    svg.select('#s-' + sId).style({'font-weight': 'bold'});
                    svg.select('#t-' + tId).style({'font-weight': 'bold'});
                })
                .on('mouseout', function(d, i){

                    var sId = d.source.id,
                        tId = d.target.id;

                    svg.select('#s-' + sId).style({'font-weight': 'normal'});
                    svg.select('#t-' + tId).style({'font-weight': 'normal'});
                })
                .append("title")
                .text(function(d) {
                    return d.source.title + " :: " + d.target.title + " :: " + d.weight;
                });
        }

        this.display = function(){

            updateScale();
            display();
        };

        this.clear = function(){

            svg.selectAll("*").remove();
        };

        function set(config) {

            if (!common.isUndefined(config)) {
            }
        }

        function get(key){

            var value = null;

            return value;
        }

        //public setter
        this.set = function(config){

            parent.set(config);

            set(config);
        };

        //public getter
        this.get = function(key){

            var value = get(key);

            if(value === null){
                value = parent.get(key);
            }

            return value;
        };

    };

    return {

        getInstance: function(config) {
            var parent = Chart.getInstance(config);
            ChartAdjMatrix.prototype = parent;
            return new ChartAdjMatrix(config, parent);
        }
    };
});