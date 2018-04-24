# Neuron
From [wikipedia](https://en.wikipedia.org/wiki/Neuron):

> A neuron is an electrically excitable cell that receives, processes, and transmits information through electrical and chemical signals.

Neuron is a replicated real-time collaborative data store:

- Replicated: Data should automatically be synced across participants.
- Real-time: Synchronization should be efficient and fast, updates should be applied optimistically (optimistic replication)
- Collaborative: Concurrent edits should be merged and conflicts automatically handled
- Data store: Support basic data types such as Map, List, String, Number and Bool as well as embedding in Map and List
