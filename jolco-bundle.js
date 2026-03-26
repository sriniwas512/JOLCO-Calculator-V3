(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/react/cjs/react.development.js
  var require_react_development = __commonJS({
    "node_modules/react/cjs/react.development.js"(exports, module) {
      "use strict";
      (function() {
        function defineDeprecationWarning(methodName, info) {
          Object.defineProperty(Component.prototype, methodName, {
            get: function() {
              console.warn(
                "%s(...) is deprecated in plain JavaScript React classes. %s",
                info[0],
                info[1]
              );
            }
          });
        }
        function getIteratorFn(maybeIterable) {
          if (null === maybeIterable || "object" !== typeof maybeIterable)
            return null;
          maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
          return "function" === typeof maybeIterable ? maybeIterable : null;
        }
        function warnNoop(publicInstance, callerName) {
          publicInstance = (publicInstance = publicInstance.constructor) && (publicInstance.displayName || publicInstance.name) || "ReactClass";
          var warningKey = publicInstance + "." + callerName;
          didWarnStateUpdateForUnmountedComponent[warningKey] || (console.error(
            "Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.",
            callerName,
            publicInstance
          ), didWarnStateUpdateForUnmountedComponent[warningKey] = true);
        }
        function Component(props, context, updater) {
          this.props = props;
          this.context = context;
          this.refs = emptyObject;
          this.updater = updater || ReactNoopUpdateQueue;
        }
        function ComponentDummy() {
        }
        function PureComponent(props, context, updater) {
          this.props = props;
          this.context = context;
          this.refs = emptyObject;
          this.updater = updater || ReactNoopUpdateQueue;
        }
        function noop() {
        }
        function testStringCoercion(value) {
          return "" + value;
        }
        function checkKeyStringCoercion(value) {
          try {
            testStringCoercion(value);
            var JSCompiler_inline_result = false;
          } catch (e) {
            JSCompiler_inline_result = true;
          }
          if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(
              JSCompiler_inline_result,
              "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
              JSCompiler_inline_result$jscomp$0
            );
            return testStringCoercion(value);
          }
        }
        function getComponentNameFromType(type) {
          if (null == type) return null;
          if ("function" === typeof type)
            return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
          if ("string" === typeof type) return type;
          switch (type) {
            case REACT_FRAGMENT_TYPE:
              return "Fragment";
            case REACT_PROFILER_TYPE:
              return "Profiler";
            case REACT_STRICT_MODE_TYPE:
              return "StrictMode";
            case REACT_SUSPENSE_TYPE:
              return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
              return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
              return "Activity";
          }
          if ("object" === typeof type)
            switch ("number" === typeof type.tag && console.error(
              "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
            ), type.$$typeof) {
              case REACT_PORTAL_TYPE:
                return "Portal";
              case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
              case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
              case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
              case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
              case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                  return getComponentNameFromType(type(innerType));
                } catch (x) {
                }
            }
          return null;
        }
        function getTaskName(type) {
          if (type === REACT_FRAGMENT_TYPE) return "<>";
          if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE)
            return "<...>";
          try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
          } catch (x) {
            return "<...>";
          }
        }
        function getOwner() {
          var dispatcher = ReactSharedInternals.A;
          return null === dispatcher ? null : dispatcher.getOwner();
        }
        function UnknownOwner() {
          return Error("react-stack-top-frame");
        }
        function hasValidKey(config) {
          if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return false;
          }
          return void 0 !== config.key;
        }
        function defineKeyPropWarningGetter(props, displayName) {
          function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = true, console.error(
              "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
              displayName
            ));
          }
          warnAboutAccessingKey.isReactWarning = true;
          Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: true
          });
        }
        function elementRefGetterWithDeprecationWarning() {
          var componentName = getComponentNameFromType(this.type);
          didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = true, console.error(
            "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
          ));
          componentName = this.props.ref;
          return void 0 !== componentName ? componentName : null;
        }
        function ReactElement(type, key, props, owner, debugStack, debugTask) {
          var refProp = props.ref;
          type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type,
            key,
            props,
            _owner: owner
          };
          null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: false,
            get: elementRefGetterWithDeprecationWarning
          }) : Object.defineProperty(type, "ref", { enumerable: false, value: null });
          type._store = {};
          Object.defineProperty(type._store, "validated", {
            configurable: false,
            enumerable: false,
            writable: true,
            value: 0
          });
          Object.defineProperty(type, "_debugInfo", {
            configurable: false,
            enumerable: false,
            writable: true,
            value: null
          });
          Object.defineProperty(type, "_debugStack", {
            configurable: false,
            enumerable: false,
            writable: true,
            value: debugStack
          });
          Object.defineProperty(type, "_debugTask", {
            configurable: false,
            enumerable: false,
            writable: true,
            value: debugTask
          });
          Object.freeze && (Object.freeze(type.props), Object.freeze(type));
          return type;
        }
        function cloneAndReplaceKey(oldElement, newKey) {
          newKey = ReactElement(
            oldElement.type,
            newKey,
            oldElement.props,
            oldElement._owner,
            oldElement._debugStack,
            oldElement._debugTask
          );
          oldElement._store && (newKey._store.validated = oldElement._store.validated);
          return newKey;
        }
        function validateChildKeys(node) {
          isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
        }
        function isValidElement(object) {
          return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
        }
        function escape(key) {
          var escaperLookup = { "=": "=0", ":": "=2" };
          return "$" + key.replace(/[=:]/g, function(match) {
            return escaperLookup[match];
          });
        }
        function getElementKey(element, index) {
          return "object" === typeof element && null !== element && null != element.key ? (checkKeyStringCoercion(element.key), escape("" + element.key)) : index.toString(36);
        }
        function resolveThenable(thenable) {
          switch (thenable.status) {
            case "fulfilled":
              return thenable.value;
            case "rejected":
              throw thenable.reason;
            default:
              switch ("string" === typeof thenable.status ? thenable.then(noop, noop) : (thenable.status = "pending", thenable.then(
                function(fulfilledValue) {
                  "pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
                },
                function(error) {
                  "pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
                }
              )), thenable.status) {
                case "fulfilled":
                  return thenable.value;
                case "rejected":
                  throw thenable.reason;
              }
          }
          throw thenable;
        }
        function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
          var type = typeof children;
          if ("undefined" === type || "boolean" === type) children = null;
          var invokeCallback = false;
          if (null === children) invokeCallback = true;
          else
            switch (type) {
              case "bigint":
              case "string":
              case "number":
                invokeCallback = true;
                break;
              case "object":
                switch (children.$$typeof) {
                  case REACT_ELEMENT_TYPE:
                  case REACT_PORTAL_TYPE:
                    invokeCallback = true;
                    break;
                  case REACT_LAZY_TYPE:
                    return invokeCallback = children._init, mapIntoArray(
                      invokeCallback(children._payload),
                      array,
                      escapedPrefix,
                      nameSoFar,
                      callback
                    );
                }
            }
          if (invokeCallback) {
            invokeCallback = children;
            callback = callback(invokeCallback);
            var childKey = "" === nameSoFar ? "." + getElementKey(invokeCallback, 0) : nameSoFar;
            isArrayImpl(callback) ? (escapedPrefix = "", null != childKey && (escapedPrefix = childKey.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
              return c;
            })) : null != callback && (isValidElement(callback) && (null != callback.key && (invokeCallback && invokeCallback.key === callback.key || checkKeyStringCoercion(callback.key)), escapedPrefix = cloneAndReplaceKey(
              callback,
              escapedPrefix + (null == callback.key || invokeCallback && invokeCallback.key === callback.key ? "" : ("" + callback.key).replace(
                userProvidedKeyEscapeRegex,
                "$&/"
              ) + "/") + childKey
            ), "" !== nameSoFar && null != invokeCallback && isValidElement(invokeCallback) && null == invokeCallback.key && invokeCallback._store && !invokeCallback._store.validated && (escapedPrefix._store.validated = 2), callback = escapedPrefix), array.push(callback));
            return 1;
          }
          invokeCallback = 0;
          childKey = "" === nameSoFar ? "." : nameSoFar + ":";
          if (isArrayImpl(children))
            for (var i = 0; i < children.length; i++)
              nameSoFar = children[i], type = childKey + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(
                nameSoFar,
                array,
                escapedPrefix,
                type,
                callback
              );
          else if (i = getIteratorFn(children), "function" === typeof i)
            for (i === children.entries && (didWarnAboutMaps || console.warn(
              "Using Maps as children is not supported. Use an array of keyed ReactElements instead."
            ), didWarnAboutMaps = true), children = i.call(children), i = 0; !(nameSoFar = children.next()).done; )
              nameSoFar = nameSoFar.value, type = childKey + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(
                nameSoFar,
                array,
                escapedPrefix,
                type,
                callback
              );
          else if ("object" === type) {
            if ("function" === typeof children.then)
              return mapIntoArray(
                resolveThenable(children),
                array,
                escapedPrefix,
                nameSoFar,
                callback
              );
            array = String(children);
            throw Error(
              "Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead."
            );
          }
          return invokeCallback;
        }
        function mapChildren(children, func, context) {
          if (null == children) return children;
          var result = [], count = 0;
          mapIntoArray(children, result, "", "", function(child) {
            return func.call(context, child, count++);
          });
          return result;
        }
        function lazyInitializer(payload) {
          if (-1 === payload._status) {
            var ioInfo = payload._ioInfo;
            null != ioInfo && (ioInfo.start = ioInfo.end = performance.now());
            ioInfo = payload._result;
            var thenable = ioInfo();
            thenable.then(
              function(moduleObject) {
                if (0 === payload._status || -1 === payload._status) {
                  payload._status = 1;
                  payload._result = moduleObject;
                  var _ioInfo = payload._ioInfo;
                  null != _ioInfo && (_ioInfo.end = performance.now());
                  void 0 === thenable.status && (thenable.status = "fulfilled", thenable.value = moduleObject);
                }
              },
              function(error) {
                if (0 === payload._status || -1 === payload._status) {
                  payload._status = 2;
                  payload._result = error;
                  var _ioInfo2 = payload._ioInfo;
                  null != _ioInfo2 && (_ioInfo2.end = performance.now());
                  void 0 === thenable.status && (thenable.status = "rejected", thenable.reason = error);
                }
              }
            );
            ioInfo = payload._ioInfo;
            if (null != ioInfo) {
              ioInfo.value = thenable;
              var displayName = thenable.displayName;
              "string" === typeof displayName && (ioInfo.name = displayName);
            }
            -1 === payload._status && (payload._status = 0, payload._result = thenable);
          }
          if (1 === payload._status)
            return ioInfo = payload._result, void 0 === ioInfo && console.error(
              "lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))\n\nDid you accidentally put curly braces around the import?",
              ioInfo
            ), "default" in ioInfo || console.error(
              "lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))",
              ioInfo
            ), ioInfo.default;
          throw payload._result;
        }
        function resolveDispatcher() {
          var dispatcher = ReactSharedInternals.H;
          null === dispatcher && console.error(
            "Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem."
          );
          return dispatcher;
        }
        function releaseAsyncTransition() {
          ReactSharedInternals.asyncTransitions--;
        }
        function enqueueTask(task) {
          if (null === enqueueTaskImpl)
            try {
              var requireString = ("require" + Math.random()).slice(0, 7);
              enqueueTaskImpl = (module && module[requireString]).call(
                module,
                "timers"
              ).setImmediate;
            } catch (_err) {
              enqueueTaskImpl = function(callback) {
                false === didWarnAboutMessageChannel && (didWarnAboutMessageChannel = true, "undefined" === typeof MessageChannel && console.error(
                  "This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."
                ));
                var channel = new MessageChannel();
                channel.port1.onmessage = callback;
                channel.port2.postMessage(void 0);
              };
            }
          return enqueueTaskImpl(task);
        }
        function aggregateErrors(errors) {
          return 1 < errors.length && "function" === typeof AggregateError ? new AggregateError(errors) : errors[0];
        }
        function popActScope(prevActQueue, prevActScopeDepth) {
          prevActScopeDepth !== actScopeDepth - 1 && console.error(
            "You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "
          );
          actScopeDepth = prevActScopeDepth;
        }
        function recursivelyFlushAsyncActWork(returnValue, resolve, reject) {
          var queue = ReactSharedInternals.actQueue;
          if (null !== queue)
            if (0 !== queue.length)
              try {
                flushActQueue(queue);
                enqueueTask(function() {
                  return recursivelyFlushAsyncActWork(returnValue, resolve, reject);
                });
                return;
              } catch (error) {
                ReactSharedInternals.thrownErrors.push(error);
              }
            else ReactSharedInternals.actQueue = null;
          0 < ReactSharedInternals.thrownErrors.length ? (queue = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, reject(queue)) : resolve(returnValue);
        }
        function flushActQueue(queue) {
          if (!isFlushing) {
            isFlushing = true;
            var i = 0;
            try {
              for (; i < queue.length; i++) {
                var callback = queue[i];
                do {
                  ReactSharedInternals.didUsePromise = false;
                  var continuation = callback(false);
                  if (null !== continuation) {
                    if (ReactSharedInternals.didUsePromise) {
                      queue[i] = callback;
                      queue.splice(0, i);
                      return;
                    }
                    callback = continuation;
                  } else break;
                } while (1);
              }
              queue.length = 0;
            } catch (error) {
              queue.splice(0, i + 1), ReactSharedInternals.thrownErrors.push(error);
            } finally {
              isFlushing = false;
            }
          }
        }
        "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
        var REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = /* @__PURE__ */ Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = /* @__PURE__ */ Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo"), REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = /* @__PURE__ */ Symbol.for("react.activity"), MAYBE_ITERATOR_SYMBOL = Symbol.iterator, didWarnStateUpdateForUnmountedComponent = {}, ReactNoopUpdateQueue = {
          isMounted: function() {
            return false;
          },
          enqueueForceUpdate: function(publicInstance) {
            warnNoop(publicInstance, "forceUpdate");
          },
          enqueueReplaceState: function(publicInstance) {
            warnNoop(publicInstance, "replaceState");
          },
          enqueueSetState: function(publicInstance) {
            warnNoop(publicInstance, "setState");
          }
        }, assign = Object.assign, emptyObject = {};
        Object.freeze(emptyObject);
        Component.prototype.isReactComponent = {};
        Component.prototype.setState = function(partialState, callback) {
          if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState)
            throw Error(
              "takes an object of state variables to update or a function which returns an object of state variables."
            );
          this.updater.enqueueSetState(this, partialState, callback, "setState");
        };
        Component.prototype.forceUpdate = function(callback) {
          this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
        };
        var deprecatedAPIs = {
          isMounted: [
            "isMounted",
            "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."
          ],
          replaceState: [
            "replaceState",
            "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."
          ]
        };
        for (fnName in deprecatedAPIs)
          deprecatedAPIs.hasOwnProperty(fnName) && defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
        ComponentDummy.prototype = Component.prototype;
        deprecatedAPIs = PureComponent.prototype = new ComponentDummy();
        deprecatedAPIs.constructor = PureComponent;
        assign(deprecatedAPIs, Component.prototype);
        deprecatedAPIs.isPureReactComponent = true;
        var isArrayImpl = Array.isArray, REACT_CLIENT_REFERENCE = /* @__PURE__ */ Symbol.for("react.client.reference"), ReactSharedInternals = {
          H: null,
          A: null,
          T: null,
          S: null,
          actQueue: null,
          asyncTransitions: 0,
          isBatchingLegacy: false,
          didScheduleLegacyUpdate: false,
          didUsePromise: false,
          thrownErrors: [],
          getCurrentStack: null,
          recentlyCreatedOwnerStacks: 0
        }, hasOwnProperty = Object.prototype.hasOwnProperty, createTask = console.createTask ? console.createTask : function() {
          return null;
        };
        deprecatedAPIs = {
          react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
          }
        };
        var specialPropKeyWarningShown, didWarnAboutOldJSXRuntime;
        var didWarnAboutElementRef = {};
        var unknownOwnerDebugStack = deprecatedAPIs.react_stack_bottom_frame.bind(
          deprecatedAPIs,
          UnknownOwner
        )();
        var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
        var didWarnAboutMaps = false, userProvidedKeyEscapeRegex = /\/+/g, reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
          if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
            var event = new window.ErrorEvent("error", {
              bubbles: true,
              cancelable: true,
              message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
              error
            });
            if (!window.dispatchEvent(event)) return;
          } else if ("object" === typeof process && "function" === typeof process.emit) {
            process.emit("uncaughtException", error);
            return;
          }
          console.error(error);
        }, didWarnAboutMessageChannel = false, enqueueTaskImpl = null, actScopeDepth = 0, didWarnNoAwaitAct = false, isFlushing = false, queueSeveralMicrotasks = "function" === typeof queueMicrotask ? function(callback) {
          queueMicrotask(function() {
            return queueMicrotask(callback);
          });
        } : enqueueTask;
        deprecatedAPIs = Object.freeze({
          __proto__: null,
          c: function(size) {
            return resolveDispatcher().useMemoCache(size);
          }
        });
        var fnName = {
          map: mapChildren,
          forEach: function(children, forEachFunc, forEachContext) {
            mapChildren(
              children,
              function() {
                forEachFunc.apply(this, arguments);
              },
              forEachContext
            );
          },
          count: function(children) {
            var n = 0;
            mapChildren(children, function() {
              n++;
            });
            return n;
          },
          toArray: function(children) {
            return mapChildren(children, function(child) {
              return child;
            }) || [];
          },
          only: function(children) {
            if (!isValidElement(children))
              throw Error(
                "React.Children.only expected to receive a single React element child."
              );
            return children;
          }
        };
        exports.Activity = REACT_ACTIVITY_TYPE;
        exports.Children = fnName;
        exports.Component = Component;
        exports.Fragment = REACT_FRAGMENT_TYPE;
        exports.Profiler = REACT_PROFILER_TYPE;
        exports.PureComponent = PureComponent;
        exports.StrictMode = REACT_STRICT_MODE_TYPE;
        exports.Suspense = REACT_SUSPENSE_TYPE;
        exports.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
        exports.__COMPILER_RUNTIME = deprecatedAPIs;
        exports.act = function(callback) {
          var prevActQueue = ReactSharedInternals.actQueue, prevActScopeDepth = actScopeDepth;
          actScopeDepth++;
          var queue = ReactSharedInternals.actQueue = null !== prevActQueue ? prevActQueue : [], didAwaitActCall = false;
          try {
            var result = callback();
          } catch (error) {
            ReactSharedInternals.thrownErrors.push(error);
          }
          if (0 < ReactSharedInternals.thrownErrors.length)
            throw popActScope(prevActQueue, prevActScopeDepth), callback = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, callback;
          if (null !== result && "object" === typeof result && "function" === typeof result.then) {
            var thenable = result;
            queueSeveralMicrotasks(function() {
              didAwaitActCall || didWarnNoAwaitAct || (didWarnNoAwaitAct = true, console.error(
                "You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"
              ));
            });
            return {
              then: function(resolve, reject) {
                didAwaitActCall = true;
                thenable.then(
                  function(returnValue) {
                    popActScope(prevActQueue, prevActScopeDepth);
                    if (0 === prevActScopeDepth) {
                      try {
                        flushActQueue(queue), enqueueTask(function() {
                          return recursivelyFlushAsyncActWork(
                            returnValue,
                            resolve,
                            reject
                          );
                        });
                      } catch (error$0) {
                        ReactSharedInternals.thrownErrors.push(error$0);
                      }
                      if (0 < ReactSharedInternals.thrownErrors.length) {
                        var _thrownError = aggregateErrors(
                          ReactSharedInternals.thrownErrors
                        );
                        ReactSharedInternals.thrownErrors.length = 0;
                        reject(_thrownError);
                      }
                    } else resolve(returnValue);
                  },
                  function(error) {
                    popActScope(prevActQueue, prevActScopeDepth);
                    0 < ReactSharedInternals.thrownErrors.length ? (error = aggregateErrors(
                      ReactSharedInternals.thrownErrors
                    ), ReactSharedInternals.thrownErrors.length = 0, reject(error)) : reject(error);
                  }
                );
              }
            };
          }
          var returnValue$jscomp$0 = result;
          popActScope(prevActQueue, prevActScopeDepth);
          0 === prevActScopeDepth && (flushActQueue(queue), 0 !== queue.length && queueSeveralMicrotasks(function() {
            didAwaitActCall || didWarnNoAwaitAct || (didWarnNoAwaitAct = true, console.error(
              "A component suspended inside an `act` scope, but the `act` call was not awaited. When testing React components that depend on asynchronous data, you must await the result:\n\nawait act(() => ...)"
            ));
          }), ReactSharedInternals.actQueue = null);
          if (0 < ReactSharedInternals.thrownErrors.length)
            throw callback = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, callback;
          return {
            then: function(resolve, reject) {
              didAwaitActCall = true;
              0 === prevActScopeDepth ? (ReactSharedInternals.actQueue = queue, enqueueTask(function() {
                return recursivelyFlushAsyncActWork(
                  returnValue$jscomp$0,
                  resolve,
                  reject
                );
              })) : resolve(returnValue$jscomp$0);
            }
          };
        };
        exports.cache = function(fn) {
          return function() {
            return fn.apply(null, arguments);
          };
        };
        exports.cacheSignal = function() {
          return null;
        };
        exports.captureOwnerStack = function() {
          var getCurrentStack = ReactSharedInternals.getCurrentStack;
          return null === getCurrentStack ? null : getCurrentStack();
        };
        exports.cloneElement = function(element, config, children) {
          if (null === element || void 0 === element)
            throw Error(
              "The argument must be a React element, but you passed " + element + "."
            );
          var props = assign({}, element.props), key = element.key, owner = element._owner;
          if (null != config) {
            var JSCompiler_inline_result;
            a: {
              if (hasOwnProperty.call(config, "ref") && (JSCompiler_inline_result = Object.getOwnPropertyDescriptor(
                config,
                "ref"
              ).get) && JSCompiler_inline_result.isReactWarning) {
                JSCompiler_inline_result = false;
                break a;
              }
              JSCompiler_inline_result = void 0 !== config.ref;
            }
            JSCompiler_inline_result && (owner = getOwner());
            hasValidKey(config) && (checkKeyStringCoercion(config.key), key = "" + config.key);
            for (propName in config)
              !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
          }
          var propName = arguments.length - 2;
          if (1 === propName) props.children = children;
          else if (1 < propName) {
            JSCompiler_inline_result = Array(propName);
            for (var i = 0; i < propName; i++)
              JSCompiler_inline_result[i] = arguments[i + 2];
            props.children = JSCompiler_inline_result;
          }
          props = ReactElement(
            element.type,
            key,
            props,
            owner,
            element._debugStack,
            element._debugTask
          );
          for (key = 2; key < arguments.length; key++)
            validateChildKeys(arguments[key]);
          return props;
        };
        exports.createContext = function(defaultValue) {
          defaultValue = {
            $$typeof: REACT_CONTEXT_TYPE,
            _currentValue: defaultValue,
            _currentValue2: defaultValue,
            _threadCount: 0,
            Provider: null,
            Consumer: null
          };
          defaultValue.Provider = defaultValue;
          defaultValue.Consumer = {
            $$typeof: REACT_CONSUMER_TYPE,
            _context: defaultValue
          };
          defaultValue._currentRenderer = null;
          defaultValue._currentRenderer2 = null;
          return defaultValue;
        };
        exports.createElement = function(type, config, children) {
          for (var i = 2; i < arguments.length; i++)
            validateChildKeys(arguments[i]);
          i = {};
          var key = null;
          if (null != config)
            for (propName in didWarnAboutOldJSXRuntime || !("__self" in config) || "key" in config || (didWarnAboutOldJSXRuntime = true, console.warn(
              "Your app (or one of its dependencies) is using an outdated JSX transform. Update to the modern JSX transform for faster performance: https://react.dev/link/new-jsx-transform"
            )), hasValidKey(config) && (checkKeyStringCoercion(config.key), key = "" + config.key), config)
              hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (i[propName] = config[propName]);
          var childrenLength = arguments.length - 2;
          if (1 === childrenLength) i.children = children;
          else if (1 < childrenLength) {
            for (var childArray = Array(childrenLength), _i = 0; _i < childrenLength; _i++)
              childArray[_i] = arguments[_i + 2];
            Object.freeze && Object.freeze(childArray);
            i.children = childArray;
          }
          if (type && type.defaultProps)
            for (propName in childrenLength = type.defaultProps, childrenLength)
              void 0 === i[propName] && (i[propName] = childrenLength[propName]);
          key && defineKeyPropWarningGetter(
            i,
            "function" === typeof type ? type.displayName || type.name || "Unknown" : type
          );
          var propName = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
          return ReactElement(
            type,
            key,
            i,
            getOwner(),
            propName ? Error("react-stack-top-frame") : unknownOwnerDebugStack,
            propName ? createTask(getTaskName(type)) : unknownOwnerDebugTask
          );
        };
        exports.createRef = function() {
          var refObject = { current: null };
          Object.seal(refObject);
          return refObject;
        };
        exports.forwardRef = function(render) {
          null != render && render.$$typeof === REACT_MEMO_TYPE ? console.error(
            "forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...))."
          ) : "function" !== typeof render ? console.error(
            "forwardRef requires a render function but was given %s.",
            null === render ? "null" : typeof render
          ) : 0 !== render.length && 2 !== render.length && console.error(
            "forwardRef render functions accept exactly two parameters: props and ref. %s",
            1 === render.length ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."
          );
          null != render && null != render.defaultProps && console.error(
            "forwardRef render functions do not support defaultProps. Did you accidentally pass a React component?"
          );
          var elementType = { $$typeof: REACT_FORWARD_REF_TYPE, render }, ownName;
          Object.defineProperty(elementType, "displayName", {
            enumerable: false,
            configurable: true,
            get: function() {
              return ownName;
            },
            set: function(name) {
              ownName = name;
              render.name || render.displayName || (Object.defineProperty(render, "name", { value: name }), render.displayName = name);
            }
          });
          return elementType;
        };
        exports.isValidElement = isValidElement;
        exports.lazy = function(ctor) {
          ctor = { _status: -1, _result: ctor };
          var lazyType = {
            $$typeof: REACT_LAZY_TYPE,
            _payload: ctor,
            _init: lazyInitializer
          }, ioInfo = {
            name: "lazy",
            start: -1,
            end: -1,
            value: null,
            owner: null,
            debugStack: Error("react-stack-top-frame"),
            debugTask: console.createTask ? console.createTask("lazy()") : null
          };
          ctor._ioInfo = ioInfo;
          lazyType._debugInfo = [{ awaited: ioInfo }];
          return lazyType;
        };
        exports.memo = function(type, compare) {
          null == type && console.error(
            "memo: The first argument must be a component. Instead received: %s",
            null === type ? "null" : typeof type
          );
          compare = {
            $$typeof: REACT_MEMO_TYPE,
            type,
            compare: void 0 === compare ? null : compare
          };
          var ownName;
          Object.defineProperty(compare, "displayName", {
            enumerable: false,
            configurable: true,
            get: function() {
              return ownName;
            },
            set: function(name) {
              ownName = name;
              type.name || type.displayName || (Object.defineProperty(type, "name", { value: name }), type.displayName = name);
            }
          });
          return compare;
        };
        exports.startTransition = function(scope) {
          var prevTransition = ReactSharedInternals.T, currentTransition = {};
          currentTransition._updatedFibers = /* @__PURE__ */ new Set();
          ReactSharedInternals.T = currentTransition;
          try {
            var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
            null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
            "object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && (ReactSharedInternals.asyncTransitions++, returnValue.then(releaseAsyncTransition, releaseAsyncTransition), returnValue.then(noop, reportGlobalError));
          } catch (error) {
            reportGlobalError(error);
          } finally {
            null === prevTransition && currentTransition._updatedFibers && (scope = currentTransition._updatedFibers.size, currentTransition._updatedFibers.clear(), 10 < scope && console.warn(
              "Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."
            )), null !== prevTransition && null !== currentTransition.types && (null !== prevTransition.types && prevTransition.types !== currentTransition.types && console.error(
              "We expected inner Transitions to have transferred the outer types set and that you cannot add to the outer Transition while inside the inner.This is a bug in React."
            ), prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
          }
        };
        exports.unstable_useCacheRefresh = function() {
          return resolveDispatcher().useCacheRefresh();
        };
        exports.use = function(usable) {
          return resolveDispatcher().use(usable);
        };
        exports.useActionState = function(action, initialState, permalink) {
          return resolveDispatcher().useActionState(
            action,
            initialState,
            permalink
          );
        };
        exports.useCallback = function(callback, deps) {
          return resolveDispatcher().useCallback(callback, deps);
        };
        exports.useContext = function(Context) {
          var dispatcher = resolveDispatcher();
          Context.$$typeof === REACT_CONSUMER_TYPE && console.error(
            "Calling useContext(Context.Consumer) is not supported and will cause bugs. Did you mean to call useContext(Context) instead?"
          );
          return dispatcher.useContext(Context);
        };
        exports.useDebugValue = function(value, formatterFn) {
          return resolveDispatcher().useDebugValue(value, formatterFn);
        };
        exports.useDeferredValue = function(value, initialValue) {
          return resolveDispatcher().useDeferredValue(value, initialValue);
        };
        exports.useEffect = function(create, deps) {
          null == create && console.warn(
            "React Hook useEffect requires an effect callback. Did you forget to pass a callback to the hook?"
          );
          return resolveDispatcher().useEffect(create, deps);
        };
        exports.useEffectEvent = function(callback) {
          return resolveDispatcher().useEffectEvent(callback);
        };
        exports.useId = function() {
          return resolveDispatcher().useId();
        };
        exports.useImperativeHandle = function(ref, create, deps) {
          return resolveDispatcher().useImperativeHandle(ref, create, deps);
        };
        exports.useInsertionEffect = function(create, deps) {
          null == create && console.warn(
            "React Hook useInsertionEffect requires an effect callback. Did you forget to pass a callback to the hook?"
          );
          return resolveDispatcher().useInsertionEffect(create, deps);
        };
        exports.useLayoutEffect = function(create, deps) {
          null == create && console.warn(
            "React Hook useLayoutEffect requires an effect callback. Did you forget to pass a callback to the hook?"
          );
          return resolveDispatcher().useLayoutEffect(create, deps);
        };
        exports.useMemo = function(create, deps) {
          return resolveDispatcher().useMemo(create, deps);
        };
        exports.useOptimistic = function(passthrough, reducer) {
          return resolveDispatcher().useOptimistic(passthrough, reducer);
        };
        exports.useReducer = function(reducer, initialArg, init) {
          return resolveDispatcher().useReducer(reducer, initialArg, init);
        };
        exports.useRef = function(initialValue) {
          return resolveDispatcher().useRef(initialValue);
        };
        exports.useState = function(initialState) {
          return resolveDispatcher().useState(initialState);
        };
        exports.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
          return resolveDispatcher().useSyncExternalStore(
            subscribe,
            getSnapshot,
            getServerSnapshot
          );
        };
        exports.useTransition = function() {
          return resolveDispatcher().useTransition();
        };
        exports.version = "19.2.4";
        "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
      })();
    }
  });

  // node_modules/react/index.js
  var require_react = __commonJS({
    "node_modules/react/index.js"(exports, module) {
      "use strict";
      if (false) {
        module.exports = null;
      } else {
        module.exports = require_react_development();
      }
    }
  });

  // jolco-v3.jsx
  var import_react = __toESM(require_react());
  function solveIRR(cf, guess = 0.1) {
    let r = guess;
    for (let i = 0; i < 1e3; i++) {
      let npv = 0, d = 0;
      for (let t = 0; t < cf.length; t++) {
        npv += cf[t] / Math.pow(1 + r, t);
        if (t > 0) d -= t * cf[t] / Math.pow(1 + r, t + 1);
      }
      if (Math.abs(npv) < 1e-8) return r;
      if (Math.abs(d) < 1e-14) break;
      const nr = r - npv / d;
      if (Math.abs(nr - r) < 1e-8) return nr;
      r = nr;
      if (r < -0.99 || r > 10) break;
    }
    let lo = -0.9, hi = 5;
    const f = (x) => cf.reduce((s, v, t) => s + v / Math.pow(1 + x, t), 0);
    if (f(lo) * f(hi) > 0) return null;
    for (let i = 0; i < 2e3; i++) {
      const m = (lo + hi) / 2;
      if (Math.abs(f(m)) < 1e-8) return m;
      if (f(lo) * f(m) < 0) hi = m;
      else lo = m;
    }
    return (lo + hi) / 2;
  }
  var VESSEL_DB = [
    { id: "bulk_l", label: "Bulk Carrier \u22652,000 GT", jpLife: 15, forLife: 12, cat: "\u305D\u306E\u4ED6 (Other)" },
    { id: "bulk_s", label: "Bulk Carrier <2,000 GT", jpLife: 14, forLife: 12, cat: "\u305D\u306E\u4ED6 (Other)" },
    { id: "oil_l", label: "Oil Tanker \u22652,000 GT", jpLife: 13, forLife: 12, cat: "\u6CB9\u305D\u3046\u8239 (Tanker)" },
    { id: "oil_s", label: "Oil Tanker <2,000 GT", jpLife: 11, forLife: 12, cat: "\u6CB9\u305D\u3046\u8239 (Tanker)" },
    { id: "chem", label: "Chemical Tanker", jpLife: 10, forLife: 12, cat: "\u85AC\u54C1\u305D\u3046\u8239 (Chemical)" },
    { id: "lpg", label: "LPG Carrier", jpLife: 13, forLife: 12, cat: "\u6CB9\u305D\u3046\u8239* (per NTA 2-4-2)" },
    { id: "lng", label: "LNG Carrier \u22652,000 GT", jpLife: 15, forLife: 12, cat: "\u305D\u306E\u4ED6 (Other)" },
    { id: "cont_l", label: "Container \u22652,000 GT", jpLife: 15, forLife: 12, cat: "\u305D\u306E\u4ED6 (Other)" },
    { id: "cont_s", label: "Container <2,000 GT", jpLife: 14, forLife: 12, cat: "\u305D\u306E\u4ED6 (Other)" },
    { id: "car", label: "Car Carrier / PCC", jpLife: 15, forLife: 12, cat: "\u305D\u306E\u4ED6 (Other)" },
    { id: "gen_l", label: "General Cargo \u22652,000 GT", jpLife: 15, forLife: 12, cat: "\u305D\u306E\u4ED6 (Other)" },
    { id: "ferry", label: "Car Ferry", jpLife: 11, forLife: 12, cat: "\u30AB\u30FC\u30D5\u30A7\u30EA\u30FC" },
    { id: "tug", label: "Tugboat", jpLife: 12, forLife: 10, cat: "\u3072\u304D\u8239" },
    { id: "fish_l", label: "Fishing \u2265500 GT", jpLife: 12, forLife: 8, cat: "\u6F01\u8239 (Fishing)" },
    { id: "fish_s", label: "Fishing <500 GT", jpLife: 9, forLife: 8, cat: "\u6F01\u8239 (Fishing)" }
  ];
  var FLAG_OPTIONS = [
    { id: "jp", label: "Japanese Flag (\u65E5\u672C\u7C4D\u8239)", desc: "Ship Act Art. 4-19 (\u8239\u8236\u6CD5)", specialMin: 20, specialMax: 32 },
    { id: "foreign", label: "Foreign Flag (PAN/LBR/MHL etc.)", desc: "Not under Ship Act (\u8239\u8236\u6CD5\u9069\u7528\u5916)", specialMin: 18, specialMax: 30 }
  ];
  function computeDepr(cost, life, specialPct = 0) {
    const rate = 2 / life;
    const sched = [];
    let bv = cost;
    let switched = false;
    for (let yr = 1; yr <= life; yr++) {
      const rem = life - yr + 1;
      let special = yr === 1 ? cost * specialPct / 100 : 0;
      const db = bv * rate;
      const sl = bv / rem;
      if (!switched && sl >= db) switched = true;
      let ordinary = Math.min(switched ? sl : db, bv);
      let total = Math.min(ordinary + special, bv);
      special = total - ordinary;
      sched.push({ yr, method: switched ? "SL" : "DB", ordinary, special, total, bv: bv - total });
      bv = Math.max(0, bv - total);
    }
    return sched;
  }
  var $ = (n) => n == null || isNaN(n) ? "\u2014" : n.toLocaleString("en-US", { maximumFractionDigits: 0 });
  var $d = (n, d = 2) => n == null || isNaN(n) ? "\u2014" : n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
  var pct = (n) => n == null || isNaN(n) ? "\u2014" : (n * 100).toFixed(2) + "%";
  var F = "'JetBrains Mono', monospace";
  function Inp({ label, value, onChange, unit, help, min, max, step }) {
    return /* @__PURE__ */ import_react.default.createElement("div", { style: { marginBottom: 13 } }, /* @__PURE__ */ import_react.default.createElement("label", { style: { display: "block", fontSize: 11, fontWeight: 600, color: "#7aa2f7", letterSpacing: "0.05em", marginBottom: 3, fontFamily: F, textTransform: "uppercase" } }, label), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: 5 } }, /* @__PURE__ */ import_react.default.createElement(
      "input",
      {
        type: "number",
        value,
        onChange: (e) => onChange(parseFloat(e.target.value) || 0),
        min,
        max,
        step: step || 1,
        style: { width: "100%", padding: "7px 9px", borderRadius: 5, border: "1px solid #3b4261", background: "#1a1b26", color: "#c0caf5", fontSize: 14, fontFamily: F, outline: "none" },
        onFocus: (e) => e.target.style.borderColor = "#7aa2f7",
        onBlur: (e) => e.target.style.borderColor = "#3b4261"
      }
    ), unit && /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 11, color: "#a9b1d6", minWidth: 32 } }, unit)), help && /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 10, color: "#a9b1d6", marginTop: 2 } }, help));
  }
  function Slider({ label, value, onChange, min, max, step, unit, help }) {
    return /* @__PURE__ */ import_react.default.createElement("div", { style: { marginBottom: 16 } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 } }, /* @__PURE__ */ import_react.default.createElement("label", { style: { fontSize: 11, fontWeight: 600, color: "#7aa2f7", letterSpacing: "0.05em", fontFamily: F, textTransform: "uppercase" } }, label), /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 15, fontWeight: 700, color: "#bb9af7", fontFamily: F } }, value, unit)), /* @__PURE__ */ import_react.default.createElement(
      "input",
      {
        type: "range",
        value,
        onChange: (e) => onChange(parseFloat(e.target.value)),
        min,
        max,
        step: step || 1,
        style: { width: "100%", height: 6, borderRadius: 3, appearance: "none", background: `linear-gradient(to right, #7aa2f7 ${(value - min) / (max - min) * 100}%, #3b4261 ${(value - min) / (max - min) * 100}%)`, cursor: "pointer", outline: "none" }
      }
    ), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 10, color: "#a9b1d6", marginTop: 2 } }, /* @__PURE__ */ import_react.default.createElement("span", null, min, unit), /* @__PURE__ */ import_react.default.createElement("span", null, max, unit)), help && /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 10, color: "#a9b1d6", marginTop: 2 } }, help));
  }
  function JOLCOv3() {
    const [tab, setTab] = (0, import_react.useState)("deal");
    const [expandedYear, setExpandedYear] = (0, import_react.useState)(null);
    const [vesselTypeId, setVesselTypeId] = (0, import_react.useState)("bulk_l");
    const [flagId, setFlagId] = (0, import_react.useState)("foreign");
    const [vesselPrice, setVesselPrice] = (0, import_react.useState)(29.4);
    const [debtPct, setDebtPct] = (0, import_react.useState)(70);
    const [amortYrs, setAmortYrs] = (0, import_react.useState)(15);
    const [leaseTerm, setLeaseTerm] = (0, import_react.useState)(10);
    const [sofrRate, setSofrRate] = (0, import_react.useState)(4.3);
    const [spreadBps, setSpreadBps] = (0, import_react.useState)(280);
    const [jpyBaseRate, setJpyBaseRate] = (0, import_react.useState)(0.5);
    const [bankSpreadBps, setBankSpreadBps] = (0, import_react.useState)(100);
    const [swapCostBps, setSwapCostBps] = (0, import_react.useState)(35);
    const [saleCommission, setSaleCommission] = (0, import_react.useState)(2);
    const [bbcCommission, setBbcCommission] = (0, import_react.useState)(1.25);
    const [poFirstYear, setPoFirstYear] = (0, import_react.useState)(5);
    const [poLastYear, setPoLastYear] = (0, import_react.useState)(10);
    const [lockInPeriod, setLockInPeriod] = (0, import_react.useState)(4);
    const effectivePOFirstYear = Math.max(poFirstYear, lockInPeriod + 1);
    const [poPremium, setPoPremium] = (0, import_react.useState)(0);
    const effectiveDecline = vesselPrice / amortYrs;
    const [poOverrides, setPoOverrides] = (0, import_react.useState)({});
    const poSchedule = (0, import_react.useMemo)(() => {
      const sched = [];
      const annualRepay = vesselPrice / amortYrs;
      for (let yr = effectivePOFirstYear; yr <= poLastYear; yr++) {
        const basePrice = Math.max(0, vesselPrice - annualRepay * yr);
        const defaultPrice = Math.round((basePrice + poPremium) * 10) / 10;
        const price = poOverrides[yr] != null ? poOverrides[yr] : defaultPrice;
        sched.push({ yr, price, obligatory: yr === poLastYear, isOverridden: poOverrides[yr] != null });
      }
      return sched;
    }, [vesselPrice, amortYrs, effectivePOFirstYear, poLastYear, poPremium, poOverrides]);
    const [exerciseYear, setExerciseYear] = (0, import_react.useState)(10);
    const effectiveExerciseYear = Math.max(effectivePOFirstYear, Math.min(poLastYear, exerciseYear));
    const [taxRate, setTaxRate] = (0, import_react.useState)(30.62);
    const [capGainsTaxRate, setCapGainsTaxRate] = (0, import_react.useState)(20.315);
    const [foreignInterestTaxPct, setForeignInterestTaxPct] = (0, import_react.useState)(27);
    const [specialDeprPct, setSpecialDeprPct] = (0, import_react.useState)(0);
    const [treasuryYield, setTreasuryYield] = (0, import_react.useState)(4.25);
    const vType = VESSEL_DB.find((v) => v.id === vesselTypeId);
    const flagInfo = FLAG_OPTIONS.find((f) => f.id === flagId);
    const isJPFlag = flagId === "jp";
    const usefulLife = isJPFlag ? vType.jpLife : vType.forLife;
    const dbRate = 2 / usefulLife;
    const R = (0, import_react.useMemo)(() => {
      const VP = vesselPrice * 1e6;
      const debt = VP * debtPct / 100;
      const equity = VP - debt;
      const annualPrincipal = VP / amortYrs;
      const monthlyFixed = annualPrincipal / 12;
      const bankAllInRate = (jpyBaseRate + bankSpreadBps / 100) / 100 + swapCostBps / 1e4;
      const equityAllInRate = (sofrRate + spreadBps / 100) / 100;
      const poEntry = poSchedule.find((p) => p.yr === effectiveExerciseYear);
      const poPriceMil = poEntry ? poEntry.price * 1e6 : 0;
      const depr = computeDepr(VP, usefulLife, specialDeprPct);
      const saleCommCost = VP * saleCommission / 100;
      const equityCF = [-(equity + saleCommCost)];
      const equityCF_noTax = [-(equity + saleCommCost)];
      const years = [];
      let outstandingTotal = VP;
      let outstandingDebt = debt;
      let outstandingEquity = equity;
      let cumulativeEquityCF = -(equity + saleCommCost);
      let totalStream1 = 0, totalStream2 = 0, totalStream3 = 0, totalBbcComm = 0;
      for (let yr = 1; yr <= effectiveExerciseYear; yr++) {
        const fixedHire = annualPrincipal;
        const variableHireBank = outstandingDebt * bankAllInRate;
        const variableHireEquity = outstandingEquity * equityAllInRate;
        const variableHire = variableHireBank + variableHireEquity;
        const totalHire = fixedHire + variableHire;
        const bbcCommCost = totalHire * bbcCommission / 100;
        const netHire = totalHire - bbcCommCost;
        const bankPrincipal = annualPrincipal * (debtPct / 100);
        const bankInterest = outstandingDebt * bankAllInRate;
        const totalToBank = bankPrincipal + bankInterest;
        const equityPrincipalReturn = annualPrincipal * ((100 - debtPct) / 100);
        const equityInterestIncome = outstandingEquity * equityAllInRate;
        const totalToEquity = equityPrincipalReturn + equityInterestIncome;
        const hireSpread = equityInterestIncome;
        const dep = yr <= depr.length ? depr[yr - 1] : { total: 0, bv: 0 };
        const spcTaxablePL = netHire - dep.total - bankInterest;
        const taxShieldThisYear = -spcTaxablePL * (taxRate / 100);
        const isExitYear = yr === effectiveExerciseYear;
        let residualToEquity = 0, capGainTax = 0;
        if (isExitYear) {
          const remainDebt = outstandingDebt - bankPrincipal;
          const grossResidual = poPriceMil - remainDebt;
          const bookVal = dep.bv;
          const capGain = Math.max(0, poPriceMil - bookVal);
          capGainTax = capGain * capGainsTaxRate / 100;
          residualToEquity = grossResidual - capGainTax;
        }
        const netCF = equityPrincipalReturn + hireSpread - bbcCommCost + taxShieldThisYear + (isExitYear ? residualToEquity : 0);
        const netCF_noTax = equityPrincipalReturn + hireSpread - bbcCommCost + (isExitYear ? residualToEquity : 0);
        outstandingTotal = Math.max(0, outstandingTotal - annualPrincipal);
        outstandingDebt = Math.max(0, outstandingDebt - bankPrincipal);
        outstandingEquity = Math.max(0, outstandingEquity - equityPrincipalReturn);
        cumulativeEquityCF += netCF;
        totalStream1 += hireSpread;
        totalStream2 += taxShieldThisYear;
        totalBbcComm += bbcCommCost;
        if (isExitYear) totalStream3 = residualToEquity;
        equityCF.push(netCF);
        equityCF_noTax.push(netCF_noTax);
        years.push({
          yr,
          fixedHire,
          variableHireBank,
          variableHireEquity,
          variableHire,
          totalHire,
          bbcCommCost,
          netHire,
          bankPrincipal,
          bankInterest,
          totalToBank,
          equityPrincipalReturn,
          equityInterestIncome,
          hireSpread,
          dep: dep.total,
          spcTaxablePL,
          taxShieldThisYear,
          residualGain: isExitYear ? residualToEquity : 0,
          poExercise: isExitYear ? poPriceMil : 0,
          capGainTax,
          netCF,
          netCF_noTax,
          cumulativeEquityCF,
          outstandingDebt,
          outstandingEquity,
          outstandingTotal,
          bookVal: dep.bv
        });
      }
      const blendedIRR = solveIRR(equityCF);
      const equityIRR = solveIRR(equityCF_noTax);
      const totalEquityDeployed = equity + saleCommCost;
      const treasPostTaxYield = treasuryYield * (1 - foreignInterestTaxPct / 100);
      const treasTerminal = totalEquityDeployed * Math.pow(1 + treasPostTaxYield / 100, effectiveExerciseYear);
      const treasProfit = treasTerminal - totalEquityDeployed;
      const jolcoProfit = equityCF.reduce((a, b) => a + b, 0);
      const spread = blendedIRR != null ? blendedIRR - treasPostTaxYield / 100 : null;
      return { VP, debt, equity, saleCommCost, totalBbcComm, totalEquityDeployed, equityCF, equityCF_noTax, years, depr, blendedIRR, equityIRR, treasTerminal, treasProfit, jolcoProfit, spread, totalStream1, totalStream2, totalStream3, monthlyFixed, bankAllInRate, equityAllInRate, poPriceMil, treasPostTaxYield };
    }, [vesselPrice, debtPct, amortYrs, sofrRate, spreadBps, jpyBaseRate, bankSpreadBps, swapCostBps, saleCommission, bbcCommission, taxRate, capGainsTaxRate, foreignInterestTaxPct, usefulLife, specialDeprPct, treasuryYield, flagId, effectiveExerciseYear, poSchedule, lockInPeriod, poPremium]);
    const C = { background: "#1a1b26", borderRadius: 10, padding: 18, border: "1px solid #292e42", marginBottom: 14 };
    const H = (color, text) => /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "#c0caf5", marginBottom: 10, fontFamily: F, display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { color } }, "\u25CF"), text);
    const T = (t, label) => /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => setTab(t), style: { padding: "9px 16px", fontSize: 12, fontFamily: F, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", background: tab === t ? "#1a1b26" : "transparent", color: tab === t ? "#7aa2f7" : "#6b7299", border: "none", borderBottom: tab === t ? "2px solid #7aa2f7" : "2px solid transparent", cursor: "pointer" } }, label);
    return /* @__PURE__ */ import_react.default.createElement("div", { style: { minHeight: "100vh", background: "#16161e", fontFamily: "'Inter', sans-serif", color: "#a9b1d6" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { background: "linear-gradient(135deg, #1a1b26, #24283b)", borderBottom: "1px solid #292e42", padding: "20px 28px" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12 } }, /* @__PURE__ */ import_react.default.createElement("img", { src: "updated bg image.png", alt: "JOLCO", style: { height: 48, width: "auto", objectFit: "contain" } }), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 19, fontWeight: 700, color: "#c0caf5", fontFamily: F } }, "Equity IRR Calculator ", /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 12, color: "#9ece6a" } }, "v3")), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 11, color: "#a9b1d6" } }, "Financed ~", debtPct, "% by bank debt, ~", 100 - debtPct, "% by Japanese TK (silent partnership) equity investors \xB7 MOF Depreciation \xB7 Tax Shield Analysis"))), /* @__PURE__ */ import_react.default.createElement("div", { style: { textAlign: "right" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: "#ffffff" } }, "Created By Sriniwas Ghate"), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 11, fontWeight: 700, color: "#ffffff" } }, "Gibson Shipbrokers, Singapore")))), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", background: "#24283b", borderBottom: "1px solid #292e42", padding: "0 20px", flexWrap: "wrap" } }, T("deal", "Deal Inputs"), T("depr", "Depreciation Scale"), T("cf", "Equity Cashflows"), T("vs", "vs Treasury")), /* @__PURE__ */ import_react.default.createElement("div", { style: { padding: "20px 28px", maxWidth: 1150, margin: "0 auto" } }, tab === "deal" && /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { gridColumn: "1 / -1", ...C, background: "linear-gradient(135deg, #1a1b26, #1e2030)" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 14 } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { padding: 12, borderRadius: 8, background: "#16161e", border: "1px solid #292e42", textAlign: "center" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 10, color: "#a9b1d6", textTransform: "uppercase", letterSpacing: "0.06em" } }, "\u2460 Charter Hire (net BBC comm)"), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 23, fontWeight: 700, color: "#9ece6a", fontFamily: F } }, "$", $d((R.totalStream1 - R.totalBbcComm) / 1e6, 2), "M"), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 10, color: "#a9b1d6" } }, "Hire spread after debt service & ", bbcCommission, "% BBC brokerage"), /* @__PURE__ */ import_react.default.createElement("div", { style: { marginTop: 5, fontSize: 9, fontWeight: 700, color: "#9ece6a44", background: "rgba(158,206,106,0.08)", padding: "2px 6px", borderRadius: 3, display: "inline-block", letterSpacing: "0.04em" } }, "CASH YIELD \xB7 pre-tax \xB7 from charter hire")), /* @__PURE__ */ import_react.default.createElement("div", { style: { padding: 12, borderRadius: 8, background: "#16161e", border: "1px solid #292e42", textAlign: "center" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 10, color: "#a9b1d6", textTransform: "uppercase", letterSpacing: "0.06em" } }, "\u2461 Tax Shield (Net)"), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 23, fontWeight: 700, color: "#bb9af7", fontFamily: F } }, "$", $d(R.totalStream2 / 1e6, 2), "M"), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 10, color: "#a9b1d6" } }, "Tax saved from depreciation losses"), /* @__PURE__ */ import_react.default.createElement("div", { style: { marginTop: 5, fontSize: 9, fontWeight: 700, color: "#bb9af744", background: "rgba(187,154,247,0.08)", padding: "2px 6px", borderRadius: 3, display: "inline-block", letterSpacing: "0.04em" } }, "TAX ARBITRAGE \xB7 depends on investor tax capacity")), /* @__PURE__ */ import_react.default.createElement("div", { style: { padding: 12, borderRadius: 8, background: "#16161e", border: "1px solid #292e42", textAlign: "center" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 10, color: "#a9b1d6", textTransform: "uppercase", letterSpacing: "0.06em" } }, "\u2462 Residual / PO Play"), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 23, fontWeight: 700, color: "#e0af68", fontFamily: F } }, "$", $d(R.totalStream3 / 1e6, 2), "M"), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 10, color: "#a9b1d6" } }, "PO exercise net of debt & cap gains tax"), /* @__PURE__ */ import_react.default.createElement("div", { style: { marginTop: 5, fontSize: 9, fontWeight: 700, color: "#e0af6844", background: "rgba(224,175,104,0.08)", padding: "2px 6px", borderRadius: 3, display: "inline-block", letterSpacing: "0.04em" } }, "TERMINAL EVENT \xB7 PO exercise at exit"))), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 } }, [
      { l: "Equity Deployed", v: `$${$d(R.totalEquityDeployed / 1e6, 1)}M`, c: "#7aa2f7" },
      { l: "Total Profit", v: `$${$d(R.jolcoProfit / 1e6, 2)}M`, c: R.jolcoProfit >= 0 ? "#9ece6a" : "#f7768e" },
      { l: "Equity IRR", v: pct(R.equityIRR), c: "#e0af68", sub: "hire + residual" },
      { l: "Blended IRR", v: pct(R.blendedIRR), c: R.spread > 0 ? "#9ece6a" : "#f7768e", sub: "incl. tax shield" },
      { l: "vs UST", v: R.spread != null ? (R.spread > 0 ? "+" : "") + (R.spread * 1e4).toFixed(0) + "bps" : "\u2014", c: R.spread > 0 ? "#9ece6a" : "#f7768e" }
    ].map((x, i) => /* @__PURE__ */ import_react.default.createElement("div", { key: i, style: { textAlign: "center" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 10, color: "#a9b1d6", textTransform: "uppercase" } }, x.l), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 19, fontWeight: 700, color: x.c, fontFamily: F } }, x.v))))), /* @__PURE__ */ import_react.default.createElement("div", { style: C }, H("#9ece6a", "Vessel & Structure"), /* @__PURE__ */ import_react.default.createElement("div", { style: { marginBottom: 12 } }, /* @__PURE__ */ import_react.default.createElement("label", { style: { display: "block", fontSize: 11, fontWeight: 600, color: "#7aa2f7", letterSpacing: "0.05em", marginBottom: 3, fontFamily: F, textTransform: "uppercase" } }, "Vessel Type"), /* @__PURE__ */ import_react.default.createElement("select", { value: vesselTypeId, onChange: (e) => setVesselTypeId(e.target.value), style: { width: "100%", padding: "7px 8px", borderRadius: 5, border: "1px solid #3b4261", background: "#1a1b26", color: "#c0caf5", fontSize: 13, fontFamily: F } }, VESSEL_DB.map((v) => /* @__PURE__ */ import_react.default.createElement("option", { key: v.id, value: v.id }, v.label, " (JP:", v.jpLife, "yr / For:", v.forLife, "yr)")))), /* @__PURE__ */ import_react.default.createElement("div", { style: { marginBottom: 12 } }, /* @__PURE__ */ import_react.default.createElement("label", { style: { display: "block", fontSize: 11, fontWeight: 600, color: "#7aa2f7", letterSpacing: "0.05em", marginBottom: 3, fontFamily: F, textTransform: "uppercase" } }, "Flag State (SPC Registration)"), /* @__PURE__ */ import_react.default.createElement("select", { value: flagId, onChange: (e) => setFlagId(e.target.value), style: { width: "100%", padding: "7px 8px", borderRadius: 5, border: "1px solid #3b4261", background: "#1a1b26", color: "#c0caf5", fontSize: 13, fontFamily: F } }, FLAG_OPTIONS.map((f) => /* @__PURE__ */ import_react.default.createElement("option", { key: f.id, value: f.id }, f.label))), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 10, color: "#a9b1d6", marginTop: 2 } }, flagInfo.desc, " \xB7 Special depr: ", flagInfo.specialMin, "\u2013", flagInfo.specialMax, "%")), /* @__PURE__ */ import_react.default.createElement("div", { style: { padding: 10, borderRadius: 6, background: "#1e2030", border: "1px solid #292e42", marginBottom: 10 } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 10, color: "#a9b1d6", textTransform: "uppercase", marginBottom: 3 } }, "Statutory Useful Life"), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", alignItems: "baseline", gap: 8 } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 25, fontWeight: 700, color: "#9ece6a", fontFamily: F } }, usefulLife, /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 12, color: "#a9b1d6" } }, "yr")), /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 11, color: "#a9b1d6" } }, "DB: ", (dbRate * 100).toFixed(1), "% \xB7 SL: ", (1 / usefulLife * 100).toFixed(2), "%")), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 10, color: "#a9b1d6", marginTop: 2 } }, "MOF: ", vType.cat, isJPFlag ? "" : " (foreign: \u305D\u306E\u4ED6\u306E\u3082\u306E 12yr flat)")), /* @__PURE__ */ import_react.default.createElement(Inp, { label: "Vessel Price", value: vesselPrice, onChange: setVesselPrice, unit: "$M" }), /* @__PURE__ */ import_react.default.createElement(Inp, { label: "Debt / Equity Split (Debt %)", value: debtPct, onChange: setDebtPct, unit: "%", help: `${debtPct}% bank debt \xB7 ${100 - debtPct}% TK equity`, min: 0, max: 95 }), /* @__PURE__ */ import_react.default.createElement(Inp, { label: "Sale Commission", value: saleCommission, onChange: setSaleCommission, unit: "%", help: "Vessel purchase brokerage \xB7 paid upfront at Year 0", step: 0.25 }), /* @__PURE__ */ import_react.default.createElement(Inp, { label: "BBC Commission", value: bbcCommission, onChange: setBbcCommission, unit: "%", help: "Annual bareboat charter brokerage on gross hire", step: 0.25 }), /* @__PURE__ */ import_react.default.createElement("div", { style: { padding: 10, borderRadius: 6, background: "#1e2030", border: "1px solid #292e42", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 } }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 10, color: "#a9b1d6" } }, "EQUITY (", 100 - debtPct, "%)"), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 15, fontWeight: 700, color: "#7aa2f7", fontFamily: F } }, "$", $d(R.equity / 1e6, 1), "M")), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 10, color: "#f7768e" } }, "+SALE COMM"), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 15, fontWeight: 700, color: "#f7768e", fontFamily: F } }, "$", $d(R.saleCommCost / 1e6, 2), "M")), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 10, color: "#a9b1d6" } }, "DEBT (", debtPct, "%)"), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 15, fontWeight: 700, color: "#e0af68", fontFamily: F } }, "$", $d(R.debt / 1e6, 1), "M")))), /* @__PURE__ */ import_react.default.createElement("div", { style: C }, H("#7aa2f7", "Charter & Interest"), /* @__PURE__ */ import_react.default.createElement(Inp, { label: "Amortization Period", value: amortYrs, onChange: setAmortYrs, unit: "yrs", help: "Fixed hire = VP \xF7 this. Can differ from lease term \u2014 longer amort = lower hire, larger PO residual at exit", min: 1, max: 25 }), /* @__PURE__ */ import_react.default.createElement(Inp, { label: "Lease (BBC) Term", value: leaseTerm, onChange: (v) => {
      setLeaseTerm(v);
      setPoLastYear(v);
      setExerciseYear(v);
      if (poFirstYear > v) setPoFirstYear(Math.max(1, v - 1));
    }, unit: "yrs", help: "BBC duration \u2014 how long charterer pays hire. Often shorter than amort period. Last PO / obligation syncs to this.", min: 1, max: 25 }), /* @__PURE__ */ import_react.default.createElement("div", { style: { padding: "6px 8px", borderRadius: 4, background: "#1e2030", marginBottom: 8, fontSize: 10, color: "#a9b1d6", lineHeight: 1.5 } }, amortYrs !== leaseTerm && /* @__PURE__ */ import_react.default.createElement("span", { style: { color: amortYrs > leaseTerm ? "#e0af68" : "#f7768e" } }, amortYrs > leaseTerm ? `\u26A1 Amort ${amortYrs}yr > Lease ${leaseTerm}yr \u2014 lower hire, outstanding balance of ~$${$d(vesselPrice * 1e6 * (1 - leaseTerm / amortYrs) / 1e6, 2)}M settled via PO at exit` : `\u26A0 Amort ${amortYrs}yr < Lease ${leaseTerm}yr \u2014 vessel is fully amortized before lease ends; no residual debt at PO`), amortYrs === leaseTerm && /* @__PURE__ */ import_react.default.createElement("span", null, "Amort period = Lease term (", amortYrs, "yr) \u2014 debt fully repaid at lease end, minimal PO residual")), /* @__PURE__ */ import_react.default.createElement("div", { style: { marginTop: 10, marginBottom: 4, fontSize: 10, fontWeight: 700, color: "#e0af68", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid #292e42", paddingBottom: 4 } }, "Bank Loan \u2014 JPY (SPC borrows from Japanese bank)"), /* @__PURE__ */ import_react.default.createElement(Inp, { label: "JPY Base Rate (TONA/TIBOR)", value: jpyBaseRate, onChange: setJpyBaseRate, unit: "%", step: 0.05, help: "Near-zero JPY policy rate \xB7 typically 0.05\u20130.50%" }), /* @__PURE__ */ import_react.default.createElement(Inp, { label: "Bank Spread over JPY Base", value: bankSpreadBps, onChange: setBankSpreadBps, unit: "bps", step: 5, help: "Credit spread charged by lending bank" }), /* @__PURE__ */ import_react.default.createElement(Inp, { label: "USD/JPY Cross-Currency Swap Cost", value: swapCostBps, onChange: setSwapCostBps, unit: "bps", step: 5, help: "Cost to swap JPY loan obligation into USD cash flows" }), /* @__PURE__ */ import_react.default.createElement("div", { style: { padding: "6px 8px", borderRadius: 4, background: "#1e2030", marginBottom: 10, fontSize: 10, color: "#a9b1d6" } }, "Effective USD cost of bank debt: ", /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#e0af68", fontWeight: 700 } }, (jpyBaseRate + bankSpreadBps / 100 + swapCostBps / 100).toFixed(2), "%"), " \xB7 JPY ", (jpyBaseRate + bankSpreadBps / 100).toFixed(2), "% + ", swapCostBps, "bps swap"), /* @__PURE__ */ import_react.default.createElement("div", { style: { marginBottom: 4, fontSize: 10, fontWeight: 700, color: "#7aa2f7", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid #292e42", paddingBottom: 4 } }, "BBC Hire Rate \u2014 USD (SPC lends to charterer)"), /* @__PURE__ */ import_react.default.createElement(Inp, { label: "SOFR Rate (USD)", value: sofrRate, onChange: setSofrRate, unit: "%", step: 0.1, help: "USD reference rate for BBC hire calculation" }), /* @__PURE__ */ import_react.default.createElement(Inp, { label: "Equity Spread over SOFR", value: spreadBps, onChange: setSpreadBps, unit: "bps", step: 10, help: "Spread reflecting charterer credit + vessel risk" }), (() => {
      const mFixed = R.monthlyFixed;
      const mVariableBank = R.debt * R.bankAllInRate / 12;
      const mVariableEquity = R.equity * R.equityAllInRate / 12;
      const mVariable = mVariableBank + mVariableEquity;
      const mTotal = mFixed + mVariable;
      return /* @__PURE__ */ import_react.default.createElement("div", { style: { padding: 10, borderRadius: 6, background: "#1e2030", border: "1px solid #292e42" } }, [
        { label: "Scheduled Amortization Component (rate-insensitive)", val: mFixed, color: "#9ece6a", sub: `VP \xF7 ${amortYrs}yr \xF7 12 \xB7 does not move with SOFR or JPY rates` },
        { label: "Financing Return Component \u2014 Bank (JPY\u2192USD \xB7 Yr1)", val: mVariableBank, color: "#e0af68", sub: `${(R.bankAllInRate * 100).toFixed(2)}% effective on ${$d(R.debt / 1e6, 1)}M bank bal. (${jpyBaseRate}% JPY + ${bankSpreadBps}bps + ${swapCostBps}bps swap) \xB7 tied to JPY base + swap` },
        { label: "Financing Return Component \u2014 Equity (USD \xB7 Yr1)", val: mVariableEquity, color: "#7aa2f7", sub: `${(R.equityAllInRate * 100).toFixed(2)}% on ${$d(R.equity / 1e6, 1)}M equity bal. (SOFR ${sofrRate}% + ${spreadBps}bps) \xB7 tied to SOFR` },
        { label: "Total Monthly Hire (Yr 1)", val: mTotal, color: "#bb9af7", sub: "Amortization + Financing Return (Bank + Equity) \xB7 total cost to charterer" }
      ].map((row, i, arr) => /* @__PURE__ */ import_react.default.createElement("div", { key: i, style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: 8, marginBottom: i < arr.length - 1 ? 8 : 0, borderBottom: i < arr.length - 1 ? "1px solid #292e42" : "none" } }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 10, color: "#a9b1d6", textTransform: "uppercase", marginBottom: 1 } }, row.label), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 9, color: "#6b7299" } }, row.sub)), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 17, fontWeight: 700, color: row.color, fontFamily: F, whiteSpace: "nowrap", marginLeft: 8 } }, "$", $(row.val), /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 10, color: "#a9b1d6" } }, "/mo")))));
    })()), /* @__PURE__ */ import_react.default.createElement("div", { style: C }, H("#bb9af7", "Purchase Options & Tax"), /* @__PURE__ */ import_react.default.createElement("div", { style: { marginBottom: 10 } }, /* @__PURE__ */ import_react.default.createElement(Inp, { label: "Lock-In Period", value: lockInPeriod, onChange: (v) => {
      setLockInPeriod(v);
      if (poFirstYear < v + 1) setPoFirstYear(v + 1);
      if (exerciseYear < v + 1) setExerciseYear(v + 1);
    }, unit: "yrs", min: 0, max: poLastYear - 1, help: `BBC may not exercise PO before Year ${lockInPeriod + 1}. First permissible exercise: Year ${lockInPeriod + 1}.` }), lockInPeriod > 0 && /* @__PURE__ */ import_react.default.createElement("div", { style: { marginTop: 4, padding: "5px 8px", borderRadius: 4, background: "rgba(187,154,247,0.08)", border: "1px solid #bb9af744", fontSize: 10, color: "#bb9af7", lineHeight: 1.5 } }, "Locked: Yrs 1\u2013", lockInPeriod, " \xB7 First exercise: Yr ", lockInPeriod + 1)), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 } }, /* @__PURE__ */ import_react.default.createElement(Inp, { label: "First PO Year", value: poFirstYear, onChange: (v) => {
      const clamped = Math.max(v, lockInPeriod + 1);
      setPoFirstYear(clamped);
      if (exerciseYear < clamped) setExerciseYear(clamped);
    }, unit: "", min: lockInPeriod + 1, max: poLastYear }), /* @__PURE__ */ import_react.default.createElement(Inp, { label: "Last Year (Oblig.)", value: poLastYear, onChange: (v) => {
      setPoLastYear(v);
      if (exerciseYear > v) setExerciseYear(v);
    }, unit: "", min: effectivePOFirstYear, max: 25 })), /* @__PURE__ */ import_react.default.createElement("div", { style: { marginBottom: 10 } }, /* @__PURE__ */ import_react.default.createElement("label", { style: { display: "block", fontSize: 11, fontWeight: 600, color: "#7aa2f7", letterSpacing: "0.05em", marginBottom: 3, fontFamily: F, textTransform: "uppercase" } }, "Exercise at Year"), /* @__PURE__ */ import_react.default.createElement("select", { value: exerciseYear, onChange: (e) => setExerciseYear(parseInt(e.target.value)), style: { width: "100%", padding: "7px 8px", borderRadius: 5, border: `1px solid ${effectiveExerciseYear > amortYrs ? "#f7768e" : "#7aa2f7"}`, background: "#1a1b26", color: "#c0caf5", fontSize: 13, fontFamily: F } }, poSchedule.map((p) => /* @__PURE__ */ import_react.default.createElement("option", { key: p.yr, value: p.yr }, "Year ", p.yr, " \u2014 $", $d(p.price, 1), "M ", p.obligatory ? "(Obligation)" : ""))), effectiveExerciseYear > amortYrs && /* @__PURE__ */ import_react.default.createElement("div", { style: { marginTop: 5, padding: "6px 8px", borderRadius: 4, background: "rgba(247,118,142,0.1)", border: "1px solid #f7768e44", fontSize: 10, color: "#f7768e", lineHeight: 1.5 } }, "\u26A0 Exercise year (", effectiveExerciseYear, ") exceeds amortization period (", amortYrs, " yrs). After year ", amortYrs, " all balances are zero \u2014 hire, interest, and residual will be zero. Extend the amortization period or reduce the exercise year.")), /* @__PURE__ */ import_react.default.createElement("div", { style: { marginBottom: 10, padding: "8px 10px", borderRadius: 6, border: `1px solid ${poPremium !== 0 ? "#9ece6a55" : "#3b4261"}`, background: poPremium !== 0 ? "rgba(158,206,106,0.04)" : "transparent" } }, /* @__PURE__ */ import_react.default.createElement("label", { style: { display: "block", fontSize: 11, fontWeight: 600, color: "#9ece6a", letterSpacing: "0.05em", marginBottom: 4, fontFamily: F, textTransform: "uppercase" } }, "PO Premium ($M)"), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ import_react.default.createElement(
      "input",
      {
        type: "number",
        value: poPremium,
        step: 0.1,
        onChange: (e) => setPoPremium(parseFloat(e.target.value) || 0),
        style: { flex: 1, padding: "7px 9px", borderRadius: 5, border: `1px solid ${poPremium !== 0 ? "#9ece6a" : "#3b4261"}`, background: "#1a1b26", color: poPremium !== 0 ? "#9ece6a" : "#c0caf5", fontSize: 14, fontFamily: F, outline: "none" },
        onFocus: (e) => e.target.style.borderColor = "#9ece6a",
        onBlur: (e) => e.target.style.borderColor = poPremium !== 0 ? "#9ece6a" : "#3b4261"
      }
    ), /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 11, color: "#a9b1d6", minWidth: 24 } }, "$M"), poPremium !== 0 && /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => setPoPremium(0), style: { fontSize: 9, color: "#f7768e", background: "none", border: "none", cursor: "pointer", padding: 0, whiteSpace: "nowrap" } }, "reset to 0")), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 10, color: "#a9b1d6", marginTop: 4, lineHeight: 1.5 } }, "Negotiated margin above the residual financing balance. Added flat at every exercise year. Raises gross Stream 3 but enlarges the cap-gain base \u2192 extra tax = premium \xD7 ", $d(capGainsTaxRate, 2), "% (cap-gains rate) on any amount above book value. Net benefit \u2248 premium \xD7 (1 \u2212 ", $d(capGainsTaxRate, 2), "%).")), /* @__PURE__ */ import_react.default.createElement("div", { style: { padding: 8, borderRadius: 5, background: "#1e2030", marginBottom: 10, fontSize: 10, color: "#a9b1d6", lineHeight: 1.6 } }, /* @__PURE__ */ import_react.default.createElement("strong", { style: { color: "#bb9af7" } }, "PO(N)"), " = max(0, ", $d(vesselPrice, 1), " \u2212 ", $d(effectiveDecline, 3), "\xD7N)", poPremium !== 0 ? /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#9ece6a" } }, " + ", $d(poPremium, 2)) : null, " \xB7 ", "Cap-gain tax = max(0, PO \u2212 book value) \xD7 ", /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#f7768e" } }, $d(capGainsTaxRate, 2), "%"), ".", " ", "Override any row below for non-linear schedules."), lockInPeriod > 0 && /* @__PURE__ */ import_react.default.createElement("div", { style: { marginBottom: 6 } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 9, color: "#a9b1d6", display: "flex", gap: 4, marginBottom: 4, fontFamily: F } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { width: 32 } }, "YEAR"), /* @__PURE__ */ import_react.default.createElement("span", { style: { flex: 1 } }, "STATUS")), Array.from({ length: lockInPeriod }, (_, i) => i + 1).map((yr) => /* @__PURE__ */ import_react.default.createElement("div", { key: yr, style: { display: "flex", alignItems: "center", gap: 5, marginBottom: 2, padding: "3px 4px", borderRadius: 4, background: "rgba(247,118,142,0.04)", border: "1px solid #f7768e22" } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 11, color: "#f7768e88", fontFamily: F, width: 32 } }, "Yr", yr), /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 10, color: "#f7768e88", fontStyle: "italic" } }, "\u2014 locked (no exercise permitted)"), /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 8, color: "#f7768e66", marginLeft: "auto", fontFamily: F } }, "LOCK")))), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 9, color: "#a9b1d6", display: "flex", gap: 4, marginBottom: 4, fontFamily: F } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { width: 32 } }, "YEAR"), /* @__PURE__ */ import_react.default.createElement("span", { style: { width: 76 } }, "PO PRICE"), /* @__PURE__ */ import_react.default.createElement("span", { style: { flex: 1 } }, "STATUS")), poSchedule.map((p, i) => /* @__PURE__ */ import_react.default.createElement("div", { key: i, style: { display: "flex", alignItems: "center", gap: 5, marginBottom: 2, padding: "3px 4px", borderRadius: 4, background: p.yr === effectiveExerciseYear ? "rgba(122,162,247,0.08)" : "transparent" } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 11, color: p.yr === effectiveExerciseYear ? "#7aa2f7" : "#a9b1d6", fontFamily: F, width: 32, fontWeight: p.yr === effectiveExerciseYear ? 700 : 400 } }, "Yr", p.yr), /* @__PURE__ */ import_react.default.createElement(
      "input",
      {
        type: "number",
        value: p.price,
        step: 0.1,
        onChange: (e) => {
          const val = parseFloat(e.target.value);
          if (!isNaN(val)) setPoOverrides((prev) => ({ ...prev, [p.yr]: val }));
        },
        style: { width: 68, padding: "3px 6px", borderRadius: 4, border: `1px solid ${p.isOverridden ? "#bb9af7" : "#3b4261"}`, background: "#1a1b26", color: p.isOverridden ? "#bb9af7" : "#c0caf5", fontSize: 12, fontFamily: F }
      }
    ), /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 10, color: "#a9b1d6" } }, "$M"), p.isOverridden && /* @__PURE__ */ import_react.default.createElement(
      "button",
      {
        onClick: () => setPoOverrides((prev) => {
          const n = { ...prev };
          delete n[p.yr];
          return n;
        }),
        style: { fontSize: 9, color: "#f7768e", background: "none", border: "none", cursor: "pointer", padding: 0 }
      },
      "reset"
    ), /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 8, color: p.obligatory ? "#f7768e" : p.yr === effectiveExerciseYear ? "#7aa2f7" : "#a9b1d6", marginLeft: "auto", fontFamily: F } }, p.obligatory ? "OBLIG" : p.yr === effectiveExerciseYear ? "\u25C0 EXIT" : "OPT"))), /* @__PURE__ */ import_react.default.createElement("div", { style: { marginTop: 10, borderTop: "1px solid #292e42", paddingTop: 10 } }, /* @__PURE__ */ import_react.default.createElement(Inp, { label: "Ordinary Income Tax Rate", value: taxRate, onChange: setTaxRate, unit: "%", help: `${taxRate}% \xB7 std JP corp (23.2%) + local + defense surtax. Applied to Stream 2 (tax shield on hire income / depreciation losses).`, step: 0.01 }), /* @__PURE__ */ import_react.default.createElement(Inp, { label: "Cap-Gains Tax Rate (PO)", value: capGainsTaxRate, onChange: setCapGainsTaxRate, unit: "%", help: "Applied to Stream 3: max(0, PO price \u2212 tax book value). Default 20.315% = JP individual rate (15.315% national incl. 2.1% reconstruction surtax + 5% local inhabitant tax). Adjust for corporate investors (30.62%) or treaty scenarios.", step: 0.01 }), /* @__PURE__ */ import_react.default.createElement(Inp, { label: "US Treasury Yield", value: treasuryYield, onChange: setTreasuryYield, unit: "%", step: 0.01 }), /* @__PURE__ */ import_react.default.createElement(Inp, { label: "JP Tax on Foreign Interest", value: foreignInterestTaxPct, onChange: setForeignInterestTaxPct, unit: "%", step: 0.01, help: "JP SME corp rate ~27%, large corp 30.62%. No preferential rate for corps on foreign interest. US charges 0% (Portfolio Interest Exemption, IRC \xA7871h)." }), /* @__PURE__ */ import_react.default.createElement(Slider, { label: "Special Depreciation (Yr1)", value: specialDeprPct, onChange: (v) => setSpecialDeprPct(Math.min(v, flagInfo.specialMax)), min: 0, max: flagInfo.specialMax, step: 1, unit: "%", help: `MLIT advanced vessels: ${flagInfo.specialMin}\u2013${flagInfo.specialMax}% for ${flagInfo.label}` })))), tab === "depr" && /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 } }, /* @__PURE__ */ import_react.default.createElement("div", { style: C }, H("#bb9af7", `Depreciation Scale \u2014 ${vType.label}`), /* @__PURE__ */ import_react.default.createElement("div", { style: { padding: "8px 10px", borderRadius: 5, background: "#1e2030", marginBottom: 12, fontSize: 10, color: "#a9b1d6", lineHeight: 1.6 } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#e0af68", fontWeight: 700 } }, "DB (\u5B9A\u7387\u6CD5)"), " applies ", /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#e0af68" } }, "2 \xF7 useful life"), " as a rate to the ", /* @__PURE__ */ import_react.default.createElement("em", null, "remaining"), " book value each year \u2014 front loads depreciation. Switches to ", /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#9ece6a", fontWeight: 700 } }, "SL (\u5B9A\u984D\u6CD5)"), " the moment straight line on remaining balance beats DB, per MOF post FY2012 rules. The MOF only sets the useful life; this schedule is the computed output."), /* @__PURE__ */ import_react.default.createElement(Slider, { label: "Special Depreciation Rate", value: specialDeprPct, onChange: (v) => setSpecialDeprPct(Math.min(v, flagInfo.specialMax)), min: 0, max: flagInfo.specialMax, step: 1, unit: "%", help: `${flagInfo.specialMin}\u2013${flagInfo.specialMax}% for ${flagInfo.label} \xB7 slide to see how Yr1 bonus changes the IRR` }), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", gap: 12, marginBottom: 12, fontSize: 11 } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { display: "flex", alignItems: "center", gap: 4 } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { width: 12, height: 8, borderRadius: 2, background: "#7aa2f7", display: "inline-block" } }), " Ordinary"), specialDeprPct > 0 && /* @__PURE__ */ import_react.default.createElement("span", { style: { display: "flex", alignItems: "center", gap: 4 } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { width: 12, height: 8, borderRadius: 2, background: "#bb9af7", display: "inline-block" } }), " Special")), (() => {
      const mx = Math.max(...R.depr.map((d) => d.total));
      return R.depr.map((d, i) => {
        const ordW = d.ordinary / mx * 100;
        const specW = d.special / mx * 100;
        const pctOfVessel = d.total / R.VP * 100;
        const inLease = d.yr <= effectiveExerciseYear;
        return /* @__PURE__ */ import_react.default.createElement("div", { key: i, style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 3, opacity: inLease ? 1 : 0.4 } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { width: 20, fontSize: 11, color: "#a9b1d6", fontFamily: F, textAlign: "right" } }, d.yr), /* @__PURE__ */ import_react.default.createElement("div", { style: { flex: 1, height: 22, background: "#16161e", borderRadius: 4, position: "relative", overflow: "hidden" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { position: "absolute", left: 0, top: 0, height: "100%", width: `${ordW}%`, background: "#7aa2f7", borderRadius: "4px 0 0 4px" } }), /* @__PURE__ */ import_react.default.createElement("div", { style: { position: "absolute", left: `${ordW}%`, top: 0, height: "100%", width: `${specW}%`, background: "#bb9af7" } }), /* @__PURE__ */ import_react.default.createElement("span", { style: { position: "absolute", right: 6, top: 3, fontSize: 10, fontFamily: F, color: "#c0caf5" } }, pctOfVessel.toFixed(1), "%")), /* @__PURE__ */ import_react.default.createElement("div", { style: { width: 65, fontSize: 11, color: "#a9b1d6", fontFamily: F, textAlign: "right" } }, "$", $(d.total)), /* @__PURE__ */ import_react.default.createElement("div", { style: { width: 20, fontSize: 10, color: d.method === "DB" ? "#e0af68" : "#9ece6a", fontFamily: F } }, d.method));
      });
    })(), /* @__PURE__ */ import_react.default.createElement("div", { style: { marginTop: 14, padding: 10, borderRadius: 6, background: "#1e2030", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 } }, [
      { l: "Yr1 Total", v: `${(R.depr[0]?.total / R.VP * 100).toFixed(1)}%`, c: "#bb9af7" },
      { l: "3yr Cumul", v: `${(R.depr.slice(0, 3).reduce((s, d) => s + d.total, 0) / R.VP * 100).toFixed(1)}%`, c: "#7aa2f7" },
      { l: "Tax Shield (Lease)", v: `$${$d(R.totalStream2 / 1e6, 2)}M`, c: "#9ece6a" },
      { l: "DB\u2192SL", v: `Yr ${R.depr.findIndex((d) => d.method === "SL") + 1 || "N/A"}`, c: "#e0af68" }
    ].map((x, i) => /* @__PURE__ */ import_react.default.createElement("div", { key: i, style: { textAlign: "center" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 9, color: "#a9b1d6", textTransform: "uppercase" } }, x.l), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 17, fontWeight: 700, color: x.c, fontFamily: F } }, x.v))))), /* @__PURE__ */ import_react.default.createElement("div", { style: C }, H("#e0af68", "MOF Rate Index"), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 10, color: "#a9b1d6", marginBottom: 8 } }, "\u8010\u7528\u5E74\u6570\u7701\u4EE4 \u5225\u8868\u7B2C\u4E00 \xB7 Click to select"), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", gap: 4, marginBottom: 6, fontSize: 9, color: "#a9b1d6", fontFamily: F } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { flex: 1 } }, "VESSEL TYPE"), /* @__PURE__ */ import_react.default.createElement("div", { style: { width: 32, textAlign: "right" } }, "JP"), /* @__PURE__ */ import_react.default.createElement("div", { style: { width: 32, textAlign: "right" } }, "FOR"), /* @__PURE__ */ import_react.default.createElement("div", { style: { width: 42, textAlign: "right" } }, "DB%")), VESSEL_DB.map((v, i) => {
      const isActive = v.id === vesselTypeId;
      const life = isJPFlag ? v.jpLife : v.forLife;
      const yr1 = 2 / life * 100;
      return /* @__PURE__ */ import_react.default.createElement("div", { key: v.id, onClick: () => setVesselTypeId(v.id), style: { display: "flex", alignItems: "center", gap: 4, padding: "4px 6px", borderRadius: 4, marginBottom: 2, cursor: "pointer", background: isActive ? "rgba(122,162,247,0.08)" : "transparent" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { flex: 1, fontSize: 10, color: isActive ? "#7aa2f7" : "#a9b1d6", fontWeight: isActive ? 700 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, v.label), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 10, fontFamily: F, color: isJPFlag ? "#9ece6a" : "#a9b1d6", width: 32, textAlign: "right", fontWeight: isJPFlag ? 600 : 400 } }, v.jpLife), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 10, fontFamily: F, color: !isJPFlag ? "#9ece6a" : "#a9b1d6", width: 32, textAlign: "right", fontWeight: !isJPFlag ? 600 : 400 } }, v.forLife), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 10, fontFamily: F, color: "#e0af68", width: 42, textAlign: "right" } }, yr1.toFixed(1), "%"));
    }))), tab === "cf" && /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("div", { style: C }, H("#7aa2f7", "The Equation \u2014 How the Economics Work"), (() => {
      const eq = R.totalEquityDeployed;
      const s1 = R.totalStream1;
      const s2 = R.totalStream2;
      const s3 = R.totalStream3;
      const sc = R.saleCommCost;
      const bc = R.totalBbcComm;
      const totalReturned = eq + R.jolcoProfit;
      const principalBack = R.years.reduce((s, y) => s + y.equityPrincipalReturn, 0);
      const profit = R.jolcoProfit;
      const Row = ({ val, label, explain, color, neg = false }) => /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "grid", gridTemplateColumns: "110px 1fr", gap: "0 18px", marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid #1e2030" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { textAlign: "right", fontFamily: F, fontSize: 16, fontWeight: 700, color, paddingTop: 1 } }, neg ? "\u2212" : "+", "\u2009$", $d(Math.abs(val) / 1e6, 2), "M"), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 12, fontWeight: 600, color: "#c0caf5", marginBottom: 2 } }, label), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 10, color: "#a9b1d6", lineHeight: 1.55 } }, explain)));
      return /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement(
        Row,
        {
          val: R.equity,
          neg: true,
          color: "#f7768e",
          label: `Equity In \u2014 ${100 - debtPct}% of Vessel Price`,
          explain: `TK investors (\u533F\u540D\u7D44\u5408\u54E1) put in ${100 - debtPct}% of the vessel cost. The remaining ${debtPct}% is a non-recourse JPY bank loan to the SPC at ${(R.bankAllInRate * 100).toFixed(2)}% all-in USD equivalent (TONA + ${bankSpreadBps}bps spread + ${swapCostBps}bps cross-currency swap). The bank loan is secured by a vessel mortgage and charter hire assignment \u2014 investors are not on the hook for the loan.`
        }
      ), /* @__PURE__ */ import_react.default.createElement(
        Row,
        {
          val: sc,
          neg: true,
          color: "#f7768e",
          label: `Sale Commission \u2014 ${saleCommission}% of Vessel Price`,
          explain: `One-time brokerage on the vessel purchase, paid at Year 0. Industry standard is 1% per broker side (buyer's broker + seller's broker). Reduces the equity invested but is deductible for SPC tax purposes.`
        }
      ), /* @__PURE__ */ import_react.default.createElement("div", { style: { borderTop: "1px dashed #3b4261", margin: "4px 0 12px 0" } }), /* @__PURE__ */ import_react.default.createElement(
        Row,
        {
          val: principalBack,
          color: "#7aa2f7",
          label: "Principal Returned via Fixed Hire",
          explain: `Fixed hire = Vessel Price \xF7 amortization period = $${$(R.monthlyFixed)}/mo. The equity investors' ${100 - debtPct}% share of each annual fixed hire payment = $${$d(principalBack / effectiveExerciseYear / 1e6, 2)}M/yr. This is return OF capital \u2014 not profit. You are simply recovering what you put in.`
        }
      ), /* @__PURE__ */ import_react.default.createElement(
        Row,
        {
          val: s1,
          color: "#9ece6a",
          label: `\u2460 Charter Hire Spread \u2014 SOFR+${spreadBps}bps on equity balance`,
          explain: `Variable hire is charged on the full outstanding vessel balance at the all-in rate (${(R.equityAllInRate * 100).toFixed(2)}%). The bank takes its share to cover JPY loan interest (${(R.bankAllInRate * 100).toFixed(2)}% on ${debtPct}% of balance). The equity investors keep the variable hire on their ${100 - debtPct}% of the outstanding balance. As principal is repaid, this stream declines each year. This is the actual return ON capital.`
        }
      ), /* @__PURE__ */ import_react.default.createElement(
        Row,
        {
          val: bc,
          neg: true,
          color: "#f7768e",
          label: `BBC Commission \u2014 ${bbcCommission}% of Gross Hire`,
          explain: `Annual bareboat charter brokerage paid by the SPC to the shipbroker. BIMCO standard rate for BBC arrangements. Deducted from all hire received before anything reaches equity or bank. Reduces SPC taxable income (deductible expense). Total over ${effectiveExerciseYear}yr lease: $${$d(bc / 1e6, 2)}M.`
        }
      ), /* @__PURE__ */ import_react.default.createElement(
        Row,
        {
          val: s2,
          color: "#bb9af7",
          label: "\u2461 Tax Shield \u2014 Depreciation Loss via TK Pass-Through",
          explain: `The SPC claims Japanese tax depreciation (200% declining balance \u2192 straight-line switch, per MOF Ordinance \u5225\u8868\u7B2C\u4E00) on the full vessel cost. In early years, depreciation exceeds hire income net of bank interest \u2192 SPC records an accounting loss. This loss flows through the TK structure (\u533F\u540D\u7D44\u5408) to each investor's own corporate tax return, directly offsetting their operating profits. Tax saved = loss \xD7 ${taxRate}% corporate rate. In later years the SPC turns profitable and investors owe incremental tax \u2014 Stream \u2461 is the NET over the full term.`
        }
      ), /* @__PURE__ */ import_react.default.createElement(
        Row,
        {
          val: s3,
          color: "#e0af68",
          label: `\u2462 Residual \u2014 PO Exercise at Year ${effectiveExerciseYear}`,
          explain: `At exit, the charterer exercises the purchase option at $${$d(R.poPriceMil / 1e6, 1)}M. The SPC first repays the outstanding bank debt from these proceeds. The balance goes to equity investors, less capital gains tax on (PO price \u2212 tax book value of the vessel at that date). If the PO price is below remaining debt, equity receives nothing from Stream \u2462.`
        }
      ), /* @__PURE__ */ import_react.default.createElement("div", { style: { borderTop: "1px dashed #3b4261", margin: "4px 0 12px 0" } }), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "grid", gridTemplateColumns: "110px 1fr", gap: "0 18px" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { textAlign: "right", fontFamily: F, fontSize: 19, fontWeight: 700, color: profit >= 0 ? "#9ece6a" : "#f7768e", paddingTop: 4 } }, "= $", $d(totalReturned / 1e6, 2), "M"), /* @__PURE__ */ import_react.default.createElement("div", { style: { paddingTop: 4 } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "#c0caf5" } }, "Total Returned \xB7 ", $d(totalReturned / eq, 2), "x MoIC"), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 11, color: "#a9b1d6", marginTop: 3 } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { color: profit >= 0 ? "#9ece6a" : "#f7768e", fontWeight: 700 } }, "$", $d(profit / 1e6, 2), "M net profit"), /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#6b7299" } }, " \xB7 "), /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#e0af68", fontWeight: 700 } }, pct(R.blendedIRR), " blended IRR"), /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#6b7299" } }, " \xB7 "), /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#bb9af7", fontWeight: 700 } }, pct(R.equityIRR), " pre-tax IRR")))));
    })()), /* @__PURE__ */ import_react.default.createElement("div", { style: C }, H("#9ece6a", "Three Return Streams \u2014 Year by Year"), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", gap: 12, marginBottom: 12, fontSize: 11, flexWrap: "wrap" } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#9ece6a" } }, "\u25CF \u2460 Hire Spread (net of BBC comm)"), /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#bb9af7" } }, "\u25CF \u2461 Tax Shield"), /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#e0af68" } }, "\u25CF \u2462 Residual/PO")), /* @__PURE__ */ import_react.default.createElement("div", { style: { overflowX: "auto" } }, /* @__PURE__ */ import_react.default.createElement("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 12 } }, /* @__PURE__ */ import_react.default.createElement("thead", null, /* @__PURE__ */ import_react.default.createElement("tr", { style: { borderBottom: "1px solid #3b4261" } }, ["Yr", "\u2460 Hire Spread", "\u2461 Tax Shield", "\u2462 Residual", "Total CF", "Cumulative"].map((h) => /* @__PURE__ */ import_react.default.createElement("th", { key: h, style: { padding: "6px 8px", textAlign: "right", color: "#a9b1d6", fontFamily: F, fontSize: 10, fontWeight: 600, textTransform: "uppercase" } }, h)))), /* @__PURE__ */ import_react.default.createElement("tbody", null, /* @__PURE__ */ import_react.default.createElement("tr", { style: { borderBottom: "1px solid #1e2030", background: "#1e1e2e" } }, /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "5px 8px", textAlign: "right", fontFamily: F, color: "#c0caf5" } }, "0"), /* @__PURE__ */ import_react.default.createElement("td", { colSpan: 3, style: { padding: "5px 8px", textAlign: "center", color: "#a9b1d6", fontSize: 11 } }, "Equity (", 100 - debtPct, "%) + Sale Comm (", saleCommission, "%)"), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "5px 8px", textAlign: "right", fontFamily: F, color: "#f7768e", fontWeight: 600 } }, "-$", $(R.totalEquityDeployed)), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "5px 8px", textAlign: "right", fontFamily: F, color: "#f7768e" } }, "-$", $(R.totalEquityDeployed))), R.years.map((y, i) => {
      const isExpanded = expandedYear === y.yr;
      return /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, { key: i }, /* @__PURE__ */ import_react.default.createElement("tr", { style: { borderBottom: isExpanded ? "none" : "1px solid #1e2030", background: y.yr === effectiveExerciseYear ? "rgba(122,162,247,0.04)" : "transparent" } }, /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "5px 8px", textAlign: "right", fontFamily: F, color: "#c0caf5" } }, y.yr, y.yr === effectiveExerciseYear && /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#7aa2f7", fontSize: 9, marginLeft: 2 } }, "EXIT")), /* @__PURE__ */ import_react.default.createElement(
        "td",
        {
          onClick: () => setExpandedYear(isExpanded ? null : y.yr),
          style: { padding: "5px 8px", textAlign: "right", fontFamily: F, color: "#9ece6a", cursor: "pointer", textDecoration: "underline", textDecorationStyle: "dotted", textUnderlineOffset: 3 }
        },
        "$",
        $(y.hireSpread - y.bbcCommCost),
        " ",
        /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 9, color: "#a9b1d6" } }, isExpanded ? "\u25B2" : "\u25BC")
      ), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "5px 8px", textAlign: "right", fontFamily: F, color: y.taxShieldThisYear >= 0 ? "#bb9af7" : "#f7768e" } }, y.taxShieldThisYear >= 0 ? `$${$(y.taxShieldThisYear)}` : `-$${$(Math.abs(y.taxShieldThisYear))}`), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "5px 8px", textAlign: "right", fontFamily: F, color: y.residualGain !== 0 ? "#e0af68" : "#a9b1d6" } }, y.residualGain !== 0 ? `$${$(y.residualGain)}` : "\u2014"), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "5px 8px", textAlign: "right", fontFamily: F, color: y.netCF >= 0 ? "#9ece6a" : "#f7768e", fontWeight: 600 } }, "$", $(y.netCF)), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "5px 8px", textAlign: "right", fontFamily: F, color: y.cumulativeEquityCF >= 0 ? "#9ece6a" : "#f7768e" } }, "$", $(y.cumulativeEquityCF))), isExpanded && /* @__PURE__ */ import_react.default.createElement("tr", { style: { borderBottom: "1px solid #1e2030" } }, /* @__PURE__ */ import_react.default.createElement("td", { colSpan: 6, style: { padding: 0 } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { margin: "0 8px 8px", padding: 12, borderRadius: 6, background: "#16161e", border: "1px solid #3b4261" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 11, fontWeight: 700, color: "#c0caf5", marginBottom: 8, fontFamily: F } }, "Year ", y.yr, " \u2014 Full Hire Breakdown"), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontFamily: F, fontSize: 12, lineHeight: 2, color: "#a9b1d6" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", justifyContent: "space-between" } }, /* @__PURE__ */ import_react.default.createElement("span", null, "Total BB Hire Received"), /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#c0caf5", fontWeight: 700 } }, "$", $(y.totalHire))), /* @__PURE__ */ import_react.default.createElement("div", { style: { paddingLeft: 12, fontSize: 11, color: "#a9b1d6" } }, "Sched. Amort.: $", $(y.fixedHire), "/yr (rate-insensitive) \xB7 Financing Return \u2014 Bank: $", $(y.variableHireBank), " (", (R.bankAllInRate * 100).toFixed(2), "% on $", $(y.outstandingDebt + y.bankPrincipal), " JPY bal.) \xB7 Financing Return \u2014 Equity: $", $(y.variableHireEquity), " (", (R.equityAllInRate * 100).toFixed(2), "% on $", $(y.outstandingEquity + y.equityPrincipalReturn), " bal.)"), /* @__PURE__ */ import_react.default.createElement("div", { style: { borderTop: "1px dashed #3b4261", marginTop: 4, paddingTop: 4 } }), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", justifyContent: "space-between" } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#f7768e" } }, "BBC Commission (", bbcCommission, "%)"), /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#f7768e" } }, "-$", $(y.bbcCommCost))), /* @__PURE__ */ import_react.default.createElement("div", { style: { paddingLeft: 12, fontSize: 11, color: "#a9b1d6" } }, "Annual brokerage on gross hire \xB7 Net hire: $", $(y.netHire)), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", justifyContent: "space-between", paddingLeft: 12, fontSize: 11 } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#bb9af7" } }, "BBC comm tax offset (", taxRate.toFixed(2), "% of commission)"), /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#bb9af7" } }, "+$", $(y.bbcCommCost * taxRate / 100))), /* @__PURE__ */ import_react.default.createElement("div", { style: { paddingLeft: 24, fontSize: 10, color: "#a9b1d6" } }, "BBC commission is a deductible SPC expense \u2192 saves ", taxRate.toFixed(2), "% tax on that amount via the TK P&L"), /* @__PURE__ */ import_react.default.createElement("div", { style: { borderTop: "1px dashed #3b4261", marginTop: 4, paddingTop: 4 } }), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", justifyContent: "space-between" } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#f7768e" } }, "To Bank (", debtPct, "%)"), /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#f7768e" } }, "-$", $(y.totalToBank))), /* @__PURE__ */ import_react.default.createElement("div", { style: { paddingLeft: 12, fontSize: 11, color: "#a9b1d6" } }, "Principal: $", $(y.bankPrincipal), " + Interest: $", $(y.bankInterest)), /* @__PURE__ */ import_react.default.createElement("div", { style: { borderTop: "1px dashed #3b4261", marginTop: 4, paddingTop: 4 } }), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", justifyContent: "space-between" } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#9ece6a", fontWeight: 700 } }, "To Equity (", 100 - debtPct, "%)"), /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#9ece6a", fontWeight: 700 } }, "$", $(y.equityPrincipalReturn + y.equityInterestIncome - y.bbcCommCost))), /* @__PURE__ */ import_react.default.createElement("div", { style: { paddingLeft: 12, marginTop: 2 } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 11 } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#7aa2f7" } }, "Principal return (return OF capital)"), /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#7aa2f7" } }, "$", $(y.equityPrincipalReturn))), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 11 } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#9ece6a" } }, "Interest income (return ON capital)"), /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#9ece6a" } }, "$", $(y.equityInterestIncome))), /* @__PURE__ */ import_react.default.createElement("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 11 } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#f7768e" } }, "Less BBC commission"), /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#f7768e" } }, "-$", $(y.bbcCommCost)))))))));
    }), /* @__PURE__ */ import_react.default.createElement("tr", { style: { borderTop: "2px solid #3b4261", background: "#1e2030" } }, /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "7px 8px", textAlign: "right", fontFamily: F, color: "#c0caf5", fontWeight: 700 } }, "\u03A3"), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "7px 8px", textAlign: "right", fontFamily: F, color: "#9ece6a", fontWeight: 700 } }, "$", $(R.totalStream1 - R.totalBbcComm)), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "7px 8px", textAlign: "right", fontFamily: F, color: "#bb9af7", fontWeight: 700 } }, "$", $(R.totalStream2)), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "7px 8px", textAlign: "right", fontFamily: F, color: "#e0af68", fontWeight: 700 } }, "$", $(R.totalStream3)), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "7px 8px", textAlign: "right", fontFamily: F, color: "#c0caf5", fontWeight: 700 } }, "$", $(R.jolcoProfit)), /* @__PURE__ */ import_react.default.createElement("td", { style: { padding: "7px 8px", textAlign: "right", fontFamily: F, color: "#a9b1d6", fontSize: 10 } }, "net of equity"))))), /* @__PURE__ */ import_react.default.createElement("div", { style: { marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 } }, [
      { l: "Equity IRR", v: pct(R.equityIRR), s: "Hire + Residual only", c: "#e0af68" },
      { l: "Blended IRR", v: pct(R.blendedIRR), s: "Incl. tax shield", c: R.spread > 0 ? "#9ece6a" : "#f7768e" },
      { l: "MoIC", v: R.totalEquityDeployed > 0 ? $d((R.totalEquityDeployed + R.jolcoProfit) / R.totalEquityDeployed, 2) + "x" : "\u2014", s: "Total returned / equity deployed", c: "#7aa2f7" }
    ].map((x, i) => /* @__PURE__ */ import_react.default.createElement("div", { key: i, style: { textAlign: "center", padding: 12, borderRadius: 8, background: "#16161e" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 10, color: "#a9b1d6", textTransform: "uppercase" } }, x.l), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 23, fontWeight: 700, color: x.c, fontFamily: F } }, x.v), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 9, color: "#a9b1d6", marginTop: 2 } }, x.s)))), /* @__PURE__ */ import_react.default.createElement("div", { style: { marginTop: 12, padding: 14, borderRadius: 8, background: "#16161e", fontSize: 12, color: "#a9b1d6", lineHeight: 1.7 } }, /* @__PURE__ */ import_react.default.createElement("strong", { style: { color: "#c0caf5" } }, "How to read this:"), " The tax shield column shows tax you ", /* @__PURE__ */ import_react.default.createElement("em", null, "didn't have to pay"), " because depreciation created paper losses. In early years it's positive (you're saving tax). In later years when depreciation runs out, it may go negative (you're now paying more tax than you would without the JOLCO). The net effect over the lease term is shown in the \u03A3 row. All three streams together, timed correctly, give you the IRR."), /* @__PURE__ */ import_react.default.createElement("div", { style: { marginTop: 10, padding: 12, borderRadius: 8, background: "rgba(187,154,247,0.06)", border: "1px solid #bb9af733", fontSize: 11, color: "#a9b1d6", lineHeight: 1.6 } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { color: "#bb9af7", fontWeight: 700 } }, "\u26A0 Tax capacity caveat:"), " The Blended IRR assumes the investor has sufficient taxable income from other sources to fully absorb depreciation losses every year. If the investor's tax capacity is limited in any given year (e.g. they are already in a loss position), the Stream \u2461 benefit will be deferred or lost entirely, and actual returns will be lower than shown."))), tab === "vs" && /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("div", { style: { ...C, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { padding: 18, borderRadius: 10, background: "#16161e", border: "1px solid #292e42" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 10, color: "#a9b1d6", textTransform: "uppercase", marginBottom: 6 } }, "JOLCO Equity \u2014 Where the money comes from"), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 33, fontWeight: 700, color: "#9ece6a", fontFamily: F } }, pct(R.blendedIRR)), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 11, color: "#a9b1d6", marginBottom: 12 } }, "Equity IRR (all 3 streams combined)"), [
      { l: `Equity Deployed (${100 - debtPct}%+comm)`, v: `$${$d(R.totalEquityDeployed / 1e6, 2)}M`, c: "#7aa2f7" },
      { l: "\u2460 Hire Spread (net BBC comm)", v: `$${$d((R.totalStream1 - R.totalBbcComm) / 1e6, 2)}M`, c: "#9ece6a" },
      { l: "\u2461 Tax Shield (Net)", v: `$${$d(R.totalStream2 / 1e6, 2)}M`, c: "#bb9af7" },
      { l: "\u2462 Residual / PO", v: `$${$d(R.totalStream3 / 1e6, 2)}M`, c: "#e0af68" },
      { l: "Total Profit", v: `$${$d(R.jolcoProfit / 1e6, 2)}M`, c: R.jolcoProfit >= 0 ? "#9ece6a" : "#f7768e" },
      { l: "MoIC", v: $d((R.totalEquityDeployed + R.jolcoProfit) / R.totalEquityDeployed, 2) + "x" }
    ].map((r, i) => /* @__PURE__ */ import_react.default.createElement("div", { key: i, style: { display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid #1e2030" } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 11, color: "#a9b1d6" } }, r.l), /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 12, fontWeight: 600, color: r.c || "#c0caf5", fontFamily: F } }, r.v)))), /* @__PURE__ */ import_react.default.createElement("div", { style: { padding: 18, borderRadius: 10, background: "#16161e", border: "1px solid #292e42" } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 10, color: "#a9b1d6", textTransform: "uppercase", marginBottom: 6 } }, "US Treasury \u2014 Risk-Free Alternative (post-tax)"), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 33, fontWeight: 700, color: "#7aa2f7", fontFamily: F } }, $d(R.treasPostTaxYield, 2), "%"), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 11, color: "#a9b1d6", marginBottom: 4 } }, effectiveExerciseYear, "Y compound \xB7 Same equity deployed"), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 10, color: "#a9b1d6", marginBottom: 12, padding: "4px 6px", borderRadius: 3, background: "#1e2030" } }, "Pre-tax: ", $d(treasuryYield, 2), "% \xD7 (1 \u2212 ", $d(foreignInterestTaxPct, 2), "% JP corp tax) = ", $d(R.treasPostTaxYield, 2), "% after tax.", /* @__PURE__ */ import_react.default.createElement("br", null), "US charges 0% withholding on Treasuries (Portfolio Interest Exemption, IRC \xA7871h). Japan taxes at full corp rate \u2014 no preferential rate for corps on foreign interest. ~27% for SME TK investors, 30.62% for large corp."), [
      { l: "Capital", v: `$${$d(R.totalEquityDeployed / 1e6, 2)}M` },
      { l: "Terminal (post-tax compounded)", v: `$${$d(R.treasTerminal / 1e6, 2)}M` },
      { l: "Profit", v: `$${$d(R.treasProfit / 1e6, 2)}M`, c: "#7aa2f7" },
      { l: "MoIC", v: $d(R.treasTerminal / R.totalEquityDeployed, 2) + "x" }
    ].map((r, i) => /* @__PURE__ */ import_react.default.createElement("div", { key: i, style: { display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid #1e2030" } }, /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 11, color: "#a9b1d6" } }, r.l), /* @__PURE__ */ import_react.default.createElement("span", { style: { fontSize: 12, fontWeight: 600, color: r.c || "#c0caf5", fontFamily: F } }, r.v))))), /* @__PURE__ */ import_react.default.createElement("div", { style: { ...C, textAlign: "center", padding: 22, background: R.spread > 0 ? "linear-gradient(135deg, rgba(158,206,106,0.06), #1a1b26)" : "linear-gradient(135deg, rgba(247,118,142,0.06), #1a1b26)", border: `1px solid ${R.spread > 0 ? "#9ece6a33" : "#f7768e33"}` } }, /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 10, color: "#a9b1d6", textTransform: "uppercase" } }, "Spread over Risk-Free"), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 29, fontWeight: 700, fontFamily: F, color: R.spread > 0 ? "#9ece6a" : "#f7768e" } }, R.spread != null ? (R.spread > 0 ? "+" : "") + (R.spread * 1e4).toFixed(0) + " bps" : "\u2014"), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 11, color: "#a9b1d6", marginTop: 2 } }, R.spread != null ? `(${pct(R.blendedIRR)} equity IRR vs ${$d(R.treasPostTaxYield, 2)}% UST after-tax)` : ""), /* @__PURE__ */ import_react.default.createElement("div", { style: { fontSize: 12, color: "#a9b1d6", marginTop: 8 } }, R.spread > 0.03 ? "Strong premium over risk-free. JOLCO structure adding clear value." : R.spread > 0.015 ? "Moderate premium. Reasonable for investment-grade charterer credit." : R.spread > 5e-3 ? "Thin spread. Marginal compensation for vessel risk and illiquidity." : R.spread > 0 ? "Negligible. Barely above risk-free." : R.spread != null ? "Below risk-free. Owner loses versus US Treasuries." : "")))));
  }
})();
/*! Bundled license information:

react/cjs/react.development.js:
  (**
   * @license React
   * react.development.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
