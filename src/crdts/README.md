# CRDTs
Implementation of basic CRDT types.

All data types expose an immutable API.
The data types require an causal order of operations to be CRDTs.

Available types:

- Map
- Set (OR-Set)
- List (RGA)
- Register (LWW)
