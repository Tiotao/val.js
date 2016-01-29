;(function($){
    $.fn.extend({
        validator: function(options) {
            var PLAN_AMOUNT_REGEX = /^[0-9]{0,4}$/;
            var PHONE_REGEX = /^[0-9]{6,15}$/;
            var self = this;
            
            this.defaultOptions = {
                button: '#submit',
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
            
            this.touched = [];
            
            
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
            
            this.validate = function(wrapper, currIndex) {
                
                // unique function
                function unique(array) {
                    return $.grep(array, function(el, index) {
                        return index === $.inArray(el, array);
                    });
                }
                
                var results = [];
                $.each(settings.entries, function(index, entry) {
                    var entryObj = wrapper.find(entry.id);
                    var entryVal = entryObj.val();
                    var result = self.checkRegex(entry, entryVal);
                    if(index === currIndex){
                        self.touched.push(index);
                        self.touched = unique(self.touched);
                    }
                    results.push(result);
                });
                return results;
            }
            
            this.showMessage = function(wrapper, validity, method) {
                $.each(validity.detail, function(index, status){
                    if(!status.isValid && $.inArray(index, self.touched) > -1){
                        var message = status.msg;
                        //method(wrapper, message);
                        console.log(message);
                    }
                })
            }
            
            this.updateSubmitButton = function(wrapper, isValid) {
                var button = wrapper.find(settings.button);
                console.log(isValid);
                if (isValid) {
                    button.removeAttr("disabled");
                } else {
                    button.attr("disabled", true);
                }
            }

            this.watch = function(wrapper) {
                var validate = self.validate;

                $.each(settings.entries, function(index, entry) {
                    var entryObj = wrapper.find(entry.id);
                    entryObj.on('input', function(){
                        var results = validate(wrapper, index);
                        self.validity = {
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
                        self.showMessage(wrapper, self.validity, null);
                        self.updateSubmitButton(wrapper, self.validity.value);
                        // console.log(self.validity);
                        // console.log(self);
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