
;(function() {
/*jshint eqeqeq:false curly:false latedef:false */
"use strict";

	function setup($) {
		$.jsInPlaceEditor = function(element, options) {
			element.data('jsInPlaceEditor', this);

			this.init = function(element, options) {
				this.options = $.extend({}, $.jsInPlaceEditor.defaultOptions, options);
				defineOnCompleteEvent(element, this.options.complete);
				bindReadonlyClick(element);
				bindReturnKeyPress(element);
				bindSaveBtnClick(element);
			};

			this.init(element, options);
		}

		function defineOnCompleteEvent(element, completeFunc) {
			element.on("in-place-editing-finish", function() {
				var that = this;
				var valueSaved = $(this).find(".editable input").val();
				disableEditing($(that));
				completeFunc(valueSaved, function(result) {
					enableEditing($(that));
					if(result !== null) {
						showErrorMessage($(that), result);
						return;
					}
					hideErrorMessage($(that));
					toggleField($(that));
				});
			});
		}

		function disableEditing(element) {
			element.find(".editable input").attr("disabled", true);
		}

		function enableEditing(element) {
			element.find(".editable input").attr("disabled", false);
		}

		function showErrorMessage(element, message) {
			element.find(".editable .error").text(message).removeClass("hidden");
		}

		function hideErrorMessage(element) {
			element.find(".editable .error").text("").addClass("hidden");
		}

		function bindReadonlyClick(element) {
			element.find(".readonly").click(function() {
				toggleField(element);
				return false;
			});
		}

		function bindReturnKeyPress(element) {
			element.find(".editable input").keypress(function(e) {
				if(e.which == 13) {
					$(element).trigger("in-place-editing-finish");
				}
			});
		}

		function bindSaveBtnClick(element) {
			element.find(".editable .save").click(function() {
				$(element).trigger("in-place-editing-finish");
			});
		}

		function toggleField(container) {
			if(isEditModeEnabled(container)) {
				container.find(".readonly .value").text(container.find(".editable input").val());
				container.find(".editable").addClass("hidden");
				container.find(".readonly").removeClass("hidden");
			} else {
				container.find(".editable").removeClass("hidden");
				container.find(".editable input").val(container.find(".readonly .value").text()).focus();
				container.find(".readonly").addClass("hidden");
			}
		}

		function isEditModeEnabled(container) {
			if(container.find(".editable").hasClass("hidden")) {
				return false;
			}
			return true;
		}

		$.jsInPlaceEditor.defaultOptions = {
			complete: function(self, callback) {
				callback(null);
			}
		};

		$.fn.jsInPlaceEditor = function(options) {
			return this.each(function() {
			  (new $.jsInPlaceEditor($(this), options));
			});
		}
	}

	/*global define:true */
	if (typeof define === 'function' && define.amd && define.amd.jQuery) {
		define(['jquery'], setup);
	} else {
		setup(jQuery);
	}

})();
