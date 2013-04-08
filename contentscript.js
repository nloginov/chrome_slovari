"use strict";
/*jslint browser:true, vars:true, white:true, plusplus:true, nomen:true */
/*global  $, Templates*/
var POPOVER_SELECTOR = "#ru_nloginov_slovari";

function makeAPIRequest(textToTranslate) {
    var params = {
        "lang": "en-ru",
        "text": textToTranslate.trim(),
        "flags": "5"
    };
    return $.get("http://translate.yandex.net/dicservice.json/lookup", params);
}

function getSelectionAttributes(selectionObj) {
    var range = selectionObj.getRangeAt(0);
    range.collapse(false);

    var dummy = document.createElement("span");
    range.insertNode(dummy);
    
    var dummyHeight = $(dummy).outerHeight();
    var coordinates = $(dummy).offset();
    dummy.parentNode.removeChild(dummy);

    return {
        left: coordinates.left,
        top: coordinates.top,
        height: dummyHeight
    };
}

function onWantTranslate(callback) {
    var ctrlCCount = 0;
    var fired = false;
    $(document).keydown(function (event) {
        if (event.which === 67 && event.ctrlKey) {
            ctrlCCount++;
            if(ctrlCCount === 2) {
                fired = true;
            }
        }
        else {
            ctrlCCount = 0;
        }
    });

    $(document).keyup(function (event) {
        if(fired) {
            fired = false;
            ctrlCCount = 0;
            callback();
        }
    });
}

function buildPopoverPosition(selectionAttributes, width, height) {
    var top = selectionAttributes.top - height - selectionAttributes.height;
    var arrowOrientation = "top";
    if(top - $(window).scrollTop() < 0) {
        top = selectionAttributes.top + selectionAttributes.height;
        arrowOrientation = "bottom";
    }

    return { 
        left: selectionAttributes.left - width/2,
        top: top,
        arrow: arrowOrientation
    };
}

function showPopover(selectionAttributes, outputHTML) {
    $(POPOVER_SELECTOR).remove();
    $("body").append(outputHTML);

    var popover = $(POPOVER_SELECTOR);
    var width = popover.outerWidth(true);
    var height = popover.outerHeight(true);
    var popoverPosition = buildPopoverPosition(selectionAttributes, width, height);

    popover.css('left', popoverPosition.left);
    popover.css('top', popoverPosition.top);
    popover.removeClass("top");
    popover.addClass(popoverPosition.arrow);
}

function isEmptyModel(rawData) {
    return rawData.def.length === 0;
}

function buildViewModel(word, rawData) {
    var result = {"translations": [], "title": word };
    var translations = result.translations;
    if (!isEmptyModel(rawData)) {
        var count = 1;
        $.each(rawData.def, function(_, definition) {
            var translationAcc = count + ". ";
            $.each(definition.tr, function (ix, translation) {
                translationAcc += translation.text;
                if (ix < definition.tr.length - 1) {
                    translationAcc += ", "
                } 
            });
            translations.push({"translation" : translationAcc});
            ++count;
       });
    }
    else {
        translations.push({"translation" : "<В словаре не найдено>"});
    }

    return result;
}

$(document).click(function () {
    $(POPOVER_SELECTOR).hide();
});

$(document).keyup(function(event) {
    if(event.keyCode === 27)  { //Esc
        $(POPOVER_SELECTOR).hide();
    }
});

function getTranslation(query) {       
    var result = $.Deferred();
    var candidates = [query.singularize(), query];
    (function iterate(i) {
        var req = makeAPIRequest(candidates[i]);
        req.done(function (rawData) {
            if(isEmptyModel(rawData) && i !== candidates.length - 1) {
                iterate(i+1);
            } else {
                result.resolve({"query": candidates[i].trim(), "data": rawData});
            }
        });
    }(0));

    return result.promise();
}

onWantTranslate(function () {
    var selectionObj = window.getSelection();
    var query = selectionObj.toString().trim();
    getTranslation(query).done(function(rawData) {
        var viewModel = buildViewModel(rawData.query, rawData.data);
        var outputHTML = Templates.Popover.render(viewModel);
        var selectionAttributes = getSelectionAttributes(selectionObj);
        showPopover(selectionAttributes, outputHTML);
    });
});
