(function($){
    var el, widget, elems, btn;

    module("html", {
        setup: function() {
            el = $("select").multiselect();
            widget = el.multiselect("widget");
            btn = el.multiselect("getButton");
        }
    });

    test("pull in optgroup's class", function(){
        expect(5);

        elems = widget.find('.ui-multiselect-optgroup-label');
        equal( elems.length, 3, 'There are three labels' );

        elems.filter(":not(:last)").each( function() {
            equal($(this).hasClass('ui-multiselect-optgroup-label'),true,'Default class is present when no extra class is defined');
        });
        elems.filter(":last").each( function() {
            equal($(this).hasClass('ui-multiselect-optgroup-label'),true,'Default class is present when extra class is defined');
            equal($(this).hasClass('optgroupClass'),true,'Extra class is present');
        });

    });

    test("pull in options's class", function(){
        expect(1);

        equal(widget.find('input[value="9"]').parents('li:first').hasClass('optionClass'),true,'Extra class is present');
    });
    
    test("pull in select's ID and adds _ms", function() {
        expect(1);
	
        equal(btn.attr("id"), el.attr("id") + "_ms", "Id is taken from select and _ms is appended");
    });

    test("verify ul/li counts", function() {
        expect(7);

        parent = widget.find(".ui-multiselect-checkboxes");

        equal(parent.find('ul').length, 6, 'Correct number of unordered lists is present (five due to optgroups, one without)');

        equal(parent.find('ul:nth-child(1)').find('li').length, 4, 'Correct number of list items in first optgroup (one label + three items)');
        equal(parent.find('ul:nth-child(2)').find('li').length, 5, 'Correct number of list items in second optgroup (one label + four items)');
        equal(parent.find('ul:nth-child(3)').find('li').length, 3, 'Correct number of list items in third optgroup (one label + two items)');
        equal(parent.find('ul:nth-child(4)').find('li').length, 1, 'Correct number of list items in fourth optgroup (one item)');
        equal(parent.find('ul:nth-child(5)').find('li').length, 1, 'Correct number of list items in fifth optgroup (one item)');
        equal(parent.find('ul:nth-child(6)').find('li').length, 2, 'Correct number of list items without optgroup (two items)');
    });

})(jQuery);
