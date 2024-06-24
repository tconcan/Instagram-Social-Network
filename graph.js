class Node {
    constructor(x, y, name, color, radius) {
        this.adj = [];
        this.degree = this.adj.length;
        this.name = name;
        this.color = color;
        this.radius = radius;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.fx = 0;
        this.fy = 0;
    }
}

class Edge {
    constructor(node1, node2) {
        this.node1 = node1;
        this.node2 = node2;
    }
}

class Graph {
    constructor() {
        this.nodes = [];
        this.edges = [];
    }

    addNode(node) {
        this.nodes.push(node);
    }

    addEdge(edge) {
        this.edges.push(edge);
        edge.node1.adj.push(edge.node2);
        edge.node1.degree += 1;
        edge.node2.adj.push(edge.node1);
        edge.node2.degree += 1;
    }

    getNodes() {
        return this.nodes;
    }

    getEdges() {
        return this.edges;
    }

    setNodeColor(color) {
        this.nodes.forEach(node => {
            node.color = color;
        });
    }

    addNodesAndEdges(n, density, color, radius) {
        this.addRandomNodes(n, color, radius);
        this.addEdgesWithDensity(density);
    }

    addRandomNodes(n, color, radius) {
        for (let i = 0; i < n; i++) {
            let x = Math.random();
            let y = Math.random();
            this.addNode(new Node(x, y, "Node " + i.toString(), color, radius));
        }
    }

    addEdgesWithDensity(density) {
        let totalPossibleEdges = this.nodes.length * (this.nodes.length - 1) / 2;
        let numEdgesToAdd = Math.floor(density * totalPossibleEdges);

        for (let i = 0; i < numEdgesToAdd; i++) {
            let node1 = this.nodes[Math.floor(Math.random() * this.nodes.length)];
            let node2 = this.nodes[Math.floor(Math.random() * this.nodes.length)];
            if (node1 !== node2 && !node1.adj.includes(node2)) {
                this.addEdge(new Edge(node1, node2));
            } else {
                i--; 
            }
        }
    }

    addEdgeList(edgeList, color, radius) {
        const lines = edgeList.split('\n');
        const nodeMap = new Map();

        for (let line of lines) {
            const [name1, name2] = line.split(',').map(s => s.trim());

            let node1 = nodeMap.get(name1);
            if (!node1) {
                node1 = new Node(Math.random(), Math.random(), name1, color, radius);
                this.addNode(node1);
                nodeMap.set(name1, node1);
            }

            let node2 = nodeMap.get(name2);
            if (!node2) {
                node2 = new Node(Math.random(), Math.random(), name2, color, radius);
                this.addNode(node2);
                nodeMap.set(name2, node2);
            }

            this.addEdge(new Edge(node1, node2));
        }
    }

    starfish(arms, armLength, color, radius) {
        
        for(let arm = 0; arm < arms; arm++) {
            prev = 0;
            while(node <= arm * armLength + armLength){
                graph
            }
        }
    }


    plot(context, canvasWidth, canvasHeight, edgeColor="black", edgeThickness=1) {
        
        context.strokeStyle = edgeColor;
        context.lineWidth = edgeThickness;
        context.beginPath();
        this.edges.forEach(edge => {
            let x1 = edge.node1.x * canvasWidth;
            let y1 = canvasHeight - edge.node1.y * canvasHeight;
            let x2 = edge.node2.x * canvasWidth;
            let y2 = canvasHeight - edge.node2.y * canvasHeight;
            context.moveTo(x1, y1);
            context.lineTo(x2, y2);
        });
        context.stroke();
        context.strokeStyle = "black";
        context.lineWidth = 2;
        this.nodes.forEach(node => {
            context.beginPath();
            context.fillStyle = node.color;
            let x = node.x * canvasWidth;
            let y = canvasHeight - node.y * canvasHeight;
            context.arc(x, y, node.radius, 0, 2 * Math.PI, false);
            context.fill();
            context.stroke();
        });
    }
}

function changeSettings(option){
    const randomControls = document.getElementById('randomControls');
    const edgeListControls = document.getElementById('edgeListControls');
    const starfishControls = document.getElementById('starfishControls');

    if (option === 'random') {
        randomControls.style.display = '';
        edgeListControls.style.display = 'none';
        starfishControls.style.display = 'none';
        mode = 1;
    } else if (option === 'edge') {
        randomControls.style.display = 'none';
        edgeListControls.style.display = 'flex';
        starfishControls.style.display = 'none';
        mode = 2;
    } else if (option === 'star') {
        randomControls.style.display = 'none';
        edgeListControls.style.display = 'none';
        starfishControls.style.display = '';
        mode = 3;
    }
    updateGraph();
}

function forceCalc(nodes, canvasHeight, canvasWidth, r, a, g){
    
    nodes.forEach(node => {
        node.fx = 0;
        node.fy = 0;

        // Repulsion
        nodes.forEach(other => {
            if (node !== other) {
                let dx = node.x - other.x;
                let dy = node.y - other.y;
                let d = Math.sqrt(dx * dx + dy * dy);
                let f = r / d ** 2;
                node.fx += f * dx;
                node.fy += f * dy;
            }
        });

        // Attraction
        node.adj.forEach(other => {
            let dx = node.x - other.x;
            let dy = node.y - other.y;
            let d = Math.sqrt(dx * dx + dy * dy);
            let f = - a * d;
            node.fx += f * dx;
            node.fy += f * dy;
    
        });

        // Gravity
        node.fx += g * (canvas.width / 2 - node.x * canvasWidth);
        node.fy += g * (canvas.height / 2 - node.y * canvasHeight);
    });

}

function updateVel(nodes, stepSize, damping) {

    nodes.forEach(node => {
        node.vx = (node.vx + stepSize * node.fx) * damping;
        node.vy = (node.vy + stepSize * node.fy) * damping;
    });
}

function updatePos(nodes, stepSize) {

    nodes.forEach(node => {
        node.x += stepSize * node.vx;
        node.y += stepSize * node.vy;
    });
}

let animationId;
let graph;
let canvas;
let context;
let canvasWidth;
let canvasHeight;
let mode = 1;
let nodeColor;
let isPaused = false;

function togglePause() {
    isPaused = !isPaused;
    document.getElementById('pauseButton').textContent = isPaused ? 'Resume' : 'Pause';
}

function verifyEdgeList(edgeList) {

    if (edgeList === "") {
        return true;
    }

    const lines = edgeList.split('\n');
    for (let i = 0; i < lines.length; i++) {
        if(!/^[\w\s\d\-']+, [\w\s\d\-']+$/.test(lines[i])) {
            return false;
        }
    }
    return true;
}

function inBounds(event, min, max, int) {
    const input = event.target;
    if(input.value === "") {
        return;
    } else if (input.value < min) {
        input.value = min;
    } else if (input.value > max) {
        input.value = max;
    } else if (int) {
        input.value = Math.floor(input.value);
    }
}

function updateGraph() {

    cancelAnimationFrame(animationId);
    if (mode === 1) {
        const nodes = parseInt(document.getElementById("nodes").value);
        const density = parseFloat(document.getElementById("density").value);

        graph = new Graph();
        graph.addNodesAndEdges(nodes, density, nodeColor, 7);

    } else if (mode === 2) {
        const edgeList = document.getElementById("edges").value.trim();

        if(!verifyEdgeList(edgeList)) {
            alert("Please enter edges in the format 'Node1, Node2'.");
        }
        else {
            graph = new Graph();
            if (edgeList !== ""){
                graph.addEdgeList(edgeList, nodeColor, 7);
            }
        }
    } else if (mode === 3) {
        const arms = parseInt(document.getElementById("arms").value);
        const armsLength = parseInt(document.getElementById("arm_length").value);

        graph = new Graph();
        graph.starfish(arms, armsLength, nodeColor, 7);
    }
    
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    graph.plot(context, canvasWidth, canvasHeight);
    
    function animate() {
        if(!isPaused) {
            nodeColor = document.getElementById("colorPicker").value;
            let k1 = 10 ** document.getElementById("sliderR").value;
            if (k1 == 1) {
                k1 = 0;
            }
            let k2 = 10 ** document.getElementById("sliderA").value;
            if (k2 == 1) {
                k2 = 0;
            }
            let k3 = 10 ** document.getElementById("sliderG").value;
            if (k3 == 1) {
                k3 = 0;
            }
            let k4 = 1 - document.getElementById("sliderF").value;
            forceCalc(graph.nodes, canvasHeight, canvasWidth, k1, k2, k3);
            updateVel(graph.nodes, 0.0001, k4);
            updatePos(graph.nodes, 0.0001);
            graph.setNodeColor(nodeColor);
            context.clearRect(0, 0, canvasWidth, canvasHeight);
            graph.plot(context, canvasWidth, canvasHeight);
        }
        animationId = requestAnimationFrame(animate);
    }

    animate();
}

window.onload = function() {

    canvas = document.getElementById("graphCanvas");
    const boxSize = Math.min(window.innerHeight, window.innerWidth - 300) * 0.8;
    canvas.width = boxSize;
    canvas.height = boxSize;
    context = canvas.getContext("2d");
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;

    updateGraph();
}
