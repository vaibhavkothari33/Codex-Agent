// Minimal LangGraph state to track messages across steps
import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";

// We build a simple graph that appends messages; this allows future branching
// and gives us a LangGraph-based state holder for this agent.

function buildGraph() {
  const graph = new StateGraph(MessagesAnnotation)
    .addNode("ingest_user", async (state) => state)
    .addNode("assistant_step", async (state) => state)
    .addNode("tool_observe", async (state) => state)
    .addEdge("ingest_user", "assistant_step")
    .addEdge("assistant_step", "tool_observe")
    .addEdge("tool_observe", "assistant_step");

  graph.setEntryPoint("ingest_user");
  return graph.compile();
}

let compiled;
export function getCompiledGraph() {
  if (!compiled) compiled = buildGraph();
  return compiled;
}


