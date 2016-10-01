"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var messages = _ref.messages;

  return {
    visitor: {
      Scope: function Scope(_ref2, state) {
        var scope = _ref2.scope;

        for (var name in scope.bindings) {
          var binding = scope.bindings[name];
          if (binding.kind !== "const" && binding.kind !== "module") continue;

          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = (binding.constantViolations: Array)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var violation = _step.value;

              var hasNamedFunctionsPlugin = state.file.opts.plugins.find(function (p) {
                return p.find(function (plugin) {
                  return plugin.key && (plugin.key === 'transform-named-functions' || plugin.key === 'syntax-named-functions');
                });
              });

              var parent = violation.parent;
              if (hasNamedFunctionsPlugin && parent.type === 'CallExpression' && parent.arguments.every(function (arg) {
                return arg.type === 'AssignmentExpression';
              })) {
                continue;
              }

              throw violation.buildCodeFrameError(messages.get("readOnly", name));
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }
      }
    }
  };
};