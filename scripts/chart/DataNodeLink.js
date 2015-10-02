define(["common"],

    function (common) {

        //start
        var DataNodeLink = function (config) {

            var nodes = [],
                nodeMap = [],
                links = [],
                linkMap = [],

                typeAttrMap = [],
                statusAttrMap = [],
                ratingAttrMap = [],
                matchAttrMap = [],
                ageGateAttrMap = [],
                titleTypeAttrMap = [];

            set(config);

            function addNode(n){

                var id = n.id,
                    tId = 't-' + n.type,
                    sId = 's-' + n.status,
                    rId = 'r-' + n.rating.toLowerCase(),
                    mId = "m-" + n.isMatch,
                    aId = "a-" + n.ageGate,
                    ttId = "tt-" + ((n.seriesId > 0) ? "series" : "show"),
                    outArray = [
                        "node",
                        tId,
                        sId,
                        rId,
                        mId,
                        aId,
                        ttId
                    ];

                n.class = outArray.join(' ');
                nodeMap[id] = n;
                nodes.push(n);

                if(typeAttrMap.indexOf(tId) < 0){

                    typeAttrMap[tId] = {
                        id: tId,
                        name: n.type
                    };
                }

                if(statusAttrMap.indexOf(sId) < 0){

                    statusAttrMap[sId] = {
                        id: sId,
                        name: n.status
                    };
                }

                if(ratingAttrMap.indexOf(rId) < 0){

                    ratingAttrMap[rId] = {
                        id: rId,
                        name: n.rating
                    };
                }

                if(matchAttrMap.indexOf(mId) < 0){

                    matchAttrMap[mId] = {
                        id: mId,
                        name: ((n.isMatch) ? "matched search" : "no search match")
                    };
                }

                if(ageGateAttrMap.indexOf(aId) < 0){

                    ageGateAttrMap[aId] = {
                        id: aId,
                        name: ((n.ageGate) ? "restricted" : "unrestricted")
                    };
                }

                if(titleTypeAttrMap.indexOf(ttId) < 0){

                    titleTypeAttrMap[ttId] = {
                        id: ttId,
                        name: ((n.seriesId > 0) ? "series" : "show")
                    };
                }
            }

            function addLink(l){

                var id = l.source + "-" + l.target;
                l.id = id;

                linkMap[id] = l;
                links.push(l);
            }

            function set(config) {

                var i, n, l;

                if (!common.isUndefined(config.nodes)) {

                    for(i = 0; i < config.nodes.length; i++){

                        n = config.nodes[i];
                        addNode(n);

                        console.log(n);
                    }
                }

                if (!common.isUndefined(config.links)) {

                    for(i = 0; i < config.links.length; i++){

                        l = config.links[i];
                        addLink(l);
                    }
                }
            }

            //public setter
            this.set = function(config){
                set(config);
            };

            function get(key){

                var value = null;

                if(key === "nodes") {
                    value = nodes;
                }

                if(key === "links") {
                    value = links;
                }

                if(key === "typeAttrMap") {
                    value = typeAttrMap;
                }

                if(key === "statusAttrMap") {
                    value = statusAttrMap;
                }

                if(key === "ratingAttrMap") {
                    value = ratingAttrMap;
                }

                if(key === "matchAttrMap") {
                    value = matchAttrMap;
                }

                if(key === "ageGateAttrMap") {
                    value = ageGateAttrMap;
                }

                if(key === "titleTypeAttrMap") {
                    value = titleTypeAttrMap;
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
                return new DataNodeLink(config);
            }
        };
    }
);