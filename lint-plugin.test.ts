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

Deno.test("PropertyDefinition PrivateIdentifier", () => {
  const diagnostics = Deno.lint.runPlugin(
    plugin,
    "main.tsx",
    "class Test { #private_prop = 1 }",
  );

  assertEquals(diagnostics.length, 1);
  {
    const d = diagnostics[0];
    assertEquals(d.id, ID);
    assertEquals(d.message, "PrivateIdentifier");
  }
});

Deno.test("ObjectPattern Property value null", () => {
  const diagnostics = Deno.lint.runPlugin(
    plugin,
    "main.tsx",
    "const { prop } = {}",
  );

  assertEquals(diagnostics.length, 1);
  {
    const d = diagnostics[0];
    assertEquals(d.id, ID);
    assertEquals(d.message, "value null");
  }
});

Deno.test("ObjectPattern Property value assignment", () => {
  const diagnostics = Deno.lint.runPlugin(
    plugin,
    "main.tsx",
    "const { prop = 1 } = {}, { prop: alias = 1 } = {}",
  );

  assertEquals(diagnostics.length, 2);
  {
    const d = diagnostics[0];
    assertEquals(d.id, ID);
    assertEquals(d.message, "AssignmentPattern");
  }
  {
    const d = diagnostics[1];
    assertEquals(d.id, ID);
    assertEquals(d.message, "AssignmentPattern");
  }
});

Deno.test("ObjectPattern Property value should be key", () => {
  const diagnostics = Deno.lint.runPlugin(
    plugin,
    "main.tsx",
    "function test({ param }) { }",
  );

  assertEquals(diagnostics.length, 1);
  {
    const d = diagnostics[0];
    assertEquals(d.id, ID);
    assertEquals(d.message, "value is same as key");
  }
});
