"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGraphWebviewContent = void 0;
function getGraphWebviewContent(nodes, edges) {
    return `
        <script
          type="text/javascript"
          src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>
        <style type="text/css">
          #mynetwork {
            width:1200px;
            height: 700px;
          }
        </style>
    
        <div id="mynetwork"></div>
        <script type="text/javascript">
          // create an array with nodes
          var nodes = new vis.DataSet(${JSON.stringify(nodes)});
    
          var edges = new vis.DataSet(${JSON.stringify(edges)});
    
          var container = document.getElementById("mynetwork");
          var data = {
            nodes: nodes,
            edges: edges,
          };
          var options = {};
          var network = new vis.Network(container, data, options);
        </script>

`;
}
exports.getGraphWebviewContent = getGraphWebviewContent;
//# sourceMappingURL=GetGrapWebViewContentCommand.js.map