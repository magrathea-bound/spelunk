export function compile_path(path_arr: string[]) {
  function loop_top(iterator: string, object: string) {
    return `for (const ${iterator} of ${object}){\n`;
  }

  if (path_arr.length === 1) {
    return path_arr[0];
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

  return top + middle + bottom;
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
