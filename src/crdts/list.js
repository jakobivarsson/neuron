import Set from "./set";

// Special id for the start of the list
const startId = "__startId__";

const Edge = (fromId, toId, timestamp) => ({
  fromId,
  toId,
  timestamp
});

const flatten = list => list.reduce((acc, elem) => acc.concat(elem), []);
const ident = e => e;

// Ordered list based on the RGA CRDT.
// Consists of two CRDT Sets
// Edges are keyed by timestamp which must be unique, the edge with the greates timestamp will be used as the current position of the node
// Nodes are keyed by id
export default class List {
  constructor(nodes = new Set(), edges = new Set()) {
    this.nodes = nodes;
    this.edges = edges;
  }

  // getValidEdges returns map from toId to edgeId (timestamp)
  // where the edgeId is the maximum timestamp for each toId
  // which signifies the actual position of the element
  getValidEdges() {
    return this.edges.values().reduce((acc, edge) => {
      if (!acc[edge.toId] || edge.timestamp > acc[edge.toId]) {
        acc[edge.toId] = edge.timestamp;
      }
      return acc;
    }, {});
  }

  // List of elements that follows id sorted by id.
  // TODO faster lookup, should be sorted by timestamp
  followers(id = startId) {
    return this.edges
      .values()
      .filter(({ fromId }) => fromId === id)
      .sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1));
  }

  values() {
    const validEdges = this.getValidEdges();
    // Recursively traverses the sequence and returns an ordered list of ids.
    const traverse = (id = startId) =>
      flatten(
        this.followers(id).map(edge => [edge].concat(traverse(edge.toId)))
      );
    // Lookup value and remove undefined nodes (that have been removed)
    return traverse()
      .filter(edge => validEdges[edge.toId] === edge.timestamp)
      .map(edge => this.nodes.get(edge.toId))
      .filter(ident);
  }

  startId() {
    return startId;
  }

  get(index) {
    // TODO improve
    return this.values()[index];
  }

  // Inserts the value after the element with id=afterId.
  // If afterId is undefined then the element will be placed at the start.
  // Id is used as timestamp
  insert(afterId = startId, value, id) {
    const nodes = this.nodes.add(id, value);
    const edges = this.edges.add(id, Edge(afterId, id, id));
    return new List(nodes, edges);
  }

  move(afterId = startId, id, timestamp) {
    const edges = this.edges.add(timestamp, Edge(afterId, id, timestamp));
    return new List(this.nodes, edges);
  }

  remove(id) {
    return new List(this.nodes.remove(id), this.edges);
  }
}
