/* globals angular */

angular.module("xavientClientSideLogging", [])

    .config(["$provide", function ($provide) {
        $provide.provider("$log", function $UsersnapLogProvider() {
            var debug = true, self = this;
            var registerError = false;
            var registerService = undefined;
            /**
             * @ngdoc method
             * @name $logProvider#debugEnabled
             * @description
             * @param {boolean=}
             *            flag enable or disable debug level messages
             * @returns {*} current value if used as getter or itself (chaining) if used as setter
             */

            this.registerEnabled = function (flag, callback) {
                if (angular.isDefined(registerError)) {
                    registerError = flag;
                    registerService = callback;
                    return this;
                } else {
                    return registerError;
                }
            };
            this.debugEnabled = function (flag) {
                debugger;
                if (angular.isDefined(flag)) {
                    debug = flag;
                    return this;
                } else {
                    return debug;
                }
            };

            this.$get = ['$window', function ($window) {
                return {

                    /**
                     * @ngdoc method
                     * @name $log#log
                     *
                     * @description Write a log message
                     */
                    log: consoleLog('log'),

                    /**
                     * @ngdoc method
                     * @name $log#info
                     *
                     * @description Write an information message
                     */
                    info: consoleLog('info'),

                    /**
                     * @ngdoc method
                     * @name $log#warn
                     *
                     * @description Write a warning message
                     */
                    warn: consoleLog('warn'),

                    /**
                     * @ngdoc method
                     * @name $log#error
                     *
                     * @description Write an error message
                     */
                    error: consoleLog('error'),

                    /**
                     * @ngdoc method
                     * @name $log#debug
                     *
                     * @description Write a debug message
                     */
                    debug: (function () {
                        var fn = consoleLog('debug');

                        return function () {
                            if (debug) {
                                fn.apply(self, arguments);
                            }
                        };
                    }())
                };

                function formatError(arg) {
                    if (arg instanceof Error) {
                        if (arg.stack) {
                            arg = (arg.message && arg.stack.indexOf(arg.message) === -1) ? 'Error: ' +
                                arg.message + '\n' + arg.stack : arg.stack;
                        } else if (arg.sourceURL) {
                            arg = arg.message + '\n' + arg.sourceURL + ':' + arg.line;
                        }
                    }
                    return arg;
                }

                function consoleLog(type) {
                    var console = $window.console || {}, logFn = console[type] || console.log ||
                        angular.noop, hasApply = false;

                    // Note: reading logFn.apply throws an error in IE11 in IE8 document
                    // mode.
                    // The reason behind this is that console.log has type "object" in
                    // IE8...
                    try {
                        hasApply = !!logFn.apply;
                    } catch (e) {
                    }

                    if (hasApply) {
                        return function () {
                            var args = [];
                            angular.forEach(arguments, function (arg) {
                                args.push(formatError(arg));
                            });
                            // MODIFICATION: use current console object to be sure to have
                            // latest version of it
                            var curLogFn = $window.console[type] || $window.console.log || angular.noop;

                            if (registerError && registerService && args.length>0) {
                                // console.log(args)
                                registerService(args);
                            }
                            return curLogFn.apply(console, args);
                        };
                    }

                    // we are IE which either doesn't have window.console => this is noop
                    // and we do nothing,
                    // or we are IE where console.log doesn't have apply so we log at least
                    // first 2 args
                    return function (arg1, arg2) {
                        ($window.console[type] || $window.console.log || angular.noop)(arg1, arg2 == null ? '' : arg2);
                    };
                }
            }];
        });
    }]);
