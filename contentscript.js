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

$(document).keypress(function (event) {
    if (event.which == 13) {
        var selectionObj = window.getSelection();
        var req = makeAPIRequest(selectionObj.toString());
        req.done(function (data) {
            var selectionAttributes = getSelectionAttributes(selectionObj);

            output = Templates.Popover.render({
                title: selectionObj.toString(),
                translation: data.def[0].tr[0].text,
                offset_x: selectionAttributes.left,
                offset_y: selectionAttributes.top
            });

            $("#kolyanlab_slovari").remove();
            $("body").append(output);

            var popover = $("#kolyanlab_slovari");
            width = popover.outerWidth(true);
            height = popover.outerHeight(true);

            popover.css('left', selectionAttributes.left - width/2.)
            popover.css('top', selectionAttributes.top - height - selectionAttributes.height)
         })
    }
});
