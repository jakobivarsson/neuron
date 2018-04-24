import Set from "./set";

// Special id for the start of the list
const startId = "__startId__";

// TODO add timestamp? Sorting by id now
const Edge = (fromId, toId) => ({
  fromId,
  toId
});

const flatten = list => list.reduce((acc, elem) => acc.concat(elem), []);
const ident = e => e;

// Ordered list based on the RGA CRDT.
// Consists of two CRDT Sets
export default class List {
  constructor(nodes = new Set(), edges = new Set()) {
    this.nodes = nodes;
    this.edges = edges;
  }

  // List of elements that follows id sorted by id.
  // TODO faster lookup, should be sorted by timestamp
  followers(id = startId) {
    return this.edges
      .values()
      .filter(({ fromId }) => fromId === id)
      .map(({ toId }) => toId)
      .sort()
      .reverse();
  }

  values() {
    // Recursively traverses the sequence and returns an ordered list of ids.
    const traverse = (id = startId) =>
      flatten(this.followers(id).map(id => [id].concat(traverse(id))));
    // Lookup value and remove undefined nodes (that have been removed)
    return traverse()
      .map(id => this.nodes.get(id))
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
  insert(afterId = startId, value, id) {
    if (afterId !== startId && !this.nodes.has(afterId)) {
      return;
    }
    const nodes = this.nodes.add(id, value);
    const edges = this.edges.add(id, Edge(afterId, id));
    return new List(nodes, edges);
  }

  remove(id) {
    return new List(this.nodes.remove(id), this.edges);
  }
}
