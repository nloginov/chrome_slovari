module(" View Model building tests");
test( "'javascript' translation", function () {
    var expected = {
        title: 'javascript',
        translations: [
            { translation: 'яваскрипт' }, 
            { translation: 'сценарий JavaScript' }
        ]
    };
    deepEqual(buildViewModel('javascript', dictionary['javascript']), expected);
});

test( "'free' translation", function () {
    var expected = {
        title: 'free',
        translations: [
            { translation: 'бесплатный' }, 
            { translation: 'свободный' },
            { translation: 'скачать' },
            { translation: 'освободить' },
        ]
    };
    deepEqual(buildViewModel('free', dictionary['free']), expected);
});
module("isEmptyModel");
test( "empty translation", function () {
    ok(isEmptyModel(dictionary['blablabla']));
    ok(!isEmptyModel(dictionary['javascript']));
    ok(!isEmptyModel(dictionary['free']));
});

module("getTranslation");
function makeAPIRequest(textToTranslate) {
    var word = dictionary[textToTranslate.trim()];
    var result = new $.Deferred();
    result.resolve(word);
    return result;
}
asyncTest("'javascript'. Only singular exist.", function () {
    getTranslation(' javascript ').done(function (actual) { deepEqual(actual, 
            { query: 'javascript', data: dictionary['javascript']}); start(); });
});
asyncTest("'camels'. Only Plural exist", function () {
    getTranslation('camels').done(function (actual) { deepEqual(actual, 
            { query: 'camel', data: dictionary['camel']}); start(); });
});
asyncTest("'revisions'. Both singular and plural exist", function () {
    getTranslation('revisions').done(function (actual) { deepEqual(actual, 
            { query: 'revision', data: dictionary['revision']}); start(); });
});
asyncTest("'blablabla'. Neither plural neither singular", function () {
    getTranslation('blablabla').done(function (actual) { deepEqual(actual, 
            { query: 'blablabla', data: dictionary['blablabla']}); start(); });
});

module("User actions", {
    setup: function () {
        $(document).off();
    }
});
function triggerKey(eventType, key) {
    var type = {'down' : 'keydown', 'up' : 'keyup'};
    var keys = {'ctrl' : 17, 'c': 67 };
    var parts = key.split('-');
    var eventObj = {ctrlKey: parts.length == 2, which: keys[parts[parts.length -1]] };

    $(document).trigger($.Event(type[eventType], eventObj));
}

test("onWantTranslate doesn't fires by Ctrl + C", 0, function () {
    onWantTranslate(function () {
        ok(false, "I shouldn't fired!");
    });

    triggerKey('down', 'ctrl');
    triggerKey('down', 'ctrl-c');
    triggerKey('up', 'c');
    triggerKey('up', 'ctrl');
});

test("onWantTranslate doesn't fires by Ctrl + C; C", 0, function () {
    onWantTranslate(function () {
        ok(false, "I shouldn't fired!");
    });
    
    triggerKey('down', 'ctrl');
    triggerKey('down', 'ctrl-c');
    triggerKey('up', 'c');
    triggerKey('up', 'ctrl');
    triggerKey('down', 'c')
    triggerKey('up', 'c');
});

test("onWantTranslate doesn't fires by Ctrl + C; Ctrl + C", 0, function () {
    onWantTranslate(function () {
        ok(false, "I shouldn't fired!");
    });

    triggerKey('down', 'ctrl');
    triggerKey('down', 'ctrl-c');
    triggerKey('up', 'ctrl');
    triggerKey('up', 'c');
    triggerKey('down', 'ctrl');
    triggerKey('down', 'ctrl-c');
    triggerKey('up', 'ctrl');
    triggerKey('up', 'c');
});

test("onWantTranslate fires by Ctrl + C + C", 1, function () {
    onWantTranslate(function () {
        ok("onWantTranslate fired!");
    });

    triggerKey('down', 'ctrl');
    triggerKey('down', 'ctrl-c');
    triggerKey('up', 'c');
    triggerKey('down', 'ctrl-c');
    triggerKey('up', 'c');
});


