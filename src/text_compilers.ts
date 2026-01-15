import { Tree } from "../mod.ts";

class Node {
  key: string;
  types: string[] = [];
  children: { [name: string]: Node } = {};
  array: number = 0;
  constructor(key: string) {
    this.key = key;
  }
  has_child(name: string): boolean {
    return name in this.children;
  }
}

export function compile_path(path_arr: string[]) {
  function loop_top(iterator: string, object: string) {
    return `for (const ${iterator} of ${object}){\n`;
  }

  if (path_arr.length === 1) {
    return "\n\x1b[1;35mPath:\x1b[0m\n" + path_arr[0];
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

  return "\x1b[1;35mPath:\x1b[0m\n" + top + middle + bottom;
}

export function compile_err(err: string | null) {
  const red: string = "\x1b[31m";
  const reset: string = "\x1b[0m";
  if (!err) {
    err = "";
  } else {
    err = `${red} + ${err} + ${reset}`;
  }
  return err;
}

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

  const is_array: boolean = Array.isArray(tree);
  if (is_array) {
    node.array = node.array + 1;
    for (const item of tree) {
      tree_crawl(item, node);
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

function construct_tree(tree: Node, level: number) {
  let str: string = "";
  const indent: string = "  ".repeat(level);
  if (level === 0) {
    str = "type " + tree.key + " = ";
  } else {
    str = indent + tree.key + ": ";
  }
  if (tree.types.length !== 0) {
    for (const type of tree.types) {
      str = str + type + " | ";
    }
    str = str.slice(0, -3);
    str = str + ", ";
    return str;
  }

  str = str + "{\n";
  for (const leaf in tree.children) {
    str = str + construct_tree(tree.children[leaf], level + 1) + "\n";
  }
  str = str + indent + "},";
  return str;
}

export function compile_tree_types(tree: Tree) {
  // let str: string = "\n\x1b[1;35mStructure Type:\n \x1b[0m";
  // const path: string = compile_path(tree.path);
  // str = path + "\n" + str;

  let type_nodes: Node = new Node("object");
  type_nodes = tree_crawl(tree.object, type_nodes);

  const tree_str: string = construct_tree(type_nodes, 0);
  // str = str + tree_str;
  // str = str.slice(0, -1) + ";";
  // str = str + "\n Enter anything to exit:";
  return tree_str.slice(0, -1) + ";";
}

export function compile_tree(tree: Tree, err: string | null) {
  const path: string = compile_path(tree.path);
  const tree_hierarchy: string = Deno.inspect(tree.object, {
    depth: 2,
    colors: true,
  });
  err = compile_err(err);

  const start: string = "\n\n\x1b[1;35mTree:\n \x1b[0m";
  const text: string = path + start + tree_hierarchy + "\n" + err + "\n> ";
  return text;
}
