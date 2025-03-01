export default {
  name: "lint-plugin",
  rules: {
    "rule": {
      create(context) {
        return {
          ExportAllDeclaration(node) {
            // exported and source are swapped
            const source = node.exported as unknown as Deno.lint.StringLiteral;
            const exported = node.source as unknown as
              | Deno.lint.Identifier
              | null;
            if (exported?.type === "Identifier") {
              context.report({
                node,
                message:
                  `Exported \`${exported.name}\` and source \`${source.value}\` are swapped`,
              });
            }
          },
          "ClassBody > PropertyDefinition"(node) {
            context.report({ node, message: "this should fire!" });
          },
        };
      },
    },
  },
} satisfies Deno.lint.Plugin;
