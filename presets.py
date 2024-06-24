from pprint import pprint

def fractal_generation(iterations, branches):
    
    graph = []
    nodes = sum([branches ** i for i in range(iterations - 1)])
    print(nodes)
    for root in range(nodes):
        for num in range(branches):
            graph.append([root, root * branches + num + 1])

    return graph

def flower_generation(petals, petal_size):

    graph = []
    node = 1
    for petal in range(petals):
        prev = 0
        while(node <= petal * petal_size + petal_size):
            graph.append([prev, node])
            prev = node
            node += 1
        graph.append([prev, 0])
    
    return graph

def string_generation(string):

    graph = []
    for i in range(string - 1):
        graph.append([i, i + 1])
    return graph

def starfish_generation(arms, arm_size):

    graph = []
    node = 1
    for arm in range(arms):
        prev = 0
        while(node <= arm * arm_size + arm_size):
            graph.append([prev, node])
            prev = node
            node += 1    
    return graph

def write_edges(graph):
    with open("graph.txt", "w") as f:
        for edge in graph:
            f.write(f"{edge[0]}, {edge[1]}\n")

if __name__ == "__main__":
    graph = fractal_generation(7, 2)
    write_edges(graph)
    pprint(graph)