import {
  update_screen,
  read_input,
  copyToClipboard,
  can_run,
} from "./src/spelunk_io.ts";
import {
  compile_path,
  compile_tree,
  compile_type_tree,
} from "./src/text_compilers.ts";

export type Tree = {
  object: any;
  path: string[];
};

type RecursionGlobals = {
  quit: boolean;
  lines: number;
  object_layers: number;
};

function handle_object(tree: Tree, input: string) {
  if (!(input in tree.object)) {
    throw new Error(`${input} key doesn't exist`);
  }
  const latest_path: number = tree.path.length - 1;
  tree.path[latest_path] = tree.path[latest_path] + `["${input}"]`;
  tree.object = tree.object[input];
  return tree;
}

function validate_array(arr_len: number, input: string) {
  let looping: boolean;
  if (input[0] === "*") {
    input = input.slice(1);
    looping = true;
  } else {
    looping = false;
  }

  const numberable: boolean = /^\d+$/.test(input) || input === "";
  if (numberable) {
    if (Number(input) > arr_len) {
      throw new Error("Element exceeds array length");
    }
    return looping;
  }

  throw new Error(
    "Incorrectly formatted array specifier\n \
    Type a number to select that element or use *(#) to indicate looping,\n\
    (#) is an optional element number to dive into, otherwise spelunk will default to element 0",
  );
}

function handle_array(tree: Tree, input: string) {
  const arr_len = tree.object.length;
  const looping: boolean = validate_array(arr_len, input);

  if (looping) {
    const len: number = tree.path.length;
    const iterator: string = "i" + String(len - 1);
    tree.path.push(iterator);
    const next_element: string = input.slice(1);
    tree.object = tree.object[Number(next_element)];
  } else {
    const last_path: number = tree.path.length - 1;
    tree.path[last_path] = tree.path[last_path] + `[${input}]`;
    tree.object = tree.object[Number(input)];
  }
  return tree;
}

function handle_path(tree: Tree, input: string) {
  const bottom_out_err: string =
    "Moria... You fear to go into those mines.\n\
      The dwarves delved too greedily and too deep.\n\
      You know what they awoke in the darkness of Khazad-dum... shadow and flame.";
  if (input === "\\\\") {
    input = input.slice(1);
  } else if (input[0] === "\\") {
    input = input.slice(1);
  }

  if (tree === null) {
    throw new Error(bottom_out_err);
  } else if (Array.isArray(tree.object)) {
    handle_array(tree, input);
  } else if (typeof tree.object === "object") {
    handle_object(tree, input);
  } else {
    throw new Error(bottom_out_err);
  }
}

function inspect_layers(input: string) {}

async function crawl(tree: Tree, info: RecursionGlobals, input: string) {
  if (!(info.lines === 0)) {
    handle_path(tree, input);
  }
  let err: string | null = null;

  while (true) {
    const tree_string: string = compile_tree(tree, err, info.object_layers);
    info.lines = update_screen(tree_string, info.lines);

    try {
      const input: string = await read_input();
      if (/^#\d+$/.test(input)) {
        const layers: string = input.slice(1);
        info.object_layers = Number(layers);
        continue;
      }
      switch (input) {
        case "q":
          info.quit = true;
          return info;

        case "-":
          return info;

        case "#":
          return info;

        case "p": {
          const path: string = compile_path(tree.path, true);
          // if (!(await can_run())) {
          //   info.lines = info.lines + 1;
          // }
          copyToClipboard(path);
          break;
        }

        case "t": {
          const text: string = compile_type_tree(tree);
          // if (!(await can_run())) {
          //   info.lines = info.lines + 1;
          // }
          copyToClipboard(text);
          break;
        }

        default: {
          const new_tree: Tree = structuredClone(tree);
          info = await crawl(new_tree, info, input);
          err = null;
          break;
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        err = error.message;
      }
    }

    if (info.quit) {
      return info;
    }
  }
}

export default async function spelunk(object: any) {
  console.log(
    "Type the key or element of where you want to go,\n  - to go up the tree and q to quit",
  );
  const tree: Tree = { object: object, path: ["object"] };
  await crawl(tree, { quit: false, lines: 0, object_layers: 2 }, "");
}
