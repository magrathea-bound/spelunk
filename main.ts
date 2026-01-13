import { systemState } from "./testing/object_example.ts";
import { update_screen, read_input } from "./src/spelunk_io.ts";
import { compile_path } from "./src/compilers.ts";

export type Tree = {
  object: any;
  path: string[];
};

type RecursionGlobals = {
  quit: boolean;
  lines: number;
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

async function crawl(tree: Tree, info: RecursionGlobals, input: string) {
  if (!(info.lines === 0)) {
    handle_path(tree, input);
  }
  let err: string | null = null;

  while (true) {
    info.lines = update_screen(tree, info.lines, err);

    try {
      const input: string = await read_input();
      switch (input) {
        case "q":
          info.quit = true;
          return info;

        case "-":
          return info;

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
  console.log("Welcome... Dear customer");
  console.log(
    "Type the key or element of where you want to go,\n  - to go up the tree and q to quit\n",
  );
  const tree: Tree = { object: object, path: ["object"] };
  await crawl(tree, { quit: false, lines: 0 }, "");
}

await spelunk(systemState);
