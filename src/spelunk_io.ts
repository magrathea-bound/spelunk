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

export function update_screen(text: string, lines: number) {
  clearOwnOutput(lines);
  lines = text.split("\n").length;
  Deno.stdout.writeSync(encoder.encode(text));
  return lines;
}

export async function copyToClipboard(text: string) {
  let commandArgs: { cmd: string; args?: string[] };

  switch (Deno.build.os) {
    case "darwin":
      commandArgs = { cmd: "pbcopy" };
      break;
    case "windows":
      commandArgs = {
        cmd: "powershell.exe",
        args: ["-Command", "Set-Clipboard", "-Value", text],
      };
      break;
    case "linux":
      commandArgs = { cmd: "wl-copy" };
      break;
    default:
      throw new Error(`Unsupported OS: ${Deno.build.os}`);
  }

  const command = new Deno.Command(commandArgs.cmd, {
    args: commandArgs.args || [],
    stdin: "piped",
  });

  const child = command.spawn();

  if (Deno.build.os !== "windows") {
    const writer = child.stdin.getWriter();
    await writer.write(new TextEncoder().encode(text));
    await writer.close();
  }

  const status = await child.status;
  if (!status.success) {
    throw new Error(`Clipboard command failed on ${Deno.build.os}`);
  }
}

export async function can_run() {
  const status = await Deno.permissions.query({ name: "run" });
  return status.state === "granted";
}
