/* @flow */

import Deque from 'double-ended-queue';

import type {NodePath} from 'babel-traverse';

type Node = {
  type: string;
};

type CollectionDict = {
  [name: string]: Collection;
};

type VertexDict = {
  [name: string]: Vertex
};

const nodeVertices: WeakMap<Node, Vertex> = new WeakMap();

export default class Graph {
  collection: Collection;

  constructor () {
    this.collection = new Collection('');
  }

  get (...keys: string[]): ? Vertex {
    let subject = this.collection;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (i < keys.length - 1) {
        subject = subject.collections[key];
        if (!subject) {
          return;
        }
      }
      else {
        return subject.definitions[key];
      }
    }
  }

  getVertex (path: NodePath): Vertex {
    const existing = nodeVertices.get(path.node);
    if (existing) {
      return existing;
    }
    else if (path.isDeclareModuleExports()) {
      const vertex = new Vertex('module.exports', path);
      nodeVertices.set(path.node, vertex);
      return vertex;
    }
    else {
      const id = path.isIdentifier() || path.isTypeParameter() ? path : path.get('id');
      const name = id.node.name ? id.node.name : id.node.value;
      const vertex = new Vertex(name, path);
      nodeVertices.set(path.node, vertex);
      return vertex;
    }
  }

  ref (...keys: string[]): Vertex {
    let subject = this.collection;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (i < keys.length - 1) {
        subject = subject.collections[key];
        if (!subject) {
          const collection = new Collection(key);
          subject.collections[key] = collection;
          subject = collection;
        }
      }
      else if (subject.definitions[key]) {
        return subject.definitions[key];
      }
      else {
        const vertex = new Vertex(key);
        subject.definitions[key] = vertex;
        return vertex;
      }
    }
    throw new Error('Not enough keys to create a reference.');
  }

  *traverse (...keys: Array<string | string[]>): Generator<Vertex, void, void> {
    const visited = new Set();
    const queue = new Deque(1000);
    for (const key of keys) {
      const item = this.get(...([].concat(key)));
      if (item) {
        queue.push(item)
      }
    }


    let current;

    while ((current = queue.shift())) {
      if (visited.has(current)) {
        continue;
      }
      visited.add(current);
      if (!current.path || current.path.type !== 'TypeParameter') {
        yield current;
      }
      if (current.out.length > 0) {
        for (const edge of current.out) {
          if (!visited.has(edge.to)) {
            queue.push(edge.to);
          }
        }
      }
    }
  }

}

export class Collection {
  name: string;
  vertex: ? Vertex;
  definitions: VertexDict = {};
  collections: CollectionDict = {};

  constructor (name: string, vertex?: Vertex) {
    this.name = name;
    this.vertex = vertex;
  }

  register (path: NodePath): Vertex {
    const collectionVertex = this.vertex;
    if (collectionVertex && path.isDeclareModuleExports()) {
      const name = 'module.exports';
      const vertex = new Vertex(name, path);
      collectionVertex.createEdge(vertex);
      nodeVertices.set(path.node, vertex);
      // redirect subsequent lookups to the module itself, not to
      // the export.
      this.definitions[name] = collectionVertex;
      return vertex;
    }
    else {
      const id = path.isIdentifier() ? path : path.get('id');
      const name = id.isIdentifier() ? id.node.name : id.node.value;
      const existing = this.definitions[name];
      if (existing) {
        existing.path = path;
        if (collectionVertex) {
          collectionVertex.createEdge(existing);
        }
        nodeVertices.set(path.node, existing);
        return existing;
      }
      else {
        const vertex = new Vertex(name, path);
        if (collectionVertex) {
          collectionVertex.createEdge(vertex);
        }
        nodeVertices.set(path.node, vertex);
        this.definitions[name] = vertex;
        return vertex;
      }
    }
  }

  registerCollection (path: NodePath): Collection {
    const id = path.get('id');
    const name = id.isIdentifier() ? id.node.name : id.node.value;
    const existing = this.collections[name];
    if (existing) {
      existing.path = path;
      nodeVertices.set(path.node, existing);
      return existing;
    }
    else {
      const vertex = new Vertex(name, path);
      const collection = new Collection(name, vertex);
      nodeVertices.set(path.node, vertex);
      this.collections[name] = collection;
      return collection;
    }
  }
}

export class Vertex {
  name: string;
  path: ? NodePath;
  in: Edge[] = [];
  out: Edge[] = [];

  constructor (name: string, path?: NodePath) {
    this.name = name;
    this.path = path;
  }

  createEdge (vertex: Vertex): Edge {
    const edge = new Edge();
    edge.from = this;
    edge.to = vertex;
    this.out.push(edge);
    vertex.in.push(edge);
    return edge;
  }

  // @flowIssue 252
  *[Symbol.iterator] () {
    const visited = new Set();

  }
}

export class Edge {
  from: Vertex;
  to: Vertex;
  count: number = 0;
}