import Set from "./set";
import Clock from "../clock";
import { add, remove } from "../immutable";

// Special id for the start of the list
const startId = "__startId__";

const Edge = (fromId, toId, timestamp) => ({
  fromId,
  toId,
  timestamp
});

// Ordered list based on the RGA CRDT.
// Consists of two CRDT Sets
// Edges are keyed by timestamp which must be unique, the edge with the greates timestamp will be used as the current position of the node
// Nodes are keyed by id
export default class List {
  constructor(nodes = new Set(), edges = {}, validEdges = {}) {
    this.nodes = nodes;
    this.edges = edges;
    this.validEdges = validEdges;
  }

  getEdges() {
    if (this.cache) {
      return this.cache;
    }
    const isValid = edge =>
      this.validEdges[edge.toId] === edge.timestamp &&
      this.nodes.get(edge.toId);
    // Perform DFS on the adjacency list starting at startId
    // Lookup value and remove undefined nodes (that have been removed)
    const traverse = (id = startId) => {
      if (!this.edges[id]) {
        return [];
      }
      return this.edges[id].reduce((acc, edge) => {
        if (isValid(edge)) {
          acc.push(edge);
        }
        traverse(edge.timestamp).forEach(edge => {
          acc.push(edge);
        });
        return acc;
      }, []);
    };
    const edges = traverse();
    this.cache = edges;
    return edges;
  }

  values() {
    return this.getEdges().map(edge => this.nodes.get(edge.toId));
  }

  startId() {
    return startId;
  }

  get(index) {
    return this.getEdges()[index].toId;
  }

  getEdgeId(index) {
    // Use timestamp as id as it is unique
    // and edges are keyed by timestamp
    return this.getEdges()[index].timestamp;
  }

  insertEdge(afterId, id, timestamp) {
    const edge = Edge(afterId, id, timestamp);
    const edges = this.edges[afterId];
    if (!edges) {
      return add(this.edges, afterId, [edge]);
    }
    const index = edges.findIndex(e => Clock.lt(e.timestamp, timestamp));
    const newEdges = [...edges];
    if (index < 0) {
      newEdges.push(edge);
    } else {
      newEdges.splice(index, 0, edge);
    }
    return add(this.edges, afterId, newEdges);
  }

  updateValidEdges(id, timestamp) {
    if (!this.validEdges[id] || Clock.lt(this.validEdges[id], timestamp)) {
      return add(this.validEdges, id, timestamp);
    }
    return this.validEdges;
  }

  // Inserts the value after the element with id=afterId.
  // If afterId is undefined then the element will be placed at the start.
  // Id is used as timestamp
  insert(afterId = startId, value, id) {
    const nodes = this.nodes.add(id, value);
    const edges = this.insertEdge(afterId, id, id);
    const validEdges = this.updateValidEdges(id, id);
    return new List(nodes, edges, validEdges);
  }

  move(afterId = startId, id, timestamp) {
    const edges = this.insertEdge(afterId, id, timestamp);
    const validEdges = this.updateValidEdges(id, timestamp);
    return new List(this.nodes, edges, validEdges);
  }

  remove(id) {
    const validEdges = remove(this.validEdges, id);
    return new List(this.nodes.remove(id), this.edges, validEdges);
  }
}
