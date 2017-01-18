# jQuery UI MultiSelect Widget

MultiSelect progessively enhances an ordinary multiple select control into elegant drop down list of checkboxes, stylable with ThemeRoller.

![Example](http://www.erichynds.com/examples/jquery-multiselect/screenshot-widget.gif)

## Particulars of this clone

This clone includes a few additions and fixes from other people:

- options:

  + `menuWidth`: (number) when specified, you can set the menu's outerWidth to this fixed value.

  + both `noneSelectedText` and `selectedText` options can be either strings or functions producing strings.
    The call to `noneSelectedText` will set the function's `this` to the <select> element.
    The call to `selectedText` will do likewise and pass these parameters as function arguments: numChecked, numTotal, checkedItems

  + `selectedListSeparator`: (default: `', '`) can be set to any string which will be used as the separator when multiple selected values are joined to produce the selection result.

- each &lt;option> 'title' is derived from its `.innerText` rather than the `.innerHTML`.

- &lt;option>'s which have a `data-image` attribute will be rendered with an image (icon) preceding their description, where the image `src` attribute is set to the `data-image` attribute value. Each &lt;img> will have the `data-image` class.

    &lt;img class="data-image" src="{the &lt;option> data-image attribute value}" />

- the event `buttonvaluechanged` is fired whenever the `update()` method was invoked

- the `input[type="checkbox"]`, `input[type="radio"]` and `click.multiselect` events delegates now can specify an 'extraParameters' value, which is passed on to the 'click' event when fired.
  That event would previously pass an object with these fields:
  + `value`
  + `text`
  + `checked`
  and now also includes the field `extraParameters`

  > WARNING! WARNING! WARNING!
  > This `extraParameters` feature isn't working as the extra parameters passed to jQuery's `.trigger()` don't make it past the browser-native .click() handler which is invoked in there (jQuery 1.10.x (and below?))

- the class now also provides the `getUnchecked()` API which logically returns the set of UNchecked options.

- we popup on top of the button if the menu would otherwise be cut off by the bottom of the window.

- fix select/deselect bug in single-selection mode.


# License

MultiSelect is dual-licensed under the [GPL 2 license](https://github.com/ehynds/jquery-ui-multiselect-widget/blob/master/GPL-LICENSE) and the [MIT license](https://github.com/ehynds/jquery-ui-multiselect-widget/blob/master/MIT-LICENSE).


# Contributing

When submitting a pull request, please describe the change you are making - preferably with a use case. Unit tests are now (14 March 2016) required for the pull to be merged.

Please do not submit minified code in your pull request, that tends to cause merge conflicts.
