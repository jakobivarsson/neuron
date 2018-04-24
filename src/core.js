import Registry from "./registry";
import Clock from "./clock";
import * as ops from "./ops";
import Map from "./crdts/map";
import Register from "./crdts/register";
import List from "./crdts/list";

const validateOp = (op, obj) => {
  let valid = false;
  switch (op) {
    case ops.SET:
      if (obj instanceof Register) {
        valid = true;
      }
      break;
    case ops.INSERT:
      if (obj instanceof List) {
        valid = true;
      }
      break;
    case ops.REMOVE:
      if (obj instanceof Map || obj instanceof List) {
        valid = true;
      }
      break;
    case ops.ADD:
      if (obj instanceof Map) {
        valid = true;
      }
      break;
  }
  if (!valid) {
    throw new Error(`Can not perform ${op} on ${typeof obj}`);
  }
};

const takesFieldParam = op => [ops.INSERT, ops.REMOVE, ops.ADD].includes(op);

const getParams = (op, field, obj) => {
  const params = {};
  switch (op) {
    case ops.INSERT:
      const indexBefore = Number(field) - 1;
      if (indexBefore < 0) {
        params.afterId = obj.startId();
      }
      params.afterId = obj.get(indexBefore);
      break;
    case ops.REMOVE:
      params.targetId = obj.get(field);
      break;
    case ops.ADD:
      params.field = field;
      break;
  }
  return params;
};

export default class Store {
  constructor(id, init = {}) {
    this.id = id;
    this.clock = new Clock(id);
    this.initialize(init);
  }

  // initialize traverse the state and creates corresponding crdts
  // Primarely used for testing since merging crdts are not supported yet
  initialize(state) {
    const create = (id, v) => {
      // Create new object
      let next;
      if (v instanceof Array) {
        next = new List();
        this.store.add(id, next);
        addList(next, id, v);
      } else if (v instanceof Object) {
        next = new Map();
        this.store.add(id, next);
        addObj(next, id, v);
      } else {
        next = new Register(v);
        this.store.add(id, next);
      }
      // Add new object to store
      // this.store.add(id, next);
    };
    // Recursively adds to store
    const addList = (cursor, cursorId, list) => {
      let afterId;
      list.forEach(element => {
        const id = this.clock.timestamp();
        this.clock.tick();
        create(id, element);
        cursor = cursor.insert(afterId, id, id);
        afterId = id;
      });
      this.store.update(cursorId, cursor);
    };
    const addObj = (cursor, cursorId, obj) => {
      Object.entries(obj).forEach(([k, v]) => {
        // Generate id for crdt
        const id = this.clock.timestamp();
        this.clock.tick();
        create(id, v);
        // Add the new object id to cursor
        cursor = cursor.add(k, id, id);
      });
      this.store.update(cursorId, cursor);
    };
    if (state instanceof Array) {
      this.store = new Registry(new List());
      addList(this.store.root(), this.store.rootId(), state);
    } else if (state instanceof Object) {
      this.store = new Registry(new Map());
      addObj(this.store.root(), this.store.rootId(), state);
    } else {
      this.store = new Registry(new Register(state));
    }
  }

  // serialize returns an plain JS representation of the store
  serialize() {
    const serialize = cursor => {
      if (cursor instanceof Map) {
        return cursor.entries().reduce((acc, [k, v]) => {
          cursor = this.store.get(v);
          acc[k] = serialize(cursor);
          return acc;
        }, {});
      } else if (cursor instanceof List) {
        return cursor.values().map(v => {
          cursor = this.store.get(v);
          return serialize(cursor);
        });
      } else if (cursor instanceof Register) {
        return cursor.get();
      }
    };
    return serialize(this.store.root());
  }

  // Returns the id of the object which corresponds to the path.
  lookup(path) {
    return path.reduce((cursor, part) => {
      if (!cursor) {
        return;
      }
      if (cursor instanceof Map || cursor instanceof List) {
        const nextId = cursor.get(part);
        return this.store.get(nextId);
      }
    }, this.store.root());
  }

  lookupId(path) {
    const last = path.pop();
    const cursor = this.lookup(path);
    if (last && cursor) {
      return cursor.get(last);
    } else if (cursor) {
      return this.store.rootId();
    }
  }

  // Generate operation.
  // Path is the path from object root to the object to be updated.
  // Op is the operation to apply on the object.
  // Value is the updated value.
  prepare(path, op, value) {
    // Path needs to contain at least one element
    if (path && path.length === 0) {
      throw new Error("Path should contain at least one element");
    }
    if (!op) {
      throw new Error("Prepare called without op");
    }
    let field;
    if (takesFieldParam(op)) {
      field = path.pop();
    }
    const objId = this.lookupId(path);
    if (!objId) {
      throw new Error("Path do not exist");
    }
    const obj = this.store.get(objId);

    // Operation specific params
    const params = getParams(op, field, obj);

    // Validate will throw if invalid
    validateOp(op, obj);

    // Update the clock
    this.clock.tick();
    const timestamp = this.clock.timestamp();
    return {
      type: op,
      value,
      objId,
      timestamp,
      ...params
    };
  }

  // Apply a generated operation
  apply(op) {
    let obj = this.store.get(op.objId);
    if (!obj) {
      return;
    }
    switch (op.type) {
      case ops.ADD:
        // Using timestamp as unique id.
        // TODO Map does not need to have value only k => id/timestamp
        obj = obj.add(op.field, op.timestamp, op.timestamp);
        this.store.update(op.objId, obj);
        this.store.add(op.timestamp, op.value);
        return;
      case ops.SET:
        obj = obj.update(op.value, op.timestamp);
        this.store.update(op.objId, obj);
        return;
      case ops.INSERT:
        obj = obj.insert(op.afterId, op.timestamp, op.timestamp);
        this.store.update(op.objId, obj);
        this.store.add(op.timestamp, op.value);
        return;
      case ops.REMOVE:
        obj = obj.remove(op.targetId);
        this.store.update(op.objId, obj);
        this.store.remove(op.targetId);
        return;
    }
  }

  // Composes prepare and apply
  update() {}
}
