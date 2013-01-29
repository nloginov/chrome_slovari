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
    $("#kolyanlab_slovari").remove();
    $("body").append(outputHTML);

    var popover = $("#kolyanlab_slovari");
    popover.click(function () {
        $(this).hide();
    })

    width = popover.outerWidth(true);
    height = popover.outerHeight(true);

    popover.css('left', selectionAttributes.left - width/2.)
    popover.css('top', selectionAttributes.top - height - selectionAttributes.height)
}

$(document).keypress(function (event) {
    if (event.which == 13) {
        var selectionObj = window.getSelection();
        var req = makeAPIRequest(selectionObj.toString());
        req.done(function (data) {
            var selectionAttributes = getSelectionAttributes(selectionObj);

            var translation;
            if (data.def.length > 0) {
                translation = data.def[0].tr[0].text;
            }
            else {
                translation = "<В словаре не найдено>";
            }

            outputHTML = Templates.Popover.render({
                title: selectionObj.toString(),
                translation: translation,
                offset_x: 0,
                offset_y: 0
            });

            showPopover(selectionAttributes, outputHTML);
         });
    }
});
