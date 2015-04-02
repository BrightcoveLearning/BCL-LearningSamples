/** @namespace */
    var util = {
        /**
         * Repeat <tt>str</tt> several times.
         * @param {string} str The string to repeat.
         * @param {number} [times=1] How many times to repeat the string.
         * @returns {string}

* @example
 * // returns 2
 * globalNS.method1(5, 10);
 * @example
 * // returns 3
 * globalNS.method(5, 15);
 * @returns {Number} Returns the value of x for the equation.

         */



        repeat: function(str, times) {
            if (times === undefined || times < 1) {
                times = 1;
            }
            return new Array(times+1).join(str);
        }
    };