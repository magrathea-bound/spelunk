import { Tree } from "../mod.ts";

class Node {
  key: string;
  types: string[] = [];
  children: { [name: string]: Node } = {};
  array: Node | null = null;
  constructor(key: string) {
    this.key = key;
  }
  has_child(name: string): boolean {
    return name in this.children;
  }
}

//////////////////////UI cats

export function compile_path(path_arr: string[], copy: boolean = false) {
  function loop_top(iterator: string, object: string) {
    return `for (const ${iterator} of ${object}){\n`;
  }

  let header: string;
  if (copy) {
    header = "";
  } else {
    header = "\n\x1b[1;35mPath:\x1b[0m\n";
  }

  if (path_arr.length === 1) {
    return header + path_arr[0];
  }

  const loop_qnt: number = path_arr.length;
  let top: string = "";
  let bottom: string = "";
  for (let i = 0; i < loop_qnt - 1; i++) {
    const indent: string = "  ";
    const iterator: string = "i" + String(i);
    top = top + indent.repeat(i) + loop_top(iterator, path_arr[i]);
    bottom = indent.repeat(i) + "}\n" + bottom;
  }

  const middle: string =
    "  ".repeat(loop_qnt - 1) + path_arr[loop_qnt - 1] + "\n";

  return header + top + middle + bottom;
}

export function cat_err(err: string | null) {
  const red: string = "\x1b[31m";
  const reset: string = "\x1b[0m";
  if (!err) {
    err = "";
  } else {
    err = `${red} + ${err} + ${reset}`;
  }
  return err;
}

export function compile_tree(tree: Tree, err: string | null, layers: number) {
  const path: string = compile_path(tree.path);
  const tree_hierarchy: string = Deno.inspect(tree.object, {
    depth: layers,
    colors: true,
  });
  err = cat_err(err);

  const start: string = "\n\n\x1b[1;35mTree:\n \x1b[0m";
  const text: string = path + start + tree_hierarchy + "\n" + err + "\n> ";
  return text;
}

//////////Type cats

function handle_type(node: Node, node_type: string) {
  if (!node.types.includes(node_type)) {
    node.types.push(node_type);
  }
  return node;
}

function tree_crawl(tree: any, node: Node) {
  const node_type: string = typeof tree;
  if (tree === null) {
    return handle_type(node, "null");
  }

  if (Array.isArray(tree)) {
    if (node.array === null) {
      node.array = new Node("arr");
    }
    for (const item of tree) {
      node.array = tree_crawl(item, node.array);
    }

    return node;
  }

  if (node_type === "object") {
    for (const key in tree) {
      if (node.has_child(key)) {
        node.children[key] = tree_crawl(tree[key], node.children[key]);
      } else {
        const child_node: Node = new Node(key);
        node.children[key] = child_node;
        const new_tree: any = tree[key];
        node.children[key] = tree_crawl(new_tree, child_node);
      }
    }
    return node;
  }
  return handle_type(node, node_type);
}

function construct_tree(tree: Node, level: number, array: boolean) {
  let str: string = "";
  const indent: string = "  ".repeat(level);
  if (level === 0) {
    str = "type " + tree.key + " = ";
  } else if (array === false) {
    str = indent + tree.key + ": ";
  }

  if (tree.types.length !== 0) {
    for (const type of tree.types) {
      str = str + type + " | ";
    }
  }

  if (Object.keys(tree.children).length !== 0) {
    str = str + "{\n";
    for (const leaf in tree.children) {
      str = str + construct_tree(tree.children[leaf], level + 1, false) + "\n";
    }
    str = str + indent + "} | ";
  }

  if (tree.array !== null) {
    str = str + construct_tree(tree.array, level, true) + "[];";
  } else if (array) {
    str = str.slice(0, -3);
  } else {
    str = str.slice(0, -3) + ";";
  }

  if (array) {
    let types: number = tree.types.length;
    if (Object.keys(tree.children).length > 0) {
      types = types + 1;
    }
    if (types > 1) {
      str = `(${str})`;
    }
  }

  return str;
}

export function compile_type_tree(tree: Tree) {
  let type_nodes: Node = new Node("object");
  type_nodes = tree_crawl(tree.object, type_nodes);

  let is_array: boolean;
  type_nodes.array === null ? (is_array = true) : (is_array = false);
  const tree_str: string = construct_tree(type_nodes, 0, is_array);
  return tree_str.slice(0, -1) + "};";
}
