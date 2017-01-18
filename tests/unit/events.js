(function($){

    module("events");

    test("multiselectopen", function(){
        expect(27);

        // inject widget
        el = $("<select multiple><option value='foo'>foo</option></select>").appendTo(body);
        el.multiselect({
            open: function(e,ui){
                ok( true, 'option: multiselect("open") fires open callback' );
                equal(this, el[0], "option: context of callback");
                equal(e.type, 'multiselectopen', 'option: event type in callback');
                equal(menu().css("display"), 'block', 'menu display css property equals block');
                deepEqual(ui, {}, 'option: ui hash in callback');
            }
        })
        .bind("multiselectopen", function(e,ui){
            ok(true, 'event: multiselect("open") fires multiselectopen event');
            equal(this, el[0], 'event: context of event');
            deepEqual(ui, {}, 'event: ui hash');
        });

        // now try to open it..
        el.multiselect("open")

        // make sure the width of the menu and button are equivalent
        equal( button().outerWidth(), menu().outerWidth(), 'button and menu widths are equivalent');

        // close
        el.multiselect("close");

        // make sure a click event on the button opens the menu as well.
        button().trigger("click");
        el.multiselect("close");

        // make sure a click event on a span inside the button opens the menu as well.
        button().find("span:first").trigger("click");

        // reset for next test
        el.multiselect("destroy").remove();

        // now try returning false prevent opening
        el = $("<select></select>")
            .appendTo(body)
            .multiselect()
            .bind("multiselectbeforeopen", function(){
                ok( true, "event: binding multiselectbeforeopen to return false (prevent from opening)" );
                return false;
            })
            .multiselect("open");

        ok( !el.multiselect("isOpen"), "multiselect is not open after multiselect('open')" );
        el.multiselect("destroy").remove();
    });

    test("multiselectclose", function(){
        expect(25);

        // inject widget
        el = $("<select multiple><option>foo</option></select>").appendTo(body);
        el.multiselect({
            close: function(e,ui){
                ok( true, 'option: multiselect("close") fires close callback' );
                equal(this, el[0], "option: context of callback");
                equal(e.type, 'multiselectclose', 'option: event type in callback');
                equal(menu().css("display"), 'none', 'menu display css property equals none');
                deepEqual(ui, {}, 'option: ui hash');
            }
        })
        .bind("multiselectclose", function(e,ui){
            ok(true, 'multiselect("close") fires multiselectclose event');
            equal(this, el[0], 'event: context of event');
            deepEqual(ui, {}, 'event: ui hash');
        })
        .multiselect("open")
        .multiselect("close")
        .multiselect("open");

        // make sure a click event on the button closes the menu as well.
        button().click();
        el.multiselect("open");

        // make sure a click event on a span inside the button closes the menu as well.
        button().find("span:first").click();

        // make sure that the menu is actually closed.  see issue #68
        ok( el.multiselect('isOpen') === false, 'menu is indeed closed' );

        el.multiselect("destroy").remove();
    });

    test("multiselectbeforeclose", function(){
        expect(8);

        // inject widget
        el = $("<select multiple></select>").appendTo(body);
        el.multiselect({
            beforeclose: function(e,ui){
                ok( true, 'option: multiselect("beforeclose") fires close callback' );
                equal(this, el[0], "option: context of callback");
                equal(e.type, 'multiselectbeforeclose', 'option: event type in callback');
                deepEqual(ui, {}, 'option: ui hash');
            }
        })
        .bind("multiselectbeforeclose", function(e,ui){
            ok(true, 'multiselect("beforeclose") fires multiselectclose event');
            equal(this, el[0], 'event: context of event');
            deepEqual(ui, {}, 'event: ui hash');
        })
        .multiselect("open")
        .multiselect("close");

        el.multiselect("destroy").remove();

        // test 'return false' functionality
        el = $("<select multiple></select>").appendTo(body);
        el.multiselect({
            beforeclose: function(){
                return false;
            }
        });

        el.multiselect('open').multiselect('close');
        ok( menu().is(':visible') && el.multiselect("isOpen"), "returning false inside callback prevents menu from closing" );
        el.multiselect("destroy").remove();
    });

    test("multiselectclick", function(){
        expect(32);

        var times = 0;

        // inject widget
        el = $("<select multiple><option value='1'>Option 1</option><option value='2'>Option 2</option></select>")
            .appendTo(body);

        el.multiselect({
            click: function(e,ui){
                ok(true, 'option: triggering the click event on the second checkbox fires the click callback' );
                equal(this, el[0], "option: context of callback");
                equal(e.type, 'multiselectclick', 'option: event type in callback');
                equal(ui.value, "2", "option: ui.value equals");
                equal(ui.text, "Option 2", "option: ui.text equals");

                if(times === 0) {
                    equal(ui.checked, true, "option: ui.checked equals");
                } else if(times === 1) {
                    equal(ui.checked, false, "option: ui.checked equals");
                }

                equal(ui.extraParameters, undefined, "option: ui.extraParameters equals");
            }
        })
        .bind("multiselectclick", function(e,ui){
            ok(true, 'event: triggering the click event on the second checkbox triggers multiselectclick');
            equal(this, el[0], 'event: context of event');
            equal(ui.value, "2", "event: ui.value equals");
            equal(ui.text, "Option 2", "event: ui.text equals");

            if(times === 0) {
                equal(ui.checked, true, "option: ui.checked equals");
            } else if(times === 1) {
                equal(ui.checked, false, "option: ui.checked equals");
            }

            equal(ui.extraParameters, undefined, "option: ui.extraParameters equals");
        })
        .bind("change", function(e){
            if(++times === 1){
                equal(el.val().join(), "2", "event: select element val() within the change event is correct" );
            } else {
                equal(el.val(), null, "event: select element val() within the change event is correct" );
            }

            ok(true, "event: the select's change event fires");
        })
        .multiselect("open");

        // trigger a click event on the input
        var lastInput = menu().find("input").last();
        lastInput[0].click();

        // trigger once more.
        lastInput[0].click();

        // make sure it has focus
        equal(true, lastInput.is(":focus"), "The input has focus");

        // make sure menu isn't closed automatically
        equal( true, el.multiselect('isOpen'), 'menu stays open' );

        el.multiselect("destroy").remove();
    });

    test("multiselectclick, with extraParameters", function(){
        expect(28);

        var times = 0;

        // inject widget
        el = $("<select multiple><option value='1'>Option 1</option><option value='2'>Option 2</option></select>")
            .appendTo(body);

        el.multiselect({
            click: function(e,ui){
                ok(true, 'option: triggering the click event on the second checkbox fires the click callback' );
                equal(this, el[0], "option: context of callback");
                equal(e.type, 'multiselectclick', 'option: event type in callback');
                equal(ui.value, "2", "option: ui.value equals");
                equal(ui.text, "Option 2", "option: ui.text equals");
                equal(ui.extraParameters, "test parameter", "option: ui.extraParameters equals");
            }
        })
        .bind("multiselectclick", function(e,ui){
            ok(true, 'event: triggering the click event on the second checkbox triggers multiselectclick');
            equal(this, el[0], 'event: context of event');
            equal(ui.value, "2", "event: ui.value equals");
            equal(ui.text, "Option 2", "event: ui.text equals");
            equal(ui.extraParameters, "test parameter", "option: ui.extraParameters equals");
        })
        .bind("change", function(e){
            if(times === 0){
                equal(el.val().join(), "2", "event: select element val() within the change event is correct" );
            } else {
                equal(el.val(), null, "event: select element val() within the change event is correct" );
            }

            times++;

            ok(true, "event: the select's change event fires");
        })
        .multiselect("open");

        // trigger a click event on the input with extra parameter
        var lastInput = menu().find("input").last();
        $(lastInput[0]).trigger('click', 'test parameter');

        // trigger once more.
        $(lastInput[0]).trigger('click', 'test parameter');

        // make sure it has focus
        equal(true, lastInput.is(":focus"), "The input has focus");

        // make sure menu isn't closed automatically
        equal(true, el.multiselect('isOpen'), 'menu stays open');

        el.multiselect("destroy").remove();
    });

    test("multiselectcheckall", function(){
        expect(10);

        // inject widget
        el = $('<select multiple><option value="1">Option 1</option><option value="2">Option 2</option></select>').appendTo(body);

        el.multiselect({
            checkAll: function(e,ui){
                ok( true, 'option: multiselect("checkAll") fires checkall callback' );
                equal(this, el[0], "option: context of callback");
                equal(e.type, 'multiselectcheckall', 'option: event type in callback');
                deepEqual(ui, {}, 'option: ui hash in callback');
            }
        })
        .bind("multiselectcheckall", function(e,ui){
            ok( true, 'event: multiselect("checkall") fires multiselectcheckall event' );
            equal(this, el[0], 'event: context of event');
            deepEqual(ui, {}, 'event: ui hash');
        })
        .bind("change", function(){
            ok(true, "event: the select's change event fires");
            equal( el.val().join(), "1,2", "event: select element val() within the change event is correct" );
        })
        .multiselect("open")
        .multiselect("checkAll");

        equal(menu().find("input").first().is(":focus"), true, "The first input has focus");

        el.multiselect("destroy").remove();
    });

    test("multiselectuncheckall", function(){
        expect(10);

        // inject widget
        el = $('<select multiple><option value="1">Option 1</option><option value="2">Option 2</option></select>').appendTo(body);

        el.multiselect({
            uncheckAll: function(e,ui){
                ok( true, 'option: multiselect("uncheckAll") fires uncheckall callback' );
                equal(this, el[0], "option: context of callback");
                equal(e.type, 'multiselectuncheckall', 'option: event type in callback');
                deepEqual(ui, {}, 'option: ui hash in callback');
            }
        })
        .bind("multiselectuncheckall", function(e,ui){
            ok( true, 'event: multiselect("uncheckall") fires multiselectuncheckall event' );
            equal(this, el[0], 'event: context of event');
            deepEqual(ui, {}, 'event: ui hash');
        })
        .bind("change", function(){
            ok(true, "event: the select's change event fires");
            equal( el.val(), null, "event: select element val() within the change event is correct" );
        })
        .multiselect("open")
        .multiselect("uncheckAll");

        equal(menu().find("input").first().is(":focus"), true, "The first input has focus");

        el.multiselect("destroy").remove();
    });


    test("multiselectbeforeoptgrouptoggle", function(){
        expect(10);

        // inject widget
        el = $('<select multiple><optgroup label="Set One"><option value="1">Option 1</option><option value="2">Option 2</option></optgroup></select>')
          .appendTo(body);

        el.bind("change", function(){
            ok(true, "the select's change event fires");
        })
        .multiselect({
            beforeoptgrouptoggle: function(e,ui){
                equal(this, el[0], "option: context of callback");
                equal(e.type, 'multiselectbeforeoptgrouptoggle', 'option: event type in callback');
                equal(ui.label, "Set One", 'option: ui.label equals');
                equal(ui.inputs.length, 2, 'option: number of inputs in the ui.inputs key');
            }
        })
        .bind("multiselectbeforeoptgrouptoggle", function(e,ui){
            ok( true, 'option: multiselect("uncheckall") fires multiselectuncheckall event' );
            equal(this, el[0], 'event: context of event');
            equal(ui.label, "Set One", 'event: ui.label equals');
            equal(ui.inputs.length, 2, 'event: number of inputs in the ui.inputs key');
        })
        .multiselect("open");

        menu().find("li.ui-multiselect-optgroup-label a").click();

        el.multiselect("destroy").remove();
        el = el.clone();

        // test return false preventing checkboxes from activating
        el.bind("change", function(){
            ok( true ); // should not fire
        }).multiselect({
            beforeoptgrouptoggle: function(){
                return false;
            },
            // if this fires the expected count will be off.  just a redundant way of checking that return false worked
            optgrouptoggle: function(){
                ok( true );
            }
        }).appendTo( body );

        var label = menu().find("li.ui-multiselect-optgroup-label a").click();
        equal( menu().find(":input:checked").length, 0, "when returning false inside the optgrouptoggle handler, no checkboxes are checked" );
        el.multiselect("destroy").remove();
    });

    test("multiselectoptgrouptoggle", function(){
        expect(12);

        // inject widget
        el = $('<select multiple><optgroup label="Set One"><option value="1">Option 1</option><option value="2">Option 2</option></optgroup></select>').appendTo(body);

        el.multiselect({
            optgrouptoggle: function(e,ui){
                equal(this, el[0], "option: context of callback");
                equal(e.type, 'multiselectoptgrouptoggle', 'option: event type in callback');
                equal(ui.label, "Set One", 'option: ui.label equals');
                equal(ui.inputs.length, 2, 'option: number of inputs in the ui.inputs key');
                equal(ui.checked, true, 'option: ui.checked equals true');
            }
        })
        .bind("multiselectoptgrouptoggle", function(e,ui){
            ok( true, 'option: multiselect("uncheckall") fires multiselectuncheckall event' );
            equal(this, el[0], 'event: context of event');
            equal(ui.label, "Set One", 'event: ui.label equals');
            equal(ui.inputs.length, 2, 'event: number of inputs in the ui.inputs key');
            equal(ui.checked, true, 'event: ui.checked equals true');
        })
        .multiselect("open");

        // trigger native click event on optgroup
        menu().find("li.ui-multiselect-optgroup-label a").click();
        equal(menu().find(":input:checked").length, 2, "both checkboxes are actually checked" );

        equal(menu().find("input").first().is(":focus"), true, "The first input has focus");

        el.multiselect("destroy").remove();
    });

})(jQuery);
