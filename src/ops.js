// Definition of available operations

// Update a Register
// SET [path-to-register] value
// SET objectId value timestamp
export const SET = "SET";

// Insert in a list
// INSERT [path to insert-at index] element
export const INSERT = "INSERT";

// Move element to position in list
// INPUT: MOVE [path to current index] move-to-index
// OUTPUT: MOVE afterId elementId
export const MOVE = "MOVE";

// Remove from container (list or map)
export const REMOVE = "REMOVE";

// Add new crdt to map
export const ADD = "ADD";
