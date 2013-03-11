function makeAPIRequest(textToTranslate) {
    var params = {
        "lang": "en-ru",
        "text": textToTranslate,
        "flags": "5"
    }
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

function showPopover(selectionAttributes, outputHTML) {
    $("#ru_nloginov_slovari").remove();
    $("body").append(outputHTML);

    var popover = $("#ru_nloginov_slovari");
    $(document).click(function () {
        popover.hide();
    });

    width = popover.outerWidth(true);
    height = popover.outerHeight(true);

    popover.css('left', selectionAttributes.left - width/2.)
    popover.css('top', selectionAttributes.top - height - selectionAttributes.height)
}

function buildViewModel(word, rawData) {
    var result = {"translations": [], "title": word };
    var translations = result.translations;
    if (rawData.def.length > 0) {
        $.each(rawData.def, function(_, definition) {
            $.each(definition.tr, function (_, translation) {
                translations.push({"translation" : translation.text});
            });
       });
    }
    else {
        translations.push({"translation" : "<В словаре не найдено>"});
    }

    return result;
}

$(document).keypress(function (event) {
    if (event.which == 13) {
        var selectionObj = window.getSelection();
        var req = makeAPIRequest(selectionObj.toString());
        req.done(function (data) {
            var selectionAttributes = getSelectionAttributes(selectionObj);

            var viewModel = buildViewModel(selectionObj.toString(), data);
            var outputHTML = Templates.Popover.render(viewModel);

            showPopover(selectionAttributes, outputHTML);
         });
    }
});
