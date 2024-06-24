let animationId;
let canvas;
let context;
let mode = "random";
let isPaused = false;

class Node {
    constructor(name, color="red", radius=7,
        x=Math.random(), y=Math.random(),
        vx=0, vy=0, fx=0, fy=0) {
        
        this.name = name;
        this.adj = [];
        this.degree = 0;
        this.color = color;
        this.radius = radius;
        this.x = x;
        this.y = y;
        this.cx = x * canvas.width;
        this.cy = canvas.height - y * canvas.height;
        this.vx = vx;
        this.vy = vy;
        this.fx = fx;
        this.fy = fy;
    }
}

class Edge {
    constructor(node1, node2, color="black", width=1) {
        this.node1 = node1;
        this.node2 = node2;
        this.color = color;
        this.width = width;
    }
}

class Graph {
    constructor() {
        this.nodes = [];
        this.edges = [];
    }

    addNode(node){
        this.nodes.push(node);
    }

    setNodeColor(color) {
        this.nodes.forEach(node => {
            node.color = color;
        });
    }

    getNodes() {
        return this.nodes;
    }

    addEdge(edge){
        this.edges.push(edge);
        edge.node1.adj.push(edge.node2);
        edge.node1.degree += 1;
        edge.node2.adj.push(edge.node1);
        edge.node2.degree += 1;
    }

    getEdges() {
        return this.edges;
    }

    generateRandom(n, density, color="red", radius=7) {
        for(let i = 0; i < n; i++){
            this.addNode(new Node("Node " + i.toString(), color=color, radius=radius));
        }
        let numEdges = Math.floor(density * n * (n - 1) / 2);
        for(let i = 0; i < numEdges; i++){
            let node1 = this.nodes[Math.floor(Math.random() * n)];
            let node2 = this.nodes[Math.floor(Math.random() * n)];
            if (node1 !== node2 && !node1.adj.includes(node2)) {
                this.addEdge(new Edge(node1, node2));
            } else {
                i--; 
            }
        }
    }

    plotGraph() {
        context.beginPath();
        context.strokeStyle = "black";
        context.lineWidth = 0.5;

        this.edges.forEach(edge => {

            context.moveTo(edge.node1.cx, edge.node1.cy);
            context.lineTo(edge.node2.cx, edge.node2.cy);
        });
        context.stroke();
        context.strokeStyle = "black";
        context.lineWidth = 2;
        this.nodes.forEach(node => {
            context.beginPath();
            context.fillStyle = node.color;
            context.arc(node.cx, node.cy, node.radius, 0, 2 * Math.PI);
            context.fill();
            context.stroke();
        });
    }
}

updateForce = function(nodes, r, a, g) {
    nodes.forEach(node => {
        node.fx = 0;
        node.fy = 0;

        // Repulsion
        nodes.forEach(other => {
            if (node !== other) {
                let dx = node.x - other.x;
                let dy = node.y - other.y;
                let d = Math.sqrt(dx * dx + dy * dy);
                let f = r / d;
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
        node.fx += g * (canvas.width / 2 - node.cx);
        node.fy += g * (canvas.height / 2 - node.cy);
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

function togglePause() {
    isPaused = !isPaused;
    document.getElementById('pauseButton').textContent = isPaused ? 'Resume' : 'Pause';
}

function updateGraph() {

    cancelAnimationFrame(animationId);
    if (mode === "random") {
        const nodes = parseInt(document.getElementById("nodes").value);
        const density = parseFloat(document.getElementById("density").value);

        graph = new Graph();
        graph.generateRandom(nodes, density);

    } else if (mode === "edge") {
        const edgeList = document.getElementById("edges").value.trim();

        if(!verifyEdgeList(edgeList)) {
            alert("Please enter edges in the format 'Node1, Node2'.");
        }
        else {
            graph = new Graph();
            if (edgeList !== ""){
                alert("Add function");
                graph.addEdgeList(edgeList, nodeColor, 7);
            }
        }
    } else if (mode === "star") {
        const arms = parseInt(document.getElementById("arms").value);
        const armsLength = parseInt(document.getElementById("arm_length").value);

        graph = new Graph();
        graph.generateRandom(nodes, density, nodeColor, 4);
    }

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
            updateForce(graph.nodes, k1, k2, k3);
            updateVel(graph.nodes, 0.0001, k4);
            updatePos(graph.nodes, 0.0001);
            console.log(graph.nodes[0].fx, graph.nodes[0].fy)
            graph.setNodeColor(nodeColor);
            context.clearRect(0, 0, canvas.width, canvas.height);
            graph.plotGraph();
        }
        // animationId = requestAnimationFrame(animate);
    }

    animate();
}

window.onload = function() {

    canvas = document.getElementById("graphCanvas");
    const boxSize = Math.min(window.innerHeight, window.innerWidth - 300) * 0.9;
    canvas.width = boxSize;
    canvas.height = boxSize;
    context = canvas.getContext("2d");
    
    updateGraph();
}