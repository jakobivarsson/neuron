import Set from "./crdts/set";
import Map from "./crdts/map";

const rootId = "__root__";

// Wrapper around a CRDT set that works as a registry of crdt objects.
//
// By default, it holds a root object which is a crdt map.
//
// Note: the store is not immutable
export default class Registry {
  constructor(root = new Map()) {
    // CRDT objects
    this.objects = new Set().add(rootId, root);
  }

  // Objects have to be added with a unique id
  add(id, obj) {
    this.objects = this.objects.add(id, obj);
  }

  update(id, obj) {
    if (!this.objects.get(id)) {
      return;
    }
    this.objects = this.objects.add(id, obj);
  }

  remove(id) {
    if (!this.objects.get(id)) {
      return;
    }
    this.objects = this.objects.remove(id);
  }

  get(id) {
    return this.objects.get(id);
  }

  root() {
    return this.objects.get(rootId);
  }

  rootId() {
    return rootId;
  }
}
