(function($){

	module("multiselect", "events");

	test("multiselectopen", function(){
		expect(9);
	 
	 	// inject widget
		el = $("<select></select>").appendTo("body");
		el.multiselect({
			open: function(e,ui){
				ok( true, 'multiselect("open") fires open callback' );
				equals(this, el[0], "context of callback");
				equals(e.type, 'multiselectopen', 'event type in callback');
				same(ui, {}, 'ui hash in callback');
			}
		})
		.bind("multiselectopen", function(e,ui){
			ok(true, 'multiselect("open") fires multiselectopen event');
			equals(this, el[0], 'context of event');
			same(ui, {}, 'ui hash in event');
		});
		
		// now try to open it..
		el.multiselect("open");
		el.multiselect("destroy").remove();
		
		// now try returning false prevent opening
		el = $("<select></select>")
		.appendTo("body")
		.multiselect()
		.bind("multiselectopen", function(){
			ok( true, "binding multiselectopen to return false (prevent from opening)" );
			return false;
		})
		.multiselect("open");
		
		ok( !el.multiselect("isOpen"), "multiselect is not open after multiselect('open')" );
		el.multiselect("destroy").remove();
	});


	test("multiselectclose", function(){
		expect(9);
	 
	 	// inject widget
		el = $("<select></select>").appendTo("body");
		el.multiselect({
			close: function(e,ui){
				ok( true, 'multiselect("close") fires close callback' );
				equals(this, el[0], "context of callback");
				equals(e.type, 'multiselectclose', 'event type in callback');
				same(ui, {}, 'ui hash in callback');
			}
		})
		.bind("multiselectclose", function(e,ui){
			ok(true, 'multiselect("close") fires multiselectclose event');
			equals(this, el[0], 'context of event');
			same(ui, {}, 'ui hash in event');
		})
		.multiselect("open")
		.multiselect("close")
		.multiselect("destroy")
		.remove();
		
		// now try returning false prevent opening
		el = $("<select></select>")
		.appendTo("body")
		.multiselect()
		.bind("multiselectclose", function(){
			ok( true, "binding multiselectclose to return false (prevent from closing)" );
			return false;
		})
		.multiselect("open")
		.multiselect("close");
		
		ok( el.multiselect("isOpen"), "multiselect is still open after a multiselect('close')" );
		
		el.multiselect("destroy").remove();
	});
	

	test("multiselectclick", function(){
		expect(9);
	 
	 	// inject widget
		el = $("<select><option value='1'>Option 1</option></select>")
		.appendTo("body")
		.multiselect({
			click: function(e,ui){
				ok( true, 'click option: triggering the click event on one of the checkboxes triggers this multiselectclick' );
				equals(this, el[0], "click option: context of callback");
				equals(e.type, 'multiselectclick', 'click option: event type in callback');
				equals(ui.value, "1", "click option: ui.value equals");
				equals(ui.text, "Option 1", "click option: ui.title equals");
			}
		})
		.bind("multiselectclick", function(e,ui){
			ok(true, 'binding to multiselectclick: triggering the click event on one of the checkboxes triggers multiselectclick');
			equals(this, el[0], 'binding to multiselectclick: context of event');
			equals(ui.value, "1", "binding to multiselectclick: ui.value equals");
			equals(ui.text, "Option 1", "binding to multiselectclick: ui.title equals");
		})
		.multiselect("open");
		
		// trigger a click event on the input
		menu().find("input").trigger("click");
		
		el.multiselect("destroy").remove();
	});
	
})(jQuery);
