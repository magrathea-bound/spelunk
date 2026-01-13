import { Tree } from "../main.ts";
import { compile_path, compile_err } from "./compilers.ts";

export async function read_input() {
  let input: string;
  while (true) {
    const buffer: Uint8Array = new Uint8Array(1024);
    const n: number | null = await Deno.stdin.read(buffer);
    if (n === null || n === 1) {
      throw new Error("No input given");
    } else {
      //Is this necessary? Doesn't catch enter in the input...
      input = new TextDecoder().decode(buffer.subarray(0, n)).trim();
      const no_input: boolean = input === "\n" || input === "\r\n";
      if (no_input) {
        throw new Error("No input given");
      }
      return input;
    }
  }
}

const encoder = new TextEncoder();

function clearOwnOutput(lines: number) {
  for (let i = 0; i < lines; i++) {
    Deno.stdout.writeSync(encoder.encode("\x1b[1A\x1b[2K"));
  }
}

export function update_screen(tree: Tree, lines: number, err: string | null) {
  clearOwnOutput(lines);

  const path: string = compile_path(tree.path);
  const tree_hierarchy: string = Deno.inspect(tree.object, {
    depth: 2,
    colors: true,
  });
  err = compile_err(err);

  const text: string =
    path + "\n\n Object: " + tree_hierarchy + "\n" + err + "\n> ";
  lines = text.split("\n").length;
  Deno.stdout.writeSync(encoder.encode(text));

  return lines;
}
