define(["common", "chart/Chart"], function (common, Chart) {

    //start bar chart
    var ChartAdjMatrix = function (config, parent) {

        var frame,
            svg,
            xScale,
            yScale,
            sep = 0.1,
            data;

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
                height = parseInt(svg.style("height"), 10);

                parent.set({exists: exists, width: width, height: height});
            }

        }());

        function updateScale(dSet){

            var data = parent.get('data'),
                nodes = data.get('nodes'),
                domainMap = function(d) { return d.id; };

            xScale = d3.scale.ordinal().domain(nodes.map(domainMap)).rangeRoundBands(parent.get("rangeX"), sep);
            yScale = d3.scale.ordinal().domain(nodes.map(domainMap)).rangeRoundBands(parent.get("rangeY"), sep);
        }

        function display(){

            var data = parent.get('data'),
                nodeArray = data.get('nodes');


            xScale('stuff');
        }

        this.display = function(){

            updateScale();
            display();
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