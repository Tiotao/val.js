;(function($){
    $.fn.extend({
        validator: function(options) {
            var PLAN_AMOUNT_REGEX = /^[0-9]{0,4}$/;
            var PHONE_REGEX = /^[0-9]{6,15}$/;
            var self = this;
            
            this.defaultOptions = {
                button: '#submit-btn',
                entries: [{
                    id: "#name",
                    regex: PLAN_AMOUNT_REGEX,
                    placeholder: "none",
                    errorMessage: "name error"
                },
                {
                    id: "#password",
                    regex: PHONE_REGEX,
                    placeholder: "none",
                    errorMessage: "password error"
                }
                ]
            };
            
            var settings = $.extend({}, this.defaultOptions, options);
            
            this.validity = {
                value: false,
                detail: {},
            };
            
            // this.defaultOptions = {
                
            // };
            
            this.IELowerThan = function(ver) {
                var myNav = navigator.userAgent.toLowerCase();
                var version = (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
                if ( version ) {
                    // console.log('version' + version)
                    // console.log('smaller' + ver)
                    return version < ver
                } else {
                    return false;
                }
            }
            
            this.checkRegex = function(entry, content) {
                var isValid, isEmpty, msg;
                var placeholder = entry.placeholder;
                var regex = entry.regex;
                var errorMsg = entry.errorMessage;
                if (content.length == 0 || (this.IELowerThan(10) && content === placeholder)) {
                    isValid = false;
                    isEmpty = true;
                    msg = errorMsg;
                } else if (!regex.test(content)) {
                    isValid = false;
                    isEmpty = false;
                    msg = errorMsg;
                } else {
                    isValid = true;
                    isEmpty = false;
                    msg = null;
                }
                return {
                    isValid: isValid,
                    isEmpty: isEmpty,
                    msg: msg
                }
            }
            
            this.validate = function(wrapper) {
                var results = [];
                $.each(settings.entries, function(index, entry) {
                    var entryObj = wrapper.find(entry.id);
                    var entryVal = entryObj.val();
                    var result = self.checkRegex(entry, entryVal);
                    results.push(result);
                });
                return results;
            }
            
            

            this.watch = function(wrapper) {
                var validate = self.validate;
                var validity = self.validity;
                
                $.each(settings.entries, function(index, entry) {
                    var entryObj = wrapper.find(entry.id);
                    entryObj.on('input', function(){
                        var results = validate(wrapper);
                        validity = {
                            value: (function(r){
                                var invalidEntries = $.grep(r, 
                                    function(n ,i) {
                                        return n.isValid == false
                                    });
                                return invalidEntries.length == 0
                            })(results),
                            detail: results,
                        }
                        // trigger based on validity
                        console.log(validity);
                    });
                });
            }
            
            
            
            return this.each(function() {
                var $this = $(this);
                self.watch($this);
                //this.watch($this);
            });
        }
    });
})(jQuery);