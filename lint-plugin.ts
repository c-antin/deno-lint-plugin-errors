export default {
  name: "lint-plugin",
  rules: {
    "rule": {
      create(context) {
        return {
          ExportAllDeclaration(node) {
            //done: exported and source are swapped
            const source = node.source;
            const exported = node.exported;
            if (exported?.type === "Identifier") {
              context.report({
                node,
                message:
                  `Exported \`${exported.name}\` and source \`${source.value}\` are swapped`,
              });
            }
          },
          "ClassBody > PropertyDefinition"(node) {
            //done: parent child relation is not working, maybe it should be "ClassBody.body > PropertyDefinition"?
            context.report({ node, message: "this should fire!" });
          },
          PropertyDefinition(node) {
            if (node.key.type === "PrivateIdentifier") {
              //done: PrivateIdentifier is missing from the type definition
              context.report({ node, message: node.key.type });
            }
          },
          ObjectPattern(node) {
            for (const prop of node.properties) {
              switch (prop.type) {
                case "Property": {
                  const key = prop.key;
                  const value = prop.value;
                  if (value === null) { //todo: value can be null
                    context.report({ node, message: "value null" });
                  } else {
                    switch (value.type) {
                      case "Identifier":
                        //todo: see test: "ObjectPattern Property value should be key"
                        if (
                          JSON.stringify(key.range) ===
                            JSON.stringify(value.range)
                        ) {
                          context.report({
                            node,
                            message: "value is same as key",
                          });
                        }
                        break;
                      case "AssignmentPattern":
                        if (value.left.type === "Identifier") {
                          context.report({
                            node,
                            message: "AssignmentPattern",
                          });
                        }
                        break;
                      case "Literal":
                        //todo: should be assignment pattern, see test "ObjectPattern Property value assignment"
                        if (key.type === "Identifier") {
                          context.report({
                            node,
                            message: "not AssignmentPattern",
                          });
                        }
                        break;
                    }
                  }
                }
              }
            }
          },
        };
      },
    },
  },
} satisfies Deno.lint.Plugin;
