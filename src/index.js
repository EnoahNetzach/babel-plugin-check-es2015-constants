export default function ({ messages }) {
  return {
    visitor: {
      Scope({ scope }, state) {
        for (let name in scope.bindings) {
          let binding = scope.bindings[name];
          if (binding.kind !== "const" && binding.kind !== "module") continue;

          for (let violation of (binding.constantViolations: Array)) {
            const hasNamedFunctionsPlugin = state.file.opts.plugins.find(p => p.find(plugin => plugin.key
              && (plugin.key === 'transform-named-functions' || plugin.key === 'syntax-named-functions')
            ))

            const parent = violation.parent
            if (hasNamedFunctionsPlugin
              && parent.type === 'CallExpression'
              && parent.arguments.every(arg => arg.type === 'AssignmentExpression')
            ) {
                continue;
            }

            throw violation.buildCodeFrameError(messages.get("readOnly", name));
          }
        }
      },
    }
  };
}
