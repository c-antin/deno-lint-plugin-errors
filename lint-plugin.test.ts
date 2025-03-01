import { assertEquals } from "jsr:@std/assert";
import plugin from "./lint-plugin.ts";

const ID = "lint-plugin/rule";

Deno.test("ExportAllDeclaration: exported and source swapped", () => {
  const diagnostics = Deno.lint.runPlugin(
    plugin,
    "main.tsx",
    'export * as exported from "./source.ts"',
  );

  assertEquals(diagnostics.length, 1);
  {
    const d = diagnostics[0];
    assertEquals(d.id, ID);
    assertEquals(
      d.message,
      "Exported `exported` and source `./source.ts` are swapped",
    );
  }
});

Deno.test("parent > child", () => {
  const diagnostics = Deno.lint.runPlugin(
    plugin,
    "main.tsx",
    "class Test { prop = 1 }",
  );

  assertEquals(diagnostics.length, 1);
  {
    const d = diagnostics[0];
    assertEquals(d.id, ID);
    assertEquals(d.message, "this should fire!");
  }
});
