export default {
  name: "lint-plugin",
  rules: {
    "rule": {
      create(context) {
        return {
          ExportAllDeclaration(node) {
            //todo: exported and source are swapped
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
            //todo: parent child relation is not working, maybe it should be "ClassBody.body > PropertyDefinition"?
            context.report({ node, message: "this should fire!" });
          },
          PropertyDefinition(node) {
            if (node.key.type !== "Identifier") {
              //todo: PrivateIdentifier is missing from the type definition
              context.report({ node, message: node.key.type });
            }
          },
        };
      },
    },
  },
} satisfies Deno.lint.Plugin;
