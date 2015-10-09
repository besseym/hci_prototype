define(["common"],

    function (common) {

        //start
        var DataNodeLink = function (config) {

            var nodes = [],
                nodeMap = [],
                nodeConnectMap = [],
                links = [],
                linkMap = [],

                typeAttrMap = [],
                statusAttrMap = [],
                ratingAttrMap = [],
                matchAttrMap = [],
                ageGateAttrMap = [],
                titleTypeAttrMap = [],

                urlBase = "http://www.smithsonianchannel.com/videos/video";

            set(config);

            this.getLinkGridArray = function(){

                var i, j,
                    sNode, tNode,
                    lId, link, classOutArray,
                    linkGridArray = [];

                for(i = 0; i < nodes.length; i++){

                    sNode = nodes[i];

                    for(j = 0; j < nodes.length; j++){

                        tNode = nodes[j];

                        lId = 'l-' + sNode.id + "-" + tNode.id;
                        link = linkMap[lId];

                        if (common.isUndefined(link)) {

                            classOutArray = [
                                "link",
                                "s-" + sNode.id,
                                "t-" + tNode.id
                            ];

                            link = {
                                id: lId,
                                class: classOutArray.join(" "),
                                source: sNode,
                                target: tNode,
                                weight: 0
                            };
                        }

                        linkGridArray.push(link);
                    }
                }

                return linkGridArray;

            };

            this.getNode = function(nodeId){
                return nodeMap[nodeId];
            };

            this.getNodeConnect = function(nodeId){
                return nodeConnectMap[nodeId];
            };

            function addNode(n){

                var id = "n-" + n.id,
                    node,
                    tId = 't-' + n.type,
                    sId = 's-' + n.status,
                    rId = 'r-' + n.rating.toLowerCase(),
                    mId = "m-" + n.isMatch,
                    aId = "a-" + n.ageGate,
                    ttId = "tt-" + ((n.seriesId > 0) ? "series" : "show"),
                    classOutArray = [
                        "node",
                        tId,
                        sId,
                        rId,
                        mId,
                        aId,
                        ttId,
                        "g-" + id
                    ];

                node = {
                    id: id,
                    title: n.title,
                    type: n.type,
                    rating: n.rating,
                    duration: n.duration,
                    seriesId: n.seriesId,
                    seasonNumber: n.seasonNumber,
                    showId: n.showId,
                    url: urlBase + '/' + n.id,
                    class: classOutArray.join(' ')
                };

                nodeMap[id] = node;
                nodes.push(node);

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

            function removeLink(lId){

                var i, k, index, cNode, connect, link;

                link = linkMap[lId];

                index = -1;
                for(i = 0; i < links.length; i++){

                    if(links[i].id === lId){
                        index = i;
                        break;
                    }
                }

                if(index >= 0){
                    links.splice(index, 1);
                }

                cNode = nodeConnectMap[link.source.id];
                if(!common.isUndefined(cNode)) {

                    index = -1;
                    for (i = 0; i < cNode.connectionArray.length; i++) {

                        connect = cNode.connectionArray[i];
                        if (connect.l.id === lId) {

                            index = i;
                            break;
                        }
                    }

                    if (index >= 0) {
                        cNode.connectionArray.splice(index, 1);
                    }
                }

                linkMap[lId] = undefined;

                return link;
            }

            this.removeLink = function(lId){
                return removeLink(lId);
            };

            function makeLink(sNode, tNode, weight){

                var link,
                    id = 'l-' + sNode.id + "-" + tNode.id,
                    cNode = nodeConnectMap[sNode.id],

                    classOutArray = [
                        "link",
                        "s-" + sNode.id,
                        "t-" + tNode.id
                    ];

                link = {
                    id: id,
                    class: classOutArray.join(" "),
                    source: sNode,
                    target: tNode,
                    weight: weight
                };

                links.push(link);

                linkMap[id] = link;

                if(common.isUndefined(cNode)){

                    cNode = {
                        connectionArray: []
                    };
                }

                tNode.class = tNode.class + ' g-' + sNode.id;

                cNode.connectionArray.push({
                    l: link,
                    n: tNode
                });

                nodeConnectMap[sNode.id] = cNode;

                return link;
            }

            this.isConnected = function(sourceId, targetId){

                var isConnected = false,
                    cNode = nodeConnectMap[sourceId],
                    connect;

                if(!common.isUndefined(cNode)){

                    for(i = 0; i < cNode.connectionArray.length; i++){

                        connect = cNode.connectionArray[i];
                        if(connect.n.id === targetId){
                            isConnected = true;
                            break;
                        }
                    }
                }

                return isConnected;
            };

            this.makeLink = function(sourceId, targetId){

                return makeLink(nodeMap[sourceId], nodeMap[targetId], 6);
            };

            function addLink(l){

                return makeLink(nodes[l.source], nodes[l.target], l.weight);
            }

            function set(config) {

                var i, n, l;

                if (!common.isUndefined(config.nodes)) {

                    for(i = 0; i < config.nodes.length; i++){

                        n = config.nodes[i];
                        addNode(n);
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