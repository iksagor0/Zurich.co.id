/*  bootstrap-select_min  */
/*!
 * Bootstrap-select v1.7.0 (http://silviomoreto.github.io/bootstrap-select)
 *
 * Copyright 2013-2015 bootstrap-select
 * Licensed under MIT (https://github.com/silviomoreto/bootstrap-select/blob/master/LICENSE)
 */
(function ($) {
  'use strict';

  //<editor-fold desc="Shims">
  if (!String.prototype.includes) {
    (function () {
      'use strict'; // needed to support `apply`/`call` with `undefined`/`null`
      var toString = {}.toString;
      var defineProperty = (function () {
        // IE 8 only supports `Object.defineProperty` on DOM elements
        try {
          var object = {};
          var $defineProperty = Object.defineProperty;
          var result = $defineProperty(object, object, object) && $defineProperty;
        } catch (error) {
        }
        return result;
      }());
      var indexOf = ''.indexOf;
      var includes = function (search) {
        if (this == null) {
          throw TypeError();
        }
        var string = String(this);
        if (search && toString.call(search) == '[object RegExp]') {
          throw TypeError();
        }
        var stringLength = string.length;
        var searchString = String(search);
        var searchLength = searchString.length;
        var position = arguments.length > 1 ? arguments[1] : undefined;
        // `ToInteger`
        var pos = position ? Number(position) : 0;
        if (pos != pos) { // better `isNaN`
          pos = 0;
        }
        var start = Math.min(Math.max(pos, 0), stringLength);
        // Avoid the `indexOf` call if no match is possible
        if (searchLength + start > stringLength) {
          return false;
        }
        return indexOf.call(string, searchString, pos) != -1;
      };
      if (defineProperty) {
        defineProperty(String.prototype, 'includes', {
          'value': includes,
          'configurable': true,
          'writable': true
        });
      } else {
        String.prototype.includes = includes;
      }
    }());
  }

  if (!String.prototype.startsWith) {
    (function () {
      'use strict'; // needed to support `apply`/`call` with `undefined`/`null`
      var defineProperty = (function () {
        // IE 8 only supports `Object.defineProperty` on DOM elements
        try {
          var object = {};
          var $defineProperty = Object.defineProperty;
          var result = $defineProperty(object, object, object) && $defineProperty;
        } catch (error) {
        }
        return result;
      }());
      var toString = {}.toString;
      var startsWith = function (search) {
        if (this == null) {
          throw TypeError();
        }
        var string = String(this);
        if (search && toString.call(search) == '[object RegExp]') {
          throw TypeError();
        }
        var stringLength = string.length;
        var searchString = String(search);
        var searchLength = searchString.length;
        var position = arguments.length > 1 ? arguments[1] : undefined;
        // `ToInteger`
        var pos = position ? Number(position) : 0;
        if (pos != pos) { // better `isNaN`
          pos = 0;
        }
        var start = Math.min(Math.max(pos, 0), stringLength);
        // Avoid the `indexOf` call if no match is possible
        if (searchLength + start > stringLength) {
          return false;
        }
        var index = -1;
        while (++index < searchLength) {
          if (string.charCodeAt(start + index) != searchString.charCodeAt(index)) {
            return false;
          }
        }
        return true;
      };
      if (defineProperty) {
        defineProperty(String.prototype, 'startsWith', {
          'value': startsWith,
          'configurable': true,
          'writable': true
        });
      } else {
        String.prototype.startsWith = startsWith;
      }
    }());
  }

  if (!Object.keys) {
    Object.keys = function (
      o, // object
      k, // key
      r  // result array
      ){
      // initialize object and result
      r=[];
      // iterate over object keys
      for (k in o) 
          // fill result array with non-prototypical keys
        r.hasOwnProperty.call(o, k) && r.push(k);
      // return result
      return r
    };
  }
  //</editor-fold>

  // Case insensitive contains search
  $.expr[':'].icontains = function (obj, index, meta) {
    var $obj = $(obj);
    var haystack = ($obj.data('tokens') || $obj.text()).toUpperCase();
    return haystack.includes(meta[3].toUpperCase());
  };

  // Case insensitive begins search
  $.expr[':'].ibegins = function (obj, index, meta) {
    var $obj = $(obj);
    var haystack = ($obj.data('tokens') || $obj.text()).toUpperCase();
    return haystack.startsWith(meta[3].toUpperCase());
  };

  // Case and accent insensitive contains search
  $.expr[':'].aicontains = function (obj, index, meta) {
    var $obj = $(obj);
    var haystack = ($obj.data('tokens') || $obj.data('normalizedText') || $obj.text()).toUpperCase();
    return haystack.includes(meta[3].toUpperCase());
  };

  // Case and accent insensitive begins search
  $.expr[':'].aibegins = function (obj, index, meta) {
    var $obj = $(obj);
    var haystack = ($obj.data('tokens') || $obj.data('normalizedText') || $obj.text()).toUpperCase();
    return haystack.startsWith(meta[3].toUpperCase());
  };

  /**
   * Remove all diatrics from the given text.
   * @access private
   * @param {String} text
   * @returns {String}
   */
  function normalizeToBase(text) {
    var rExps = [
      {re: /[\xC0-\xC6]/g, ch: "A"},
      {re: /[\xE0-\xE6]/g, ch: "a"},
      {re: /[\xC8-\xCB]/g, ch: "E"},
      {re: /[\xE8-\xEB]/g, ch: "e"},
      {re: /[\xCC-\xCF]/g, ch: "I"},
      {re: /[\xEC-\xEF]/g, ch: "i"},
      {re: /[\xD2-\xD6]/g, ch: "O"},
      {re: /[\xF2-\xF6]/g, ch: "o"},
      {re: /[\xD9-\xDC]/g, ch: "U"},
      {re: /[\xF9-\xFC]/g, ch: "u"},
      {re: /[\xC7-\xE7]/g, ch: "c"},
      {re: /[\xD1]/g, ch: "N"},
      {re: /[\xF1]/g, ch: "n"}
    ];
    $.each(rExps, function () {
      text = text.replace(this.re, this.ch);
    });
    return text;
  }


  function htmlEscape(html) {
    var escapeMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '`': '&#x60;'
    };
    var source = '(?:' + Object.keys(escapeMap).join('|') + ')',
        testRegexp = new RegExp(source),
        replaceRegexp = new RegExp(source, 'g'),
        string = html == null ? '' : '' + html;
    return testRegexp.test(string) ? string.replace(replaceRegexp, function (match) {
      return escapeMap[match];
    }) : string;
  }

  var Selectpicker = function (element, options, e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    this.$element = $(element);
    this.$newElement = null;
    this.$button = null;
    this.$menu = null;
    this.$lis = null;
    this.options = options;

    // If we have no title yet, try to pull it from the html title attribute (jQuery doesnt' pick it up as it's not a
    // data-attribute)
    if (this.options.title === null) {
      this.options.title = this.$element.attr('title');
    }

    //Expose public methods
    this.val = Selectpicker.prototype.val;
    this.render = Selectpicker.prototype.render;
    this.refresh = Selectpicker.prototype.refresh;
    this.setStyle = Selectpicker.prototype.setStyle;
    this.selectAll = Selectpicker.prototype.selectAll;
    this.deselectAll = Selectpicker.prototype.deselectAll;
    this.destroy = Selectpicker.prototype.remove;
    this.remove = Selectpicker.prototype.remove;
    this.show = Selectpicker.prototype.show;
    this.hide = Selectpicker.prototype.hide;

    this.init();
  };

  Selectpicker.VERSION = '1.7.0';

  // part of this is duplicated in i18n/defaults-en_US.js. Make sure to update both.
  Selectpicker.DEFAULTS = {
    noneSelectedText: 'Nothing selected',
    noneResultsText: 'No results matched {0}',
    countSelectedText: function (numSelected, numTotal) {
      return (numSelected == 1) ? "{0} item selected" : "{0} items selected";
    },
    maxOptionsText: function (numAll, numGroup) {
      return [
        (numAll == 1) ? 'Limit reached ({n} item max)' : 'Limit reached ({n} items max)',
        (numGroup == 1) ? 'Group limit reached ({n} item max)' : 'Group limit reached ({n} items max)'
      ];
    },
    selectAllText: 'Select All',
    deselectAllText: 'Deselect All',
    doneButton: false,
    doneButtonText: 'Close',
    multipleSeparator: ', ',
    styleBase: 'btn',
    style: 'btn-default',
    size: 'auto',
    title: null,
    selectedTextFormat: 'values',
    width: false,
    container: false,
    hideDisabled: false,
    showSubtext: false,
    showIcon: true,
    showContent: true,
    dropupAuto: true,
    header: false,
    liveSearch: false,
    liveSearchPlaceholder: null,
    liveSearchNormalize: false,
    liveSearchStyle: 'contains',
    actionsBox: false,
    iconBase: 'glyphicon',
    tickIcon: 'glyphicon-ok',
    maxOptions: false,
    mobile: false,
    selectOnTab: false,
    dropdownAlignRight: false
  };

  Selectpicker.prototype = {

    constructor: Selectpicker,

    init: function () {
      var that = this,
          id = this.$element.attr('id');

      this.$element.addClass('bs-select-hidden');
      // store originalIndex (key) and newIndex (value) in this.liObj for fast accessibility
      // allows us to do this.$lis.eq(that.liObj[index]) instead of this.$lis.filter('[data-original-index="' + index + '"]')
      this.liObj = {};
      this.multiple = this.$element.prop('multiple');
      this.autofocus = this.$element.prop('autofocus');
      this.$newElement = this.createView();
      this.$element.after(this.$newElement);
      this.$button = this.$newElement.children('button');
      this.$menu = this.$newElement.children('.dropdown-menu');
      this.$menuInner = this.$menu.children('.inner');
      this.$searchbox = this.$menu.find('input');

      if (this.options.dropdownAlignRight)
        this.$menu.addClass('dropdown-menu-right');

      if (typeof id !== 'undefined') {
        this.$button.attr('data-id', id);
        $('label[for="' + id + '"]').click(function (e) {
          e.preventDefault();
          that.$button.focus();
        });
      }

      this.checkDisabled();
      this.clickListener();
      if (this.options.liveSearch) this.liveSearchListener();
      this.render();
      this.setStyle();
      this.setWidth();
      if (this.options.container) this.selectPosition();
      this.$menu.data('this', this);
      this.$newElement.data('this', this);
      if (this.options.mobile) this.mobile();

      this.$newElement.on('hide.bs.dropdown', function (e) {
        that.$element.trigger('hide.bs.select', e);
      });
      
      this.$newElement.on('hidden.bs.dropdown', function (e) {
        that.$element.trigger('hidden.bs.select', e);
      });
      
      this.$newElement.on('show.bs.dropdown', function (e) {
        that.$element.trigger('show.bs.select', e);
      });
      
      this.$newElement.on('shown.bs.dropdown', function (e) {
        that.$element.trigger('shown.bs.select', e);
      });

      setTimeout(function () {
        that.$element.trigger('loaded.bs.select');
      });
    },

    createDropdown: function () {
      // Options
      // If we are multiple, then add the show-tick class by default
      var multiple = this.multiple ? ' show-tick' : '',
          inputGroup = this.$element.parent().hasClass('input-group') ? ' input-group-btn' : '',
          autofocus = this.autofocus ? ' autofocus' : '';
      // Elements
      var header = this.options.header ? '<div class="popover-title"><button type="button" class="close" aria-hidden="true">&times;</button>' + this.options.header + '</div>' : '';
      var searchbox = this.options.liveSearch ?
      '<div class="bs-searchbox">' +
      '<input type="text" class="form-control" autocomplete="off"' +
      (null === this.options.liveSearchPlaceholder ? '' : ' placeholder="' + htmlEscape(this.options.liveSearchPlaceholder) + '"') + '>' +
      '</div>'
          : '';
      var actionsbox = this.multiple && this.options.actionsBox ?
      '<div class="bs-actionsbox">' +
      '<div class="btn-group btn-group-sm btn-block">' +
      '<button type="button" class="actions-btn bs-select-all btn btn-default">' +
      this.options.selectAllText +
      '</button>' +
      '<button type="button" class="actions-btn bs-deselect-all btn btn-default">' +
      this.options.deselectAllText +
      '</button>' +
      '</div>' +
      '</div>'
          : '';
      var donebutton = this.multiple && this.options.doneButton ?
      '<div class="bs-donebutton">' +
      '<div class="btn-group btn-block">' +
      '<button type="button" class="btn btn-sm btn-default">' +
      this.options.doneButtonText +
      '</button>' +
      '</div>' +
      '</div>'
          : '';
      var drop =
          '<div class="btn-group bootstrap-select' + multiple + inputGroup + '">' +
          '<button type="button" class="' + this.options.styleBase + ' dropdown-toggle" data-toggle="dropdown"' + autofocus + '>' +
          '<span class="filter-option pull-left"></span>&nbsp;' +
          '<span class="caret"></span>' +
          '</button>' +
          '<div class="dropdown-menu open">' +
          header +
          searchbox +
          actionsbox +
          '<ul class="dropdown-menu inner" role="menu">' +
          '</ul>' +
          donebutton +
          '</div>' +
          '</div>';

      return $(drop);
    },

    createView: function () {
      var $drop = this.createDropdown(),
          li = this.createLi();

      $drop.find('ul')[0].innerHTML = li;
      return $drop;
    },

    reloadLi: function () {
      //Remove all children.
      this.destroyLi();
      //Re build
      var li = this.createLi();
      this.$menuInner[0].innerHTML = li;
    },

    destroyLi: function () {
      this.$menu.find('li').remove();
    },

    createLi: function () {
      var that = this,
          _li = [],
          optID = 0,
          titleOption = document.createElement('option'),
          liIndex = -1; // increment liIndex whenever a new <li> element is created to ensure liObj is correct

      // Helper functions
      /**
       * @param content
       * @param [index]
       * @param [classes]
       * @param [optgroup]
       * @returns {string}
       */
      var generateLI = function (content, index, classes, optgroup) {
        return '<li' +
            ((typeof classes !== 'undefined' & '' !== classes) ? ' class="' + classes + '"' : '') +
            ((typeof index !== 'undefined' & null !== index) ? ' data-original-index="' + index + '"' : '') +
            ((typeof optgroup !== 'undefined' & null !== optgroup) ? 'data-optgroup="' + optgroup + '"' : '') +
            '>' + content + '</li>';
      };

      /**
       * @param text
       * @param [classes]
       * @param [inline]
       * @param [tokens]
       * @returns {string}
       */
      var generateA = function (text, classes, inline, tokens) {
        return '<a tabindex="0"' +
            (typeof classes !== 'undefined' ? ' class="' + classes + '"' : '') +
            (typeof inline !== 'undefined' ? ' style="' + inline + '"' : '') +
            (that.options.liveSearchNormalize ? ' data-normalized-text="' + normalizeToBase(htmlEscape(text)) + '"' : '') +
            (typeof tokens !== 'undefined' || tokens !== null ? ' data-tokens="' + tokens + '"' : '') +
            '>' + text +
            '<span class="' + that.options.iconBase + ' ' + that.options.tickIcon + ' check-mark"></span>' +
            '</a>';
      };

      if (this.options.title && !this.multiple && !this.$element.find('.bs-title-option').length) {
        liIndex--; // this option doesn't create a new <li> element, but does add a new option, so liIndex is decreased
        // Use native JS to prepend option (faster)
        var element = this.$element[0];
        titleOption.className = 'bs-title-option';
        titleOption.appendChild(document.createTextNode(this.options.title));
        titleOption.value = '';
        element.insertBefore(titleOption, element.firstChild);
        // Check if selected attribute is already set on an option. If not, select the titleOption option.
        if (element.options[element.selectedIndex].getAttribute('selected') === null) titleOption.selected = true;
      }

      this.$element.find('option').each(function (index) {
        var $this = $(this);

        liIndex++;

        if ($this.hasClass('bs-title-option')) return;

        // Get the class and text for the option
        var optionClass = this.className || '',
            inline = this.style.cssText,
            text = $this.data('content') ? $this.data('content') : $this.html(),
            tokens = $this.data('tokens') ? $this.data('tokens') : null,
            subtext = typeof $this.data('subtext') !== 'undefined' ? '<small class="text-muted">' + $this.data('subtext') + '</small>' : '',
            icon = typeof $this.data('icon') !== 'undefined' ? '<span class="' + that.options.iconBase + ' ' + $this.data('icon') + '"></span> ' : '',
            isDisabled = this.disabled || this.parentElement.tagName === "OPTGROUP" && this.parentElement.disabled;

        if (icon !== '' && isDisabled) {
          icon = '<span>' + icon + '</span>';
        }

        if (that.options.hideDisabled && isDisabled) {
          return;
        }

        if (!$this.data('content')) {
          // Prepend any icon and append any subtext to the main text.
          text = icon + '<span class="text">' + text + subtext + '</span>';
        }

        if (this.parentElement.tagName === "OPTGROUP" && $this.data('divider') !== true) {
          if ($this.index() === 0) { // Is it the first option of the optgroup?
            optID += 1;

            // Get the opt group label
            var label = this.parentElement.label,
                labelSubtext = typeof $this.parent().data('subtext') !== 'undefined' ? '<small class="text-muted">' + $this.parent().data('subtext') + '</small>' : '',
                labelIcon = $this.parent().data('icon') ? '<span class="' + that.options.iconBase + ' ' + $this.parent().data('icon') + '"></span> ' : '',
                optGroupClass = ' ' + this.parentElement.className || '';
            
            label = labelIcon + '<span class="text">' + label + labelSubtext + '</span>';

            if (index !== 0 && _li.length > 0) { // Is it NOT the first option of the select && are there elements in the dropdown?
              liIndex++;
              _li.push(generateLI('', null, 'divider', optID + 'div'));
            }
            liIndex++;
            _li.push(generateLI(label, null, 'dropdown-header' + optGroupClass, optID));
          }
          _li.push(generateLI(generateA(text, 'opt ' + optionClass + optGroupClass, inline, tokens), index, '', optID));
        } else if ($this.data('divider') === true) {
          _li.push(generateLI('', index, 'divider'));
        } else if ($this.data('hidden') === true) {
          _li.push(generateLI(generateA(text, optionClass, inline, tokens), index, 'hidden is-hidden'));
        } else {
          if (this.previousElementSibling && this.previousElementSibling.tagName === "OPTGROUP") {
            liIndex++;
            _li.push(generateLI('', null, 'divider', optID + 'div'));
          }
          _li.push(generateLI(generateA(text, optionClass, inline, tokens), index));
        }

        that.liObj[index] = liIndex;
      });

      //If we are not multiple, we don't have a selected item, and we don't have a title, select the first element so something is set in the button
      if (!this.multiple && this.$element.find('option:selected').length === 0 && !this.options.title) {
        this.$element.find('option').eq(0).prop('selected', true).attr('selected', 'selected');
      }

      return _li.join('');
    },

    findLis: function () {
      if (this.$lis == null) this.$lis = this.$menu.find('li');
      return this.$lis;
    },

    /**
     * @param [updateLi] defaults to true
     */
    render: function (updateLi) {
      var that = this,
          notDisabled;

      //Update the LI to match the SELECT
      if (updateLi !== false) {
        this.$element.find('option').each(function (index) {
          var $lis = that.findLis().eq(that.liObj[index]);

          that.setDisabled(index, this.disabled || this.parentElement.tagName === "OPTGROUP" && this.parentElement.disabled, $lis);
          that.setSelected(index, this.selected, $lis);
        });
      }

      this.tabIndex();

      var selectedItems = this.$element.find('option').map(function () {
        if (this.selected) {
          if (that.options.hideDisabled && (this.disabled || this.parentElement.tagName === "OPTGROUP" && this.parentElement.disabled)) return false;

          var $this = $(this),
              icon = $this.data('icon') && that.options.showIcon ? '<i class="' + that.options.iconBase + ' ' + $this.data('icon') + '"></i> ' : '',
              subtext;

          if (that.options.showSubtext && $this.data('subtext') && !that.multiple) {
            subtext = ' <small class="text-muted">' + $this.data('subtext') + '</small>';
          } else {
            subtext = '';
          }
          if (typeof $this.attr('title') !== 'undefined') {
            return $this.attr('title');
          } else if ($this.data('content') && that.options.showContent) {
            return $this.data('content');
          } else {
            return icon + $this.html() + subtext;
          }
        }
      }).toArray();

      //Fixes issue in IE10 occurring when no default option is selected and at least one option is disabled
      //Convert all the values into a comma delimited string
      var title = !this.multiple ? selectedItems[0] : selectedItems.join(this.options.multipleSeparator);

      //If this is multi select, and the selectText type is count, the show 1 of 2 selected etc..
      if (this.multiple && this.options.selectedTextFormat.indexOf('count') > -1) {
        var max = this.options.selectedTextFormat.split('>');
        if ((max.length > 1 && selectedItems.length > max[1]) || (max.length == 1 && selectedItems.length >= 2)) {
          notDisabled = this.options.hideDisabled ? ', [disabled]' : '';
          var totalCount = this.$element.find('option').not('[data-divider="true"], [data-hidden="true"]' + notDisabled).length,
              tr8nText = (typeof this.options.countSelectedText === 'function') ? this.options.countSelectedText(selectedItems.length, totalCount) : this.options.countSelectedText;
          title = tr8nText.replace('{0}', selectedItems.length.toString()).replace('{1}', totalCount.toString());
        }
      }

      if (this.options.title == undefined) {
        this.options.title = this.$element.attr('title');
      }

      if (this.options.selectedTextFormat == 'static') {
        title = this.options.title;
      }

      //If we dont have a title, then use the default, or if nothing is set at all, use the not selected text
      if (!title) {
        title = typeof this.options.title !== 'undefined' ? this.options.title : this.options.noneSelectedText;
      }

      //strip all html-tags and trim the result
      this.$button.attr('title', $.trim(title.replace(/<[^>]*>?/g, '')));
      this.$button.children('.filter-option').html(title);

      this.$element.trigger('rendered.bs.select');
    },

    /**
     * @param [style]
     * @param [status]
     */
    setStyle: function (style, status) {
      if (this.$element.attr('class')) {
        this.$newElement.addClass(this.$element.attr('class').replace(/selectpicker|mobile-device|bs-select-hidden|validate\[.*\]/gi, ''));
      }

      var buttonClass = style ? style : this.options.style;

      if (status == 'add') {
        this.$button.addClass(buttonClass);
      } else if (status == 'remove') {
        this.$button.removeClass(buttonClass);
      } else {
        this.$button.removeClass(this.options.style);
        this.$button.addClass(buttonClass);
      }
    },

    liHeight: function (refresh) {
      if (!refresh && (this.options.size === false || this.sizeInfo)) return;

      var newElement = document.createElement('div'),
          menu = document.createElement('div'),
          menuInner = document.createElement('ul'),
          divider = document.createElement('li'),
          li = document.createElement('li'),
          a = document.createElement('a'),
          text = document.createElement('span'),
          header = this.options.header ? this.$menu.find('.popover-title')[0].cloneNode(true) : null,
          search = this.options.liveSearch ? document.createElement('div') : null,
          actions = this.options.actionsBox && this.multiple ? this.$menu.find('.bs-actionsbox')[0].cloneNode(true) : null,
          doneButton = this.options.doneButton && this.multiple ? this.$menu.find('.bs-donebutton')[0].cloneNode(true) : null;

      text.className = 'text';
      newElement.className = this.$menu[0].parentNode.className + ' open';
      menu.className = 'dropdown-menu open';
      menuInner.className = 'dropdown-menu inner';
      divider.className = 'divider';

      text.appendChild(document.createTextNode('Inner text'));
      a.appendChild(text);
      li.appendChild(a);
      menuInner.appendChild(li);
      menuInner.appendChild(divider);
      if (header) menu.appendChild(header);
      if (search) {
        // create a span instead of input as creating an input element is slower
        var input = document.createElement('span');
        search.className = 'bs-searchbox';
        input.className = 'form-control';
        search.appendChild(input);
        menu.appendChild(search);
      }
      if (actions) menu.appendChild(actions);
      menu.appendChild(menuInner);
      if (doneButton) menu.appendChild(doneButton);
      newElement.appendChild(menu);

      document.body.appendChild(newElement);

      var liHeight = a.offsetHeight,
          headerHeight = header ? header.offsetHeight : 0,
          searchHeight = search ? search.offsetHeight : 0,
          actionsHeight = actions ? actions.offsetHeight : 0,
          doneButtonHeight = doneButton ? doneButton.offsetHeight : 0,
          dividerHeight = $(divider).outerHeight(true),
          // fall back to jQuery if getComputedStyle is not supported
          menuStyle = getComputedStyle ? getComputedStyle(menu) : false,
          $menu = menuStyle ? $(menu) : null,
          menuPadding = parseInt(menuStyle ? menuStyle.paddingTop : $menu.css('paddingTop')) +
                        parseInt(menuStyle ? menuStyle.paddingBottom : $menu.css('paddingBottom')) +
                        parseInt(menuStyle ? menuStyle.borderTopWidth : $menu.css('borderTopWidth')) +
                        parseInt(menuStyle ? menuStyle.borderBottomWidth : $menu.css('borderBottomWidth')),
          menuExtras =  menuPadding + 
                        parseInt(menuStyle ? menuStyle.marginTop : $menu.css('marginTop')) + 
                        parseInt(menuStyle ? menuStyle.marginBottom : $menu.css('marginBottom')) + 2;

      document.body.removeChild(newElement);

      this.sizeInfo = {
        liHeight: liHeight,
        headerHeight: headerHeight,
        searchHeight: searchHeight,
        actionsHeight: actionsHeight,
        doneButtonHeight: doneButtonHeight,
        dividerHeight: dividerHeight,
        menuPadding: menuPadding,
        menuExtras: menuExtras
      };
    },

    setSize: function () {
      this.findLis();
      this.liHeight();
      var that = this,
          $menu = this.$menu,
          $menuInner = this.$menuInner,
          $window = $(window),
          selectHeight = this.$newElement[0].offsetHeight,
          liHeight = this.sizeInfo['liHeight'],
          headerHeight = this.sizeInfo['headerHeight'],
          searchHeight = this.sizeInfo['searchHeight'],
          actionsHeight = this.sizeInfo['actionsHeight'],
          doneButtonHeight = this.sizeInfo['doneButtonHeight'],
          divHeight = this.sizeInfo['dividerHeight'],
          menuPadding = this.sizeInfo['menuPadding'],
          menuExtras = this.sizeInfo['menuExtras'],
          notDisabled = this.options.hideDisabled ? '.disabled' : '',
          menuHeight,
          selectOffsetTop,
          selectOffsetBot,
          posVert = function () {
            selectOffsetTop = that.$newElement[0].offsetTop - window.scrollY;
            selectOffsetBot = window.innerHeight - selectOffsetTop - selectHeight;
          };

      posVert();

      if (this.options.header) $menu.css('padding-top', 0);

      if (this.options.size === 'auto') {
        var getSize = function () {
          var minHeight,
              hasClass = function (className, include) {
                return function (element) {
                    if (include) {
                        return (element.classList ? element.classList.contains(className) : $(element).hasClass(className));
                    } else {
                        return !(element.classList ? element.classList.contains(className) : $(element).hasClass(className));
                    }
                };
              },
              lis = that.$menuInner[0].getElementsByTagName('li'),
              lisVisible = Array.prototype.filter ? Array.prototype.filter.call(lis, hasClass('hidden', false)) : that.$lis.not('.hidden'),
              optGroup = Array.prototype.filter ? Array.prototype.filter.call(lisVisible, hasClass('dropdown-header', true)) : lisVisible.filter('.dropdown-header');

          posVert();
          menuHeight = selectOffsetBot - menuExtras;

          if (that.options.dropupAuto) {
            that.$newElement.toggleClass('dropup', selectOffsetTop > selectOffsetBot && (menuHeight - menuExtras) < $menu.height());
          }
          if (that.$newElement.hasClass('dropup')) {
            menuHeight = selectOffsetTop - menuExtras;
          }

          if ((lisVisible.length + optGroup.length) > 3) {
            minHeight = liHeight * 3 + menuExtras - 2;
          } else {
            minHeight = 0;
          }

          $menu.css({
            'max-height': menuHeight + 'px',
            'overflow': 'hidden',
            'min-height': minHeight + headerHeight + searchHeight + actionsHeight + doneButtonHeight + 'px'
          });
          $menuInner.css({
            'max-height': menuHeight - headerHeight - searchHeight - actionsHeight - doneButtonHeight - menuPadding + 'px',
            'overflow-y': 'auto',
            'min-height': Math.max(minHeight - menuPadding, 0) + 'px'
          });
        };
        getSize();
        this.$searchbox.off('input.getSize propertychange.getSize').on('input.getSize propertychange.getSize', getSize);
        $window.off('resize.getSize scroll.getSize').on('resize.getSize scroll.getSize', getSize);
      } else if (this.options.size && this.options.size != 'auto' && this.$lis.not(notDisabled).length > this.options.size) {
        var optIndex = this.$lis.not('.divider').not(notDisabled).children().slice(0, this.options.size).last().parent().index(),
            divLength = this.$lis.slice(0, optIndex + 1).filter('.divider').length;
        menuHeight = liHeight * this.options.size + divLength * divHeight + menuPadding;

        if (that.options.dropupAuto) {
          //noinspection JSUnusedAssignment
          this.$newElement.toggleClass('dropup', selectOffsetTop > selectOffsetBot && (menuHeight - menuExtras) < $menu.height());
        }
        $menu.css({
          'max-height': menuHeight + headerHeight + searchHeight + actionsHeight + doneButtonHeight + 'px',
          'overflow': 'hidden',
          'min-height': ''
        });
        $menuInner.css({
          'max-height': menuHeight - menuPadding + 'px',
          'overflow-y': 'auto',
          'min-height': ''
        });
      }
    },

    setWidth: function () {
      if (this.options.width === 'auto') {
        this.$menu.css('min-width', '0');

        // Get correct width if element is hidden
        var $selectClone = this.$menu.parent().clone().appendTo('body'),
            $selectClone2 = this.options.container ? this.$newElement.clone().appendTo('body') : $selectClone,
            ulWidth = $selectClone.children('.dropdown-menu').outerWidth(),
            btnWidth = $selectClone2.css('width', 'auto').children('button').outerWidth();

        $selectClone.remove();
        $selectClone2.remove();

        // Set width to whatever's larger, button title or longest option
        this.$newElement.css('width', Math.max(ulWidth, btnWidth) + 'px');
      } else if (this.options.width === 'fit') {
        // Remove inline min-width so width can be changed from 'auto'
        this.$menu.css('min-width', '');
        this.$newElement.css('width', '').addClass('fit-width');
      } else if (this.options.width) {
        // Remove inline min-width so width can be changed from 'auto'
        this.$menu.css('min-width', '');
        this.$newElement.css('width', this.options.width);
      } else {
        // Remove inline min-width/width so width can be changed
        this.$menu.css('min-width', '');
        this.$newElement.css('width', '');
      }
      // Remove fit-width class if width is changed programmatically
      if (this.$newElement.hasClass('fit-width') && this.options.width !== 'fit') {
        this.$newElement.removeClass('fit-width');
      }
    },

    selectPosition: function () {
      var that = this,
          drop = '<div />',
          $drop = $(drop),
          pos,
          actualHeight,
          getPlacement = function ($element) {
            $drop.addClass($element.attr('class').replace(/form-control|fit-width/gi, '')).toggleClass('dropup', $element.hasClass('dropup'));
            pos = $element.offset();
            actualHeight = $element.hasClass('dropup') ? 0 : $element[0].offsetHeight;
            $drop.css({
              'top': pos.top + actualHeight,
              'left': pos.left,
              'width': $element[0].offsetWidth,
              'position': 'absolute'
            });
          };

      this.$newElement.on('click', function () {
        if (that.isDisabled()) {
          return;
        }
        getPlacement($(this));
        $drop.appendTo(that.options.container);
        $drop.toggleClass('open', !$(this).hasClass('open'));
        $drop.append(that.$menu);
      });

      $(window).on('resize scroll', function () {
        getPlacement(that.$newElement);
      });

      this.$element.on('hide.bs.select', function () {
        $drop.detach();
      });
    },

    setSelected: function (index, selected, $lis) {
      if (!$lis) {
        var $lis = this.findLis().eq(this.liObj[index]);
      }

      $lis.toggleClass('selected', selected);
    },

    setDisabled: function (index, disabled, $lis) {
      if (!$lis) {
        var $lis = this.findLis().eq(this.liObj[index]);
      }

      if (disabled) {
        $lis.addClass('disabled').children('a').attr('href', '#').attr('tabindex', -1);
      } else {
        $lis.removeClass('disabled').children('a').removeAttr('href').attr('tabindex', 0);
      }
    },

    isDisabled: function () {
      return this.$element[0].disabled;
    },

    checkDisabled: function () {
      var that = this;

      if (this.isDisabled()) {
        this.$newElement.addClass('disabled');
        this.$button.addClass('disabled').attr('tabindex', -1);
      } else {
        if (this.$button.hasClass('disabled')) {
          this.$newElement.removeClass('disabled');
          this.$button.removeClass('disabled');
        }

        if (this.$button.attr('tabindex') == -1 && !this.$element.data('tabindex')) {
          this.$button.removeAttr('tabindex');
        }
      }

      this.$button.click(function () {
        return !that.isDisabled();
      });
    },

    tabIndex: function () {
      if (this.$element.is('[tabindex]')) {
        this.$element.data('tabindex', this.$element.attr('tabindex'));
        this.$button.attr('tabindex', this.$element.data('tabindex'));
      }
    },

    clickListener: function () {
      var that = this,
          $document = $(document);

      this.$newElement.on('touchstart.dropdown', '.dropdown-menu', function (e) {
        e.stopPropagation();
      });

      $document.data('spaceSelect', false);
      
      this.$button.on('keyup', function (e) {
        if (/(32)/.test(e.keyCode.toString(10)) && $document.data('spaceSelect')) {
            e.preventDefault();
            $document.data('spaceSelect', false);
        }
      });

      this.$newElement.on('click', function () {
        that.setSize();
        that.$element.on('shown.bs.select', function () {
          if (!that.options.liveSearch && !that.multiple) {
            that.$menu.find('.selected a').focus();
          } else if (!that.multiple) {
            var selectedIndex = that.liObj[that.$element[0].selectedIndex];

            if (typeof selectedIndex !== 'number') return;
            
            // scroll to selected option
            var offset = that.$lis.eq(selectedIndex)[0].offsetTop - that.$menuInner[0].offsetTop;
            offset = offset - that.$menuInner[0].offsetHeight/2 + that.sizeInfo.liHeight/2;
            that.$menuInner[0].scrollTop = offset;
          }
        });
      });

      this.$menu.on('click', 'li a', function (e) {
        var $this = $(this),
            clickedIndex = $this.parent().data('originalIndex'),
            prevValue = that.$element.val(),
            prevIndex = that.$element.prop('selectedIndex');

        // Don't close on multi choice menu
        if (that.multiple) {
          e.stopPropagation();
        }

        e.preventDefault();

        //Don't run if we have been disabled
        if (!that.isDisabled() && !$this.parent().hasClass('disabled')) {
          var $options = that.$element.find('option'),
              $option = $options.eq(clickedIndex),
              state = $option.prop('selected'),
              $optgroup = $option.parent('optgroup'),
              maxOptions = that.options.maxOptions,
              maxOptionsGrp = $optgroup.data('maxOptions') || false;

          if (!that.multiple) { // Deselect all others if not multi select box
            $options.prop('selected', false);
            $option.prop('selected', true);
            that.$menu.find('.selected').removeClass('selected');
            that.setSelected(clickedIndex, true);
          } else { // Toggle the one we have chosen if we are multi select.
            $option.prop('selected', !state);
            that.setSelected(clickedIndex, !state);
            $this.blur();

            if (maxOptions !== false || maxOptionsGrp !== false) {
              var maxReached = maxOptions < $options.filter(':selected').length,
                  maxReachedGrp = maxOptionsGrp < $optgroup.find('option:selected').length;

              if ((maxOptions && maxReached) || (maxOptionsGrp && maxReachedGrp)) {
                if (maxOptions && maxOptions == 1) {
                  $options.prop('selected', false);
                  $option.prop('selected', true);
                  that.$menu.find('.selected').removeClass('selected');
                  that.setSelected(clickedIndex, true);
                } else if (maxOptionsGrp && maxOptionsGrp == 1) {
                  $optgroup.find('option:selected').prop('selected', false);
                  $option.prop('selected', true);
                  var optgroupID = $this.parent().data('optgroup');
                  that.$menu.find('[data-optgroup="' + optgroupID + '"]').removeClass('selected');
                  that.setSelected(clickedIndex, true);
                } else {
                  var maxOptionsArr = (typeof that.options.maxOptionsText === 'function') ?
                          that.options.maxOptionsText(maxOptions, maxOptionsGrp) : that.options.maxOptionsText,
                      maxTxt = maxOptionsArr[0].replace('{n}', maxOptions),
                      maxTxtGrp = maxOptionsArr[1].replace('{n}', maxOptionsGrp),
                      $notify = $('<div class="notify"></div>');
                  // If {var} is set in array, replace it
                  /** @deprecated */
                  if (maxOptionsArr[2]) {
                    maxTxt = maxTxt.replace('{var}', maxOptionsArr[2][maxOptions > 1 ? 0 : 1]);
                    maxTxtGrp = maxTxtGrp.replace('{var}', maxOptionsArr[2][maxOptionsGrp > 1 ? 0 : 1]);
                  }

                  $option.prop('selected', false);

                  that.$menu.append($notify);

                  if (maxOptions && maxReached) {
                    $notify.append($('<div>' + maxTxt + '</div>'));
                    that.$element.trigger('maxReached.bs.select');
                  }

                  if (maxOptionsGrp && maxReachedGrp) {
                    $notify.append($('<div>' + maxTxtGrp + '</div>'));
                    that.$element.trigger('maxReachedGrp.bs.select');
                  }

                  setTimeout(function () {
                    that.setSelected(clickedIndex, false);
                  }, 10);

                  $notify.delay(750).fadeOut(300, function () {
                    $(this).remove();
                  });
                }
              }
            }
          }

          if (!that.multiple) {
            that.$button.focus();
          } else if (that.options.liveSearch) {
            that.$searchbox.focus();
          }

          // Trigger select 'change'
          if ((prevValue != that.$element.val() && that.multiple) || (prevIndex != that.$element.prop('selectedIndex') && !that.multiple)) {
            that.$element.change();
            // $option.prop('selected') is current option state (selected/unselected). state is previous option state.
            that.$element.trigger('changed.bs.select', [clickedIndex, $option.prop('selected'), state]);
          }
        }
      });

      this.$menu.on('click', 'li.disabled a, .popover-title, .popover-title :not(.close)', function (e) {
        if (e.currentTarget == this) {
          e.preventDefault();
          e.stopPropagation();
          if (that.options.liveSearch && !$(e.target).hasClass('close')) {
            that.$searchbox.focus();
          } else {
            that.$button.focus();
          }
        }
      });

      this.$menu.on('click', 'li.divider, li.dropdown-header', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (that.options.liveSearch) {
          that.$searchbox.focus();
        } else {
          that.$button.focus();
        }
      });

      this.$menu.on('click', '.popover-title .close', function () {
        that.$button.click();
      });

      this.$searchbox.on('click', function (e) {
        e.stopPropagation();
      });

      this.$menu.on('click', '.actions-btn', function (e) {
        if (that.options.liveSearch) {
          that.$searchbox.focus();
        } else {
          that.$button.focus();
        }

        e.preventDefault();
        e.stopPropagation();

        if ($(this).hasClass('bs-select-all')) {
          that.selectAll();
        } else {
          that.deselectAll();
        }
        that.$element.change();
      });

      this.$element.change(function () {
        that.render(false);
      });
    },

    liveSearchListener: function () {
      var that = this,
          $no_results = $('<li class="no-results"></li>');

      this.$newElement.on('click.dropdown.data-api touchstart.dropdown.data-api', function () {
        that.$menuInner.find('.active').removeClass('active');
        if (!!that.$searchbox.val()) {
          that.$searchbox.val('');
          that.$lis.not('.is-hidden').removeClass('hidden');
          if (!!$no_results.parent().length) $no_results.remove();
        }
        if (!that.multiple) that.$menuInner.find('.selected').addClass('active');
        setTimeout(function () {
          that.$searchbox.focus();
        }, 10);
      });

      this.$searchbox.on('click.dropdown.data-api focus.dropdown.data-api touchend.dropdown.data-api', function (e) {
        e.stopPropagation();
      });

      this.$searchbox.on('input propertychange', function () {
        if (that.$searchbox.val()) {
          var $searchBase = that.$lis.not('.is-hidden').removeClass('hidden').children('a');
          if (that.options.liveSearchNormalize) {
            $searchBase = $searchBase.not(':a' + that._searchStyle() + '(' + normalizeToBase(that.$searchbox.val()) + ')');
          } else {
            $searchBase = $searchBase.not(':' + that._searchStyle() + '(' + that.$searchbox.val() + ')');
          }
          $searchBase.parent().addClass('hidden');

          that.$lis.filter('.dropdown-header').each(function () {
            var $this = $(this),
                optgroup = $this.data('optgroup');

            if (that.$lis.filter('[data-optgroup=' + optgroup + ']').not($this).not('.hidden').length === 0) {
              $this.addClass('hidden');
              that.$lis.filter('[data-optgroup=' + optgroup + 'div]').addClass('hidden');
            }
          });

          var $lisVisible = that.$lis.not('.hidden');

          // hide divider if first or last visible, or if followed by another divider
          $lisVisible.each(function (index) {
            var $this = $(this);

            if ($this.hasClass('divider') && (
              $this.index() === $lisVisible.eq(0).index() ||
              $this.index() === $lisVisible.last().index() ||
              $lisVisible.eq(index + 1).hasClass('divider'))) {
              $this.addClass('hidden');
            }
          });

          if (!that.$lis.not('.hidden, .no-results').length) {
            if (!!$no_results.parent().length) {
              $no_results.remove();
            }
            $no_results.html(that.options.noneResultsText.replace('{0}', '"' + htmlEscape(that.$searchbox.val()) + '"')).show();
            that.$menuInner.append($no_results);
          } else if (!!$no_results.parent().length) {
            $no_results.remove();
          }

        } else {
          that.$lis.not('.is-hidden').removeClass('hidden');
          if (!!$no_results.parent().length) {
            $no_results.remove();
          }
        }

        that.$lis.filter('.active').removeClass('active');
        that.$lis.not('.hidden, .divider, .dropdown-header').eq(0).addClass('active').children('a').focus();
        $(this).focus();
      });
    },

    _searchStyle: function () {
      var style = 'icontains';
      switch (this.options.liveSearchStyle) {
        case 'begins':
        case 'startsWith':
          style = 'ibegins';
          break;
        case 'contains':
        default:
          break; //no need to change the default
      }

      return style;
    },

    val: function (value) {
      if (typeof value !== 'undefined') {
        this.$element.val(value);
        this.render();

        return this.$element;
      } else {
        return this.$element.val();
      }
    },

    selectAll: function () {
      this.findLis();
      this.$element.find('option:enabled').not('[data-divider], [data-hidden]').prop('selected', true);
      this.$lis.not('.divider, .dropdown-header, .disabled, .hidden').addClass('selected');
      this.render(false);
    },

    deselectAll: function () {
      this.findLis();
      this.$element.find('option:enabled').not('[data-divider], [data-hidden]').prop('selected', false);
      this.$lis.not('.divider, .dropdown-header, .disabled, .hidden').removeClass('selected');
      this.render(false);
    },

    keydown: function (e) {
      var $this = $(this),
          $parent = $this.is('input') ? $this.parent().parent() : $this.parent(),
          $items,
          that = $parent.data('this'),
          index,
          next,
          first,
          last,
          prev,
          nextPrev,
          prevIndex,
          isActive,
          selector = ':not(.disabled, .hidden, .dropdown-header, .divider)',
          keyCodeMap = {
            32: ' ',
            48: '0',
            49: '1',
            50: '2',
            51: '3',
            52: '4',
            53: '5',
            54: '6',
            55: '7',
            56: '8',
            57: '9',
            59: ';',
            65: 'a',
            66: 'b',
            67: 'c',
            68: 'd',
            69: 'e',
            70: 'f',
            71: 'g',
            72: 'h',
            73: 'i',
            74: 'j',
            75: 'k',
            76: 'l',
            77: 'm',
            78: 'n',
            79: 'o',
            80: 'p',
            81: 'q',
            82: 'r',
            83: 's',
            84: 't',
            85: 'u',
            86: 'v',
            87: 'w',
            88: 'x',
            89: 'y',
            90: 'z',
            96: '0',
            97: '1',
            98: '2',
            99: '3',
            100: '4',
            101: '5',
            102: '6',
            103: '7',
            104: '8',
            105: '9'
          };

      if (that.options.liveSearch) $parent = $this.parent().parent();

      if (that.options.container) $parent = that.$menu;

      $items = $('[role=menu] li a', $parent);

      isActive = that.$menu.parent().hasClass('open');

      if (!isActive && (e.keyCode >= 48 && e.keyCode <= 57 || event.keyCode >= 65 && event.keyCode <= 90)) {
        if (!that.options.container) {
          that.setSize();
          that.$menu.parent().addClass('open');
          isActive = true;
        } else {
          that.$newElement.trigger('click');
        }
        that.$searchbox.focus();
      }

      if (that.options.liveSearch) {
        if (/(^9$|27)/.test(e.keyCode.toString(10)) && isActive && that.$menu.find('.active').length === 0) {
          e.preventDefault();
          that.$menu.parent().removeClass('open');
          if (that.options.container) that.$newElement.removeClass('open');
          that.$button.focus();
        }
        // $items contains li elements when liveSearch is enabled
        $items = $('[role=menu] li:not(.disabled, .hidden, .dropdown-header, .divider)', $parent);
        if (!$this.val() && !/(38|40)/.test(e.keyCode.toString(10))) {
          if ($items.filter('.active').length === 0) {
            $items = that.$newElement.find('li');
            if (that.options.liveSearchNormalize) {
              $items = $items.filter(':a' + that._searchStyle() + '(' + normalizeToBase(keyCodeMap[e.keyCode]) + ')');
            } else {
              $items = $items.filter(':' + that._searchStyle() + '(' + keyCodeMap[e.keyCode] + ')');
            }
          }
        }
      }

      if (!$items.length) return;

      if (/(38|40)/.test(e.keyCode.toString(10))) {
        index = $items.index($items.filter(':focus'));
        first = $items.parent(selector).first().data('originalIndex');
        last = $items.parent(selector).last().data('originalIndex');
        next = $items.eq(index).parent().nextAll(selector).eq(0).data('originalIndex');
        prev = $items.eq(index).parent().prevAll(selector).eq(0).data('originalIndex');
        nextPrev = $items.eq(next).parent().prevAll(selector).eq(0).data('originalIndex');

        if (that.options.liveSearch) {
          $items.each(function (i) {
            if (!$(this).hasClass('disabled')) {
              $(this).data('index', i);
            }
          });
          index = $items.index($items.filter('.active'));
          first = $items.first().data('index');
          last = $items.last().data('index');
          next = $items.eq(index).nextAll().eq(0).data('index');
          prev = $items.eq(index).prevAll().eq(0).data('index');
          nextPrev = $items.eq(next).prevAll().eq(0).data('index');
        }

        prevIndex = $this.data('prevIndex');

        if (e.keyCode == 38) {
          if (that.options.liveSearch) index -= 1;
          if (index != nextPrev && index > prev) index = prev;
          if (index < first) index = first;
          if (index == prevIndex) index = last;
        } else if (e.keyCode == 40) {
          if (that.options.liveSearch) index += 1;
          if (index == -1) index = 0;
          if (index != nextPrev && index < next) index = next;
          if (index > last) index = last;
          if (index == prevIndex) index = first;
        }

        $this.data('prevIndex', index);

        if (!that.options.liveSearch) {
          $items.eq(index).focus();
        } else {
          e.preventDefault();
          if (!$this.hasClass('dropdown-toggle')) {
            $items.removeClass('active').eq(index).addClass('active').children('a').focus();
            $this.focus();
          }
        }

      } else if (!$this.is('input')) {
        var keyIndex = [],
            count,
            prevKey;

        $items.each(function () {
          if (!$(this).parent().hasClass('disabled')) {
            if ($.trim($(this).text().toLowerCase()).substring(0, 1) == keyCodeMap[e.keyCode]) {
              keyIndex.push($(this).parent().index());
            }
          }
        });

        count = $(document).data('keycount');
        count++;
        $(document).data('keycount', count);

        prevKey = $.trim($(':focus').text().toLowerCase()).substring(0, 1);

        if (prevKey != keyCodeMap[e.keyCode]) {
          count = 1;
          $(document).data('keycount', count);
        } else if (count >= keyIndex.length) {
          $(document).data('keycount', 0);
          if (count > keyIndex.length) count = 1;
        }

        $items.eq(keyIndex[count - 1]).focus();
      }

      // Select focused option if "Enter", "Spacebar" or "Tab" (when selectOnTab is true) are pressed inside the menu.
      if ((/(13|32)/.test(e.keyCode.toString(10)) || (/(^9$)/.test(e.keyCode.toString(10)) && that.options.selectOnTab)) && isActive) {
        if (!/(32)/.test(e.keyCode.toString(10))) e.preventDefault();
        if (!that.options.liveSearch) {
          var elem = $(':focus');
          elem.click();
          // Bring back focus for multiselects
          elem.focus();
          // Prevent screen from scrolling if the user hit the spacebar
          e.preventDefault();
          // Fixes spacebar selection of dropdown items in FF & IE
          $(document).data('spaceSelect', true);
        } else if (!/(32)/.test(e.keyCode.toString(10))) {
          that.$menu.find('.active a').click();
          $this.focus();
        }
        $(document).data('keycount', 0);
      }

      if ((/(^9$|27)/.test(e.keyCode.toString(10)) && isActive && (that.multiple || that.options.liveSearch)) || (/(27)/.test(e.keyCode.toString(10)) && !isActive)) {
        that.$menu.parent().removeClass('open');
        if (that.options.container) that.$newElement.removeClass('open');
        that.$button.focus();
      }
    },

    mobile: function () {
      this.$element.addClass('mobile-device').appendTo(this.$newElement);
      if (this.options.container) this.$menu.hide();
    },

    refresh: function () {
      this.$lis = null;
      this.reloadLi();
      this.render();
      this.checkDisabled();
      this.liHeight(true);
      this.setStyle();
      this.setWidth();
      this.$searchbox.trigger('propertychange');

      this.$element.trigger('refreshed.bs.select');
    },

    hide: function () {
      this.$newElement.hide();
    },

    show: function () {
      this.$newElement.show();
    },

    remove: function () {
      this.$newElement.remove();
      this.$element.remove();
    }
  };

  // SELECTPICKER PLUGIN DEFINITION
  // ==============================
  function Plugin(option, event) {
    // get the args of the outer function..
    var args = arguments;
    // The arguments of the function are explicitly re-defined from the argument list, because the shift causes them
    // to get lost/corrupted in android 2.3 and IE9 #715 #775
    var _option = option,
        _event = event;
    [].shift.apply(args);

    var value;
    var chain = this.each(function () {
      var $this = $(this);
      if ($this.is('select')) {
        var data = $this.data('selectpicker'),
            options = typeof _option == 'object' && _option;

        if (!data) {
          var config = $.extend({}, Selectpicker.DEFAULTS, $.fn.selectpicker.defaults || {}, $this.data(), options);
          $this.data('selectpicker', (data = new Selectpicker(this, config, _event)));
        } else if (options) {
          for (var i in options) {
            if (options.hasOwnProperty(i)) {
              data.options[i] = options[i];
            }
          }
        }

        if (typeof _option == 'string') {
          if (data[_option] instanceof Function) {
            value = data[_option].apply(data, args);
          } else {
            value = data.options[_option];
          }
        }
      }
    });

    if (typeof value !== 'undefined') {
      //noinspection JSUnusedAssignment
      return value;
    } else {
      return chain;
    }
  }

  var old = $.fn.selectpicker;
  $.fn.selectpicker = Plugin;
  $.fn.selectpicker.Constructor = Selectpicker;

  // SELECTPICKER NO CONFLICT
  // ========================
  $.fn.selectpicker.noConflict = function () {
    $.fn.selectpicker = old;
    return this;
  };

  $(document)
      .data('keycount', 0)
      .on('keydown', '.bootstrap-select [data-toggle=dropdown], .bootstrap-select [role="menu"], .bs-searchbox input', Selectpicker.prototype.keydown)
      .on('focusin.modal', '.bootstrap-select [data-toggle=dropdown], .bootstrap-select [role="menu"], .bs-searchbox input', function (e) {
        e.stopPropagation();
      });

  // SELECTPICKER DATA-API
  // =====================
  $(window).on('load.bs.select.data-api', function () {
    $('.selectpicker').each(function () {
      var $selectpicker = $(this);
      Plugin.call($selectpicker, $selectpicker.data());
    })
  });
})(jQuery);

/*  breakpoints_min  */
/* global XA, Breakpoints, $ */
/*eslint no-console: ["error", { allow: ["log"] }] */
/* eslint no-unused-vars: 0 */
/* eslint guard-for-in: 0 */
/* eslint curly: 0 */
/* eslint no-undef: 0 */
/**
* breakpoints-js v1.0.6
* https://github.com/amazingSurge/breakpoints-js
*
* Copyright (c) amazingSurge
* Released under the LGPL-3.0 license
*/
!function(t,n){if("function"==typeof define&&define.amd)define(["exports"],n);else if("undefined"!=typeof exports)n(exports);else{var e={};n(e),t.breakpointsEs=e}}(this,function(t){"use strict";function u(t,n){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!n||"object"!=typeof n&&"function"!=typeof n?t:n}function e(t,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function, not "+typeof n);t.prototype=Object.create(n&&n.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),n&&(Object.setPrototypeOf?Object.setPrototypeOf(t,n):t.__proto__=n)}function l(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function i(t,n){for(var e=0;e<n.length;e++){var i=n[e];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(t,n,e){return n&&i(t.prototype,n),e&&i(t,e),t}}(),o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},i={xs:{min:0,max:767},sm:{min:768,max:991},md:{min:992,max:1199},lg:{min:1200,max:1/0}},s=function(t,n){for(var e in t)if(("object"!==(void 0===t?"undefined":o(t))||t.hasOwnProperty(e))&&!1===n(e,t[e]))break},a=function(t){return"function"==typeof t||!1},r=function(t,n){for(var e in n)t[e]=n[e];return t},c=function(){function t(){l(this,t),this.length=0,this.list=[]}return n(t,[{key:"add",value:function(t,n){var e=2<arguments.length&&void 0!==arguments[2]&&arguments[2];this.list.push({fn:t,data:n,one:e}),this.length++}},{key:"remove",value:function(t){for(var n=0;n<this.list.length;n++)this.list[n].fn===t&&(this.list.splice(n,1),this.length--,n--)}},{key:"empty",value:function(){this.list=[],this.length=0}},{key:"call",value:function(t,n){var e=2<arguments.length&&void 0!==arguments[2]?arguments[2]:null;n||(n=this.length-1);var i=this.list[n];a(e)?e.call(this,t,i,n):a(i.fn)&&i.fn.call(t||window,i.data),i.one&&(delete this.list[n],this.length--)}},{key:"fire",value:function(t){var n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:null;for(var e in this.list)this.list.hasOwnProperty(e)&&this.call(t,e,n)}}]),t}(),f={current:null,callbacks:new c,trigger:function(e){var i=this.current;this.current=e,this.callbacks.fire(e,function(t,n){a(n.fn)&&n.fn.call({current:e,previous:i},n.data)})},one:function(t,n){return this.on(t,n,!0)},on:function(t,n){var e=2<arguments.length&&void 0!==arguments[2]&&arguments[2];void 0===n&&a(t)&&(n=t,t=void 0),a(n)&&this.callbacks.add(n,t,e)},off:function(t){void 0===t&&this.callbacks.empty()}},h=function(){function e(t,n){l(this,e),this.name=t,this.media=n,this.initialize()}return n(e,[{key:"initialize",value:function(){this.callbacks={enter:new c,leave:new c},this.mql=window.matchMedia&&window.matchMedia(this.media)||{matches:!1,media:this.media,addListener:function(){},removeListener:function(){}};var e=this;this.mqlListener=function(t){var n=t.matches?"enter":"leave";e.callbacks[n].fire(e)},this.mql.addListener(this.mqlListener)}},{key:"on",value:function(t,n,e){var i=3<arguments.length&&void 0!==arguments[3]&&arguments[3];if("object"!==(void 0===t?"undefined":o(t)))return void 0===e&&a(n)&&(e=n,n=void 0),a(e)&&void 0!==this.callbacks[t]&&(this.callbacks[t].add(e,n,i),"enter"===t&&this.isMatched()&&this.callbacks[t].call(this)),this;for(var r in t)t.hasOwnProperty(r)&&this.on(r,n,t[r],i);return this}},{key:"one",value:function(t,n,e){return this.on(t,n,e,!0)}},{key:"off",value:function(t,n){var e=void 0;if("object"!==(void 0===t?"undefined":o(t)))return void 0===t?(this.callbacks.enter.empty(),this.callbacks.leave.empty()):t in this.callbacks&&(n?this.callbacks[t].remove(n):this.callbacks[t].empty()),this;for(e in t)t.hasOwnProperty(e)&&this.off(e,t[e]);return this}},{key:"isMatched",value:function(){return this.mql.matches}},{key:"destroy",value:function(){this.off()}}]),e}(),d={min:function(t){return"(min-width: "+t+(1<arguments.length&&void 0!==arguments[1]?arguments[1]:"px")+")"},max:function(t){return"(max-width: "+t+(1<arguments.length&&void 0!==arguments[1]?arguments[1]:"px")+")"},between:function(t,n){var e=2<arguments.length&&void 0!==arguments[2]?arguments[2]:"px";return"(min-width: "+t+e+") and (max-width: "+n+e+")"},get:function(t,n){var e=2<arguments.length&&void 0!==arguments[2]?arguments[2]:"px";return 0===t?this.max(n,e):n===1/0?this.min(t,e):this.between(t,n,e)}},v=function(t){function a(t){var n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,e=2<arguments.length&&void 0!==arguments[2]?arguments[2]:1/0,i=3<arguments.length&&void 0!==arguments[3]?arguments[3]:"px";l(this,a);var r=d.get(n,e,i),o=u(this,(a.__proto__||Object.getPrototypeOf(a)).call(this,t,r));o.min=n,o.max=e,o.unit=i;var s=o;return o.changeListener=function(){s.isMatched()&&f.trigger(s)},o.isMatched()&&(f.current=o),o.mql.addListener(o.changeListener),o}return e(a,h),n(a,[{key:"destroy",value:function(){this.off(),this.mql.removeListener(this.changeListener)}}]),a}(),p=function(t){function n(t){l(this,n);var i=[],r=[];return s(t.split(" "),function(t,n){var e=b.get(n);e&&(i.push(e),r.push(e.media))}),u(this,(n.__proto__||Object.getPrototypeOf(n)).call(this,t,r.join(",")))}return e(n,h),n}(),m={},y={},g=window.Breakpoints=function(){for(var t=arguments.length,n=Array(t),e=0;e<t;e++)n[e]=arguments[e];g.define.apply(g,n)};g.defaults=i;var b=g=r(g,{version:"1.0.6",defined:!1,define:function(t){var n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{};for(var e in this.defined&&this.destroy(),t||(t=g.defaults),this.options=r(n,{unit:"px"}),t)t.hasOwnProperty(e)&&this.set(e,t[e].min,t[e].max,this.options.unit);this.defined=!0},destroy:function(){s(m,function(t,n){n.destroy()}),m={},f.current=null},is:function(t){var n=this.get(t);return n?n.isMatched():null},all:function(){var n=[];return s(m,function(t){n.push(t)}),n},set:function(t){var n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,e=2<arguments.length&&void 0!==arguments[2]?arguments[2]:1/0,i=3<arguments.length&&void 0!==arguments[3]?arguments[3]:"px",r=this.get(t);return r&&r.destroy(),m[t]=new v(t,n,e,i),m[t]},get:function(t){return m.hasOwnProperty(t)?m[t]:null},getUnion:function(t){return y.hasOwnProperty(t)||(y[t]=new p(t)),y[t]},getMin:function(t){var n=this.get(t);return n?n.min:null},getMax:function(t){var n=this.get(t);return n?n.max:null},current:function(){return f.current},getMedia:function(t){var n=this.get(t);return n?n.media:null},on:function(t,n,e,i){var r=4<arguments.length&&void 0!==arguments[4]&&arguments[4];if("change"===(t=t.trim()))return i=e,e=n,f.on(e,i,r);if(t.indexOf(" ") > -1){var o=this.getUnion(t);o&&o.on(n,e,i,r)}else{var s=this.get(t);s&&s.on(n,e,i,r)}return this},one:function(t,n,e,i){return this.on(t,n,e,i,!0)},off:function(t,n,e){if("change"===(t=t.trim()))return f.off(n);if(t.indexOf(" ") > -1){var i=this.getUnion(t);i&&i.off(n,e)}else{var r=this.get(t);r&&r.off(n,e)}return this}});t.default=b});
//# sourceMappingURL=breakpoints.min.js.map


/*  component-backtotop  */
XA.component.backToTopComponent = (function($) {
    var api=api || {};
  
    api.init = function() {  
        var backToTop= $('<a></a>').addClass('back-to-top').bind('click', function(event) { 
            event.preventDefault();
            $('html, body').animate({ scrollTop: 0 }, 400);           
        });

        $('body').append(backToTop);        
    };
  
    return api;
  })(jQuery, document);
  
  XA.register('backToTopComponent', XA.component.backToTopComponent);
  

/*  component-cookie  */
XA.component.componentCookie = (function ($) {
    var api = api || {};
    api.init = function () {









    };
    return api;
})(jQuery, document);
XA.register('componentCookie', XA.component.componentCookie);

/*  component-form-elements  */
XA.component.componentForm = (function ($) {
    var api = api || {};
    api.init = function () {

        $(".form").addClass('float-label');
        $(".form").find('.radio, .checkbox, .g-recaptcha, .wfmDatebox, input[type="file"], select, .datepicker').siblings('label').addClass('is-active');
        $(".form").find('.form-group').each(function () {
            if ($(this).children(':input').length > 2) {
                $(this).addClass('password-confirm');
            }
        })

        // $(".form").find('select').addClass('facet-dropdown-select');
        $(".form").find('form').attr('autocomplete', 'off');
        $('.single-line, textarea').on('focus', function () {
            var labelTxt = $('label[for="' + $(this).attr('id') + '"]');
            labelTxt.addClass("is-active");
        });
        $('.single-line, textarea').on('focusout', function () {
            if ($(this).val().length == 0 && !$(this).attr('placeholder').length) {
                var labelTxt = $('label[for="' + $(this).attr('id') + '"]');
                labelTxt.removeClass("is-active");
            }
        });

        //Disable Auto-complete in Forms
        $('form').attr('autocomplete', 'off');
        $('.form-group input.form-control, .form-group textarea.form-control').each(function () {
            $(this).attr('autocomplete', 'off');
        });

        $('.form').submit(function (e) {
            e.preventDefault();
            var self = this;
            XA.component.FormTracking.TrackSubmitEvent(self);
            $(document).find(this).find('.required-field .form-control').each(function () {
                var errorMessage = $(this).data('val-required');
                var reqVal = $(this).val();
                if (reqVal === '') {
                    $(this).siblings('.help-block').removeClass('field-validation-valid').addClass('field-validation-error').show().text(errorMessage);
                    $(this).addClass('input-validation-error');
                } else {
                    $(this).siblings('.help-block').removeClass('field-validation-error').addClass('field-validation-valid').hide().text(errorMessage);
                    $(this).removeClass('input-validation-error');
                }
                XA.component.FormTracking.TrackValidationError('validation-error-frontend');
            });
        });
    };
    return api;
})(jQuery, document);
XA.register('componentForm', XA.component.componentForm);

/*  component-iframe  */
XA.component.zwpIframe = (function($) {
  var api = {};

  api.init = function() {
    Breakpoints();
	
	$('.sxa-iframe').each(function(){
    
		if (!Breakpoints.is('lg')) {
			$(this).attr("src", $(this).attr("data-iframesrc-xs"));
		}
		else {
			var xlUrl = $(this).attr("data-iframesrc-lg");
			if(xlUrl == "")
			{
				xlUrl = $(this).attr("data-iframesrc-xs");
			}
			$(this).attr("src", xlUrl);
		}
	});
			
  };
  

  return api;
})(jQuery, document);

XA.register('zwpIframe', XA.component.zwpIframe);

/*  component-link  */
XA.component.linkComponent = (function($) {
    var api=api || {};
  
    api.init = function() {
      $('.component-link').not('.link--cta').find('.icon').parent('div').addClass('with-icon');
    };
  
    return api;
  })(jQuery, document);
  
  XA.register('linkComponent', XA.component.linkComponent);
  

/*  component-menu  */
/* global XA, Breakpoints, $ */
// TODO: need to verify that slick will be always available
// TODO: check 'this.find'
XA.component.menus = (function($) {
  var api = {
    /**
     * Lanuage selector for desktop & mobile
     * - Toggles is-open class for show/hide
     * - Switches label text between viewports ("English" for desktop, "EN" for mobile)
     * - Handles dropdown close on click-away
     */
    initLanguageSelector: function() {
      var $langSelector = $('.mod.mod-language-selector');
      var $langLabel = $langSelector.find('span.lang');
      var $langTrigger = $('.mod-language-selector__trigger');
      var labelDesktop = $langLabel.text();

      Breakpoints();

      if (Breakpoints.is('xs')) {
        $langLabel.text('');
      }

      if (Breakpoints.is('xs') || Breakpoints.is('sm')) {
        $('a.mobile-nav-hide').parent().closest('li').remove();
      }

      // Switch language label text on viewport change
      $(window).resize(function() {
        if (Breakpoints.is('xs')) {
          $langLabel.text('');
        } else {
          $langLabel.text(labelDesktop);
        }
      });

      $langTrigger.click(function(e) {
        e.preventDefault();

        if (Breakpoints.is('xs') || Breakpoints.is('sm')) {
          $langSelector.toggleClass('is-open');
        } 
      });

      // Handles close dropdown on click-away
      $('body').on('click',function(event) {
        var $target = $(event.target);
        var clickedTrigger = $target.hasClass('mod-language-selector__trigger') || $target.parents('.mod-language-selector__trigger').length;

        if (!clickedTrigger) {
          $langSelector.removeClass('is-open');
        }
      });

      // Remove border if no languages available
      if ($langSelector.children().length < 1) {
        $('.dropdown-language-selector').css('border', 'none');
      }

      // Are we in Edit mode?
      var isEditMode = $('body').hasClass('on-page-editor');
      
      // Sub-navigation mobile: Find active anchor tag with deep search for all subnavs
      $('.sub-navigation').each(function() {
        var $links = $(this).find('li.active');
        var labelText = $(this).data('headline') || 'Subnavigation'; // fallback label

        $links.each(function() {
          var $anchor = $(this).find('a');
          if ($anchor && $anchor.length === 1) {
            labelText = $anchor.text();

            if (isEditMode) {
              var finalSpan = $anchor.find('span').last();

              if (finalSpan.length) {
                labelText = finalSpan.text();
              }
            }
          }
        });

        // Ensure deepest active link is highlighted (if has subnavs)
        $links.last().addClass('active-subnav-item');

        // Prepend mobile dropdown label
        $(this)
          .children('.component-content')
          .prepend('<div class="sub-navigation-label hidden-sm-up">' + labelText + '</div>');
      })

      // Sub-navigation - open / close on mobile
      $(document.body).on('click', '.sub-navigation-label', function() {
        $(this).closest('.sub-navigation').toggleClass('is-open');
      });
    }
  };

  api.init = function() {
    $('.mod-menu__trigger .mod-gadgetbar__btn').click(function() {
      var $menu = $(this)
        .parents('.mod-menu')
        .find('.mod-menu__menu');
      var wasActive = $menu.hasClass('is-open');
      // Close all other open menus
      $('.mod-menu__menu.is-open').removeClass('is-open');
      // If it wasn't open, add class
      if (!wasActive) {
        $menu.toggleClass('is-open');
      }
    });

    $('.js-print').on('click', function(event) {
      event.preventDefault();
      $('.mod-menu__menu.is-open').removeClass('is-open');
      setTimeout(function() {
        window.print();
      }, 200);
    });

    $(document).click(function (e) {    
      var gadgetHide = $('.mod-menu');    
      if (!gadgetHide.is(e.target) && gadgetHide.has(e.target).length === 0) {
        $('.mod-menu__menu.is-open').removeClass('is-open');
      }
    });

    this.api.initLanguageSelector();
  };
  return api;
})(jQuery, document);

XA.register('zwpMenus', XA.component.menus);


/*  component-navigation  */
/* global XA, $ */
/*eslint no-console: ["error", { allow: ["log"] }] */

XA.component.navigationDesktop = (function($) {
  var CLASS_STICKY_HEADER = 'header-is-sticky';
  var CLASS_NAVDRAW_OPEN = 'navdrawer-is-open';
  var CLASS_IS_SCROLLABLE_UP = 'is-scrollable--up';
  var CLASS_IS_SCROLLABLE_DOWN = 'is-scrollable--down';
  var STICKY_BREAKPOINT = 3;

  var api = {
    /**
     * Define all event handlers
     */
    eventHandlers: function() {
      var self = this;

      // Stick / unstick header on scroll
      $(window).bind('scroll', this.toggleStickyHeader);

      // Show / hide navdraw onclick
      $('.ham-nav').click(this.toggleNavdraw);

      // Reset navgroup scroll icons on window resize
      $(window).on('resize', function() {
        if ($(this).width() >= 992) { 
          self.resetNavGroupScrollButtons();
        }
      });
    },

    /**
     * On initial pageload, check for scrollTop and activate sticky nav if necessary
     */
    checkScrollOnPageload: function() {
      if ($(window).scrollTop() >= STICKY_BREAKPOINT) {
        $('html').addClass(CLASS_STICKY_HEADER);
      }
    },

    /**
     * Check scroll position of navgroups, hide / show scroll buttons if necessary
     */
    resetNavGroupScrollButtons: function() {
      var self = this;
      $('.main-nav .navigation-group').each(function() {
        self.onNavgroupScroll($(this));
      })
    },

    /**
     * Open / close navdrawer
     */
    toggleNavdraw: function() {
      if ($('html').hasClass(CLASS_NAVDRAW_OPEN)) {
        $('html').removeClass(CLASS_NAVDRAW_OPEN);
      } else {
        $('html').addClass(CLASS_NAVDRAW_OPEN);
      }
    },

    /**
     * Toggle sticky header on scroll
     */
    toggleStickyHeader: function() {
      if ($(window).scrollTop() > STICKY_BREAKPOINT) {
        $('html').addClass(CLASS_STICKY_HEADER);
      } else {
        $('html').removeClass(CLASS_STICKY_HEADER);
      }
    },

    /**
     * Generates 4 navdrawer columns & append nav links
     */
    initNavDrawer: function() {
      var self = this;

      // Generate navgroup columns
      for (var i = 0; i < 4; i++) {
        $('.main-nav nav > ul').append(
          $('<span></span>')
            .addClass('navigation-group group' + i)
            .scroll(function(e) {
              var $navGroup = $(e.target);
              self.onNavgroupScroll($navGroup);
            })
        );
      }

      // Collect top-level links and split into 4 arrays
      var $level1Links = $('.main-nav nav > ul li.rel-level1');
      var $level1linksChunked = this.splitArray($level1Links, 4);
      
      // Append top-level links to each navgroup
      // Append scroll top / bottom buttons to each navgroup
      $('span.navigation-group').each(function(j) {
        $(this).append(
          $('<li></li>')
            .addClass('nav-group-scroll btn-scroll-t')
            .click(self.onNavgroupScrollClick)
        );
        $(this).append($level1linksChunked[j]);
        $(this).append(
          $('<li></li>')
            .addClass('nav-group-scroll btn-scroll-b')
            .click(self.onNavgroupScrollClick)
        );
      });

      // Close all submenus
      $('.main-nav .submenu')
        .addClass('closed')
        .click(this.toggleSubmenu);

      // Move home icon 
      this.moveFirstQuicklink();
      
      // Ensure scrollbars are visible if needed after initialization complete
      this.resetNavGroupScrollButtons();

      // Open active links on page load
      this.openActiveLinks();
    },

    /**
     * On pageload, open all active submenus
     */
    openActiveLinks: function() {
      $('.navdrawer li.submenu.active').each(function() {
        $(this).removeClass('closed').addClass('opened');
      });
    },

    /**
     * Move first quicklink item (home link) to main nav > ul 
     */
    moveFirstQuicklink: function() {
      var $firstLink = $('#header > .quicklinks .link-list li:first-child a');
      
      $('.main-nav nav > ul').prepend(
        $('<li></li>')
          .addClass('level1 item0 odd first rel-level1 home-link')
          .append(
            $('<div></div>').addClass('navigation-title').append(
              $('<a></a>')
                .attr('href', $firstLink.attr('href'))
                .text($firstLink.text())
                .addClass('icon icon--house')
            )
          )
      );
    },

    /**
     * Open / Close submenu on click
     * @param {Event} e 
     */
    toggleSubmenu: function(e) {
      e.stopPropagation();
      var $submenu = $(e.target);
      var $parentSubmenus = $submenu.parents('.submenu');

      if ($(window).width() > 992) {
        if ($submenu.hasClass('level1')) {
          $('.navdrawer .submenu.level1').not(this).removeClass('opened').addClass('closed');
        }
  
        if ($submenu.hasClass('level2')) {
          $('.navdrawer .submenu').not(this, $parentSubmenus).removeClass('opened').addClass('closed');
        }
      }

      // Open / close target submenu
      if ($submenu.hasClass('closed')) {
        $submenu.removeClass('closed').addClass('opened');
      } else {
        $submenu.removeClass('opened').addClass('closed');
        $submenu.find('.submenu').removeClass('opened').addClass('closed');
      }
    },

    /**
     * Hides / shows "up / down" arrows on Navgroup scroll event
     * @param {HTMLElement} $navGroup 
     */
    onNavgroupScroll: function($navGroup) {
      var navGroupscrollTop = $navGroup.scrollTop();
      var navGroupScrollHeight = $navGroup[0].scrollHeight;
      var navGroupInnerHeight = $navGroup.innerHeight();
      var $btnScrollT = $navGroup.find('.btn-scroll-t');
      var $btnScrollB = $navGroup.find('.btn-scroll-b');

      if (navGroupscrollTop > 10) {
        $btnScrollT.addClass(CLASS_IS_SCROLLABLE_UP);
      } else {
        $btnScrollT.removeClass(CLASS_IS_SCROLLABLE_UP);
      }

      if (navGroupscrollTop + (navGroupInnerHeight + 10) >= navGroupScrollHeight) {
        $btnScrollB.removeClass(CLASS_IS_SCROLLABLE_DOWN);
      } else {
        $btnScrollB.addClass(CLASS_IS_SCROLLABLE_DOWN);
      }
    },

    /**
     * Handles Navgroup scroll "up / down" arrows click
     * @param {Event} e 
     */
    onNavgroupScrollClick: function(e) {
      var $navGroupScroller = $(e.target);
      var $navGroup = $navGroupScroller.parent('.navigation-group');
      var breakpoint = '+=250px';

      if ($navGroupScroller.hasClass(CLASS_IS_SCROLLABLE_UP)) {
        breakpoint = '-=250px';
      } 

      $navGroup.animate({ scrollTop: breakpoint }, 300);
    },

    /**
     * Splits given array into x chunks
     * @param {Array} arr 
     * @param {Number} chunkCount 
     */
    splitArray: function(arr, chunkCount) {
      var chunks = [];
      
      while(arr.length) {
        var chunkSize = Math.ceil(arr.length / chunkCount--);
        var chunk = arr.slice(0, chunkSize);
        chunks.push(chunk);
        arr = arr.slice(chunkSize);
      }
      return chunks;
    },

    /**
     * On page load, move link metadata (file size & type) inside link title
     * TODO: Activate component-link.js and move there
     */
    moveLinkFileMetadata: function() {
      $('.link .link-metadata').each(function() {
        $(this).siblings('.link-title').append($(this));
      });
    },

    /**
     * Initialise Sitemap component
     */
    initSitemap: function() {
      var $sitemap = $('.mod-sitemap');

      if (!$sitemap.length) {
        return; // only run if Sitemap exists on pageload
      }

      // Generate navgroup columns
      for (var i = 0; i < 4; i++) {
        $('nav', $sitemap).append($('<div></div>').addClass('sitemap-group group' + i));
      }

      var $level1Links = $('nav > ul.mod-sitemap__level-1', $sitemap)
      var $level1linksChunked = this.splitArray($level1Links, 4);

      $('div.sitemap-group').each(function(j) {
        $(this).append($level1linksChunked[j]);
      });

      $sitemap.addClass('initialized');
    } ,

    /**
     * Prepend header spacer on pageload
     */
    appendNavSpacer: function() {
      $('header').prepend(
        $('<div></div>').addClass('js-header-spacer')
      );
    },

    /**
     * Initialise pagination on pageload if necessary
     */
    initPagination: function() {
      var $pagination = $('.list-pagination');

      if (!$pagination.length) {
        return;
      }

      $pagination.each(function() {
        var totalPages = $('.component-content', this).attr('data-totalpages');
        var firstLink = $('nav', this).children('a').first().attr('href');
        var lastLink = $('nav', this).children('a').last().attr('href');
        var $moreButtons = $('nav', this).children('.more');

        // Append "of" mobile separator
        // Todo: Translate "of" label?
        $('nav > .active', this).after(
          $('<span></span>').addClass('list-pagination__mobile-separator').text('of')
        );
        
        if (!$moreButtons.length) {
          return;
        }
        
        $moreButtons.each(function() {
          if ($(this).index() === 2) {
            // "more" button previous
            $(this).before(
              $('<a>').addClass('sxa-paginationnumber').attr('href', firstLink).text('1')
            )
          } else {
            // "more" button next
            $(this).after(
              $('<a>').addClass('sxa-paginationnumber').attr('href', lastLink).text(totalPages)
            )
          }
        });
      });
    }
  };



  api.init = function() {
    this.api.eventHandlers();
    this.api.checkScrollOnPageload();
    this.api.initNavDrawer();
    this.api.moveLinkFileMetadata();
    this.api.initSitemap();
    this.api.appendNavSpacer();
    this.api.initPagination();
  };

  return api;
})(jQuery, document);

XA.register('zwp-navigationdesktop', XA.component.navigationDesktop);


/*  component-notification-teaser  */
XA.component.notificationTeaser = (function ($) {
  var api = {
    /*
    IE Notification 
    */
    isIE: function() {
      // Check the userAgent property of the window.navigator object
      var ua = window.navigator.userAgent;
      // IE 10 or older
      var msie = ua.indexOf("MSIE ");
      // IE 11
      var trident = ua.indexOf("Trident/");
      return msie > 0 || trident > 0;
    },
    /*
    Hide/Show IE notification
    */
    initIENotificationEvents: function() {
      // Hide IE notification In other browsers
      $("#js-ie-warning").hide(); 

      if (this.isIE()) {
        $("#js-ie-warning").show();

        $(".c-disclaimer__close").click(function () {
          $("#js-ie-warning").hide();
        });

        $(".c-disclaimer__button").click(function () {
          $("#js-ie-warning").hide();
        });
      }
    }

  };

  api.init = function () {
    $(".notification-teaser_body")
      .children()
      .not(".icon")
      .wrapAll('<div class="notification-content"></div>');

    var $teaser = $(".notification-teaser");
    $teaser.addClass("show-notification");

    $teaser.find(".close").click(function () {
      $teaser.css("display", "none");
    });

    if ($("#ntAutoHideAfter60Seconds").val() == 1) {
      setTimeout(function () {
        $teaser.css("display", "none");
      }, 60000);
    }

    function readCookie(name) {
      var nameCookie = name + "=";
      var cookieArray = document.cookie.split(";");
      var len = cookieArray.length;
      for (var i = 0; i < len; i++) {
        var notificationCookie = cookieArray[i];

        while (notificationCookie.charAt(0) == " ") {
          notificationCookie = notificationCookie.substring(
            1,
            notificationCookie.length
          );
        }

        if (notificationCookie.indexOf(nameCookie) == 0) {
          return notificationCookie.substring(
            nameCookie.length,
            notificationCookie.length
          );
        }
      }
      return null;
    }

    if (readCookie("notificationTeaserClosed") == "Yes") {
      $teaser.css("display", "none");
    }
    if ($("#ntHiddenAfterFirstVisit").val() == 1) {
      if (readCookie("notificationTeaserClosed") == "Yes") {
        $teaser.css("display", "none");
      }
      document.cookie = "notificationTeaserClosed=Yes";
    }

    if ($("#ntDisplayMessageAtPageBottom").val() == 1) {
      $teaser.addClass("notificationBottom");
    }

    if ($("#ntHideInMobile").val() == 1) {
      $teaser.addClass("hidden-xs");
    }
    this.api.initIENotificationEvents();
  };
  return api;
})(jQuery, document);

XA.register("notificationTeaser", XA.component.notificationTeaser);


/*  component-pdf-download  */
XA.component.pdfDownloadComponent = (function($) {

	var api = api || {
		initPdfDownloadSlider: function() {
			var self = this;

			function initPdfDownloadSliderSettings($pdfslide, noOfSliders) {
				$pdfslide.slick({
					slidesToShow: noOfSliders,
					slidesToScroll: noOfSliders,
					infinite: false,
					responsive: [{
						breakpoint: 767,
						settings: {
							slidesToShow: 1,
							slidesToScroll: 1,
							dots: true,
							arrows: false,
							centerMode: true
						}
					}]
				});
			}

			$('.pdf-download ul').each(function() {
				count = $(this).children('li');
				if (count.length == 1) {
					$(this).parents('.pdf-download').addClass('single');
					var $pdfslide = $('.pdf-download.single > .component-content > ul').last();
					initPdfDownloadSliderSettings($pdfslide, 1);
				} else if (count.length == 2) {
					$(this).parents('.pdf-download').addClass('two');
					var $pdfslide = $('.pdf-download.two > .component-content > ul').last();
					initPdfDownloadSliderSettings($pdfslide, 2);

				} else if (count.length == 3) {
					$(this).parents('.pdf-download').addClass('three');
					var $pdfslide = $('.pdf-download.three > .component-content > ul').last();
					initPdfDownloadSliderSettings($pdfslide, 3);
				} else if (count.length > 3) {
					$(this).parents('.pdf-download').addClass('multiple');
					var $pdfslide = $('.pdf-download.multiple > .component-content > ul').last();
					initPdfDownloadSliderSettings($pdfslide, 3);
				}
			});
		}

	};

	api.init = function() {
		this.api.initPdfDownloadSlider();
	};

	return api;
})(jQuery, document);

XA.register('pdfDownloadComponent', XA.component.pdfDownloadComponent);

/*  component-resultcount  */
XA.component.resultCount = (function($) {
    var api=api || {};
  
    api.init = function() {
      XA.component.search.vent.on("results-loaded", function () {
        $('.results-count').html(function(index, value) {
          return value.replace(/(\d+)/g, '<span>$1</span>');
        });
      })
    };
  
    return api;
  })(jQuery, document);
  
  XA.register('resultCount', XA.component.resultCount);
  

/*  component-richtext  */
XA.component.zwpComponentRichText = (function ($) {
    var api = api || {};

    //Checking for RTE under accordions to load more info button before api.init
    var richTextUnderAccordion=function(){
        let $showMoreDiv =$('.component.accordion .rich-text.show--more');
        addMoreInfo($showMoreDiv)
    }();

    api.init = function () {

        var $showMoreDiv = $('.rich-text.show--more');       
        var $maxHeight = '300px';
        addMoreInfo($showMoreDiv);
        
        $(".more--text").on('click', function (event) {  
            event.preventDefault();
            event.stopImmediatePropagation();
            if ($(this).parent().prev().hasClass("active")) {                
                $(this).removeClass("active");
                $(this).parent().prev().removeClass("active").css({
                    'height': $maxHeight                   
                });               
            } else {
                $(this).addClass("active");
                $(this).parent().prev().addClass("active").css({
                    'height': '100%'
                });
            }
        });

        /* Adding equalized Height  */
        var richTexts = $('.rich-text');
        $.each(richTexts, function () {
            var parentDiv = $(this).parent().parent();
            if ($(parentDiv).hasClass('column-splitter')) {
                $(this).addClass('rte-styles');
            }
        });
        function eqalHeight(parentColumns) {
            $.each(parentColumns, function () {
                if (!$(this).hasClass('show--more') && $(this).hasClass('bg-height')) {
                    $(this).parent().css('flex-direction', 'column');
                    $(this).parent().addClass('d-flex d-md-flex d-lg-flex'); 
                }
            });
        }
        var columnSplitter = $('.column-splitter').find('.rte-styles');
        $.each(columnSplitter, function () {
            eqalHeight(columnSplitter);
        });
    };
    function addMoreInfo($showMoreDiv)
        {
            var $defaultHeight = 300;
            var $maxHeight = '300px';

            $.each($showMoreDiv, function () {           
            $richTextContent = $(this).find('.component-content');
            if ($richTextContent.height() > $defaultHeight) {
                /* added button dynamically as we are not rendering button from varient */
                /* In Experience Editor view script is hitting two times, hence added condition to not show button twice */
                if ($(this).find('.more--text').length == 0) {
                    $('<div style="text-align:center"><button class="more--text"><span></span></button></div>').insertAfter($richTextContent);
                }
                $richTextContent.css('height', $maxHeight);              
            }
            else {
                /* height is removed when rich text hight is less than 300px*/
                /* If More button exists then showing show--more button this condition added for EE view */
                if ($(this).find('.more--text').length == 0) {
                    $richTextContent.parent().removeClass("show--more");
                }
            }
        })
        }
	var breakers = $('.breaker');
    var breakerHeight;
        $.each(breakers, function () {
            var isRichText = $(this).nextAll('.component:first').hasClass('rich-text'); 
            if (!isRichText){
                jQuery(this).removeClass('breaker-left breaker-right');
                return;
            }
            else{
                $(this).nextAll('.component:first').find('span.scWebEditInput').css('display', 'inline');
            }        
            if (isRichText && ($(this).height() > $(this).nextAll('.component:first').height())) {
                breakerHeight = $(this).height() + 10;
                $(this).nextAll('.component:first').css({'height': breakerHeight, 'margin-bottom': '30px'});
                $(this).css({'padding-bottom':'5px'});
            }           
        })

    return api;
})(jQuery, document);

XA.register('zwpComponentRichText', XA.component.zwpComponentRichText);

/*  component-routing-tool  */
XA.component.componentRoutingTool = (function ($) {
  var api = api || {};
  api.init = function () { 

      $('.routing-tool select')
      .css('width', '100%')
      .select2({
        minimumResultsForSearch: Infinity, 
        placeholder: '',
        dropdownParent: $('#wrapper')
      });

      function load_json_data(utype, $form) {
          var optionsList;
          var jsonPath = $form.find('.login-url').attr('data-jsonurl');
          var $level1Dropdown = $form.find('.level1_dropdown');
          var $level2Dropdown = $form.find('.level2_dropdown');

          $.getJSON(jsonPath, function (data) {  
              optionsList += '<option></option>';
              if (utype == 'level1_dropdown') {
                  $.each(data, function (key, value) { 
                      optionsList += '<option value="' + key + '">' + value.name + '</option>';
                  });
              } else if (utype === 'level2_dropdown') {
                  var level2List = data[$level1Dropdown.val()]['list'];
                  $.each(level2List, function (key, value) {
                      optionsList += '<option value="' + key + '">' + value.name + '</option>';
                  });
              } else if (utype === 'level3_dropdown') {
                  var level3List = data[$level1Dropdown.val()]['list'][$level2Dropdown.val()]['list']; 
                  $.each(level3List, function (key, value) { 
                      optionsList += '<option value="' + value.url + '">' + value.name + '</option>';
                  });
              }
              $form.find('.' + utype).html(optionsList);
          });            
      } 
      $(document).ready(function () { 
        var $forms = $('.routing-tool form.mod-form');

        $forms.each(function(i) {
          load_json_data('level1_dropdown', $(this)); 
        });

        $('.level2_dropdown, .level3_dropdown').prop('disabled', true);
      });      
      $(document).on('change', '.level1_dropdown', function (e) {
        var $form = $(this).closest('form');
        var $level3Type = $form.find('.level3_dropdown');
        var $level2Dropdown = $form.find('.level2_dropdown');

        
        $level3Type.removeClass('is-not-empty').html('');
        load_json_data('level2_dropdown', $form);
        $level2Dropdown.prop('disabled', false);
        $level3Type.prop('disabled', true);
        if ($(this).val() !== '') {
          $(this).addClass('is-not-empty');
        }
      });

      $(document).on('change', '.level2_dropdown', function (e) {
        var $form = $(this).closest('form');
        var $level3Type = $form.find('.level3_dropdown');

        $level3Type.removeClass('is-not-empty').html('');
        load_json_data('level3_dropdown', $form);
        $level3Type.prop('disabled', false);
        if ($(this).val() !== '') {
          $(this).addClass('is-not-empty');
        }
      });
      $(document).on('change', '.level3_dropdown', function (e) {
        var $form = $(this).closest('form');
        $form.find('.login-url').attr('href', e.target.value);
        if ($(this).val() !== '') {
          $(this).addClass('is-not-empty');
        }
      });
  };
  return api;
})(jQuery, document);
XA.register('componentRoutingTool', XA.component.componentRoutingTool);

/*  component-select  */
XA.component.formSelect = (function($) {
  var api = {
    /**
     * Initialise header search box
     * - moves search button inside typehead wrapper
     * - toggles active search input on click
     */
    initHeaderSearchbox: function() {
      var $searchButton = $('header .search-box-button, header .search-box-button-with-redirect');
      var $header = $('#header');

      // Toggle active search input on click
      $('header .search-box label').click(function() {
        var $searchBox = $(this).closest('.search-box');
        if ($searchBox.hasClass('is-active')) {
          $searchBox.removeClass('is-active');
          $searchBox.find('.search-box-input').val('');
          $header.removeClass('search-is-open');
        } else {
          $searchBox.addClass('is-active');
          $searchBox.find('.tt-input').focus();
          $header.addClass('search-is-open');
        }
      }); 
      
      // Move search button on page load
      if ($searchButton.length) {
        $searchButton.each(function() {
          $(this).siblings('.twitter-typeahead').append($(this));
        });
      }
    },

    /**
     * Generate Select2 labels for facet-dropdowns 
     * - Assigns unique IDs and labels to each dropdown select (fixes issue with Select2)
     * - prevent re-execution in edit-mode 
     */
    setDropdownLabels: function() {
      var $select = $('.facet-dropdown-select');

      $select.each(function(i) {
        if ($(this).hasClass('facet-dropdown-initialized')) {
          return; // Make sure to not run twice
        }
        
        // Assign ID
        var idx = i + 1;
        $(this).attr('id', $(this).attr('id') + idx);
        
        // Assign label
        var $title = $(this).parents('.facet-dropdown').find('.facet-title');

        if ($title.length) {
          var labelText = $title.text().trim();
          var $label = $('<label>' + labelText + '</label>')
            .addClass('textfield__label')
            .attr('for', 'select2');

          $label.insertAfter($(this));
        }

        $(this).addClass('facet-dropdown-initialized');
      });
    },

    setDropdowns: function() {
      api.setDropdownLabels();

      $('.facet-dropdown-select')
        .css('width', '100%')
        .select2({
          minimumResultsForSearch: Infinity,
          dropdownParent: $('#wrapper')
        });
    }
  };

  api.init = function() {
    
    api.setDropdowns();

    // Handles input focus on search box
    $('.textfield--float-label input').on('focus', function(e) {
      e.preventDefault();
      $(this).closest('.textfield--float-label').find('label').addClass('is-active');
    })

    $('.textfield--float-label input').on('focusout', function(e) {
      e.preventDefault();
      if ($(this).val() === '') {
        $(this).closest('.textfield--float-label').find('label').removeClass('is-active');
      }
    });

    api.initHeaderSearchbox();
  };

  return api;
})(jQuery, document);

XA.register('formSelect', XA.component.formSelect);


/*  component-sitecore-forms  */
XA.component.componentSitecoreForm = (function ($) {
  var api = {
    $scFormComponents: $('.sitecore-form'),
    placeholderFieldTypes:
      'input[type="text"], input[type="password"], input[type="email"], input[type="tel"], input[type="number"], textarea',
    fileUploadFields: 'input[type="file"]',
  };

  /**
   * Executed on pageload by SXA
   */
  api.init = function () {
    initSitecoreForms();
  };

  /**
   * Process all SC form instances on pageload
   */
  initSitecoreForms = function () {
    api.$scFormComponents.each(function () {
      var $form = $(this);

      // Initialize form (single & multipage)
      initSitecoreForm($form);

      // MultiPage form change
      // - detect form page change (new form is appended via Ajax response on change-page)
      $form.on('DOMNodeInserted', function (e) {

        // We detect the change on the main form wrapper element only
        if ($(e.target).attr('data-track-levelcontent')) {

          // reinitialize form elements (labels, dropdowns, datepickers etc)
          initSitecoreForm($form);
        }
      });
    });
  };


  /**
   * Init form inputs by type
   */
  initSitecoreForm = function ($form) {
    setFloatingLabelFields($form);
    setFileUploadFields($form);
    setSelectFields($form);
    setReachingNewformStepForMultiStep($form);
  };

 setReachingNewformStepForMultiStep = function ($form) {
  var isMultiStepForm = $form.find('.formpagestep');
  var hasStepInitiated = isMultiStepForm.hasClass('stepinitiated');
  if (isMultiStepForm.length > 0 && hasStepInitiated == false) {
   isMultiStepForm.addClass('stepinitiated');
   XA.component.SCFormTracking.TrackReachingNewFormStep($form);
  }
  listboxMultipleSelectionIcon($form);
 };

 /**
  * Set Icon for multiSelection Listbox
  */
 listboxMultipleSelectionIcon = function ($form) {
  var multiSelect = document.querySelector('.listbox .ss-multi-selected');
  if (multiSelect != null) {
   var createElement = document.createElement('span');
   createElement.classList.add('ss-arrow');
   var createIcon = document.createElement('span');
   createIcon.classList.add('arrow-down');
   createElement.appendChild(createIcon);
   multiSelect.appendChild(createElement);
   multiSelect.parentElement.previousSibling.slim.afterOpen = function (e) {
    if (this.config.isMultiple && this.slim.multiSelected) {
     this.slim.multiSelected.container.querySelector('.' + this.config.arrow).children[0].classList.remove('arrow-down');
     this.slim.multiSelected.container.querySelector('.' + this.config.arrow).children[0].classList.add('arrow-up');
    }
   }
   multiSelect.parentElement.previousSibling.slim.afterClose = function (e) {
    if (this.config.isMultiple && this.slim.multiSelected) {
     this.slim.multiSelected.container.querySelector('.' + this.config.arrow).children[0].classList.remove('arrow-up');
     this.slim.multiSelected.container.querySelector('.' + this.config.arrow).children[0].classList.add('arrow-down');
    }
   }
  }
 };

  /**
   * Set floating label animation events 
   * Init datepicker inputs if found
   */
  setFloatingLabelFields = function ($form) {
    var $inputs = $form.find(api.placeholderFieldTypes);

    $inputs.each(function () {
      var placeholder = $(this).attr('placeholder');

      if ((placeholder && placeholder.length) || $(this).val().length > 0) {
        activateLabel($form, $(this), true);
      }

      if ($(this).parent().hasClass('date-picker')) {
        initDatePicker(this);
      }

      $(this)
        .on('focus', function () {
          activateLabel($form, $(this), true);
        })
        .on('focusout', function () {
          var placeholder = $(this).attr('placeholder');

          if ($(this).val().length == 0 && !placeholder) {
            activateLabel($form, $(this), false);
          }
        });
    });
  };

  /**
   * Set file upload CTA button, events & labels
   */
  setFileUploadFields = function ($form) {
    var $inputs = $form.find('input[type="file"]');

    $inputs.each(function () {
      var $label = $(this).siblings('label');
      var selectFileTxt = $label.attr('data-select-file'); // "Select file"
      var noFileSelectedTxt = $label.attr('data-no-file-selected'); // "No file selected"

      // Prepend CTA button and labels in place of default file-upload CTA
      if (!$(this).prevAll().hasClass('btn')) {
        var $btn = $('<a></a>')
          .addClass('btn')
          .text(selectFileTxt)
          .click(function () {
            $(this).parent().find('input').trigger('click');
          });

        // Prepend selection labels
        var $selectionLabel = $('<span></span>')
          .addClass('filename-label')
          .text(noFileSelectedTxt);

        $(this).parent().prepend($btn, $selectionLabel);
      }

      if ($(this).is('[multiple]') && $(this).parent().hasClass('file-upload-multiple')) {
        initMultiFileUpload($(this));
      } else {
        $(this).on('change', function (e) {
          handleFileSelectEvent(e, $(this))
        });
      }
    });
  };

  initMultiFileUpload = function ($input) {
    var storedFiles = [];

    $input.on("change", function (e) {
      if (e.target.files.length == 0) {
        return false;
      }
      if (!e.originalEvent.silent) {
        addFiles(e.target.files, $(this));
      }
      e.originalEvent.silent = true;
    });

    $input.parent().on("click", ".remove-file", function (e) {
      removeFile(e);
    });

    function addFiles(files, $input) {
      Array.prototype.slice.call(files).forEach(function (f) {
        storedFiles.push(f);
      });

      updateFileLabels($input);
      updateInputFiles($input);
    }

    function removeFile(e) {
      var file = $(e.target).data("file");
      var $input = $(e.target).closest('.filename-label').siblings('input[type="file"][multiple]');

      for (var i = 0; i < storedFiles.length; i++) {
        if (storedFiles[i].name === file) {
          storedFiles.splice(i, 1);
          break;
        }
      }

      updateFileLabels($input);
      updateInputFiles($input);
    }

    function updateFileLabels($input) {
      var filenameLabel = $input.parent().find('.filename-label');
      filenameLabel.empty();

      if (storedFiles.length === 0) {
        filenameLabel.text($input.siblings('label').attr('data-no-file-selected'));
      } else {
        storedFiles.forEach(function (f) {
          var html = "<div>" + f.name + "<span data-file='" + f.name + "' class='remove-file'></span></div>";
          filenameLabel.append(html);
        });
      }

    }

    function updateInputFiles($input) {
      var emptyFileList = new DataTransfer();
      for (var i = 0; i < storedFiles.length; i++) {
        emptyFileList.items.add(storedFiles[i]);
      }
      var newFileList = emptyFileList.files;
      $input.get(0).files = newFileList;


      var evt = document.createEvent("HTMLEvents");
      evt.initEvent("change", false, true);
      evt.silent = true;
      $input.get(0).dispatchEvent(evt);
    }

  };


  /**
   * On file selection, update input labels
   * Handles remove file
   */
  handleFileSelectEvent = function (e, $input) {
    var noFileSelectedTxt = $input.siblings('label').attr('data-no-file-selected');

    if (e.target.files.length > 0) {
      $input
        .parent()
        .find('.filename-label')
        .text(e.target.files[0].name)
        .addClass('has-file')
        .append(
          $('<span></span>')
            .addClass('filename-label-cancel')
            .click(function () {
              $(this)
                .parent()
                .text(noFileSelectedTxt)
                .removeClass('has-file');
              $(this).remove();
              $input.val(null);
            })
        );
    } else {
      $input
        .parent()
        .find('.filename-label')
        .text(noFileSelectedTxt)
        .removeClass('has-file');
    }
  };

  /**
   * Set active/inactive label for given input ID
   */
  activateLabel = function ($form, $element, activate) {
    var $label = $('label[for="' + $element.attr('id') + '"]', $form);

    if (activate) {
      $label.addClass('is-active');
    } else {
      $label.removeClass('is-active');
    }
  };

  /**
   * Init Datepicker & apply following rules if specified:
   * See: https://mymth.github.io/vanillajs-datepicker/
   * 
   * - data-val-timespan-min="1" => Will allow only past dates
   * - data-val-timespan-max="1" => Will allow only future dates
   * - data-val-timespan-min="18" => Minimum date should be based on data-val-timespan-min value} $input
   */
  initDatePicker = function (input) {
    var $input = $(input);
    var minDate = $input.attr('min');
    var maxDate = $input.attr('max');

    // Disable manual input on datepicker 
    // NOTE: setting "disabled" attribute breaks the datepicker, so this is a working alternative
	//Note : Manual input is disabled for Future Date validator and Past Date Validator otherwise enabled
    $input.on('change keyup input',function() { 
	 var isFutureDateField = $input.data('val-timespan-max');
	 var isPastDateField = $input.data('val-tspastdate-min');
	 if((isFutureDateField != undefined && isFutureDateField == 1) || (isPastDateField != undefined && isPastDateField == 1))
	 {
		$(this).val('');
   }});
	
	
	
	
    // This pastDatesOnly condition needs to be removed once we fix the validation issue
    var pastDatesOnly = $input.data('val-timespan-min') != undefined ? $input.data('val-timespan-min') : $input.data('val-tspastdate');
    var futureDatesOnly = $input.data('val-timespan-max');
    var notAllowTodayDateInDatePicker = $input.data('notallow-todaydate');

    var datepickerConfig = {
      format: $input.attr('data-date-format'),
      todayHighlight: true,
      autohide: true,
      orientation: 'bottom left',
      disableTouchKeyboard: true,
        language: $('html').attr('lang'),
    }

    if ((minDate && minDate.length) || futureDatesOnly) {
      var startDate =
        minDate && minDate.length ? new Date(minDate) : notAllowTodayDateInDatePicker === 'True' ? new Date(Date.now() + (3600 * 1000 * 24)) : new Date();
      datepickerConfig['minDate'] = startDate;
    }

    if ((maxDate && maxDate.length) || pastDatesOnly) {
      var endDate = maxDate && maxDate.length ? new Date(maxDate) : notAllowTodayDateInDatePicker === 'True' ? new Date(Date.now() - (24 * 60 * 60 * 1000)) : new Date();
      datepickerConfig['maxDate'] = endDate;
    }

    // 18-year age limit
    if (pastDatesOnly > 1) {
      var dateMinusYears = new Date();
      dateMinusYears.setFullYear(dateMinusYears.getFullYear() - pastDatesOnly);
      datepickerConfig['maxDate'] = dateMinusYears;
    }

    var datepicker = new Datepicker(input, datepickerConfig);
  };

  /**
   * Process select inputs with Select2 
   * Handles error message on change
   */
  setSelectFields = function ($form) {
    var $selects = $form.find('select');

    $selects.each(function() {
      var $label = $(this).siblings('label');
      $label.addClass('is-active');

      this.slimSelect = new SlimSelect({
        select: this,
        showSearch: false,
        onChange: function(info) {
          if (info.value) {
            $label.addClass('is-active');
          }
        }
      });
    })

    // $selects.each(function () {
    //   $(this).siblings('label').addClass('is-active');

    //   // Initialize select2 on select element
    //   $(this)
    //     .css('width', '100%')
    //     .select2({ minimumResultsForSearch: Infinity });

    //   // Remove error-message updates on change if necessary
    //   $(this).on('change', function () {
    //     var removeError = false;
    //     var $wrapper = $(this).parent('.sc-form-group');
    //     var $multiSelect = $wrapper.find('.select2-container .select2-selection--multiple');

    //     if ($multiSelect.length) {
    //       // check if multiselect dropdown has selected values
    //       var selectedCount = $('ul > li', $multiSelect).length;

    //       if (selectedCount > 0) {
    //         removeError = true;
    //       }
    //     } else {
    //       // check if single-select dropdown has selected value
    //       if ($('.select2-container .select2-selection__rendered', $wrapper).attr('title').length) {
    //         removeError = true;
    //       }
    //     }

    //     // Remove error message & class if valid
    //     if (removeError) {
    //       $wrapper
    //         .removeClass('has-error')
    //         .find('.field-validation-valid, .field-validation-error')
    //         .empty();
    //     }
    //   });
    // });
  }

  return api;
})(jQuery, document);
XA.register('componentSitecoreForm', XA.component.componentSitecoreForm);


/*  component-socialmedia-share  */
XA.component.socialMediaShare = (function($) {
  var api = {
    initInstance: function() {
      this.$button = $('<div/>').addClass('mod-share-bar__button-expand');
      var $icon = $('<span />').addClass('icon icon--expand');
      $icon.appendTo(this.$button);
      this.$component_inner.append(this.$button);
      this.$button.on('click', api.toggleButton.bind(this));
      $(window).resize(this.onWindowResize.bind(this));
      // Manual trigger to show/hide button on page load
      this.onWindowResize();
    },

    toggleButton: function(event) {
      event.preventDefault();
      this.$component.toggleClass('is-expanded');
    },

    getBarWidth: function() {
      // Initial width + padding
      var barWidth =
        parseInt(this.$component.css('paddingLeft')) +
        parseInt(this.$component.css('paddingRight'));
      this.$component.find('.mod-share-bar__bar-item').each(function() {
        barWidth += $(this).width();
      });

      return barWidth;
    },

    expander: function(show) {
      if (show == true) {
        this.$component_inner.addClass('has-opener');
        this.$button.show();
      } else {
        this.$component_inner.removeClass('has-opener');
        this.$button.hide();
      }
    },

    onWindowResize: function() {
      var barWidth = this.getBarWidth(),
        ulWidth = this.$component_inner.width();

      if (ulWidth < barWidth) this.expander(true);
      else this.expander(false);
    }
  };

  api.init = function() {
    this.api.$component = $('.mod-share-bar');
    this.api.$component_inner = $('.mod-share-bar__inner', this.api.$component);
    this.api.initInstance();
  };
  return api;
})(jQuery, document);

XA.register('socialMediaShare', XA.component.socialMediaShare);


/*  component-stage-slider  */
/* global XA, Galleria, $ */
/* global XA, Breakpoints, $ */
/*eslint no-console: ["error", { allow: ["log"] }] */

// Inject values in the gallery slider component's properties
var prepareStageSlider = (function ($) {
    var api = {};
    api.process = function () {
        $('.component.gallery:not(.properties-added)').each(function () {
            var props = $(this).data('properties');
            // These two flags will force the caption to always be visible
            props.showInfo = true;
            props._toggleInfo = false;
            props.wait = true;
            props.autoplay = 4000;
            $(this)
                .data('properties', props) // Inject properties
                .addClass('properties-added'); // Add class to not process this gallery again

            var $downloadButton = $('<a />')
                .addClass('download-button')
                .attr('href', '#');
            var $downloadIcon = $('<span />').addClass('icon icon--download');

            $downloadIcon.appendTo($downloadButton);

            $(this).append($downloadButton);
        });        
    };
    return api;
})(jQuery);


// DOM manipulation needs to happen before the
// XA API initializes the component
XA.registerOnPreInitHandler(prepareStageSlider);

(function ($) {
    // Initialise Breakpoints library
    Breakpoints();

    // Disable image link if not set
    $('.component.image a').click(function (e) {
        if (!$(this).attr('href')) {
            e.preventDefault();
        }
    });

    // Toggle size-xs / size-xl image src on resize
    function checkSliderImage() {
        var $imgs = $('.slide img');

        $.each($imgs, function () {
            var src = $(this).data('size-' + (Breakpoints.is('xs') ? 'xs' : 'xl'));
            $(this).attr('src', src);
			var alt = $(this).data('alt-' + (Breakpoints.is('xs') ? 'xs' : 'xl'));
            $(this).attr('alt', alt);
        });

        var $imghashs = $('img[data-imagehash]');
        var $currentBreakPoint = Breakpoints.current().name;

        //When site open in XL devices default image to load
        if ($currentBreakPoint == 'lg') {
            if ($(window).width() > 1899) {
                $currentBreakPoint = 'xl';
            }
        }

        $.each($imghashs, function () {
            var src = $(this).data('size-' + $currentBreakPoint);
            if (src == undefined) {
                var src = $(this).data('size-lg');
            }

            $(this).attr('src', src);
        });

        //All srcset images are SXA rendervariantfield images
        var $srcSetImages = $('img[srcset]');

        if ($srcSetImages.length > 0) {
            $.each($srcSetImages, function () {
                var $srcSet = $(this).attr('srcset');
                var $srcsetUrls = $srcSet.split(',');

                switch ($currentBreakPoint) {
                    case 'xs':
                        $(this).attr('src', $srcsetUrls[0].split(' ')[0]);
                        break;
                    case 'sm':
                        $(this).attr('src', $srcsetUrls[1].split(' ')[0]);
                        break;
                    case 'md':
                        $(this).attr('src', $srcsetUrls[2].split(' ')[0]);
                        break;
                    case 'lg':
                        $(this).attr('src', $srcsetUrls[3].split(' ')[0]);
                        break;
                }
            });
        }
    }

    // Get gallery container height based on current breakpoint
    function getContainerHeight() {
        switch (true) {
            case (Breakpoints.is('xs') || Breakpoints.is('sm')):
                return 65;
            case Breakpoints.is('md'):
                return 90;
            default:
                return 100; // > md
        }
    }

    // Call on initial load
    checkSliderImage();

    // Call on viewport size change
    $(window).resize(checkSliderImage);

    // Galleria plugin event handlers
    Galleria.on('image', function (e) {
        var ID = '#' + this._target.id;
        var $containerWrapper = $(ID);
        var $container = $(ID + ' > .galleria-container'); 
        
        var $downloadLink = $containerWrapper
            .parent()
            .parent()
            .find('a.download-button');

        if ($downloadLink.length > 0) {
            $downloadLink
                .attr('href', e.imageTarget.src)
                .attr('download', e.imageTarget.src);
        }

        var containerOffset = 70;
        var containerWrapperOffset = getContainerHeight();
        var VERTICAL_MARGIN = 60;
        var LEFT_MARGIN = 10;

        $container.height(e.imageTarget.height + containerOffset);
        $containerWrapper.height(e.imageTarget.height + containerWrapperOffset);

        // Reposition caption
        $(ID + ' .galleria-info').css({            
            bottom: VERTICAL_MARGIN,
            left: LEFT_MARGIN,
            top: 'initial',
            width: e.imageTarget.width
        });
    });

    Galleria.ready(function () {
        var gallery = this;
        $(window).resize(function () {
            gallery.next();
        });
        $('.component.gallery.properties-added').each(function () {
            $('.galleria-container').prepend($('.galleria-image-nav'));
        });
        $(window).on('resize',function(){location.reload();});
    });  
})(jQuery);


XA.component.carouselBackground = (function ($) {
    var api = api || {};
    api.init = function () {
        if ($('.component.carousel').length) {
            var checkExistCarouselImg = setInterval(function () {
                $('.component.carousel').each(function () {
                    if ($('.slides img', this).innerHeight()) {
                        var height = $('.slides', this).innerHeight() + 5;
                        $(this).css('background-size', '100% ' + height + 'px');
                        clearInterval(checkExistCarouselImg);
                    }
                });
            }, 100)
        }
    };
    return api;
})(jQuery, document);
XA.register('carouselBackground', XA.component.carouselBackground);

/*  component-sticky-tabs  */
XA.component.componentStickyTabs = (function($) {

  var api = {
    initStickTabs: function initStickTabs() {
      var $stickyTabs = $('.sticky-tabs');

      // No sticky tabs found on page, exit function
      if (!$stickyTabs.length) {
        return;
      }

      var $tabInner = $stickyTabs.find('.tabs-inner.tabs-inner--desktop');
      var $tabHeading = $tabInner.find('.tabs-heading');
      var $tabsContainer = $tabInner.find('.tabs-container');

      // Disable sticky functionality when in editor
      if ($('body').hasClass('on-page-editor')) {
        $tabInner.addClass('unstick');
        return;
      }

      // Reset tabs headers to active (overrides Sitecore)
      $tabHeading.children('li').each(function() {
        $(this).removeClass('active');
      });

      // Close sticky tab on click away
      $(document).mouseup(function(e) {
        if (!$stickyTabs.is(e.target) && $stickyTabs.has(e.target).length === 0) {
          hideTabs();
        }
      });

      // Stick / unstick tabs on scroll - toggles tab 'active' state accordingly
      $(window).on('resize scroll', function() {
        var elementTop = $stickyTabs.offset().top;
        var elementBottom = elementTop + $stickyTabs.outerHeight();
        var viewportTop = $(window).scrollTop();
        var viewportBottom = viewportTop + $(window).height();

        // Checks to avoid excessive dom manipulation onScroll.
        if (elementBottom > viewportTop && elementTop < viewportBottom) {
          var openTabIdx = findActiveTabIndex();
          if (!$tabInner.hasClass('unstick')) {            
            $tabHeading.find('li').eq(openTabIdx).addClass('active');
            $tabInner.addClass('unstick').height($tabsContainer.outerHeight() + $tabHeading.outerHeight());
          }
        } else {
          if ($tabInner.hasClass('unstick')) {
            $tabInner.removeClass('unstick');
            $tabHeading.find('li').eq(openTabIdx).removeClass('active');
          }
        }
      });

      // When sticky, handle tab-wrapper slide up / down
      $tabHeading.find('li').click(function() {
        $tabInner.removeAttr('style');
        $tabInner.removeClass('is-open');
        if ($tabInner.hasClass('unstick')) {
          return;
        }

        if (!$(this).hasClass('sticky-tab-active')) {
          $(this).addClass('sticky-tab-active').siblings().removeClass('sticky-tab-active');
        } else {
          $(this).removeClass('sticky-tab-active');
          hideTabs();
          return;
        }

        if (!$tabInner.hasClass('is-open')) {
          $tabInner.addClass('is-open');
          if ($tabInner.hasClass('is-open')) {
            $('html').addClass('has-sticky-tab-open');
            $('body').addClass('no-scroll'); 
            $tabInner.height($tabsContainer.outerHeight());
          }
        } 
      });
    },
    initStickTabsMobile: function initStickTabsMobile() {
      var $tabsInnerMobile = $('.sticky-tabs .tabs-inner--mobile, .sticky-tabs .tabs-inner--desktop');

      if (!$tabsInnerMobile.length) {
        return;
      }

      var $stickyTabItems = $tabsInnerMobile.find('li[data-tab-index]');

      $stickyTabItems.each(subscribeOnClickMobile($stickyTabItems));
      subscribeOnPageScrollMobile($tabsInnerMobile);
    },
    /**
     * Tabs mobile: Dropdown init and event handling
     */
    initTabsMobile: function initTabsMobile() {
      // Are we in Edit mode?
      var isEditMode = $('body').hasClass('on-page-editor');

      var $tabDropdown = $('.bootstrap-select.tabs-select');
      if (!$tabDropdown.length) {
        return; // Exit if no tabs found
      }

      $('.bootstrap-select.tabs-select').each(function() {
        var _self = this;

        // Ensure first option is active
        var $firstOption = $(this).find('.selectpicker li').eq(0);

        // Get label for first option 
        $firstOptionText = !isEditMode 
          ? $firstOption.find('.field-heading').text()
          : $firstOption.find('.field-heading .scWebEditInput').text();

        $firstOption.find('.field-heading').addClass('active');

        // Fill default option with active tab label
        if ($firstOptionText) {
          setSelectedDropdownLabel($firstOptionText, this);
        }

        $(this).click(function() {
          $(this).toggleClass('is-open');
        });

        // Handles tab-change on mobile with dropdown
        $(this).find('.selectpicker li').click(function() {
          var idx = $(this).index();
          var text = $(this).find('.field-heading').text();

          var $tabsSelect = $(this).closest('.tabs').find('.tabs-select');
          
          $tabsSelect.find('.selectpicker .field-heading').removeClass('active');
          $(this).find('.field-heading').addClass('active');
          setSelectedDropdownLabel(text, _self);

          var $tabs = $(this).closest('.tabs').find('.tabs-container .tab');
          var $tabHeading = $(this).closest('.tabs').find('.tabs-heading li');
          $tabHeading.removeClass('active');
          $tabHeading.eq(idx).addClass('active');

          $tabs.removeClass('active');
          $tabs.eq(idx).addClass('active');
        });
      });

      // Add selected tab label to dropdown on desktop click
      $('.tabs-heading > li').click(function() {
        var idx = $(this).index();

        var tabLabel = !isEditMode 
          ? $(this).find('.field-heading').text()
          : $(this).find('.field-heading .scWebEditInput').text();

        var $dropdown = $(this).closest('.tabs').find('.bootstrap-select.tabs-select');
        $dropdown.find('.selectpicker .field-heading').removeClass('active');
        $dropdown.find('.selectpicker li').eq(idx).find('.field-heading').addClass('active');
        setSelectedDropdownLabel(tabLabel, $dropdown);
      });
    },

    initInvertedTabs: function initInvertedTabs() {
      var $tabsInverted = $('.tabs-inverted');

      if (!$tabsInverted.length) {
        return;
      }

      $tabsInverted.find('.tabs-container').append('<div class="arrow prev"></div><div class="arrow next"></div>');
      
      $(document).on('click', '.tabs-container .arrow' , function() {
        var isNext = $(this).hasClass('next');
        var $tabs = $(this).closest('.tabs-inner').find('.tabs-heading li');
        var $activeTab = $tabs.filter('.active');
        var idx = $activeTab.index();
        var targetIdx = 0;

        if (isNext) {
          if (!$activeTab.is(':last-child')) {
            targetIdx = idx + 1;
          } 
        } else {
          if ($activeTab.is(':first-child')) {
            targetIdx = $tabs.length - 1;
          } else {
            targetIdx = idx - 1;
          }
        }

        $tabs.eq(targetIdx).click();
      });
    },
    init: function init() {
      this.api.initTabsMobile();
      this.api.initInvertedTabs();
      var initStickTabs, initStickTabsMobile;

      initStickTabs = this.api ? this.api.initStickTabs : this.initStickTabs;
      initStickTabsMobile = this.api ? this.api.initStickTabsMobile : this.initStickTabsMobile; 

      if (typeof initStickTabs === 'function' && typeof initStickTabsMobile === 'function') {
        initStickTabs();
        initStickTabsMobile();
      }
    }
  };

  /// helpers implementation

  function subscribeOnClickMobile($allMobileStickyTabItems) {
    return function callbackfunction (idx, tabClicked) {
      $(tabClicked).on('click', function onMobileStickyTabClick() {
        if (isUnsticked(tabClicked)) {
          var wasActive = $(tabClicked).hasClass('active');

          removeActiveClass($allMobileStickyTabItems);

          if (!wasActive) {
            $(tabClicked).addClass('active');
          } else {
            $(tabClicked).removeClass('active');
          }
        }
        
        // This needs to be uncommented when mobile stickytabs is implemented
        // scrollToStickyTab(tabClicked);

      });
    };
  }

  function setSelectedDropdownLabel(text, dropdown) {
    $(dropdown).find('button span.filter-option').text(text);
  }

  function isUnsticked(tab) {
    if (tab) {
      return $(tab).parents('.unstick').length > 0
    }
    return false;
  }

  function removeActiveClass($tabs) {
    $tabs.each(function (idx, tab) {
      $(tab).removeClass('active');
    });
  }

  function scrollToStickyTab(tab) {
    if (tab) {
      var container = $(tab).parents('.sticky-tabs')[0];

      if (container) {
        $('html,body').animate({
          scrollTop: container.offsetTop - 65
        }, 'slow');
      }
    }
  }

  function subscribeOnPageScrollMobile($tabsInnerMobile) {
    $('body').on('resize scroll', function scrollCallback() {
      var elementTop = $tabsInnerMobile.parents('.sticky-tabs').offset().top;
      var viewportBottom = $(window).height();
      var thresholdOffset = 5; // 5px threshold to capture element

      if (viewportBottom < elementTop - thresholdOffset) {
        $tabsInnerMobile.removeClass('unstick');
      } else {
        $tabsInnerMobile.addClass('unstick');
        var $stickyTabs = $('.sticky-tabs');
        var $tabInner = $stickyTabs.find('.tabs-inner.tabs-inner--desktop');
        var $tabHeading = $tabInner.find('.tabs-heading');
        var openTabIdx = findActiveTabIndex();
          $tabHeading.find('li').eq(openTabIdx).addClass('active');
      }
    });
  }

  /**
   * Find the currently active sticky tab index
   */
  function findActiveTabIndex() {
    var $stickyTabs = $('.sticky-tabs');
    var $tabInner = $stickyTabs.find('.tabs-inner.tabs-inner--desktop');
    var $tabsContainer = $tabInner.find('.tabs-container');
    return $tabsContainer.find('.tab.active').index();
  }

  /**
   * Hides sticky tabs
   */
  function hideTabs() {
    var $stickyTabs = $('.sticky-tabs');
    var $tabInner = $stickyTabs.find('.tabs-inner.tabs-inner--desktop');
    var $tabHeading = $tabInner.find('.tabs-heading');

    $('html').removeClass('has-sticky-tab-open');
    $tabInner.removeClass('is-open');
    $('body').removeClass('no-scroll');
    var openTabIdx = findActiveTabIndex();
    $tabHeading.find('li').eq(openTabIdx).removeClass('active sticky-tab-active');
  }

  return api;
})(jQuery, document);

XA.register('componentStickyTabs', XA.component.componentStickyTabs);


/*  component-story  */
XA.component.componentStory = (function ($) {

    var api = {
        /**
         * Initialise story component slider with Slick carousel
         */
        initStorySlider: function () {

            var $slider = $('.story > .component-content > .mod-story-container > .mod-story-content > .mod-story-content-pages > .story-list > .component-content > ul');

            $slider.each(function () {
                if ($(this)) {
                    $slider.not('.slick-initialized').slick({
                        dots: true,
                        arrows: false,
                        speed: 100,
                        cssEase: "linear",
                        fade: true,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        customPaging: function (slick, index) {
                            return '<a>' + (index - 0) + '</a>';
                        }
                    });
                }
            });

            var $img = $('.mod-story-bg > .background-image > img');

            $img.each(function () {
                var curSrc = $(this).attr('data-src');
                var srcset = $(this).attr('data-srcset');
                var sizes = $(this).attr('data-sizes');
                $(this).removeAttr('data-srcset data-sizes class data-src');
                $(this).attr('src', curSrc);
                $(this).attr('srcset', srcset);
                $(this).attr('sizes', sizes);
            });
        },

        initStoryParallax: function () {

            $(document).ready(function () {
                var story = $('.component.story.mod-story');
                if (story.isVisible()) {
                    $(this).find('.mod-story-title').addClass('is-active');
                    $(this).find('.mod-story-content').addClass('is-active');
                }
            });

            $.fn.isVisible = function () {
                if (this[0] != undefined) {
                    var rect = this[0].getBoundingClientRect();
                    return (
                        (rect.height > 0 || rect.width > 0) &&
                        rect.bottom >= 0 &&
                        rect.right >= 0 &&
                        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
                        rect.left <= (window.innerWidth || document.documentElement.clientWidth)
                    );
                }
            };
        },
    };

    api.init = function () {
        this.api.initStorySlider();
        this.api.initStoryParallax();
    };

    return api;
})(jQuery, document);

XA.register('componentStory', XA.component.componentStory);

/*  component-videobanner  */
/* global videojs, $ */
/*eslint no-console: ["error", { allow: ["log"] }] */
/*eslint no-unused-vars: 0*/

XA.component.componentVideoBanner = (function ($) {
  var api = {   

    /**
     * Set teaser bubbles variant background color on page load
     */
    updateStageBubblesBackground: function () {
      $('.teaser.bubbles > .component-content div[data-bg-color]').each(function() {
        var hexColor = $(this).attr('data-bg-color');

        if (hexColor && hexColor.length) {
          $(this).closest('.teaser.bubbles').css({'background-color': hexColor});
        }
      });

      $('.carousel li.slide .bubbles > .component-content div[data-bg-color]').each(function() {
        var hexColor = $(this).attr('data-bg-color');

        if (hexColor && hexColor.length) {
          $(this).closest('.slide .bubbles').css({'background-color': hexColor});
        }
      });
    },

    /**
     * If screen is low-res, append class to HTML tag
     * Used to regulate media-banner & carousel height on low-res screens
     */
    setLowResolution: function() {
      var isLowRes = window.devicePixelRatio > 1 && window.devicePixelRatio < 2 && screen.height < 730 && screen.height > 690 ? !0 : !1;
      document.documentElement.className += isLowRes ? ' low-resolution' : '';
    }
  };

  api.init = function () {

    $('.mod-stage .video-banner').each(function() {
      var curStage = document.querySelector('.mod-stage--video-player');
      var closeBtn = document.querySelector('.player-close');
      var startBtn = document.querySelector('.player-toggle');   

      var video = $('.mod-stage--video-player').find('video').get(0);      
  
      startBtn.addEventListener('click', function () {
        curStage.classList.add('is-playing'); 
        video.play(); 
      }); 

      closeBtn.addEventListener('click', function () {
        curStage.classList.remove('is-playing');
        video.pause(); 
      });
    }); 

    this.api.updateStageBubblesBackground();
    this.api.setLowResolution();
  };
  return api;
})(jQuery, document);

XA.register('componentVideoBanner', XA.component.componentVideoBanner);


/*  content-slider  */
XA.component.zwpContentSlider = (function($) {

  var api = {
    /**
     * Initialise content slider with Slick carousel
     */
    initContentSlider: function() {

      var $slider = $('.mod-content-slider__inlay');

      // Are we in Edit mode? If so, we need to set infinite mode to false 
      // This is to prevent breaking Sitecore editor JS
      var isEditMode = $('body').hasClass('on-page-editor');
      
      if ($slider) {
        $slider.not('.slick-initialized').slick({
          dots: true,
          speed: 1200,
          cssEase: "ease-in",
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: !isEditMode
        });	
      }
    },
  };

  api.init = function() {
    this.api.initContentSlider();
  };

  return api;
})(jQuery, document);

XA.register('zwpContentSlider', XA.component.zwpContentSlider);

/*  cookies  */
XA.component.zwpCookies = (function($) {

  var api = {
    PRIVACY_COOKIE: 'cookieLaw',
    COOKIE_FLUSH_KEY: 'cookieFlushKey',

    /**
     * Check if a cookie flush has been requested or updated
     */
    checkFlushCookie: function() {
      var flushKey = $('#epoch-value').val();
      var cookieFlushKey = XA.cookies.readCookie(this.COOKIE_FLUSH_KEY);

      if (!flushKey) {
        return;
      }

      // If flushKeys don't match - clear cookie
      if (!cookieFlushKey || (cookieFlushKey !== flushKey)) {
        this.flushCookie(this.PRIVACY_COOKIE, flushKey);
      } 
    },

    /**
     * Removes cookie and updates flush key cookie with new value
     * @param {string} cookieName - the cookie we want to destroy
     * @param {string} flushKey - the new flush key
     */
    flushCookie: function(cookieName, flushKey) {
      XA.cookies.createCookie(this.COOKIE_FLUSH_KEY, flushKey, 365);
      document.cookie = cookieName + '=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
    }
  };

  api.init = function() {
    this.api.checkFlushCookie();
  };

  return api;
})(jQuery, document);

XA.register('zwpCookies', XA.component.zwpCookies);

/*  datepicker  */
var Datepicker = (function () {
  'use strict';

  function hasProperty(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  }

  function lastItemOf(arr) {
    return arr[arr.length - 1];
  }

  // push only the items not included in the array
  function pushUnique(arr, ...items) {
    items.forEach((item) => {
      if (arr.includes(item)) {
        return;
      }
      arr.push(item);
    });
    return arr;
  }
//Adding function to check for validation when manually entering the value
//This is called from Update(inline)
  function ValidateInputInline(datePicker)  
    {
      var dateFormat=datePicker.config.format.toLowerCase();
      var dateFormatParts = dateFormat.match(new RegExp(reFormatTokens, 'g'));
      var dateParts=datePicker.inputField.value.split(new RegExp(reNonDateParts, 'g'));
      
      if(dateParts.length==1 && dateParts[0].toLowerCase()=="today")
      {
        return;
      }
      if(dateParts.length!=3) 
      {
        inputInlineErrorMessage(datePicker);
        return;
      }
      if(dateParts[0].toLowerCase()=="today")
      {
        return;
      }
      
     /** For datePart check**/
       let dateIndex=dateFormatParts.indexOf('dd');
      
      if(isNaN(dateParts[dateIndex]) || parseInt(dateParts[dateIndex])>31 || parseInt(dateParts[dateIndex])<=0)
      {
        inputInlineErrorMessage(datePicker);
        return;
      }

      /**For yearPart check**/
      let yearIndex=dateFormatParts.indexOf('yyyy');

      if(isNaN(dateParts[yearIndex]) || dateParts[yearIndex].length!=4)
      {
        inputInlineErrorMessage(datePicker);
        return;
      }

      /**For MonthPart Check**/
      var monthIndex=dateFormatParts.findIndex(function(item)
        {
          return item.indexOf('m')!==-1;
        });

      if(isNaN(dateParts[monthIndex]))
      {
        const monthName = dateParts[monthIndex].toLowerCase();
        const compareNames = name => name.toLowerCase().startsWith(monthName);
        
        // compare with both short and full names because 
        
        monthIndex = datePicker.config.locale.monthsShort.findIndex(compareNames);
        if (monthIndex < 0) {
          monthIndex = datePicker.config.locale.months.findIndex(compareNames);
        }
        if (monthIndex < 0) {
          inputInlineErrorMessage(datePicker);
          return;
        }
      }    
      else if(dateParts[monthIndex]>12 || dateParts[monthIndex]<1)
        {
          inputInlineErrorMessage(datePicker);
          return;
        }  
      removeInputInlineErrorMessage(datePicker) ;
      return;
    }

    function removeInputInlineErrorMessage(datePicker)
    {
      var getValidationMessageEle=document.querySelector(`[data-valmsg-for="${datePicker.inputField.name}"]`);
      jQuery(datePicker.inputField).removeClass("input-validation-error");
      jQuery(getValidationMessageEle).addClass("field-validation-valid").removeClass("field-validation-error").text("");
      return;
    }
  function inputInlineErrorMessage(datePicker)
    {
      var getValidationMessageEle=document.querySelector(`[data-valmsg-for="${datePicker.inputField.name}"]`);
      var getInvalidFormatErrorMessage=jQuery(datePicker.inputField).attr('invalid-format-message');
      datePicker.inputField.value="";
      jQuery(datePicker.inputField).addClass("input-validation-error");
      jQuery(getValidationMessageEle).addClass("field-validation-error").removeClass("field-validation-valid").text(getInvalidFormatErrorMessage);
      return;
    }
  function stringToArray(str, separator) {
    // convert empty string to an empty array
    return str ? str.split(separator) : [];
  }

  function isInRange(testVal, min, max) {
    const minOK = min === undefined || testVal >= min;
    const maxOK = max === undefined || testVal <= max;
    return minOK && maxOK;
  }

  function limitToRange(val, min, max) {
    if (val < min) {
      return min;
    }
    if (val > max) {
      return max;
    }
    return val;
  }

  function createTagRepeat(tagName, repeat, attributes = {}, index = 0, html = '') {
    const openTagSrc = Object.keys(attributes).reduce((src, attr) => {
      let val = attributes[attr];
      if (typeof val === 'function') {
        val = val(index);
      }
      return `${src} ${attr}="${val}"`;
    }, tagName);
    html += `<${openTagSrc}></${tagName}>`;

    const next = index + 1;
    return next < repeat
      ? createTagRepeat(tagName, repeat, attributes, next, html)
      : html;
  }

  // Remove the spacing surrounding tags for HTML parser not to create text nodes
  // before/after elements
  function optimizeTemplateHTML(html) {
    return html.replace(/>\s+/g, '>').replace(/\s+</, '<');
  }

  function stripTime(timeValue) {
    return new Date(timeValue).setHours(0, 0, 0, 0);
  }

  function today() {
    return new Date().setHours(0, 0, 0, 0);
  }

  // Get the time value of the start of given date or year, month and day
  function dateValue(...args) {
    switch (args.length) {
      case 0:
        return today();
      case 1:
        return stripTime(args[0]);
    }

    // use setFullYear() to keep 2-digit year from being mapped to 1900-1999
    const newDate = new Date(0);
    newDate.setFullYear(...args);
    return newDate.setHours(0, 0, 0, 0);
  }

  function addDays(date, amount) {
    const newDate = new Date(date);
    return newDate.setDate(newDate.getDate() + amount);
  }

  function addWeeks(date, amount) {
    return addDays(date, amount * 7);
  }

  function addMonths(date, amount) {
    // If the day of the date is not in the new month, the last day of the new
    // month will be returned. e.g. Jan 31 + 1 month → Feb 28 (not Mar 03)
    const newDate = new Date(date);
    const monthsToSet = newDate.getMonth() + amount;
    let expectedMonth = monthsToSet % 12;
    if (expectedMonth < 0) {
      expectedMonth += 12;
    }

    const time = newDate.setMonth(monthsToSet);
    return newDate.getMonth() !== expectedMonth ? newDate.setDate(0) : time;
  }

  function addYears(date, amount) {
    // If the date is Feb 29 and the new year is not a leap year, Feb 28 of the
    // new year will be returned.
    const newDate = new Date(date);
    const expectedMonth = newDate.getMonth();
    const time = newDate.setFullYear(newDate.getFullYear() + amount);
    return expectedMonth === 1 && newDate.getMonth() === 2 ? newDate.setDate(0) : time;
  }

  // Calculate the distance bettwen 2 days of the week
  function dayDiff(day, from) {
    return (day - from + 7) % 7;
  }

  // Get the date of the specified day of the week of given base date
  function dayOfTheWeekOf(baseDate, dayOfWeek, weekStart = 0) {
    const baseDay = new Date(baseDate).getDay();
    return addDays(baseDate, dayDiff(dayOfWeek, weekStart) - dayDiff(baseDay, weekStart));
  }

  // Get the ISO week of a date
  function getWeek(date) {
    // start of ISO week is Monday
    const thuOfTheWeek = dayOfTheWeekOf(date, 4, 1);
    // 1st week == the week where the 4th of January is in
    const firstThu = dayOfTheWeekOf(new Date(thuOfTheWeek).setMonth(0, 4), 4, 1);
    return Math.round((thuOfTheWeek - firstThu) / 604800000) + 1;
  }

  // Get the start year of the period of years that includes given date
  // years: length of the year period
  function startOfYearPeriod(date, years) {
    /* @see https://en.wikipedia.org/wiki/Year_zero#ISO_8601 */
    const year = new Date(date).getFullYear();
    return Math.floor(year / years) * years;
  }

  // Convert date to the first/last date of the month/year of the date
  function regularizeDate(date, timeSpan, useLastDate) {
    if (timeSpan !== 1 && timeSpan !== 2) {
      return date;
    }
    const newDate = new Date(date);
    if (timeSpan === 1) {
      useLastDate
        ? newDate.setMonth(newDate.getMonth() + 1, 0)
        : newDate.setDate(1);
    } else {
      useLastDate
        ? newDate.setFullYear(newDate.getFullYear() + 1, 0, 0)
        : newDate.setMonth(0, 1);
    }
    return newDate.setHours(0, 0, 0, 0);
  }

  // pattern for format parts
  const reFormatTokens = /dd?|DD?|mm?|MM?|yy?(?:yy)?/;
  // pattern for non date parts
  const reNonDateParts = /[\s!-/:-@[-`{-~年月日]+/;
  // cache for persed formats
  let knownFormats = {};
  // parse funtions for date parts
  const parseFns = {
    y(date, year) {
      return new Date(date).setFullYear(parseInt(year, 10));
    },
    m(date, month, locale) {
      const newDate = new Date(date);
      let monthIndex = parseInt(month, 10) - 1;

      if (isNaN(monthIndex)) {
        if (!month) {
          return NaN;
        }

        const monthName = month.toLowerCase();
        const compareNames = name => name.toLowerCase().startsWith(monthName);
        // compare with both short and full names because some locales have periods
        // in the short names (not equal to the first X letters of the full names)
        monthIndex = locale.monthsShort.findIndex(compareNames);
        if (monthIndex < 0) {
          monthIndex = locale.months.findIndex(compareNames);
        }
        if (monthIndex < 0) {
          return NaN;
        }
      }

      newDate.setMonth(monthIndex);
      return newDate.getMonth() !== normalizeMonth(monthIndex)
        ? newDate.setDate(0)
        : newDate.getTime();
    },
    d(date, day) {
      return new Date(date).setDate(parseInt(day, 10));
    },
  };
  // format functions for date parts
  const formatFns = {
    d(date) {
      return date.getDate();
    },
    dd(date) {
      return padZero(date.getDate(), 2);
    },
    D(date, locale) {
      return locale.daysShort[date.getDay()];
    },
    DD(date, locale) {
      return locale.days[date.getDay()];
    },
    m(date) {
      return date.getMonth() + 1;
    },
    mm(date) {
      return padZero(date.getMonth() + 1, 2);
    },
    M(date, locale) {
      return locale.monthsShort[date.getMonth()];
    },
    MM(date, locale) {
      return locale.months[date.getMonth()];
    },
    y(date) {
      return date.getFullYear();
    },
    yy(date) {
      return padZero(date.getFullYear(), 2).slice(-2);
    },
    yyyy(date) {
      return padZero(date.getFullYear(), 4);
    },
  };

  // get month index in normal range (0 - 11) from any number
  function normalizeMonth(monthIndex) {
    return monthIndex > -1 ? monthIndex % 12 : normalizeMonth(monthIndex + 12);
  }

  function padZero(num, length) {
    return num.toString().padStart(length, '0');
  }

  function parseFormatString(format) {
    if (typeof format !== 'string') {
      throw new Error("Invalid date format.");
    }
    if (format in knownFormats) {
      return knownFormats[format];
    }

    // sprit the format string into parts and seprators
    const separators = format.split(reFormatTokens);
    const parts = format.match(new RegExp(reFormatTokens, 'g'));
    if (separators.length === 0 || !parts) {
      throw new Error("Invalid date format.");
    }

    // collect format functions used in the format
    const partFormatters = parts.map(token => formatFns[token]);

    // collect parse function keys used in the format
    // iterate over parseFns' keys in order to keep the order of the keys.
    const partParserKeys = Object.keys(parseFns).reduce((keys, key) => {
      const token = parts.find(part => part[0] !== 'D' && part[0].toLowerCase() === key);
      if (token) {
        keys.push(key);
      }
      return keys;
    }, []);

    return knownFormats[format] = {
      parser(dateStr, locale) {
        const dateParts = dateStr.split(reNonDateParts).reduce((dtParts, part, index) => {
          if (part.length > 0 && parts[index]) {
            const token = parts[index][0];
            if (token === 'M') {
              dtParts.m = part;
            } else if (token !== 'D') {
              dtParts[token] = part;
            }
          }
          return dtParts;
        }, {});

        // iterate over partParserkeys so that the parsing is made in the oder
        // of year, month and day to prevent the day parser from correcting last
        // day of month wrongly
        return partParserKeys.reduce((origDate, key) => {
          const newDate = parseFns[key](origDate, dateParts[key], locale);
          // ingnore the part failed to parse
          return isNaN(newDate) ? origDate : newDate;
        }, today());
      },
      formatter(date, locale) {
        let dateStr = partFormatters.reduce((str, fn, index) => {
          return str += `${separators[index]}${fn(date, locale)}`;
        }, '');
        // separators' length is always parts' length + 1,
        return dateStr += lastItemOf(separators);
      },
    };
  }

  function parseDate(dateStr, format, locale) {
    if (dateStr instanceof Date || typeof dateStr === 'number') {
      const date = stripTime(dateStr);
      return isNaN(date) ? undefined : date;
    }
    if (!dateStr) {
      return undefined;
    }
    if (dateStr === 'today') {
      return today();
    }

    if (format && format.toValue) {
      const date = format.toValue(dateStr, format, locale);
      return isNaN(date) ? undefined : stripTime(date);
    }

    return parseFormatString(format).parser(dateStr, locale);
  }

  function formatDate(date, format, locale) {
    if (isNaN(date) || (!date && date !== 0)) {
      return '';
    }

    const dateObj = typeof date === 'number' ? new Date(date) : date;

    if (format.toDisplay) {
      return format.toDisplay(dateObj, format, locale);
    }

    return parseFormatString(format).formatter(dateObj, locale);
  }

  const range = document.createRange();

  function parseHTML(html) {
    return range.createContextualFragment(html);
  }

  function getParent(el) {
    return el.parentElement
      || (el.parentNode instanceof ShadowRoot ? el.parentNode.host : undefined);
  }

  function isActiveElement(el) {
    return el.getRootNode().activeElement === el;
  }

  function hideElement(el) {
    if (el.style.display === 'none') {
      return;
    }
    // back up the existing display setting in data-style-display
    if (el.style.display) {
      el.dataset.styleDisplay = el.style.display;
    }
    el.style.display = 'none';
  }

  function showElement(el) {
    if (el.style.display !== 'none') {
      return;
    }
    if (el.dataset.styleDisplay) {
      // restore backed-up dispay property
      el.style.display = el.dataset.styleDisplay;
      delete el.dataset.styleDisplay;
    } else {
      el.style.display = '';
    }
  }

  function emptyChildNodes(el) {
    if (el.firstChild) {
      el.removeChild(el.firstChild);
      emptyChildNodes(el);
    }
  }

  function replaceChildNodes(el, newChildNodes) {
    emptyChildNodes(el);
    if (newChildNodes instanceof DocumentFragment) {
      el.appendChild(newChildNodes);
    } else if (typeof newChildNodes === 'string') {
      el.appendChild(parseHTML(newChildNodes));
    } else if (typeof newChildNodes.forEach === 'function') {
      newChildNodes.forEach((node) => {
        el.appendChild(node);
      });
    }
  }

  const listenerRegistry = new WeakMap();
  const {addEventListener, removeEventListener} = EventTarget.prototype;

  // Register event listeners to a key object
  // listeners: array of listener definitions;
  //   - each definition must be a flat array of event target and the arguments
  //     used to call addEventListener() on the target
  function registerListeners(keyObj, listeners) {
    let registered = listenerRegistry.get(keyObj);
    if (!registered) {
      registered = [];
      listenerRegistry.set(keyObj, registered);
    }
    listeners.forEach((listener) => {
      addEventListener.call(...listener);
      registered.push(listener);
    });
  }

  function unregisterListeners(keyObj) {
    let listeners = listenerRegistry.get(keyObj);
    if (!listeners) {
      return;
    }
    listeners.forEach((listener) => {
      removeEventListener.call(...listener);
    });
    listenerRegistry.delete(keyObj);
  }

  // Event.composedPath() polyfill for Edge
  // based on https://gist.github.com/kleinfreund/e9787d73776c0e3750dcfcdc89f100ec
  if (!Event.prototype.composedPath) {
    const getComposedPath = (node, path = []) => {
      path.push(node);

      let parent;
      if (node.parentNode) {
        parent = node.parentNode;
      } else if (node.host) { // ShadowRoot
        parent = node.host;
      } else if (node.defaultView) {  // Document
        parent = node.defaultView;
      }
      return parent ? getComposedPath(parent, path) : path;
    };

    Event.prototype.composedPath = function () {
      return getComposedPath(this.target);
    };
  }

  function findFromPath(path, criteria, currentTarget) {
    const [node, ...rest] = path;
    if (criteria(node)) {
      return node;
    }
    if (node === currentTarget || node.tagName === 'HTML' || rest.length === 0) {
      // stop when reaching currentTarget or <html>
      return;
    }
    return findFromPath(rest, criteria, currentTarget);
  }

  // Search for the actual target of a delegated event
  function findElementInEventPath(ev, selector) {
    const criteria = typeof selector === 'function'
      ? selector
      : el => el instanceof Element && el.matches(selector);
    return findFromPath(ev.composedPath(), criteria, ev.currentTarget);
  }

  // default locales
  const locales = {
    en: {
      days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
      months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      today: "Today",
      clear: "Clear",
      titleFormat: "MM y"
      },
      'de-DE': {
          days: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
          daysShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
          daysMin: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
          months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
              'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
          monthsShort: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun',
              'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
          today: "Today",
          clear: "Clear",
          titleFormat: "MM y"
      }
  };

  // config options updatable by setOptions() and their default values
  const defaultOptions = {
    autohide: false,
    beforeShowDay: null,
    beforeShowDecade: null,
    beforeShowMonth: null,
    beforeShowYear: null,
    calendarWeeks: false,
    clearBtn: false,
    dateDelimiter: ',',
    datesDisabled: [],
    daysOfWeekDisabled: [],
    daysOfWeekHighlighted: [],
    defaultViewDate: undefined, // placeholder, defaults to today() by the program
    disableTouchKeyboard: false,
    format: 'mm/dd/yyyy',
    language: 'en',
    maxDate: null,
    maxNumberOfDates: 1,
    maxView: 3,
    minDate: null,
    nextArrow: '»',
    orientation: 'auto',
    pickLevel: 0,
    prevArrow: '«',
    showDaysOfWeek: true,
    showOnClick: true,
    showOnFocus: true,
    startView: 0,
    title: '',
    todayBtn: false,
    todayBtnMode: 0,
    todayHighlight: false,
    updateOnBlur: true,
    weekStart: 0,
  };

  const {
    language: defaultLang,
    format: defaultFormat,
    weekStart: defaultWeekStart,
  } = defaultOptions;

  // Reducer function to filter out invalid day-of-week from the input
  function sanitizeDOW(dow, day) {
    return dow.length < 6 && day >= 0 && day < 7
      ? pushUnique(dow, day)
      : dow;
  }

  function calcEndOfWeek(startOfWeek) {
    return (startOfWeek + 6) % 7;
  }

  // validate input date. if invalid, fallback to the original value
  function validateDate(value, format, locale, origValue) {
    const date = parseDate(value, format, locale);
    return date !== undefined ? date : origValue;
  }

  // Validate viewId. if invalid, fallback to the original value
  function validateViewId(value, origValue, max = 3) {
    const viewId = parseInt(value, 10);
    return viewId >= 0 && viewId <= max ? viewId : origValue;
  }

  // Create Datepicker configuration to set
  function processOptions(options, datepicker) {
    const inOpts = Object.assign({}, options);
    const config = {};
    const locales = datepicker.constructor.locales;
    const rangeSideIndex = datepicker.rangeSideIndex;
    let {
      format,
      language,
      locale,
      maxDate,
      maxView,
      minDate,
      pickLevel,
      startView,
      weekStart,
    } = datepicker.config || {};

    if (inOpts.language) {
      let lang;
      if (inOpts.language !== language) {
        if (locales[inOpts.language]) {
          lang = inOpts.language;
        } else {
          // Check if langauge + region tag can fallback to the one without
          // region (e.g. fr-CA → fr)
          lang = inOpts.language.split('-')[0];
          if (locales[lang] === undefined) {
            lang = false;
          }
        }
      }
      delete inOpts.language;
      if (lang) {
        language = config.language = lang;

        // update locale as well when updating language
        const origLocale = locale || locales[defaultLang];
        // use default language's properties for the fallback
        locale = Object.assign({
          format: defaultFormat,
          weekStart: defaultWeekStart
        }, locales[defaultLang]);
        if (language !== defaultLang) {
          Object.assign(locale, locales[language]);
        }
        config.locale = locale;
        // if format and/or weekStart are the same as old locale's defaults,
        // update them to new locale's defaults
        if (format === origLocale.format) {
          format = config.format = locale.format;
        }
        if (weekStart === origLocale.weekStart) {
          weekStart = config.weekStart = locale.weekStart;
          config.weekEnd = calcEndOfWeek(locale.weekStart);
        }
      }
    }

    if (inOpts.format) {
      const hasToDisplay = typeof inOpts.format.toDisplay === 'function';
      const hasToValue = typeof inOpts.format.toValue === 'function';
      const validFormatString = reFormatTokens.test(inOpts.format);
      if ((hasToDisplay && hasToValue) || validFormatString) {
        format = config.format = inOpts.format;
      }
      delete inOpts.format;
    }

    //*** pick level ***//
    let newPickLevel = pickLevel;
    if (inOpts.pickLevel !== undefined) {
      newPickLevel = validateViewId(inOpts.pickLevel, 2);
      delete inOpts.pickLevel;
    }
    if (newPickLevel !== pickLevel) {
      if (newPickLevel > pickLevel) {
        // complement current minDate/madDate so that the existing range will be
        // expanded to fit the new level later
        if (inOpts.minDate === undefined) {
          inOpts.minDate = minDate;
        }
        if (inOpts.maxDate === undefined) {
          inOpts.maxDate = maxDate;
        }
      }
      // complement datesDisabled so that it will be reset later
      if (!inOpts.datesDisabled) {
        inOpts.datesDisabled = [];
      }
      pickLevel = config.pickLevel = newPickLevel;
    }

    //*** dates ***//
    // while min and maxDate for "no limit" in the options are better to be null
    // (especially when updating), the ones in the config have to be undefined
    // because null is treated as 0 (= unix epoch) when comparing with time value
    let minDt = minDate;
    let maxDt = maxDate;
    if (inOpts.minDate !== undefined) {
      const defaultMinDt = dateValue(0, 0, 1);
      minDt = inOpts.minDate === null
        ? defaultMinDt  // set 0000-01-01 to prevent negative values for year
        : validateDate(inOpts.minDate, format, locale, minDt);
      if (minDt !== defaultMinDt) {
        minDt = regularizeDate(minDt, pickLevel, false);
      }
      delete inOpts.minDate;
    }
    if (inOpts.maxDate !== undefined) {
      maxDt = inOpts.maxDate === null
        ? undefined
        : validateDate(inOpts.maxDate, format, locale, maxDt);
      if (maxDt !== undefined) {
        maxDt = regularizeDate(maxDt, pickLevel, true);
      }
      delete inOpts.maxDate;
    }
    if (maxDt < minDt) {
      minDate = config.minDate = maxDt;
      maxDate = config.maxDate = minDt;
    } else {
      if (minDate !== minDt) {
        minDate = config.minDate = minDt;
      }
      if (maxDate !== maxDt) {
        maxDate = config.maxDate = maxDt;
      }
    }

    if (inOpts.datesDisabled) {
      config.datesDisabled = inOpts.datesDisabled.reduce((dates, dt) => {
        const date = parseDate(dt, format, locale);
        return date !== undefined
          ? pushUnique(dates, regularizeDate(date, pickLevel, rangeSideIndex))
          : dates;
      }, []);
      delete inOpts.datesDisabled;
    }
    if (inOpts.defaultViewDate !== undefined) {
      const viewDate = parseDate(inOpts.defaultViewDate, format, locale);
      if (viewDate !== undefined) {
        config.defaultViewDate = viewDate;
      }
      delete inOpts.defaultViewDate;
    }

    //*** days of week ***//
    if (inOpts.weekStart !== undefined) {
      const wkStart = Number(inOpts.weekStart) % 7;
      if (!isNaN(wkStart)) {
        weekStart = config.weekStart = wkStart;
        config.weekEnd = calcEndOfWeek(wkStart);
      }
      delete inOpts.weekStart;
    }
    if (inOpts.daysOfWeekDisabled) {
      config.daysOfWeekDisabled = inOpts.daysOfWeekDisabled.reduce(sanitizeDOW, []);
      delete inOpts.daysOfWeekDisabled;
    }
    if (inOpts.daysOfWeekHighlighted) {
      config.daysOfWeekHighlighted = inOpts.daysOfWeekHighlighted.reduce(sanitizeDOW, []);
      delete inOpts.daysOfWeekHighlighted;
    }

    //*** multi date ***//
    if (inOpts.maxNumberOfDates !== undefined) {
      const maxNumberOfDates = parseInt(inOpts.maxNumberOfDates, 10);
      if (maxNumberOfDates >= 0) {
        config.maxNumberOfDates = maxNumberOfDates;
        config.multidate = maxNumberOfDates !== 1;
      }
      delete inOpts.maxNumberOfDates;
    }
    if (inOpts.dateDelimiter) {
      config.dateDelimiter = String(inOpts.dateDelimiter);
      delete inOpts.dateDelimiter;
    }

    //*** view ***//
    let newMaxView = maxView;
    if (inOpts.maxView !== undefined) {
      newMaxView = validateViewId(inOpts.maxView, maxView);
      delete inOpts.maxView;
    }
    // ensure max view >= pick level
    newMaxView = pickLevel > newMaxView ? pickLevel : newMaxView;
    if (newMaxView !== maxView) {
      maxView = config.maxView = newMaxView;
    }

    let newStartView = startView;
    if (inOpts.startView !== undefined) {
      newStartView = validateViewId(inOpts.startView, newStartView);
      delete inOpts.startView;
    }
    // ensure pick level <= start view <= max view
    if (newStartView < pickLevel) {
      newStartView = pickLevel;
    } else if (newStartView > maxView) {
      newStartView = maxView;
    }
    if (newStartView !== startView) {
      config.startView = newStartView;
    }

    //*** template ***//
    if (inOpts.prevArrow) {
      const prevArrow = parseHTML(inOpts.prevArrow);
      if (prevArrow.childNodes.length > 0) {
        config.prevArrow = prevArrow.childNodes;
      }
      delete inOpts.prevArrow;
    }
    if (inOpts.nextArrow) {
      const nextArrow = parseHTML(inOpts.nextArrow);
      if (nextArrow.childNodes.length > 0) {
        config.nextArrow = nextArrow.childNodes;
      }
      delete inOpts.nextArrow;
    }

    //*** misc ***//
    if (inOpts.disableTouchKeyboard !== undefined) {
      config.disableTouchKeyboard = 'ontouchstart' in document && !!inOpts.disableTouchKeyboard;
      delete inOpts.disableTouchKeyboard;
    }
    if (inOpts.orientation) {
      const orientation = inOpts.orientation.toLowerCase().split(/\s+/g);
      config.orientation = {
        x: orientation.find(x => (x === 'left' || x === 'right')) || 'auto',
        y: orientation.find(y => (y === 'top' || y === 'bottom')) || 'auto',
      };
      delete inOpts.orientation;
    }
    if (inOpts.todayBtnMode !== undefined) {
      switch(inOpts.todayBtnMode) {
        case 0:
        case 1:
          config.todayBtnMode = inOpts.todayBtnMode;
      }
      delete inOpts.todayBtnMode;
    }

    //*** copy the rest ***//
    Object.keys(inOpts).forEach((key) => {
      if (inOpts[key] !== undefined && hasProperty(defaultOptions, key)) {
        config[key] = inOpts[key];
      }
    });

    return config;
  }

  const pickerTemplate = optimizeTemplateHTML(`<div class="datepicker">
  <div class="datepicker-picker">
    <div class="datepicker-header">
      <div class="datepicker-title"></div>
      <div class="datepicker-controls">
        <button type="button" class="%buttonClass% prev-btn"></button>
        <button type="button" class="%buttonClass% view-switch"></button>
        <button type="button" class="%buttonClass% next-btn"></button>
      </div>
    </div>
    <div class="datepicker-main"></div>
    <div class="datepicker-footer">
      <div class="datepicker-controls">
        <button type="button" class="%buttonClass% today-btn"></button>
        <button type="button" class="%buttonClass% clear-btn"></button>
      </div>
    </div>
  </div>
</div>`);

  const daysTemplate = optimizeTemplateHTML(`<div class="days">
  <div class="days-of-week">${createTagRepeat('span', 7, {class: 'dow'})}</div>
  <div class="datepicker-grid">${createTagRepeat('span', 42)}</div>
</div>`);

  const calendarWeeksTemplate = optimizeTemplateHTML(`<div class="calendar-weeks">
  <div class="days-of-week"><span class="dow"></span></div>
  <div class="weeks">${createTagRepeat('span', 6, {class: 'week'})}</div>
</div>`);

  // Base class of the view classes
  class View {
    constructor(picker, config) {
      Object.assign(this, config, {
        picker,
        element: parseHTML(`<div class="datepicker-view"></div>`).firstChild,
        selected: [],
      });
      this.init(this.picker.datepicker.config);
    }

    init(options) {
      if (options.pickLevel !== undefined) {
        this.isMinView = this.id === options.pickLevel;
      }
      this.setOptions(options);
      this.updateFocus();
      this.updateSelection();
    }

    // Execute beforeShow() callback and apply the result to the element
    // args:
    // - current - current value on the iteration on view rendering
    // - timeValue - time value of the date to pass to beforeShow()
    performBeforeHook(el, current, timeValue) {
      let result = this.beforeShow(new Date(timeValue));
      switch (typeof result) {
        case 'boolean':
          result = {enabled: result};
          break;
        case 'string':
          result = {classes: result};
      }

      if (result) {
        if (result.enabled === false) {
          el.classList.add('disabled');
          pushUnique(this.disabled, current);
        }
        if (result.classes) {
          const extraClasses = result.classes.split(/\s+/);
          el.classList.add(...extraClasses);
          if (extraClasses.includes('disabled')) {
            pushUnique(this.disabled, current);
          }
        }
        if (result.content) {
          replaceChildNodes(el, result.content);
        }
      }
    }
  }

  class DaysView extends View {
    constructor(picker) {
      super(picker, {
        id: 0,
        name: 'days',
        cellClass: 'day',
      });
    }

    init(options, onConstruction = true) {
      if (onConstruction) {
        const inner = parseHTML(daysTemplate).firstChild;
        this.dow = inner.firstChild;
        this.grid = inner.lastChild;
        this.element.appendChild(inner);
      }
      super.init(options);
    }

    setOptions(options) {
      let updateDOW;

      if (hasProperty(options, 'minDate')) {
        this.minDate = options.minDate;
      }
      if (hasProperty(options, 'maxDate')) {
        this.maxDate = options.maxDate;
      }
      if (options.datesDisabled) {
        this.datesDisabled = options.datesDisabled;
      }
      if (options.daysOfWeekDisabled) {
        this.daysOfWeekDisabled = options.daysOfWeekDisabled;
        updateDOW = true;
      }
      if (options.daysOfWeekHighlighted) {
        this.daysOfWeekHighlighted = options.daysOfWeekHighlighted;
      }
      if (options.todayHighlight !== undefined) {
        this.todayHighlight = options.todayHighlight;
      }
      if (options.weekStart !== undefined) {
        this.weekStart = options.weekStart;
        this.weekEnd = options.weekEnd;
        updateDOW = true;
      }
      if (options.locale) {
        const locale = this.locale = options.locale;
        this.dayNames = locale.daysMin;
        this.switchLabelFormat = locale.titleFormat;
        updateDOW = true;
      }
      if (options.beforeShowDay !== undefined) {
        this.beforeShow = typeof options.beforeShowDay === 'function'
          ? options.beforeShowDay
          : undefined;
      }

      if (options.calendarWeeks !== undefined) {
        if (options.calendarWeeks && !this.calendarWeeks) {
          const weeksElem = parseHTML(calendarWeeksTemplate).firstChild;
          this.calendarWeeks = {
            element: weeksElem,
            dow: weeksElem.firstChild,
            weeks: weeksElem.lastChild,
          };
          this.element.insertBefore(weeksElem, this.element.firstChild);
        } else if (this.calendarWeeks && !options.calendarWeeks) {
          this.element.removeChild(this.calendarWeeks.element);
          this.calendarWeeks = null;
        }
      }
      if (options.showDaysOfWeek !== undefined) {
        if (options.showDaysOfWeek) {
          showElement(this.dow);
          if (this.calendarWeeks) {
            showElement(this.calendarWeeks.dow);
          }
        } else {
          hideElement(this.dow);
          if (this.calendarWeeks) {
            hideElement(this.calendarWeeks.dow);
          }
        }
      }

      // update days-of-week when locale, daysOfweekDisabled or weekStart is changed
      if (updateDOW) {
        Array.from(this.dow.children).forEach((el, index) => {
          const dow = (this.weekStart + index) % 7;
          el.textContent = this.dayNames[dow];
          el.className = this.daysOfWeekDisabled.includes(dow) ? 'dow disabled' : 'dow';
        });
      }
    }

    // Apply update on the focused date to view's settings
    updateFocus() {
      const viewDate = new Date(this.picker.viewDate);
      const viewYear = viewDate.getFullYear();
      const viewMonth = viewDate.getMonth();
      const firstOfMonth = dateValue(viewYear, viewMonth, 1);
      const start = dayOfTheWeekOf(firstOfMonth, this.weekStart, this.weekStart);

      this.first = firstOfMonth;
      this.last = dateValue(viewYear, viewMonth + 1, 0);
      this.start = start;
      this.focused = this.picker.viewDate;
    }

    // Apply update on the selected dates to view's settings
    updateSelection() {
      const {dates, rangepicker} = this.picker.datepicker;
      this.selected = dates;
      if (rangepicker) {
        this.range = rangepicker.dates;
      }
    }

     // Update the entire view UI
    render() {
      // update today marker on ever render
      this.today = this.todayHighlight ? today() : undefined;
      // refresh disabled dates on every render in order to clear the ones added
      // by beforeShow hook at previous render
      this.disabled = [...this.datesDisabled];

      const switchLabel = formatDate(this.focused, this.switchLabelFormat, this.locale);
      this.picker.setViewSwitchLabel(switchLabel);
      this.picker.setPrevBtnDisabled(this.first <= this.minDate);
      this.picker.setNextBtnDisabled(this.last >= this.maxDate);

      if (this.calendarWeeks) {
        // start of the UTC week (Monday) of the 1st of the month
        const startOfWeek = dayOfTheWeekOf(this.first, 1, 1);
        Array.from(this.calendarWeeks.weeks.children).forEach((el, index) => {
          el.textContent = getWeek(addWeeks(startOfWeek, index));
        });
      }
      Array.from(this.grid.children).forEach((el, index) => {
        const classList = el.classList;
        const current = addDays(this.start, index);
        const date = new Date(current);
        const day = date.getDay();

        el.className = `datepicker-cell ${this.cellClass}`;
        el.dataset.date = current;
        el.textContent = date.getDate();

        if (current < this.first) {
          classList.add('prev');
        } else if (current > this.last) {
          classList.add('next');
        }
        if (this.today === current) {
          classList.add('today');
        }
        if (current < this.minDate || current > this.maxDate || this.disabled.includes(current)) {
          classList.add('disabled');
        }
        if (this.daysOfWeekDisabled.includes(day)) {
          classList.add('disabled');
          pushUnique(this.disabled, current);
        }
        if (this.daysOfWeekHighlighted.includes(day)) {
          classList.add('highlighted');
        }
        if (this.range) {
          const [rangeStart, rangeEnd] = this.range;
          if (current > rangeStart && current < rangeEnd) {
            classList.add('range');
          }
          if (current === rangeStart) {
            classList.add('range-start');
          }
          if (current === rangeEnd) {
            classList.add('range-end');
          }
        }
        if (this.selected.includes(current)) {
          classList.add('selected');
        }
        if (current === this.focused) {
          classList.add('focused');
        }

        if (this.beforeShow) {
          this.performBeforeHook(el, current, current);
        }
      });
    }

    // Update the view UI by applying the changes of selected and focused items
    refresh() {
      const [rangeStart, rangeEnd] = this.range || [];
      this.grid
        .querySelectorAll('.range, .range-start, .range-end, .selected, .focused')
        .forEach((el) => {
          el.classList.remove('range', 'range-start', 'range-end', 'selected', 'focused');
        });
      Array.from(this.grid.children).forEach((el) => {
        const current = Number(el.dataset.date);
        const classList = el.classList;
        if (current > rangeStart && current < rangeEnd) {
          classList.add('range');
        }
        if (current === rangeStart) {
          classList.add('range-start');
        }
        if (current === rangeEnd) {
          classList.add('range-end');
        }
        if (this.selected.includes(current)) {
          classList.add('selected');
        }
        if (current === this.focused) {
          classList.add('focused');
        }
      });
    }

    // Update the view UI by applying the change of focused item
    refreshFocus() {
      const index = Math.round((this.focused - this.start) / 86400000);
      this.grid.querySelectorAll('.focused').forEach((el) => {
        el.classList.remove('focused');
      });
      this.grid.children[index].classList.add('focused');
    }
  }

  function computeMonthRange(range, thisYear) {
    if (!range || !range[0] || !range[1]) {
      return;
    }

    const [[startY, startM], [endY, endM]] = range;
    if (startY > thisYear || endY < thisYear) {
      return;
    }
    return [
      startY === thisYear ? startM : -1,
      endY === thisYear ? endM : 12,
    ];
  }

  class MonthsView extends View {
    constructor(picker) {
      super(picker, {
        id: 1,
        name: 'months',
        cellClass: 'month',
      });
    }

    init(options, onConstruction = true) {
      if (onConstruction) {
        this.grid = this.element;
        this.element.classList.add('months', 'datepicker-grid');
        this.grid.appendChild(parseHTML(createTagRepeat('span', 12, {'data-month': ix => ix})));
      }
      super.init(options);
    }

    setOptions(options) {
      if (options.locale) {
        this.monthNames = options.locale.monthsShort;
      }
      if (hasProperty(options, 'minDate')) {
        if (options.minDate === undefined) {
          this.minYear = this.minMonth = this.minDate = undefined;
        } else {
          const minDateObj = new Date(options.minDate);
          this.minYear = minDateObj.getFullYear();
          this.minMonth = minDateObj.getMonth();
          this.minDate = minDateObj.setDate(1);
        }
      }
      if (hasProperty(options, 'maxDate')) {
        if (options.maxDate === undefined) {
          this.maxYear = this.maxMonth = this.maxDate = undefined;
        } else {
          const maxDateObj = new Date(options.maxDate);
          this.maxYear = maxDateObj.getFullYear();
          this.maxMonth = maxDateObj.getMonth();
          this.maxDate = dateValue(this.maxYear, this.maxMonth + 1, 0);
        }
      }
      if (this.isMinView) {
        if (options.datesDisabled) {
          this.datesDisabled = options.datesDisabled;
        }
      } else {
        this.datesDisabled = [];
      }
      if (options.beforeShowMonth !== undefined) {
        this.beforeShow = typeof options.beforeShowMonth === 'function'
          ? options.beforeShowMonth
          : undefined;
      }
    }

    // Update view's settings to reflect the viewDate set on the picker
    updateFocus() {
      const viewDate = new Date(this.picker.viewDate);
      this.year = viewDate.getFullYear();
      this.focused = viewDate.getMonth();
    }

    // Update view's settings to reflect the selected dates
    updateSelection() {
      const {dates, rangepicker} = this.picker.datepicker;
      this.selected = dates.reduce((selected, timeValue) => {
        const date = new Date(timeValue);
        const year = date.getFullYear();
        const month = date.getMonth();
        if (selected[year] === undefined) {
          selected[year] = [month];
        } else {
          pushUnique(selected[year], month);
        }
        return selected;
      }, {});
      if (rangepicker && rangepicker.dates) {
        this.range = rangepicker.dates.map(timeValue => {
          const date = new Date(timeValue);
          return isNaN(date) ? undefined : [date.getFullYear(), date.getMonth()];
        });
      }
    }

    // Update the entire view UI
    render() {
      // refresh disabled months on every render in order to clear the ones added
      // by beforeShow hook at previous render
      // this.disabled = [...this.datesDisabled];
      this.disabled = this.datesDisabled.reduce((arr, disabled) => {
        const dt = new Date(disabled);
        if (this.year === dt.getFullYear()) {
          arr.push(dt.getMonth());
        }
        return arr;
      }, []);

      this.picker.setViewSwitchLabel(this.year);
      this.picker.setPrevBtnDisabled(this.year <= this.minYear);
      this.picker.setNextBtnDisabled(this.year >= this.maxYear);

      const selected = this.selected[this.year] || [];
      const yrOutOfRange = this.year < this.minYear || this.year > this.maxYear;
      const isMinYear = this.year === this.minYear;
      const isMaxYear = this.year === this.maxYear;
      const range = computeMonthRange(this.range, this.year);

      Array.from(this.grid.children).forEach((el, index) => {
        const classList = el.classList;
        const date = dateValue(this.year, index, 1);

        el.className = `datepicker-cell ${this.cellClass}`;
        if (this.isMinView) {
          el.dataset.date = date;
        }
        // reset text on every render to clear the custom content set
        // by beforeShow hook at previous render
        el.textContent = this.monthNames[index];

        if (
          yrOutOfRange
          || isMinYear && index < this.minMonth
          || isMaxYear && index > this.maxMonth
          || this.disabled.includes(index)
        ) {
          classList.add('disabled');
        }
        if (range) {
          const [rangeStart, rangeEnd] = range;
          if (index > rangeStart && index < rangeEnd) {
            classList.add('range');
          }
          if (index === rangeStart) {
            classList.add('range-start');
          }
          if (index === rangeEnd) {
            classList.add('range-end');
          }
        }
        if (selected.includes(index)) {
          classList.add('selected');
        }
        if (index === this.focused) {
          classList.add('focused');
        }

        if (this.beforeShow) {
          this.performBeforeHook(el, index, date);
        }
      });
    }

    // Update the view UI by applying the changes of selected and focused items
    refresh() {
      const selected = this.selected[this.year] || [];
      const [rangeStart, rangeEnd] = computeMonthRange(this.range, this.year) || [];
      this.grid
        .querySelectorAll('.range, .range-start, .range-end, .selected, .focused')
        .forEach((el) => {
          el.classList.remove('range', 'range-start', 'range-end', 'selected', 'focused');
        });
      Array.from(this.grid.children).forEach((el, index) => {
        const classList = el.classList;
        if (index > rangeStart && index < rangeEnd) {
          classList.add('range');
        }
        if (index === rangeStart) {
          classList.add('range-start');
        }
        if (index === rangeEnd) {
          classList.add('range-end');
        }
        if (selected.includes(index)) {
          classList.add('selected');
        }
        if (index === this.focused) {
          classList.add('focused');
        }
      });
    }

    // Update the view UI by applying the change of focused item
    refreshFocus() {
      this.grid.querySelectorAll('.focused').forEach((el) => {
        el.classList.remove('focused');
      });
      this.grid.children[this.focused].classList.add('focused');
    }
  }

  function toTitleCase(word) {
    return [...word].reduce((str, ch, ix) => str += ix ? ch : ch.toUpperCase(), '');
  }

  // Class representing the years and decades view elements
  class YearsView extends View {
    constructor(picker, config) {
      super(picker, config);
    }

    init(options, onConstruction = true) {
      if (onConstruction) {
        this.navStep = this.step * 10;
        this.beforeShowOption = `beforeShow${toTitleCase(this.cellClass)}`;
        this.grid = this.element;
        this.element.classList.add(this.name, 'datepicker-grid');
        this.grid.appendChild(parseHTML(createTagRepeat('span', 12)));
      }
      super.init(options);
    }

    setOptions(options) {
      if (hasProperty(options, 'minDate')) {
        if (options.minDate === undefined) {
          this.minYear = this.minDate = undefined;
        } else {
          this.minYear = startOfYearPeriod(options.minDate, this.step);
          this.minDate = dateValue(this.minYear, 0, 1);
        }
      }
      if (hasProperty(options, 'maxDate')) {
        if (options.maxDate === undefined) {
          this.maxYear = this.maxDate = undefined;
        } else {
          this.maxYear = startOfYearPeriod(options.maxDate, this.step);
          this.maxDate = dateValue(this.maxYear, 11, 31);
        }
      }
      if (this.isMinView) {
        if (options.datesDisabled) {
          this.datesDisabled = options.datesDisabled;
        }
      } else {
        this.datesDisabled = [];
      }
      if (options[this.beforeShowOption] !== undefined) {
        const beforeShow = options[this.beforeShowOption];
        this.beforeShow = typeof beforeShow === 'function' ? beforeShow : undefined;
      }
    }

    // Update view's settings to reflect the viewDate set on the picker
    updateFocus() {
      const viewDate = new Date(this.picker.viewDate);
      const first = startOfYearPeriod(viewDate, this.navStep);
      const last = first + 9 * this.step;

      this.first = first;
      this.last = last;
      this.start = first - this.step;
      this.focused = startOfYearPeriod(viewDate, this.step);
    }

    // Update view's settings to reflect the selected dates
    updateSelection() {
      const {dates, rangepicker} = this.picker.datepicker;
      this.selected = dates.reduce((years, timeValue) => {
        return pushUnique(years, startOfYearPeriod(timeValue, this.step));
      }, []);
      if (rangepicker && rangepicker.dates) {
        this.range = rangepicker.dates.map(timeValue => {
          if (timeValue !== undefined) {
            return startOfYearPeriod(timeValue, this.step);
          }
        });
      }
    }

    // Update the entire view UI
    render() {
      // refresh disabled years on every render in order to clear the ones added
      // by beforeShow hook at previous render
      // this.disabled = [...this.datesDisabled];
      this.disabled = this.datesDisabled.map(disabled => new Date(disabled).getFullYear());

      this.picker.setViewSwitchLabel(`${this.first}-${this.last}`);
      this.picker.setPrevBtnDisabled(this.first <= this.minYear);
      this.picker.setNextBtnDisabled(this.last >= this.maxYear);

      Array.from(this.grid.children).forEach((el, index) => {
        const classList = el.classList;
        const current = this.start + (index * this.step);
        const date = dateValue(current, 0, 1);

        el.className = `datepicker-cell ${this.cellClass}`;
        if (this.isMinView) {
          el.dataset.date = date;
        }
        el.textContent = el.dataset.year = current;

        if (index === 0) {
          classList.add('prev');
        } else if (index === 11) {
          classList.add('next');
        }
        if (current < this.minYear || current > this.maxYear || this.disabled.includes(current)) {
          classList.add('disabled');
        }
        if (this.range) {
          const [rangeStart, rangeEnd] = this.range;
          if (current > rangeStart && current < rangeEnd) {
            classList.add('range');
          }
          if (current === rangeStart) {
            classList.add('range-start');
          }
          if (current === rangeEnd) {
            classList.add('range-end');
          }
        }
        if (this.selected.includes(current)) {
          classList.add('selected');
        }
        if (current === this.focused) {
          classList.add('focused');
        }

        if (this.beforeShow) {
          this.performBeforeHook(el, current, date);
        }
      });
    }

    // Update the view UI by applying the changes of selected and focused items
    refresh() {
      const [rangeStart, rangeEnd] = this.range || [];
      this.grid
        .querySelectorAll('.range, .range-start, .range-end, .selected, .focused')
        .forEach((el) => {
          el.classList.remove('range', 'range-start', 'range-end', 'selected', 'focused');
        });
      Array.from(this.grid.children).forEach((el) => {
        const current = Number(el.textContent);
        const classList = el.classList;
        if (current > rangeStart && current < rangeEnd) {
          classList.add('range');
        }
        if (current === rangeStart) {
          classList.add('range-start');
        }
        if (current === rangeEnd) {
          classList.add('range-end');
        }
        if (this.selected.includes(current)) {
          classList.add('selected');
        }
        if (current === this.focused) {
          classList.add('focused');
        }
      });
    }

    // Update the view UI by applying the change of focused item
    refreshFocus() {
      const index = Math.round((this.focused - this.start) / this.step);
      this.grid.querySelectorAll('.focused').forEach((el) => {
        el.classList.remove('focused');
      });
      this.grid.children[index].classList.add('focused');
    }
  }

  function triggerDatepickerEvent(datepicker, type) {
    const detail = {
      date: datepicker.getDate(),
      viewDate: new Date(datepicker.picker.viewDate),
      viewId: datepicker.picker.currentView.id,
      datepicker,
    };
    datepicker.element.dispatchEvent(new CustomEvent(type, {detail}));
  }

  // direction: -1 (to previous), 1 (to next)
  function goToPrevOrNext(datepicker, direction) {
    const {minDate, maxDate} = datepicker.config;
    const {currentView, viewDate} = datepicker.picker;
    let newViewDate;
    switch (currentView.id) {
      case 0:
        newViewDate = addMonths(viewDate, direction);
        break;
      case 1:
        newViewDate = addYears(viewDate, direction);
        break;
      default:
        newViewDate = addYears(viewDate, direction * currentView.navStep);
    }
    newViewDate = limitToRange(newViewDate, minDate, maxDate);
    datepicker.picker.changeFocus(newViewDate).render();
  }

  function switchView(datepicker) {
    const viewId = datepicker.picker.currentView.id;
    if (viewId === datepicker.config.maxView) {
      return;
    }
    datepicker.picker.changeView(viewId + 1).render();
  }

  function unfocus(datepicker) {
    if (datepicker.config.updateOnBlur) {
      datepicker.update({revert: true});
    } else {
      datepicker.refresh('input');
    }
    datepicker.hide();
  }

  function goToSelectedMonthOrYear(datepicker, selection) {
    const picker = datepicker.picker;
    const viewDate = new Date(picker.viewDate);
    const viewId = picker.currentView.id;
    const newDate = viewId === 1
      ? addMonths(viewDate, selection - viewDate.getMonth())
      : addYears(viewDate, selection - viewDate.getFullYear());

    picker.changeFocus(newDate).changeView(viewId - 1).render();
  }

  function onClickTodayBtn(datepicker) {
    const picker = datepicker.picker;
    const currentDate = today();
    if (datepicker.config.todayBtnMode === 1) {
      if (datepicker.config.autohide) {
        datepicker.setDate(currentDate);
        return;
      }
      datepicker.setDate(currentDate, {render: false});
      picker.update();
    }
    if (picker.viewDate !== currentDate) {
      picker.changeFocus(currentDate);
    }
    picker.changeView(0).render();
  }

  function onClickClearBtn(datepicker) {
    datepicker.setDate({clear: true});
  }

  function onClickViewSwitch(datepicker) {
    switchView(datepicker);
  }

  function onClickPrevBtn(datepicker) {
    goToPrevOrNext(datepicker, -1);
  }

  function onClickNextBtn(datepicker) {
    goToPrevOrNext(datepicker, 1);
  }

  // For the picker's main block to delegete the events from `datepicker-cell`s
  function onClickView(datepicker, ev) {
    const target = findElementInEventPath(ev, '.datepicker-cell');
    if (!target || target.classList.contains('disabled')) {
      return;
    }

    const {id, isMinView} = datepicker.picker.currentView;
    if (isMinView) {
      datepicker.setDate(Number(target.dataset.date));
    } else if (id === 1) {
      goToSelectedMonthOrYear(datepicker, Number(target.dataset.month));
    } else {
      goToSelectedMonthOrYear(datepicker, Number(target.dataset.year));
    }
  }

  function onMousedownPicker(ev) {
    ev.preventDefault();
  }

  const orientClasses = ['left', 'top', 'right', 'bottom'].reduce((obj, key) => {
    obj[key] = `datepicker-orient-${key}`;
    return obj;
  }, {});
  const toPx = num => num ? `${num}px` : num;

  function processPickerOptions(picker, options) {
    if (options.title !== undefined) {
      if (options.title) {
        picker.controls.title.textContent = options.title;
        showElement(picker.controls.title);
      } else {
        picker.controls.title.textContent = '';
        hideElement(picker.controls.title);
      }
    }
    if (options.prevArrow) {
      const prevBtn = picker.controls.prevBtn;
      emptyChildNodes(prevBtn);
      options.prevArrow.forEach((node) => {
        prevBtn.appendChild(node.cloneNode(true));
      });
    }
    if (options.nextArrow) {
      const nextBtn = picker.controls.nextBtn;
      emptyChildNodes(nextBtn);
      options.nextArrow.forEach((node) => {
        nextBtn.appendChild(node.cloneNode(true));
      });
    }
    if (options.locale) {
      picker.controls.todayBtn.textContent = options.locale.today;
      picker.controls.clearBtn.textContent = options.locale.clear;
    }
    if (options.todayBtn !== undefined) {
      if (options.todayBtn) {
        showElement(picker.controls.todayBtn);
      } else {
        hideElement(picker.controls.todayBtn);
      }
    }
    if (hasProperty(options, 'minDate') || hasProperty(options, 'maxDate')) {
      const {minDate, maxDate} = picker.datepicker.config;
      picker.controls.todayBtn.disabled = !isInRange(today(), minDate, maxDate);
    }
    if (options.clearBtn !== undefined) {
      if (options.clearBtn) {
        showElement(picker.controls.clearBtn);
      } else {
        hideElement(picker.controls.clearBtn);
      }
    }
  }

  // Compute view date to reset, which will be...
  // - the last item of the selected dates or defaultViewDate if no selection
  // - limitted to minDate or maxDate if it exceeds the range
  function computeResetViewDate(datepicker) {
    const {dates, config} = datepicker;
    const viewDate = dates.length > 0 ? lastItemOf(dates) : config.defaultViewDate;
    return limitToRange(viewDate, config.minDate, config.maxDate);
  }

  // Change current view's view date
  function setViewDate(picker, newDate) {
    const oldViewDate = new Date(picker.viewDate);
    const newViewDate = new Date(newDate);
    const {id, year, first, last} = picker.currentView;
    const viewYear = newViewDate.getFullYear();

    picker.viewDate = newDate;
    if (viewYear !== oldViewDate.getFullYear()) {
      triggerDatepickerEvent(picker.datepicker, 'changeYear');
    }
    if (newViewDate.getMonth() !== oldViewDate.getMonth()) {
      triggerDatepickerEvent(picker.datepicker, 'changeMonth');
    }

    // return whether the new date is in different period on time from the one
    // displayed in the current view
    // when true, the view needs to be re-rendered on the next UI refresh.
    switch (id) {
      case 0:
        return newDate < first || newDate > last;
      case 1:
        return viewYear !== year;
      default:
        return viewYear < first || viewYear > last;
    }
  }

  function getTextDirection(el) {
    return window.getComputedStyle(el).direction;
  }

  // find the closet scrollable ancestor elemnt under the body
  function findScrollParents(el) {
    const parent = getParent(el);
    if (parent === document.body || !parent) {
      return;
    }

    // checking overflow only is enough because computed overflow cannot be
    // visible or a combination of visible and other when either axis is set
    // to other than visible.
    // (Setting one axis to other than 'visible' while the other is 'visible'
    // results in the other axis turning to 'auto')
    return window.getComputedStyle(parent).overflow !== 'visible'
      ? parent
      : findScrollParents(parent);
  }

  // Class representing the picker UI
  class Picker {
    constructor(datepicker) {
      const {config} = this.datepicker = datepicker;

      const template = pickerTemplate.replace(/%buttonClass%/g, config.buttonClass);
      const element = this.element = parseHTML(template).firstChild;
      const [header, main, footer] = element.firstChild.children;
      const title = header.firstElementChild;
      const [prevBtn, viewSwitch, nextBtn] = header.lastElementChild.children;
      const [todayBtn, clearBtn] = footer.firstChild.children;
      const controls = {
        title,
        prevBtn,
        viewSwitch,
        nextBtn,
        todayBtn,
        clearBtn,
      };
      this.main = main;
      this.controls = controls;

      const elementClass = datepicker.inline ? 'inline' : 'dropdown';
      element.classList.add(`datepicker-${elementClass}`);

      processPickerOptions(this, config);
      this.viewDate = computeResetViewDate(datepicker);

      // set up event listeners
      registerListeners(datepicker, [
        [element, 'mousedown', onMousedownPicker],
        [main, 'click', onClickView.bind(null, datepicker)],
        [controls.viewSwitch, 'click', onClickViewSwitch.bind(null, datepicker)],
        [controls.prevBtn, 'click', onClickPrevBtn.bind(null, datepicker)],
        [controls.nextBtn, 'click', onClickNextBtn.bind(null, datepicker)],
        [controls.todayBtn, 'click', onClickTodayBtn.bind(null, datepicker)],
        [controls.clearBtn, 'click', onClickClearBtn.bind(null, datepicker)],
      ]);

      // set up views
      this.views = [
        new DaysView(this),
        new MonthsView(this),
        new YearsView(this, {id: 2, name: 'years', cellClass: 'year', step: 1}),
        new YearsView(this, {id: 3, name: 'decades', cellClass: 'decade', step: 10}),
      ];
      this.currentView = this.views[config.startView];

      this.currentView.render();
      this.main.appendChild(this.currentView.element);
      if (config.container) {
        config.container.appendChild(this.element);
      } else {
        datepicker.inputField.after(this.element);
      }
    }

    setOptions(options) {
      processPickerOptions(this, options);
      this.views.forEach((view) => {
        view.init(options, false);
      });
      this.currentView.render();
    }

    detach() {
      this.element.remove();
    }

    show() {
      if (this.active) {
        return;
      }

      const {datepicker, element} = this;
      if (datepicker.inline) {
        element.classList.add('active');
      } else {
        // ensure picker's direction matches input's
        const inputDirection = getTextDirection(datepicker.inputField);
        if (inputDirection !== getTextDirection(getParent(element))) {
          element.dir = inputDirection;
        } else if (element.dir) {
          element.removeAttribute('dir');
        }

        element.style.visiblity = 'hidden';
        element.classList.add('active');
        this.place();
        element.style.visiblity = '';

        if (datepicker.config.disableTouchKeyboard) {
          datepicker.inputField.blur();
        }
      }
      this.active = true;
      triggerDatepickerEvent(datepicker, 'show');
    }

    hide() {
      if (!this.active) {
        return;
      }
      this.datepicker.exitEditMode();
      this.element.classList.remove('active');
      this.active = false;
      triggerDatepickerEvent(this.datepicker, 'hide');
    }

    place() {
      const {classList, offsetParent, style} = this.element;
      const {config, inputField} = this.datepicker;
      const {
        width: calendarWidth,
        height: calendarHeight,
      } = this.element.getBoundingClientRect();
      const {
        left: inputLeft,
        top: inputTop,
        right: inputRight,
        bottom: inputBottom,
        width: inputWidth,
        height: inputHeight
      } = inputField.getBoundingClientRect();
      let {x: orientX, y: orientY} = config.orientation;
      let left = inputLeft;
      let top = inputTop;

      // caliculate offsetLeft/Top of inputField
      if (offsetParent === document.body || !offsetParent) {
        left += window.scrollX;
        top += window.scrollY;
      } else {
        const offsetParentRect = offsetParent.getBoundingClientRect();
        left -= offsetParentRect.left - offsetParent.scrollLeft;
        top -= offsetParentRect.top - offsetParent.scrollTop;
      }

      // caliculate the boundaries of the visible area that contains inputField
      const scrollParent = findScrollParents(inputField);
      let scrollAreaLeft = 0;
      let scrollAreaTop = 0;
      let {
        clientWidth: scrollAreaRight,
        clientHeight: scrollAreaBottom,
      } = document.documentElement;

      if (scrollParent) {
        const scrollParentRect = scrollParent.getBoundingClientRect();
        if (scrollParentRect.top > 0) {
          scrollAreaTop = scrollParentRect.top;
        }
        if (scrollParentRect.left > 0) {
          scrollAreaLeft = scrollParentRect.left;
        }
        if (scrollParentRect.right < scrollAreaRight) {
          scrollAreaRight = scrollParentRect.right;
        }
        if (scrollParentRect.bottom < scrollAreaBottom) {
          scrollAreaBottom = scrollParentRect.bottom;
        }
      }

      // determine the horizontal orientation and left position
      let adjustment = 0;
      if (orientX === 'auto') {
        if (inputLeft < scrollAreaLeft) {
          orientX = 'left';
          adjustment = scrollAreaLeft - inputLeft;
        } else if (inputLeft + calendarWidth > scrollAreaRight) {
          orientX = 'right';
          if (scrollAreaRight < inputRight) {
            adjustment = scrollAreaRight - inputRight;
          }
        } else if (getTextDirection(inputField) === 'rtl') {
          orientX = inputRight - calendarWidth < scrollAreaLeft ? 'left' : 'right';
        } else {
          orientX = 'left';
        }
      }
      if (orientX === 'right') {
        left += inputWidth - calendarWidth;
      }
      left += adjustment;

      // determine the vertical orientation and top position
      if (orientY === 'auto') {
        if (inputTop - calendarHeight > scrollAreaTop) {
          orientY = inputBottom + calendarHeight > scrollAreaBottom ? 'top' : 'bottom';
        } else {
          orientY = 'bottom';
        }
      }
      if (orientY === 'top') {
        top -= calendarHeight;
      } else {
        top += inputHeight;
      }

      classList.remove(...Object.values(orientClasses));
      classList.add(orientClasses[orientX], orientClasses[orientY]);

      style.left = toPx(left);
      style.top = toPx(top);
    }

    setViewSwitchLabel(labelText) {
      this.controls.viewSwitch.textContent = labelText;
    }

    setPrevBtnDisabled(disabled) {
      this.controls.prevBtn.disabled = disabled;
    }

    setNextBtnDisabled(disabled) {
      this.controls.nextBtn.disabled = disabled;
    }

    changeView(viewId) {
      const oldView = this.currentView;
      const newView =  this.views[viewId];
      if (newView.id !== oldView.id) {
        this.currentView = newView;
        this._renderMethod = 'render';
        triggerDatepickerEvent(this.datepicker, 'changeView');
        this.main.replaceChild(newView.element, oldView.element);
      }
      return this;
    }

    // Change the focused date (view date)
    changeFocus(newViewDate) {
      this._renderMethod = setViewDate(this, newViewDate) ? 'render' : 'refreshFocus';
      this.views.forEach((view) => {
        view.updateFocus();
      });
      return this;
    }

    // Apply the change of the selected dates
    update() {
      const newViewDate = computeResetViewDate(this.datepicker);
      this._renderMethod = setViewDate(this, newViewDate) ? 'render' : 'refresh';
      this.views.forEach((view) => {
        view.updateFocus();
        view.updateSelection();
      });
      return this;
    }

    // Refresh the picker UI
    render(quickRender = true) {
      const renderMethod = (quickRender && this._renderMethod) || 'render';
      delete this._renderMethod;

      this.currentView[renderMethod]();
    }
  }

  // Find the closest date that doesn't meet the condition for unavailable date
  // Returns undefined if no available date is found
  // addFn: function to calculate the next date
  //   - args: time value, amount
  // increase: amount to pass to addFn
  // testFn: function to test the unavailablity of the date
  //   - args: time value; retun: true if unavailable
  function findNextAvailableOne(date, addFn, increase, testFn, min, max) {
    if (!isInRange(date, min, max)) {
      return;
    }
    if (testFn(date)) {
      const newDate = addFn(date, increase);
      return findNextAvailableOne(newDate, addFn, increase, testFn, min, max);
    }
    return date;
  }

  // direction: -1 (left/up), 1 (right/down)
  // vertical: true for up/down, false for left/right
  function moveByArrowKey(datepicker, ev, direction, vertical) {
    const picker = datepicker.picker;
    const currentView = picker.currentView;
    const step = currentView.step || 1;
    let viewDate = picker.viewDate;
    let addFn;
    let testFn;
    switch (currentView.id) {
      case 0:
        if (vertical) {
          viewDate = addDays(viewDate, direction * 7);
        } else if (ev.ctrlKey || ev.metaKey) {
          viewDate = addYears(viewDate, direction);
        } else {
          viewDate = addDays(viewDate, direction);
        }
        addFn = addDays;
        testFn = (date) => currentView.disabled.includes(date);
        break;
      case 1:
        viewDate = addMonths(viewDate, vertical ? direction * 4 : direction);
        addFn = addMonths;
        testFn = (date) => {
          const dt = new Date(date);
          const {year, disabled} = currentView;
          return dt.getFullYear() === year && disabled.includes(dt.getMonth());
        };
        break;
      default:
        viewDate = addYears(viewDate, direction * (vertical ? 4 : 1) * step);
        addFn = addYears;
        testFn = date => currentView.disabled.includes(startOfYearPeriod(date, step));
    }
    viewDate = findNextAvailableOne(
      viewDate,
      addFn,
      direction < 0 ? -step : step,
      testFn,
      currentView.minDate,
      currentView.maxDate
    );
    if (viewDate !== undefined) {
      picker.changeFocus(viewDate).render();
    }
  }

  function onKeydown(datepicker, ev) {
    const key = ev.key;
    if (key === 'Tab') {
      unfocus(datepicker);
      return;
    }

    const picker = datepicker.picker;
    const {id, isMinView} = picker.currentView;
    if (!picker.active) {
      if (key === 'ArrowDown') {
        picker.show();
      } else {
        if (key === 'Enter') {
          datepicker.update();
        } else if (key === 'Escape') {
          picker.show();
        }
        return;
      }
    } else if (datepicker.editMode) {
      if (key === 'Enter') {
        datepicker.exitEditMode({update: true, autohide: datepicker.config.autohide});
      } else if (key === 'Escape') {
        picker.hide();
      }
      return;
    } else {
      if (key === 'ArrowLeft') {
        if (ev.ctrlKey || ev.metaKey) {
          goToPrevOrNext(datepicker, -1);
        } else if (ev.shiftKey) {
          datepicker.enterEditMode();
          return;
        } else {
          moveByArrowKey(datepicker, ev, -1, false);
        }
      } else if (key === 'ArrowRight') {
        if (ev.ctrlKey || ev.metaKey) {
          goToPrevOrNext(datepicker, 1);
        } else if (ev.shiftKey) {
          datepicker.enterEditMode();
          return;
        } else {
          moveByArrowKey(datepicker, ev, 1, false);
        }
      } else if (key === 'ArrowUp') {
        if (ev.ctrlKey || ev.metaKey) {
          switchView(datepicker);
        } else if (ev.shiftKey) {
          datepicker.enterEditMode();
          return;
        } else {
          moveByArrowKey(datepicker, ev, -1, true);
        }
      } else if (key === 'ArrowDown') {
        if (ev.shiftKey && !ev.ctrlKey && !ev.metaKey) {
          datepicker.enterEditMode();
          return;
        }
        moveByArrowKey(datepicker, ev, 1, true);
      } else if (key === 'Enter') {
        if (isMinView) {
          datepicker.setDate(picker.viewDate);
          return;
        }
        picker.changeView(id - 1).render();
      } else {
        if (key === 'Escape') {
          picker.hide();
        } else if (
          key === 'Backspace'
          || key === 'Delete'
          || (key.length === 1 && !ev.ctrlKey && !ev.metaKey)
        ) {
          datepicker.enterEditMode();
        }
        return;
      }
    }
    ev.preventDefault();
  }

  function onFocus(datepicker) {
    if (datepicker.config.showOnFocus && !datepicker._showing) {
      datepicker.show();
    }
  }

  // for the prevention for entering edit mode while getting focus on click
  function onMousedown(datepicker, ev) {
    const el = ev.target;
    if (datepicker.picker.active || datepicker.config.showOnClick) {
      el._active = isActiveElement(el);
      el._clicking = setTimeout(() => {
        delete el._active;
        delete el._clicking;
      }, 2000);
    }
  }

  function onClickInput(datepicker, ev) {
    const el = ev.target;
    if (!el._clicking) {
      return;
    }
    clearTimeout(el._clicking);
    delete el._clicking;

    if (el._active) {
      datepicker.enterEditMode();
    }
    delete el._active;

    if (datepicker.config.showOnClick) {
      datepicker.show();
    }
  }

  function onPaste(datepicker, ev) {
    if (ev.clipboardData.types.includes('text/plain')) {
      datepicker.enterEditMode();
    }
  }

  // for the `document` to delegate the events from outside the picker/input field
  function onClickOutside(datepicker, ev) {
    const {element, picker} = datepicker;
    // check both picker's and input's activeness to make updateOnBlur work in
    // the cases where...
    // - picker is hidden by ESC key press → input stays focused
    // - input is unfocused by closing mobile keyboard → piker is kept shown
    if (!picker.active && !isActiveElement(element)) {
      return;
    }
    const pickerElem = picker.element;
    if (findElementInEventPath(ev, el => el === element || el === pickerElem)) {
      return;
    }
    unfocus(datepicker);
  }

  function stringifyDates(dates, config) {
    return dates
      .map(dt => formatDate(dt, config.format, config.locale))
      .join(config.dateDelimiter);
  }

  // parse input dates and create an array of time values for selection
  // returns undefined if there are no valid dates in inputDates
  // when origDates (current selection) is passed, the function works to mix
  // the input dates into the current selection
  function processInputDates(datepicker, inputDates, clear = false) {
    // const {config, dates: origDates, rangepicker} = datepicker;
    const {config, dates: origDates, rangeSideIndex} = datepicker;
    if (inputDates.length === 0) {
      // empty input is considered valid unless origiDates is passed
      return clear ? [] : undefined;
    }

    // const rangeEnd = rangepicker && datepicker === rangepicker.datepickers[1];
    let newDates = inputDates.reduce((dates, dt) => {
      let date = parseDate(dt, config.format, config.locale);
      if (date === undefined) {
        return dates;
      }
      // adjust to 1st of the month/Jan 1st of the year
      // or to the last day of the monh/Dec 31st of the year if the datepicker
      // is the range-end picker of a rangepicker
      date = regularizeDate(date, config.pickLevel, rangeSideIndex);
      if (
        isInRange(date, config.minDate, config.maxDate)
        && !dates.includes(date)
        && !config.datesDisabled.includes(date)
        && (config.pickLevel > 0 || !config.daysOfWeekDisabled.includes(new Date(date).getDay()))
      ) {
        dates.push(date);
      }
      return dates;
    }, []);
    if (newDates.length === 0) {
      return;
    }
    if (config.multidate && !clear) {
      // get the synmetric difference between origDates and newDates
      newDates = newDates.reduce((dates, date) => {
        if (!origDates.includes(date)) {
          dates.push(date);
        }
        return dates;
      }, origDates.filter(date => !newDates.includes(date)));
    }
    // do length check always because user can input multiple dates regardless of the mode
    return config.maxNumberOfDates && newDates.length > config.maxNumberOfDates
      ? newDates.slice(config.maxNumberOfDates * -1)
      : newDates;
  }

  // refresh the UI elements
  // modes: 1: input only, 2, picker only, 3 both
  function refreshUI(datepicker, mode = 3, quickRender = true) {
    const {config, picker, inputField} = datepicker;
    if (mode & 2) {
      const newView = picker.active ? config.pickLevel : config.startView;
      picker.update().changeView(newView).render(quickRender);
      removeInputInlineErrorMessage(datepicker);
    }
    if (mode & 1 && inputField) {
      inputField.value = stringifyDates(datepicker.dates, config);
    }
  }

  function setDate(datepicker, inputDates, options) {
    let {clear, render, autohide, revert} = options;
    if (render === undefined) {
      render = true;
    }
    if (!render) {
      autohide = false;
    } else if (autohide === undefined) {
      autohide = datepicker.config.autohide;
    }

    const newDates = processInputDates(datepicker, inputDates, clear);
    if (!newDates && !revert) {
      return;
    }
    if (newDates && newDates.toString() !== datepicker.dates.toString()) {
      datepicker.dates = newDates;
      refreshUI(datepicker, render ? 3 : 1);
      triggerDatepickerEvent(datepicker, 'changeDate');
    } else {
      refreshUI(datepicker, 1);
    }

    if (autohide) {
      datepicker.hide();
    }
  }

  /**
   * Class representing a date picker
   */
  class Datepicker {
    /**
     * Create a date picker
     * @param  {Element} element - element to bind a date picker
     * @param  {Object} [options] - config options
     * @param  {DateRangePicker} [rangepicker] - DateRangePicker instance the
     * date picker belongs to. Use this only when creating date picker as a part
     * of date range picker
     */
    constructor(element, options = {}, rangepicker = undefined) {
      element.datepicker = this;
      this.element = element;

      const config = this.config = Object.assign({
        buttonClass: (options.buttonClass && String(options.buttonClass)) || 'button',
        container: null,
        defaultViewDate: today(),
        maxDate: undefined,
        minDate: undefined,
      }, processOptions(defaultOptions, this));
      // configure by type
      const inline = this.inline = element.tagName !== 'INPUT';
      let inputField;
      if (inline) {
        config.container = element;
      } else {
        if (options.container) {
          // omit string type check because it doesn't guarantee to avoid errors
          // (invalid selector string causes abend with sytax error)
          config.container = options.container instanceof HTMLElement
            ? options.container
            : document.querySelector(options.container);
        }
        inputField = this.inputField = element;
        inputField.classList.add('datepicker-input');
      }
      if (rangepicker) {
        // check validiry
        const index = rangepicker.inputs.indexOf(inputField);
        const datepickers = rangepicker.datepickers;
        if (index < 0 || index > 1 || !Array.isArray(datepickers)) {
          throw Error('Invalid rangepicker object.');
        }
        // attach itaelf to the rangepicker here so that processInputDates() can
        // determine if this is the range-end picker of the rangepicker while
        // setting inital values when pickLevel > 0
        datepickers[index] = this;
        // add getter for rangepicker
        Object.defineProperty(this, 'rangepicker', {
          get() {
            return rangepicker;
          },
        });
        Object.defineProperty(this, 'rangeSideIndex', {
          get() {
            return index;
          },
        });
      }

      // set up config
      this._options = options;
      Object.assign(config, processOptions(options, this));

      // set initial dates
      let initialDates;
      if (inline) {
        initialDates = stringToArray(element.dataset.date, config.dateDelimiter);
        delete element.dataset.date;
      } else {
        initialDates = stringToArray(inputField.value, config.dateDelimiter);
      }
      this.dates = [];
      // process initial value
      const inputDateValues = processInputDates(this, initialDates);
      if (inputDateValues && inputDateValues.length > 0) {
        this.dates = inputDateValues;
      }
      if (inputField) {
        inputField.value = stringifyDates(this.dates, config);
      }

      const picker = this.picker = new Picker(this);

      if (inline) {
        this.show();
      } else {
        // set up event listeners in other modes
        const onMousedownDocument = onClickOutside.bind(null, this);
        const listeners = [
          [inputField, 'keydown', onKeydown.bind(null, this)],
          [inputField, 'focus', onFocus.bind(null, this)],
          [inputField, 'mousedown', onMousedown.bind(null, this)],
          [inputField, 'click', onClickInput.bind(null, this)],
          [inputField, 'paste', onPaste.bind(null, this)],
          [document, 'mousedown', onMousedownDocument],
          [document, 'touchstart', onMousedownDocument],
          [window, 'resize', picker.place.bind(picker)]
        ];
        registerListeners(this, listeners);
      }
    }

    /**
     * Format Date object or time value in given format and language
     * @param  {Date|Number} date - date or time value to format
     * @param  {String|Object} format - format string or object that contains
     * toDisplay() custom formatter, whose signature is
     * - args:
     *   - date: {Date} - Date instance of the date passed to the method
     *   - format: {Object} - the format object passed to the method
     *   - locale: {Object} - locale for the language specified by `lang`
     * - return:
     *     {String} formatted date
     * @param  {String} [lang=en] - language code for the locale to use
     * @return {String} formatted date
     */
    static formatDate(date, format, lang) {
      return formatDate(date, format, lang && locales[lang] || locales.en);
    }

    /**
     * Parse date string
     * @param  {String|Date|Number} dateStr - date string, Date object or time
     * value to parse
     * @param  {String|Object} format - format string or object that contains
     * toValue() custom parser, whose signature is
     * - args:
     *   - dateStr: {String|Date|Number} - the dateStr passed to the method
     *   - format: {Object} - the format object passed to the method
     *   - locale: {Object} - locale for the language specified by `lang`
     * - return:
     *     {Date|Number} parsed date or its time value
     * @param  {String} [lang=en] - language code for the locale to use
     * @return {Number} time value of parsed date
     */
    static parseDate(dateStr, format, lang) {
      return parseDate(dateStr, format, lang && locales[lang] || locales.en);
    }

    /**
     * @type {Object} - Installed locales in `[languageCode]: localeObject` format
     * en`:_English (US)_ is pre-installed.
     */
    static get locales() {
      return locales;
    }

    /**
     * @type {Boolean} - Whether the picker element is shown. `true` whne shown
     */
    get active() {
      return !!(this.picker && this.picker.active);
    }

    /**
     * @type {HTMLDivElement} - DOM object of picker element
     */
    get pickerElement() {
      return this.picker ? this.picker.element : undefined;
    }

    /**
     * Set new values to the config options
     * @param {Object} options - config options to update
     */
    setOptions(options) {
      const picker = this.picker;
      const newOptions = processOptions(options, this);
      Object.assign(this._options, options);
      Object.assign(this.config, newOptions);
      picker.setOptions(newOptions);

      refreshUI(this, 3);
    }

    /**
     * Show the picker element
     */
    show() {
      if (this.inputField) {
        if (this.inputField.disabled) {
          return;
        }
        if (!isActiveElement(this.inputField) && !this.config.disableTouchKeyboard) {
          this._showing = true;
          this.inputField.focus();
          delete this._showing;
        }
      }
      this.picker.show();
    }

    /**
     * Hide the picker element
     * Not available on inline picker
     */
    hide() {
      if (this.inline) {
        return;
      }
      this.picker.hide();
      this.picker.update().changeView(this.config.startView).render();
    }

    /**
     * Destroy the Datepicker instance
     * @return {Detepicker} - the instance destroyed
     */
    destroy() {
      this.hide();
      unregisterListeners(this);
      this.picker.detach();
      if (!this.inline) {
        this.inputField.classList.remove('datepicker-input');
      }
      delete this.element.datepicker;
      return this;
    }

    /**
     * Get the selected date(s)
     *
     * The method returns a Date object of selected date by default, and returns
     * an array of selected dates in multidate mode. If format string is passed,
     * it returns date string(s) formatted in given format.
     *
     * @param  {String} [format] - Format string to stringify the date(s)
     * @return {Date|String|Date[]|String[]} - selected date(s), or if none is
     * selected, empty array in multidate mode and untitled in sigledate mode
     */
    getDate(format = undefined) {
      const callback = format
        ? date => formatDate(date, format, this.config.locale)
        : date => new Date(date);

      if (this.config.multidate) {
        return this.dates.map(callback);
      }
      if (this.dates.length > 0) {
        return callback(this.dates[0]);
      }
    }

    /**
     * Set selected date(s)
     *
     * In multidate mode, you can pass multiple dates as a series of arguments
     * or an array. (Since each date is parsed individually, the type of the
     * dates doesn't have to be the same.)
     * The given dates are used to toggle the select status of each date. The
     * number of selected dates is kept from exceeding the length set to
     * maxNumberOfDates.
     *
     * With clear: true option, the method can be used to clear the selection
     * and to replace the selection instead of toggling in multidate mode.
     * If the option is passed with no date arguments or an empty dates array,
     * it works as "clear" (clear the selection then set nothing), and if the
     * option is passed with new dates to select, it works as "replace" (clear
     * the selection then set the given dates)
     *
     * When render: false option is used, the method omits re-rendering the
     * picker element. In this case, you need to call refresh() method later in
     * order for the picker element to reflect the changes. The input field is
     * refreshed always regardless of this option.
     *
     * When invalid (unparsable, repeated, disabled or out-of-range) dates are
     * passed, the method ignores them and applies only valid ones. In the case
     * that all the given dates are invalid, which is distinguished from passing
     * no dates, the method considers it as an error and leaves the selection
     * untouched. (The input field also remains untouched unless revert: true
     * option is used.)
     *
     * @param {...(Date|Number|String)|Array} [dates] - Date strings, Date
     * objects, time values or mix of those for new selection
     * @param {Object} [options] - function options
     * - clear: {boolean} - Whether to clear the existing selection
     *     defualt: false
     * - render: {boolean} - Whether to re-render the picker element
     *     default: true
     * - autohide: {boolean} - Whether to hide the picker element after re-render
     *     Ignored when used with render: false
     *     default: config.autohide
     * - revert: {boolean} - Whether to refresh the input field when all the
     *     passed dates are invalid
     *     default: false
     */
    setDate(...args) {
      const dates = [...args];
      const opts = {};
      const lastArg = lastItemOf(args);
      if (
        typeof lastArg === 'object'
        && !Array.isArray(lastArg)
        && !(lastArg instanceof Date)
        && lastArg
      ) {
        Object.assign(opts, dates.pop());
      }

      const inputDates = Array.isArray(dates[0]) ? dates[0] : dates;
      setDate(this, inputDates, opts);
    }

    /**
     * Update the selected date(s) with input field's value
     * Not available on inline picker
     *
     * The input field will be refreshed with properly formatted date string.
     *
     * In the case that all the entered dates are invalid (unparsable, repeated,
     * disabled or out-of-range), whixh is distinguished from empty input field,
     * the method leaves the input field untouched as well as the selection by
     * default. If revert: true option is used in this case, the input field is
     * refreshed with the existing selection.
     *
     * @param  {Object} [options] - function options
     * - autohide: {boolean} - whether to hide the picker element after refresh
     *     default: false
     * - revert: {boolean} - Whether to refresh the input field when all the
     *     passed dates are invalid
     *     default: false
     */
    update(options = undefined) {
      if (this.inline) {
        return;
      }
      ValidateInputInline(this); //calling function to check for validation when manually entering the value
      const opts = Object.assign(options || {}, {clear: true, render: true});
      const inputDates = stringToArray(this.inputField.value, this.config.dateDelimiter);
      setDate(this, inputDates, opts);
    }

    /**
     * Refresh the picker element and the associated input field
     * @param {String} [target] - target item when refreshing one item only
     * 'picker' or 'input'
     * @param {Boolean} [forceRender] - whether to re-render the picker element
     * regardless of its state instead of optimized refresh
     */
    refresh(target = undefined, forceRender = false) {
      if (target && typeof target !== 'string') {
        forceRender = target;
        target = undefined;
      }

      let mode;
      if (target === 'picker') {
        mode = 2;
      } else if (target === 'input') {
        mode = 1;
      } else {
        mode = 3;
      }
      refreshUI(this, mode, !forceRender);
    }

    /**
     * Enter edit mode
     * Not available on inline picker or when the picker element is hidden
     */
    enterEditMode() {
      if (this.inline || !this.picker.active || this.editMode) {
        return;
      }
      this.editMode = true;
      this.inputField.classList.add('in-edit');
    }

    /**
     * Exit from edit mode
     * Not available on inline picker
     * @param  {Object} [options] - function options
     * - update: {boolean} - whether to call update() after exiting
     *     If false, input field is revert to the existing selection
     *     default: false
     */
    exitEditMode(options = undefined) {
      if (this.inline || !this.editMode) {
        return;
      }
      const opts = Object.assign({update: false}, options);
      delete this.editMode;
      this.inputField.classList.remove('in-edit');
      if (opts.update) {
        this.update(opts);
      }
    }
  }

  return Datepicker;

})();

/*  expert-page  */
XA.component.expertPage = (function($) {
  var CLASS_IS_SCROLLABLE_LEFT = 'is-ht-left';
  var CLASS_IS_SCROLLABLE_RIGHT = 'is-ht-right';
  
  var api=api || {
    /**
     * Article page parallax scrolling
     * TODO: Once 'article-page' class moved to <html>, no need to manually add. Pending BE confirmation
     */
    initStageParallax: function() {
      if (!$('.article-page').length) {
        return; // Only run on article pages
      }

      $('html').addClass('article-page'); // TODO: Remove on BE fix
      
      var $stageImage = $('.container.full-width .component.image .component-content > div');
      var hasImage = $stageImage.find('img');

      // Initialise parallax on first full-width container we find containing an image component
      if ($stageImage.length && hasImage.length) {
        $stageImage.css('transform', 'translateY(' + -(window.pageY * .5) + 'px)')
        
        $(window).scroll(function() {
          $stageImage.css('transform', 'translateY(' + -(window.pageYOffset * .55) + 'px)')
        });
      } else {
        // Image not set - remove wrapper to avoid excess padding
        $('.container.full-width:first-child .component.image').remove();
      }
    },

    /**
     * Remove any empty article results
     */
    removeEmptyArticleResults: function() {
      $('.mod-article-list-search-results ul.items > li').each(function() {
        if (!$(this).children().length) {
          $(this).remove();
        }
      });
    },

    initRelatedArticlesSlider: function() {
      var self = this;

      if (!$('.related-articles').length) {
        return; // Only run if related-articles exist
      }

      var $relatedArticles = $('.related-articles .teaser.teaser-related');
      var $articles =  $('<div></div>').addClass('article-scroll__inlay') .scroll(function(e) {
        var $navGroup = $(e.target);
        self.onArticleScroll($navGroup);
      }).prepend($relatedArticles);

      $('.related-articles .component-content > div').append(
        $('<div></div>').addClass('article-scroll').prepend(  
          $('<button></button>')
              .addClass('article-scroll__btn article-scroll__btn-left')
              .attr('aria-label', 'scroll left')
              .click(self.onArticleScrollClick),
          $articles,
          $('<button></button>')
              .addClass('article-scroll__btn article-scroll__btn-right')
              .attr('aria-label', 'scroll right')
              .click(self.onArticleScrollClick)
        )
      )
    },

    /**
     * Handles scroll event on related articles (hides/shows arrows)
     * @param {} $headingInlay $('.article-scroll__inlay')
     */
    onArticleScroll: function($headingInlay) {
      var headingInlayScrollLeft = $headingInlay.scrollLeft();
      var headingInlayScrollWidth = $headingInlay[0].scrollWidth;
      var headingInlayInnerWidth = $headingInlay.innerWidth();
      var $htScroller = $headingInlay.parents('.article-scroll');

      if (headingInlayScrollWidth > headingInlayInnerWidth) {
        $htScroller.addClass('has-scroller');
      } else {
        $htScroller.removeClass('has-scroller');
      }

      if (headingInlayScrollLeft > 10) {
        $htScroller.addClass(CLASS_IS_SCROLLABLE_LEFT);
      } else {
        $htScroller.removeClass(CLASS_IS_SCROLLABLE_LEFT);
      }

      if (headingInlayScrollLeft + (headingInlayInnerWidth + 10) >= headingInlayScrollWidth) {
        $htScroller.removeClass(CLASS_IS_SCROLLABLE_RIGHT);
      } else {
        $htScroller.addClass(CLASS_IS_SCROLLABLE_RIGHT);
      }
    },

    /**
     * Handles horizontal related-articles scrolling on arrow click
     * @param {Event} e 
     */
    onArticleScrollClick: function(e) {
      var $btnScroller = $(e.target);
      var $htScroller = $btnScroller.siblings('.article-scroll__inlay');

      if ($btnScroller.hasClass('article-scroll__btn-right')) {
        $htScroller.animate({ scrollLeft: '+=250px' }, 300);
      } else {
        $htScroller.animate({ scrollLeft: '-=250px' }, 300);
      }
    },

    /**
     * Check and reset scroll arrows
     */
    checkArticleScrollOnLoad: function() {
      var self = this;
      $('.article-scroll__inlay').each(function() {
        self.onArticleScroll($(this));
      });
    },

    /**
     * Init pageload events
     */
    setEventHandlers: function() {
      var self = this;

      $(window).on('resize', function() {
        self.checkArticleScrollOnLoad();
      });
    },
  };

  
  api.init = function() {
    if ( ($('script[type="IN/MemberProfile"]').length) && $('.teaser--expert').length) {
      $.getScript("//platform.linkedin.com/in.js");
    }

    this.api.initStageParallax();
    this.api.initRelatedArticlesSlider();
    this.api.checkArticleScrollOnLoad();
    this.api.setEventHandlers();
    this.api.removeEmptyArticleResults();
  };

  return api;
})(jQuery, document);

XA.register('expertPage', XA.component.expertPage);


/*  focus-area  */
XA.component.focusAreaComponent = (function($) {
  var api=api || {};

  api.init = function() {
    $('.component.focus-area').each(function() {
      $(this).find('.focus-area-element').wrapAll('<div class="focus-area-wrapper" />');
      $(this).find('h3:only-child').addClass('heading-only');
    });

    $('.focus-area-element a[href]').each(function() {
      $(this).parent().parent().addClass('with-link');  
    });

    $('.focus-area-element p.field-content').each(function() {
      if (!$(this).text().trim().length) {
          $(this).addClass('empty-field-content');
          $(this).siblings('h3').addClass('heading-only');
      }
    });
    
    $('.toggle-on-focus-area').on('click', function($) {
      $.currentTarget.closest('.focus-area').classList.add('is-open')
    });
    $('.toggle-off-focus-area').on('click', function($) {
      $.currentTarget.closest('.focus-area').classList.remove('is-open')
    });

    // Only show toggle if < 5 teaser-focus-element
    $('.focus-area').each(function() {
      var focusCount = $(this).find('.teaser-focus-element').length;

      if (focusCount < 5) {
        $(this).find('.focus-area-toggle').hide();
      }
    })
  };

  return api;
})(jQuery, document);

XA.register('focusAreaComponent', XA.component.focusAreaComponent);





/*  form-tracking  */
XA.component.FormTracking = (function ($) {
    var api = {
        initWFFMTracking: function () {
            //Track Fill-In Event tracking
            $('.form-group input, .form-group textarea').on('focusout input[type!="submit"]', function (e) {
                var formGroup = $(this).parent(".form-group");
                var fieldLabel = $(this).prev('label').text();
                var args = api.GetArgs();
                args['event_eventInfo_label'] = fieldLabel;
                args['event_element_elementName'] = fieldLabel;

                //Track FE-error-validations
                if (formGroup.children("span.field-validation-error").length > 0) {
                    args['event_eventInfo_effect'] = 'appear';
                    args['error_errorInfo_elementName'] = fieldLabel;
                    args['error_errorInfo_message'] = formGroup.children("span.field-validation-error").text();
                    args['error_errorInfo_type'] = 'validation-error-frontend';
                    console.log('fill-in-error' + fieldLabel + JSON.stringify(args));
                }
                else {
                    args['event_eventInfo_effect'] = "fill-in";
                    console.log('Fill-In event of field: ' + fieldLabel + JSON.stringify(args));
                }
                var utagArgs = args;
                utag.link(utagArgs);
            });

            //Error tracking FE on Submit event
            $('.form-submit-border > .btn').on('click', function (e) {
                $('form .form-group .form-control').each(function (index) {
                    var self = $(this).parent();
                    if (($(this).val() == "" && $(this).data("val-required") !== undefined) || ($(this).data("val-regex") !== undefined && $(this).next('span').hasClass('field-validation-error'))) {
                        $(this).next('span.help-block').removeClass('field-validation-valid').addClass('field-validation-error').text($(this).data("val-required"));
                        api.TrackValidationError('validation-error-frontend', self);
                    }
                });

            });
        },

        GetArgs: function () {
            var args = {};
            var trackLevelContent = $('form').parent().data('track-levelcontent');
            if (typeof trackLevelContent != 'undefined' & trackLevelContent != null) {
                var parsedContent = JSON.parse(JSON.stringify(trackLevelContent));
                args['component_componentInfo_componentType'] = parsedContent['component_componentInfo_componentType'];
                args['component_componentInfo_componentID'] = parsedContent['component_componentInfo_componentID'];
                args['event_category_primaryCategory'] = parsedContent['event_category_primaryCategory'];
            }
            return args;
        },

        TrackSubmitEvent: function (self) {
            var args = api.GetArgs();
            var submitAttr = $('.form-submit-border > .btn').data('track-elementcontent');
            submitAttr = $('<div/>').html(submitAttr).text();
            var elementName = '';
            if (typeof submitAttr != 'undefined' & submitAttr != null) {
                var parsedSubmitAttr = JSON.parse(submitAttr);
                elementName = parsedSubmitAttr['element_elementInfo_elementName'];
            }
            args['event_eventInfo_effect'] = 'submit';
            args['event_eventInfo_label'] = 'send-request';
            args['event_element_elementName'] = elementName;
            var utagArgs = args;
            utag.link(utagArgs);
        },

        TrackConfirmEvent: function () {
            var args = api.GetArgs();
            args['event_eventInfo_effect'] = 'complete';
            args['event_eventInfo_label'] = 'request-sent';
            args['conversion_conversionInfo_conversionClass'] = $('#' + $('form').attr('id') + '_conversion-class').val();
            var utagArgs = args;
            utag.link(utagArgs);
        },

        populateUDOCookie: function () {
            var udo_Array = {};
            if (typeof utag_data != 'undefined') {
                if (utag_data['page_pageInfo_language'] != '') {
                    udo_Array['page_pageInfo_language'] = utag_data['page_pageInfo_language'];
                }
                if (utag_data['page_category_primaryCategory'] != '') {
                    udo_Array['page_category_primaryCategory'] = utag_data['page_category_primaryCategory'];
                }
                var relUrl = $('link[rel="canonical"]').attr('href').replace(/^(?:\/\/|[^\/]+)*\//, "")
                var catCount = typeof relUrl !== 'undefined' ? relUrl.split('/').length : 0;
                if (catCount > 0) {
                    for (var n = 1; n < catCount; n++) {
                        if (utag_data['page_category_subCategory' + n] != '') {
                            udo_Array['page_category_subCategory' + n] = utag_data['page_category_subCategory' + n];
                        }
                    }
                }
                if (utag_data['platform_platformInfo_environment'] != '') {
                    udo_Array['platform_platformInfo_environment'] = utag_data['platform_platformInfo_environment'];
                }
                if (utag_data['page_pageInfo_templateType'] != '') {
                    udo_Array['page_pageInfo_templateType'] = utag_data['page_pageInfo_templateType'];
                }
                if (utag_data['content_contentInfo_author'] != '') {
                    udo_Array['content_contentInfo_author'] = utag_data['content_contentInfo_author'];
                }
                if (utag_data['content_attributes_expert'] != '') {
                    udo_Array['content_attributes_expert'] = utag_data['content_attributes_expert'];
                }
                if (utag_data['content_attributes_topic'] != '') {
                    udo_Array['content_attributes_topic'] = utag_data['content_attributes_topic'];
                }
                if (utag_data['content_contentInfo_contentType'] != '') {
                    udo_Array['content_contentInfo_contentType'] = utag_data['content_contentInfo_contentType'];
                }
                if (utag_data['content_contentInfo_publisher'] != '') {
                    udo_Array['content_contentInfo_publisher'] = utag_data['content_contentInfo_publisher'];
                }
                if (utag_data['page_attributes_refMktURL'] != '') {
                    udo_Array['page_attributes_refMktURL'] = utag_data['page_attributes_refMktURL'];
                }
                if (utag_data['platform_platformInfo_platformName'] != '') {
                    udo_Array['platform_platformInfo_platformName'] = utag_data['platform_platformInfo_platformName'];
                }
            }

            var utagDataVal = XA.cookies.readCookie('form_udo');
            if (typeof utagDataVal != 'undefined' && utagDataVal != null) {
                api.deleteCookie('form_udo');
            }
            XA.cookies.createCookie('form_udo', JSON.stringify(udo_Array), 1);
        },

        checkIfThankYouPage: function () {
            var utagData = XA.cookies.readCookie('form_udo');
            if (typeof utagData != 'undefined' && utagData != '') {
                api.deleteCookie('form_udo');
                var udoArgs = utagData.replace(/"/g, '\'');
                utag.link(udoArgs)
            }
        },

        TrackValidationError: function (valType, self) {
            if ($(self).children("span.field-validation-error").length > 0) {
                var args = api.GetArgs();
                var fieldLabel = $(self).children('label').text();
                args['event_eventInfo_effect'] = 'appear';
                args['event_eventInfo_label'] = fieldLabel;
                args['event_element_elementName'] = fieldLabel;

                args['error_errorInfo_elementName'] = fieldLabel;
                args['error_errorInfo_message'] = $(self).children("span.field-validation-error").text();
                args['error_errorInfo_type'] = valType;
                utag.link(args);
            }
        },

        TrackBackendValidation: function () {
            //BE Validation event
            if ($('.list-group-item-warning').length > 0) {
                var errorType = 'validation-error-backend';
                var fieldLabel = 'bg-warning';
                var errorMsg = $('.list-group-item-warning').text();
                var args = api.GetArgs();

                args['event_eventInfo_effect'] = 'appear';
                args['event_eventInfo_label'] = fieldLabel;
                args['event_element_elementName'] = fieldLabel;

                args['error_errorInfo_message'] = errorMsg;
                args['error_errorInfo_type'] = errorType;
                utag.link(args);

                //Field level validations if any
                $('form .form-group').each(function () {
                    var self = this;
                    if ($(self).children("span.field-validation-error").length > 0) {
                        api.TrackValidationError(errorType, self);
                    }
                });
            }
        },

        deleteCookie: function (key) {
            document.cookie = key + '=; expires=Thu, 01-Jan-70 00:00:01 GMT;path=/';
        }
    };

    api.init = function () {
        try {
            if (typeof $('form').data('wffm') !== 'undefined') {
                if (typeof utag != 'undefined' & utag != null)
                    this.api.initWFFMTracking();
            }
            else {
                api.checkIfThankYouPage();
            }
        } catch (e) {
            if (e instanceof ReferenceError) {
                console.log('utag is not defined');
            };
        }
    };
    return api;
})(jQuery, document);
XA.register("FormTracking", XA.component.FormTracking);

/*  google-marker-cluster  */
(function(){var d=null;function e(a){return function(b){this[a]=b}}function h(a){return function(){return this[a]}}var j;
function k(a,b,c){this.extend(k,google.maps.OverlayView);this.c=a;this.a=[];this.f=[];this.ca=[53,56,66,78,90];this.j=[];this.A=!1;c=c||{};this.g=c.gridSize||60;this.l=c.minimumClusterSize||2;this.J=c.maxZoom||d;this.j=c.styles||[];this.X=c.imagePath||this.Q;this.W=c.imageExtension||this.P;this.O=!0;if(c.zoomOnClick!=void 0)this.O=c.zoomOnClick;this.r=!1;if(c.averageCenter!=void 0)this.r=c.averageCenter;l(this);this.setMap(a);this.K=this.c.getZoom();var f=this;google.maps.event.addListener(this.c,
"zoom_changed",function(){var a=f.c.getZoom();if(f.K!=a)f.K=a,f.m()});google.maps.event.addListener(this.c,"idle",function(){f.i()});b&&b.length&&this.C(b,!1)}j=k.prototype;j.Q="http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/images/m";j.P="png";j.extend=function(a,b){return function(a){for(var b in a.prototype)this.prototype[b]=a.prototype[b];return this}.apply(a,[b])};j.onAdd=function(){if(!this.A)this.A=!0,n(this)};j.draw=function(){};
function l(a){if(!a.j.length)for(var b=0,c;c=a.ca[b];b++)a.j.push({url:a.X+(b+1)+"."+a.W,height:c,width:c})}j.S=function(){for(var a=this.o(),b=new google.maps.LatLngBounds,c=0,f;f=a[c];c++)b.extend(f.getPosition());this.c.fitBounds(b)};j.z=h("j");j.o=h("a");j.V=function(){return this.a.length};j.ba=e("J");j.I=h("J");j.G=function(a,b){for(var c=0,f=a.length,g=f;g!==0;)g=parseInt(g/10,10),c++;c=Math.min(c,b);return{text:f,index:c}};j.$=e("G");j.H=h("G");
j.C=function(a,b){for(var c=0,f;f=a[c];c++)q(this,f);b||this.i()};function q(a,b){b.s=!1;b.draggable&&google.maps.event.addListener(b,"dragend",function(){b.s=!1;a.L()});a.a.push(b)}j.q=function(a,b){q(this,a);b||this.i()};function r(a,b){var c=-1;if(a.a.indexOf)c=a.a.indexOf(b);else for(var f=0,g;g=a.a[f];f++)if(g==b){c=f;break}if(c==-1)return!1;b.setMap(d);a.a.splice(c,1);return!0}j.Y=function(a,b){var c=r(this,a);return!b&&c?(this.m(),this.i(),!0):!1};
j.Z=function(a,b){for(var c=!1,f=0,g;g=a[f];f++)g=r(this,g),c=c||g;if(!b&&c)return this.m(),this.i(),!0};j.U=function(){return this.f.length};j.getMap=h("c");j.setMap=e("c");j.w=h("g");j.aa=e("g");
j.v=function(a){var b=this.getProjection(),c=new google.maps.LatLng(a.getNorthEast().lat(),a.getNorthEast().lng()),f=new google.maps.LatLng(a.getSouthWest().lat(),a.getSouthWest().lng()),c=b.fromLatLngToDivPixel(c);c.x+=this.g;c.y-=this.g;f=b.fromLatLngToDivPixel(f);f.x-=this.g;f.y+=this.g;c=b.fromDivPixelToLatLng(c);b=b.fromDivPixelToLatLng(f);a.extend(c);a.extend(b);return a};j.R=function(){this.m(!0);this.a=[]};
j.m=function(a){for(var b=0,c;c=this.f[b];b++)c.remove();for(b=0;c=this.a[b];b++)c.s=!1,a&&c.setMap(d);this.f=[]};j.L=function(){var a=this.f.slice();this.f.length=0;this.m();this.i();window.setTimeout(function(){for(var b=0,c;c=a[b];b++)c.remove()},0)};j.i=function(){n(this)};
function n(a){if(a.A)for(var b=a.v(new google.maps.LatLngBounds(a.c.getBounds().getSouthWest(),a.c.getBounds().getNorthEast())),c=0,f;f=a.a[c];c++)if(!f.s&&b.contains(f.getPosition())){for(var g=a,u=4E4,o=d,v=0,m=void 0;m=g.f[v];v++){var i=m.getCenter();if(i){var p=f.getPosition();if(!i||!p)i=0;else var w=(p.lat()-i.lat())*Math.PI/180,x=(p.lng()-i.lng())*Math.PI/180,i=Math.sin(w/2)*Math.sin(w/2)+Math.cos(i.lat()*Math.PI/180)*Math.cos(p.lat()*Math.PI/180)*Math.sin(x/2)*Math.sin(x/2),i=6371*2*Math.atan2(Math.sqrt(i),
Math.sqrt(1-i));i<u&&(u=i,o=m)}}o&&o.F.contains(f.getPosition())?o.q(f):(m=new s(g),m.q(f),g.f.push(m))}}function s(a){this.k=a;this.c=a.getMap();this.g=a.w();this.l=a.l;this.r=a.r;this.d=d;this.a=[];this.F=d;this.n=new t(this,a.z(),a.w())}j=s.prototype;
j.q=function(a){var b;a:if(this.a.indexOf)b=this.a.indexOf(a)!=-1;else{b=0;for(var c;c=this.a[b];b++)if(c==a){b=!0;break a}b=!1}if(b)return!1;if(this.d){if(this.r)c=this.a.length+1,b=(this.d.lat()*(c-1)+a.getPosition().lat())/c,c=(this.d.lng()*(c-1)+a.getPosition().lng())/c,this.d=new google.maps.LatLng(b,c),y(this)}else this.d=a.getPosition(),y(this);a.s=!0;this.a.push(a);b=this.a.length;b<this.l&&a.getMap()!=this.c&&a.setMap(this.c);if(b==this.l)for(c=0;c<b;c++)this.a[c].setMap(d);b>=this.l&&a.setMap(d);
a=this.c.getZoom();if((b=this.k.I())&&a>b)for(a=0;b=this.a[a];a++)b.setMap(this.c);else if(this.a.length<this.l)z(this.n);else{b=this.k.H()(this.a,this.k.z().length);this.n.setCenter(this.d);a=this.n;a.B=b;a.ga=b.text;a.ea=b.index;if(a.b)a.b.innerHTML=b.text;b=Math.max(0,a.B.index-1);b=Math.min(a.j.length-1,b);b=a.j[b];a.da=b.url;a.h=b.height;a.p=b.width;a.M=b.textColor;a.e=b.anchor;a.N=b.textSize;a.D=b.backgroundPosition;this.n.show()}return!0};
j.getBounds=function(){for(var a=new google.maps.LatLngBounds(this.d,this.d),b=this.o(),c=0,f;f=b[c];c++)a.extend(f.getPosition());return a};j.remove=function(){this.n.remove();this.a.length=0;delete this.a};j.T=function(){return this.a.length};j.o=h("a");j.getCenter=h("d");function y(a){a.F=a.k.v(new google.maps.LatLngBounds(a.d,a.d))}j.getMap=h("c");
function t(a,b,c){a.k.extend(t,google.maps.OverlayView);this.j=b;this.fa=c||0;this.u=a;this.d=d;this.c=a.getMap();this.B=this.b=d;this.t=!1;this.setMap(this.c)}j=t.prototype;
j.onAdd=function(){this.b=document.createElement("DIV");if(this.t)this.b.style.cssText=A(this,B(this,this.d)),this.b.innerHTML=this.B.text;this.getPanes().overlayMouseTarget.appendChild(this.b);var a=this;google.maps.event.addDomListener(this.b,"click",function(){var b=a.u.k;google.maps.event.trigger(b,"clusterclick",a.u);b.O&&a.c.fitBounds(a.u.getBounds())})};function B(a,b){var c=a.getProjection().fromLatLngToDivPixel(b);c.x-=parseInt(a.p/2,10);c.y-=parseInt(a.h/2,10);return c}
j.draw=function(){if(this.t){var a=B(this,this.d);this.b.style.top=a.y+"px";this.b.style.left=a.x+"px"}};function z(a){if(a.b)a.b.style.display="none";a.t=!1}j.show=function(){if(this.b)this.b.style.cssText=A(this,B(this,this.d)),this.b.style.display="";this.t=!0};j.remove=function(){this.setMap(d)};j.onRemove=function(){if(this.b&&this.b.parentNode)z(this),this.b.parentNode.removeChild(this.b),this.b=d};j.setCenter=e("d");
function A(a,b){var c=[];c.push("background-image:url("+a.da+");");c.push("background-position:"+(a.D?a.D:"0 0")+";");typeof a.e==="object"?(typeof a.e[0]==="number"&&a.e[0]>0&&a.e[0]<a.h?c.push("height:"+(a.h-a.e[0])+"px; padding-top:"+a.e[0]+"px;"):c.push("height:"+a.h+"px; line-height:"+a.h+"px;"),typeof a.e[1]==="number"&&a.e[1]>0&&a.e[1]<a.p?c.push("width:"+(a.p-a.e[1])+"px; padding-left:"+a.e[1]+"px;"):c.push("width:"+a.p+"px; text-align:center;")):c.push("height:"+a.h+"px; line-height:"+a.h+
"px; width:"+a.p+"px; text-align:center;");c.push("cursor:pointer; top:"+b.y+"px; left:"+b.x+"px; color:"+(a.M?a.M:"black")+"; position:absolute; font-size:"+(a.N?a.N:11)+"px; font-family:Arial,sans-serif; font-weight:bold");return c.join("")}window.MarkerClusterer=k;k.prototype.addMarker=k.prototype.q;k.prototype.addMarkers=k.prototype.C;k.prototype.clearMarkers=k.prototype.R;k.prototype.fitMapToMarkers=k.prototype.S;k.prototype.getCalculator=k.prototype.H;k.prototype.getGridSize=k.prototype.w;
k.prototype.getExtendedBounds=k.prototype.v;k.prototype.getMap=k.prototype.getMap;k.prototype.getMarkers=k.prototype.o;k.prototype.getMaxZoom=k.prototype.I;k.prototype.getStyles=k.prototype.z;k.prototype.getTotalClusters=k.prototype.U;k.prototype.getTotalMarkers=k.prototype.V;k.prototype.redraw=k.prototype.i;k.prototype.removeMarker=k.prototype.Y;k.prototype.removeMarkers=k.prototype.Z;k.prototype.resetViewport=k.prototype.m;k.prototype.repaint=k.prototype.L;k.prototype.setCalculator=k.prototype.$;
k.prototype.setGridSize=k.prototype.aa;k.prototype.setMaxZoom=k.prototype.ba;k.prototype.onAdd=k.prototype.onAdd;k.prototype.draw=k.prototype.draw;s.prototype.getCenter=s.prototype.getCenter;s.prototype.getSize=s.prototype.T;s.prototype.getMarkers=s.prototype.o;t.prototype.onAdd=t.prototype.onAdd;t.prototype.draw=t.prototype.draw;t.prototype.onRemove=t.prototype.onRemove;
})();

/*  map  */
/* global XA, Breakpoints, $, MarkerClusterer */
/*eslint no-console: ["error", { allow: ["log"] }] */

XA.component.mapComponent = (function($) {
  
  var api = {
    markerCluster: null,
    state: {
      countries: [],
      settings: {},
      sendEmailLabel: '',
      websiteLabel: '',
      showMapLabel: '',
      routePlannerLabel: '',
      telephoneLabel: '',
      faxLabel: ''
    },
    markers: [],
    markerIcon: '-/media/Themes/ZWP/Base/Corp/images/location-marker.png',
    closeButton: '<button value="close" class="btn-close pull-right hidden-xs"><span class="icon i-close"></span></button>',
    styles: [
      {
        stylers: [
          { 
            hue: '#006eff'
          },
          { 
            saturation: -15 
          },
        ]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [
          { 
            color: '#5178ac'
          },
          { 
            lightness: 33
          },
          { 
            saturation: -16 
          }
        ]
      },
      { 
        featureType: 'road',
        stylers: [
          { 
            hue: '#ffa200' 
          },
          { 
            saturation: -56
          }
        ]
      },
      {
        featureType: 'poi.park',
        stylers: [
          { 
            saturation: -100 
          }
        ]
      },
      {
        featureType: 'administrative',
        elementType: 'geometry',
        stylers: [
          { 
            weight: 2.1
          },
          {
            lightness: -6
          }
        ]
      }
    ],
    map: {},
    boxItem: $('.list-holder > .listitem').clone(),
    defaultMap: $('.map-canvas'),
    infoBox: $('.mapinfobox'),
    showMore: $('.list-showmore'),
    isMobile: null,
    isGlobal: null,

    /**
     * 
     * At runtime, if API key is found, attempt to inject Google Maps API script into the DOM.
     * Load map if successful
     */
    injectScript: function() {
      var key = $('.mapholder').data('mapsprovider-key');
      
      if (!key) {
        return;
      }

      var self = this;
      var script = document.createElement('script'),
                src = 'https://maps.googleapis.com/maps/api/js?v=3.exp';
      script.type = 'text/javascript';
      if (typeof key !== 'undefined' && key !== '') {
        src += '&key=' + key;
      } else {
        src += '&signed_in=false';
      }
      src += '&libraries=places&callback=XA.connector.mapsConnector.scriptsLoaded';
      script.src = src;
      script.onload = function() {
        self.loadMap();
      };

      document.body.appendChild(script);
    },

    /**
     * Generates a new Google Maps API instance
     * Uses 'data-json' attribute for map marker and list population
     */
    loadMap: function() {
      var $mapWrapper = $('.mod-Location_finder');
      var data = JSON.parse($mapWrapper.attr('data-json'));

      this.setState(data);
      this.setEventHandlers();

      this.map = new window.google.maps.Map(document.getElementById('mapcanvas'), { 
        streetViewControl: false,
        mapTypeControl: false,
        zoomControl: true,
        fullscreenControl: false,
        scrollwheel: false,
        draggable: true,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        center: this.getCenterPoint(),
        zoom: 5,
        styles: this.styles
      });

      this.isGlobal = $('.mod-Location_finder.global').length;
      
      
      if (!this.isGlobal) {
        var firstCategory = $('.mapnaviholder .category')[0];
        this.setActiveCategory(firstCategory);
      } else {
        this.setMarkers();
        this.setLocationBoxes();
      }
    },

    /**
     * When initialising the map, returns a new center point based on first country found.
     */
    getCenterPoint: function() {
      var ctry = this.state.countries[0];
      var address = ctry.ContactAddress;

      return address 
        ? new window.google.maps.LatLng(address.Latitude, address.Longitude)
        : new window.google.maps.LatLng(67.9, 56.3);
    },

    /**
     * Save country and settings from 'data-json' to api state object
     * @param {object} data 
     */
    setState: function(data) {
      var countries = _.get(data, 'countries', false);
      var settings = _.get(data, 'componentSettings', false);

      if (!settings || !countries) {
        return;
      }

      this.state.countries = countries;
      this.state.settings = settings;
      this.state.sendEmailLabel =  settings.SendEmailLabel;
      this.state.websiteLabel =  settings.WebsiteLabel;
      this.state.showMapLabel =  settings.ShowMapLabel;
      this.state.routePlannerLabel = settings.RoutePlannerlLabel;
      this.state.telephoneLabel = settings.TelephoneLabel;
      this.state.faxLabel = settings.FaxLabel;
    },


    /**
     * Set map markers based on current state countries
     */
    setMarkers: function(selectedCountry, isLocal) {
      var self = this;

      // Clear old markers (Local only)
      if (selectedCountry && !this.isGlobal) {
        for (var i = 0; i < this.markers.length; i++ ) {
          this.markers[i].setMap(null);
        }
        this.markers.length = 0;
      }

      var markers = _.reduce(this.state.countries, function(accum, country) {
        
        if (isLocal) {
          if (selectedCountry && country.ContactAddress.AddressCategory !== selectedCountry.ContactAddress.AddressCategory) {
            return accum; // If selected country Category specified, ignore other categories
          }
        } else {
          if (selectedCountry && country.Category !== selectedCountry.Category) {
            return accum; // If selected country Category specified, ignore other categories
          }
        }

        var address = country.ContactAddress;

        // Add map marker
        var marker = new window.google.maps.Marker({
          position: new window.google.maps.LatLng(address.Latitude, address.Longitude),
          title: country.ContactTitle,
          id: address.AddressPostalCode,
          icon: country.Symbol,
        });

        marker.addListener('click', function() {
          self.showLocationWindow(country, true);
        });

        // Show marker by default (Global only)
        if (self.isGlobal) {
          marker.setMap(self.map);
        }

        return accum.concat(marker);
      }, []);

      // Group markers into clusters (Global only)
      if (!this.isGlobal) {
        if (this.markerCluster) {
          this.markerCluster.clearMarkers(); // Clear markers each time
        }
  
        this.markerCluster = new MarkerClusterer(self.map, markers, { 
          averageCenter: true,
          styles: [{
            textColor: 'black',
            url: '-/media/Themes/ZWP/Base/Base/images/m/1.png',
            height: 55,
            width: 30,
            anchor: [8, 0],
            backgroundPosition: 'top center',
            iconAnchor: [4, 5],
          }]
        });
      }

      this.markers = markers;
    },

    /**
     * Renders POIs to list. Filters by selectedCountry if provided.
     * @param {string} selectedCountry 
     */
    setLocationBoxes: function(selectedCountry, isLocal) {
      var _self = this;
      var listHolder = $('.list-holder');
      var count = 0;
      var limit = _.get(this.state.settings, 'NumberOfResultsToDisplay', 3);

      var html = _.reduce(this.state.countries, function(markup, country) {
        var address = country.ContactAddress;
        var website = country.ContactWebsite;
        var email = country.ContactEmail;

        if (isLocal) {
          if (selectedCountry && selectedCountry !== address.AddressCategory) {
            return markup;
          }
        } else {
          if (selectedCountry && selectedCountry !== address.AddressCountry) {
            return markup;
          }
        }

        var addressBody = address.AddressBody ? address.AddressBody + '<br>' : '';
        var city = address.AddressCity ? address.AddressCity + '<br>' : '';
        var postcode = address.AddressPostalCode ? address.AddressPostalCode + '<br>' : '';

        var box = _self.boxItem.clone();
        box.attr('data-map-scroll-id', country.ContactID);
        box.find('.location-title').text(address.AddressCompanyName);
        box.find('.location-address').html(addressBody + city + postcode);
        box.find('.location-website').attr('href', website).text(_self.state.websiteLabel);
        box.find('.location-email').attr('href', 'mailto:' + email).text(_self.state.sendEmailLabel);
        box.find('.location-phone').text(country.ContactPhone ? _self.state.telephoneLabel + ' ' + country.ContactPhone : '');
        box.find('.location-fax').text(country.ContactFax ? _self.state.faxLabel + ' ' + country.ContactFax : '');
        box.find('.show-map').attr('data-contact-id', country.ContactID).text(_self.state.showMapLabel);

        if (!website) {
          box.find('.location-website').hide();
        }

        if (!email) {
          box.find('.location-email').hide();
        }
        
        // Set box to hidden if index is
        if (count > (limit - 1)) {
          box.hide();
        } else {
          box.show();
        }

        count++;
        return markup += box.prop('outerHTML');
      }, '');

      // // Show / hide "load more" button depending on location count
      if (count > limit) {
        this.showMore.show();
      } else {
        this.showMore.hide();
      }

      

      listHolder.html(html);
    },

    /**
     * Finds and build the country popup window dynamically based on postcode provided
     * @param {string} postcode 
     */
    showLocationWindow: function(country, scroll) {
      if (!country) {
        return;
      }

      var address = country.ContactAddress;
      var routeFinderLink = 'https://maps.google.com/maps?daddr=' + address.Latitude + ',' + address.Longitude + '&amp;ll=';

      var phone = country.ContactPhone ? '<div class="location-phone">Tel ' + country.ContactPhone + '</div>' : '';
      var fax = country.ContactFax ? '<div class="location-phone">Fax ' + country.ContactFax + '</div>' : '';

      var popupMarkup = '<div class="location-finder-popup">' +
      this.closeButton + 
      '<h3 class="location-title">' + address.AddressCompanyName + '</h3>' + 
      '<div class="location-address">' + address.AddressBody + '</div>' + phone + fax;

      if (country.ContactEmail) {
        popupMarkup +=  '<a href="mailto:' + country.ContactEmail + '" class="link link-standard location-email">' + this.state.sendEmailLabel + '</a>';
      }

      popupMarkup += '<a href="'+ routeFinderLink +'" class="link link-standard start-routing">' + this.state.routePlannerLabel + '</a></div>';

      this.infoBox.show().html(popupMarkup);

      if (this.isMobile && scroll) {
        var id = country.ContactID;
        var $listElement = $('div').find("[data-map-scroll-id='" + id + "']");

        $([document.documentElement, document.body]).animate({
          scrollTop: $listElement.offset().top
        }, 500);
      }
    },

    /**
     * Focuses the map on the specified country
     * @param {string} id 
     */
    focusMapToCountry: function(country, zoom, scroll) {
      if (country) {
        var address = country.ContactAddress;
        this.centerOnCoordinates(address.Latitude, address.Longitude, zoom);

        if (scroll) {
          $([document.documentElement, document.body]).animate({
            scrollTop: $("#mapcanvas").offset().top / 2
          }, 500);
        }
      }
    },

    /**
     * Show remaining location boxes, and hide load more button
     */
    onShowMore: function() {
      $('.listitem').show();
      this.showMore.hide();
    },

    /**
     * Global - Handles country select event:
     * - renders list boxes
     * - focuses and zooms map to target
     * @param {string} id 
     */
    onCountrySelected: function(poiId) {
      var country = _.find(this.state.countries, function(ctry) {
        return ctry.ContactID === poiId;
      });

      if (country) {
        this.infoBox.empty();
        this.setLocationBoxes(country.ContactAddress.AddressCountry);
        this.focusMapToCountry(country, 7, false);
      } else {
        this.setLocationBoxes(); // Show all boxes by default
      }
    },

    /**
     * Local - Handles category selection
     * @param {HTMLElement} element 
     */
    setActiveCategory: function(element) {
      var category = $(element).children('.title').text();

      $('.mapnaviholder .category').not(element).removeClass('active');
      $(element).addClass('active');

      var selectedCountry = _.find(this.state.countries, function(ctry) {
        if (ctry.ContactAddress && ctry.ContactAddress.AddressCategory) {
          return ctry.ContactAddress.AddressCategory == category;
        } else {
          return ctry.Category == category;
        }
      });

      if (selectedCountry) {
        var address = selectedCountry.ContactAddress;
        this.centerOnCoordinates(address.Latitude, address.Longitude, 5);
        this.setLocationBoxes(selectedCountry.ContactAddress.AddressCategory, true);
        this.setMarkers(selectedCountry, true);
      }
    },

    /**
     * Set all event handlers needed on initialization
     */
    setEventHandlers: function() {
      var self = this;
      var $geoMsg = $('#mapnavi-error-geo');
      var $selectElem = $('select.country-select');

      if ($selectElem.length) {
        this.slimSelect = new SlimSelect({
          select: $selectElem[0],
          showSearch: false,
          closeOnSelect: true,
          onChange: function(info) {
            var poiId = info.data.poiId;
            self.onCountrySelected(poiId);
          }
        });
      }

      // Local - Handles country selection from list element
      $('.mapnaviholder .category').click(function() {
        self.infoBox.empty();
        self.setActiveCategory(this);
      });

      // Handles 'Locate me' click
      $('.locate-me').click(function() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(result) {

            var coords = _.get(result, 'coords', false);
            if (coords) {
              self.centerOnCoordinates(coords.latitude, coords.longitude, 15);
              $geoMsg.hide();
            }
          }, function() {
            $geoMsg.show();
          });
        } 
      });

      this.showMore.click(function(e) {
        e.preventDefault();
        self.onShowMore();
      });

      // Handles 'Show map' click on location box
      $(document.body).on('click', '.show-map', function(e) {
        e.preventDefault();
        
        var ContactID = $(this).data('contact-id');
        var item = _.find(self.state.countries, function(ctry) {
          return ctry.ContactID === ContactID;
        });

        if (item) {
          self.focusMapToCountry(item, 15, true);
          self.showLocationWindow(item, false);
        }
      });

      Breakpoints();
      this.isMobile = Breakpoints.is('xs');

      Breakpoints.on('xs', {
        enter: function() {
          self.isMobile = true;
        },
        leave: function() {
          self.isMobile = false;
        }
      });
    },

    /**
     * Centers and zooms map to provided lat/long & zoom values
     * @param {string} lat 
     * @param {string} long 
     * @param {number} zoom 
     */
    centerOnCoordinates: function(lat, long, zoom) {
      var center = new window.google.maps.LatLng(lat, long);
      this.map.panTo(center);
      this.map.setZoom(zoom);
    },

    /**
     * Overrides the default map component if exists on page
     */
    loadDefaultMap: function() {
      var self = this;

      // Handles closing map popup window
      $(document.body).on('click', '.location-finder-popup .btn-close', function() {
        self.infoBox.empty();
      });

      if (_.isEmpty(this.defaultMap)) {
        return; // No map-canvas exists
      }
      
      $.each(this.defaultMap, function() {
        var mapId = $(this).attr('id');
        var $mapSizer = $(this).closest('.mapsizer');
        var config = $mapSizer.data('properties');
        $mapSizer.append('<div class="mapinfobox" style="display: none"></div>');
        
        setTimeout(function() {
          var map = new window.google.maps.Map(document.getElementById(mapId), { 
            streetViewControl: false,
            mapTypeControl: false,
            zoomControl: true,
            fullscreenControl: false,
            scrollwheel: false,
            draggable: true,
            mapTypeId: window.google.maps.MapTypeId.ROADMAP,
            center: new window.google.maps.LatLng(config.latitude, config.longitude),
            zoom: 5,
            styles: self.styles
          });

          _.forEach(config.pois, function(poi) {
            var marker = new window.google.maps.Marker({
              position: new window.google.maps.LatLng(poi.Latitude, poi.Longitude),
              title: poi.Title,
              id: poi.Id.Guid,
              icon: self.markerIcon
            });

            marker.addListener('click', function() {
              self.showDefaultLocationWindow(poi, $mapSizer);
            });

            marker.setMap(map);
          });

          // Handles closing map popup window
          $(document.body).on('click', '.location-finder-popup .btn-close', function() {
            $mapSizer.find('.mapinfobox').empty();
          });
        }, 500);
      });
    },

    showDefaultLocationWindow: function(poi, $mapSizer) {
      $mapSizer.find('.mapinfobox').html('<div class="location-finder-popup">' + this.closeButton + poi.Html + '</div>').show();
    },

    moveMapLegendOnLoad: function() {
      if (!$('.mod-Location_finder.country').length) {
        return;
      }

      var $mapLegend = $('.mod-Location_finder.country .mapnaviholder .lower');
      $mapLegend.insertBefore($('.list-holder'));
    }
  };

  api.init = function() {
    this.api.injectScript();
    this.api.loadDefaultMap();
    this.api.moveMapLegendOnLoad();
  };

  return api;
})(jQuery, document);

XA.register('mapComponent', XA.component.mapComponent);


/*  news-page  */
XA.component.newsPage = (function($) {
 var api=api || {};

 api.init = function() {  
    if ($('.news-disclaimer .component-content').children().length == 0) {
      $('.component-content').parent().removeClass('news-disclaimer');
    } 
 };

 return api;
})(jQuery, document);

XA.register('newsPage', XA.component.newsPage);


/*  openOnLoad  */
var openOnLoad = (function ($) {
    var api = {};

    function activateSelected(items, triggerSelector) {
        var regx = /\open-item-\d+/;
        if (items.length) {
            items.each(function () {
                var found = this.className.match(regx);
                if (found) {
                    var index = parseInt(found[0].replace('open-item-', ''));
                    if (index) {
                        $('ul', this)
                            .find(triggerSelector)
                            .eq(index - 1)
                            .click();
                    }
                }
            });
        }
    }

    function hideExceptions() {
        if ($('body').hasClass('on-page-editor') === false) {
            $(".sxa-rendering-error").each(function () { this.outerHTML = "" })
        }
    }

    /**
     * AccordionComponent item scrolling animation functions
     */

    function subscribeToAccordionItemClickEvent(idx, item) {
        $(item).on('click', onAccordionItemClick(item));
    }

    function onAccordionItemClick(item) {
        return function onAccordionItemClickCallback() {
            var isItemBecomeActive = false;
            var isActionInsideAccordionContent = false;

            if (item) {
                isItemBecomeActive = $(item).hasClass('active');
                isActionInsideAccordionContent = $(item).hasClass('accordion-opened');

                if (isItemBecomeActive && !isActionInsideAccordionContent) {
                    $(item).addClass("accordion-opened");
                    scrollToAccordionItem(item);                   
                }

                if (!isItemBecomeActive) {
                    $(item).removeClass("accordion-opened");
                }
            }
        };
    }

    function scrollToAccordionItem(item) {
        if (isMobile()) {
            return; // No scroll on mobile
        }

        var paddingTop = 20, // taken from component-accordion.scss: line 35
            accordionProps = $(item).parents('.accordion').data('properties'),
            debounceTime = accordionProps.canOpenMultiple ? 0 : accordionProps.speed;

        setTimeout(animateAccordionScroll(item, paddingTop), debounceTime);
    }

    function isMobile() {
        return $('.navigation-main-fatdropdown').hasClass('navigation-mobile');
    }

    function animateAccordionScroll(item, paddingTop) {
        return function animateAccordionScrollCallback() {
            if (item) {
                var $toggleHeader = $(item).children('.toggle-header');
                var top = $toggleHeader.offset().top,
                    height = $toggleHeader.height(),
                    scrollTopValue = top - height - paddingTop;

                $('html,body').animate({
                    scrollTop: scrollTopValue
                }, "slow", "linear")
            }
        };
    }

    /**
     * AccordionComponent anchor on page load behavior
     */

    function addAnchorUrlScanForAccordion(hash, accordionItems) {
        if (
            accordionItems instanceof jQuery
            && typeof hash === 'string'
            && hash.indexOf('#') > -1
        ) {
            accordionItems.each(lookupForAnchorWith(hash, function handleAnchorForAccodion(item) {
                openAccordionItem(item);
                scrollToAccordionItem(item);
            }));
        }
    }

    function lookupForAnchorWith(hash, callback) {
        return function lookupForAnchorWithCallback(idx, item) {
            var anchorElement = $(item).find('a' + hash)[0];

            if (anchorElement) {
                callback(item, anchorElement);
            }
        }
    }

    function openAccordionItem(item) {
        if (item) {
            var content = $(item).find('.toggle-content');
            var properties = $(item)
                .parents('.accordion')
                .data("properties");

            $(item).addClass('active');
            content.slideDown({
                duration: properties.speed,
                easing: properties.easing
            });
        }
    }

    /**
     * TabsComponent anchor on page load behavior
     */

    function addAnchorUrlScanForTabs(hash, tabs) {
        if (
            tabs
            && typeof hash === 'string'
            && hash.indexOf('#') > -1
        ) {
            $(tabs).each(lookupForAnchorWith(hash, function handleAnchorForTabs(tabsInstance, anchorElement) {
                var idx = $(anchorElement).parents('.tab').index();
                openTab(tabsInstance, idx);
                scrollToTab(tabsInstance);
            }));
        }
    }

    function openTab(tabsInstance, index) {
        var tabTitles = $(tabsInstance).find('.tabs-heading > li');

        if (tabTitles[index]) {
            $(tabTitles[index]).trigger('click');
        }
    }

    function scrollToTab(tabsInstance) {
        var scrollTopValue = $(tabsInstance).offset().top;
        $('body').scrollTop(scrollTopValue);
    }

    /**
     * Carousel vertical scrolling on mobile
     */

    function enableVerticalScrollForCarouselWrapper(idx, carousel) {
        var wrapper = $(carousel).find('.wrapper');

        if (wrapper[0] && typeof Hammer === 'function' && isCarouselHorizontal(carousel)) {
            var hammer = new Hammer(wrapper[0]);
            hammer.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL });
        }
    }

    function isCarouselHorizontal(carousel) {
        var props = $(carousel).data('properties');
        return props && props.transition === 'SlideHorizontallyTransition';
    }

    /**
     * YouTube Video IE11 workaround
     */

    function hideVideoInitForYouTubeVideo() {
        var $youTubeSource = $('source[type="video/youtube"]');

        if ($youTubeSource && $youTubeSource.length > 0) {
            $youTubeSource.closest('.component-content').find('.video-init').hide();
        }
    }

    function fixSearchBoxPlaceholders() {
        $('.textfield--float-label input').each(function () {
            if ($(this).val() !== '') {
                $(this).closest('.textfield--float-label').find('label').addClass('is-active');
            }
        });
    }

    /**
     * Initialization of the event
     */

    api.init = function () {
        var tabs = $(".tabs[class*='open-item-']");
        var accordions = $(".accordion[class*='open-item-']");
        var carousels = $('.carousel');
        var itemsFromEveryAccordion = $('.accordion .item');
        var allTabsOnPage = $('.tabs');
        var hashFromURL = window.location.hash;

        activateSelected(tabs, 'li');
        activateSelected(accordions, '.toggle-header');

        // Accordion: DISABLED auto-scroll behaviour.
        // TODO: remove when confirmed no longer needed
        // itemsFromEveryAccordion.each(subscribeToAccordionItemClickEvent);
        carousels.each(enableVerticalScrollForCarouselWrapper);

        addAnchorUrlScanForAccordion(hashFromURL, itemsFromEveryAccordion);
        addAnchorUrlScanForTabs(hashFromURL, allTabsOnPage);

        hideExceptions();

        hideVideoInitForYouTubeVideo();

        fixSearchBoxPlaceholders();
    };

    return api;
})(jQuery);

XA.ready(openOnLoad.init);


/*  sc-form-tracking  */
XA.component.SCFormTracking = (function ($) {

    var formType = $('.formpagestep').length > 0 ? "multistepform" : "standardform";

    var api = {
        initSCFormTracking: function () {
            //Track Fill-In Event tracking
            $('.sitecore-form').on('focusout', '.sc-form-group textarea, .sc-form-group input', function (e) {
                var formGroup = $(this).parent(".sc-form-group");
                var fieldLabel = $(this).prev('label').text().replace('*', '').trim();
                var self = $(this);
                var args = api.GetArgs(self);
                args['event_eventInfo_label'] = fieldLabel;
                args['event_element_elementName'] = fieldLabel;

                //Track FE-error-validations
                if (formGroup.children("span.field-validation-error").length > 0) {
                    if (formType == "standardform") {
                        args['event_eventInfo_effect'] = 'appear';
                    }
                    else
                    {
                        args['event_eventInfo_effect'] = 'error';
                        args['event_eventInfo_type'] = 'system';
                    }
                   
                    args['error_errorInfo_elementName'] = fieldLabel;
                    args['error_errorInfo_message'] = formGroup.children("span.field-validation-error").text();
                    args['error_errorInfo_type'] = 'validation-error-frontend';
                    args['error_errorInfo_sourceURL'] = window.location.href;

                    api.GetPageStepLevelAttributes(self, args);
                }
                else {
                    args['event_eventInfo_effect'] = "fill-in";
                    args['event_eventInfo_type'] = "user-interaction";
                }

                api.SubmitEventArgs(args);
            });


            //Error tracking FE validation on Form submit            
            $('.sitecore-form').on('click', 'button[type="submit"]', function (event) {
                var isErrorsOnSubmit = false;
                var self = $(this);
                var scForm = $(this).closest('.sitecore-form');

                //If type = 0, then its a final Submit Button
                //If type = 1, then its a continue button
                //If type = -1, then its a previous button
                var type = $(this).data("navigation-button");

                //No  need to check field validation when clicking on Previous button i.e type -1
                if (type == -1) {
                    api.TrackNextPreviousButtonEvent(self, type);
                }
                else {
                    $(scForm).find('input, textarea').each(function () {
                        if ($(this).data('sc-field-name') != undefined) {
                            if (($(this).val() == "" && $(this).data("val-required") !== undefined) || ($(this).data("val-regex") !== undefined && $(this).next('span').hasClass('field-validation-error'))) {
                                $(this).next('span.help-block').removeClass('field-validation-valid').addClass('field-validation-error').text($(this).data("val-required"));
                                var errorField = $(this);
                                //Self is button where clicked
                                api.TrackValidationError('validation-error-frontend', errorField, self);
                                isErrorsOnSubmit = true;
                            }
                        }
                    });
                    if (isErrorsOnSubmit == false) {
                        if (type == 0) {
                            api.TrackSubmitEvent(self);
                        }
                        else {
                            api.TrackNextPreviousButtonEvent(self, type);
                        }
                    }
                    if ($('input[type=checkbox]:checked').length == 0) {
                        event.preventDefault();
                    }
                    isErrorsOnSubmit = false;
                }
            });
        },

        GetArgs: function (self) {
            var args = {};
            var trackLevelContent = $(self).closest('form').parent().data('track-levelcontent');
            if (typeof trackLevelContent != 'undefined' & trackLevelContent != null) {
                var parsedContent = JSON.parse(JSON.stringify(trackLevelContent));
                args['component_componentInfo_componentType'] = parsedContent['component_componentInfo_componentType'];
                args['component_componentInfo_componentID'] = parsedContent['component_componentInfo_componentID'];
                args['event_category_primaryCategory'] = parsedContent['event_category_primaryCategory'];
            }
            return args;
        },

        GetPageStepLevelAttributes: function (self, args, type) {
            var pageStepAttributes = $(self).closest('form').find('.formpagestep').data('pagestep-levelcontent');
            dataAttributes = $('<div/>').html(pageStepAttributes).text();
            if (typeof dataAttributes != 'undefined' & dataAttributes != null & dataAttributes != "") {
                var parsedPageLevelAttr = JSON.parse(dataAttributes);
                args['component_componentInfo_progress_itemCurrent'] = parsedPageLevelAttr['component_componentInfo_progress_itemCurrent'];
                args['component_componentInfo_progress_itemMax'] = parsedPageLevelAttr['component_componentInfo_progress_itemMax'];
                args['component_componentInfo_progress_itemName'] = parsedPageLevelAttr['component_componentInfo_progress_itemName'];

                //Only for next and previous events
                if (type != undefined && type != 'undefined' && type != 0 && type != 2) {
                    args['event_eventInfo_effect'] = type == 1 ? "next" : "previous";
                    args['event_eventInfo_label'] = self.text();
                    args['event_eventInfo_type'] = "user-interaction";

                    var submitAttr = $(self).data('track-elementcontent');
                    submitAttr = $('<div/>').html(submitAttr).text();
                    var elementName = '';
                    if (typeof submitAttr != 'undefined' & submitAttr != null) {
                        var parsedSubmitAttr = JSON.parse(submitAttr);
                        elementName = parsedSubmitAttr['element_elementInfo_elementName'];
                    }
                    args['event_element_elementName'] = elementName;
                }

                //Only for reaching a new form step
                if (type != undefined && type != 'undefined' && type == 2) {
                    args['event_eventInfo_effect'] = "appear";
                    args['event_eventInfo_type'] = "view";
                }
            }

            return args;
        },

        TrackSubmitEvent: function (self) {
            if (typeof utag !== 'undefined') { 
                var args = api.GetArgs(self);
                var submitAttr = $(self).data('track-elementcontent');
                submitAttr = $('<div/>').html(submitAttr).text();
                var elementName = '';
                if (typeof submitAttr != 'undefined' & submitAttr != null) {
                    var parsedSubmitAttr = JSON.parse(submitAttr);
                    elementName = parsedSubmitAttr['element_elementInfo_elementName'];
                }
                args['event_eventInfo_effect'] = 'submit';
                args['event_eventInfo_label'] = 'send-request';
                args['event_eventInfo_type'] = 'user-interaction';
                args['event_element_elementName'] = elementName;

                //This is submit event hence passing type as 0 by default
                args = api.GetPageStepLevelAttributes(self, args, 0);
                api.SubmitEventArgs(args);
            }
        },

        //After successfull form submission
        TrackConfirmEvent: function (confirmFormId) {
            if (typeof utag !== 'undefined') { 
                var successFormId = "." + confirmFormId;
                var self = $(successFormId);
                var args = api.GetArgs(self);
                args['event_eventInfo_effect'] = 'complete';
                args['event_eventInfo_type'] = 'system';
                args['event_eventInfo_label'] = 'request-sent';
                var conversionDivParent = $(self).closest('form').parents('.sitecore-form');
                args['conversion_conversionInfo_conversionClass'] = conversionDivParent.find('#conversion-class').val();
                api.SubmitEventArgs(args);
            }
        },

        TrackNextPreviousButtonEvent: function (self, type) {
            if (typeof utag !== 'undefined') {
                var args = api.GetArgs(self);
                args = api.GetPageStepLevelAttributes(self, args, type);
                api.SubmitEventArgs(args);
            }
        },

        TrackReachingNewFormStep: function ($form) {
            if (typeof utag !== 'undefined') {               
                var self = $form.find('.formpagestep');
                var args = api.GetArgs(self);
                args = api.GetPageStepLevelAttributes(self, args, 2);
                api.SubmitEventArgs(args);
            }            
        },

        SubmitEventArgs: function (args) {
            if (typeof dice !== 'undefined') {
                dice(args);
            }
        },

        populateUDOCookie: function () {
            var udo_Array = {};
            if (typeof utag_data != 'undefined') {
                if (utag_data['page_pageInfo_language'] != '') {
                    udo_Array['page_pageInfo_language'] = utag_data['page_pageInfo_language'];
                }
                if (utag_data['page_category_primaryCategory'] != '') {
                    udo_Array['page_category_primaryCategory'] = utag_data['page_category_primaryCategory'];
                }
                var relUrl = $('link[rel="canonical"]').attr('href').replace(/^(?:\/\/|[^\/]+)*\//, "")
                var catCount = typeof relUrl !== 'undefined' ? relUrl.split('/').length : 0;
                if (catCount > 0) {
                    for (var n = 1; n < catCount; n++) {
                        if (utag_data['page_category_subCategory' + n] != '') {
                            udo_Array['page_category_subCategory' + n] = utag_data['page_category_subCategory' + n];
                        }
                    }
                }
                if (utag_data['platform_platformInfo_environment'] != '') {
                    udo_Array['platform_platformInfo_environment'] = utag_data['platform_platformInfo_environment'];
                }
                if (utag_data['page_pageInfo_templateType'] != '') {
                    udo_Array['page_pageInfo_templateType'] = utag_data['page_pageInfo_templateType'];
                }
                if (utag_data['content_contentInfo_author'] != '') {
                    udo_Array['content_contentInfo_author'] = utag_data['content_contentInfo_author'];
                }
                if (utag_data['content_attributes_expert'] != '') {
                    udo_Array['content_attributes_expert'] = utag_data['content_attributes_expert'];
                }
                if (utag_data['content_attributes_topic'] != '') {
                    udo_Array['content_attributes_topic'] = utag_data['content_attributes_topic'];
                }
                if (utag_data['content_contentInfo_contentType'] != '') {
                    udo_Array['content_contentInfo_contentType'] = utag_data['content_contentInfo_contentType'];
                }
                if (utag_data['content_contentInfo_publisher'] != '') {
                    udo_Array['content_contentInfo_publisher'] = utag_data['content_contentInfo_publisher'];
                }
                if (utag_data['page_attributes_refMktURL'] != '') {
                    udo_Array['page_attributes_refMktURL'] = utag_data['page_attributes_refMktURL'];
                }
                if (utag_data['platform_platformInfo_platformName'] != '') {
                    udo_Array['platform_platformInfo_platformName'] = utag_data['platform_platformInfo_platformName'];
                }
            }

            var utagDataVal = XA.cookies.readCookie('sc_form_udo');
            if (typeof utagDataVal != 'undefined' && utagDataVal != null) {
                api.deleteCookie('sc_form_udo');
            }
            XA.cookies.createCookie('sc_form_udo', JSON.stringify(udo_Array), 1);
        },

        checkIfThankYouPage: function () {
            var utagData = XA.cookies.readCookie('sc_form_udo');
            if (typeof utagData != 'undefined' && utagData != '') {
                api.deleteCookie('sc_form_udo');
                var udoArgs = utagData.replace(/"/g, '\'');
                dice(udoArgs);
                
            }
        },     

        TrackValidationError: function (valType, errorField, self) {
            if (typeof utag !== 'undefined') {
                var args = api.GetArgs(self);
                var fieldLabel = $(errorField).prev('label').text().replace('*', '').trim();

                if (formType == "standardform")
                {
                    args['event_eventInfo_effect'] = 'appear';
                }
                else
                {
                    args['event_eventInfo_effect'] = 'error';
                }
                
                args['event_eventInfo_type '] = 'system';
                args['event_eventInfo_label'] = fieldLabel;
                args['event_element_elementName'] = fieldLabel;
                args['error_errorInfo_elementName'] = fieldLabel;
                args['error_errorInfo_message'] = $(errorField).next("span.field-validation-error").text();
                args['error_errorInfo_type'] = valType;

                args['error_errorInfo_sourceURL'] = window.location.href;

                args = api.GetPageStepLevelAttributes(self, args);
                dice(args);               
            }
        },

        deleteCookie: function (cookieKey) {
            document.cookie = cookieKey + '=; expires=Thu, 01-Jan-70 00:00:01 GMT;path=/';
        }
    };

    api.init = function () {
        try {
            if (typeof $('form').data('sc-fxb') !== 'undefined') {
                if (typeof utag != 'undefined' & utag != null) 
                    this.api.initSCFormTracking();                         
            }
            else {
                api.checkIfThankYouPage();
            }
        } catch (e) {
            if (e instanceof ReferenceError) {
                console.log('utag is not defined');
            };
        }
    };
    return api;
})(jQuery, document);
XA.register("SCFormTracking", XA.component.SCFormTracking);

/*  sc-media-tracking  */
XA.component.SCMediaTracking = (function ($) {
    var api = {
        initSCMediaTracking: function () {
            $('document').ready(function () {
                setTimeout(function () {
                    try {
                        if (typeof window.videojs !== 'undefined') {
                            window.videojs.getAllPlayers().forEach(function (player) {
                                //console.log(player.mediainfo);

                                player.on('play', function (evt) {
                                    if (api.ConvertToAnalyticsFormat(this.cache_.currentTime) != '00:00:00') {
                                        var args = api.GetBrighcoveArgs(this);
                                        args['event_eventInfo_effect'] = 'resume';
                                        api.SubmitEvent(args);
                                    }
                                });
                                player.on('firstplay', function (evt) {
                                    var args = api.GetBrighcoveArgs(this);
                                    args['event_eventInfo_effect'] = 'start';
                                    api.SubmitEvent(args);
                                });
                                player.on('pause', function (evt) {
                                    // console.log('pause event', this);
                                    var args = api.GetBrighcoveArgs(this);
                                    args['event_eventInfo_effect'] = 'pause';
                                    api.SubmitEvent(args);
                                });
                                player.on('seek', function (evt) {
                                    // console.log('seek event', this);
                                    var args = api.GetBrighcoveArgs(this);
                                    args['event_eventInfo_effect'] = 'seek';
                                    api.SubmitEvent(args);
                                });
                                player.on('ended', function (evt) {
                                    //console.log('ended event', this);
                                    var args = api.GetBrighcoveArgs(this);
                                    args['event_eventInfo_effect'] = 'complete';
                                    api.SubmitEvent(args);
                                });
                            });
                        }

                    } catch (e) {
                        if (e instanceof ReferenceError) {
                            console.log('videojs is not loaded');
                        };
                    }

                }, 3000);

                try {
                    if (typeof mejs !== 'undefined') {
                        $.each(mejs.players, function (index) {
                            //console.log(index);
                            var mePlayer = mejs.players[index];
                            mePlayer.media.addEventListener('play', function (e) {
                                //console.log('play');
                                var args = api.GetYouTubeArgs(e.detail.target);
                                if (api.ConvertToAnalyticsFormat(e.detail.target.getCurrentTime()) != '00:00:00') {
                                    args['event_eventInfo_effect'] = 'resume';
                                }
                                else {
                                    args['event_eventInfo_effect'] = 'start';
                                }
                                api.SubmitEvent(args);
                            });
                            mePlayer.media.addEventListener('pause', function (e) {
                                //console.log("paused");
                                var args = api.GetYouTubeArgs(e.detail.target);
                                args['event_eventInfo_effect'] = 'pause';
                                api.SubmitEvent(args);
                            });
                            mePlayer.media.addEventListener('ended', function (e) {
                                // console.log("ended");
                                var args = api.GetYouTubeArgs(e.detail.target);
                                args['event_eventInfo_effect'] = 'complete';
                                api.SubmitEvent(args);
                            });
                            mePlayer.media.addEventListener('seeked', function (e) {
                                // console.log("seeked");
                                var args = api.GetYouTubeArgs(e.detail.target);
                                args['event_eventInfo_effect'] = 'seek';
                                api.SubmitEvent(args);
                            });
                        });
                    }
                }
                catch (e) {
                    if (e instanceof ReferenceError) {
                        console.log('mejs is not loaded');
                    };
                }

            });
        },
        GetBrighcoveArgs: function (self) {
            var args = {};

            args['event_category_primaryCategory'] = 'media';
            args['event_eventInfo_effect'] = '';
            args['event_eventInfo_type'] = 'user-interaction';
            args['event_media_position'] = api.ConvertToAnalyticsFormat(self.cache_.currentTime);
            args['content_media_length'] = api.ConvertToAnalyticsFormat(self.mediainfo.duration);
            args['content_media_fileName'] = self.mediainfo.id //cant find attribute
            args['content_media_fileTitle'] = self.mediainfo.name
            args['client_device_media_playerName'] = 'brightcove';

            return args;
        },
        GetYouTubeArgs: function (self) {
            var args = {};

            args['event_category_primaryCategory'] = 'media';
            args['event_eventInfo_effect'] = '';
            args['event_eventInfo_type'] = 'user-interaction';
            args['event_media_position'] = api.ConvertToAnalyticsFormat(self.getCurrentTime());
            args['content_media_length'] = api.ConvertToAnalyticsFormat(self.getDuration());
            args['content_media_fileName'] = self.getSrc();
            args['content_media_fileTitle'] = self.getSrc(); //cant find attribute
            args['client_device_media_playerName'] = 'youtube';

            return args;
        },
        SubmitEvent: function (args) {
            if (typeof dice !== 'undefined') {
                dice(args);
            }
        },
        ConvertToAnalyticsFormat(self) {
            return new Date(self * 1000).toISOString().substr(11, 8)
        }
    };

    api.init = function () {
        try {
            //Youtube or brightove
            if (typeof $('video') !== 'undefined') {
                if (typeof utag != 'undefined' & utag != null)
                    this.api.initSCMediaTracking();
            }
        } catch (e) {
            if (e instanceof ReferenceError) {
                console.log('utag is not defined');
            };
        }
    };
    return api;
})(jQuery, document);
XA.register("SCMediaTracking", XA.component.SCMediaTracking);

/*  search-action-tracking  */
XA.component.SearchActionTracking = (function ($) {
    var paginationCount = 1;
    var initialLoad = true;
    var isSortOrderSelected = false;

    var api = {
        initSearchActionTracking: function () {
            $('.search-area-wrapper .facet-dropdown-select').on('change', function () {
                isSortOrderSelected = true;
            });

            XA.component.search.vent.on("results-loaded",
                function (i) {
                    if (isSortOrderSelected == false) {
                        api.TrackSearch(i);
                    }
                    isSortOrderSelected = false; //Setting isSortOrderSelected to false
                });
        },

        TrackSearch: function (results) {
            var args = api.GetArgs(results);
            if (results.loadMore != 'undefined' & results.loadMore) {
                var displayedResults = results.offset > 0 ? results.offset + results.pageSize : results.data.length;
                if (displayedResults > results.dataCount) {
                    displayedResults = results.dataCount;
                }
                args['filter_result_numberDisplayed'] = displayedResults;
                paginationCount = paginationCount + 1;
                args['filter_result_iteration'] = paginationCount;
                args['filter_filterInfo_type'] = $('.search-results').hasClass('global-search-results') ? 'general' : 'section';
                args['event_eventInfo_effect'] = 'pagination';
            }
            else {
                args['event_eventInfo_effect'] = 'appear';
                args['filter_filterInfo_type'] = $('.search-results').hasClass('global-search-results') ? 'general' : 'section';
                args['filter_result_iteration'] = paginationCount = 1;
                args['filter_result_numberDisplayed'] = results.data.length;
            }

            if (typeof utag != 'undefined' & utag != null) {
                utag.link(args);
            }
        },

        GetArgs: function (results) {
            var args = {};
            args['event_attributes_eventType'] = "view";
            args['event_category_primaryCategory'] = "filter";
            args['event_eventInfo_label'] = 'filter_appear';
            args['filter_result_numberReturned'] = results.dataCount;
            args['filter_filterInfo_logic'] = '';

            if (initialLoad) {
                initialLoad = false;
                var searchInput = utag_data['filter_filterInfo_userInput'] !== undefined ? utag_data['filter_filterInfo_userInput'] : '';
                args['filter_filterInfo_term'] = searchInput;
                args['filter_filterInfo_userInput'] = searchInput;
                if (searchInput != '') {
                    args['filter_element_elementName'] = 'freetext';
                    args['filter_element_elementValue'] = 'userinput';
                    args['filter_filterInfo_logic'] = 'literal';
                }
            }
            else {
                var searchInput = encodeURIComponent($('.search-box-input').last().val());
                searchInput = (searchInput !== '' && searchInput !== undefined) ? searchInput : '';
                args['filter_filterInfo_term'] = args['filter_filterInfo_userInput'] = searchInput;
                if (searchInput != '') {
                    args['filter_element_elementName'] = 'freetext';
                    args['filter_element_elementValue'] = 'userinput';
                    args['filter_filterInfo_logic'] = 'literal';
                }

                if (window.location.hash !== '') {
                    //Filter Event tracking
                    if ($('.facet-value').hasClass('active-facet')) {
                        var elementName = [];
                        var elementValue = [];

                        if (searchInput !== '') {
                            elementName.push('freetext');
                            elementValue.push('userinput');
                        }

                        $('.active-facet').each(function () {
                            elementName.push(decodeURIComponent($(this).closest('.contentContainer').parent().find('.facet-title').text().trim()));
                            elementValue.push(decodeURIComponent($(this).data('facetvalue')));
                        });
                        args['filter_element_elementName'] = elementName;
                        args['filter_element_elementValue'] = elementValue;
                    }
                }
                else {
                    args['filter_filterInfo_term'] = '';
                    args['filter_filterInfo_userInput'] = '';
                }
            }

            return args;
        }
    };

    api.init = function () {
        try {
            if ($('.search-results').length) {
                if (typeof utag != 'undefined' & utag != null)
                    this.api.initSearchActionTracking();
            }
        } catch (e) {
            if (e instanceof ReferenceError) {
                console.log('utag is not defined - source: Search-action-tracking.js');
            };
        }
    };
    return api;
})(jQuery, document);
XA.register("SearchActionTracking", XA.component.SearchActionTracking);

/*  search-box  */
var searchBox = (function($) {
    var api = {};
    api.process = function() {

    };
    return api;
})(jQuery);
  
XA.registerOnPreInitHandler(searchBox);

/*  search-filter  */
XA.component.showMoreShowLess = (function ($) {
  var api = {
    initializeClickEvents: function () {
      $('.facet-showmore').on('click', function () {
        var parentFilter = this.closest(".facet-single-selection-list"),
          categoryRow = $(".facet-search-filter", parentFilter).find("p");

        $(this).hide();

        for (var i = 4; i < categoryRow.length; i++) {
          $(categoryRow[i]).show();
        }

        $('.facet-showless', parentFilter).show();
      });

      $('.facet-showless').on('click', function () {
        var parentFilter = this.closest(".facet-single-selection-list"),
          categoryRow = $(".facet-search-filter", parentFilter).find("p");

        $(this).hide();

        for (var i = 4; i < categoryRow.length; i++) {
          $(categoryRow[i]).hide();
        }

        $('.facet-showmore', parentFilter).show();
      });
    },

    /**
     * Check if final URL parameter is a year. If so, run search again
     */
    triggerChange: function () {
      setTimeout(function () {
        var href = window.location.href;
        var param = href.substr(href.lastIndexOf('/') + 1);
        var hasHash = param.indexOf('#');
        var paramClean = param.substring(0, hasHash != -1 ? hasHash : param.length);

        if (paramClean && paramClean.length === 4 && $.isNumeric(paramClean)) {
          $('.facet-dropdown-select').val(paramClean).trigger('change');
        }
      }, 1000);
    }
  };

  api.init = function () {

    this.api.triggerChange();



    // Hides the show more and show less buttons in the first initialization of the page
    $(".facet-single-selection-list").find(".facet-showmore").hide();
    $(".facet-single-selection-list").find(".facet-showless").hide();

    // Add hidden clear filter to single selection facet filters
    $('.facet-single-selection-list').each(function () {
      if (
        ($(this).attr('data-properties').indexOf('"multi":false') >= 0)
        &&
        ($(this).find('.bottom-remove-filter').length <= 0)
      ) {
        $(this).append('<div class="bottom-remove-filter d-none"><button>Clear</button></div>');
      }
    });

    // Handles the event where the filter categories are loaded.
    XA.component.search.vent.on("facet-data-filtered", function () {
      // Handles whether show more and show less buttons are displayed or not. 

      $(".facet-single-selection-list").each(function () {
        var isShowMoreVisible = true,
          isShowLessVisible = false;

        if (isShowMoreVisible && !isShowLessVisible) {
          if ($(".facet-search-filter", this).find("p").length > 4) {
            var categoryRow = $(".facet-search-filter", this).find("p");
            for (var i = 4; i < categoryRow.length; i++) {
              $(categoryRow[i]).hide();
            }

            $('.facet-showless', this).hide();

            $('.facet-showmore', this).show();
          } else {
            $('.facet-showmore, .facet-showless').hide();
          }
        }

        // Handles whether show more and show less buttons are displayed or not.
        if (!isShowMoreVisible && isShowLessVisible) {
          if ($(".facet-search-filter", this).find("p").length > 4) {
            $('.facet-showless', this).show();
            $('.facet-showmore', this).hide();
          }
        }

        $('a.reset-filter').on('click', function () {
          if ($(this).hasClass('active')) {
            $(this).removeClass('active');
          }
          $('.facet-value').removeClass('active-facet');
        });

        // Filter button enabling in multi select checklist filter
        if ($('.facet-single-selection-list').attr('data-properties').indexOf('"multi":false') >= 0) {
          $('.bottom-filter-button').hide();
        } else {
          $('.bottom-filter-button').show();
        }

        // Tracks when user clicks on the filter category
        $('.facet-value').on('click', function () {
          $('.reset-filter').addClass('active');
          // Second click to filter category for resetting
          if ($(this).hasClass('active-facet')) {
            if ($('.facet-single-selection-list').attr('data-properties').indexOf('"multi":false') >= 0) {
              // $(this).addClass('clear-filter');
              $(this).closest('.facet-single-selection-list').find('.bottom-remove-filter button').click();
              $('.reset-filter').removeClass('active');
            } else {
              setTimeout(function () {
                if ($('.facet-value.active-facet').length > 0) {
                  $('.reset-filter').addClass('active');
                } else {
                  $('.reset-filter').removeClass('active');
                }
              }, 400);
            }
          }
          // First click to filter category to select and filter out the results
          else {
            var parentFilter = this.closest(".facet-single-selection-list");
            if ($(".facet-search-filter", parentFilter).find("p").length > 4) {
              if ($('.facet-showmore', parentFilter).is(':visible') && $('.facet-showless', parentFilter).is(':hidden')) {
                isShowMoreVisible = true;
                isShowLessVisible = false;
              }

              else if ($('.facet-showless', parentFilter).is(':visible') && $('.facet-showmore', parentFilter).is(':hidden')) {
                isShowLessVisible = true;
                isShowMoreVisible = false;
              }
            }
          }

          if ($('.facet-showmore', parentFilter).is(':visible') || $('.facet-showless', parentFilter).is(':visible')) {
            $('.facet-showmore', parentFilter).hide();
            $('.facet-showless', parentFilter).hide();
          }
        });
      });
    });

    // Click event register for show more and show less buttons
    this.api.initializeClickEvents();
  };

  return api;
})(jQuery, document);

XA.register('showMoreShowLess', XA.component.showMoreShowLess);

/*  search-results-pagesize  */
// Inject values in the search component's properties
var prepareSearchResults = (function ($) {

  var QUERY_Q = 'q';
  var api = {};

  api.process = function () {
    XA.component.search.vent.on("results-loaded", function (results) {
      if ($(".search-results-count").find(".results-count").length !== 0) {
        $(".search-results-count").find(".results-count").html(
          $(".search-results-count").find(".results-count").html().replace('{pageSize}', $('ul.search-result-list > li').length));

        var result_phrase = '',
          search_phrase = $('.search-box-input.tt-input').val(),
          sortby_value = ($('.facet-dropdown-select').val() === 'Everything' ? 'All' : $('.facet-dropdown-select').val());

        if (sortby_value) {
          if (search_phrase) {
            result_phrase = sortby_value + ', ' + search_phrase;
          } else {
            result_phrase = sortby_value;
          }
        } else {
          result_phrase = search_phrase || 'All';
        }

        // Append search filter values to results text
        var dataProperties = $('#content .search-box').data('properties');
        var signature = '';
        
        if (dataProperties && dataProperties.targetSignature) {
          signature = dataProperties.targetSignature + '_';
        }

        var pageQueryString = getParameterByName(signature + QUERY_Q);

        if (pageQueryString) {
          result_phrase = pageQueryString; // Search query filter text (overrides all others)
        }

        // Append facet category filter to results text if applicable
        var facetDataProperties = $('#content .facet-single-selection-list').data('properties');
        
        if (facetDataProperties && (facetDataProperties.f && facetDataProperties.searchResultsSignature)) {
          var facetSignature = facetDataProperties.searchResultsSignature + '_' + facetDataProperties.f;
          var pageContentQuery = getParameterByName(facetSignature.toLowerCase());
  
          if (pageContentQuery) {
            result_phrase = pageContentQuery; // Category filter text
          }
        }

        $(".search-results-count").find(".results-count").html(
          $(".search-results-count").find(".results-count").html().replace('{searchText}', result_phrase));
      } else {
        return;
      }
    });
  };
  return api;
})(jQuery);

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  var decodedValue = decodeURIComponent(results[2].replace(/\+/g, ' '));
  return sanitizeHTML(decodedValue);
}

function sanitizeHTML(str) {
	var temp = document.createElement('div');
	temp.textContent = str;
	return temp.innerHTML;
};

XA.registerOnPreInitHandler(prepareSearchResults);


/*  search-show-hide-filters  */
XA.component.showHideFilters = (function ($) {
  var api = {};

  api.init = function () {
    var $filters = $('.checklist-filter-wrapper');

    $('.js-nav-drawer-trigger').on('click', function(e) {
      e.preventDefault();
      $filters.css('transform', 'translate3d(0,0,0)');
    });

    $('.navigation-drawer__close').on('click', function(e) {
      e.preventDefault();
      $filters.css('transform', 'translate3d(100%,0,0)');
    });
  };

  return api;
})(jQuery, document);

XA.register('showHideFilters', XA.component.showHideFilters);

/*  select2_min  */
/*! Select2 4.0.6-rc.1 | https://github.com/select2/select2/blob/master/LICENSE.md */!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof module&&module.exports?module.exports=function(b,c){return void 0===c&&(c="undefined"!=typeof window?require("jquery"):require("jquery")(b)),a(c),c}:a(jQuery)}(function(a){var b=function(){if(a&&a.fn&&a.fn.select2&&a.fn.select2.amd)var b=a.fn.select2.amd;var b;return function(){if(!b||!b.requirejs){b?c=b:b={};var a,c,d;!function(b){function e(a,b){return v.call(a,b)}function f(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o=b&&b.split("/"),p=t.map,q=p&&p["*"]||{};if(a){for(a=a.split("/"),g=a.length-1,t.nodeIdCompat&&x.test(a[g])&&(a[g]=a[g].replace(x,"")),"."===a[0].charAt(0)&&o&&(n=o.slice(0,o.length-1),a=n.concat(a)),k=0;k<a.length;k++)if("."===(m=a[k]))a.splice(k,1),k-=1;else if(".."===m){if(0===k||1===k&&".."===a[2]||".."===a[k-1])continue;k>0&&(a.splice(k-1,2),k-=2)}a=a.join("/")}if((o||q)&&p){for(c=a.split("/"),k=c.length;k>0;k-=1){if(d=c.slice(0,k).join("/"),o)for(l=o.length;l>0;l-=1)if((e=p[o.slice(0,l).join("/")])&&(e=e[d])){f=e,h=k;break}if(f)break;!i&&q&&q[d]&&(i=q[d],j=k)}!f&&i&&(f=i,h=j),f&&(c.splice(0,h,f),a=c.join("/"))}return a}function g(a,c){return function(){var d=w.call(arguments,0);return"string"!=typeof d[0]&&1===d.length&&d.push(null),o.apply(b,d.concat([a,c]))}}function h(a){return function(b){return f(b,a)}}function i(a){return function(b){r[a]=b}}function j(a){if(e(s,a)){var c=s[a];delete s[a],u[a]=!0,n.apply(b,c)}if(!e(r,a)&&!e(u,a))throw new Error("No "+a);return r[a]}function k(a){var b,c=a?a.indexOf("!"):-1;return c>-1&&(b=a.substring(0,c),a=a.substring(c+1,a.length)),[b,a]}function l(a){return a?k(a):[]}function m(a){return function(){return t&&t.config&&t.config[a]||{}}}var n,o,p,q,r={},s={},t={},u={},v=Object.prototype.hasOwnProperty,w=[].slice,x=/\.js$/;p=function(a,b){var c,d=k(a),e=d[0],g=b[1];return a=d[1],e&&(e=f(e,g),c=j(e)),e?a=c&&c.normalize?c.normalize(a,h(g)):f(a,g):(a=f(a,g),d=k(a),e=d[0],a=d[1],e&&(c=j(e))),{f:e?e+"!"+a:a,n:a,pr:e,p:c}},q={require:function(a){return g(a)},exports:function(a){var b=r[a];return void 0!==b?b:r[a]={}},module:function(a){return{id:a,uri:"",exports:r[a],config:m(a)}}},n=function(a,c,d,f){var h,k,m,n,o,t,v,w=[],x=typeof d;if(f=f||a,t=l(f),"undefined"===x||"function"===x){for(c=!c.length&&d.length?["require","exports","module"]:c,o=0;o<c.length;o+=1)if(n=p(c[o],t),"require"===(k=n.f))w[o]=q.require(a);else if("exports"===k)w[o]=q.exports(a),v=!0;else if("module"===k)h=w[o]=q.module(a);else if(e(r,k)||e(s,k)||e(u,k))w[o]=j(k);else{if(!n.p)throw new Error(a+" missing "+k);n.p.load(n.n,g(f,!0),i(k),{}),w[o]=r[k]}m=d?d.apply(r[a],w):void 0,a&&(h&&h.exports!==b&&h.exports!==r[a]?r[a]=h.exports:m===b&&v||(r[a]=m))}else a&&(r[a]=d)},a=c=o=function(a,c,d,e,f){if("string"==typeof a)return q[a]?q[a](c):j(p(a,l(c)).f);if(!a.splice){if(t=a,t.deps&&o(t.deps,t.callback),!c)return;c.splice?(a=c,c=d,d=null):a=b}return c=c||function(){},"function"==typeof d&&(d=e,e=f),e?n(b,a,c,d):setTimeout(function(){n(b,a,c,d)},4),o},o.config=function(a){return o(a)},a._defined=r,d=function(a,b,c){if("string"!=typeof a)throw new Error("See almond README: incorrect module build, no module name");b.splice||(c=b,b=[]),e(r,a)||e(s,a)||(s[a]=[a,b,c])},d.amd={jQuery:!0}}(),b.requirejs=a,b.require=c,b.define=d}}(),b.define("almond",function(){}),b.define("jquery",[],function(){var b=a||$;return null==b&&console&&console.error&&console.error("Select2: An instance of jQuery or a jQuery-compatible library was not found. Make sure that you are including jQuery before Select2 on your web page."),b}),b.define("select2/utils",["jquery"],function(a){function b(a){var b=a.prototype,c=[];for(var d in b){"function"==typeof b[d]&&("constructor"!==d&&c.push(d))}return c}var c={};c.Extend=function(a,b){function c(){this.constructor=a}var d={}.hasOwnProperty;for(var e in b)d.call(b,e)&&(a[e]=b[e]);return c.prototype=b.prototype,a.prototype=new c,a.__super__=b.prototype,a},c.Decorate=function(a,c){function d(){var b=Array.prototype.unshift,d=c.prototype.constructor.length,e=a.prototype.constructor;d>0&&(b.call(arguments,a.prototype.constructor),e=c.prototype.constructor),e.apply(this,arguments)}function e(){this.constructor=d}var f=b(c),g=b(a);c.displayName=a.displayName,d.prototype=new e;for(var h=0;h<g.length;h++){var i=g[h];d.prototype[i]=a.prototype[i]}for(var j=(function(a){var b=function(){};a in d.prototype&&(b=d.prototype[a]);var e=c.prototype[a];return function(){return Array.prototype.unshift.call(arguments,b),e.apply(this,arguments)}}),k=0;k<f.length;k++){var l=f[k];d.prototype[l]=j(l)}return d};var d=function(){this.listeners={}};d.prototype.on=function(a,b){this.listeners=this.listeners||{},a in this.listeners?this.listeners[a].push(b):this.listeners[a]=[b]},d.prototype.trigger=function(a){var b=Array.prototype.slice,c=b.call(arguments,1);this.listeners=this.listeners||{},null==c&&(c=[]),0===c.length&&c.push({}),c[0]._type=a,a in this.listeners&&this.invoke(this.listeners[a],b.call(arguments,1)),"*"in this.listeners&&this.invoke(this.listeners["*"],arguments)},d.prototype.invoke=function(a,b){for(var c=0,d=a.length;c<d;c++)a[c].apply(this,b)},c.Observable=d,c.generateChars=function(a){for(var b="",c=0;c<a;c++){b+=Math.floor(36*Math.random()).toString(36)}return b},c.bind=function(a,b){return function(){a.apply(b,arguments)}},c._convertData=function(a){for(var b in a){var c=b.split("-"),d=a;if(1!==c.length){for(var e=0;e<c.length;e++){var f=c[e];f=f.substring(0,1).toLowerCase()+f.substring(1),f in d||(d[f]={}),e==c.length-1&&(d[f]=a[b]),d=d[f]}delete a[b]}}return a},c.hasScroll=function(b,c){var d=a(c),e=c.style.overflowX,f=c.style.overflowY;return(e!==f||"hidden"!==f&&"visible"!==f)&&("scroll"===e||"scroll"===f||(d.innerHeight()<c.scrollHeight||d.innerWidth()<c.scrollWidth))},c.escapeMarkup=function(a){var b={"\\":"&#92;","&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#47;"};return"string"!=typeof a?a:String(a).replace(/[&<>"'\/\\]/g,function(a){return b[a]})},c.appendMany=function(b,c){if("1.7"===a.fn.jquery.substr(0,3)){var d=a();a.map(c,function(a){d=d.add(a)}),c=d}b.append(c)},c.__cache={};var e=0;return c.GetUniqueElementId=function(a){var b=a.getAttribute("data-select2-id");return null==b&&(a.id?(b=a.id,a.setAttribute("data-select2-id",b)):(a.setAttribute("data-select2-id",++e),b=e.toString())),b},c.StoreData=function(a,b,d){var e=c.GetUniqueElementId(a);c.__cache[e]||(c.__cache[e]={}),c.__cache[e][b]=d},c.GetData=function(b,d){var e=c.GetUniqueElementId(b);return d?c.__cache[e]&&null!=c.__cache[e][d]?c.__cache[e][d]:a(b).data(d):c.__cache[e]},c.RemoveData=function(a){var b=c.GetUniqueElementId(a);null!=c.__cache[b]&&delete c.__cache[b]},c}),b.define("select2/results",["jquery","./utils"],function(a,b){function c(a,b,d){this.$element=a,this.data=d,this.options=b,c.__super__.constructor.call(this)}return b.Extend(c,b.Observable),c.prototype.render=function(){var b=a('<ul class="select2-results__options" role="tree"></ul>');return this.options.get("multiple")&&b.attr("aria-multiselectable","true"),this.$results=b,b},c.prototype.clear=function(){this.$results.empty()},c.prototype.displayMessage=function(b){var c=this.options.get("escapeMarkup");this.clear(),this.hideLoading();var d=a('<li role="treeitem" aria-live="assertive" class="select2-results__option"></li>'),e=this.options.get("translations").get(b.message);d.append(c(e(b.args))),d[0].className+=" select2-results__message",this.$results.append(d)},c.prototype.hideMessages=function(){this.$results.find(".select2-results__message").remove()},c.prototype.append=function(a){this.hideLoading();var b=[];if(null==a.results||0===a.results.length)return void(0===this.$results.children().length&&this.trigger("results:message",{message:"noResults"}));a.results=this.sort(a.results);for(var c=0;c<a.results.length;c++){var d=a.results[c],e=this.option(d);b.push(e)}this.$results.append(b)},c.prototype.position=function(a,b){b.find(".select2-results").append(a)},c.prototype.sort=function(a){return this.options.get("sorter")(a)},c.prototype.highlightFirstItem=function(){var a=this.$results.find(".select2-results__option[aria-selected]"),b=a.filter("[aria-selected=true]");b.length>0?b.first().trigger("mouseenter"):a.first().trigger("mouseenter"),this.ensureHighlightVisible()},c.prototype.setClasses=function(){var c=this;this.data.current(function(d){var e=a.map(d,function(a){return a.id.toString()});c.$results.find(".select2-results__option[aria-selected]").each(function(){var c=a(this),d=b.GetData(this,"data"),f=""+d.id;null!=d.element&&d.element.selected||null==d.element&&a.inArray(f,e)>-1?c.attr("aria-selected","true"):c.attr("aria-selected","false")})})},c.prototype.showLoading=function(a){this.hideLoading();var b=this.options.get("translations").get("searching"),c={disabled:!0,loading:!0,text:b(a)},d=this.option(c);d.className+=" loading-results",this.$results.prepend(d)},c.prototype.hideLoading=function(){this.$results.find(".loading-results").remove()},c.prototype.option=function(c){var d=document.createElement("li");d.className="select2-results__option";var e={role:"treeitem","aria-selected":"false"};c.disabled&&(delete e["aria-selected"],e["aria-disabled"]="true"),null==c.id&&delete e["aria-selected"],null!=c._resultId&&(d.id=c._resultId),c.title&&(d.title=c.title),c.children&&(e.role="group",e["aria-label"]=c.text,delete e["aria-selected"]);for(var f in e){var g=e[f];d.setAttribute(f,g)}if(c.children){var h=a(d),i=document.createElement("strong");i.className="select2-results__group";a(i);this.template(c,i);for(var j=[],k=0;k<c.children.length;k++){var l=c.children[k],m=this.option(l);j.push(m)}var n=a("<ul></ul>",{class:"select2-results__options select2-results__options--nested"});n.append(j),h.append(i),h.append(n)}else this.template(c,d);return b.StoreData(d,"data",c),d},c.prototype.bind=function(c,d){var e=this,f=c.id+"-results";this.$results.attr("id",f),c.on("results:all",function(a){e.clear(),e.append(a.data),c.isOpen()&&(e.setClasses(),e.highlightFirstItem())}),c.on("results:append",function(a){e.append(a.data),c.isOpen()&&e.setClasses()}),c.on("query",function(a){e.hideMessages(),e.showLoading(a)}),c.on("select",function(){c.isOpen()&&(e.setClasses(),e.highlightFirstItem())}),c.on("unselect",function(){c.isOpen()&&(e.setClasses(),e.highlightFirstItem())}),c.on("open",function(){e.$results.attr("aria-expanded","true"),e.$results.attr("aria-hidden","false"),e.setClasses(),e.ensureHighlightVisible()}),c.on("close",function(){e.$results.attr("aria-expanded","false"),e.$results.attr("aria-hidden","true"),e.$results.removeAttr("aria-activedescendant")}),c.on("results:toggle",function(){var a=e.getHighlightedResults();0!==a.length&&a.trigger("mouseup")}),c.on("results:select",function(){var a=e.getHighlightedResults();if(0!==a.length){var c=b.GetData(a[0],"data");"true"==a.attr("aria-selected")?e.trigger("close",{}):e.trigger("select",{data:c})}}),c.on("results:previous",function(){var a=e.getHighlightedResults(),b=e.$results.find("[aria-selected]"),c=b.index(a);if(!(c<=0)){var d=c-1;0===a.length&&(d=0);var f=b.eq(d);f.trigger("mouseenter");var g=e.$results.offset().top,h=f.offset().top,i=e.$results.scrollTop()+(h-g);0===d?e.$results.scrollTop(0):h-g<0&&e.$results.scrollTop(i)}}),c.on("results:next",function(){var a=e.getHighlightedResults(),b=e.$results.find("[aria-selected]"),c=b.index(a),d=c+1;if(!(d>=b.length)){var f=b.eq(d);f.trigger("mouseenter");var g=e.$results.offset().top+e.$results.outerHeight(!1),h=f.offset().top+f.outerHeight(!1),i=e.$results.scrollTop()+h-g;0===d?e.$results.scrollTop(0):h>g&&e.$results.scrollTop(i)}}),c.on("results:focus",function(a){a.element.addClass("select2-results__option--highlighted")}),c.on("results:message",function(a){e.displayMessage(a)}),a.fn.mousewheel&&this.$results.on("mousewheel",function(a){var b=e.$results.scrollTop(),c=e.$results.get(0).scrollHeight-b+a.deltaY,d=a.deltaY>0&&b-a.deltaY<=0,f=a.deltaY<0&&c<=e.$results.height();d?(e.$results.scrollTop(0),a.preventDefault(),a.stopPropagation()):f&&(e.$results.scrollTop(e.$results.get(0).scrollHeight-e.$results.height()),a.preventDefault(),a.stopPropagation())}),this.$results.on("mouseup",".select2-results__option[aria-selected]",function(c){var d=a(this),f=b.GetData(this,"data");if("true"===d.attr("aria-selected"))return void(e.options.get("multiple")?e.trigger("unselect",{originalEvent:c,data:f}):e.trigger("close",{}));e.trigger("select",{originalEvent:c,data:f})}),this.$results.on("mouseenter",".select2-results__option[aria-selected]",function(c){var d=b.GetData(this,"data");e.getHighlightedResults().removeClass("select2-results__option--highlighted"),e.trigger("results:focus",{data:d,element:a(this)})})},c.prototype.getHighlightedResults=function(){return this.$results.find(".select2-results__option--highlighted")},c.prototype.destroy=function(){this.$results.remove()},c.prototype.ensureHighlightVisible=function(){var a=this.getHighlightedResults();if(0!==a.length){var b=this.$results.find("[aria-selected]"),c=b.index(a),d=this.$results.offset().top,e=a.offset().top,f=this.$results.scrollTop()+(e-d),g=e-d;f-=2*a.outerHeight(!1),c<=2?this.$results.scrollTop(0):(g>this.$results.outerHeight()||g<0)&&this.$results.scrollTop(f)}},c.prototype.template=function(b,c){var d=this.options.get("templateResult"),e=this.options.get("escapeMarkup"),f=d(b,c);null==f?c.style.display="none":"string"==typeof f?c.innerHTML=e(f):a(c).append(f)},c}),b.define("select2/keys",[],function(){return{BACKSPACE:8,TAB:9,ENTER:13,SHIFT:16,CTRL:17,ALT:18,ESC:27,SPACE:32,PAGE_UP:33,PAGE_DOWN:34,END:35,HOME:36,LEFT:37,UP:38,RIGHT:39,DOWN:40,DELETE:46}}),b.define("select2/selection/base",["jquery","../utils","../keys"],function(a,b,c){function d(a,b){this.$element=a,this.options=b,d.__super__.constructor.call(this)}return b.Extend(d,b.Observable),d.prototype.render=function(){var c=a('<span class="select2-selection" role="combobox"  aria-haspopup="true" aria-expanded="false"></span>');return this._tabindex=0,null!=b.GetData(this.$element[0],"old-tabindex")?this._tabindex=b.GetData(this.$element[0],"old-tabindex"):null!=this.$element.attr("tabindex")&&(this._tabindex=this.$element.attr("tabindex")),c.attr("title",this.$element.attr("title")),c.attr("tabindex",this._tabindex),this.$selection=c,c},d.prototype.bind=function(a,b){var d=this,e=(a.id,a.id+"-results");this.container=a,this.$selection.on("focus",function(a){d.trigger("focus",a)}),this.$selection.on("blur",function(a){d._handleBlur(a)}),this.$selection.on("keydown",function(a){d.trigger("keypress",a),a.which===c.SPACE&&a.preventDefault()}),a.on("results:focus",function(a){d.$selection.attr("aria-activedescendant",a.data._resultId)}),a.on("selection:update",function(a){d.update(a.data)}),a.on("open",function(){d.$selection.attr("aria-expanded","true"),d.$selection.attr("aria-owns",e),d._attachCloseHandler(a)}),a.on("close",function(){d.$selection.attr("aria-expanded","false"),d.$selection.removeAttr("aria-activedescendant"),d.$selection.removeAttr("aria-owns"),d.$selection.focus(),window.setTimeout(function(){d.$selection.focus()},0),d._detachCloseHandler(a)}),a.on("enable",function(){d.$selection.attr("tabindex",d._tabindex)}),a.on("disable",function(){d.$selection.attr("tabindex","-1")})},d.prototype._handleBlur=function(b){var c=this;window.setTimeout(function(){document.activeElement==c.$selection[0]||a.contains(c.$selection[0],document.activeElement)||c.trigger("blur",b)},1)},d.prototype._attachCloseHandler=function(c){a(document.body).on("mousedown.select2."+c.id,function(c){var d=a(c.target),e=d.closest(".select2");a(".select2.select2-container--open").each(function(){a(this),this!=e[0]&&b.GetData(this,"element").select2("close")})})},d.prototype._detachCloseHandler=function(b){a(document.body).off("mousedown.select2."+b.id)},d.prototype.position=function(a,b){b.find(".selection").append(a)},d.prototype.destroy=function(){this._detachCloseHandler(this.container)},d.prototype.update=function(a){throw new Error("The `update` method must be defined in child classes.")},d}),b.define("select2/selection/single",["jquery","./base","../utils","../keys"],function(a,b,c,d){function e(){e.__super__.constructor.apply(this,arguments)}return c.Extend(e,b),e.prototype.render=function(){var a=e.__super__.render.call(this);return a.addClass("select2-selection--single"),a.html('<span class="select2-selection__rendered"></span><span class="select2-selection__arrow" role="presentation"><b role="presentation"></b></span>'),a},e.prototype.bind=function(a,b){var c=this;e.__super__.bind.apply(this,arguments);var d=a.id+"-container";this.$selection.find(".select2-selection__rendered").attr("id",d).attr("role","textbox").attr("aria-readonly","true"),this.$selection.attr("aria-labelledby",d),this.$selection.on("mousedown",function(a){1===a.which&&c.trigger("toggle",{originalEvent:a})}),this.$selection.on("focus",function(a){}),this.$selection.on("blur",function(a){}),a.on("focus",function(b){a.isOpen()||c.$selection.focus()})},e.prototype.clear=function(){var a=this.$selection.find(".select2-selection__rendered");a.empty(),a.removeAttr("title")},e.prototype.display=function(a,b){var c=this.options.get("templateSelection");return this.options.get("escapeMarkup")(c(a,b))},e.prototype.selectionContainer=function(){return a("<span></span>")},e.prototype.update=function(a){if(0===a.length)return void this.clear();var b=a[0],c=this.$selection.find(".select2-selection__rendered"),d=this.display(b,c);c.empty().append(d),c.attr("title",b.title||b.text)},e}),b.define("select2/selection/multiple",["jquery","./base","../utils"],function(a,b,c){function d(a,b){d.__super__.constructor.apply(this,arguments)}return c.Extend(d,b),d.prototype.render=function(){var a=d.__super__.render.call(this);return a.addClass("select2-selection--multiple"),a.html('<ul class="select2-selection__rendered"></ul>'),a},d.prototype.bind=function(b,e){var f=this;d.__super__.bind.apply(this,arguments),this.$selection.on("click",function(a){f.trigger("toggle",{originalEvent:a})}),this.$selection.on("click",".select2-selection__choice__remove",function(b){if(!f.options.get("disabled")){var d=a(this),e=d.parent(),g=c.GetData(e[0],"data");f.trigger("unselect",{originalEvent:b,data:g})}})},d.prototype.clear=function(){var a=this.$selection.find(".select2-selection__rendered");a.empty(),a.removeAttr("title")},d.prototype.display=function(a,b){var c=this.options.get("templateSelection");return this.options.get("escapeMarkup")(c(a,b))},d.prototype.selectionContainer=function(){return a('<li class="select2-selection__choice"><span class="select2-selection__choice__remove" role="presentation">&times;</span></li>')},d.prototype.update=function(a){if(this.clear(),0!==a.length){for(var b=[],d=0;d<a.length;d++){var e=a[d],f=this.selectionContainer(),g=this.display(e,f);f.append(g),f.attr("title",e.title||e.text),c.StoreData(f[0],"data",e),b.push(f)}var h=this.$selection.find(".select2-selection__rendered");c.appendMany(h,b)}},d}),b.define("select2/selection/placeholder",["../utils"],function(a){function b(a,b,c){this.placeholder=this.normalizePlaceholder(c.get("placeholder")),a.call(this,b,c)}return b.prototype.normalizePlaceholder=function(a,b){return"string"==typeof b&&(b={id:"",text:b}),b},b.prototype.createPlaceholder=function(a,b){var c=this.selectionContainer();return c.html(this.display(b)),c.addClass("select2-selection__placeholder").removeClass("select2-selection__choice"),c},b.prototype.update=function(a,b){var c=1==b.length&&b[0].id!=this.placeholder.id;if(b.length>1||c)return a.call(this,b);this.clear();var d=this.createPlaceholder(this.placeholder);this.$selection.find(".select2-selection__rendered").append(d)},b}),b.define("select2/selection/allowClear",["jquery","../keys","../utils"],function(a,b,c){function d(){}return d.prototype.bind=function(a,b,c){var d=this;a.call(this,b,c),null==this.placeholder&&this.options.get("debug")&&window.console&&console.error&&console.error("Select2: The `allowClear` option should be used in combination with the `placeholder` option."),this.$selection.on("mousedown",".select2-selection__clear",function(a){d._handleClear(a)}),b.on("keypress",function(a){d._handleKeyboardClear(a,b)})},d.prototype._handleClear=function(a,b){if(!this.options.get("disabled")){var d=this.$selection.find(".select2-selection__clear");if(0!==d.length){b.stopPropagation();var e=c.GetData(d[0],"data"),f=this.$element.val();this.$element.val(this.placeholder.id);var g={data:e};if(this.trigger("clear",g),g.prevented)return void this.$element.val(f);for(var h=0;h<e.length;h++)if(g={data:e[h]},this.trigger("unselect",g),g.prevented)return void this.$element.val(f);this.$element.trigger("change"),this.trigger("toggle",{})}}},d.prototype._handleKeyboardClear=function(a,c,d){d.isOpen()||c.which!=b.DELETE&&c.which!=b.BACKSPACE||this._handleClear(c)},d.prototype.update=function(b,d){if(b.call(this,d),!(this.$selection.find(".select2-selection__placeholder").length>0||0===d.length)){var e=a('<span class="select2-selection__clear">&times;</span>');c.StoreData(e[0],"data",d),this.$selection.find(".select2-selection__rendered").prepend(e)}},d}),b.define("select2/selection/search",["jquery","../utils","../keys"],function(a,b,c){function d(a,b,c){a.call(this,b,c)}return d.prototype.render=function(b){var c=a('<li class="select2-search select2-search--inline"><input class="select2-search__field" type="search" tabindex="-1" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" role="textbox" aria-autocomplete="list" /></li>');this.$searchContainer=c,this.$search=c.find("input");var d=b.call(this);return this._transferTabIndex(),d},d.prototype.bind=function(a,d,e){var f=this;a.call(this,d,e),d.on("open",function(){f.$search.trigger("focus")}),d.on("close",function(){f.$search.val(""),f.$search.removeAttr("aria-activedescendant"),f.$search.trigger("focus")}),d.on("enable",function(){f.$search.prop("disabled",!1),f._transferTabIndex()}),d.on("disable",function(){f.$search.prop("disabled",!0)}),d.on("focus",function(a){f.$search.trigger("focus")}),d.on("results:focus",function(a){f.$search.attr("aria-activedescendant",a.id)}),this.$selection.on("focusin",".select2-search--inline",function(a){f.trigger("focus",a)}),this.$selection.on("focusout",".select2-search--inline",function(a){f._handleBlur(a)}),this.$selection.on("keydown",".select2-search--inline",function(a){if(a.stopPropagation(),f.trigger("keypress",a),f._keyUpPrevented=a.isDefaultPrevented(),a.which===c.BACKSPACE&&""===f.$search.val()){var d=f.$searchContainer.prev(".select2-selection__choice");if(d.length>0){var e=b.GetData(d[0],"data");f.searchRemoveChoice(e),a.preventDefault()}}});var g=document.documentMode,h=g&&g<=11;this.$selection.on("input.searchcheck",".select2-search--inline",function(a){if(h)return void f.$selection.off("input.search input.searchcheck");f.$selection.off("keyup.search")}),this.$selection.on("keyup.search input.search",".select2-search--inline",function(a){if(h&&"input"===a.type)return void f.$selection.off("input.search input.searchcheck");var b=a.which;b!=c.SHIFT&&b!=c.CTRL&&b!=c.ALT&&b!=c.TAB&&f.handleSearch(a)})},d.prototype._transferTabIndex=function(a){this.$search.attr("tabindex",this.$selection.attr("tabindex")),this.$selection.attr("tabindex","-1")},d.prototype.createPlaceholder=function(a,b){this.$search.attr("placeholder",b.text)},d.prototype.update=function(a,b){var c=this.$search[0]==document.activeElement;if(this.$search.attr("placeholder",""),a.call(this,b),this.$selection.find(".select2-selection__rendered").append(this.$searchContainer),this.resizeSearch(),c){this.$element.find("[data-select2-tag]").length?this.$element.focus():this.$search.focus()}},d.prototype.handleSearch=function(){if(this.resizeSearch(),!this._keyUpPrevented){var a=this.$search.val();this.trigger("query",{term:a})}this._keyUpPrevented=!1},d.prototype.searchRemoveChoice=function(a,b){this.trigger("unselect",{data:b}),this.$search.val(b.text),this.handleSearch()},d.prototype.resizeSearch=function(){this.$search.css("width","25px");var a="";if(""!==this.$search.attr("placeholder"))a=this.$selection.find(".select2-selection__rendered").innerWidth();else{a=.75*(this.$search.val().length+1)+"em"}this.$search.css("width",a)},d}),b.define("select2/selection/eventRelay",["jquery"],function(a){function b(){}return b.prototype.bind=function(b,c,d){var e=this,f=["open","opening","close","closing","select","selecting","unselect","unselecting","clear","clearing"],g=["opening","closing","selecting","unselecting","clearing"];b.call(this,c,d),c.on("*",function(b,c){if(-1!==a.inArray(b,f)){c=c||{};var d=a.Event("select2:"+b,{params:c});e.$element.trigger(d),-1!==a.inArray(b,g)&&(c.prevented=d.isDefaultPrevented())}})},b}),b.define("select2/translation",["jquery","require"],function(a,b){function c(a){this.dict=a||{}}return c.prototype.all=function(){return this.dict},c.prototype.get=function(a){return this.dict[a]},c.prototype.extend=function(b){this.dict=a.extend({},b.all(),this.dict)},c._cache={},c.loadPath=function(a){if(!(a in c._cache)){var d=b(a);c._cache[a]=d}return new c(c._cache[a])},c}),b.define("select2/diacritics",[],function(){return{"Ⓐ":"A","Ａ":"A","À":"A","Á":"A","Â":"A","Ầ":"A","Ấ":"A","Ẫ":"A","Ẩ":"A","Ã":"A","Ā":"A","Ă":"A","Ằ":"A","Ắ":"A","Ẵ":"A","Ẳ":"A","Ȧ":"A","Ǡ":"A","Ä":"A","Ǟ":"A","Ả":"A","Å":"A","Ǻ":"A","Ǎ":"A","Ȁ":"A","Ȃ":"A","Ạ":"A","Ậ":"A","Ặ":"A","Ḁ":"A","Ą":"A","Ⱥ":"A","Ɐ":"A","Ꜳ":"AA","Æ":"AE","Ǽ":"AE","Ǣ":"AE","Ꜵ":"AO","Ꜷ":"AU","Ꜹ":"AV","Ꜻ":"AV","Ꜽ":"AY","Ⓑ":"B","Ｂ":"B","Ḃ":"B","Ḅ":"B","Ḇ":"B","Ƀ":"B","Ƃ":"B","Ɓ":"B","Ⓒ":"C","Ｃ":"C","Ć":"C","Ĉ":"C","Ċ":"C","Č":"C","Ç":"C","Ḉ":"C","Ƈ":"C","Ȼ":"C","Ꜿ":"C","Ⓓ":"D","Ｄ":"D","Ḋ":"D","Ď":"D","Ḍ":"D","Ḑ":"D","Ḓ":"D","Ḏ":"D","Đ":"D","Ƌ":"D","Ɗ":"D","Ɖ":"D","Ꝺ":"D","Ǳ":"DZ","Ǆ":"DZ","ǲ":"Dz","ǅ":"Dz","Ⓔ":"E","Ｅ":"E","È":"E","É":"E","Ê":"E","Ề":"E","Ế":"E","Ễ":"E","Ể":"E","Ẽ":"E","Ē":"E","Ḕ":"E","Ḗ":"E","Ĕ":"E","Ė":"E","Ë":"E","Ẻ":"E","Ě":"E","Ȅ":"E","Ȇ":"E","Ẹ":"E","Ệ":"E","Ȩ":"E","Ḝ":"E","Ę":"E","Ḙ":"E","Ḛ":"E","Ɛ":"E","Ǝ":"E","Ⓕ":"F","Ｆ":"F","Ḟ":"F","Ƒ":"F","Ꝼ":"F","Ⓖ":"G","Ｇ":"G","Ǵ":"G","Ĝ":"G","Ḡ":"G","Ğ":"G","Ġ":"G","Ǧ":"G","Ģ":"G","Ǥ":"G","Ɠ":"G","Ꞡ":"G","Ᵹ":"G","Ꝿ":"G","Ⓗ":"H","Ｈ":"H","Ĥ":"H","Ḣ":"H","Ḧ":"H","Ȟ":"H","Ḥ":"H","Ḩ":"H","Ḫ":"H","Ħ":"H","Ⱨ":"H","Ⱶ":"H","Ɥ":"H","Ⓘ":"I","Ｉ":"I","Ì":"I","Í":"I","Î":"I","Ĩ":"I","Ī":"I","Ĭ":"I","İ":"I","Ï":"I","Ḯ":"I","Ỉ":"I","Ǐ":"I","Ȉ":"I","Ȋ":"I","Ị":"I","Į":"I","Ḭ":"I","Ɨ":"I","Ⓙ":"J","Ｊ":"J","Ĵ":"J","Ɉ":"J","Ⓚ":"K","Ｋ":"K","Ḱ":"K","Ǩ":"K","Ḳ":"K","Ķ":"K","Ḵ":"K","Ƙ":"K","Ⱪ":"K","Ꝁ":"K","Ꝃ":"K","Ꝅ":"K","Ꞣ":"K","Ⓛ":"L","Ｌ":"L","Ŀ":"L","Ĺ":"L","Ľ":"L","Ḷ":"L","Ḹ":"L","Ļ":"L","Ḽ":"L","Ḻ":"L","Ł":"L","Ƚ":"L","Ɫ":"L","Ⱡ":"L","Ꝉ":"L","Ꝇ":"L","Ꞁ":"L","Ǉ":"LJ","ǈ":"Lj","Ⓜ":"M","Ｍ":"M","Ḿ":"M","Ṁ":"M","Ṃ":"M","Ɱ":"M","Ɯ":"M","Ⓝ":"N","Ｎ":"N","Ǹ":"N","Ń":"N","Ñ":"N","Ṅ":"N","Ň":"N","Ṇ":"N","Ņ":"N","Ṋ":"N","Ṉ":"N","Ƞ":"N","Ɲ":"N","Ꞑ":"N","Ꞥ":"N","Ǌ":"NJ","ǋ":"Nj","Ⓞ":"O","Ｏ":"O","Ò":"O","Ó":"O","Ô":"O","Ồ":"O","Ố":"O","Ỗ":"O","Ổ":"O","Õ":"O","Ṍ":"O","Ȭ":"O","Ṏ":"O","Ō":"O","Ṑ":"O","Ṓ":"O","Ŏ":"O","Ȯ":"O","Ȱ":"O","Ö":"O","Ȫ":"O","Ỏ":"O","Ő":"O","Ǒ":"O","Ȍ":"O","Ȏ":"O","Ơ":"O","Ờ":"O","Ớ":"O","Ỡ":"O","Ở":"O","Ợ":"O","Ọ":"O","Ộ":"O","Ǫ":"O","Ǭ":"O","Ø":"O","Ǿ":"O","Ɔ":"O","Ɵ":"O","Ꝋ":"O","Ꝍ":"O","Ƣ":"OI","Ꝏ":"OO","Ȣ":"OU","Ⓟ":"P","Ｐ":"P","Ṕ":"P","Ṗ":"P","Ƥ":"P","Ᵽ":"P","Ꝑ":"P","Ꝓ":"P","Ꝕ":"P","Ⓠ":"Q","Ｑ":"Q","Ꝗ":"Q","Ꝙ":"Q","Ɋ":"Q","Ⓡ":"R","Ｒ":"R","Ŕ":"R","Ṙ":"R","Ř":"R","Ȑ":"R","Ȓ":"R","Ṛ":"R","Ṝ":"R","Ŗ":"R","Ṟ":"R","Ɍ":"R","Ɽ":"R","Ꝛ":"R","Ꞧ":"R","Ꞃ":"R","Ⓢ":"S","Ｓ":"S","ẞ":"S","Ś":"S","Ṥ":"S","Ŝ":"S","Ṡ":"S","Š":"S","Ṧ":"S","Ṣ":"S","Ṩ":"S","Ș":"S","Ş":"S","Ȿ":"S","Ꞩ":"S","Ꞅ":"S","Ⓣ":"T","Ｔ":"T","Ṫ":"T","Ť":"T","Ṭ":"T","Ț":"T","Ţ":"T","Ṱ":"T","Ṯ":"T","Ŧ":"T","Ƭ":"T","Ʈ":"T","Ⱦ":"T","Ꞇ":"T","Ꜩ":"TZ","Ⓤ":"U","Ｕ":"U","Ù":"U","Ú":"U","Û":"U","Ũ":"U","Ṹ":"U","Ū":"U","Ṻ":"U","Ŭ":"U","Ü":"U","Ǜ":"U","Ǘ":"U","Ǖ":"U","Ǚ":"U","Ủ":"U","Ů":"U","Ű":"U","Ǔ":"U","Ȕ":"U","Ȗ":"U","Ư":"U","Ừ":"U","Ứ":"U","Ữ":"U","Ử":"U","Ự":"U","Ụ":"U","Ṳ":"U","Ų":"U","Ṷ":"U","Ṵ":"U","Ʉ":"U","Ⓥ":"V","Ｖ":"V","Ṽ":"V","Ṿ":"V","Ʋ":"V","Ꝟ":"V","Ʌ":"V","Ꝡ":"VY","Ⓦ":"W","Ｗ":"W","Ẁ":"W","Ẃ":"W","Ŵ":"W","Ẇ":"W","Ẅ":"W","Ẉ":"W","Ⱳ":"W","Ⓧ":"X","Ｘ":"X","Ẋ":"X","Ẍ":"X","Ⓨ":"Y","Ｙ":"Y","Ỳ":"Y","Ý":"Y","Ŷ":"Y","Ỹ":"Y","Ȳ":"Y","Ẏ":"Y","Ÿ":"Y","Ỷ":"Y","Ỵ":"Y","Ƴ":"Y","Ɏ":"Y","Ỿ":"Y","Ⓩ":"Z","Ｚ":"Z","Ź":"Z","Ẑ":"Z","Ż":"Z","Ž":"Z","Ẓ":"Z","Ẕ":"Z","Ƶ":"Z","Ȥ":"Z","Ɀ":"Z","Ⱬ":"Z","Ꝣ":"Z","ⓐ":"a","ａ":"a","ẚ":"a","à":"a","á":"a","â":"a","ầ":"a","ấ":"a","ẫ":"a","ẩ":"a","ã":"a","ā":"a","ă":"a","ằ":"a","ắ":"a","ẵ":"a","ẳ":"a","ȧ":"a","ǡ":"a","ä":"a","ǟ":"a","ả":"a","å":"a","ǻ":"a","ǎ":"a","ȁ":"a","ȃ":"a","ạ":"a","ậ":"a","ặ":"a","ḁ":"a","ą":"a","ⱥ":"a","ɐ":"a","ꜳ":"aa","æ":"ae","ǽ":"ae","ǣ":"ae","ꜵ":"ao","ꜷ":"au","ꜹ":"av","ꜻ":"av","ꜽ":"ay","ⓑ":"b","ｂ":"b","ḃ":"b","ḅ":"b","ḇ":"b","ƀ":"b","ƃ":"b","ɓ":"b","ⓒ":"c","ｃ":"c","ć":"c","ĉ":"c","ċ":"c","č":"c","ç":"c","ḉ":"c","ƈ":"c","ȼ":"c","ꜿ":"c","ↄ":"c","ⓓ":"d","ｄ":"d","ḋ":"d","ď":"d","ḍ":"d","ḑ":"d","ḓ":"d","ḏ":"d","đ":"d","ƌ":"d","ɖ":"d","ɗ":"d","ꝺ":"d","ǳ":"dz","ǆ":"dz","ⓔ":"e","ｅ":"e","è":"e","é":"e","ê":"e","ề":"e","ế":"e","ễ":"e","ể":"e","ẽ":"e","ē":"e","ḕ":"e","ḗ":"e","ĕ":"e","ė":"e","ë":"e","ẻ":"e","ě":"e","ȅ":"e","ȇ":"e","ẹ":"e","ệ":"e","ȩ":"e","ḝ":"e","ę":"e","ḙ":"e","ḛ":"e","ɇ":"e","ɛ":"e","ǝ":"e","ⓕ":"f","ｆ":"f","ḟ":"f","ƒ":"f","ꝼ":"f","ⓖ":"g","ｇ":"g","ǵ":"g","ĝ":"g","ḡ":"g","ğ":"g","ġ":"g","ǧ":"g","ģ":"g","ǥ":"g","ɠ":"g","ꞡ":"g","ᵹ":"g","ꝿ":"g","ⓗ":"h","ｈ":"h","ĥ":"h","ḣ":"h","ḧ":"h","ȟ":"h","ḥ":"h","ḩ":"h","ḫ":"h","ẖ":"h","ħ":"h","ⱨ":"h","ⱶ":"h","ɥ":"h","ƕ":"hv","ⓘ":"i","ｉ":"i","ì":"i","í":"i","î":"i","ĩ":"i","ī":"i","ĭ":"i","ï":"i","ḯ":"i","ỉ":"i","ǐ":"i","ȉ":"i","ȋ":"i","ị":"i","į":"i","ḭ":"i","ɨ":"i","ı":"i","ⓙ":"j","ｊ":"j","ĵ":"j","ǰ":"j","ɉ":"j","ⓚ":"k","ｋ":"k","ḱ":"k","ǩ":"k","ḳ":"k","ķ":"k","ḵ":"k","ƙ":"k","ⱪ":"k","ꝁ":"k","ꝃ":"k","ꝅ":"k","ꞣ":"k","ⓛ":"l","ｌ":"l","ŀ":"l","ĺ":"l","ľ":"l","ḷ":"l","ḹ":"l","ļ":"l","ḽ":"l","ḻ":"l","ſ":"l","ł":"l","ƚ":"l","ɫ":"l","ⱡ":"l","ꝉ":"l","ꞁ":"l","ꝇ":"l","ǉ":"lj","ⓜ":"m","ｍ":"m","ḿ":"m","ṁ":"m","ṃ":"m","ɱ":"m","ɯ":"m","ⓝ":"n","ｎ":"n","ǹ":"n","ń":"n","ñ":"n","ṅ":"n","ň":"n","ṇ":"n","ņ":"n","ṋ":"n","ṉ":"n","ƞ":"n","ɲ":"n","ŉ":"n","ꞑ":"n","ꞥ":"n","ǌ":"nj","ⓞ":"o","ｏ":"o","ò":"o","ó":"o","ô":"o","ồ":"o","ố":"o","ỗ":"o","ổ":"o","õ":"o","ṍ":"o","ȭ":"o","ṏ":"o","ō":"o","ṑ":"o","ṓ":"o","ŏ":"o","ȯ":"o","ȱ":"o","ö":"o","ȫ":"o","ỏ":"o","ő":"o","ǒ":"o","ȍ":"o","ȏ":"o","ơ":"o","ờ":"o","ớ":"o","ỡ":"o","ở":"o","ợ":"o","ọ":"o","ộ":"o","ǫ":"o","ǭ":"o","ø":"o","ǿ":"o","ɔ":"o","ꝋ":"o","ꝍ":"o","ɵ":"o","ƣ":"oi","ȣ":"ou","ꝏ":"oo","ⓟ":"p","ｐ":"p","ṕ":"p","ṗ":"p","ƥ":"p","ᵽ":"p","ꝑ":"p","ꝓ":"p","ꝕ":"p","ⓠ":"q","ｑ":"q","ɋ":"q","ꝗ":"q","ꝙ":"q","ⓡ":"r","ｒ":"r","ŕ":"r","ṙ":"r","ř":"r","ȑ":"r","ȓ":"r","ṛ":"r","ṝ":"r","ŗ":"r","ṟ":"r","ɍ":"r","ɽ":"r","ꝛ":"r","ꞧ":"r","ꞃ":"r","ⓢ":"s","ｓ":"s","ß":"s","ś":"s","ṥ":"s","ŝ":"s","ṡ":"s","š":"s","ṧ":"s","ṣ":"s","ṩ":"s","ș":"s","ş":"s","ȿ":"s","ꞩ":"s","ꞅ":"s","ẛ":"s","ⓣ":"t","ｔ":"t","ṫ":"t","ẗ":"t","ť":"t","ṭ":"t","ț":"t","ţ":"t","ṱ":"t","ṯ":"t","ŧ":"t","ƭ":"t","ʈ":"t","ⱦ":"t","ꞇ":"t","ꜩ":"tz","ⓤ":"u","ｕ":"u","ù":"u","ú":"u","û":"u","ũ":"u","ṹ":"u","ū":"u","ṻ":"u","ŭ":"u","ü":"u","ǜ":"u","ǘ":"u","ǖ":"u","ǚ":"u","ủ":"u","ů":"u","ű":"u","ǔ":"u","ȕ":"u","ȗ":"u","ư":"u","ừ":"u","ứ":"u","ữ":"u","ử":"u","ự":"u","ụ":"u","ṳ":"u","ų":"u","ṷ":"u","ṵ":"u","ʉ":"u","ⓥ":"v","ｖ":"v","ṽ":"v","ṿ":"v","ʋ":"v","ꝟ":"v","ʌ":"v","ꝡ":"vy","ⓦ":"w","ｗ":"w","ẁ":"w","ẃ":"w","ŵ":"w","ẇ":"w","ẅ":"w","ẘ":"w","ẉ":"w","ⱳ":"w","ⓧ":"x","ｘ":"x","ẋ":"x","ẍ":"x","ⓨ":"y","ｙ":"y","ỳ":"y","ý":"y","ŷ":"y","ỹ":"y","ȳ":"y","ẏ":"y","ÿ":"y","ỷ":"y","ẙ":"y","ỵ":"y","ƴ":"y","ɏ":"y","ỿ":"y","ⓩ":"z","ｚ":"z","ź":"z","ẑ":"z","ż":"z","ž":"z","ẓ":"z","ẕ":"z","ƶ":"z","ȥ":"z","ɀ":"z","ⱬ":"z","ꝣ":"z","Ά":"Α","Έ":"Ε","Ή":"Η","Ί":"Ι","Ϊ":"Ι","Ό":"Ο","Ύ":"Υ","Ϋ":"Υ","Ώ":"Ω","ά":"α","έ":"ε","ή":"η","ί":"ι","ϊ":"ι","ΐ":"ι","ό":"ο","ύ":"υ","ϋ":"υ","ΰ":"υ","ω":"ω","ς":"σ"}}),b.define("select2/data/base",["../utils"],function(a){function b(a,c){b.__super__.constructor.call(this)}return a.Extend(b,a.Observable),b.prototype.current=function(a){throw new Error("The `current` method must be defined in child classes.")},b.prototype.query=function(a,b){throw new Error("The `query` method must be defined in child classes.")},b.prototype.bind=function(a,b){},b.prototype.destroy=function(){},b.prototype.generateResultId=function(b,c){var d=b.id+"-result-";return d+=a.generateChars(4),null!=c.id?d+="-"+c.id.toString():d+="-"+a.generateChars(4),d},b}),b.define("select2/data/select",["./base","../utils","jquery"],function(a,b,c){function d(a,b){this.$element=a,this.options=b,d.__super__.constructor.call(this)}return b.Extend(d,a),d.prototype.current=function(a){var b=[],d=this;this.$element.find(":selected").each(function(){var a=c(this),e=d.item(a);b.push(e)}),a(b)},d.prototype.select=function(a){var b=this;if(a.selected=!0,c(a.element).is("option"))return a.element.selected=!0,void this.$element.trigger("change");if(this.$element.prop("multiple"))this.current(function(d){var e=[];a=[a],a.push.apply(a,d);for(var f=0;f<a.length;f++){var g=a[f].id;-1===c.inArray(g,e)&&e.push(g)}b.$element.val(e),b.$element.trigger("change")});else{var d=a.id;this.$element.val(d),this.$element.trigger("change")}},d.prototype.unselect=function(a){var b=this;if(this.$element.prop("multiple")){if(a.selected=!1,c(a.element).is("option"))return a.element.selected=!1,void this.$element.trigger("change");this.current(function(d){for(var e=[],f=0;f<d.length;f++){var g=d[f].id;g!==a.id&&-1===c.inArray(g,e)&&e.push(g)}b.$element.val(e),b.$element.trigger("change")})}},d.prototype.bind=function(a,b){var c=this;this.container=a,a.on("select",function(a){c.select(a.data)}),a.on("unselect",function(a){c.unselect(a.data)})},d.prototype.destroy=function(){this.$element.find("*").each(function(){b.RemoveData(this)})},d.prototype.query=function(a,b){var d=[],e=this;this.$element.children().each(function(){var b=c(this);if(b.is("option")||b.is("optgroup")){var f=e.item(b),g=e.matches(a,f);null!==g&&d.push(g)}}),b({results:d})},d.prototype.addOptions=function(a){b.appendMany(this.$element,a)},d.prototype.option=function(a){var d;a.children?(d=document.createElement("optgroup"),d.label=a.text):(d=document.createElement("option"),void 0!==d.textContent?d.textContent=a.text:d.innerText=a.text),void 0!==a.id&&(d.value=a.id),a.disabled&&(d.disabled=!0),a.selected&&(d.selected=!0),a.title&&(d.title=a.title);var e=c(d),f=this._normalizeItem(a);return f.element=d,b.StoreData(d,"data",f),e},d.prototype.item=function(a){var d={};if(null!=(d=b.GetData(a[0],"data")))return d;if(a.is("option"))d={id:a.val(),text:a.text(),disabled:a.prop("disabled"),selected:a.prop("selected"),title:a.prop("title")};else if(a.is("optgroup")){d={text:a.prop("label"),children:[],title:a.prop("title")};for(var e=a.children("option"),f=[],g=0;g<e.length;g++){var h=c(e[g]),i=this.item(h);f.push(i)}d.children=f}return d=this._normalizeItem(d),d.element=a[0],b.StoreData(a[0],"data",d),d},d.prototype._normalizeItem=function(a){a!==Object(a)&&(a={id:a,text:a}),a=c.extend({},{text:""},a);var b={selected:!1,disabled:!1};return null!=a.id&&(a.id=a.id.toString()),null!=a.text&&(a.text=a.text.toString()),null==a._resultId&&a.id&&null!=this.container&&(a._resultId=this.generateResultId(this.container,a)),c.extend({},b,a)},d.prototype.matches=function(a,b){return this.options.get("matcher")(a,b)},d}),b.define("select2/data/array",["./select","../utils","jquery"],function(a,b,c){function d(a,b){var c=b.get("data")||[];d.__super__.constructor.call(this,a,b),this.addOptions(this.convertToOptions(c))}return b.Extend(d,a),d.prototype.select=function(a){var b=this.$element.find("option").filter(function(b,c){return c.value==a.id.toString()});0===b.length&&(b=this.option(a),this.addOptions(b)),d.__super__.select.call(this,a)},d.prototype.convertToOptions=function(a){function d(a){return function(){return c(this).val()==a.id}}for(var e=this,f=this.$element.find("option"),g=f.map(function(){return e.item(c(this)).id}).get(),h=[],i=0;i<a.length;i++){var j=this._normalizeItem(a[i]);if(c.inArray(j.id,g)>=0){var k=f.filter(d(j)),l=this.item(k),m=c.extend(!0,{},j,l),n=this.option(m);k.replaceWith(n)}else{var o=this.option(j);if(j.children){var p=this.convertToOptions(j.children);b.appendMany(o,p)}h.push(o)}}return h},d}),b.define("select2/data/ajax",["./array","../utils","jquery"],function(a,b,c){function d(a,b){this.ajaxOptions=this._applyDefaults(b.get("ajax")),null!=this.ajaxOptions.processResults&&(this.processResults=this.ajaxOptions.processResults),d.__super__.constructor.call(this,a,b)}return b.Extend(d,a),d.prototype._applyDefaults=function(a){var b={data:function(a){return c.extend({},a,{q:a.term})},transport:function(a,b,d){var e=c.ajax(a);return e.then(b),e.fail(d),e}};return c.extend({},b,a,!0)},d.prototype.processResults=function(a){return a},d.prototype.query=function(a,b){function d(){var d=f.transport(f,function(d){var f=e.processResults(d,a);e.options.get("debug")&&window.console&&console.error&&(f&&f.results&&c.isArray(f.results)||console.error("Select2: The AJAX results did not return an array in the `results` key of the response.")),b(f)},function(){"status"in d&&(0===d.status||"0"===d.status)||e.trigger("results:message",{message:"errorLoading"})});e._request=d}var e=this;null!=this._request&&(c.isFunction(this._request.abort)&&this._request.abort(),this._request=null);var f=c.extend({type:"GET"},this.ajaxOptions);"function"==typeof f.url&&(f.url=f.url.call(this.$element,a)),"function"==typeof f.data&&(f.data=f.data.call(this.$element,a)),this.ajaxOptions.delay&&null!=a.term?(this._queryTimeout&&window.clearTimeout(this._queryTimeout),this._queryTimeout=window.setTimeout(d,this.ajaxOptions.delay)):d()},d}),b.define("select2/data/tags",["jquery"],function(a){function b(b,c,d){var e=d.get("tags"),f=d.get("createTag");void 0!==f&&(this.createTag=f);var g=d.get("insertTag");if(void 0!==g&&(this.insertTag=g),b.call(this,c,d),a.isArray(e))for(var h=0;h<e.length;h++){var i=e[h],j=this._normalizeItem(i),k=this.option(j);this.$element.append(k)}}return b.prototype.query=function(a,b,c){function d(a,f){for(var g=a.results,h=0;h<g.length;h++){var i=g[h],j=null!=i.children&&!d({results:i.children},!0);if((i.text||"").toUpperCase()===(b.term||"").toUpperCase()||j)return!f&&(a.data=g,void c(a))}if(f)return!0;var k=e.createTag(b);if(null!=k){var l=e.option(k);l.attr("data-select2-tag",!0),e.addOptions([l]),e.insertTag(g,k)}a.results=g,c(a)}var e=this;if(this._removeOldTags(),null==b.term||null!=b.page)return void a.call(this,b,c);a.call(this,b,d)},b.prototype.createTag=function(b,c){var d=a.trim(c.term);return""===d?null:{id:d,text:d}},b.prototype.insertTag=function(a,b,c){b.unshift(c)},b.prototype._removeOldTags=function(b){this._lastTag;this.$element.find("option[data-select2-tag]").each(function(){this.selected||a(this).remove()})},b}),b.define("select2/data/tokenizer",["jquery"],function(a){function b(a,b,c){var d=c.get("tokenizer");void 0!==d&&(this.tokenizer=d),a.call(this,b,c)}return b.prototype.bind=function(a,b,c){a.call(this,b,c),this.$search=b.dropdown.$search||b.selection.$search||c.find(".select2-search__field")},b.prototype.query=function(b,c,d){function e(b){var c=g._normalizeItem(b);if(!g.$element.find("option").filter(function(){return a(this).val()===c.id}).length){var d=g.option(c);d.attr("data-select2-tag",!0),g._removeOldTags(),g.addOptions([d])}f(c)}function f(a){g.trigger("select",{data:a})}var g=this;c.term=c.term||"";var h=this.tokenizer(c,this.options,e);h.term!==c.term&&(this.$search.length&&(this.$search.val(h.term),this.$search.focus()),c.term=h.term),b.call(this,c,d)},b.prototype.tokenizer=function(b,c,d,e){for(var f=d.get("tokenSeparators")||[],g=c.term,h=0,i=this.createTag||function(a){return{id:a.term,text:a.term}};h<g.length;){var j=g[h];if(-1!==a.inArray(j,f)){var k=g.substr(0,h),l=a.extend({},c,{term:k}),m=i(l);null!=m?(e(m),g=g.substr(h+1)||"",h=0):h++}else h++}return{term:g}},b}),b.define("select2/data/minimumInputLength",[],function(){function a(a,b,c){this.minimumInputLength=c.get("minimumInputLength"),a.call(this,b,c)}return a.prototype.query=function(a,b,c){if(b.term=b.term||"",b.term.length<this.minimumInputLength)return void this.trigger("results:message",{message:"inputTooShort",args:{minimum:this.minimumInputLength,input:b.term,params:b}});a.call(this,b,c)},a}),b.define("select2/data/maximumInputLength",[],function(){function a(a,b,c){this.maximumInputLength=c.get("maximumInputLength"),a.call(this,b,c)}return a.prototype.query=function(a,b,c){if(b.term=b.term||"",this.maximumInputLength>0&&b.term.length>this.maximumInputLength)return void this.trigger("results:message",{message:"inputTooLong",args:{maximum:this.maximumInputLength,input:b.term,params:b}});a.call(this,b,c)},a}),b.define("select2/data/maximumSelectionLength",[],function(){function a(a,b,c){this.maximumSelectionLength=c.get("maximumSelectionLength"),a.call(this,b,c)}return a.prototype.query=function(a,b,c){var d=this;this.current(function(e){var f=null!=e?e.length:0;if(d.maximumSelectionLength>0&&f>=d.maximumSelectionLength)return void d.trigger("results:message",{message:"maximumSelected",args:{maximum:d.maximumSelectionLength}});a.call(d,b,c)})},a}),b.define("select2/dropdown",["jquery","./utils"],function(a,b){function c(a,b){this.$element=a,this.options=b,c.__super__.constructor.call(this)}return b.Extend(c,b.Observable),c.prototype.render=function(){var b=a('<span class="select2-dropdown"><span class="select2-results"></span></span>');return b.attr("dir",this.options.get("dir")),this.$dropdown=b,b},c.prototype.bind=function(){},c.prototype.position=function(a,b){},c.prototype.destroy=function(){this.$dropdown.remove()},c}),b.define("select2/dropdown/search",["jquery","../utils"],function(a,b){function c(){}return c.prototype.render=function(b){var c=b.call(this),d=a('<span class="select2-search select2-search--dropdown"><input class="select2-search__field" type="search" tabindex="-1" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" role="textbox" /></span>');return this.$searchContainer=d,this.$search=d.find("input"),c.prepend(d),c},c.prototype.bind=function(b,c,d){var e=this;b.call(this,c,d),this.$search.on("keydown",function(a){e.trigger("keypress",a),e._keyUpPrevented=a.isDefaultPrevented()}),this.$search.on("input",function(b){a(this).off("keyup")}),this.$search.on("keyup input",function(a){e.handleSearch(a)}),c.on("open",function(){e.$search.attr("tabindex",0),e.$search.focus(),window.setTimeout(function(){e.$search.focus()},0)}),c.on("close",function(){e.$search.attr("tabindex",-1),e.$search.val(""),e.$search.blur()}),c.on("focus",function(){c.isOpen()||e.$search.focus()}),c.on("results:all",function(a){if(null==a.query.term||""===a.query.term){e.showSearch(a)?e.$searchContainer.removeClass("select2-search--hide"):e.$searchContainer.addClass("select2-search--hide")}})},c.prototype.handleSearch=function(a){if(!this._keyUpPrevented){var b=this.$search.val();this.trigger("query",{term:b})}this._keyUpPrevented=!1},c.prototype.showSearch=function(a,b){return!0},c}),b.define("select2/dropdown/hidePlaceholder",[],function(){function a(a,b,c,d){this.placeholder=this.normalizePlaceholder(c.get("placeholder")),a.call(this,b,c,d)}return a.prototype.append=function(a,b){b.results=this.removePlaceholder(b.results),a.call(this,b)},a.prototype.normalizePlaceholder=function(a,b){return"string"==typeof b&&(b={id:"",text:b}),b},a.prototype.removePlaceholder=function(a,b){for(var c=b.slice(0),d=b.length-1;d>=0;d--){var e=b[d];this.placeholder.id===e.id&&c.splice(d,1)}return c},a}),b.define("select2/dropdown/infiniteScroll",["jquery"],function(a){function b(a,b,c,d){this.lastParams={},a.call(this,b,c,d),this.$loadingMore=this.createLoadingMore(),this.loading=!1}return b.prototype.append=function(a,b){this.$loadingMore.remove(),this.loading=!1,a.call(this,b),this.showLoadingMore(b)&&this.$results.append(this.$loadingMore)},b.prototype.bind=function(b,c,d){var e=this;b.call(this,c,d),c.on("query",function(a){e.lastParams=a,e.loading=!0}),c.on("query:append",function(a){e.lastParams=a,e.loading=!0}),this.$results.on("scroll",function(){var b=a.contains(document.documentElement,e.$loadingMore[0]);if(!e.loading&&b){e.$results.offset().top+e.$results.outerHeight(!1)+50>=e.$loadingMore.offset().top+e.$loadingMore.outerHeight(!1)&&e.loadMore()}})},b.prototype.loadMore=function(){this.loading=!0;var b=a.extend({},{page:1},this.lastParams);b.page++,this.trigger("query:append",b)},b.prototype.showLoadingMore=function(a,b){return b.pagination&&b.pagination.more},b.prototype.createLoadingMore=function(){var b=a('<li class="select2-results__option select2-results__option--load-more"role="treeitem" aria-disabled="true"></li>'),c=this.options.get("translations").get("loadingMore");return b.html(c(this.lastParams)),b},b}),b.define("select2/dropdown/attachBody",["jquery","../utils"],function(a,b){function c(b,c,d){this.$dropdownParent=d.get("dropdownParent")||a(document.body),b.call(this,c,d)}return c.prototype.bind=function(a,b,c){var d=this,e=!1;a.call(this,b,c),b.on("open",function(){d._showDropdown(),d._attachPositioningHandler(b),e||(e=!0,b.on("results:all",function(){d._positionDropdown(),d._resizeDropdown()}),b.on("results:append",function(){d._positionDropdown(),d._resizeDropdown()}))}),b.on("close",function(){d._hideDropdown(),d._detachPositioningHandler(b)}),this.$dropdownContainer.on("mousedown",function(a){a.stopPropagation()})},c.prototype.destroy=function(a){a.call(this),this.$dropdownContainer.remove()},c.prototype.position=function(a,b,c){b.attr("class",c.attr("class")),b.removeClass("select2"),b.addClass("select2-container--open"),b.css({position:"absolute",top:-999999}),this.$container=c},c.prototype.render=function(b){var c=a("<span></span>"),d=b.call(this);return c.append(d),this.$dropdownContainer=c,c},c.prototype._hideDropdown=function(a){this.$dropdownContainer.detach()},c.prototype._attachPositioningHandler=function(c,d){var e=this,f="scroll.select2."+d.id,g="resize.select2."+d.id,h="orientationchange.select2."+d.id,i=this.$container.parents().filter(b.hasScroll);i.each(function(){b.StoreData(this,"select2-scroll-position",{x:a(this).scrollLeft(),y:a(this).scrollTop()})}),i.on(f,function(c){var d=b.GetData(this,"select2-scroll-position");a(this).scrollTop(d.y)}),a(window).on(f+" "+g+" "+h,function(a){e._positionDropdown(),e._resizeDropdown()})},c.prototype._detachPositioningHandler=function(c,d){var e="scroll.select2."+d.id,f="resize.select2."+d.id,g="orientationchange.select2."+d.id;this.$container.parents().filter(b.hasScroll).off(e),a(window).off(e+" "+f+" "+g)},c.prototype._positionDropdown=function(){var b=a(window),c=this.$dropdown.hasClass("select2-dropdown--above"),d=this.$dropdown.hasClass("select2-dropdown--below"),e=null,f=this.$container.offset();f.bottom=f.top+this.$container.outerHeight(!1);var g={height:this.$container.outerHeight(!1)};g.top=f.top,g.bottom=f.top+g.height;var h={height:this.$dropdown.outerHeight(!1)},i={top:b.scrollTop(),bottom:b.scrollTop()+b.height()},j=i.top<f.top-h.height,k=i.bottom>f.bottom+h.height,l={left:f.left,top:g.bottom},m=this.$dropdownParent;"static"===m.css("position")&&(m=m.offsetParent());var n=m.offset();l.top-=n.top,l.left-=n.left,c||d||(e="below"),k||!j||c?!j&&k&&c&&(e="below"):e="above",("above"==e||c&&"below"!==e)&&(l.top=g.top-n.top-h.height),null!=e&&(this.$dropdown.removeClass("select2-dropdown--below select2-dropdown--above").addClass("select2-dropdown--"+e),this.$container.removeClass("select2-container--below select2-container--above").addClass("select2-container--"+e)),this.$dropdownContainer.css(l)},c.prototype._resizeDropdown=function(){var a={width:this.$container.outerWidth(!1)+"px"};this.options.get("dropdownAutoWidth")&&(a.minWidth=a.width,a.position="relative",a.width="auto"),this.$dropdown.css(a)},c.prototype._showDropdown=function(a){this.$dropdownContainer.appendTo(this.$dropdownParent),this._positionDropdown(),this._resizeDropdown()},c}),b.define("select2/dropdown/minimumResultsForSearch",[],function(){function a(b){for(var c=0,d=0;d<b.length;d++){var e=b[d];e.children?c+=a(e.children):c++}return c}function b(a,b,c,d){this.minimumResultsForSearch=c.get("minimumResultsForSearch"),this.minimumResultsForSearch<0&&(this.minimumResultsForSearch=1/0),a.call(this,b,c,d)}return b.prototype.showSearch=function(b,c){return!(a(c.data.results)<this.minimumResultsForSearch)&&b.call(this,c)},b}),b.define("select2/dropdown/selectOnClose",["../utils"],function(a){function b(){}return b.prototype.bind=function(a,b,c){var d=this;a.call(this,b,c),b.on("close",function(a){d._handleSelectOnClose(a)})},b.prototype._handleSelectOnClose=function(b,c){if(c&&null!=c.originalSelect2Event){var d=c.originalSelect2Event;if("select"===d._type||"unselect"===d._type)return}var e=this.getHighlightedResults();if(!(e.length<1)){var f=a.GetData(e[0],"data");null!=f.element&&f.element.selected||null==f.element&&f.selected||this.trigger("select",{data:f})}},b}),b.define("select2/dropdown/closeOnSelect",[],function(){function a(){}return a.prototype.bind=function(a,b,c){var d=this;a.call(this,b,c),b.on("select",function(a){d._selectTriggered(a)}),b.on("unselect",function(a){d._selectTriggered(a)})},a.prototype._selectTriggered=function(a,b){var c=b.originalEvent;c&&c.ctrlKey||this.trigger("close",{originalEvent:c,originalSelect2Event:b})},a}),b.define("select2/i18n/en",[],function(){return{errorLoading:function(){return"The results could not be loaded."},inputTooLong:function(a){var b=a.input.length-a.maximum,c="Please delete "+b+" character";return 1!=b&&(c+="s"),c},inputTooShort:function(a){return"Please enter "+(a.minimum-a.input.length)+" or more characters"},loadingMore:function(){return"Loading more results…"},maximumSelected:function(a){var b="You can only select "+a.maximum+" item";return 1!=a.maximum&&(b+="s"),b},noResults:function(){return"No results found"},searching:function(){return"Searching…"}}}),b.define("select2/defaults",["jquery","require","./results","./selection/single","./selection/multiple","./selection/placeholder","./selection/allowClear","./selection/search","./selection/eventRelay","./utils","./translation","./diacritics","./data/select","./data/array","./data/ajax","./data/tags","./data/tokenizer","./data/minimumInputLength","./data/maximumInputLength","./data/maximumSelectionLength","./dropdown","./dropdown/search","./dropdown/hidePlaceholder","./dropdown/infiniteScroll","./dropdown/attachBody","./dropdown/minimumResultsForSearch","./dropdown/selectOnClose","./dropdown/closeOnSelect","./i18n/en"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C){function D(){this.reset()}return D.prototype.apply=function(l){if(l=a.extend(!0,{},this.defaults,l),null==l.dataAdapter){if(null!=l.ajax?l.dataAdapter=o:null!=l.data?l.dataAdapter=n:l.dataAdapter=m,l.minimumInputLength>0&&(l.dataAdapter=j.Decorate(l.dataAdapter,r)),l.maximumInputLength>0&&(l.dataAdapter=j.Decorate(l.dataAdapter,s)),l.maximumSelectionLength>0&&(l.dataAdapter=j.Decorate(l.dataAdapter,t)),l.tags&&(l.dataAdapter=j.Decorate(l.dataAdapter,p)),null==l.tokenSeparators&&null==l.tokenizer||(l.dataAdapter=j.Decorate(l.dataAdapter,q)),null!=l.query){var C=b(l.amdBase+"compat/query");l.dataAdapter=j.Decorate(l.dataAdapter,C)}if(null!=l.initSelection){var D=b(l.amdBase+"compat/initSelection");l.dataAdapter=j.Decorate(l.dataAdapter,D)}}if(null==l.resultsAdapter&&(l.resultsAdapter=c,null!=l.ajax&&(l.resultsAdapter=j.Decorate(l.resultsAdapter,x)),null!=l.placeholder&&(l.resultsAdapter=j.Decorate(l.resultsAdapter,w)),l.selectOnClose&&(l.resultsAdapter=j.Decorate(l.resultsAdapter,A))),null==l.dropdownAdapter){if(l.multiple)l.dropdownAdapter=u;else{var E=j.Decorate(u,v);l.dropdownAdapter=E}if(0!==l.minimumResultsForSearch&&(l.dropdownAdapter=j.Decorate(l.dropdownAdapter,z)),l.closeOnSelect&&(l.dropdownAdapter=j.Decorate(l.dropdownAdapter,B)),null!=l.dropdownCssClass||null!=l.dropdownCss||null!=l.adaptDropdownCssClass){var F=b(l.amdBase+"compat/dropdownCss");l.dropdownAdapter=j.Decorate(l.dropdownAdapter,F)}l.dropdownAdapter=j.Decorate(l.dropdownAdapter,y)}if(null==l.selectionAdapter){if(l.multiple?l.selectionAdapter=e:l.selectionAdapter=d,null!=l.placeholder&&(l.selectionAdapter=j.Decorate(l.selectionAdapter,f)),l.allowClear&&(l.selectionAdapter=j.Decorate(l.selectionAdapter,g)),l.multiple&&(l.selectionAdapter=j.Decorate(l.selectionAdapter,h)),null!=l.containerCssClass||null!=l.containerCss||null!=l.adaptContainerCssClass){var G=b(l.amdBase+"compat/containerCss");l.selectionAdapter=j.Decorate(l.selectionAdapter,G)}l.selectionAdapter=j.Decorate(l.selectionAdapter,i)}if("string"==typeof l.language)if(l.language.indexOf("-")>0){var H=l.language.split("-"),I=H[0];l.language=[l.language,I]}else l.language=[l.language];if(a.isArray(l.language)){var J=new k;l.language.push("en");for(var K=l.language,L=0;L<K.length;L++){var M=K[L],N={};try{N=k.loadPath(M)}catch(a){try{M=this.defaults.amdLanguageBase+M,N=k.loadPath(M)}catch(a){l.debug&&window.console&&console.warn&&console.warn('Select2: The language file for "'+M+'" could not be automatically loaded. A fallback will be used instead.');continue}}J.extend(N)}l.translations=J}else{var O=k.loadPath(this.defaults.amdLanguageBase+"en"),P=new k(l.language);P.extend(O),l.translations=P}return l},D.prototype.reset=function(){function b(a){function b(a){return l[a]||a}return a.replace(/[^\u0000-\u007E]/g,b)}function c(d,e){if(""===a.trim(d.term))return e;if(e.children&&e.children.length>0){for(var f=a.extend(!0,{},e),g=e.children.length-1;g>=0;g--){null==c(d,e.children[g])&&f.children.splice(g,1)}return f.children.length>0?f:c(d,f)}var h=b(e.text).toUpperCase(),i=b(d.term).toUpperCase();return h.indexOf(i)>-1?e:null}this.defaults={amdBase:"./",amdLanguageBase:"./i18n/",closeOnSelect:!0,debug:!1,dropdownAutoWidth:!1,escapeMarkup:j.escapeMarkup,language:C,matcher:c,minimumInputLength:0,maximumInputLength:0,maximumSelectionLength:0,minimumResultsForSearch:0,selectOnClose:!1,sorter:function(a){return a},templateResult:function(a){return a.text},templateSelection:function(a){return a.text},theme:"default",width:"resolve"}},D.prototype.set=function(b,c){var d=a.camelCase(b),e={};e[d]=c;var f=j._convertData(e);a.extend(!0,this.defaults,f)},new D}),b.define("select2/options",["require","jquery","./defaults","./utils"],function(a,b,c,d){function e(b,e){if(this.options=b,null!=e&&this.fromElement(e),this.options=c.apply(this.options),e&&e.is("input")){var f=a(this.get("amdBase")+"compat/inputData");this.options.dataAdapter=d.Decorate(this.options.dataAdapter,f)}}return e.prototype.fromElement=function(a){var c=["select2"];null==this.options.multiple&&(this.options.multiple=a.prop("multiple")),null==this.options.disabled&&(this.options.disabled=a.prop("disabled")),null==this.options.language&&(a.prop("lang")?this.options.language=a.prop("lang").toLowerCase():a.closest("[lang]").prop("lang")&&(this.options.language=a.closest("[lang]").prop("lang"))),null==this.options.dir&&(a.prop("dir")?this.options.dir=a.prop("dir"):a.closest("[dir]").prop("dir")?this.options.dir=a.closest("[dir]").prop("dir"):this.options.dir="ltr"),a.prop("disabled",this.options.disabled),a.prop("multiple",this.options.multiple),d.GetData(a[0],"select2Tags")&&(this.options.debug&&window.console&&console.warn&&console.warn('Select2: The `data-select2-tags` attribute has been changed to use the `data-data` and `data-tags="true"` attributes and will be removed in future versions of Select2.'),d.StoreData(a[0],"data",d.GetData(a[0],"select2Tags")),d.StoreData(a[0],"tags",!0)),d.GetData(a[0],"ajaxUrl")&&(this.options.debug&&window.console&&console.warn&&console.warn("Select2: The `data-ajax-url` attribute has been changed to `data-ajax--url` and support for the old attribute will be removed in future versions of Select2."),a.attr("ajax--url",d.GetData(a[0],"ajaxUrl")),d.StoreData(a[0],"ajax-Url",d.GetData(a[0],"ajaxUrl")));var e={};e=b.fn.jquery&&"1."==b.fn.jquery.substr(0,2)&&a[0].dataset?b.extend(!0,{},a[0].dataset,d.GetData(a[0])):d.GetData(a[0]);var f=b.extend(!0,{},e);f=d._convertData(f);for(var g in f)b.inArray(g,c)>-1||(b.isPlainObject(this.options[g])?b.extend(this.options[g],f[g]):this.options[g]=f[g]);return this},e.prototype.get=function(a){return this.options[a]},e.prototype.set=function(a,b){this.options[a]=b},e}),b.define("select2/core",["jquery","./options","./utils","./keys"],function(a,b,c,d){var e=function(a,d){null!=c.GetData(a[0],"select2")&&c.GetData(a[0],"select2").destroy(),this.$element=a,this.id=this._generateId(a),d=d||{},this.options=new b(d,a),e.__super__.constructor.call(this);var f=a.attr("tabindex")||0;c.StoreData(a[0],"old-tabindex",f),a.attr("tabindex","-1");var g=this.options.get("dataAdapter");this.dataAdapter=new g(a,this.options);var h=this.render();this._placeContainer(h);var i=this.options.get("selectionAdapter");this.selection=new i(a,this.options),this.$selection=this.selection.render(),this.selection.position(this.$selection,h);var j=this.options.get("dropdownAdapter");this.dropdown=new j(a,this.options),this.$dropdown=this.dropdown.render(),this.dropdown.position(this.$dropdown,h);var k=this.options.get("resultsAdapter");this.results=new k(a,this.options,this.dataAdapter),this.$results=this.results.render(),this.results.position(this.$results,this.$dropdown);var l=this;this._bindAdapters(),this._registerDomEvents(),this._registerDataEvents(),this._registerSelectionEvents(),this._registerDropdownEvents(),this._registerResultsEvents(),this._registerEvents(),this.dataAdapter.current(function(a){l.trigger("selection:update",{data:a})}),a.addClass("select2-hidden-accessible"),a.attr("aria-hidden","true"),this._syncAttributes(),c.StoreData(a[0],"select2",this),a.data("select2",this)};return c.Extend(e,c.Observable),e.prototype._generateId=function(a){var b="";return b=null!=a.attr("id")?a.attr("id"):null!=a.attr("name")?a.attr("name")+"-"+c.generateChars(2):c.generateChars(4),b=b.replace(/(:|\.|\[|\]|,)/g,""),b="select2-"+b},e.prototype._placeContainer=function(a){a.insertAfter(this.$element);var b=this._resolveWidth(this.$element,this.options.get("width"));null!=b&&a.css("width",b)},e.prototype._resolveWidth=function(a,b){var c=/^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i;if("resolve"==b){var d=this._resolveWidth(a,"style");return null!=d?d:this._resolveWidth(a,"element")}if("element"==b){var e=a.outerWidth(!1);return e<=0?"auto":e+"px"}if("style"==b){var f=a.attr("style");if("string"!=typeof f)return null;for(var g=f.split(";"),h=0,i=g.length;h<i;h+=1){var j=g[h].replace(/\s/g,""),k=j.match(c);if(null!==k&&k.length>=1)return k[1]}return null}return b},e.prototype._bindAdapters=function(){this.dataAdapter.bind(this,this.$container),this.selection.bind(this,this.$container),this.dropdown.bind(this,this.$container),this.results.bind(this,this.$container)},e.prototype._registerDomEvents=function(){var b=this;this.$element.on("change.select2",function(){b.dataAdapter.current(function(a){b.trigger("selection:update",{data:a})})}),this.$element.on("focus.select2",function(a){b.trigger("focus",a)}),this._syncA=c.bind(this._syncAttributes,this),this._syncS=c.bind(this._syncSubtree,this),this.$element[0].attachEvent&&this.$element[0].attachEvent("onpropertychange",this._syncA);var d=window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver;null!=d?(this._observer=new d(function(c){a.each(c,b._syncA),a.each(c,b._syncS)}),this._observer.observe(this.$element[0],{attributes:!0,childList:!0,subtree:!1})):this.$element[0].addEventListener&&(this.$element[0].addEventListener("DOMAttrModified",b._syncA,!1),this.$element[0].addEventListener("DOMNodeInserted",b._syncS,!1),this.$element[0].addEventListener("DOMNodeRemoved",b._syncS,!1))},e.prototype._registerDataEvents=function(){var a=this;this.dataAdapter.on("*",function(b,c){a.trigger(b,c)})},e.prototype._registerSelectionEvents=function(){var b=this,c=["toggle","focus"];this.selection.on("toggle",function(){b.toggleDropdown()}),this.selection.on("focus",function(a){b.focus(a)}),this.selection.on("*",function(d,e){-1===a.inArray(d,c)&&b.trigger(d,e)})},e.prototype._registerDropdownEvents=function(){var a=this;this.dropdown.on("*",function(b,c){a.trigger(b,c)})},e.prototype._registerResultsEvents=function(){var a=this;this.results.on("*",function(b,c){a.trigger(b,c)})},e.prototype._registerEvents=function(){var a=this;this.on("open",function(){a.$container.addClass("select2-container--open")}),this.on("close",function(){a.$container.removeClass("select2-container--open")}),this.on("enable",function(){a.$container.removeClass("select2-container--disabled")}),this.on("disable",function(){a.$container.addClass("select2-container--disabled")}),this.on("blur",function(){a.$container.removeClass("select2-container--focus")}),this.on("query",function(b){a.isOpen()||a.trigger("open",{}),this.dataAdapter.query(b,function(c){a.trigger("results:all",{data:c,query:b})})}),this.on("query:append",function(b){this.dataAdapter.query(b,function(c){a.trigger("results:append",{data:c,query:b})})}),this.on("keypress",function(b){var c=b.which;a.isOpen()?c===d.ESC||c===d.TAB||c===d.UP&&b.altKey?(a.close(),b.preventDefault()):c===d.ENTER?(a.trigger("results:select",{}),b.preventDefault()):c===d.SPACE&&b.ctrlKey?(a.trigger("results:toggle",{}),b.preventDefault()):c===d.UP?(a.trigger("results:previous",{}),b.preventDefault()):c===d.DOWN&&(a.trigger("results:next",{}),b.preventDefault()):(c===d.ENTER||c===d.SPACE||c===d.DOWN&&b.altKey)&&(a.open(),b.preventDefault())})},e.prototype._syncAttributes=function(){this.options.set("disabled",this.$element.prop("disabled")),this.options.get("disabled")?(this.isOpen()&&this.close(),this.trigger("disable",{})):this.trigger("enable",{})},e.prototype._syncSubtree=function(a,b){var c=!1,d=this;if(!a||!a.target||"OPTION"===a.target.nodeName||"OPTGROUP"===a.target.nodeName){if(b)if(b.addedNodes&&b.addedNodes.length>0)for(var e=0;e<b.addedNodes.length;e++){var f=b.addedNodes[e];f.selected&&(c=!0)}else b.removedNodes&&b.removedNodes.length>0&&(c=!0);else c=!0;c&&this.dataAdapter.current(function(a){d.trigger("selection:update",{data:a})})}},e.prototype.trigger=function(a,b){var c=e.__super__.trigger,d={open:"opening",close:"closing",select:"selecting",unselect:"unselecting",clear:"clearing"};if(void 0===b&&(b={}),a in d){var f=d[a],g={prevented:!1,name:a,args:b};if(c.call(this,f,g),g.prevented)return void(b.prevented=!0)}c.call(this,a,b)},e.prototype.toggleDropdown=function(){this.options.get("disabled")||(this.isOpen()?this.close():this.open())},e.prototype.open=function(){this.isOpen()||this.trigger("query",{})},e.prototype.close=function(){this.isOpen()&&this.trigger("close",{})},e.prototype.isOpen=function(){return this.$container.hasClass("select2-container--open")},e.prototype.hasFocus=function(){return this.$container.hasClass("select2-container--focus")},e.prototype.focus=function(a){this.hasFocus()||(this.$container.addClass("select2-container--focus"),this.trigger("focus",{}))},e.prototype.enable=function(a){this.options.get("debug")&&window.console&&console.warn&&console.warn('Select2: The `select2("enable")` method has been deprecated and will be removed in later Select2 versions. Use $element.prop("disabled") instead.'),null!=a&&0!==a.length||(a=[!0]);var b=!a[0];this.$element.prop("disabled",b)},e.prototype.data=function(){this.options.get("debug")&&arguments.length>0&&window.console&&console.warn&&console.warn('Select2: Data can no longer be set using `select2("data")`. You should consider setting the value instead using `$element.val()`.');var a=[];return this.dataAdapter.current(function(b){a=b}),a},e.prototype.val=function(b){if(this.options.get("debug")&&window.console&&console.warn&&console.warn('Select2: The `select2("val")` method has been deprecated and will be removed in later Select2 versions. Use $element.val() instead.'),null==b||0===b.length)return this.$element.val();var c=b[0];a.isArray(c)&&(c=a.map(c,function(a){return a.toString()})),this.$element.val(c).trigger("change")},e.prototype.destroy=function(){this.$container.remove(),this.$element[0].detachEvent&&this.$element[0].detachEvent("onpropertychange",this._syncA),null!=this._observer?(this._observer.disconnect(),this._observer=null):this.$element[0].removeEventListener&&(this.$element[0].removeEventListener("DOMAttrModified",this._syncA,!1),this.$element[0].removeEventListener("DOMNodeInserted",this._syncS,!1),this.$element[0].removeEventListener("DOMNodeRemoved",this._syncS,!1)),this._syncA=null,this._syncS=null,this.$element.off(".select2"),this.$element.attr("tabindex",c.GetData(this.$element[0],"old-tabindex")),this.$element.removeClass("select2-hidden-accessible"),this.$element.attr("aria-hidden","false"),c.RemoveData(this.$element[0]),this.$element.removeData("select2"),this.dataAdapter.destroy(),this.selection.destroy(),this.dropdown.destroy(),this.results.destroy(),this.dataAdapter=null,this.selection=null,this.dropdown=null,this.results=null},e.prototype.render=function(){var b=a('<span class="select2 select2-container"><span class="selection"></span><span class="dropdown-wrapper" aria-hidden="true"></span></span>');return b.attr("dir",this.options.get("dir")),this.$container=b,this.$container.addClass("select2-container--"+this.options.get("theme")),c.StoreData(b[0],"element",this.$element),b},e}),b.define("jquery-mousewheel",["jquery"],function(a){return a}),b.define("jquery.select2",["jquery","jquery-mousewheel","./select2/core","./select2/defaults","./select2/utils"],function(a,b,c,d,e){if(null==a.fn.select2){var f=["open","close","destroy"];a.fn.select2=function(b){if("object"==typeof(b=b||{}))return this.each(function(){var d=a.extend(!0,{},b);new c(a(this),d)}),this;if("string"==typeof b){var d,g=Array.prototype.slice.call(arguments,1);return this.each(function(){var a=e.GetData(this,"select2");null==a&&window.console&&console.error&&console.error("The select2('"+b+"') method was called on an element that is not using Select2."),d=a[b].apply(a,g)}),a.inArray(b,f)>-1?this:d}throw new Error("Invalid arguments for Select2: "+b)}}return null==a.fn.select2.defaults&&(a.fn.select2.defaults=d),c}),{define:b.define,require:b.require}}(),c=b.require("jquery.select2");return a.fn.select2.amd=b,c});

/*  slick  */
/*
     _ _      _       _
 ___| (_) ___| | __  (_)___
/ __| | |/ __| |/ /  | / __|
\__ \ | | (__|   < _ | \__ \
|___/_|_|\___|_|\_(_)/ |___/
                   |__/

 Version: 1.9.0
  Author: Ken Wheeler
 Website: http://kenwheeler.github.io
    Docs: http://kenwheeler.github.io/slick
    Repo: http://github.com/kenwheeler/slick
  Issues: http://github.com/kenwheeler/slick/issues

 */
(function(i){"use strict";"function"==typeof define&&define.amd?define(["jquery"],i):"undefined"!=typeof exports?module.exports=i(require("jquery")):i(jQuery)})(function(i){"use strict";var e=window.Slick||{};e=function(){function e(e,o){var s,n=this;n.defaults={accessibility:!0,adaptiveHeight:!1,appendArrows:i(e),appendDots:i(e),arrows:!0,asNavFor:null,prevArrow:'<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',nextArrow:'<button class="slick-next" aria-label="Next" type="button">Next</button>',autoplay:!1,autoplaySpeed:3e3,centerMode:!1,centerPadding:"50px",cssEase:"ease",customPaging:function(e,t){return i('<button type="button" />').text(t+1)},dots:!1,dotsClass:"slick-dots",draggable:!0,easing:"linear",edgeFriction:.35,fade:!1,focusOnSelect:!1,focusOnChange:!1,infinite:!0,initialSlide:0,lazyLoad:"ondemand",mobileFirst:!1,pauseOnHover:!0,pauseOnFocus:!0,pauseOnDotsHover:!1,respondTo:"window",responsive:null,rows:1,rtl:!1,slide:"",slidesPerRow:1,slidesToShow:1,slidesToScroll:1,speed:500,swipe:!0,swipeToSlide:!1,touchMove:!0,touchThreshold:5,useCSS:!0,useTransform:!0,variableWidth:!1,vertical:!1,verticalSwiping:!1,waitForAnimate:!0,zIndex:1e3},n.initials={animating:!1,dragging:!1,autoPlayTimer:null,currentDirection:0,currentLeft:null,currentSlide:0,direction:1,$dots:null,listWidth:null,listHeight:null,loadIndex:0,$nextArrow:null,$prevArrow:null,scrolling:!1,slideCount:null,slideWidth:null,$slideTrack:null,$slides:null,sliding:!1,slideOffset:0,swipeLeft:null,swiping:!1,$list:null,touchObject:{},transformsEnabled:!1,unslicked:!1},i.extend(n,n.initials),n.activeBreakpoint=null,n.animType=null,n.animProp=null,n.breakpoints=[],n.breakpointSettings=[],n.cssTransitions=!1,n.focussed=!1,n.interrupted=!1,n.hidden="hidden",n.paused=!0,n.positionProp=null,n.respondTo=null,n.rowCount=1,n.shouldClick=!0,n.$slider=i(e),n.$slidesCache=null,n.transformType=null,n.transitionType=null,n.visibilityChange="visibilitychange",n.windowWidth=0,n.windowTimer=null,s=i(e).data("slick")||{},n.options=i.extend({},n.defaults,o,s),n.currentSlide=n.options.initialSlide,n.originalSettings=n.options,"undefined"!=typeof document.mozHidden?(n.hidden="mozHidden",n.visibilityChange="mozvisibilitychange"):"undefined"!=typeof document.webkitHidden&&(n.hidden="webkitHidden",n.visibilityChange="webkitvisibilitychange"),n.autoPlay=i.proxy(n.autoPlay,n),n.autoPlayClear=i.proxy(n.autoPlayClear,n),n.autoPlayIterator=i.proxy(n.autoPlayIterator,n),n.changeSlide=i.proxy(n.changeSlide,n),n.clickHandler=i.proxy(n.clickHandler,n),n.selectHandler=i.proxy(n.selectHandler,n),n.setPosition=i.proxy(n.setPosition,n),n.swipeHandler=i.proxy(n.swipeHandler,n),n.dragHandler=i.proxy(n.dragHandler,n),n.keyHandler=i.proxy(n.keyHandler,n),n.instanceUid=t++,n.htmlExpr=/^(?:\s*(<[\w\W]+>)[^>]*)$/,n.registerBreakpoints(),n.init(!0)}var t=0;return e}(),e.prototype.activateADA=function(){var i=this;i.$slideTrack.find(".slick-active").attr({"aria-hidden":"false"}).find("a, input, button, select").attr({tabindex:"0"})},e.prototype.addSlide=e.prototype.slickAdd=function(e,t,o){var s=this;if("boolean"==typeof t)o=t,t=null;else if(t<0||t>=s.slideCount)return!1;s.unload(),"number"==typeof t?0===t&&0===s.$slides.length?i(e).appendTo(s.$slideTrack):o?i(e).insertBefore(s.$slides.eq(t)):i(e).insertAfter(s.$slides.eq(t)):o===!0?i(e).prependTo(s.$slideTrack):i(e).appendTo(s.$slideTrack),s.$slides=s.$slideTrack.children(this.options.slide),s.$slideTrack.children(this.options.slide).detach(),s.$slideTrack.append(s.$slides),s.$slides.each(function(e,t){i(t).attr("data-slick-index",e)}),s.$slidesCache=s.$slides,s.reinit()},e.prototype.animateHeight=function(){var i=this;if(1===i.options.slidesToShow&&i.options.adaptiveHeight===!0&&i.options.vertical===!1){var e=i.$slides.eq(i.currentSlide).outerHeight(!0);i.$list.animate({height:e},i.options.speed)}},e.prototype.animateSlide=function(e,t){var o={},s=this;s.animateHeight(),s.options.rtl===!0&&s.options.vertical===!1&&(e=-e),s.transformsEnabled===!1?s.options.vertical===!1?s.$slideTrack.animate({left:e},s.options.speed,s.options.easing,t):s.$slideTrack.animate({top:e},s.options.speed,s.options.easing,t):s.cssTransitions===!1?(s.options.rtl===!0&&(s.currentLeft=-s.currentLeft),i({animStart:s.currentLeft}).animate({animStart:e},{duration:s.options.speed,easing:s.options.easing,step:function(i){i=Math.ceil(i),s.options.vertical===!1?(o[s.animType]="translate("+i+"px, 0px)",s.$slideTrack.css(o)):(o[s.animType]="translate(0px,"+i+"px)",s.$slideTrack.css(o))},complete:function(){t&&t.call()}})):(s.applyTransition(),e=Math.ceil(e),s.options.vertical===!1?o[s.animType]="translate3d("+e+"px, 0px, 0px)":o[s.animType]="translate3d(0px,"+e+"px, 0px)",s.$slideTrack.css(o),t&&setTimeout(function(){s.disableTransition(),t.call()},s.options.speed))},e.prototype.getNavTarget=function(){var e=this,t=e.options.asNavFor;return t&&null!==t&&(t=i(t).not(e.$slider)),t},e.prototype.asNavFor=function(e){var t=this,o=t.getNavTarget();null!==o&&"object"==typeof o&&o.each(function(){var t=i(this).slick("getSlick");t.unslicked||t.slideHandler(e,!0)})},e.prototype.applyTransition=function(i){var e=this,t={};e.options.fade===!1?t[e.transitionType]=e.transformType+" "+e.options.speed+"ms "+e.options.cssEase:t[e.transitionType]="opacity "+e.options.speed+"ms "+e.options.cssEase,e.options.fade===!1?e.$slideTrack.css(t):e.$slides.eq(i).css(t)},e.prototype.autoPlay=function(){var i=this;i.autoPlayClear(),i.slideCount>i.options.slidesToShow&&(i.autoPlayTimer=setInterval(i.autoPlayIterator,i.options.autoplaySpeed))},e.prototype.autoPlayClear=function(){var i=this;i.autoPlayTimer&&clearInterval(i.autoPlayTimer)},e.prototype.autoPlayIterator=function(){var i=this,e=i.currentSlide+i.options.slidesToScroll;i.paused||i.interrupted||i.focussed||(i.options.infinite===!1&&(1===i.direction&&i.currentSlide+1===i.slideCount-1?i.direction=0:0===i.direction&&(e=i.currentSlide-i.options.slidesToScroll,i.currentSlide-1===0&&(i.direction=1))),i.slideHandler(e))},e.prototype.buildArrows=function(){var e=this;e.options.arrows===!0&&(e.$prevArrow=i(e.options.prevArrow).addClass("slick-arrow"),e.$nextArrow=i(e.options.nextArrow).addClass("slick-arrow"),e.slideCount>e.options.slidesToShow?(e.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),e.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),e.htmlExpr.test(e.options.prevArrow)&&e.$prevArrow.prependTo(e.options.appendArrows),e.htmlExpr.test(e.options.nextArrow)&&e.$nextArrow.appendTo(e.options.appendArrows),e.options.infinite!==!0&&e.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true")):e.$prevArrow.add(e.$nextArrow).addClass("slick-hidden").attr({"aria-disabled":"true",tabindex:"-1"}))},e.prototype.buildDots=function(){var e,t,o=this;if(o.options.dots===!0&&o.slideCount>o.options.slidesToShow){for(o.$slider.addClass("slick-dotted"),t=i("<ul />").addClass(o.options.dotsClass),e=0;e<=o.getDotCount();e+=1)t.append(i("<li />").append(o.options.customPaging.call(this,o,e)));o.$dots=t.appendTo(o.options.appendDots),o.$dots.find("li").first().addClass("slick-active")}},e.prototype.buildOut=function(){var e=this;e.$slides=e.$slider.children(e.options.slide+":not(.slick-cloned)").addClass("slick-slide"),e.slideCount=e.$slides.length,e.$slides.each(function(e,t){i(t).attr("data-slick-index",e).data("originalStyling",i(t).attr("style")||"")}),e.$slider.addClass("slick-slider"),e.$slideTrack=0===e.slideCount?i('<div class="slick-track"/>').appendTo(e.$slider):e.$slides.wrapAll('<div class="slick-track"/>').parent(),e.$list=e.$slideTrack.wrap('<div class="slick-list"/>').parent(),e.$slideTrack.css("opacity",0),e.options.centerMode!==!0&&e.options.swipeToSlide!==!0||(e.options.slidesToScroll=1),i("img[data-lazy]",e.$slider).not("[src]").addClass("slick-loading"),e.setupInfinite(),e.buildArrows(),e.buildDots(),e.updateDots(),e.setSlideClasses("number"==typeof e.currentSlide?e.currentSlide:0),e.options.draggable===!0&&e.$list.addClass("draggable")},e.prototype.buildRows=function(){var i,e,t,o,s,n,r,l=this;if(o=document.createDocumentFragment(),n=l.$slider.children(),l.options.rows>0){for(r=l.options.slidesPerRow*l.options.rows,s=Math.ceil(n.length/r),i=0;i<s;i++){var d=document.createElement("div");for(e=0;e<l.options.rows;e++){var a=document.createElement("div");for(t=0;t<l.options.slidesPerRow;t++){var c=i*r+(e*l.options.slidesPerRow+t);n.get(c)&&a.appendChild(n.get(c))}d.appendChild(a)}o.appendChild(d)}l.$slider.empty().append(o),l.$slider.children().children().children().css({width:100/l.options.slidesPerRow+"%",display:"inline-block"})}},e.prototype.checkResponsive=function(e,t){var o,s,n,r=this,l=!1,d=r.$slider.width(),a=window.innerWidth||i(window).width();if("window"===r.respondTo?n=a:"slider"===r.respondTo?n=d:"min"===r.respondTo&&(n=Math.min(a,d)),r.options.responsive&&r.options.responsive.length&&null!==r.options.responsive){s=null;for(o in r.breakpoints)r.breakpoints.hasOwnProperty(o)&&(r.originalSettings.mobileFirst===!1?n<r.breakpoints[o]&&(s=r.breakpoints[o]):n>r.breakpoints[o]&&(s=r.breakpoints[o]));null!==s?null!==r.activeBreakpoint?(s!==r.activeBreakpoint||t)&&(r.activeBreakpoint=s,"unslick"===r.breakpointSettings[s]?r.unslick(s):(r.options=i.extend({},r.originalSettings,r.breakpointSettings[s]),e===!0&&(r.currentSlide=r.options.initialSlide),r.refresh(e)),l=s):(r.activeBreakpoint=s,"unslick"===r.breakpointSettings[s]?r.unslick(s):(r.options=i.extend({},r.originalSettings,r.breakpointSettings[s]),e===!0&&(r.currentSlide=r.options.initialSlide),r.refresh(e)),l=s):null!==r.activeBreakpoint&&(r.activeBreakpoint=null,r.options=r.originalSettings,e===!0&&(r.currentSlide=r.options.initialSlide),r.refresh(e),l=s),e||l===!1||r.$slider.trigger("breakpoint",[r,l])}},e.prototype.changeSlide=function(e,t){var o,s,n,r=this,l=i(e.currentTarget);switch(l.is("a")&&e.preventDefault(),l.is("li")||(l=l.closest("li")),n=r.slideCount%r.options.slidesToScroll!==0,o=n?0:(r.slideCount-r.currentSlide)%r.options.slidesToScroll,e.data.message){case"previous":s=0===o?r.options.slidesToScroll:r.options.slidesToShow-o,r.slideCount>r.options.slidesToShow&&r.slideHandler(r.currentSlide-s,!1,t);break;case"next":s=0===o?r.options.slidesToScroll:o,r.slideCount>r.options.slidesToShow&&r.slideHandler(r.currentSlide+s,!1,t);break;case"index":var d=0===e.data.index?0:e.data.index||l.index()*r.options.slidesToScroll;r.slideHandler(r.checkNavigable(d),!1,t),l.children().trigger("focus");break;default:return}},e.prototype.checkNavigable=function(i){var e,t,o=this;if(e=o.getNavigableIndexes(),t=0,i>e[e.length-1])i=e[e.length-1];else for(var s in e){if(i<e[s]){i=t;break}t=e[s]}return i},e.prototype.cleanUpEvents=function(){var e=this;e.options.dots&&null!==e.$dots&&(i("li",e.$dots).off("click.slick",e.changeSlide).off("mouseenter.slick",i.proxy(e.interrupt,e,!0)).off("mouseleave.slick",i.proxy(e.interrupt,e,!1)),e.options.accessibility===!0&&e.$dots.off("keydown.slick",e.keyHandler)),e.$slider.off("focus.slick blur.slick"),e.options.arrows===!0&&e.slideCount>e.options.slidesToShow&&(e.$prevArrow&&e.$prevArrow.off("click.slick",e.changeSlide),e.$nextArrow&&e.$nextArrow.off("click.slick",e.changeSlide),e.options.accessibility===!0&&(e.$prevArrow&&e.$prevArrow.off("keydown.slick",e.keyHandler),e.$nextArrow&&e.$nextArrow.off("keydown.slick",e.keyHandler))),e.$list.off("touchstart.slick mousedown.slick",e.swipeHandler),e.$list.off("touchmove.slick mousemove.slick",e.swipeHandler),e.$list.off("touchend.slick mouseup.slick",e.swipeHandler),e.$list.off("touchcancel.slick mouseleave.slick",e.swipeHandler),e.$list.off("click.slick",e.clickHandler),i(document).off(e.visibilityChange,e.visibility),e.cleanUpSlideEvents(),e.options.accessibility===!0&&e.$list.off("keydown.slick",e.keyHandler),e.options.focusOnSelect===!0&&i(e.$slideTrack).children().off("click.slick",e.selectHandler),i(window).off("orientationchange.slick.slick-"+e.instanceUid,e.orientationChange),i(window).off("resize.slick.slick-"+e.instanceUid,e.resize),i("[draggable!=true]",e.$slideTrack).off("dragstart",e.preventDefault),i(window).off("load.slick.slick-"+e.instanceUid,e.setPosition)},e.prototype.cleanUpSlideEvents=function(){var e=this;e.$list.off("mouseenter.slick",i.proxy(e.interrupt,e,!0)),e.$list.off("mouseleave.slick",i.proxy(e.interrupt,e,!1))},e.prototype.cleanUpRows=function(){var i,e=this;e.options.rows>0&&(i=e.$slides.children().children(),i.removeAttr("style"),e.$slider.empty().append(i))},e.prototype.clickHandler=function(i){var e=this;e.shouldClick===!1&&(i.stopImmediatePropagation(),i.stopPropagation(),i.preventDefault())},e.prototype.destroy=function(e){var t=this;t.autoPlayClear(),t.touchObject={},t.cleanUpEvents(),i(".slick-cloned",t.$slider).detach(),t.$dots&&t.$dots.remove(),t.$prevArrow&&t.$prevArrow.length&&(t.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),t.htmlExpr.test(t.options.prevArrow)&&t.$prevArrow.remove()),t.$nextArrow&&t.$nextArrow.length&&(t.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),t.htmlExpr.test(t.options.nextArrow)&&t.$nextArrow.remove()),t.$slides&&(t.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function(){i(this).attr("style",i(this).data("originalStyling"))}),t.$slideTrack.children(this.options.slide).detach(),t.$slideTrack.detach(),t.$list.detach(),t.$slider.append(t.$slides)),t.cleanUpRows(),t.$slider.removeClass("slick-slider"),t.$slider.removeClass("slick-initialized"),t.$slider.removeClass("slick-dotted"),t.unslicked=!0,e||t.$slider.trigger("destroy",[t])},e.prototype.disableTransition=function(i){var e=this,t={};t[e.transitionType]="",e.options.fade===!1?e.$slideTrack.css(t):e.$slides.eq(i).css(t)},e.prototype.fadeSlide=function(i,e){var t=this;t.cssTransitions===!1?(t.$slides.eq(i).css({zIndex:t.options.zIndex}),t.$slides.eq(i).animate({opacity:1},t.options.speed,t.options.easing,e)):(t.applyTransition(i),t.$slides.eq(i).css({opacity:1,zIndex:t.options.zIndex}),e&&setTimeout(function(){t.disableTransition(i),e.call()},t.options.speed))},e.prototype.fadeSlideOut=function(i){var e=this;e.cssTransitions===!1?e.$slides.eq(i).animate({opacity:0,zIndex:e.options.zIndex-2},e.options.speed,e.options.easing):(e.applyTransition(i),e.$slides.eq(i).css({opacity:0,zIndex:e.options.zIndex-2}))},e.prototype.filterSlides=e.prototype.slickFilter=function(i){var e=this;null!==i&&(e.$slidesCache=e.$slides,e.unload(),e.$slideTrack.children(this.options.slide).detach(),e.$slidesCache.filter(i).appendTo(e.$slideTrack),e.reinit())},e.prototype.focusHandler=function(){var e=this;e.$slider.off("focus.slick blur.slick").on("focus.slick","*",function(t){var o=i(this);setTimeout(function(){e.options.pauseOnFocus&&o.is(":focus")&&(e.focussed=!0,e.autoPlay())},0)}).on("blur.slick","*",function(t){i(this);e.options.pauseOnFocus&&(e.focussed=!1,e.autoPlay())})},e.prototype.getCurrent=e.prototype.slickCurrentSlide=function(){var i=this;return i.currentSlide},e.prototype.getDotCount=function(){var i=this,e=0,t=0,o=0;if(i.options.infinite===!0)if(i.slideCount<=i.options.slidesToShow)++o;else for(;e<i.slideCount;)++o,e=t+i.options.slidesToScroll,t+=i.options.slidesToScroll<=i.options.slidesToShow?i.options.slidesToScroll:i.options.slidesToShow;else if(i.options.centerMode===!0)o=i.slideCount;else if(i.options.asNavFor)for(;e<i.slideCount;)++o,e=t+i.options.slidesToScroll,t+=i.options.slidesToScroll<=i.options.slidesToShow?i.options.slidesToScroll:i.options.slidesToShow;else o=1+Math.ceil((i.slideCount-i.options.slidesToShow)/i.options.slidesToScroll);return o-1},e.prototype.getLeft=function(i){var e,t,o,s,n=this,r=0;return n.slideOffset=0,t=n.$slides.first().outerHeight(!0),n.options.infinite===!0?(n.slideCount>n.options.slidesToShow&&(n.slideOffset=n.slideWidth*n.options.slidesToShow*-1,s=-1,n.options.vertical===!0&&n.options.centerMode===!0&&(2===n.options.slidesToShow?s=-1.5:1===n.options.slidesToShow&&(s=-2)),r=t*n.options.slidesToShow*s),n.slideCount%n.options.slidesToScroll!==0&&i+n.options.slidesToScroll>n.slideCount&&n.slideCount>n.options.slidesToShow&&(i>n.slideCount?(n.slideOffset=(n.options.slidesToShow-(i-n.slideCount))*n.slideWidth*-1,r=(n.options.slidesToShow-(i-n.slideCount))*t*-1):(n.slideOffset=n.slideCount%n.options.slidesToScroll*n.slideWidth*-1,r=n.slideCount%n.options.slidesToScroll*t*-1))):i+n.options.slidesToShow>n.slideCount&&(n.slideOffset=(i+n.options.slidesToShow-n.slideCount)*n.slideWidth,r=(i+n.options.slidesToShow-n.slideCount)*t),n.slideCount<=n.options.slidesToShow&&(n.slideOffset=0,r=0),n.options.centerMode===!0&&n.slideCount<=n.options.slidesToShow?n.slideOffset=n.slideWidth*Math.floor(n.options.slidesToShow)/2-n.slideWidth*n.slideCount/2:n.options.centerMode===!0&&n.options.infinite===!0?n.slideOffset+=n.slideWidth*Math.floor(n.options.slidesToShow/2)-n.slideWidth:n.options.centerMode===!0&&(n.slideOffset=0,n.slideOffset+=n.slideWidth*Math.floor(n.options.slidesToShow/2)),e=n.options.vertical===!1?i*n.slideWidth*-1+n.slideOffset:i*t*-1+r,n.options.variableWidth===!0&&(o=n.slideCount<=n.options.slidesToShow||n.options.infinite===!1?n.$slideTrack.children(".slick-slide").eq(i):n.$slideTrack.children(".slick-slide").eq(i+n.options.slidesToShow),e=n.options.rtl===!0?o[0]?(n.$slideTrack.width()-o[0].offsetLeft-o.width())*-1:0:o[0]?o[0].offsetLeft*-1:0,n.options.centerMode===!0&&(o=n.slideCount<=n.options.slidesToShow||n.options.infinite===!1?n.$slideTrack.children(".slick-slide").eq(i):n.$slideTrack.children(".slick-slide").eq(i+n.options.slidesToShow+1),e=n.options.rtl===!0?o[0]?(n.$slideTrack.width()-o[0].offsetLeft-o.width())*-1:0:o[0]?o[0].offsetLeft*-1:0,e+=(n.$list.width()-o.outerWidth())/2)),e},e.prototype.getOption=e.prototype.slickGetOption=function(i){var e=this;return e.options[i]},e.prototype.getNavigableIndexes=function(){var i,e=this,t=0,o=0,s=[];for(e.options.infinite===!1?i=e.slideCount:(t=e.options.slidesToScroll*-1,o=e.options.slidesToScroll*-1,i=2*e.slideCount);t<i;)s.push(t),t=o+e.options.slidesToScroll,o+=e.options.slidesToScroll<=e.options.slidesToShow?e.options.slidesToScroll:e.options.slidesToShow;return s},e.prototype.getSlick=function(){return this},e.prototype.getSlideCount=function(){var e,t,o,s,n=this;return s=n.options.centerMode===!0?Math.floor(n.$list.width()/2):0,o=n.swipeLeft*-1+s,n.options.swipeToSlide===!0?(n.$slideTrack.find(".slick-slide").each(function(e,s){var r,l,d;if(r=i(s).outerWidth(),l=s.offsetLeft,n.options.centerMode!==!0&&(l+=r/2),d=l+r,o<d)return t=s,!1}),e=Math.abs(i(t).attr("data-slick-index")-n.currentSlide)||1):n.options.slidesToScroll},e.prototype.goTo=e.prototype.slickGoTo=function(i,e){var t=this;t.changeSlide({data:{message:"index",index:parseInt(i)}},e)},e.prototype.init=function(e){var t=this;i(t.$slider).hasClass("slick-initialized")||(i(t.$slider).addClass("slick-initialized"),t.buildRows(),t.buildOut(),t.setProps(),t.startLoad(),t.loadSlider(),t.initializeEvents(),t.updateArrows(),t.updateDots(),t.checkResponsive(!0),t.focusHandler()),e&&t.$slider.trigger("init",[t]),t.options.accessibility===!0&&t.initADA(),t.options.autoplay&&(t.paused=!1,t.autoPlay())},e.prototype.initADA=function(){var e=this,t=Math.ceil(e.slideCount/e.options.slidesToShow),o=e.getNavigableIndexes().filter(function(i){return i>=0&&i<e.slideCount});e.$slides.add(e.$slideTrack.find(".slick-cloned")).attr({"aria-hidden":"true",tabindex:"-1"}).find("a, input, button, select").attr({tabindex:"-1"}),null!==e.$dots&&(e.$slides.not(e.$slideTrack.find(".slick-cloned")).each(function(t){var s=o.indexOf(t);if(i(this).attr({role:"tabpanel",id:"slick-slide"+e.instanceUid+t,tabindex:-1}),s!==-1){var n="slick-slide-control"+e.instanceUid+s;i("#"+n).length&&i(this).attr({"aria-describedby":n})}}),e.$dots.attr("role","tablist").find("li").each(function(s){var n=o[s];i(this).attr({role:"presentation"}),i(this).find("button").first().attr({role:"tab",id:"slick-slide-control"+e.instanceUid+s,"aria-controls":"slick-slide"+e.instanceUid+n,"aria-label":s+1+" of "+t,"aria-selected":null,tabindex:"-1"})}).eq(e.currentSlide).find("button").attr({"aria-selected":"true",tabindex:"0"}).end());for(var s=e.currentSlide,n=s+e.options.slidesToShow;s<n;s++)e.options.focusOnChange?e.$slides.eq(s).attr({tabindex:"0"}):e.$slides.eq(s).removeAttr("tabindex");e.activateADA()},e.prototype.initArrowEvents=function(){var i=this;i.options.arrows===!0&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.off("click.slick").on("click.slick",{message:"previous"},i.changeSlide),i.$nextArrow.off("click.slick").on("click.slick",{message:"next"},i.changeSlide),i.options.accessibility===!0&&(i.$prevArrow.on("keydown.slick",i.keyHandler),i.$nextArrow.on("keydown.slick",i.keyHandler)))},e.prototype.initDotEvents=function(){var e=this;e.options.dots===!0&&e.slideCount>e.options.slidesToShow&&(i("li",e.$dots).on("click.slick",{message:"index"},e.changeSlide),e.options.accessibility===!0&&e.$dots.on("keydown.slick",e.keyHandler)),e.options.dots===!0&&e.options.pauseOnDotsHover===!0&&e.slideCount>e.options.slidesToShow&&i("li",e.$dots).on("mouseenter.slick",i.proxy(e.interrupt,e,!0)).on("mouseleave.slick",i.proxy(e.interrupt,e,!1))},e.prototype.initSlideEvents=function(){var e=this;e.options.pauseOnHover&&(e.$list.on("mouseenter.slick",i.proxy(e.interrupt,e,!0)),e.$list.on("mouseleave.slick",i.proxy(e.interrupt,e,!1)))},e.prototype.initializeEvents=function(){var e=this;e.initArrowEvents(),e.initDotEvents(),e.initSlideEvents(),e.$list.on("touchstart.slick mousedown.slick",{action:"start"},e.swipeHandler),e.$list.on("touchmove.slick mousemove.slick",{action:"move"},e.swipeHandler),e.$list.on("touchend.slick mouseup.slick",{action:"end"},e.swipeHandler),e.$list.on("touchcancel.slick mouseleave.slick",{action:"end"},e.swipeHandler),e.$list.on("click.slick",e.clickHandler),i(document).on(e.visibilityChange,i.proxy(e.visibility,e)),e.options.accessibility===!0&&e.$list.on("keydown.slick",e.keyHandler),e.options.focusOnSelect===!0&&i(e.$slideTrack).children().on("click.slick",e.selectHandler),i(window).on("orientationchange.slick.slick-"+e.instanceUid,i.proxy(e.orientationChange,e)),i(window).on("resize.slick.slick-"+e.instanceUid,i.proxy(e.resize,e)),i("[draggable!=true]",e.$slideTrack).on("dragstart",e.preventDefault),i(window).on("load.slick.slick-"+e.instanceUid,e.setPosition),i(e.setPosition)},e.prototype.initUI=function(){var i=this;i.options.arrows===!0&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.show(),i.$nextArrow.show()),i.options.dots===!0&&i.slideCount>i.options.slidesToShow&&i.$dots.show()},e.prototype.keyHandler=function(i){var e=this;i.target.tagName.match("TEXTAREA|INPUT|SELECT")||(37===i.keyCode&&e.options.accessibility===!0?e.changeSlide({data:{message:e.options.rtl===!0?"next":"previous"}}):39===i.keyCode&&e.options.accessibility===!0&&e.changeSlide({data:{message:e.options.rtl===!0?"previous":"next"}}))},e.prototype.lazyLoad=function(){function e(e){i("img[data-lazy]",e).each(function(){var e=i(this),t=i(this).attr("data-lazy"),o=i(this).attr("data-srcset"),s=i(this).attr("data-sizes")||r.$slider.attr("data-sizes"),n=document.createElement("img");n.onload=function(){e.animate({opacity:0},100,function(){o&&(e.attr("srcset",o),s&&e.attr("sizes",s)),e.attr("src",t).animate({opacity:1},200,function(){e.removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading")}),r.$slider.trigger("lazyLoaded",[r,e,t])})},n.onerror=function(){e.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),r.$slider.trigger("lazyLoadError",[r,e,t])},n.src=t})}var t,o,s,n,r=this;if(r.options.centerMode===!0?r.options.infinite===!0?(s=r.currentSlide+(r.options.slidesToShow/2+1),n=s+r.options.slidesToShow+2):(s=Math.max(0,r.currentSlide-(r.options.slidesToShow/2+1)),n=2+(r.options.slidesToShow/2+1)+r.currentSlide):(s=r.options.infinite?r.options.slidesToShow+r.currentSlide:r.currentSlide,n=Math.ceil(s+r.options.slidesToShow),r.options.fade===!0&&(s>0&&s--,n<=r.slideCount&&n++)),t=r.$slider.find(".slick-slide").slice(s,n),"anticipated"===r.options.lazyLoad)for(var l=s-1,d=n,a=r.$slider.find(".slick-slide"),c=0;c<r.options.slidesToScroll;c++)l<0&&(l=r.slideCount-1),t=t.add(a.eq(l)),t=t.add(a.eq(d)),l--,d++;e(t),r.slideCount<=r.options.slidesToShow?(o=r.$slider.find(".slick-slide"),e(o)):r.currentSlide>=r.slideCount-r.options.slidesToShow?(o=r.$slider.find(".slick-cloned").slice(0,r.options.slidesToShow),e(o)):0===r.currentSlide&&(o=r.$slider.find(".slick-cloned").slice(r.options.slidesToShow*-1),e(o))},e.prototype.loadSlider=function(){var i=this;i.setPosition(),i.$slideTrack.css({opacity:1}),i.$slider.removeClass("slick-loading"),i.initUI(),"progressive"===i.options.lazyLoad&&i.progressiveLazyLoad()},e.prototype.next=e.prototype.slickNext=function(){var i=this;i.changeSlide({data:{message:"next"}})},e.prototype.orientationChange=function(){var i=this;i.checkResponsive(),i.setPosition()},e.prototype.pause=e.prototype.slickPause=function(){var i=this;i.autoPlayClear(),i.paused=!0},e.prototype.play=e.prototype.slickPlay=function(){var i=this;i.autoPlay(),i.options.autoplay=!0,i.paused=!1,i.focussed=!1,i.interrupted=!1},e.prototype.postSlide=function(e){var t=this;if(!t.unslicked&&(t.$slider.trigger("afterChange",[t,e]),t.animating=!1,t.slideCount>t.options.slidesToShow&&t.setPosition(),t.swipeLeft=null,t.options.autoplay&&t.autoPlay(),t.options.accessibility===!0&&(t.initADA(),t.options.focusOnChange))){var o=i(t.$slides.get(t.currentSlide));o.attr("tabindex",0).focus()}},e.prototype.prev=e.prototype.slickPrev=function(){var i=this;i.changeSlide({data:{message:"previous"}})},e.prototype.preventDefault=function(i){i.preventDefault()},e.prototype.progressiveLazyLoad=function(e){e=e||1;var t,o,s,n,r,l=this,d=i("img[data-lazy]",l.$slider);d.length?(t=d.first(),o=t.attr("data-lazy"),s=t.attr("data-srcset"),n=t.attr("data-sizes")||l.$slider.attr("data-sizes"),r=document.createElement("img"),r.onload=function(){s&&(t.attr("srcset",s),n&&t.attr("sizes",n)),t.attr("src",o).removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading"),l.options.adaptiveHeight===!0&&l.setPosition(),l.$slider.trigger("lazyLoaded",[l,t,o]),l.progressiveLazyLoad()},r.onerror=function(){e<3?setTimeout(function(){l.progressiveLazyLoad(e+1)},500):(t.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),l.$slider.trigger("lazyLoadError",[l,t,o]),l.progressiveLazyLoad())},r.src=o):l.$slider.trigger("allImagesLoaded",[l])},e.prototype.refresh=function(e){var t,o,s=this;o=s.slideCount-s.options.slidesToShow,!s.options.infinite&&s.currentSlide>o&&(s.currentSlide=o),s.slideCount<=s.options.slidesToShow&&(s.currentSlide=0),t=s.currentSlide,s.destroy(!0),i.extend(s,s.initials,{currentSlide:t}),s.init(),e||s.changeSlide({data:{message:"index",index:t}},!1)},e.prototype.registerBreakpoints=function(){var e,t,o,s=this,n=s.options.responsive||null;if("array"===i.type(n)&&n.length){s.respondTo=s.options.respondTo||"window";for(e in n)if(o=s.breakpoints.length-1,n.hasOwnProperty(e)){for(t=n[e].breakpoint;o>=0;)s.breakpoints[o]&&s.breakpoints[o]===t&&s.breakpoints.splice(o,1),o--;s.breakpoints.push(t),s.breakpointSettings[t]=n[e].settings}s.breakpoints.sort(function(i,e){return s.options.mobileFirst?i-e:e-i})}},e.prototype.reinit=function(){var e=this;e.$slides=e.$slideTrack.children(e.options.slide).addClass("slick-slide"),e.slideCount=e.$slides.length,e.currentSlide>=e.slideCount&&0!==e.currentSlide&&(e.currentSlide=e.currentSlide-e.options.slidesToScroll),e.slideCount<=e.options.slidesToShow&&(e.currentSlide=0),e.registerBreakpoints(),e.setProps(),e.setupInfinite(),e.buildArrows(),e.updateArrows(),e.initArrowEvents(),e.buildDots(),e.updateDots(),e.initDotEvents(),e.cleanUpSlideEvents(),e.initSlideEvents(),e.checkResponsive(!1,!0),e.options.focusOnSelect===!0&&i(e.$slideTrack).children().on("click.slick",e.selectHandler),e.setSlideClasses("number"==typeof e.currentSlide?e.currentSlide:0),e.setPosition(),e.focusHandler(),e.paused=!e.options.autoplay,e.autoPlay(),e.$slider.trigger("reInit",[e])},e.prototype.resize=function(){var e=this;i(window).width()!==e.windowWidth&&(clearTimeout(e.windowDelay),e.windowDelay=window.setTimeout(function(){e.windowWidth=i(window).width(),e.checkResponsive(),e.unslicked||e.setPosition()},50))},e.prototype.removeSlide=e.prototype.slickRemove=function(i,e,t){var o=this;return"boolean"==typeof i?(e=i,i=e===!0?0:o.slideCount-1):i=e===!0?--i:i,!(o.slideCount<1||i<0||i>o.slideCount-1)&&(o.unload(),t===!0?o.$slideTrack.children().remove():o.$slideTrack.children(this.options.slide).eq(i).remove(),o.$slides=o.$slideTrack.children(this.options.slide),o.$slideTrack.children(this.options.slide).detach(),o.$slideTrack.append(o.$slides),o.$slidesCache=o.$slides,void o.reinit())},e.prototype.setCSS=function(i){var e,t,o=this,s={};o.options.rtl===!0&&(i=-i),e="left"==o.positionProp?Math.ceil(i)+"px":"0px",t="top"==o.positionProp?Math.ceil(i)+"px":"0px",s[o.positionProp]=i,o.transformsEnabled===!1?o.$slideTrack.css(s):(s={},o.cssTransitions===!1?(s[o.animType]="translate("+e+", "+t+")",o.$slideTrack.css(s)):(s[o.animType]="translate3d("+e+", "+t+", 0px)",o.$slideTrack.css(s)))},e.prototype.setDimensions=function(){var i=this;i.options.vertical===!1?i.options.centerMode===!0&&i.$list.css({padding:"0px "+i.options.centerPadding}):(i.$list.height(i.$slides.first().outerHeight(!0)*i.options.slidesToShow),i.options.centerMode===!0&&i.$list.css({padding:i.options.centerPadding+" 0px"})),i.listWidth=i.$list.width(),i.listHeight=i.$list.height(),i.options.vertical===!1&&i.options.variableWidth===!1?(i.slideWidth=Math.ceil(i.listWidth/i.options.slidesToShow),i.$slideTrack.width(Math.ceil(i.slideWidth*i.$slideTrack.children(".slick-slide").length))):i.options.variableWidth===!0?i.$slideTrack.width(5e3*i.slideCount):(i.slideWidth=Math.ceil(i.listWidth),i.$slideTrack.height(Math.ceil(i.$slides.first().outerHeight(!0)*i.$slideTrack.children(".slick-slide").length)));var e=i.$slides.first().outerWidth(!0)-i.$slides.first().width();i.options.variableWidth===!1&&i.$slideTrack.children(".slick-slide").width(i.slideWidth-e)},e.prototype.setFade=function(){var e,t=this;t.$slides.each(function(o,s){e=t.slideWidth*o*-1,t.options.rtl===!0?i(s).css({position:"relative",right:e,top:0,zIndex:t.options.zIndex-2,opacity:0}):i(s).css({position:"relative",left:e,top:0,zIndex:t.options.zIndex-2,opacity:0})}),t.$slides.eq(t.currentSlide).css({zIndex:t.options.zIndex-1,opacity:1})},e.prototype.setHeight=function(){var i=this;if(1===i.options.slidesToShow&&i.options.adaptiveHeight===!0&&i.options.vertical===!1){var e=i.$slides.eq(i.currentSlide).outerHeight(!0);i.$list.css("height",e)}},e.prototype.setOption=e.prototype.slickSetOption=function(){var e,t,o,s,n,r=this,l=!1;if("object"===i.type(arguments[0])?(o=arguments[0],l=arguments[1],n="multiple"):"string"===i.type(arguments[0])&&(o=arguments[0],s=arguments[1],l=arguments[2],"responsive"===arguments[0]&&"array"===i.type(arguments[1])?n="responsive":"undefined"!=typeof arguments[1]&&(n="single")),"single"===n)r.options[o]=s;else if("multiple"===n)i.each(o,function(i,e){r.options[i]=e});else if("responsive"===n)for(t in s)if("array"!==i.type(r.options.responsive))r.options.responsive=[s[t]];else{for(e=r.options.responsive.length-1;e>=0;)r.options.responsive[e].breakpoint===s[t].breakpoint&&r.options.responsive.splice(e,1),e--;r.options.responsive.push(s[t])}l&&(r.unload(),r.reinit())},e.prototype.setPosition=function(){var i=this;i.setDimensions(),i.setHeight(),i.options.fade===!1?i.setCSS(i.getLeft(i.currentSlide)):i.setFade(),i.$slider.trigger("setPosition",[i])},e.prototype.setProps=function(){var i=this,e=document.body.style;i.positionProp=i.options.vertical===!0?"top":"left",
"top"===i.positionProp?i.$slider.addClass("slick-vertical"):i.$slider.removeClass("slick-vertical"),void 0===e.WebkitTransition&&void 0===e.MozTransition&&void 0===e.msTransition||i.options.useCSS===!0&&(i.cssTransitions=!0),i.options.fade&&("number"==typeof i.options.zIndex?i.options.zIndex<3&&(i.options.zIndex=3):i.options.zIndex=i.defaults.zIndex),void 0!==e.OTransform&&(i.animType="OTransform",i.transformType="-o-transform",i.transitionType="OTransition",void 0===e.perspectiveProperty&&void 0===e.webkitPerspective&&(i.animType=!1)),void 0!==e.MozTransform&&(i.animType="MozTransform",i.transformType="-moz-transform",i.transitionType="MozTransition",void 0===e.perspectiveProperty&&void 0===e.MozPerspective&&(i.animType=!1)),void 0!==e.webkitTransform&&(i.animType="webkitTransform",i.transformType="-webkit-transform",i.transitionType="webkitTransition",void 0===e.perspectiveProperty&&void 0===e.webkitPerspective&&(i.animType=!1)),void 0!==e.msTransform&&(i.animType="msTransform",i.transformType="-ms-transform",i.transitionType="msTransition",void 0===e.msTransform&&(i.animType=!1)),void 0!==e.transform&&i.animType!==!1&&(i.animType="transform",i.transformType="transform",i.transitionType="transition"),i.transformsEnabled=i.options.useTransform&&null!==i.animType&&i.animType!==!1},e.prototype.setSlideClasses=function(i){var e,t,o,s,n=this;if(t=n.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden","true"),n.$slides.eq(i).addClass("slick-current"),n.options.centerMode===!0){var r=n.options.slidesToShow%2===0?1:0;e=Math.floor(n.options.slidesToShow/2),n.options.infinite===!0&&(i>=e&&i<=n.slideCount-1-e?n.$slides.slice(i-e+r,i+e+1).addClass("slick-active").attr("aria-hidden","false"):(o=n.options.slidesToShow+i,t.slice(o-e+1+r,o+e+2).addClass("slick-active").attr("aria-hidden","false")),0===i?t.eq(t.length-1-n.options.slidesToShow).addClass("slick-center"):i===n.slideCount-1&&t.eq(n.options.slidesToShow).addClass("slick-center")),n.$slides.eq(i).addClass("slick-center")}else i>=0&&i<=n.slideCount-n.options.slidesToShow?n.$slides.slice(i,i+n.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false"):t.length<=n.options.slidesToShow?t.addClass("slick-active").attr("aria-hidden","false"):(s=n.slideCount%n.options.slidesToShow,o=n.options.infinite===!0?n.options.slidesToShow+i:i,n.options.slidesToShow==n.options.slidesToScroll&&n.slideCount-i<n.options.slidesToShow?t.slice(o-(n.options.slidesToShow-s),o+s).addClass("slick-active").attr("aria-hidden","false"):t.slice(o,o+n.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false"));"ondemand"!==n.options.lazyLoad&&"anticipated"!==n.options.lazyLoad||n.lazyLoad()},e.prototype.setupInfinite=function(){var e,t,o,s=this;if(s.options.fade===!0&&(s.options.centerMode=!1),s.options.infinite===!0&&s.options.fade===!1&&(t=null,s.slideCount>s.options.slidesToShow)){for(o=s.options.centerMode===!0?s.options.slidesToShow+1:s.options.slidesToShow,e=s.slideCount;e>s.slideCount-o;e-=1)t=e-1,i(s.$slides[t]).clone(!0).attr("id","").attr("data-slick-index",t-s.slideCount).prependTo(s.$slideTrack).addClass("slick-cloned");for(e=0;e<o+s.slideCount;e+=1)t=e,i(s.$slides[t]).clone(!0).attr("id","").attr("data-slick-index",t+s.slideCount).appendTo(s.$slideTrack).addClass("slick-cloned");s.$slideTrack.find(".slick-cloned").find("[id]").each(function(){i(this).attr("id","")})}},e.prototype.interrupt=function(i){var e=this;i||e.autoPlay(),e.interrupted=i},e.prototype.selectHandler=function(e){var t=this,o=i(e.target).is(".slick-slide")?i(e.target):i(e.target).parents(".slick-slide"),s=parseInt(o.attr("data-slick-index"));return s||(s=0),t.slideCount<=t.options.slidesToShow?void t.slideHandler(s,!1,!0):void t.slideHandler(s)},e.prototype.slideHandler=function(i,e,t){var o,s,n,r,l,d=null,a=this;if(e=e||!1,!(a.animating===!0&&a.options.waitForAnimate===!0||a.options.fade===!0&&a.currentSlide===i))return e===!1&&a.asNavFor(i),o=i,d=a.getLeft(o),r=a.getLeft(a.currentSlide),a.currentLeft=null===a.swipeLeft?r:a.swipeLeft,a.options.infinite===!1&&a.options.centerMode===!1&&(i<0||i>a.getDotCount()*a.options.slidesToScroll)?void(a.options.fade===!1&&(o=a.currentSlide,t!==!0&&a.slideCount>a.options.slidesToShow?a.animateSlide(r,function(){a.postSlide(o)}):a.postSlide(o))):a.options.infinite===!1&&a.options.centerMode===!0&&(i<0||i>a.slideCount-a.options.slidesToScroll)?void(a.options.fade===!1&&(o=a.currentSlide,t!==!0&&a.slideCount>a.options.slidesToShow?a.animateSlide(r,function(){a.postSlide(o)}):a.postSlide(o))):(a.options.autoplay&&clearInterval(a.autoPlayTimer),s=o<0?a.slideCount%a.options.slidesToScroll!==0?a.slideCount-a.slideCount%a.options.slidesToScroll:a.slideCount+o:o>=a.slideCount?a.slideCount%a.options.slidesToScroll!==0?0:o-a.slideCount:o,a.animating=!0,a.$slider.trigger("beforeChange",[a,a.currentSlide,s]),n=a.currentSlide,a.currentSlide=s,a.setSlideClasses(a.currentSlide),a.options.asNavFor&&(l=a.getNavTarget(),l=l.slick("getSlick"),l.slideCount<=l.options.slidesToShow&&l.setSlideClasses(a.currentSlide)),a.updateDots(),a.updateArrows(),a.options.fade===!0?(t!==!0?(a.fadeSlideOut(n),a.fadeSlide(s,function(){a.postSlide(s)})):a.postSlide(s),void a.animateHeight()):void(t!==!0&&a.slideCount>a.options.slidesToShow?a.animateSlide(d,function(){a.postSlide(s)}):a.postSlide(s)))},e.prototype.startLoad=function(){var i=this;i.options.arrows===!0&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.hide(),i.$nextArrow.hide()),i.options.dots===!0&&i.slideCount>i.options.slidesToShow&&i.$dots.hide(),i.$slider.addClass("slick-loading")},e.prototype.swipeDirection=function(){var i,e,t,o,s=this;return i=s.touchObject.startX-s.touchObject.curX,e=s.touchObject.startY-s.touchObject.curY,t=Math.atan2(e,i),o=Math.round(180*t/Math.PI),o<0&&(o=360-Math.abs(o)),o<=45&&o>=0?s.options.rtl===!1?"left":"right":o<=360&&o>=315?s.options.rtl===!1?"left":"right":o>=135&&o<=225?s.options.rtl===!1?"right":"left":s.options.verticalSwiping===!0?o>=35&&o<=135?"down":"up":"vertical"},e.prototype.swipeEnd=function(i){var e,t,o=this;if(o.dragging=!1,o.swiping=!1,o.scrolling)return o.scrolling=!1,!1;if(o.interrupted=!1,o.shouldClick=!(o.touchObject.swipeLength>10),void 0===o.touchObject.curX)return!1;if(o.touchObject.edgeHit===!0&&o.$slider.trigger("edge",[o,o.swipeDirection()]),o.touchObject.swipeLength>=o.touchObject.minSwipe){switch(t=o.swipeDirection()){case"left":case"down":e=o.options.swipeToSlide?o.checkNavigable(o.currentSlide+o.getSlideCount()):o.currentSlide+o.getSlideCount(),o.currentDirection=0;break;case"right":case"up":e=o.options.swipeToSlide?o.checkNavigable(o.currentSlide-o.getSlideCount()):o.currentSlide-o.getSlideCount(),o.currentDirection=1}"vertical"!=t&&(o.slideHandler(e),o.touchObject={},o.$slider.trigger("swipe",[o,t]))}else o.touchObject.startX!==o.touchObject.curX&&(o.slideHandler(o.currentSlide),o.touchObject={})},e.prototype.swipeHandler=function(i){var e=this;if(!(e.options.swipe===!1||"ontouchend"in document&&e.options.swipe===!1||e.options.draggable===!1&&i.type.indexOf("mouse")!==-1))switch(e.touchObject.fingerCount=i.originalEvent&&void 0!==i.originalEvent.touches?i.originalEvent.touches.length:1,e.touchObject.minSwipe=e.listWidth/e.options.touchThreshold,e.options.verticalSwiping===!0&&(e.touchObject.minSwipe=e.listHeight/e.options.touchThreshold),i.data.action){case"start":e.swipeStart(i);break;case"move":e.swipeMove(i);break;case"end":e.swipeEnd(i)}},e.prototype.swipeMove=function(i){var e,t,o,s,n,r,l=this;return n=void 0!==i.originalEvent?i.originalEvent.touches:null,!(!l.dragging||l.scrolling||n&&1!==n.length)&&(e=l.getLeft(l.currentSlide),l.touchObject.curX=void 0!==n?n[0].pageX:i.clientX,l.touchObject.curY=void 0!==n?n[0].pageY:i.clientY,l.touchObject.swipeLength=Math.round(Math.sqrt(Math.pow(l.touchObject.curX-l.touchObject.startX,2))),r=Math.round(Math.sqrt(Math.pow(l.touchObject.curY-l.touchObject.startY,2))),!l.options.verticalSwiping&&!l.swiping&&r>4?(l.scrolling=!0,!1):(l.options.verticalSwiping===!0&&(l.touchObject.swipeLength=r),t=l.swipeDirection(),void 0!==i.originalEvent&&l.touchObject.swipeLength>4&&(l.swiping=!0,i.preventDefault()),s=(l.options.rtl===!1?1:-1)*(l.touchObject.curX>l.touchObject.startX?1:-1),l.options.verticalSwiping===!0&&(s=l.touchObject.curY>l.touchObject.startY?1:-1),o=l.touchObject.swipeLength,l.touchObject.edgeHit=!1,l.options.infinite===!1&&(0===l.currentSlide&&"right"===t||l.currentSlide>=l.getDotCount()&&"left"===t)&&(o=l.touchObject.swipeLength*l.options.edgeFriction,l.touchObject.edgeHit=!0),l.options.vertical===!1?l.swipeLeft=e+o*s:l.swipeLeft=e+o*(l.$list.height()/l.listWidth)*s,l.options.verticalSwiping===!0&&(l.swipeLeft=e+o*s),l.options.fade!==!0&&l.options.touchMove!==!1&&(l.animating===!0?(l.swipeLeft=null,!1):void l.setCSS(l.swipeLeft))))},e.prototype.swipeStart=function(i){var e,t=this;return t.interrupted=!0,1!==t.touchObject.fingerCount||t.slideCount<=t.options.slidesToShow?(t.touchObject={},!1):(void 0!==i.originalEvent&&void 0!==i.originalEvent.touches&&(e=i.originalEvent.touches[0]),t.touchObject.startX=t.touchObject.curX=void 0!==e?e.pageX:i.clientX,t.touchObject.startY=t.touchObject.curY=void 0!==e?e.pageY:i.clientY,void(t.dragging=!0))},e.prototype.unfilterSlides=e.prototype.slickUnfilter=function(){var i=this;null!==i.$slidesCache&&(i.unload(),i.$slideTrack.children(this.options.slide).detach(),i.$slidesCache.appendTo(i.$slideTrack),i.reinit())},e.prototype.unload=function(){var e=this;i(".slick-cloned",e.$slider).remove(),e.$dots&&e.$dots.remove(),e.$prevArrow&&e.htmlExpr.test(e.options.prevArrow)&&e.$prevArrow.remove(),e.$nextArrow&&e.htmlExpr.test(e.options.nextArrow)&&e.$nextArrow.remove(),e.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden","true").css("width","")},e.prototype.unslick=function(i){var e=this;e.$slider.trigger("unslick",[e,i]),e.destroy()},e.prototype.updateArrows=function(){var i,e=this;i=Math.floor(e.options.slidesToShow/2),e.options.arrows===!0&&e.slideCount>e.options.slidesToShow&&!e.options.infinite&&(e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false"),e.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false"),0===e.currentSlide?(e.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true"),e.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false")):e.currentSlide>=e.slideCount-e.options.slidesToShow&&e.options.centerMode===!1?(e.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")):e.currentSlide>=e.slideCount-1&&e.options.centerMode===!0&&(e.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")))},e.prototype.updateDots=function(){var i=this;null!==i.$dots&&(i.$dots.find("li").removeClass("slick-active").end(),i.$dots.find("li").eq(Math.floor(i.currentSlide/i.options.slidesToScroll)).addClass("slick-active"))},e.prototype.visibility=function(){var i=this;i.options.autoplay&&(document[i.hidden]?i.interrupted=!0:i.interrupted=!1)},i.fn.slick=function(){var i,t,o=this,s=arguments[0],n=Array.prototype.slice.call(arguments,1),r=o.length;for(i=0;i<r;i++)if("object"==typeof s||"undefined"==typeof s?o[i].slick=new e(o[i],s):t=o[i].slick[s].apply(o[i].slick,n),"undefined"!=typeof t)return t;return o}});

/*  slimselect_min  */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.SlimSelect=t():e.SlimSelect=t()}(window,function(){return s={},n.m=i=[function(e,t,i){"use strict";function s(e,t){t=t||{bubbles:!1,cancelable:!1,detail:void 0};var i=document.createEvent("CustomEvent");return i.initCustomEvent(e,t.bubbles,t.cancelable,t.detail),i}var n;t.__esModule=!0,t.hasClassInTree=function(e,t){function s(e,t){return t&&e&&e.classList&&e.classList.contains(t)?e:null}return s(e,t)||function e(t,i){return t&&t!==document?s(t,i)?t:e(t.parentNode,i):null}(e,t)},t.ensureElementInView=function(e,t){var i=e.scrollTop+e.offsetTop,s=i+e.clientHeight,n=t.offsetTop,a=n+t.clientHeight;n<i?e.scrollTop-=i-n:s<a&&(e.scrollTop+=a-s)},t.putContent=function(e,t,i){var s=e.offsetHeight,n=e.getBoundingClientRect(),a=i?n.top:n.top-s,o=i?n.bottom:n.bottom+s;return a<=0?"below":o>=window.innerHeight?"above":i?t:"below"},t.debounce=function(n,a,o){var l;return void 0===a&&(a=100),void 0===o&&(o=!1),function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];var i=self,s=o&&!l;clearTimeout(l),l=setTimeout(function(){l=null,o||n.apply(i,e)},a),s&&n.apply(i,e)}},t.isValueInArrayOfObjects=function(e,t,i){if(!Array.isArray(e))return e[t]===i;for(var s=0,n=e;s<n.length;s++){var a=n[s];if(a&&a[t]&&a[t]===i)return!0}return!1},t.highlight=function(e,t,i){var s=e,n=new RegExp("("+t.trim()+")(?![^<]*>[^<>]*</)","i");if(!e.match(n))return e;var a=e.match(n).index,o=a+e.match(n)[0].toString().length,l=e.substring(a,o);return s=s.replace(n,'<mark class="'+i+'">'+l+"</mark>")},t.kebabCase=function(e){var t=e.replace(/[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g,function(e){return"-"+e.toLowerCase()});return e[0]===e[0].toUpperCase()?t.substring(1):t},"function"!=typeof(n=window).CustomEvent&&(s.prototype=n.Event.prototype,n.CustomEvent=s)},function(e,t,i){"use strict";t.__esModule=!0;var s=(n.prototype.newOption=function(e){return{id:e.id?e.id:String(Math.floor(1e8*Math.random())),value:e.value?e.value:"",text:e.text?e.text:"",innerHTML:e.innerHTML?e.innerHTML:"",selected:!!e.selected&&e.selected,display:void 0===e.display||e.display,disabled:!!e.disabled&&e.disabled,placeholder:!!e.placeholder&&e.placeholder,class:e.class?e.class:void 0,data:e.data?e.data:{},mandatory:!!e.mandatory&&e.mandatory}},n.prototype.add=function(e){this.data.push({id:String(Math.floor(1e8*Math.random())),value:e.value,text:e.text,innerHTML:"",selected:!1,display:!0,disabled:!1,placeholder:!1,class:void 0,mandatory:e.mandatory,data:{}})},n.prototype.parseSelectData=function(){this.data=[];for(var e=0,t=this.main.select.element.childNodes;e<t.length;e++){var i=t[e];if("OPTGROUP"===i.nodeName){for(var s={label:i.label,options:[]},n=0,a=i.childNodes;n<a.length;n++){var o=a[n];if("OPTION"===o.nodeName){var l=this.pullOptionData(o);s.options.push(l),l.placeholder&&""!==l.text.trim()&&(this.main.config.placeholderText=l.text)}}this.data.push(s)}else"OPTION"===i.nodeName&&(l=this.pullOptionData(i),this.data.push(l),l.placeholder&&""!==l.text.trim()&&(this.main.config.placeholderText=l.text))}},n.prototype.pullOptionData=function(e){return{id:!!e.dataset&&e.dataset.id||String(Math.floor(1e8*Math.random())),value:e.value,text:e.text,innerHTML:e.innerHTML,selected:e.selected,disabled:e.disabled,placeholder:"true"===e.dataset.placeholder,class:e.className,style:e.style.cssText,data:e.dataset,mandatory:!!e.dataset&&"true"===e.dataset.mandatory}},n.prototype.setSelectedFromSelect=function(){if(this.main.config.isMultiple){for(var e=[],t=0,i=this.main.select.element.options;t<i.length;t++){var s=i[t];if(s.selected){var n=this.getObjectFromData(s.value,"value");n&&n.id&&e.push(n.id)}}this.setSelected(e,"id")}else{var a=this.main.select.element;if(-1!==a.selectedIndex){var o=a.options[a.selectedIndex].value;this.setSelected(o,"value")}}},n.prototype.setSelected=function(e,t){void 0===t&&(t="id");for(var i=0,s=this.data;i<s.length;i++){var n=s[i];if(n.hasOwnProperty("label")){if(n.hasOwnProperty("options")){var a=n.options;if(a)for(var o=0,l=a;o<l.length;o++){var r=l[o];r.placeholder||(r.selected=this.shouldBeSelected(r,e,t))}}}else n.selected=this.shouldBeSelected(n,e,t)}},n.prototype.shouldBeSelected=function(e,t,i){if(void 0===i&&(i="id"),Array.isArray(t))for(var s=0,n=t;s<n.length;s++){var a=n[s];if(i in e&&String(e[i])===String(a))return!0}else if(i in e&&String(e[i])===String(t))return!0;return!1},n.prototype.getSelected=function(){for(var e={text:"",placeholder:this.main.config.placeholderText},t=[],i=0,s=this.data;i<s.length;i++){var n=s[i];if(n.hasOwnProperty("label")){if(n.hasOwnProperty("options")){var a=n.options;if(a)for(var o=0,l=a;o<l.length;o++){var r=l[o];r.selected&&(this.main.config.isMultiple?t.push(r):e=r)}}}else n.selected&&(this.main.config.isMultiple?t.push(n):e=n)}return this.main.config.isMultiple?t:e},n.prototype.addToSelected=function(e,t){if(void 0===t&&(t="id"),this.main.config.isMultiple){var i=[],s=this.getSelected();if(Array.isArray(s))for(var n=0,a=s;n<a.length;n++){var o=a[n];i.push(o[t])}i.push(e),this.setSelected(i,t)}},n.prototype.removeFromSelected=function(e,t){if(void 0===t&&(t="id"),this.main.config.isMultiple){for(var i=[],s=0,n=this.getSelected();s<n.length;s++){var a=n[s];String(a[t])!==String(e)&&i.push(a[t])}this.setSelected(i,t)}},n.prototype.onDataChange=function(){this.main.onChange&&this.isOnChangeEnabled&&this.main.onChange(JSON.parse(JSON.stringify(this.getSelected())))},n.prototype.getObjectFromData=function(e,t){void 0===t&&(t="id");for(var i=0,s=this.data;i<s.length;i++){var n=s[i];if(t in n&&String(n[t])===String(e))return n;if(n.hasOwnProperty("options")&&n.options)for(var a=0,o=n.options;a<o.length;a++){var l=o[a];if(String(l[t])===String(e))return l}}return null},n.prototype.search=function(n){if(""!==(this.searchValue=n).trim()){var a=this.main.config.searchFilter,e=this.data.slice(0);n=n.trim();var t=e.map(function(e){if(e.hasOwnProperty("options")){var t=e,i=[];if(t.options&&(i=t.options.filter(function(e){return a(e,n)})),0!==i.length){var s=Object.assign({},t);return s.options=i,s}}return e.hasOwnProperty("text")&&a(e,n)?e:null});this.filtered=t.filter(function(e){return e})}else this.filtered=null},n);function n(e){this.contentOpen=!1,this.contentPosition="below",this.isOnChangeEnabled=!0,this.main=e.main,this.searchValue="",this.data=[],this.filtered=null,this.parseSelectData(),this.setSelectedFromSelect()}function r(e){return void 0!==e.text||(console.error("Data object option must have at least have a text value. Check object: "+JSON.stringify(e)),!1)}t.Data=s,t.validateData=function(e){if(!e)return console.error("Data must be an array of objects"),!1;for(var t=0,i=0,s=e;i<s.length;i++){var n=s[i];if(n.hasOwnProperty("label")){if(n.hasOwnProperty("options")){var a=n.options;if(a)for(var o=0,l=a;o<l.length;o++){r(l[o])||t++}}}else r(n)||t++}return 0===t},t.validateOption=r},function(e,t,i){"use strict";t.__esModule=!0;var s=i(3),n=i(4),a=i(5),r=i(1),o=i(0),l=(c.prototype.validate=function(e){var t="string"==typeof e.select?document.querySelector(e.select):e.select;if(!t)throw new Error("Could not find select element");if("SELECT"!==t.tagName)throw new Error("Element isnt of type select");return t},c.prototype.selected=function(){if(this.config.isMultiple){for(var e=[],t=0,i=n=this.data.getSelected();t<i.length;t++){var s=i[t];e.push(s.value)}return e}var n;return(n=this.data.getSelected())?n.value:""},c.prototype.set=function(e,t,i,s){void 0===t&&(t="value"),void 0===i&&(i=!0),void 0===s&&(s=!0),this.config.isMultiple&&!Array.isArray(e)?this.data.addToSelected(e,t):this.data.setSelected(e,t),this.select.setValue(),this.data.onDataChange(),this.render(),i&&this.close()},c.prototype.setSelected=function(e,t,i,s){void 0===t&&(t="value"),void 0===i&&(i=!0),void 0===s&&(s=!0),this.set(e,t,i,s)},c.prototype.setData=function(e){if(r.validateData(e)){for(var t=JSON.parse(JSON.stringify(e)),i=this.data.getSelected(),s=0;s<t.length;s++)t[s].value||t[s].placeholder||(t[s].value=t[s].text);if(this.config.isAjax&&i)if(this.config.isMultiple)for(var n=0,a=i.reverse();n<a.length;n++){var o=a[n];t.unshift(o)}else{for(t.unshift(i),s=0;s<t.length;s++)t[s].placeholder||t[s].value!==i.value||t[s].text!==i.text||delete t[s];var l=!1;for(s=0;s<t.length;s++)t[s].placeholder&&(l=!0);l||t.unshift({text:"",placeholder:!0})}this.select.create(t),this.data.parseSelectData(),this.data.setSelectedFromSelect()}else console.error("Validation problem on: #"+this.select.element.id)},c.prototype.addData=function(e){r.validateData([e])?(this.data.add(this.data.newOption(e)),this.select.create(this.data.data),this.data.parseSelectData(),this.data.setSelectedFromSelect(),this.render()):console.error("Validation problem on: #"+this.select.element.id)},c.prototype.open=function(){var e=this;if(this.config.isEnabled&&!this.data.contentOpen){if(this.beforeOpen&&this.beforeOpen(),this.config.isMultiple&&this.slim.multiSelected?this.slim.multiSelected.plus.classList.add("ss-cross"):this.slim.singleSelected&&(this.slim.singleSelected.arrowIcon.arrow.classList.remove("arrow-down"),this.slim.singleSelected.arrowIcon.arrow.classList.add("arrow-up")),this.slim[this.config.isMultiple?"multiSelected":"singleSelected"].container.classList.add("above"===this.data.contentPosition?this.config.openAbove:this.config.openBelow),this.config.addToBody){var t=this.slim.container.getBoundingClientRect();this.slim.content.style.top=t.top+t.height+window.scrollY+"px",this.slim.content.style.left=t.left+window.scrollX+"px",this.slim.content.style.width=t.width+"px"}if(this.slim.content.classList.add(this.config.open),"up"===this.config.showContent.toLowerCase()||"down"!==this.config.showContent.toLowerCase()&&"above"===o.putContent(this.slim.content,this.data.contentPosition,this.data.contentOpen)?this.moveContentAbove():this.moveContentBelow(),!this.config.isMultiple){var i=this.data.getSelected();if(i){var s=i.id,n=this.slim.list.querySelector('[data-id="'+s+'"]');n&&o.ensureElementInView(this.slim.list,n)}}setTimeout(function(){e.data.contentOpen=!0,e.config.searchFocus&&e.slim.search.input.focus(),e.afterOpen&&e.afterOpen()},this.config.timeoutDelay)}},c.prototype.close=function(){var e=this;this.data.contentOpen&&(this.beforeClose&&this.beforeClose(),this.config.isMultiple&&this.slim.multiSelected?(this.slim.multiSelected.container.classList.remove(this.config.openAbove),this.slim.multiSelected.container.classList.remove(this.config.openBelow),this.slim.multiSelected.plus.classList.remove("ss-cross")):this.slim.singleSelected&&(this.slim.singleSelected.container.classList.remove(this.config.openAbove),this.slim.singleSelected.container.classList.remove(this.config.openBelow),this.slim.singleSelected.arrowIcon.arrow.classList.add("arrow-down"),this.slim.singleSelected.arrowIcon.arrow.classList.remove("arrow-up")),this.slim.content.classList.remove(this.config.open),this.data.contentOpen=!1,this.search(""),setTimeout(function(){e.slim.content.removeAttribute("style"),e.data.contentPosition="below",e.config.isMultiple&&e.slim.multiSelected?(e.slim.multiSelected.container.classList.remove(e.config.openAbove),e.slim.multiSelected.container.classList.remove(e.config.openBelow)):e.slim.singleSelected&&(e.slim.singleSelected.container.classList.remove(e.config.openAbove),e.slim.singleSelected.container.classList.remove(e.config.openBelow)),e.slim.search.input.blur(),e.afterClose&&e.afterClose()},this.config.timeoutDelay))},c.prototype.moveContentAbove=function(){var e=0;this.config.isMultiple&&this.slim.multiSelected?e=this.slim.multiSelected.container.offsetHeight:this.slim.singleSelected&&(e=this.slim.singleSelected.container.offsetHeight);var t=e+this.slim.content.offsetHeight-1;this.slim.content.style.margin="-"+t+"px 0 0 0",this.slim.content.style.height=t-e+1+"px",this.slim.content.style.transformOrigin="center bottom",this.data.contentPosition="above",this.config.isMultiple&&this.slim.multiSelected?(this.slim.multiSelected.container.classList.remove(this.config.openBelow),this.slim.multiSelected.container.classList.add(this.config.openAbove)):this.slim.singleSelected&&(this.slim.singleSelected.container.classList.remove(this.config.openBelow),this.slim.singleSelected.container.classList.add(this.config.openAbove))},c.prototype.moveContentBelow=function(){this.data.contentPosition="below",this.config.isMultiple&&this.slim.multiSelected?(this.slim.multiSelected.container.classList.remove(this.config.openAbove),this.slim.multiSelected.container.classList.add(this.config.openBelow)):this.slim.singleSelected&&(this.slim.singleSelected.container.classList.remove(this.config.openAbove),this.slim.singleSelected.container.classList.add(this.config.openBelow))},c.prototype.enable=function(){this.config.isEnabled=!0,this.config.isMultiple&&this.slim.multiSelected?this.slim.multiSelected.container.classList.remove(this.config.disabled):this.slim.singleSelected&&this.slim.singleSelected.container.classList.remove(this.config.disabled),this.select.triggerMutationObserver=!1,this.select.element.disabled=!1,this.slim.search.input.disabled=!1,this.select.triggerMutationObserver=!0},c.prototype.disable=function(){this.config.isEnabled=!1,this.config.isMultiple&&this.slim.multiSelected?this.slim.multiSelected.container.classList.add(this.config.disabled):this.slim.singleSelected&&this.slim.singleSelected.container.classList.add(this.config.disabled),this.select.triggerMutationObserver=!1,this.select.element.disabled=!0,this.slim.search.input.disabled=!0,this.select.triggerMutationObserver=!0},c.prototype.search=function(t){if(this.data.searchValue!==t)if(this.slim.search.input.value=t,this.config.isAjax){var i=this;this.config.isSearching=!0,this.render(),this.ajax&&this.ajax(t,function(e){i.config.isSearching=!1,Array.isArray(e)?(e.unshift({text:"",placeholder:!0}),i.setData(e),i.data.search(t),i.render()):"string"==typeof e?i.slim.options(e):i.render()})}else this.data.search(t),this.render()},c.prototype.setSearchText=function(e){this.config.searchText=e},c.prototype.render=function(){this.config.isMultiple?this.slim.values():(this.slim.placeholder(),this.slim.deselect()),this.slim.options()},c.prototype.destroy=function(e){void 0===e&&(e=null);var t=e?document.querySelector("."+e+".ss-main"):this.slim.container,i=e?document.querySelector("[data-ssid="+e+"]"):this.select.element;if(t&&i&&(document.removeEventListener("click",this.documentClick),"auto"===this.config.showContent&&window.removeEventListener("scroll",this.windowScroll,!1),i.style.display="",delete i.dataset.ssid,i.slim=null,t.parentElement&&t.parentElement.removeChild(t),this.config.addToBody)){var s=e?document.querySelector("."+e+".ss-content"):this.slim.content;if(!s)return;document.body.removeChild(s)}},c);function c(e){var t=this;this.ajax=null,this.addable=null,this.beforeOnChange=null,this.onChange=null,this.beforeOpen=null,this.afterOpen=null,this.beforeClose=null,this.afterClose=null,this.windowScroll=o.debounce(function(e){t.data.contentOpen&&("above"===o.putContent(t.slim.content,t.data.contentPosition,t.data.contentOpen)?t.moveContentAbove():t.moveContentBelow())}),this.documentClick=function(e){e.target&&!o.hasClassInTree(e.target,t.config.id)&&t.close()};var i=this.validate(e);i.dataset.ssid&&this.destroy(i.dataset.ssid),e.ajax&&(this.ajax=e.ajax),e.addable&&(this.addable=e.addable),this.config=new s.Config({select:i,isAjax:!!e.ajax,showSearch:e.showSearch,searchPlaceholder:e.searchPlaceholder,searchText:e.searchText,searchingText:e.searchingText,searchFocus:e.searchFocus,searchHighlight:e.searchHighlight,searchFilter:e.searchFilter,closeOnSelect:e.closeOnSelect,showContent:e.showContent,placeholderText:e.placeholder,allowDeselect:e.allowDeselect,allowDeselectOption:e.allowDeselectOption,hideSelectedOption:e.hideSelectedOption,deselectLabel:e.deselectLabel,isEnabled:e.isEnabled,valuesUseText:e.valuesUseText,showOptionTooltips:e.showOptionTooltips,selectByGroup:e.selectByGroup,limit:e.limit,timeoutDelay:e.timeoutDelay,addToBody:e.addToBody}),this.select=new n.Select({select:i,main:this}),this.data=new r.Data({main:this}),this.slim=new a.Slim({main:this}),this.select.element.parentNode&&this.select.element.parentNode.insertBefore(this.slim.container,this.select.element.nextSibling),e.data?this.setData(e.data):this.render(),document.addEventListener("click",this.documentClick),"auto"===this.config.showContent&&window.addEventListener("scroll",this.windowScroll,!1),e.beforeOnChange&&(this.beforeOnChange=e.beforeOnChange),e.onChange&&(this.onChange=e.onChange),e.beforeOpen&&(this.beforeOpen=e.beforeOpen),e.afterOpen&&(this.afterOpen=e.afterOpen),e.beforeClose&&(this.beforeClose=e.beforeClose),e.afterClose&&(this.afterClose=e.afterClose),this.config.isEnabled||this.disable()}t.default=l},function(e,t,i){"use strict";t.__esModule=!0;var s=(n.prototype.searchFilter=function(e,t){return-1!==e.text.toLowerCase().indexOf(t.toLowerCase())},n);function n(e){this.id="",this.isMultiple=!1,this.isAjax=!1,this.isSearching=!1,this.showSearch=!0,this.searchFocus=!0,this.searchHighlight=!1,this.closeOnSelect=!0,this.showContent="auto",this.searchPlaceholder="Search",this.searchText="No Results",this.searchingText="Searching...",this.placeholderText="Select Value",this.allowDeselect=!1,this.allowDeselectOption=!1,this.hideSelectedOption=!1,this.deselectLabel="x",this.isEnabled=!0,this.valuesUseText=!1,this.showOptionTooltips=!1,this.selectByGroup=!1,this.limit=0,this.timeoutDelay=200,this.addToBody=!1,this.main="ss-main",this.singleSelected="ss-single-selected",this.arrow="ss-arrow",this.multiSelected="ss-multi-selected",this.add="ss-add",this.plus="ss-plus",this.values="ss-values",this.value="ss-value",this.valueText="ss-value-text",this.valueDelete="ss-value-delete",this.content="ss-content",this.open="ss-open",this.openAbove="ss-open-above",this.openBelow="ss-open-below",this.search="ss-search",this.searchHighlighter="ss-search-highlight",this.addable="ss-addable",this.list="ss-list",this.optgroup="ss-optgroup",this.optgroupLabel="ss-optgroup-label",this.optgroupLabelSelectable="ss-optgroup-label-selectable",this.option="ss-option",this.optionSelected="ss-option-selected",this.highlighted="ss-highlighted",this.disabled="ss-disabled",this.hide="ss-hide",this.id="ss-"+Math.floor(1e5*Math.random()),this.style=e.select.style.cssText,this.class=e.select.className.split(" "),this.isMultiple=e.select.multiple,this.isAjax=e.isAjax,this.showSearch=!1!==e.showSearch,this.searchFocus=!1!==e.searchFocus,this.searchHighlight=!0===e.searchHighlight,this.closeOnSelect=!1!==e.closeOnSelect,e.showContent&&(this.showContent=e.showContent),this.isEnabled=!1!==e.isEnabled,e.searchPlaceholder&&(this.searchPlaceholder=e.searchPlaceholder),e.searchText&&(this.searchText=e.searchText),e.searchingText&&(this.searchingText=e.searchingText),e.placeholderText&&(this.placeholderText=e.placeholderText),this.allowDeselect=!0===e.allowDeselect,this.allowDeselectOption=!0===e.allowDeselectOption,this.hideSelectedOption=!0===e.hideSelectedOption,e.deselectLabel&&(this.deselectLabel=e.deselectLabel),e.valuesUseText&&(this.valuesUseText=e.valuesUseText),e.showOptionTooltips&&(this.showOptionTooltips=e.showOptionTooltips),e.selectByGroup&&(this.selectByGroup=e.selectByGroup),e.limit&&(this.limit=e.limit),e.searchFilter&&(this.searchFilter=e.searchFilter),null!=e.timeoutDelay&&(this.timeoutDelay=e.timeoutDelay),this.addToBody=!0===e.addToBody}t.Config=s},function(e,t,i){"use strict";t.__esModule=!0;var s=i(0),n=(a.prototype.setValue=function(){if(this.main.data.getSelected()){if(this.main.config.isMultiple)for(var e=this.main.data.getSelected(),t=0,i=this.element.options;t<i.length;t++){var s=i[t];s.selected=!1;for(var n=0,a=e;n<a.length;n++)a[n].value===s.value&&(s.selected=!0)}else e=this.main.data.getSelected(),this.element.value=e?e.value:"";this.main.data.isOnChangeEnabled=!1,this.element.dispatchEvent(new CustomEvent("change",{bubbles:!0})),this.main.data.isOnChangeEnabled=!0}},a.prototype.addAttributes=function(){this.element.tabIndex=-1,this.element.style.display="none",this.element.dataset.ssid=this.main.config.id},a.prototype.addEventListeners=function(){var t=this;this.element.addEventListener("change",function(e){t.main.data.setSelectedFromSelect(),t.main.render()})},a.prototype.addMutationObserver=function(){var t=this;this.main.config.isAjax||(this.mutationObserver=new MutationObserver(function(e){t.triggerMutationObserver&&(t.main.data.parseSelectData(),t.main.data.setSelectedFromSelect(),t.main.render(),e.forEach(function(e){"class"===e.attributeName&&t.main.slim.updateContainerDivClass(t.main.slim.container)}))}),this.observeMutationObserver())},a.prototype.observeMutationObserver=function(){this.mutationObserver&&this.mutationObserver.observe(this.element,{attributes:!0,childList:!0,characterData:!0})},a.prototype.disconnectMutationObserver=function(){this.mutationObserver&&this.mutationObserver.disconnect()},a.prototype.create=function(e){this.element.innerHTML="";for(var t=0,i=e;t<i.length;t++){var s=i[t];if(s.hasOwnProperty("options")){var n=s,a=document.createElement("optgroup");if(a.label=n.label,n.options)for(var o=0,l=n.options;o<l.length;o++){var r=l[o];a.appendChild(this.createOption(r))}this.element.appendChild(a)}else this.element.appendChild(this.createOption(s))}},a.prototype.createOption=function(t){var i=document.createElement("option");return i.value=""!==t.value?t.value:t.text,i.innerHTML=t.innerHTML||t.text,t.selected&&(i.selected=t.selected),!1===t.display&&(i.style.display="none"),t.disabled&&(i.disabled=!0),t.placeholder&&i.setAttribute("data-placeholder","true"),t.mandatory&&i.setAttribute("data-mandatory","true"),t.class&&t.class.split(" ").forEach(function(e){i.classList.add(e)}),t.data&&"object"==typeof t.data&&Object.keys(t.data).forEach(function(e){i.setAttribute("data-"+s.kebabCase(e),t.data[e])}),i},a);function a(e){this.triggerMutationObserver=!0,this.element=e.select,this.main=e.main,this.element.disabled&&(this.main.config.isEnabled=!1),this.addAttributes(),this.addEventListeners(),this.mutationObserver=null,this.addMutationObserver(),this.element.slim=e.main}t.Select=n},function(e,t,i){"use strict";t.__esModule=!0;var a=i(0),o=i(1),s=(n.prototype.containerDiv=function(){var e=document.createElement("div");return e.style.cssText=this.main.config.style,this.updateContainerDivClass(e),e},n.prototype.updateContainerDivClass=function(e){this.main.config.class=this.main.select.element.className.split(" "),e.className="",e.classList.add(this.main.config.id),e.classList.add(this.main.config.main);for(var t=0,i=this.main.config.class;t<i.length;t++){var s=i[t];""!==s.trim()&&e.classList.add(s)}},n.prototype.singleSelectedDiv=function(){var t=this,e=document.createElement("div");e.classList.add(this.main.config.singleSelected);var i=document.createElement("span");i.classList.add("placeholder"),e.appendChild(i);var s=document.createElement("span");s.innerHTML=this.main.config.deselectLabel,s.classList.add("ss-deselect"),s.onclick=function(e){e.stopPropagation(),t.main.config.isEnabled&&t.main.set("")},e.appendChild(s);var n=document.createElement("span");n.classList.add(this.main.config.arrow);var a=document.createElement("span");return a.classList.add("arrow-down"),n.appendChild(a),e.appendChild(n),e.onclick=function(){t.main.config.isEnabled&&(t.main.data.contentOpen?t.main.close():t.main.open())},{container:e,placeholder:i,deselect:s,arrowIcon:{container:n,arrow:a}}},n.prototype.placeholder=function(){var e=this.main.data.getSelected();if(null===e||e&&e.placeholder){var t=document.createElement("span");t.classList.add(this.main.config.disabled),t.innerHTML=this.main.config.placeholderText,this.singleSelected&&(this.singleSelected.placeholder.innerHTML=t.outerHTML)}else{var i="";e&&(i=e.innerHTML&&!0!==this.main.config.valuesUseText?e.innerHTML:e.text),this.singleSelected&&(this.singleSelected.placeholder.innerHTML=e?i:"")}},n.prototype.deselect=function(){if(this.singleSelected){if(!this.main.config.allowDeselect)return void this.singleSelected.deselect.classList.add("ss-hide");""===this.main.selected()?this.singleSelected.deselect.classList.add("ss-hide"):this.singleSelected.deselect.classList.remove("ss-hide")}},n.prototype.multiSelectedDiv=function(){var t=this,e=document.createElement("div");e.classList.add(this.main.config.multiSelected);var i=document.createElement("div");i.classList.add(this.main.config.values),e.appendChild(i);var s=document.createElement("div");s.classList.add(this.main.config.add);var n=document.createElement("span");return n.classList.add(this.main.config.plus),n.onclick=function(e){t.main.data.contentOpen&&(t.main.close(),e.stopPropagation())},s.appendChild(n),e.appendChild(s),e.onclick=function(e){t.main.config.isEnabled&&(e.target.classList.contains(t.main.config.valueDelete)||(t.main.data.contentOpen?t.main.close():t.main.open()))},{container:e,values:i,add:s,plus:n}},n.prototype.values=function(){if(this.multiSelected){for(var e,t=this.multiSelected.values.childNodes,i=this.main.data.getSelected(),s=[],n=0,a=t;n<a.length;n++){var o=a[n];e=!0;for(var l=0,r=i;l<r.length;l++){var c=r[l];String(c.id)===String(o.dataset.id)&&(e=!1)}e&&s.push(o)}for(var d=0,h=s;d<h.length;d++){var u=h[d];u.classList.add("ss-out"),this.multiSelected.values.removeChild(u)}for(t=this.multiSelected.values.childNodes,c=0;c<i.length;c++){e=!1;for(var p=0,m=t;p<m.length;p++)o=m[p],String(i[c].id)===String(o.dataset.id)&&(e=!0);e||(0!==t.length&&HTMLElement.prototype.insertAdjacentElement?0===c?this.multiSelected.values.insertBefore(this.valueDiv(i[c]),t[c]):t[c-1].insertAdjacentElement("afterend",this.valueDiv(i[c])):this.multiSelected.values.appendChild(this.valueDiv(i[c])))}if(0===i.length){var f=document.createElement("span");f.classList.add(this.main.config.disabled),f.innerHTML=this.main.config.placeholderText,this.multiSelected.values.innerHTML=f.outerHTML}}},n.prototype.valueDiv=function(a){var o=this,e=document.createElement("div");e.classList.add(this.main.config.value),e.dataset.id=a.id;var t=document.createElement("span");if(t.classList.add(this.main.config.valueText),t.innerHTML=a.innerHTML&&!0!==this.main.config.valuesUseText?a.innerHTML:a.text,e.appendChild(t),!a.mandatory){var i=document.createElement("span");i.classList.add(this.main.config.valueDelete),i.innerHTML=this.main.config.deselectLabel,i.onclick=function(e){e.preventDefault(),e.stopPropagation();var t=!1;if(o.main.beforeOnChange||(t=!0),o.main.beforeOnChange){for(var i=o.main.data.getSelected(),s=JSON.parse(JSON.stringify(i)),n=0;n<s.length;n++)s[n].id===a.id&&s.splice(n,1);!1!==o.main.beforeOnChange(s)&&(t=!0)}t&&(o.main.data.removeFromSelected(a.id,"id"),o.main.render(),o.main.select.setValue(),o.main.data.onDataChange())},e.appendChild(i)}return e},n.prototype.contentDiv=function(){var e=document.createElement("div");return e.classList.add(this.main.config.content),e},n.prototype.searchDiv=function(){var n=this,e=document.createElement("div"),s=document.createElement("input"),a=document.createElement("div");e.classList.add(this.main.config.search);var t={container:e,input:s};return this.main.config.showSearch||(e.classList.add(this.main.config.hide),s.readOnly=!0),s.type="search",s.placeholder=this.main.config.searchPlaceholder,s.tabIndex=0,s.setAttribute("aria-label",this.main.config.searchPlaceholder),s.setAttribute("autocapitalize","off"),s.setAttribute("autocomplete","off"),s.setAttribute("autocorrect","off"),s.onclick=function(e){setTimeout(function(){""===e.target.value&&n.main.search("")},10)},s.onkeydown=function(e){"ArrowUp"===e.key?(n.main.open(),n.highlightUp(),e.preventDefault()):"ArrowDown"===e.key?(n.main.open(),n.highlightDown(),e.preventDefault()):"Tab"===e.key?n.main.data.contentOpen?n.main.close():setTimeout(function(){n.main.close()},n.main.config.timeoutDelay):"Enter"===e.key&&e.preventDefault()},s.onkeyup=function(e){var t=e.target;if("Enter"===e.key){if(n.main.addable&&e.ctrlKey)return a.click(),e.preventDefault(),void e.stopPropagation();var i=n.list.querySelector("."+n.main.config.highlighted);i&&i.click()}else"ArrowUp"===e.key||"ArrowDown"===e.key||("Escape"===e.key?n.main.close():n.main.config.showSearch&&n.main.data.contentOpen?n.main.search(t.value):s.value="");e.preventDefault(),e.stopPropagation()},s.onfocus=function(){n.main.open()},e.appendChild(s),this.main.addable&&(a.classList.add(this.main.config.addable),a.innerHTML="+",a.onclick=function(e){if(n.main.addable){e.preventDefault(),e.stopPropagation();var t=n.search.input.value;if(""===t.trim())return void n.search.input.focus();var i=n.main.addable(t),s="";if(!i)return;"object"==typeof i?o.validateOption(i)&&(n.main.addData(i),s=i.value?i.value:i.text):(n.main.addData(n.main.data.newOption({text:i,value:i})),s=i),n.main.search(""),setTimeout(function(){n.main.set(s,"value",!1,!1)},100),n.main.config.closeOnSelect&&setTimeout(function(){n.main.close()},100)}},e.appendChild(a),t.addable=a),t},n.prototype.highlightUp=function(){var e=this.list.querySelector("."+this.main.config.highlighted),t=null;if(e)for(t=e.previousSibling;null!==t&&t.classList.contains(this.main.config.disabled);)t=t.previousSibling;else{var i=this.list.querySelectorAll("."+this.main.config.option+":not(."+this.main.config.disabled+")");t=i[i.length-1]}if(t&&t.classList.contains(this.main.config.optgroupLabel)&&(t=null),null===t){var s=e.parentNode;if(s.classList.contains(this.main.config.optgroup)&&s.previousSibling){var n=s.previousSibling.querySelectorAll("."+this.main.config.option+":not(."+this.main.config.disabled+")");n.length&&(t=n[n.length-1])}}t&&(e&&e.classList.remove(this.main.config.highlighted),t.classList.add(this.main.config.highlighted),a.ensureElementInView(this.list,t))},n.prototype.highlightDown=function(){var e=this.list.querySelector("."+this.main.config.highlighted),t=null;if(e)for(t=e.nextSibling;null!==t&&t.classList.contains(this.main.config.disabled);)t=t.nextSibling;else t=this.list.querySelector("."+this.main.config.option+":not(."+this.main.config.disabled+")");if(null===t&&null!==e){var i=e.parentNode;i.classList.contains(this.main.config.optgroup)&&i.nextSibling&&(t=i.nextSibling.querySelector("."+this.main.config.option+":not(."+this.main.config.disabled+")"))}t&&(e&&e.classList.remove(this.main.config.highlighted),t.classList.add(this.main.config.highlighted),a.ensureElementInView(this.list,t))},n.prototype.listDiv=function(){var e=document.createElement("div");return e.classList.add(this.main.config.list),e},n.prototype.options=function(e){void 0===e&&(e="");var t,i=this.main.data.filtered||this.main.data.data;if((this.list.innerHTML="")!==e)return(t=document.createElement("div")).classList.add(this.main.config.option),t.classList.add(this.main.config.disabled),t.innerHTML=e,void this.list.appendChild(t);if(this.main.config.isAjax&&this.main.config.isSearching)return(t=document.createElement("div")).classList.add(this.main.config.option),t.classList.add(this.main.config.disabled),t.innerHTML=this.main.config.searchingText,void this.list.appendChild(t);if(0===i.length){var s=document.createElement("div");return s.classList.add(this.main.config.option),s.classList.add(this.main.config.disabled),s.innerHTML=this.main.config.searchText,void this.list.appendChild(s)}for(var n=function(e){if(e.hasOwnProperty("label")){var t=e,n=document.createElement("div");n.classList.add(c.main.config.optgroup);var i=document.createElement("div");i.classList.add(c.main.config.optgroupLabel),c.main.config.selectByGroup&&c.main.config.isMultiple&&i.classList.add(c.main.config.optgroupLabelSelectable),i.innerHTML=t.label,n.appendChild(i);var s=t.options;if(s){for(var a=0,o=s;a<o.length;a++){var l=o[a];n.appendChild(c.option(l))}if(c.main.config.selectByGroup&&c.main.config.isMultiple){var r=c;i.addEventListener("click",function(e){e.preventDefault(),e.stopPropagation();for(var t=0,i=n.children;t<i.length;t++){var s=i[t];-1!==s.className.indexOf(r.main.config.option)&&s.click()}})}}c.list.appendChild(n)}else c.list.appendChild(c.option(e))},c=this,a=0,o=i;a<o.length;a++)n(o[a])},n.prototype.option=function(r){if(r.placeholder){var e=document.createElement("div");return e.classList.add(this.main.config.option),e.classList.add(this.main.config.hide),e}var t=document.createElement("div");t.classList.add(this.main.config.option),r.class&&r.class.split(" ").forEach(function(e){t.classList.add(e)}),r.style&&(t.style.cssText=r.style);var c=this.main.data.getSelected();t.dataset.id=r.id,this.main.config.searchHighlight&&this.main.slim&&r.innerHTML&&""!==this.main.slim.search.input.value.trim()?t.innerHTML=a.highlight(r.innerHTML,this.main.slim.search.input.value,this.main.config.searchHighlighter):r.innerHTML&&(t.innerHTML=r.innerHTML),this.main.config.showOptionTooltips&&t.textContent&&t.setAttribute("title",t.textContent);var d=this;t.addEventListener("click",function(e){e.preventDefault(),e.stopPropagation();var t=this.dataset.id;if(!0===r.selected&&d.main.config.allowDeselectOption){var i=!1;if(d.main.beforeOnChange&&d.main.config.isMultiple||(i=!0),d.main.beforeOnChange&&d.main.config.isMultiple){for(var s=d.main.data.getSelected(),n=JSON.parse(JSON.stringify(s)),a=0;a<n.length;a++)n[a].id===t&&n.splice(a,1);!1!==d.main.beforeOnChange(n)&&(i=!0)}i&&(d.main.config.isMultiple?(d.main.data.removeFromSelected(t,"id"),d.main.render(),d.main.select.setValue(),d.main.data.onDataChange()):d.main.set(""))}else{if(r.disabled||r.selected)return;if(d.main.config.limit&&Array.isArray(c)&&d.main.config.limit<=c.length)return;if(d.main.beforeOnChange){var o=void 0,l=JSON.parse(JSON.stringify(d.main.data.getObjectFromData(t)));l.selected=!0,d.main.config.isMultiple?(o=JSON.parse(JSON.stringify(c))).push(l):o=JSON.parse(JSON.stringify(l)),!1!==d.main.beforeOnChange(o)&&d.main.set(t,"id",d.main.config.closeOnSelect)}else d.main.set(t,"id",d.main.config.closeOnSelect)}});var i=c&&a.isValueInArrayOfObjects(c,"id",r.id);return(r.disabled||i)&&(t.onclick=null,d.main.config.allowDeselectOption||t.classList.add(this.main.config.disabled),d.main.config.hideSelectedOption&&t.classList.add(this.main.config.hide)),i?t.classList.add(this.main.config.optionSelected):t.classList.remove(this.main.config.optionSelected),t},n);function n(e){this.main=e.main,this.container=this.containerDiv(),this.content=this.contentDiv(),this.search=this.searchDiv(),this.list=this.listDiv(),this.options(),this.singleSelected=null,this.multiSelected=null,this.main.config.isMultiple?(this.multiSelected=this.multiSelectedDiv(),this.multiSelected&&this.container.appendChild(this.multiSelected.container)):(this.singleSelected=this.singleSelectedDiv(),this.container.appendChild(this.singleSelected.container)),this.main.config.addToBody?(this.content.classList.add(this.main.config.id),document.body.appendChild(this.content)):this.container.appendChild(this.content),this.content.appendChild(this.search.container),this.content.appendChild(this.list)}t.Slim=s}],n.c=s,n.d=function(e,t,i){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var s in t)n.d(i,s,function(e){return t[e]}.bind(null,s));return i},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=2).default;function n(e){if(s[e])return s[e].exports;var t=s[e]={i:e,l:!1,exports:{}};return i[e].call(t.exports,t,t.exports,n),t.l=!0,t.exports}var i,s});

/*  startup  */
/* global XA, Breakpoints, $ */
// TODO:
// Use breakpoints.min.js - https://github.com/thecreation/breakpoints-js
// TODO: any chance to use ES2015???

var zwp9 = (function($, Breakpoints) {
  var api = {};

  // TODO: Check https://github.com/thecreation/breakpoints-js breakpoint defaults and verify that they match Zurich SDK
  var onBreakPointChange = function() {
    // console.log('breakpoint change!');
    // $(document).trigger('breakpointChange', [{ size: size }]);
  };

  api.init = function() {
    Breakpoints();
    Breakpoints.on('change', onBreakPointChange);
  };

  return api;
})($, Breakpoints);

XA.ready(zwp9.init);


/*  tabs  */
XA.component.zwpTabs = (function($) {
  var CLASS_IS_SCROLLABLE_LEFT = 'is-ht-left';
  var CLASS_IS_SCROLLABLE_RIGHT = 'is-ht-right';

  var api = {
    /**
     * Adds scroll wrapper and buttons to tabs on page load
     */
    initTabScroll: function initTabScroll() {
      var self = this;
      $('.tabs:not(.sticky-tabs) .tabs-inner').each(function() {
        var $tabsHeading = $('> .tabs-heading', this);

        $(this).prepend(
          $('<div></div>').addClass('js-ht-scroller').prepend(
            $('<button></button>')
              .addClass('js-ht-scroller__btn js-ht-scroller__btn-left')
              .attr('aria-label', 'scroll left')
              .click(self.onTabScrollClick),
            $('<div></div>')
              .addClass('js-ht-scroller__inlay')
              .scroll(function(e) {
                var $navGroup = $(e.target);
                self.onTabScroll($navGroup);
              })
              .prepend($tabsHeading),
            $('<button></button>')
              .addClass('js-ht-scroller__btn js-ht-scroller__btn-right')
              .attr('aria-label', 'scroll right')
              .click(self.onTabScrollClick)
          )
        )       

        var nestedTabs = $('.tabs').find('.tabs-container .tab').find('.tabs').addClass('nestedTabs');
        $(nestedTabs).parentsUntil($('component' ), '.tabs' ).addClass('hasNestedTabs');

        $('.hasNestedTabs').find('.tabs-container > .tab').addClass('level1Tabs');
        $('.level1Tabs').find('.tabs-container > .tab').removeClass('level1Tabs').addClass('level2Tabs');

        var $level1Tabs = $(this).closest('.tabs').find('.level1Tabs');   

        $(' > li', $tabsHeading).click(function() { 
          var idx = $(this).index(); 

          if($level1Tabs.length == 0) {
            var $tabs = $(this).closest('.tabs').find('.tabs-container .tab');
          } else {
            var $tabs = $(this).closest('.tabs').find('.level1Tabs');
          } 

          $tabsHeading.removeClass('active');
          $tabsHeading.eq(idx).addClass('active');

          $tabs.removeClass('active'); 
          $tabs.eq(idx).addClass('active');

        }); 
      });
    }, 

    /**
     * Handles scroll event on tab header (hides/shows arrows)
     * @param {} $headingInlay $('js-ht-scroller__inlay')
     */
    onTabScroll: function($headingInlay) {
      var headingInlayScrollLeft = $headingInlay.scrollLeft();
      var headingInlayScrollWidth = $headingInlay[0].scrollWidth;
      var headingInlayInnerWidth = $headingInlay.innerWidth();
      var $htScroller = $headingInlay.parents('.js-ht-scroller');

      if (headingInlayScrollWidth > headingInlayInnerWidth) {
        $htScroller.addClass('has-scroller');
      } else {
        $htScroller.removeClass('has-scroller');
      }

      if (headingInlayScrollLeft > 10) {
        $htScroller.addClass(CLASS_IS_SCROLLABLE_LEFT);
      } else {
        $htScroller.removeClass(CLASS_IS_SCROLLABLE_LEFT);
      }

      if (headingInlayScrollLeft + (headingInlayInnerWidth + 10) >= headingInlayScrollWidth) {
        $htScroller.removeClass(CLASS_IS_SCROLLABLE_RIGHT);
      } else {
        $htScroller.addClass(CLASS_IS_SCROLLABLE_RIGHT);
      }
    },

    /**
     * Handless tab scroll-button click
     * @param {Event} e 
     */
    onTabScrollClick: function(e) {
      var $btnScroller = $(e.target);
      var $htScroller = $btnScroller.siblings('.js-ht-scroller__inlay');

      if ($btnScroller.hasClass('js-ht-scroller__btn-right')) {
        $htScroller.animate({ scrollLeft: '+=250px' }, 300);
      } else {
        $htScroller.animate({ scrollLeft: '-=250px' }, 300);
      }
    }, 

    /**
     * Check and reset scroll arrows
     */
    checkTabScrollOnLoad: function() {
      var self = this;

      $('.tabs:not(.sticky-tabs) .tabs-inner .js-ht-scroller__inlay').each(function() {

        var $tabComponent = $(this);

        self.onTabScroll($tabComponent);
        self.handleAccordionOpen($tabComponent);
      });
    },

    /**
     * If Tab inside Accordion, ensures scroll-arrows are reset when opening accordion item
     * @param {HTMLElement} $tabComponent - .tab
     */
    handleAccordionOpen: function($tabComponent) {
      var self = this;

      $tabComponent.closest('.accordion .item').on('click', function() {
        if ($(this).hasClass('active')) {
          self.onTabScroll($tabComponent);
        }
      });
    },

    setEventHandlers: function() {
      var self = this;

      $(window).on('resize', function() {
        self.checkTabScrollOnLoad();
      });
    },

    init: function init() {
      this.api.initTabScroll();
      this.api.checkTabScrollOnLoad();
      this.api.setEventHandlers(); 
    }
  };

  return api;
})(jQuery, document);

XA.register('zwpTabs', XA.component.zwpTabs);


/*  video-component-brightcove  */
/* global videojs, $ */
/*eslint no-console: ["error", { allow: ["log"] }] */
/*eslint no-unused-vars: 0*/

XA.component.videoComponentBrightcove = (function ($) {
  var api = {
    
  };

  api.init = function () {
    $('video.video-js').each(function() {
      var accountId = $(this).data('account');
      var playerId = $(this).data('player');

      if (playerId != null && playerId != '' && accountId != null && accountId != null) {
        $.ajax({
          url: '//players.brightcove.net/' + accountId + '/' + playerId + '_default/index.min.js',
          dataType: 'script',
          cache: false
        });
      }
    });
  };
  return api;
})(jQuery, document);

XA.register('videoComponentBrightcove', XA.component.videoComponentBrightcove);


/*  zwp-component-breadcrumb  */
/* global XA, $ */
XA.component.breadcrumbwrapper = (function($) {
  var api=api || {};

  api.init = function() {
    
  };
  return api;
  })(jQuery, document);
XA.register('breadcrumbwrapper', XA.component.breadcrumbwrapper);

/*  zwp-component-search-facet-dropdown  */
XA.component.search.facet.dropdown = (function ($, document) {

    "use strict";

    var api = {},
        urlHelperModel,
        queryModel,
        initialized = false,
        $headLineTitle = $('.title--headline-underline').find(".field-title"),
        headLineText = $headLineTitle.text();

    var FacetDropdownModel = XA.component.search.baseModel.extend({
        defaults: {
            template: "<% _.forEach(results, function(result){" +
                "%><option data-facetName='<%= result.Name !== '' ? result.Name : '_empty_' %>' <%= result.Selected !== undefined ? 'selected' : '' %> ><%= result.Name !== '' ? result.Name : emptyText %></option><%" +
                "}); %>",
            dataProperties: {},
            blockNextRequest: false,
            resultData: {},
            optionSelected: false,
            sig: []
        },
        initialize: function () {
            //event to get data at the begining or in case that there are no hash parameters in the url - one request for all controls
            XA.component.search.vent.on("facet-data-loaded", this.processData.bind(this));

            //event to get filtered data
            XA.component.search.vent.on("facet-data-filtered", this.processData.bind(this));

            //if in the url hash we have this control facet name (someone clicked this control) then we have to listen for partial filtering
            XA.component.search.vent.on("facet-data-partial-filtered", this.processData.bind(this));

            //event after change of hash
            XA.component.search.vent.on("hashChanged", this.updateComponent.bind(this));
        },
        toggleBlockRequests: function () {
            var state = this.get("blockNextRequest");
            this.set(this.get("blockNextRequest"), !state);
        },
        processData: function (data) {
            var inst = this,
                hashObj = queryModel.parseHashParameters(window.location.hash),
                sig = inst.get("sig"),
                dataProperties = this.get("dataProperties"),
                searchResultsSignature = dataProperties.searchResultsSignature.split(','),
                sortOrder = dataProperties.sortOrder,
                facet = dataProperties.f,
                facetItem,
                facedData,
                i, j;

            for (j = 0; j < searchResultsSignature.length; j++) {
                if (data.Facets.length > 0 && (data.Signature === searchResultsSignature[j]) || data.Signature === "" || data.Signature === null) {
                    facedData = _.find(data.Facets, function (f) {
                        return f.Key.toLowerCase() === facet.toLowerCase();
                    });

                    if (facedData === undefined) {
                        return;
                    }

                    for (i = 0; i < sig.length; i++) {
                        if (!jQuery.isEmptyObject(_.pick(hashObj, sig[i]))) {
                            if (hashObj[sig[i]] !== "") {
                                facetItem = _.where(facedData.Values, { Name: hashObj[sig[i]] });
                                if (facetItem.length === 0) {
                                    facetItem = _.where(facedData.Values, { Name: "" });
                                }
                                if (facetItem.length > 0) {
                                    facetItem[0].Selected = true;
                                    inst.optionSelected = true;
                                }
                            }
                        }
                    }

                    this.sortFacetArray(sortOrder, facedData.Values);
                    inst.set({ resultData: facedData.Values });
                }
            }
        },
        updateComponent: function (hash) {
            var sig = this.get("sig"), i, facetPart;

            for (i = 0; i < sig.length; i++) {
                facetPart = sig[i].toLowerCase();
                if (hash.hasOwnProperty(facetPart) && hash[facetPart] !== "") {
                    this.set({ optionSelected: true });
                    if (hash[facetPart] !== 'undefined' && typeof hash[facetPart] !== 'undefined') {
                        $headLineTitle.text(hash[facetPart]);
                    }
                    else {
                        $headLineTitle.text(headLineText);
                    }
                } else {
                    this.set({ optionSelected: false });
                    $headLineTitle.text('');
                    $headLineTitle.text(headLineText);
                }
            }
        }
    });

    var FacetDropdownView = XA.component.search.baseView.extend({
        initialize: function () {
            var dataProperties = this.$el.data();
            this.properties = dataProperties.properties;

            if (this.model) {
                this.model.set({ dataProperties: this.properties });
                this.model.set("sig", this.translateSignatures(this.properties.searchResultsSignature, this.properties.f));
            }

            this.model.on("change", this.render, this);
        },
        events: {
            "change .facet-dropdown-select": "updateFacet",
            "click .bottom-remove-filter, .clear-filter": "clearFilter"
        },
        updateFacet: function (param) {
            var $selectedOption = this.$el.find(".facet-dropdown-select").find("option:selected"),
                facetName = $selectedOption.data("facetname"),
                sig = this.model.get("sig");

            if (facetName === "") {
                this.model.set({ optionSelected: false });
            } else {
                this.model.set({ optionSelected: true });
            }
            queryModel.updateHash(this.updateSignaturesHash(sig, facetName, {}));
        },
        render: function () {
            var inst = this,
                resultData = inst.model.get("resultData"),
                dropdown = this.$el.find(".facet-dropdown-select"),
                emptyValueText = inst.model.get('dataProperties').emptyValueText,
                facetClose = this.$el.find(".facet-heading > span"),
                notSelectedOption = dropdown.find("option:first"),
                notSelectedOptionEntry = $("<option />"),
                template = _.template(inst.model.get("template")),
                templateResult = template({ results: resultData, emptyText: emptyValueText });


            notSelectedOptionEntry.text(notSelectedOption.text());
            notSelectedOptionEntry.data("facetname", "");

            if (this.model.get("optionSelected")) {
                facetClose.addClass("has-active-facet");
            } else if (notSelectedOption.data("facetname") === "") {
                facetClose.removeClass("has-active-facet");
            }

            dropdown.empty().append(notSelectedOptionEntry).append(templateResult);
        },
        clearFilter: function () {
            var dropdown = this.$el.find(".facet-dropdown-select"),
                facetClose = this.$el.find(".facet-heading > span"),
                sig = this.model.get("sig");

            queryModel.updateHash(this.updateSignaturesHash(sig, "", {}));
            this.model.set({ optionSelected: false });
            facetClose.removeClass("has-active-facet");
            dropdown.val(dropdown.find("option:first").val());
        }
    });


    api.init = function () {
        if ($("body").hasClass("on-page-editor") || initialized) {
            return;
        }
        queryModel = XA.component.search.query;
        urlHelperModel = XA.component.search.url;

        var facetDropdownList = $(".facet-dropdown");
        _.each(facetDropdownList, function (elem) {
            var view = new FacetDropdownView({ el: $(elem), model: new FacetDropdownModel() });
        });

        initialized = true;
    };

    api.getFacetDataRequestInfo = function () {
        var facetDropdownList = $(".facet-dropdown"),
            result = [];

        _.each(facetDropdownList, function (elem) {
            var properties = $(elem).data().properties,
                signatures = properties.searchResultsSignature.split(','),
                i;

            for (i = 0; i < signatures.length; i++) {
                result.push({
                    signature: signatures[i] === null ? "" : signatures[i],
                    facetName: properties.f,
                    endpoint: properties.endpoint,
                    filterWithoutMe: true
                });
            }
        });

        return result;
    };

    return api;

}(jQuery, document));

XA.register("facetDropdown", XA.component.search.facet.dropdown);

/*  zwp-component-teaser  */
 XA.component.zwpComponentTeaser = (function ($) {
     var api=api || {};
  
     api.init = function() {
        if($('.component.teaser .teaser--wrapper > a').attr('href') === undefined) {
            $('.component.teaser .teaser--wrapper > a').css("cursor","initial");
        }

        // image ratio adjustments
        $('.component.teaser.flexembed.flexembed--16by9').each(function(){
            $('.field-promoicon img', this).innerHeight( $('.field-promoicon img', this).innerWidth() * 9 / 16 )
        });
        
        $('.component.teaser.flexembed.flexembed--1by1').each(function(){
            $('.field-promoicon img', this).innerHeight( $('.field-promoicon img', this).innerWidth() * 1 / 1 )
        });
        
        $('.component.teaser.flexembed.flexembed--2by1').each(function(){
            $('.field-promoicon img', this).innerHeight( $('.field-promoicon img', this).innerWidth() * 1 / 2 )
        });
        
        $('.component.teaser.flexembed.flexembed--3by1').each(function(){
            $('.field-promoicon img', this).innerHeight( $('.field-promoicon img', this).innerWidth() * 1 / 3 )
        });
        
        $('.component.teaser.flexembed.flexembed--4by3').each(function(){
            $('.field-promoicon img', this).innerHeight( $('.field-promoicon img', this).innerWidth() * 3 / 4 )
        });

        $('.teaser--tile .teaser__content .teaser__title').each(function(){
            $(this).wrapInner('<span></span>'); 
        }); 

        $('.teaser--text').each(function() { 
            $(this).find('h6:only-child').addClass('heading-only');
        });

        $(window).on('scroll', function() {
            $('.teaser--tile, .teaser-related').each(function() {
              if ($(window).width() < 769) { 
                if (isScrolledIntoView($(this))) { 
                    $(this).addClass('sm-visible');  
                } else { 
                    $(this).removeClass('sm-visible');
                }
             } else { 
                $(this).removeClass('sm-visible');
             }
            });
          });
          
        function isScrolledIntoView(elem) {
            var docViewTop = $(window).scrollTop();
            var docViewBottom = docViewTop + $(window).height();
            
            var elemTop = $(elem).offset().top;
            var elemBottom = elemTop + $(elem).height();
            
            return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
        }
        
        if ($(document).find('.teaser--hover')) {
            if ($('body').hasClass('on-page-editor') || $(document).width() < 1200) {
                $('.teaser--hover .teaser__content .field-promotext').css('display', 'block');
                $('.default-device .teaser--hover .teaser__content').css('transform', 'scale(1)');
                $('.default-device .teaser--hover .teaser__content').css('position', 'relative');
                $('.default-device .teaser--hover .teaser__content').css('top', '0px');
                $('.on-page-editor .show--slider .teaser--hover').parent().css('height','100%');
                var teaserHovers = $('.teaser--hover');
                $(teaserHovers).parent().addClass('d-lg-flex d-md-flex d-flex');
                $(teaserHovers).parent().css('flex-direction', 'column');
                $.each($(teaserHovers), function () {
                    if (!$(this).parents().hasClass('show--slider')) {
                        var teaserContet = $(this).find('.teaser__content');
                        var teaserHeight = $(this).parent().height();
                        if ($(teaserContet).height() < teaserHeight) {
                            $(teaserContet).css('height', (teaserHeight - 165));
                        }
                    }
                });
            }
        }       
     };

     function equalTeaserHeight(teasersWithBG) {
        $.each(teasersWithBG, function () {
            if ($(this).hasClass('bg-height')) {
                        $(this).css({'height':'calc(100% - 10px)','margin-bottom':'40px','padding':'15px !important'});
                        $(this).parent().css('flex-direction','column');
                        $(this).parent().addClass('d-flex d-md-flex d-lg-flex');
            }
        });
    }
    var teasersWithBG = $(".column-splitter:not(.show--slider)").find('.teaser.bg-height');
    $.each(teasersWithBG, function () {
        equalTeaserHeight(teasersWithBG);
    });
     return api;
   })(jQuery, document);
  
XA.register('zwpComponentTeaser', XA.component.zwpComponentTeaser);

/*  zwp-event-list  */
XA.component.zwpEventList = (function ($) {
    var api = {
        initEventListEvents: function () {
            var $openEvent = $('.eventdataresult');
            var $closeEvent = $('.c-results__close');

            $('.c_results__copy-hidden').hide();

            $openEvent.before().click(function (e) {
                e.preventDefault();
                var expandElement = $(this).parent().siblings(".c_results__copy-hidden");               
                expandElement.toggle();
            });

            $closeEvent.before().click(function (e) {
                e.preventDefault();
                var collapseElement = $(this).parents(".c_results__copy-hidden");
                collapseElement.toggle();
            });
        },
    };

    api.init = function () {
        this.api.initEventListEvents();
    };

    return api;
})(jQuery, document);

XA.register('zwpEventList', XA.component.zwpEventList);


/*  zwp-teaser-slider  */
XA.component.zwpTeaserSlider = (function ($) {
  var CLASS_IS_SCROLLABLE_LEFT = 'is-ht-left';
  var CLASS_IS_SCROLLABLE_RIGHT = 'is-ht-right';

  var api = {
    /**
     * Adds scroll wrapper and buttons to teasers on page load
     */
    initTeaserSrolls: function initTeaserSrolls() {
      var self = this;
      $('.show--slider > .component-content > ul').each(function () {
        var count = $(this).children('li');
        switch (true) {
          case count.length == 1:
            $(this).parent().parent().addClass('single');
          case count.length == 2:
            $(this).parent().parent().addClass('two');
          default:
            $(this).parent().parent().addClass('multiple');
        }
      });

      /* getting width of teasers */
      if ($(window).width() > '767') {
        var $flexValues = $('.show--slider ul li >div');
        $.each($flexValues, function () {
          $(this).parent().css('flex-basis', $(this).css('flex-basis'));
          $(this)
            .parent()
            .css({ 'flex-grow': '0', 'flex-shrink': '0', display: 'block' });
        });
      }

      $('.show--slider.multiple > .component-content').each(function () {
        var $ul = $('> ul', this);
        var $downloads = $('<div></div>')
          .addClass('teaser-scroll__inlay')
          .scroll(function (e) {
            var $navGroup = $(e.target);
            self.onTeaserScroll($navGroup);
          })
          .prepend($ul);
        $(this).append(
          $('<div></div>')
            .addClass('teaser-scroll')
            .prepend(
              $('<button></button>')
                .addClass('teaser-scroll__btn teaser-scroll__btn-left')
                .click(self.onTeaserScrollClick),
              $downloads,
              $('<button></button>')
                .addClass('teaser-scroll__btn teaser-scroll__btn-right')
                .click(self.onTeaserScrollClick)
            )
        );
      });
    },

    /**
     * Handles scroll event on Teasers (hides/shows arrows)
     * @param {} $headingInlay $('.teaser-scroll__inlay')
     */

    onTeaserScroll: function ($headingInlay) {
      var headingInlayScrollLeft = $headingInlay.scrollLeft();
      var headingInlayScrollWidth = $headingInlay[0].scrollWidth;
      var headingInlayInnerWidth = $headingInlay.innerWidth();
      var $htScroller = $headingInlay.parents('.teaser-scroll');

      if (headingInlayScrollWidth > headingInlayInnerWidth) {
        $htScroller.addClass('has-scroller');
      } else {
        $htScroller.removeClass('has-scroller');
      }

      if (headingInlayScrollLeft > 10) {
        $htScroller.addClass(CLASS_IS_SCROLLABLE_LEFT);
      } else {
        $htScroller.removeClass(CLASS_IS_SCROLLABLE_LEFT);
      }

      if (
        headingInlayScrollLeft + (headingInlayInnerWidth + 10) >=
        headingInlayScrollWidth
      ) {
        $htScroller.removeClass(CLASS_IS_SCROLLABLE_RIGHT);
      } else {
        $htScroller.addClass(CLASS_IS_SCROLLABLE_RIGHT);
      }
    },

    /**
     * Handles horizontal Teasers scrolling on arrow click
     * @param {Event} e
     */

    onTeaserScrollClick: function (e) {
      var $btnScroller = $(e.target);
      var $htScroller = $btnScroller.siblings('.teaser-scroll__inlay');

      if ($btnScroller.hasClass('teaser-scroll__btn-right')) {
        $htScroller.animate({ scrollLeft: '+=400px' }, 300);
      } else {
        $htScroller.animate({ scrollLeft: '-=400px' }, 300);
      }
    },

    /**
     * Check and reset scroll arrows
     */

    checkTeaserScrollOnLoad: function () {
      var self = this;
      $('.teaser-scroll__inlay').each(function () {
        self.onTeaserScroll($(this));
      });
    },

    /**
     * Init pageload events
     */

    setEventHandlers: function () {
      var self = this;

      $(window).on('resize', function () {
        self.checkTeaserScrollOnLoad();
      });
    },

    SetTeaserSliderHeight: function () {
      function equalTeaserSliderHeight(teaserSliderBG) {
        $.each(teaserSliderBG, function () {
          var teaserBg = $(this).find('.bg-height');
          if (teaserBg.length == 0) {
            return;
          }

          $(teaserBg).css('padding', '0px');
          $(this).css({
            'background-color': teaserBg.css('background-color'),
            'padding-top': '15px',
          });
        });
      }
      var teaserSliderBG = $('.column-splitter.show--slider').find('li');
      equalTeaserSliderHeight(teaserSliderBG);
      var teaserText = $('.column-splitter.show--slider').find('.teaser--text');
      $.each(teaserText, function () {
        $(this).parent().css({ height: 'calc(100% )', 'flex-grow': '1' });
        $(this)
          .closest('li')
          .css({ margin: '0px', 'background-color': '#fff' });
        $(this).css({ height: 'calc(100% - 20px)', padding: '15px' });
        if ($(this).hasClass('bg-height') && $(window).width() < '767') {
          $(this).css({ height: '100%', padding: '15px' });
        }
      });
    },
    setTeaserHoverHeightInMobile: function () {
      if ($(window).width() < '1200') {
        $('.show--slider .teaser--hover').parent().css('height', '100%');
      }
    },
  };
  api.init = function () {
    this.api.initTeaserSrolls();
    this.api.checkTeaserScrollOnLoad();
    this.api.setEventHandlers();
    this.api.SetTeaserSliderHeight();
    this.api.setTeaserHoverHeightInMobile();
  };
  return api;
})(jQuery, document);

XA.register('zwpTeaserSlider', XA.component.zwpTeaserSlider);


/*  bootstrap-select_min  */
/*!
 * Bootstrap-select v1.7.0 (http://silviomoreto.github.io/bootstrap-select)
 *
 * Copyright 2013-2015 bootstrap-select
 * Licensed under MIT (https://github.com/silviomoreto/bootstrap-select/blob/master/LICENSE)
 */
(function ($) {
  'use strict';

  //<editor-fold desc="Shims">
  if (!String.prototype.includes) {
    (function () {
      'use strict'; // needed to support `apply`/`call` with `undefined`/`null`
      var toString = {}.toString;
      var defineProperty = (function () {
        // IE 8 only supports `Object.defineProperty` on DOM elements
        try {
          var object = {};
          var $defineProperty = Object.defineProperty;
          var result = $defineProperty(object, object, object) && $defineProperty;
        } catch (error) {
        }
        return result;
      }());
      var indexOf = ''.indexOf;
      var includes = function (search) {
        if (this == null) {
          throw TypeError();
        }
        var string = String(this);
        if (search && toString.call(search) == '[object RegExp]') {
          throw TypeError();
        }
        var stringLength = string.length;
        var searchString = String(search);
        var searchLength = searchString.length;
        var position = arguments.length > 1 ? arguments[1] : undefined;
        // `ToInteger`
        var pos = position ? Number(position) : 0;
        if (pos != pos) { // better `isNaN`
          pos = 0;
        }
        var start = Math.min(Math.max(pos, 0), stringLength);
        // Avoid the `indexOf` call if no match is possible
        if (searchLength + start > stringLength) {
          return false;
        }
        return indexOf.call(string, searchString, pos) != -1;
      };
      if (defineProperty) {
        defineProperty(String.prototype, 'includes', {
          'value': includes,
          'configurable': true,
          'writable': true
        });
      } else {
        String.prototype.includes = includes;
      }
    }());
  }

  if (!String.prototype.startsWith) {
    (function () {
      'use strict'; // needed to support `apply`/`call` with `undefined`/`null`
      var defineProperty = (function () {
        // IE 8 only supports `Object.defineProperty` on DOM elements
        try {
          var object = {};
          var $defineProperty = Object.defineProperty;
          var result = $defineProperty(object, object, object) && $defineProperty;
        } catch (error) {
        }
        return result;
      }());
      var toString = {}.toString;
      var startsWith = function (search) {
        if (this == null) {
          throw TypeError();
        }
        var string = String(this);
        if (search && toString.call(search) == '[object RegExp]') {
          throw TypeError();
        }
        var stringLength = string.length;
        var searchString = String(search);
        var searchLength = searchString.length;
        var position = arguments.length > 1 ? arguments[1] : undefined;
        // `ToInteger`
        var pos = position ? Number(position) : 0;
        if (pos != pos) { // better `isNaN`
          pos = 0;
        }
        var start = Math.min(Math.max(pos, 0), stringLength);
        // Avoid the `indexOf` call if no match is possible
        if (searchLength + start > stringLength) {
          return false;
        }
        var index = -1;
        while (++index < searchLength) {
          if (string.charCodeAt(start + index) != searchString.charCodeAt(index)) {
            return false;
          }
        }
        return true;
      };
      if (defineProperty) {
        defineProperty(String.prototype, 'startsWith', {
          'value': startsWith,
          'configurable': true,
          'writable': true
        });
      } else {
        String.prototype.startsWith = startsWith;
      }
    }());
  }

  if (!Object.keys) {
    Object.keys = function (
      o, // object
      k, // key
      r  // result array
      ){
      // initialize object and result
      r=[];
      // iterate over object keys
      for (k in o) 
          // fill result array with non-prototypical keys
        r.hasOwnProperty.call(o, k) && r.push(k);
      // return result
      return r
    };
  }
  //</editor-fold>

  // Case insensitive contains search
  $.expr[':'].icontains = function (obj, index, meta) {
    var $obj = $(obj);
    var haystack = ($obj.data('tokens') || $obj.text()).toUpperCase();
    return haystack.includes(meta[3].toUpperCase());
  };

  // Case insensitive begins search
  $.expr[':'].ibegins = function (obj, index, meta) {
    var $obj = $(obj);
    var haystack = ($obj.data('tokens') || $obj.text()).toUpperCase();
    return haystack.startsWith(meta[3].toUpperCase());
  };

  // Case and accent insensitive contains search
  $.expr[':'].aicontains = function (obj, index, meta) {
    var $obj = $(obj);
    var haystack = ($obj.data('tokens') || $obj.data('normalizedText') || $obj.text()).toUpperCase();
    return haystack.includes(meta[3].toUpperCase());
  };

  // Case and accent insensitive begins search
  $.expr[':'].aibegins = function (obj, index, meta) {
    var $obj = $(obj);
    var haystack = ($obj.data('tokens') || $obj.data('normalizedText') || $obj.text()).toUpperCase();
    return haystack.startsWith(meta[3].toUpperCase());
  };

  /**
   * Remove all diatrics from the given text.
   * @access private
   * @param {String} text
   * @returns {String}
   */
  function normalizeToBase(text) {
    var rExps = [
      {re: /[\xC0-\xC6]/g, ch: "A"},
      {re: /[\xE0-\xE6]/g, ch: "a"},
      {re: /[\xC8-\xCB]/g, ch: "E"},
      {re: /[\xE8-\xEB]/g, ch: "e"},
      {re: /[\xCC-\xCF]/g, ch: "I"},
      {re: /[\xEC-\xEF]/g, ch: "i"},
      {re: /[\xD2-\xD6]/g, ch: "O"},
      {re: /[\xF2-\xF6]/g, ch: "o"},
      {re: /[\xD9-\xDC]/g, ch: "U"},
      {re: /[\xF9-\xFC]/g, ch: "u"},
      {re: /[\xC7-\xE7]/g, ch: "c"},
      {re: /[\xD1]/g, ch: "N"},
      {re: /[\xF1]/g, ch: "n"}
    ];
    $.each(rExps, function () {
      text = text.replace(this.re, this.ch);
    });
    return text;
  }


  function htmlEscape(html) {
    var escapeMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '`': '&#x60;'
    };
    var source = '(?:' + Object.keys(escapeMap).join('|') + ')',
        testRegexp = new RegExp(source),
        replaceRegexp = new RegExp(source, 'g'),
        string = html == null ? '' : '' + html;
    return testRegexp.test(string) ? string.replace(replaceRegexp, function (match) {
      return escapeMap[match];
    }) : string;
  }

  var Selectpicker = function (element, options, e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    this.$element = $(element);
    this.$newElement = null;
    this.$button = null;
    this.$menu = null;
    this.$lis = null;
    this.options = options;

    // If we have no title yet, try to pull it from the html title attribute (jQuery doesnt' pick it up as it's not a
    // data-attribute)
    if (this.options.title === null) {
      this.options.title = this.$element.attr('title');
    }

    //Expose public methods
    this.val = Selectpicker.prototype.val;
    this.render = Selectpicker.prototype.render;
    this.refresh = Selectpicker.prototype.refresh;
    this.setStyle = Selectpicker.prototype.setStyle;
    this.selectAll = Selectpicker.prototype.selectAll;
    this.deselectAll = Selectpicker.prototype.deselectAll;
    this.destroy = Selectpicker.prototype.remove;
    this.remove = Selectpicker.prototype.remove;
    this.show = Selectpicker.prototype.show;
    this.hide = Selectpicker.prototype.hide;

    this.init();
  };

  Selectpicker.VERSION = '1.7.0';

  // part of this is duplicated in i18n/defaults-en_US.js. Make sure to update both.
  Selectpicker.DEFAULTS = {
    noneSelectedText: 'Nothing selected',
    noneResultsText: 'No results matched {0}',
    countSelectedText: function (numSelected, numTotal) {
      return (numSelected == 1) ? "{0} item selected" : "{0} items selected";
    },
    maxOptionsText: function (numAll, numGroup) {
      return [
        (numAll == 1) ? 'Limit reached ({n} item max)' : 'Limit reached ({n} items max)',
        (numGroup == 1) ? 'Group limit reached ({n} item max)' : 'Group limit reached ({n} items max)'
      ];
    },
    selectAllText: 'Select All',
    deselectAllText: 'Deselect All',
    doneButton: false,
    doneButtonText: 'Close',
    multipleSeparator: ', ',
    styleBase: 'btn',
    style: 'btn-default',
    size: 'auto',
    title: null,
    selectedTextFormat: 'values',
    width: false,
    container: false,
    hideDisabled: false,
    showSubtext: false,
    showIcon: true,
    showContent: true,
    dropupAuto: true,
    header: false,
    liveSearch: false,
    liveSearchPlaceholder: null,
    liveSearchNormalize: false,
    liveSearchStyle: 'contains',
    actionsBox: false,
    iconBase: 'glyphicon',
    tickIcon: 'glyphicon-ok',
    maxOptions: false,
    mobile: false,
    selectOnTab: false,
    dropdownAlignRight: false
  };

  Selectpicker.prototype = {

    constructor: Selectpicker,

    init: function () {
      var that = this,
          id = this.$element.attr('id');

      this.$element.addClass('bs-select-hidden');
      // store originalIndex (key) and newIndex (value) in this.liObj for fast accessibility
      // allows us to do this.$lis.eq(that.liObj[index]) instead of this.$lis.filter('[data-original-index="' + index + '"]')
      this.liObj = {};
      this.multiple = this.$element.prop('multiple');
      this.autofocus = this.$element.prop('autofocus');
      this.$newElement = this.createView();
      this.$element.after(this.$newElement);
      this.$button = this.$newElement.children('button');
      this.$menu = this.$newElement.children('.dropdown-menu');
      this.$menuInner = this.$menu.children('.inner');
      this.$searchbox = this.$menu.find('input');

      if (this.options.dropdownAlignRight)
        this.$menu.addClass('dropdown-menu-right');

      if (typeof id !== 'undefined') {
        this.$button.attr('data-id', id);
        $('label[for="' + id + '"]').click(function (e) {
          e.preventDefault();
          that.$button.focus();
        });
      }

      this.checkDisabled();
      this.clickListener();
      if (this.options.liveSearch) this.liveSearchListener();
      this.render();
      this.setStyle();
      this.setWidth();
      if (this.options.container) this.selectPosition();
      this.$menu.data('this', this);
      this.$newElement.data('this', this);
      if (this.options.mobile) this.mobile();

      this.$newElement.on('hide.bs.dropdown', function (e) {
        that.$element.trigger('hide.bs.select', e);
      });
      
      this.$newElement.on('hidden.bs.dropdown', function (e) {
        that.$element.trigger('hidden.bs.select', e);
      });
      
      this.$newElement.on('show.bs.dropdown', function (e) {
        that.$element.trigger('show.bs.select', e);
      });
      
      this.$newElement.on('shown.bs.dropdown', function (e) {
        that.$element.trigger('shown.bs.select', e);
      });

      setTimeout(function () {
        that.$element.trigger('loaded.bs.select');
      });
    },

    createDropdown: function () {
      // Options
      // If we are multiple, then add the show-tick class by default
      var multiple = this.multiple ? ' show-tick' : '',
          inputGroup = this.$element.parent().hasClass('input-group') ? ' input-group-btn' : '',
          autofocus = this.autofocus ? ' autofocus' : '';
      // Elements
      var header = this.options.header ? '<div class="popover-title"><button type="button" class="close" aria-hidden="true">&times;</button>' + this.options.header + '</div>' : '';
      var searchbox = this.options.liveSearch ?
      '<div class="bs-searchbox">' +
      '<input type="text" class="form-control" autocomplete="off"' +
      (null === this.options.liveSearchPlaceholder ? '' : ' placeholder="' + htmlEscape(this.options.liveSearchPlaceholder) + '"') + '>' +
      '</div>'
          : '';
      var actionsbox = this.multiple && this.options.actionsBox ?
      '<div class="bs-actionsbox">' +
      '<div class="btn-group btn-group-sm btn-block">' +
      '<button type="button" class="actions-btn bs-select-all btn btn-default">' +
      this.options.selectAllText +
      '</button>' +
      '<button type="button" class="actions-btn bs-deselect-all btn btn-default">' +
      this.options.deselectAllText +
      '</button>' +
      '</div>' +
      '</div>'
          : '';
      var donebutton = this.multiple && this.options.doneButton ?
      '<div class="bs-donebutton">' +
      '<div class="btn-group btn-block">' +
      '<button type="button" class="btn btn-sm btn-default">' +
      this.options.doneButtonText +
      '</button>' +
      '</div>' +
      '</div>'
          : '';
      var drop =
          '<div class="btn-group bootstrap-select' + multiple + inputGroup + '">' +
          '<button type="button" class="' + this.options.styleBase + ' dropdown-toggle" data-toggle="dropdown"' + autofocus + '>' +
          '<span class="filter-option pull-left"></span>&nbsp;' +
          '<span class="caret"></span>' +
          '</button>' +
          '<div class="dropdown-menu open">' +
          header +
          searchbox +
          actionsbox +
          '<ul class="dropdown-menu inner" role="menu">' +
          '</ul>' +
          donebutton +
          '</div>' +
          '</div>';

      return $(drop);
    },

    createView: function () {
      var $drop = this.createDropdown(),
          li = this.createLi();

      $drop.find('ul')[0].innerHTML = li;
      return $drop;
    },

    reloadLi: function () {
      //Remove all children.
      this.destroyLi();
      //Re build
      var li = this.createLi();
      this.$menuInner[0].innerHTML = li;
    },

    destroyLi: function () {
      this.$menu.find('li').remove();
    },

    createLi: function () {
      var that = this,
          _li = [],
          optID = 0,
          titleOption = document.createElement('option'),
          liIndex = -1; // increment liIndex whenever a new <li> element is created to ensure liObj is correct

      // Helper functions
      /**
       * @param content
       * @param [index]
       * @param [classes]
       * @param [optgroup]
       * @returns {string}
       */
      var generateLI = function (content, index, classes, optgroup) {
        return '<li' +
            ((typeof classes !== 'undefined' & '' !== classes) ? ' class="' + classes + '"' : '') +
            ((typeof index !== 'undefined' & null !== index) ? ' data-original-index="' + index + '"' : '') +
            ((typeof optgroup !== 'undefined' & null !== optgroup) ? 'data-optgroup="' + optgroup + '"' : '') +
            '>' + content + '</li>';
      };

      /**
       * @param text
       * @param [classes]
       * @param [inline]
       * @param [tokens]
       * @returns {string}
       */
      var generateA = function (text, classes, inline, tokens) {
        return '<a tabindex="0"' +
            (typeof classes !== 'undefined' ? ' class="' + classes + '"' : '') +
            (typeof inline !== 'undefined' ? ' style="' + inline + '"' : '') +
            (that.options.liveSearchNormalize ? ' data-normalized-text="' + normalizeToBase(htmlEscape(text)) + '"' : '') +
            (typeof tokens !== 'undefined' || tokens !== null ? ' data-tokens="' + tokens + '"' : '') +
            '>' + text +
            '<span class="' + that.options.iconBase + ' ' + that.options.tickIcon + ' check-mark"></span>' +
            '</a>';
      };

      if (this.options.title && !this.multiple && !this.$element.find('.bs-title-option').length) {
        liIndex--; // this option doesn't create a new <li> element, but does add a new option, so liIndex is decreased
        // Use native JS to prepend option (faster)
        var element = this.$element[0];
        titleOption.className = 'bs-title-option';
        titleOption.appendChild(document.createTextNode(this.options.title));
        titleOption.value = '';
        element.insertBefore(titleOption, element.firstChild);
        // Check if selected attribute is already set on an option. If not, select the titleOption option.
        if (element.options[element.selectedIndex].getAttribute('selected') === null) titleOption.selected = true;
      }

      this.$element.find('option').each(function (index) {
        var $this = $(this);

        liIndex++;

        if ($this.hasClass('bs-title-option')) return;

        // Get the class and text for the option
        var optionClass = this.className || '',
            inline = this.style.cssText,
            text = $this.data('content') ? $this.data('content') : $this.html(),
            tokens = $this.data('tokens') ? $this.data('tokens') : null,
            subtext = typeof $this.data('subtext') !== 'undefined' ? '<small class="text-muted">' + $this.data('subtext') + '</small>' : '',
            icon = typeof $this.data('icon') !== 'undefined' ? '<span class="' + that.options.iconBase + ' ' + $this.data('icon') + '"></span> ' : '',
            isDisabled = this.disabled || this.parentElement.tagName === "OPTGROUP" && this.parentElement.disabled;

        if (icon !== '' && isDisabled) {
          icon = '<span>' + icon + '</span>';
        }

        if (that.options.hideDisabled && isDisabled) {
          return;
        }

        if (!$this.data('content')) {
          // Prepend any icon and append any subtext to the main text.
          text = icon + '<span class="text">' + text + subtext + '</span>';
        }

        if (this.parentElement.tagName === "OPTGROUP" && $this.data('divider') !== true) {
          if ($this.index() === 0) { // Is it the first option of the optgroup?
            optID += 1;

            // Get the opt group label
            var label = this.parentElement.label,
                labelSubtext = typeof $this.parent().data('subtext') !== 'undefined' ? '<small class="text-muted">' + $this.parent().data('subtext') + '</small>' : '',
                labelIcon = $this.parent().data('icon') ? '<span class="' + that.options.iconBase + ' ' + $this.parent().data('icon') + '"></span> ' : '',
                optGroupClass = ' ' + this.parentElement.className || '';
            
            label = labelIcon + '<span class="text">' + label + labelSubtext + '</span>';

            if (index !== 0 && _li.length > 0) { // Is it NOT the first option of the select && are there elements in the dropdown?
              liIndex++;
              _li.push(generateLI('', null, 'divider', optID + 'div'));
            }
            liIndex++;
            _li.push(generateLI(label, null, 'dropdown-header' + optGroupClass, optID));
          }
          _li.push(generateLI(generateA(text, 'opt ' + optionClass + optGroupClass, inline, tokens), index, '', optID));
        } else if ($this.data('divider') === true) {
          _li.push(generateLI('', index, 'divider'));
        } else if ($this.data('hidden') === true) {
          _li.push(generateLI(generateA(text, optionClass, inline, tokens), index, 'hidden is-hidden'));
        } else {
          if (this.previousElementSibling && this.previousElementSibling.tagName === "OPTGROUP") {
            liIndex++;
            _li.push(generateLI('', null, 'divider', optID + 'div'));
          }
          _li.push(generateLI(generateA(text, optionClass, inline, tokens), index));
        }

        that.liObj[index] = liIndex;
      });

      //If we are not multiple, we don't have a selected item, and we don't have a title, select the first element so something is set in the button
      if (!this.multiple && this.$element.find('option:selected').length === 0 && !this.options.title) {
        this.$element.find('option').eq(0).prop('selected', true).attr('selected', 'selected');
      }

      return _li.join('');
    },

    findLis: function () {
      if (this.$lis == null) this.$lis = this.$menu.find('li');
      return this.$lis;
    },

    /**
     * @param [updateLi] defaults to true
     */
    render: function (updateLi) {
      var that = this,
          notDisabled;

      //Update the LI to match the SELECT
      if (updateLi !== false) {
        this.$element.find('option').each(function (index) {
          var $lis = that.findLis().eq(that.liObj[index]);

          that.setDisabled(index, this.disabled || this.parentElement.tagName === "OPTGROUP" && this.parentElement.disabled, $lis);
          that.setSelected(index, this.selected, $lis);
        });
      }

      this.tabIndex();

      var selectedItems = this.$element.find('option').map(function () {
        if (this.selected) {
          if (that.options.hideDisabled && (this.disabled || this.parentElement.tagName === "OPTGROUP" && this.parentElement.disabled)) return false;

          var $this = $(this),
              icon = $this.data('icon') && that.options.showIcon ? '<i class="' + that.options.iconBase + ' ' + $this.data('icon') + '"></i> ' : '',
              subtext;

          if (that.options.showSubtext && $this.data('subtext') && !that.multiple) {
            subtext = ' <small class="text-muted">' + $this.data('subtext') + '</small>';
          } else {
            subtext = '';
          }
          if (typeof $this.attr('title') !== 'undefined') {
            return $this.attr('title');
          } else if ($this.data('content') && that.options.showContent) {
            return $this.data('content');
          } else {
            return icon + $this.html() + subtext;
          }
        }
      }).toArray();

      //Fixes issue in IE10 occurring when no default option is selected and at least one option is disabled
      //Convert all the values into a comma delimited string
      var title = !this.multiple ? selectedItems[0] : selectedItems.join(this.options.multipleSeparator);

      //If this is multi select, and the selectText type is count, the show 1 of 2 selected etc..
      if (this.multiple && this.options.selectedTextFormat.indexOf('count') > -1) {
        var max = this.options.selectedTextFormat.split('>');
        if ((max.length > 1 && selectedItems.length > max[1]) || (max.length == 1 && selectedItems.length >= 2)) {
          notDisabled = this.options.hideDisabled ? ', [disabled]' : '';
          var totalCount = this.$element.find('option').not('[data-divider="true"], [data-hidden="true"]' + notDisabled).length,
              tr8nText = (typeof this.options.countSelectedText === 'function') ? this.options.countSelectedText(selectedItems.length, totalCount) : this.options.countSelectedText;
          title = tr8nText.replace('{0}', selectedItems.length.toString()).replace('{1}', totalCount.toString());
        }
      }

      if (this.options.title == undefined) {
        this.options.title = this.$element.attr('title');
      }

      if (this.options.selectedTextFormat == 'static') {
        title = this.options.title;
      }

      //If we dont have a title, then use the default, or if nothing is set at all, use the not selected text
      if (!title) {
        title = typeof this.options.title !== 'undefined' ? this.options.title : this.options.noneSelectedText;
      }

      //strip all html-tags and trim the result
      this.$button.attr('title', $.trim(title.replace(/<[^>]*>?/g, '')));
      this.$button.children('.filter-option').html(title);

      this.$element.trigger('rendered.bs.select');
    },

    /**
     * @param [style]
     * @param [status]
     */
    setStyle: function (style, status) {
      if (this.$element.attr('class')) {
        this.$newElement.addClass(this.$element.attr('class').replace(/selectpicker|mobile-device|bs-select-hidden|validate\[.*\]/gi, ''));
      }

      var buttonClass = style ? style : this.options.style;

      if (status == 'add') {
        this.$button.addClass(buttonClass);
      } else if (status == 'remove') {
        this.$button.removeClass(buttonClass);
      } else {
        this.$button.removeClass(this.options.style);
        this.$button.addClass(buttonClass);
      }
    },

    liHeight: function (refresh) {
      if (!refresh && (this.options.size === false || this.sizeInfo)) return;

      var newElement = document.createElement('div'),
          menu = document.createElement('div'),
          menuInner = document.createElement('ul'),
          divider = document.createElement('li'),
          li = document.createElement('li'),
          a = document.createElement('a'),
          text = document.createElement('span'),
          header = this.options.header ? this.$menu.find('.popover-title')[0].cloneNode(true) : null,
          search = this.options.liveSearch ? document.createElement('div') : null,
          actions = this.options.actionsBox && this.multiple ? this.$menu.find('.bs-actionsbox')[0].cloneNode(true) : null,
          doneButton = this.options.doneButton && this.multiple ? this.$menu.find('.bs-donebutton')[0].cloneNode(true) : null;

      text.className = 'text';
      newElement.className = this.$menu[0].parentNode.className + ' open';
      menu.className = 'dropdown-menu open';
      menuInner.className = 'dropdown-menu inner';
      divider.className = 'divider';

      text.appendChild(document.createTextNode('Inner text'));
      a.appendChild(text);
      li.appendChild(a);
      menuInner.appendChild(li);
      menuInner.appendChild(divider);
      if (header) menu.appendChild(header);
      if (search) {
        // create a span instead of input as creating an input element is slower
        var input = document.createElement('span');
        search.className = 'bs-searchbox';
        input.className = 'form-control';
        search.appendChild(input);
        menu.appendChild(search);
      }
      if (actions) menu.appendChild(actions);
      menu.appendChild(menuInner);
      if (doneButton) menu.appendChild(doneButton);
      newElement.appendChild(menu);

      document.body.appendChild(newElement);

      var liHeight = a.offsetHeight,
          headerHeight = header ? header.offsetHeight : 0,
          searchHeight = search ? search.offsetHeight : 0,
          actionsHeight = actions ? actions.offsetHeight : 0,
          doneButtonHeight = doneButton ? doneButton.offsetHeight : 0,
          dividerHeight = $(divider).outerHeight(true),
          // fall back to jQuery if getComputedStyle is not supported
          menuStyle = getComputedStyle ? getComputedStyle(menu) : false,
          $menu = menuStyle ? $(menu) : null,
          menuPadding = parseInt(menuStyle ? menuStyle.paddingTop : $menu.css('paddingTop')) +
                        parseInt(menuStyle ? menuStyle.paddingBottom : $menu.css('paddingBottom')) +
                        parseInt(menuStyle ? menuStyle.borderTopWidth : $menu.css('borderTopWidth')) +
                        parseInt(menuStyle ? menuStyle.borderBottomWidth : $menu.css('borderBottomWidth')),
          menuExtras =  menuPadding + 
                        parseInt(menuStyle ? menuStyle.marginTop : $menu.css('marginTop')) + 
                        parseInt(menuStyle ? menuStyle.marginBottom : $menu.css('marginBottom')) + 2;

      document.body.removeChild(newElement);

      this.sizeInfo = {
        liHeight: liHeight,
        headerHeight: headerHeight,
        searchHeight: searchHeight,
        actionsHeight: actionsHeight,
        doneButtonHeight: doneButtonHeight,
        dividerHeight: dividerHeight,
        menuPadding: menuPadding,
        menuExtras: menuExtras
      };
    },

    setSize: function () {
      this.findLis();
      this.liHeight();
      var that = this,
          $menu = this.$menu,
          $menuInner = this.$menuInner,
          $window = $(window),
          selectHeight = this.$newElement[0].offsetHeight,
          liHeight = this.sizeInfo['liHeight'],
          headerHeight = this.sizeInfo['headerHeight'],
          searchHeight = this.sizeInfo['searchHeight'],
          actionsHeight = this.sizeInfo['actionsHeight'],
          doneButtonHeight = this.sizeInfo['doneButtonHeight'],
          divHeight = this.sizeInfo['dividerHeight'],
          menuPadding = this.sizeInfo['menuPadding'],
          menuExtras = this.sizeInfo['menuExtras'],
          notDisabled = this.options.hideDisabled ? '.disabled' : '',
          menuHeight,
          selectOffsetTop,
          selectOffsetBot,
          posVert = function () {
            selectOffsetTop = that.$newElement[0].offsetTop - window.scrollY;
            selectOffsetBot = window.innerHeight - selectOffsetTop - selectHeight;
          };

      posVert();

      if (this.options.header) $menu.css('padding-top', 0);

      if (this.options.size === 'auto') {
        var getSize = function () {
          var minHeight,
              hasClass = function (className, include) {
                return function (element) {
                    if (include) {
                        return (element.classList ? element.classList.contains(className) : $(element).hasClass(className));
                    } else {
                        return !(element.classList ? element.classList.contains(className) : $(element).hasClass(className));
                    }
                };
              },
              lis = that.$menuInner[0].getElementsByTagName('li'),
              lisVisible = Array.prototype.filter ? Array.prototype.filter.call(lis, hasClass('hidden', false)) : that.$lis.not('.hidden'),
              optGroup = Array.prototype.filter ? Array.prototype.filter.call(lisVisible, hasClass('dropdown-header', true)) : lisVisible.filter('.dropdown-header');

          posVert();
          menuHeight = selectOffsetBot - menuExtras;

          if (that.options.dropupAuto) {
            that.$newElement.toggleClass('dropup', selectOffsetTop > selectOffsetBot && (menuHeight - menuExtras) < $menu.height());
          }
          if (that.$newElement.hasClass('dropup')) {
            menuHeight = selectOffsetTop - menuExtras;
          }

          if ((lisVisible.length + optGroup.length) > 3) {
            minHeight = liHeight * 3 + menuExtras - 2;
          } else {
            minHeight = 0;
          }

          $menu.css({
            'max-height': menuHeight + 'px',
            'overflow': 'hidden',
            'min-height': minHeight + headerHeight + searchHeight + actionsHeight + doneButtonHeight + 'px'
          });
          $menuInner.css({
            'max-height': menuHeight - headerHeight - searchHeight - actionsHeight - doneButtonHeight - menuPadding + 'px',
            'overflow-y': 'auto',
            'min-height': Math.max(minHeight - menuPadding, 0) + 'px'
          });
        };
        getSize();
        this.$searchbox.off('input.getSize propertychange.getSize').on('input.getSize propertychange.getSize', getSize);
        $window.off('resize.getSize scroll.getSize').on('resize.getSize scroll.getSize', getSize);
      } else if (this.options.size && this.options.size != 'auto' && this.$lis.not(notDisabled).length > this.options.size) {
        var optIndex = this.$lis.not('.divider').not(notDisabled).children().slice(0, this.options.size).last().parent().index(),
            divLength = this.$lis.slice(0, optIndex + 1).filter('.divider').length;
        menuHeight = liHeight * this.options.size + divLength * divHeight + menuPadding;

        if (that.options.dropupAuto) {
          //noinspection JSUnusedAssignment
          this.$newElement.toggleClass('dropup', selectOffsetTop > selectOffsetBot && (menuHeight - menuExtras) < $menu.height());
        }
        $menu.css({
          'max-height': menuHeight + headerHeight + searchHeight + actionsHeight + doneButtonHeight + 'px',
          'overflow': 'hidden',
          'min-height': ''
        });
        $menuInner.css({
          'max-height': menuHeight - menuPadding + 'px',
          'overflow-y': 'auto',
          'min-height': ''
        });
      }
    },

    setWidth: function () {
      if (this.options.width === 'auto') {
        this.$menu.css('min-width', '0');

        // Get correct width if element is hidden
        var $selectClone = this.$menu.parent().clone().appendTo('body'),
            $selectClone2 = this.options.container ? this.$newElement.clone().appendTo('body') : $selectClone,
            ulWidth = $selectClone.children('.dropdown-menu').outerWidth(),
            btnWidth = $selectClone2.css('width', 'auto').children('button').outerWidth();

        $selectClone.remove();
        $selectClone2.remove();

        // Set width to whatever's larger, button title or longest option
        this.$newElement.css('width', Math.max(ulWidth, btnWidth) + 'px');
      } else if (this.options.width === 'fit') {
        // Remove inline min-width so width can be changed from 'auto'
        this.$menu.css('min-width', '');
        this.$newElement.css('width', '').addClass('fit-width');
      } else if (this.options.width) {
        // Remove inline min-width so width can be changed from 'auto'
        this.$menu.css('min-width', '');
        this.$newElement.css('width', this.options.width);
      } else {
        // Remove inline min-width/width so width can be changed
        this.$menu.css('min-width', '');
        this.$newElement.css('width', '');
      }
      // Remove fit-width class if width is changed programmatically
      if (this.$newElement.hasClass('fit-width') && this.options.width !== 'fit') {
        this.$newElement.removeClass('fit-width');
      }
    },

    selectPosition: function () {
      var that = this,
          drop = '<div />',
          $drop = $(drop),
          pos,
          actualHeight,
          getPlacement = function ($element) {
            $drop.addClass($element.attr('class').replace(/form-control|fit-width/gi, '')).toggleClass('dropup', $element.hasClass('dropup'));
            pos = $element.offset();
            actualHeight = $element.hasClass('dropup') ? 0 : $element[0].offsetHeight;
            $drop.css({
              'top': pos.top + actualHeight,
              'left': pos.left,
              'width': $element[0].offsetWidth,
              'position': 'absolute'
            });
          };

      this.$newElement.on('click', function () {
        if (that.isDisabled()) {
          return;
        }
        getPlacement($(this));
        $drop.appendTo(that.options.container);
        $drop.toggleClass('open', !$(this).hasClass('open'));
        $drop.append(that.$menu);
      });

      $(window).on('resize scroll', function () {
        getPlacement(that.$newElement);
      });

      this.$element.on('hide.bs.select', function () {
        $drop.detach();
      });
    },

    setSelected: function (index, selected, $lis) {
      if (!$lis) {
        var $lis = this.findLis().eq(this.liObj[index]);
      }

      $lis.toggleClass('selected', selected);
    },

    setDisabled: function (index, disabled, $lis) {
      if (!$lis) {
        var $lis = this.findLis().eq(this.liObj[index]);
      }

      if (disabled) {
        $lis.addClass('disabled').children('a').attr('href', '#').attr('tabindex', -1);
      } else {
        $lis.removeClass('disabled').children('a').removeAttr('href').attr('tabindex', 0);
      }
    },

    isDisabled: function () {
      return this.$element[0].disabled;
    },

    checkDisabled: function () {
      var that = this;

      if (this.isDisabled()) {
        this.$newElement.addClass('disabled');
        this.$button.addClass('disabled').attr('tabindex', -1);
      } else {
        if (this.$button.hasClass('disabled')) {
          this.$newElement.removeClass('disabled');
          this.$button.removeClass('disabled');
        }

        if (this.$button.attr('tabindex') == -1 && !this.$element.data('tabindex')) {
          this.$button.removeAttr('tabindex');
        }
      }

      this.$button.click(function () {
        return !that.isDisabled();
      });
    },

    tabIndex: function () {
      if (this.$element.is('[tabindex]')) {
        this.$element.data('tabindex', this.$element.attr('tabindex'));
        this.$button.attr('tabindex', this.$element.data('tabindex'));
      }
    },

    clickListener: function () {
      var that = this,
          $document = $(document);

      this.$newElement.on('touchstart.dropdown', '.dropdown-menu', function (e) {
        e.stopPropagation();
      });

      $document.data('spaceSelect', false);
      
      this.$button.on('keyup', function (e) {
        if (/(32)/.test(e.keyCode.toString(10)) && $document.data('spaceSelect')) {
            e.preventDefault();
            $document.data('spaceSelect', false);
        }
      });

      this.$newElement.on('click', function () {
        that.setSize();
        that.$element.on('shown.bs.select', function () {
          if (!that.options.liveSearch && !that.multiple) {
            that.$menu.find('.selected a').focus();
          } else if (!that.multiple) {
            var selectedIndex = that.liObj[that.$element[0].selectedIndex];

            if (typeof selectedIndex !== 'number') return;
            
            // scroll to selected option
            var offset = that.$lis.eq(selectedIndex)[0].offsetTop - that.$menuInner[0].offsetTop;
            offset = offset - that.$menuInner[0].offsetHeight/2 + that.sizeInfo.liHeight/2;
            that.$menuInner[0].scrollTop = offset;
          }
        });
      });

      this.$menu.on('click', 'li a', function (e) {
        var $this = $(this),
            clickedIndex = $this.parent().data('originalIndex'),
            prevValue = that.$element.val(),
            prevIndex = that.$element.prop('selectedIndex');

        // Don't close on multi choice menu
        if (that.multiple) {
          e.stopPropagation();
        }

        e.preventDefault();

        //Don't run if we have been disabled
        if (!that.isDisabled() && !$this.parent().hasClass('disabled')) {
          var $options = that.$element.find('option'),
              $option = $options.eq(clickedIndex),
              state = $option.prop('selected'),
              $optgroup = $option.parent('optgroup'),
              maxOptions = that.options.maxOptions,
              maxOptionsGrp = $optgroup.data('maxOptions') || false;

          if (!that.multiple) { // Deselect all others if not multi select box
            $options.prop('selected', false);
            $option.prop('selected', true);
            that.$menu.find('.selected').removeClass('selected');
            that.setSelected(clickedIndex, true);
          } else { // Toggle the one we have chosen if we are multi select.
            $option.prop('selected', !state);
            that.setSelected(clickedIndex, !state);
            $this.blur();

            if (maxOptions !== false || maxOptionsGrp !== false) {
              var maxReached = maxOptions < $options.filter(':selected').length,
                  maxReachedGrp = maxOptionsGrp < $optgroup.find('option:selected').length;

              if ((maxOptions && maxReached) || (maxOptionsGrp && maxReachedGrp)) {
                if (maxOptions && maxOptions == 1) {
                  $options.prop('selected', false);
                  $option.prop('selected', true);
                  that.$menu.find('.selected').removeClass('selected');
                  that.setSelected(clickedIndex, true);
                } else if (maxOptionsGrp && maxOptionsGrp == 1) {
                  $optgroup.find('option:selected').prop('selected', false);
                  $option.prop('selected', true);
                  var optgroupID = $this.parent().data('optgroup');
                  that.$menu.find('[data-optgroup="' + optgroupID + '"]').removeClass('selected');
                  that.setSelected(clickedIndex, true);
                } else {
                  var maxOptionsArr = (typeof that.options.maxOptionsText === 'function') ?
                          that.options.maxOptionsText(maxOptions, maxOptionsGrp) : that.options.maxOptionsText,
                      maxTxt = maxOptionsArr[0].replace('{n}', maxOptions),
                      maxTxtGrp = maxOptionsArr[1].replace('{n}', maxOptionsGrp),
                      $notify = $('<div class="notify"></div>');
                  // If {var} is set in array, replace it
                  /** @deprecated */
                  if (maxOptionsArr[2]) {
                    maxTxt = maxTxt.replace('{var}', maxOptionsArr[2][maxOptions > 1 ? 0 : 1]);
                    maxTxtGrp = maxTxtGrp.replace('{var}', maxOptionsArr[2][maxOptionsGrp > 1 ? 0 : 1]);
                  }

                  $option.prop('selected', false);

                  that.$menu.append($notify);

                  if (maxOptions && maxReached) {
                    $notify.append($('<div>' + maxTxt + '</div>'));
                    that.$element.trigger('maxReached.bs.select');
                  }

                  if (maxOptionsGrp && maxReachedGrp) {
                    $notify.append($('<div>' + maxTxtGrp + '</div>'));
                    that.$element.trigger('maxReachedGrp.bs.select');
                  }

                  setTimeout(function () {
                    that.setSelected(clickedIndex, false);
                  }, 10);

                  $notify.delay(750).fadeOut(300, function () {
                    $(this).remove();
                  });
                }
              }
            }
          }

          if (!that.multiple) {
            that.$button.focus();
          } else if (that.options.liveSearch) {
            that.$searchbox.focus();
          }

          // Trigger select 'change'
          if ((prevValue != that.$element.val() && that.multiple) || (prevIndex != that.$element.prop('selectedIndex') && !that.multiple)) {
            that.$element.change();
            // $option.prop('selected') is current option state (selected/unselected). state is previous option state.
            that.$element.trigger('changed.bs.select', [clickedIndex, $option.prop('selected'), state]);
          }
        }
      });

      this.$menu.on('click', 'li.disabled a, .popover-title, .popover-title :not(.close)', function (e) {
        if (e.currentTarget == this) {
          e.preventDefault();
          e.stopPropagation();
          if (that.options.liveSearch && !$(e.target).hasClass('close')) {
            that.$searchbox.focus();
          } else {
            that.$button.focus();
          }
        }
      });

      this.$menu.on('click', 'li.divider, li.dropdown-header', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (that.options.liveSearch) {
          that.$searchbox.focus();
        } else {
          that.$button.focus();
        }
      });

      this.$menu.on('click', '.popover-title .close', function () {
        that.$button.click();
      });

      this.$searchbox.on('click', function (e) {
        e.stopPropagation();
      });

      this.$menu.on('click', '.actions-btn', function (e) {
        if (that.options.liveSearch) {
          that.$searchbox.focus();
        } else {
          that.$button.focus();
        }

        e.preventDefault();
        e.stopPropagation();

        if ($(this).hasClass('bs-select-all')) {
          that.selectAll();
        } else {
          that.deselectAll();
        }
        that.$element.change();
      });

      this.$element.change(function () {
        that.render(false);
      });
    },

    liveSearchListener: function () {
      var that = this,
          $no_results = $('<li class="no-results"></li>');

      this.$newElement.on('click.dropdown.data-api touchstart.dropdown.data-api', function () {
        that.$menuInner.find('.active').removeClass('active');
        if (!!that.$searchbox.val()) {
          that.$searchbox.val('');
          that.$lis.not('.is-hidden').removeClass('hidden');
          if (!!$no_results.parent().length) $no_results.remove();
        }
        if (!that.multiple) that.$menuInner.find('.selected').addClass('active');
        setTimeout(function () {
          that.$searchbox.focus();
        }, 10);
      });

      this.$searchbox.on('click.dropdown.data-api focus.dropdown.data-api touchend.dropdown.data-api', function (e) {
        e.stopPropagation();
      });

      this.$searchbox.on('input propertychange', function () {
        if (that.$searchbox.val()) {
          var $searchBase = that.$lis.not('.is-hidden').removeClass('hidden').children('a');
          if (that.options.liveSearchNormalize) {
            $searchBase = $searchBase.not(':a' + that._searchStyle() + '(' + normalizeToBase(that.$searchbox.val()) + ')');
          } else {
            $searchBase = $searchBase.not(':' + that._searchStyle() + '(' + that.$searchbox.val() + ')');
          }
          $searchBase.parent().addClass('hidden');

          that.$lis.filter('.dropdown-header').each(function () {
            var $this = $(this),
                optgroup = $this.data('optgroup');

            if (that.$lis.filter('[data-optgroup=' + optgroup + ']').not($this).not('.hidden').length === 0) {
              $this.addClass('hidden');
              that.$lis.filter('[data-optgroup=' + optgroup + 'div]').addClass('hidden');
            }
          });

          var $lisVisible = that.$lis.not('.hidden');

          // hide divider if first or last visible, or if followed by another divider
          $lisVisible.each(function (index) {
            var $this = $(this);

            if ($this.hasClass('divider') && (
              $this.index() === $lisVisible.eq(0).index() ||
              $this.index() === $lisVisible.last().index() ||
              $lisVisible.eq(index + 1).hasClass('divider'))) {
              $this.addClass('hidden');
            }
          });

          if (!that.$lis.not('.hidden, .no-results').length) {
            if (!!$no_results.parent().length) {
              $no_results.remove();
            }
            $no_results.html(that.options.noneResultsText.replace('{0}', '"' + htmlEscape(that.$searchbox.val()) + '"')).show();
            that.$menuInner.append($no_results);
          } else if (!!$no_results.parent().length) {
            $no_results.remove();
          }

        } else {
          that.$lis.not('.is-hidden').removeClass('hidden');
          if (!!$no_results.parent().length) {
            $no_results.remove();
          }
        }

        that.$lis.filter('.active').removeClass('active');
        that.$lis.not('.hidden, .divider, .dropdown-header').eq(0).addClass('active').children('a').focus();
        $(this).focus();
      });
    },

    _searchStyle: function () {
      var style = 'icontains';
      switch (this.options.liveSearchStyle) {
        case 'begins':
        case 'startsWith':
          style = 'ibegins';
          break;
        case 'contains':
        default:
          break; //no need to change the default
      }

      return style;
    },

    val: function (value) {
      if (typeof value !== 'undefined') {
        this.$element.val(value);
        this.render();

        return this.$element;
      } else {
        return this.$element.val();
      }
    },

    selectAll: function () {
      this.findLis();
      this.$element.find('option:enabled').not('[data-divider], [data-hidden]').prop('selected', true);
      this.$lis.not('.divider, .dropdown-header, .disabled, .hidden').addClass('selected');
      this.render(false);
    },

    deselectAll: function () {
      this.findLis();
      this.$element.find('option:enabled').not('[data-divider], [data-hidden]').prop('selected', false);
      this.$lis.not('.divider, .dropdown-header, .disabled, .hidden').removeClass('selected');
      this.render(false);
    },

    keydown: function (e) {
      var $this = $(this),
          $parent = $this.is('input') ? $this.parent().parent() : $this.parent(),
          $items,
          that = $parent.data('this'),
          index,
          next,
          first,
          last,
          prev,
          nextPrev,
          prevIndex,
          isActive,
          selector = ':not(.disabled, .hidden, .dropdown-header, .divider)',
          keyCodeMap = {
            32: ' ',
            48: '0',
            49: '1',
            50: '2',
            51: '3',
            52: '4',
            53: '5',
            54: '6',
            55: '7',
            56: '8',
            57: '9',
            59: ';',
            65: 'a',
            66: 'b',
            67: 'c',
            68: 'd',
            69: 'e',
            70: 'f',
            71: 'g',
            72: 'h',
            73: 'i',
            74: 'j',
            75: 'k',
            76: 'l',
            77: 'm',
            78: 'n',
            79: 'o',
            80: 'p',
            81: 'q',
            82: 'r',
            83: 's',
            84: 't',
            85: 'u',
            86: 'v',
            87: 'w',
            88: 'x',
            89: 'y',
            90: 'z',
            96: '0',
            97: '1',
            98: '2',
            99: '3',
            100: '4',
            101: '5',
            102: '6',
            103: '7',
            104: '8',
            105: '9'
          };

      if (that.options.liveSearch) $parent = $this.parent().parent();

      if (that.options.container) $parent = that.$menu;

      $items = $('[role=menu] li a', $parent);

      isActive = that.$menu.parent().hasClass('open');

      if (!isActive && (e.keyCode >= 48 && e.keyCode <= 57 || event.keyCode >= 65 && event.keyCode <= 90)) {
        if (!that.options.container) {
          that.setSize();
          that.$menu.parent().addClass('open');
          isActive = true;
        } else {
          that.$newElement.trigger('click');
        }
        that.$searchbox.focus();
      }

      if (that.options.liveSearch) {
        if (/(^9$|27)/.test(e.keyCode.toString(10)) && isActive && that.$menu.find('.active').length === 0) {
          e.preventDefault();
          that.$menu.parent().removeClass('open');
          if (that.options.container) that.$newElement.removeClass('open');
          that.$button.focus();
        }
        // $items contains li elements when liveSearch is enabled
        $items = $('[role=menu] li:not(.disabled, .hidden, .dropdown-header, .divider)', $parent);
        if (!$this.val() && !/(38|40)/.test(e.keyCode.toString(10))) {
          if ($items.filter('.active').length === 0) {
            $items = that.$newElement.find('li');
            if (that.options.liveSearchNormalize) {
              $items = $items.filter(':a' + that._searchStyle() + '(' + normalizeToBase(keyCodeMap[e.keyCode]) + ')');
            } else {
              $items = $items.filter(':' + that._searchStyle() + '(' + keyCodeMap[e.keyCode] + ')');
            }
          }
        }
      }

      if (!$items.length) return;

      if (/(38|40)/.test(e.keyCode.toString(10))) {
        index = $items.index($items.filter(':focus'));
        first = $items.parent(selector).first().data('originalIndex');
        last = $items.parent(selector).last().data('originalIndex');
        next = $items.eq(index).parent().nextAll(selector).eq(0).data('originalIndex');
        prev = $items.eq(index).parent().prevAll(selector).eq(0).data('originalIndex');
        nextPrev = $items.eq(next).parent().prevAll(selector).eq(0).data('originalIndex');

        if (that.options.liveSearch) {
          $items.each(function (i) {
            if (!$(this).hasClass('disabled')) {
              $(this).data('index', i);
            }
          });
          index = $items.index($items.filter('.active'));
          first = $items.first().data('index');
          last = $items.last().data('index');
          next = $items.eq(index).nextAll().eq(0).data('index');
          prev = $items.eq(index).prevAll().eq(0).data('index');
          nextPrev = $items.eq(next).prevAll().eq(0).data('index');
        }

        prevIndex = $this.data('prevIndex');

        if (e.keyCode == 38) {
          if (that.options.liveSearch) index -= 1;
          if (index != nextPrev && index > prev) index = prev;
          if (index < first) index = first;
          if (index == prevIndex) index = last;
        } else if (e.keyCode == 40) {
          if (that.options.liveSearch) index += 1;
          if (index == -1) index = 0;
          if (index != nextPrev && index < next) index = next;
          if (index > last) index = last;
          if (index == prevIndex) index = first;
        }

        $this.data('prevIndex', index);

        if (!that.options.liveSearch) {
          $items.eq(index).focus();
        } else {
          e.preventDefault();
          if (!$this.hasClass('dropdown-toggle')) {
            $items.removeClass('active').eq(index).addClass('active').children('a').focus();
            $this.focus();
          }
        }

      } else if (!$this.is('input')) {
        var keyIndex = [],
            count,
            prevKey;

        $items.each(function () {
          if (!$(this).parent().hasClass('disabled')) {
            if ($.trim($(this).text().toLowerCase()).substring(0, 1) == keyCodeMap[e.keyCode]) {
              keyIndex.push($(this).parent().index());
            }
          }
        });

        count = $(document).data('keycount');
        count++;
        $(document).data('keycount', count);

        prevKey = $.trim($(':focus').text().toLowerCase()).substring(0, 1);

        if (prevKey != keyCodeMap[e.keyCode]) {
          count = 1;
          $(document).data('keycount', count);
        } else if (count >= keyIndex.length) {
          $(document).data('keycount', 0);
          if (count > keyIndex.length) count = 1;
        }

        $items.eq(keyIndex[count - 1]).focus();
      }

      // Select focused option if "Enter", "Spacebar" or "Tab" (when selectOnTab is true) are pressed inside the menu.
      if ((/(13|32)/.test(e.keyCode.toString(10)) || (/(^9$)/.test(e.keyCode.toString(10)) && that.options.selectOnTab)) && isActive) {
        if (!/(32)/.test(e.keyCode.toString(10))) e.preventDefault();
        if (!that.options.liveSearch) {
          var elem = $(':focus');
          elem.click();
          // Bring back focus for multiselects
          elem.focus();
          // Prevent screen from scrolling if the user hit the spacebar
          e.preventDefault();
          // Fixes spacebar selection of dropdown items in FF & IE
          $(document).data('spaceSelect', true);
        } else if (!/(32)/.test(e.keyCode.toString(10))) {
          that.$menu.find('.active a').click();
          $this.focus();
        }
        $(document).data('keycount', 0);
      }

      if ((/(^9$|27)/.test(e.keyCode.toString(10)) && isActive && (that.multiple || that.options.liveSearch)) || (/(27)/.test(e.keyCode.toString(10)) && !isActive)) {
        that.$menu.parent().removeClass('open');
        if (that.options.container) that.$newElement.removeClass('open');
        that.$button.focus();
      }
    },

    mobile: function () {
      this.$element.addClass('mobile-device').appendTo(this.$newElement);
      if (this.options.container) this.$menu.hide();
    },

    refresh: function () {
      this.$lis = null;
      this.reloadLi();
      this.render();
      this.checkDisabled();
      this.liHeight(true);
      this.setStyle();
      this.setWidth();
      this.$searchbox.trigger('propertychange');

      this.$element.trigger('refreshed.bs.select');
    },

    hide: function () {
      this.$newElement.hide();
    },

    show: function () {
      this.$newElement.show();
    },

    remove: function () {
      this.$newElement.remove();
      this.$element.remove();
    }
  };

  // SELECTPICKER PLUGIN DEFINITION
  // ==============================
  function Plugin(option, event) {
    // get the args of the outer function..
    var args = arguments;
    // The arguments of the function are explicitly re-defined from the argument list, because the shift causes them
    // to get lost/corrupted in android 2.3 and IE9 #715 #775
    var _option = option,
        _event = event;
    [].shift.apply(args);

    var value;
    var chain = this.each(function () {
      var $this = $(this);
      if ($this.is('select')) {
        var data = $this.data('selectpicker'),
            options = typeof _option == 'object' && _option;

        if (!data) {
          var config = $.extend({}, Selectpicker.DEFAULTS, $.fn.selectpicker.defaults || {}, $this.data(), options);
          $this.data('selectpicker', (data = new Selectpicker(this, config, _event)));
        } else if (options) {
          for (var i in options) {
            if (options.hasOwnProperty(i)) {
              data.options[i] = options[i];
            }
          }
        }

        if (typeof _option == 'string') {
          if (data[_option] instanceof Function) {
            value = data[_option].apply(data, args);
          } else {
            value = data.options[_option];
          }
        }
      }
    });

    if (typeof value !== 'undefined') {
      //noinspection JSUnusedAssignment
      return value;
    } else {
      return chain;
    }
  }

  var old = $.fn.selectpicker;
  $.fn.selectpicker = Plugin;
  $.fn.selectpicker.Constructor = Selectpicker;

  // SELECTPICKER NO CONFLICT
  // ========================
  $.fn.selectpicker.noConflict = function () {
    $.fn.selectpicker = old;
    return this;
  };

  $(document)
      .data('keycount', 0)
      .on('keydown', '.bootstrap-select [data-toggle=dropdown], .bootstrap-select [role="menu"], .bs-searchbox input', Selectpicker.prototype.keydown)
      .on('focusin.modal', '.bootstrap-select [data-toggle=dropdown], .bootstrap-select [role="menu"], .bs-searchbox input', function (e) {
        e.stopPropagation();
      });

  // SELECTPICKER DATA-API
  // =====================
  $(window).on('load.bs.select.data-api', function () {
    $('.selectpicker').each(function () {
      var $selectpicker = $(this);
      Plugin.call($selectpicker, $selectpicker.data());
    })
  });
})(jQuery);

/*  breakpoints_min  */
/* global XA, Breakpoints, $ */
/*eslint no-console: ["error", { allow: ["log"] }] */
/* eslint no-unused-vars: 0 */
/* eslint guard-for-in: 0 */
/* eslint curly: 0 */
/* eslint no-undef: 0 */
/**
* breakpoints-js v1.0.6
* https://github.com/amazingSurge/breakpoints-js
*
* Copyright (c) amazingSurge
* Released under the LGPL-3.0 license
*/
!function(t,n){if("function"==typeof define&&define.amd)define(["exports"],n);else if("undefined"!=typeof exports)n(exports);else{var e={};n(e),t.breakpointsEs=e}}(this,function(t){"use strict";function u(t,n){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!n||"object"!=typeof n&&"function"!=typeof n?t:n}function e(t,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function, not "+typeof n);t.prototype=Object.create(n&&n.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),n&&(Object.setPrototypeOf?Object.setPrototypeOf(t,n):t.__proto__=n)}function l(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function i(t,n){for(var e=0;e<n.length;e++){var i=n[e];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(t,n,e){return n&&i(t.prototype,n),e&&i(t,e),t}}(),o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},i={xs:{min:0,max:767},sm:{min:768,max:991},md:{min:992,max:1199},lg:{min:1200,max:1/0}},s=function(t,n){for(var e in t)if(("object"!==(void 0===t?"undefined":o(t))||t.hasOwnProperty(e))&&!1===n(e,t[e]))break},a=function(t){return"function"==typeof t||!1},r=function(t,n){for(var e in n)t[e]=n[e];return t},c=function(){function t(){l(this,t),this.length=0,this.list=[]}return n(t,[{key:"add",value:function(t,n){var e=2<arguments.length&&void 0!==arguments[2]&&arguments[2];this.list.push({fn:t,data:n,one:e}),this.length++}},{key:"remove",value:function(t){for(var n=0;n<this.list.length;n++)this.list[n].fn===t&&(this.list.splice(n,1),this.length--,n--)}},{key:"empty",value:function(){this.list=[],this.length=0}},{key:"call",value:function(t,n){var e=2<arguments.length&&void 0!==arguments[2]?arguments[2]:null;n||(n=this.length-1);var i=this.list[n];a(e)?e.call(this,t,i,n):a(i.fn)&&i.fn.call(t||window,i.data),i.one&&(delete this.list[n],this.length--)}},{key:"fire",value:function(t){var n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:null;for(var e in this.list)this.list.hasOwnProperty(e)&&this.call(t,e,n)}}]),t}(),f={current:null,callbacks:new c,trigger:function(e){var i=this.current;this.current=e,this.callbacks.fire(e,function(t,n){a(n.fn)&&n.fn.call({current:e,previous:i},n.data)})},one:function(t,n){return this.on(t,n,!0)},on:function(t,n){var e=2<arguments.length&&void 0!==arguments[2]&&arguments[2];void 0===n&&a(t)&&(n=t,t=void 0),a(n)&&this.callbacks.add(n,t,e)},off:function(t){void 0===t&&this.callbacks.empty()}},h=function(){function e(t,n){l(this,e),this.name=t,this.media=n,this.initialize()}return n(e,[{key:"initialize",value:function(){this.callbacks={enter:new c,leave:new c},this.mql=window.matchMedia&&window.matchMedia(this.media)||{matches:!1,media:this.media,addListener:function(){},removeListener:function(){}};var e=this;this.mqlListener=function(t){var n=t.matches?"enter":"leave";e.callbacks[n].fire(e)},this.mql.addListener(this.mqlListener)}},{key:"on",value:function(t,n,e){var i=3<arguments.length&&void 0!==arguments[3]&&arguments[3];if("object"!==(void 0===t?"undefined":o(t)))return void 0===e&&a(n)&&(e=n,n=void 0),a(e)&&void 0!==this.callbacks[t]&&(this.callbacks[t].add(e,n,i),"enter"===t&&this.isMatched()&&this.callbacks[t].call(this)),this;for(var r in t)t.hasOwnProperty(r)&&this.on(r,n,t[r],i);return this}},{key:"one",value:function(t,n,e){return this.on(t,n,e,!0)}},{key:"off",value:function(t,n){var e=void 0;if("object"!==(void 0===t?"undefined":o(t)))return void 0===t?(this.callbacks.enter.empty(),this.callbacks.leave.empty()):t in this.callbacks&&(n?this.callbacks[t].remove(n):this.callbacks[t].empty()),this;for(e in t)t.hasOwnProperty(e)&&this.off(e,t[e]);return this}},{key:"isMatched",value:function(){return this.mql.matches}},{key:"destroy",value:function(){this.off()}}]),e}(),d={min:function(t){return"(min-width: "+t+(1<arguments.length&&void 0!==arguments[1]?arguments[1]:"px")+")"},max:function(t){return"(max-width: "+t+(1<arguments.length&&void 0!==arguments[1]?arguments[1]:"px")+")"},between:function(t,n){var e=2<arguments.length&&void 0!==arguments[2]?arguments[2]:"px";return"(min-width: "+t+e+") and (max-width: "+n+e+")"},get:function(t,n){var e=2<arguments.length&&void 0!==arguments[2]?arguments[2]:"px";return 0===t?this.max(n,e):n===1/0?this.min(t,e):this.between(t,n,e)}},v=function(t){function a(t){var n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,e=2<arguments.length&&void 0!==arguments[2]?arguments[2]:1/0,i=3<arguments.length&&void 0!==arguments[3]?arguments[3]:"px";l(this,a);var r=d.get(n,e,i),o=u(this,(a.__proto__||Object.getPrototypeOf(a)).call(this,t,r));o.min=n,o.max=e,o.unit=i;var s=o;return o.changeListener=function(){s.isMatched()&&f.trigger(s)},o.isMatched()&&(f.current=o),o.mql.addListener(o.changeListener),o}return e(a,h),n(a,[{key:"destroy",value:function(){this.off(),this.mql.removeListener(this.changeListener)}}]),a}(),p=function(t){function n(t){l(this,n);var i=[],r=[];return s(t.split(" "),function(t,n){var e=b.get(n);e&&(i.push(e),r.push(e.media))}),u(this,(n.__proto__||Object.getPrototypeOf(n)).call(this,t,r.join(",")))}return e(n,h),n}(),m={},y={},g=window.Breakpoints=function(){for(var t=arguments.length,n=Array(t),e=0;e<t;e++)n[e]=arguments[e];g.define.apply(g,n)};g.defaults=i;var b=g=r(g,{version:"1.0.6",defined:!1,define:function(t){var n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{};for(var e in this.defined&&this.destroy(),t||(t=g.defaults),this.options=r(n,{unit:"px"}),t)t.hasOwnProperty(e)&&this.set(e,t[e].min,t[e].max,this.options.unit);this.defined=!0},destroy:function(){s(m,function(t,n){n.destroy()}),m={},f.current=null},is:function(t){var n=this.get(t);return n?n.isMatched():null},all:function(){var n=[];return s(m,function(t){n.push(t)}),n},set:function(t){var n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,e=2<arguments.length&&void 0!==arguments[2]?arguments[2]:1/0,i=3<arguments.length&&void 0!==arguments[3]?arguments[3]:"px",r=this.get(t);return r&&r.destroy(),m[t]=new v(t,n,e,i),m[t]},get:function(t){return m.hasOwnProperty(t)?m[t]:null},getUnion:function(t){return y.hasOwnProperty(t)||(y[t]=new p(t)),y[t]},getMin:function(t){var n=this.get(t);return n?n.min:null},getMax:function(t){var n=this.get(t);return n?n.max:null},current:function(){return f.current},getMedia:function(t){var n=this.get(t);return n?n.media:null},on:function(t,n,e,i){var r=4<arguments.length&&void 0!==arguments[4]&&arguments[4];if("change"===(t=t.trim()))return i=e,e=n,f.on(e,i,r);if(t.indexOf(" ") > -1){var o=this.getUnion(t);o&&o.on(n,e,i,r)}else{var s=this.get(t);s&&s.on(n,e,i,r)}return this},one:function(t,n,e,i){return this.on(t,n,e,i,!0)},off:function(t,n,e){if("change"===(t=t.trim()))return f.off(n);if(t.indexOf(" ") > -1){var i=this.getUnion(t);i&&i.off(n,e)}else{var r=this.get(t);r&&r.off(n,e)}return this}});t.default=b});
//# sourceMappingURL=breakpoints.min.js.map


/*  component-backtotop  */
XA.component.backToTopComponent = (function($) {
    var api=api || {};
  
    api.init = function() {  
        var backToTop= $('<a></a>').addClass('back-to-top').bind('click', function(event) { 
            event.preventDefault();
            $('html, body').animate({ scrollTop: 0 }, 400);           
        });

        $('body').append(backToTop);        
    };
  
    return api;
  })(jQuery, document);
  
  XA.register('backToTopComponent', XA.component.backToTopComponent);
  

/*  component-cookie  */
XA.component.componentCookie = (function ($) {
    var api = api || {};
    api.init = function () {









    };
    return api;
})(jQuery, document);
XA.register('componentCookie', XA.component.componentCookie);

/*  component-form-elements  */
XA.component.componentForm = (function ($) {
    var api = api || {};
    api.init = function () {

        $(".form").addClass('float-label');
        $(".form").find('.radio, .checkbox, .g-recaptcha, .wfmDatebox, input[type="file"], select, .datepicker').siblings('label').addClass('is-active');
        $(".form").find('.form-group').each(function () {
            if ($(this).children(':input').length > 2) {
                $(this).addClass('password-confirm');
            }
        })

        // $(".form").find('select').addClass('facet-dropdown-select');
        $(".form").find('form').attr('autocomplete', 'off');
        $('.single-line, textarea').on('focus', function () {
            var labelTxt = $('label[for="' + $(this).attr('id') + '"]');
            labelTxt.addClass("is-active");
        });
        $('.single-line, textarea').on('focusout', function () {
            if ($(this).val().length == 0 && !$(this).attr('placeholder').length) {
                var labelTxt = $('label[for="' + $(this).attr('id') + '"]');
                labelTxt.removeClass("is-active");
            }
        });

        //Disable Auto-complete in Forms
        $('form').attr('autocomplete', 'off');
        $('.form-group input.form-control, .form-group textarea.form-control').each(function () {
            $(this).attr('autocomplete', 'off');
        });

        $('.form').submit(function (e) {
            e.preventDefault();
            var self = this;
            XA.component.FormTracking.TrackSubmitEvent(self);
            $(document).find(this).find('.required-field .form-control').each(function () {
                var errorMessage = $(this).data('val-required');
                var reqVal = $(this).val();
                if (reqVal === '') {
                    $(this).siblings('.help-block').removeClass('field-validation-valid').addClass('field-validation-error').show().text(errorMessage);
                    $(this).addClass('input-validation-error');
                } else {
                    $(this).siblings('.help-block').removeClass('field-validation-error').addClass('field-validation-valid').hide().text(errorMessage);
                    $(this).removeClass('input-validation-error');
                }
                XA.component.FormTracking.TrackValidationError('validation-error-frontend');
            });
        });
    };
    return api;
})(jQuery, document);
XA.register('componentForm', XA.component.componentForm);

/*  component-iframe  */
XA.component.zwpIframe = (function($) {
  var api = {};

  api.init = function() {
    Breakpoints();
	
	$('.sxa-iframe').each(function(){
    
		if (!Breakpoints.is('lg')) {
			$(this).attr("src", $(this).attr("data-iframesrc-xs"));
		}
		else {
			var xlUrl = $(this).attr("data-iframesrc-lg");
			if(xlUrl == "")
			{
				xlUrl = $(this).attr("data-iframesrc-xs");
			}
			$(this).attr("src", xlUrl);
		}
	});
			
  };
  

  return api;
})(jQuery, document);

XA.register('zwpIframe', XA.component.zwpIframe);

/*  component-link  */
XA.component.linkComponent = (function($) {
    var api=api || {};
  
    api.init = function() {
      $('.component-link').not('.link--cta').find('.icon').parent('div').addClass('with-icon');
    };
  
    return api;
  })(jQuery, document);
  
  XA.register('linkComponent', XA.component.linkComponent);
  

/*  component-menu  */
/* global XA, Breakpoints, $ */
// TODO: need to verify that slick will be always available
// TODO: check 'this.find'
XA.component.menus = (function($) {
  var api = {
    /**
     * Lanuage selector for desktop & mobile
     * - Toggles is-open class for show/hide
     * - Switches label text between viewports ("English" for desktop, "EN" for mobile)
     * - Handles dropdown close on click-away
     */
    initLanguageSelector: function() {
      var $langSelector = $('.mod.mod-language-selector');
      var $langLabel = $langSelector.find('span.lang');
      var $langTrigger = $('.mod-language-selector__trigger');
      var labelDesktop = $langLabel.text();

      Breakpoints();

      if (Breakpoints.is('xs')) {
        $langLabel.text('');
      }

      if (Breakpoints.is('xs') || Breakpoints.is('sm')) {
        $('a.mobile-nav-hide').parent().closest('li').remove();
      }

      // Switch language label text on viewport change
      $(window).resize(function() {
        if (Breakpoints.is('xs')) {
          $langLabel.text('');
        } else {
          $langLabel.text(labelDesktop);
        }
      });

      $langTrigger.click(function(e) {
        e.preventDefault();

        if (Breakpoints.is('xs') || Breakpoints.is('sm')) {
          $langSelector.toggleClass('is-open');
        } 
      });

      // Handles close dropdown on click-away
      $('body').on('click',function(event) {
        var $target = $(event.target);
        var clickedTrigger = $target.hasClass('mod-language-selector__trigger') || $target.parents('.mod-language-selector__trigger').length;

        if (!clickedTrigger) {
          $langSelector.removeClass('is-open');
        }
      });

      // Remove border if no languages available
      if ($langSelector.children().length < 1) {
        $('.dropdown-language-selector').css('border', 'none');
      }

      // Are we in Edit mode?
      var isEditMode = $('body').hasClass('on-page-editor');
      
      // Sub-navigation mobile: Find active anchor tag with deep search for all subnavs
      $('.sub-navigation').each(function() {
        var $links = $(this).find('li.active');
        var labelText = $(this).data('headline') || 'Subnavigation'; // fallback label

        $links.each(function() {
          var $anchor = $(this).find('a');
          if ($anchor && $anchor.length === 1) {
            labelText = $anchor.text();

            if (isEditMode) {
              var finalSpan = $anchor.find('span').last();

              if (finalSpan.length) {
                labelText = finalSpan.text();
              }
            }
          }
        });

        // Ensure deepest active link is highlighted (if has subnavs)
        $links.last().addClass('active-subnav-item');

        // Prepend mobile dropdown label
        $(this)
          .children('.component-content')
          .prepend('<div class="sub-navigation-label hidden-sm-up">' + labelText + '</div>');
      })

      // Sub-navigation - open / close on mobile
      $(document.body).on('click', '.sub-navigation-label', function() {
        $(this).closest('.sub-navigation').toggleClass('is-open');
      });
    }
  };

  api.init = function() {
    $('.mod-menu__trigger .mod-gadgetbar__btn').click(function() {
      var $menu = $(this)
        .parents('.mod-menu')
        .find('.mod-menu__menu');
      var wasActive = $menu.hasClass('is-open');
      // Close all other open menus
      $('.mod-menu__menu.is-open').removeClass('is-open');
      // If it wasn't open, add class
      if (!wasActive) {
        $menu.toggleClass('is-open');
      }
    });

    $('.js-print').on('click', function(event) {
      event.preventDefault();
      $('.mod-menu__menu.is-open').removeClass('is-open');
      setTimeout(function() {
        window.print();
      }, 200);
    });

    $(document).click(function (e) {    
      var gadgetHide = $('.mod-menu');    
      if (!gadgetHide.is(e.target) && gadgetHide.has(e.target).length === 0) {
        $('.mod-menu__menu.is-open').removeClass('is-open');
      }
    });

    this.api.initLanguageSelector();
  };
  return api;
})(jQuery, document);

XA.register('zwpMenus', XA.component.menus);


/*  component-navigation  */
/* global XA, $ */
/*eslint no-console: ["error", { allow: ["log"] }] */

XA.component.navigationDesktop = (function($) {
  var CLASS_STICKY_HEADER = 'header-is-sticky';
  var CLASS_NAVDRAW_OPEN = 'navdrawer-is-open';
  var CLASS_IS_SCROLLABLE_UP = 'is-scrollable--up';
  var CLASS_IS_SCROLLABLE_DOWN = 'is-scrollable--down';
  var STICKY_BREAKPOINT = 3;

  var api = {
    /**
     * Define all event handlers
     */
    eventHandlers: function() {
      var self = this;

      // Stick / unstick header on scroll
      $(window).bind('scroll', this.toggleStickyHeader);

      // Show / hide navdraw onclick
      $('.ham-nav').click(this.toggleNavdraw);

      // Reset navgroup scroll icons on window resize
      $(window).on('resize', function() {
        if ($(this).width() >= 992) { 
          self.resetNavGroupScrollButtons();
        }
      });
    },

    /**
     * On initial pageload, check for scrollTop and activate sticky nav if necessary
     */
    checkScrollOnPageload: function() {
      if ($(window).scrollTop() >= STICKY_BREAKPOINT) {
        $('html').addClass(CLASS_STICKY_HEADER);
      }
    },

    /**
     * Check scroll position of navgroups, hide / show scroll buttons if necessary
     */
    resetNavGroupScrollButtons: function() {
      var self = this;
      $('.main-nav .navigation-group').each(function() {
        self.onNavgroupScroll($(this));
      })
    },

    /**
     * Open / close navdrawer
     */
    toggleNavdraw: function() {
      if ($('html').hasClass(CLASS_NAVDRAW_OPEN)) {
        $('html').removeClass(CLASS_NAVDRAW_OPEN);
      } else {
        $('html').addClass(CLASS_NAVDRAW_OPEN);
      }
    },

    /**
     * Toggle sticky header on scroll
     */
    toggleStickyHeader: function() {
      if ($(window).scrollTop() > STICKY_BREAKPOINT) {
        $('html').addClass(CLASS_STICKY_HEADER);
      } else {
        $('html').removeClass(CLASS_STICKY_HEADER);
      }
    },

    /**
     * Generates 4 navdrawer columns & append nav links
     */
    initNavDrawer: function() {
      var self = this;

      // Generate navgroup columns
      for (var i = 0; i < 4; i++) {
        $('.main-nav nav > ul').append(
          $('<span></span>')
            .addClass('navigation-group group' + i)
            .scroll(function(e) {
              var $navGroup = $(e.target);
              self.onNavgroupScroll($navGroup);
            })
        );
      }

      // Collect top-level links and split into 4 arrays
      var $level1Links = $('.main-nav nav > ul li.rel-level1');
      var $level1linksChunked = this.splitArray($level1Links, 4);
      
      // Append top-level links to each navgroup
      // Append scroll top / bottom buttons to each navgroup
      $('span.navigation-group').each(function(j) {
        $(this).append(
          $('<li></li>')
            .addClass('nav-group-scroll btn-scroll-t')
            .click(self.onNavgroupScrollClick)
        );
        $(this).append($level1linksChunked[j]);
        $(this).append(
          $('<li></li>')
            .addClass('nav-group-scroll btn-scroll-b')
            .click(self.onNavgroupScrollClick)
        );
      });

      // Close all submenus
      $('.main-nav .submenu')
        .addClass('closed')
        .click(this.toggleSubmenu);

      // Move home icon 
      this.moveFirstQuicklink();
      
      // Ensure scrollbars are visible if needed after initialization complete
      this.resetNavGroupScrollButtons();

      // Open active links on page load
      this.openActiveLinks();
    },

    /**
     * On pageload, open all active submenus
     */
    openActiveLinks: function() {
      $('.navdrawer li.submenu.active').each(function() {
        $(this).removeClass('closed').addClass('opened');
      });
    },

    /**
     * Move first quicklink item (home link) to main nav > ul 
     */
    moveFirstQuicklink: function() {
      var $firstLink = $('#header > .quicklinks .link-list li:first-child a');
      
      $('.main-nav nav > ul').prepend(
        $('<li></li>')
          .addClass('level1 item0 odd first rel-level1 home-link')
          .append(
            $('<div></div>').addClass('navigation-title').append(
              $('<a></a>')
                .attr('href', $firstLink.attr('href'))
                .text($firstLink.text())
                .addClass('icon icon--house')
            )
          )
      );
    },

    /**
     * Open / Close submenu on click
     * @param {Event} e 
     */
    toggleSubmenu: function(e) {
      e.stopPropagation();
      var $submenu = $(e.target);
      var $parentSubmenus = $submenu.parents('.submenu');

      if ($(window).width() > 992) {
        if ($submenu.hasClass('level1')) {
          $('.navdrawer .submenu.level1').not(this).removeClass('opened').addClass('closed');
        }
  
        if ($submenu.hasClass('level2')) {
          $('.navdrawer .submenu').not(this, $parentSubmenus).removeClass('opened').addClass('closed');
        }
      }

      // Open / close target submenu
      if ($submenu.hasClass('closed')) {
        $submenu.removeClass('closed').addClass('opened');
      } else {
        $submenu.removeClass('opened').addClass('closed');
        $submenu.find('.submenu').removeClass('opened').addClass('closed');
      }
    },

    /**
     * Hides / shows "up / down" arrows on Navgroup scroll event
     * @param {HTMLElement} $navGroup 
     */
    onNavgroupScroll: function($navGroup) {
      var navGroupscrollTop = $navGroup.scrollTop();
      var navGroupScrollHeight = $navGroup[0].scrollHeight;
      var navGroupInnerHeight = $navGroup.innerHeight();
      var $btnScrollT = $navGroup.find('.btn-scroll-t');
      var $btnScrollB = $navGroup.find('.btn-scroll-b');

      if (navGroupscrollTop > 10) {
        $btnScrollT.addClass(CLASS_IS_SCROLLABLE_UP);
      } else {
        $btnScrollT.removeClass(CLASS_IS_SCROLLABLE_UP);
      }

      if (navGroupscrollTop + (navGroupInnerHeight + 10) >= navGroupScrollHeight) {
        $btnScrollB.removeClass(CLASS_IS_SCROLLABLE_DOWN);
      } else {
        $btnScrollB.addClass(CLASS_IS_SCROLLABLE_DOWN);
      }
    },

    /**
     * Handles Navgroup scroll "up / down" arrows click
     * @param {Event} e 
     */
    onNavgroupScrollClick: function(e) {
      var $navGroupScroller = $(e.target);
      var $navGroup = $navGroupScroller.parent('.navigation-group');
      var breakpoint = '+=250px';

      if ($navGroupScroller.hasClass(CLASS_IS_SCROLLABLE_UP)) {
        breakpoint = '-=250px';
      } 

      $navGroup.animate({ scrollTop: breakpoint }, 300);
    },

    /**
     * Splits given array into x chunks
     * @param {Array} arr 
     * @param {Number} chunkCount 
     */
    splitArray: function(arr, chunkCount) {
      var chunks = [];
      
      while(arr.length) {
        var chunkSize = Math.ceil(arr.length / chunkCount--);
        var chunk = arr.slice(0, chunkSize);
        chunks.push(chunk);
        arr = arr.slice(chunkSize);
      }
      return chunks;
    },

    /**
     * On page load, move link metadata (file size & type) inside link title
     * TODO: Activate component-link.js and move there
     */
    moveLinkFileMetadata: function() {
      $('.link .link-metadata').each(function() {
        $(this).siblings('.link-title').append($(this));
      });
    },

    /**
     * Initialise Sitemap component
     */
    initSitemap: function() {
      var $sitemap = $('.mod-sitemap');

      if (!$sitemap.length) {
        return; // only run if Sitemap exists on pageload
      }

      // Generate navgroup columns
      for (var i = 0; i < 4; i++) {
        $('nav', $sitemap).append($('<div></div>').addClass('sitemap-group group' + i));
      }

      var $level1Links = $('nav > ul.mod-sitemap__level-1', $sitemap)
      var $level1linksChunked = this.splitArray($level1Links, 4);

      $('div.sitemap-group').each(function(j) {
        $(this).append($level1linksChunked[j]);
      });

      $sitemap.addClass('initialized');
    } ,

    /**
     * Prepend header spacer on pageload
     */
    appendNavSpacer: function() {
      $('header').prepend(
        $('<div></div>').addClass('js-header-spacer')
      );
    },

    /**
     * Initialise pagination on pageload if necessary
     */
    initPagination: function() {
      var $pagination = $('.list-pagination');

      if (!$pagination.length) {
        return;
      }

      $pagination.each(function() {
        var totalPages = $('.component-content', this).attr('data-totalpages');
        var firstLink = $('nav', this).children('a').first().attr('href');
        var lastLink = $('nav', this).children('a').last().attr('href');
        var $moreButtons = $('nav', this).children('.more');

        // Append "of" mobile separator
        // Todo: Translate "of" label?
        $('nav > .active', this).after(
          $('<span></span>').addClass('list-pagination__mobile-separator').text('of')
        );
        
        if (!$moreButtons.length) {
          return;
        }
        
        $moreButtons.each(function() {
          if ($(this).index() === 2) {
            // "more" button previous
            $(this).before(
              $('<a>').addClass('sxa-paginationnumber').attr('href', firstLink).text('1')
            )
          } else {
            // "more" button next
            $(this).after(
              $('<a>').addClass('sxa-paginationnumber').attr('href', lastLink).text(totalPages)
            )
          }
        });
      });
    }
  };



  api.init = function() {
    this.api.eventHandlers();
    this.api.checkScrollOnPageload();
    this.api.initNavDrawer();
    this.api.moveLinkFileMetadata();
    this.api.initSitemap();
    this.api.appendNavSpacer();
    this.api.initPagination();
  };

  return api;
})(jQuery, document);

XA.register('zwp-navigationdesktop', XA.component.navigationDesktop);


/*  component-notification-teaser  */
XA.component.notificationTeaser = (function ($) {
  var api = {
    /*
    IE Notification 
    */
    isIE: function() {
      // Check the userAgent property of the window.navigator object
      var ua = window.navigator.userAgent;
      // IE 10 or older
      var msie = ua.indexOf("MSIE ");
      // IE 11
      var trident = ua.indexOf("Trident/");
      return msie > 0 || trident > 0;
    },
    /*
    Hide/Show IE notification
    */
    initIENotificationEvents: function() {
      // Hide IE notification In other browsers
      $("#js-ie-warning").hide(); 

      if (this.isIE()) {
        $("#js-ie-warning").show();

        $(".c-disclaimer__close").click(function () {
          $("#js-ie-warning").hide();
        });

        $(".c-disclaimer__button").click(function () {
          $("#js-ie-warning").hide();
        });
      }
    }

  };

  api.init = function () {
    $(".notification-teaser_body")
      .children()
      .not(".icon")
      .wrapAll('<div class="notification-content"></div>');

    var $teaser = $(".notification-teaser");
    $teaser.addClass("show-notification");

    $teaser.find(".close").click(function () {
      $teaser.css("display", "none");
    });

    if ($("#ntAutoHideAfter60Seconds").val() == 1) {
      setTimeout(function () {
        $teaser.css("display", "none");
      }, 60000);
    }

    function readCookie(name) {
      var nameCookie = name + "=";
      var cookieArray = document.cookie.split(";");
      var len = cookieArray.length;
      for (var i = 0; i < len; i++) {
        var notificationCookie = cookieArray[i];

        while (notificationCookie.charAt(0) == " ") {
          notificationCookie = notificationCookie.substring(
            1,
            notificationCookie.length
          );
        }

        if (notificationCookie.indexOf(nameCookie) == 0) {
          return notificationCookie.substring(
            nameCookie.length,
            notificationCookie.length
          );
        }
      }
      return null;
    }

    if (readCookie("notificationTeaserClosed") == "Yes") {
      $teaser.css("display", "none");
    }
    if ($("#ntHiddenAfterFirstVisit").val() == 1) {
      if (readCookie("notificationTeaserClosed") == "Yes") {
        $teaser.css("display", "none");
      }
      document.cookie = "notificationTeaserClosed=Yes";
    }

    if ($("#ntDisplayMessageAtPageBottom").val() == 1) {
      $teaser.addClass("notificationBottom");
    }

    if ($("#ntHideInMobile").val() == 1) {
      $teaser.addClass("hidden-xs");
    }
    this.api.initIENotificationEvents();
  };
  return api;
})(jQuery, document);

XA.register("notificationTeaser", XA.component.notificationTeaser);


/*  component-pdf-download  */
XA.component.pdfDownloadComponent = (function($) {

	var api = api || {
		initPdfDownloadSlider: function() {
			var self = this;

			function initPdfDownloadSliderSettings($pdfslide, noOfSliders) {
				$pdfslide.slick({
					slidesToShow: noOfSliders,
					slidesToScroll: noOfSliders,
					infinite: false,
					responsive: [{
						breakpoint: 767,
						settings: {
							slidesToShow: 1,
							slidesToScroll: 1,
							dots: true,
							arrows: false,
							centerMode: true
						}
					}]
				});
			}

			$('.pdf-download ul').each(function() {
				count = $(this).children('li');
				if (count.length == 1) {
					$(this).parents('.pdf-download').addClass('single');
					var $pdfslide = $('.pdf-download.single > .component-content > ul').last();
					initPdfDownloadSliderSettings($pdfslide, 1);
				} else if (count.length == 2) {
					$(this).parents('.pdf-download').addClass('two');
					var $pdfslide = $('.pdf-download.two > .component-content > ul').last();
					initPdfDownloadSliderSettings($pdfslide, 2);

				} else if (count.length == 3) {
					$(this).parents('.pdf-download').addClass('three');
					var $pdfslide = $('.pdf-download.three > .component-content > ul').last();
					initPdfDownloadSliderSettings($pdfslide, 3);
				} else if (count.length > 3) {
					$(this).parents('.pdf-download').addClass('multiple');
					var $pdfslide = $('.pdf-download.multiple > .component-content > ul').last();
					initPdfDownloadSliderSettings($pdfslide, 3);
				}
			});
		}

	};

	api.init = function() {
		this.api.initPdfDownloadSlider();
	};

	return api;
})(jQuery, document);

XA.register('pdfDownloadComponent', XA.component.pdfDownloadComponent);

/*  component-resultcount  */
XA.component.resultCount = (function($) {
    var api=api || {};
  
    api.init = function() {
      XA.component.search.vent.on("results-loaded", function () {
        $('.results-count').html(function(index, value) {
          return value.replace(/(\d+)/g, '<span>$1</span>');
        });
      })
    };
  
    return api;
  })(jQuery, document);
  
  XA.register('resultCount', XA.component.resultCount);
  

/*  component-richtext  */
XA.component.zwpComponentRichText = (function ($) {
    var api = api || {};

    //Checking for RTE under accordions to load more info button before api.init
    var richTextUnderAccordion=function(){
        let $showMoreDiv =$('.component.accordion .rich-text.show--more');
        addMoreInfo($showMoreDiv)
    }();

    api.init = function () {

        var $showMoreDiv = $('.rich-text.show--more');       
        var $maxHeight = '300px';
        addMoreInfo($showMoreDiv);
        
        $(".more--text").on('click', function (event) {  
            event.preventDefault();
            event.stopImmediatePropagation();
            if ($(this).parent().prev().hasClass("active")) {                
                $(this).removeClass("active");
                $(this).parent().prev().removeClass("active").css({
                    'height': $maxHeight                   
                });               
            } else {
                $(this).addClass("active");
                $(this).parent().prev().addClass("active").css({
                    'height': '100%'
                });
            }
        });

        /* Adding equalized Height  */
        var richTexts = $('.rich-text');
        $.each(richTexts, function () {
            var parentDiv = $(this).parent().parent();
            if ($(parentDiv).hasClass('column-splitter')) {
                $(this).addClass('rte-styles');
            }
        });
        function eqalHeight(parentColumns) {
            $.each(parentColumns, function () {
                if (!$(this).hasClass('show--more') && $(this).hasClass('bg-height')) {
                    $(this).parent().css('flex-direction', 'column');
                    $(this).parent().addClass('d-flex d-md-flex d-lg-flex'); 
                }
            });
        }
        var columnSplitter = $('.column-splitter').find('.rte-styles');
        $.each(columnSplitter, function () {
            eqalHeight(columnSplitter);
        });
    };
    function addMoreInfo($showMoreDiv)
        {
            var $defaultHeight = 300;
            var $maxHeight = '300px';

            $.each($showMoreDiv, function () {           
            $richTextContent = $(this).find('.component-content');
            if ($richTextContent.height() > $defaultHeight) {
                /* added button dynamically as we are not rendering button from varient */
                /* In Experience Editor view script is hitting two times, hence added condition to not show button twice */
                if ($(this).find('.more--text').length == 0) {
                    $('<div style="text-align:center"><button class="more--text"><span></span></button></div>').insertAfter($richTextContent);
                }
                $richTextContent.css('height', $maxHeight);              
            }
            else {
                /* height is removed when rich text hight is less than 300px*/
                /* If More button exists then showing show--more button this condition added for EE view */
                if ($(this).find('.more--text').length == 0) {
                    $richTextContent.parent().removeClass("show--more");
                }
            }
        })
        }
	var breakers = $('.breaker');
    var breakerHeight;
        $.each(breakers, function () {
            var isRichText = $(this).nextAll('.component:first').hasClass('rich-text'); 
            if (!isRichText){
                jQuery(this).removeClass('breaker-left breaker-right');
                return;
            }
            else{
                $(this).nextAll('.component:first').find('span.scWebEditInput').css('display', 'inline');
            }        
            if (isRichText && ($(this).height() > $(this).nextAll('.component:first').height())) {
                breakerHeight = $(this).height() + 10;
                $(this).nextAll('.component:first').css({'height': breakerHeight, 'margin-bottom': '30px'});
                $(this).css({'padding-bottom':'5px'});
            }           
        })

    return api;
})(jQuery, document);

XA.register('zwpComponentRichText', XA.component.zwpComponentRichText);

/*  component-routing-tool  */
XA.component.componentRoutingTool = (function ($) {
  var api = api || {};
  api.init = function () { 

      $('.routing-tool select')
      .css('width', '100%')
      .select2({
        minimumResultsForSearch: Infinity, 
        placeholder: '',
        dropdownParent: $('#wrapper')
      });

      function load_json_data(utype, $form) {
          var optionsList;
          var jsonPath = $form.find('.login-url').attr('data-jsonurl');
          var $level1Dropdown = $form.find('.level1_dropdown');
          var $level2Dropdown = $form.find('.level2_dropdown');

          $.getJSON(jsonPath, function (data) {  
              optionsList += '<option></option>';
              if (utype == 'level1_dropdown') {
                  $.each(data, function (key, value) { 
                      optionsList += '<option value="' + key + '">' + value.name + '</option>';
                  });
              } else if (utype === 'level2_dropdown') {
                  var level2List = data[$level1Dropdown.val()]['list'];
                  $.each(level2List, function (key, value) {
                      optionsList += '<option value="' + key + '">' + value.name + '</option>';
                  });
              } else if (utype === 'level3_dropdown') {
                  var level3List = data[$level1Dropdown.val()]['list'][$level2Dropdown.val()]['list']; 
                  $.each(level3List, function (key, value) { 
                      optionsList += '<option value="' + value.url + '">' + value.name + '</option>';
                  });
              }
              $form.find('.' + utype).html(optionsList);
          });            
      } 
      $(document).ready(function () { 
        var $forms = $('.routing-tool form.mod-form');

        $forms.each(function(i) {
          load_json_data('level1_dropdown', $(this)); 
        });

        $('.level2_dropdown, .level3_dropdown').prop('disabled', true);
      });      
      $(document).on('change', '.level1_dropdown', function (e) {
        var $form = $(this).closest('form');
        var $level3Type = $form.find('.level3_dropdown');
        var $level2Dropdown = $form.find('.level2_dropdown');

        
        $level3Type.removeClass('is-not-empty').html('');
        load_json_data('level2_dropdown', $form);
        $level2Dropdown.prop('disabled', false);
        $level3Type.prop('disabled', true);
        if ($(this).val() !== '') {
          $(this).addClass('is-not-empty');
        }
      });

      $(document).on('change', '.level2_dropdown', function (e) {
        var $form = $(this).closest('form');
        var $level3Type = $form.find('.level3_dropdown');

        $level3Type.removeClass('is-not-empty').html('');
        load_json_data('level3_dropdown', $form);
        $level3Type.prop('disabled', false);
        if ($(this).val() !== '') {
          $(this).addClass('is-not-empty');
        }
      });
      $(document).on('change', '.level3_dropdown', function (e) {
        var $form = $(this).closest('form');
        $form.find('.login-url').attr('href', e.target.value);
        if ($(this).val() !== '') {
          $(this).addClass('is-not-empty');
        }
      });
  };
  return api;
})(jQuery, document);
XA.register('componentRoutingTool', XA.component.componentRoutingTool);

/*  component-select  */
XA.component.formSelect = (function($) {
  var api = {
    /**
     * Initialise header search box
     * - moves search button inside typehead wrapper
     * - toggles active search input on click
     */
    initHeaderSearchbox: function() {
      var $searchButton = $('header .search-box-button, header .search-box-button-with-redirect');
      var $header = $('#header');

      // Toggle active search input on click
      $('header .search-box label').click(function() {
        var $searchBox = $(this).closest('.search-box');
        if ($searchBox.hasClass('is-active')) {
          $searchBox.removeClass('is-active');
          $searchBox.find('.search-box-input').val('');
          $header.removeClass('search-is-open');
        } else {
          $searchBox.addClass('is-active');
          $searchBox.find('.tt-input').focus();
          $header.addClass('search-is-open');
        }
      }); 
      
      // Move search button on page load
      if ($searchButton.length) {
        $searchButton.each(function() {
          $(this).siblings('.twitter-typeahead').append($(this));
        });
      }
    },

    /**
     * Generate Select2 labels for facet-dropdowns 
     * - Assigns unique IDs and labels to each dropdown select (fixes issue with Select2)
     * - prevent re-execution in edit-mode 
     */
    setDropdownLabels: function() {
      var $select = $('.facet-dropdown-select');

      $select.each(function(i) {
        if ($(this).hasClass('facet-dropdown-initialized')) {
          return; // Make sure to not run twice
        }
        
        // Assign ID
        var idx = i + 1;
        $(this).attr('id', $(this).attr('id') + idx);
        
        // Assign label
        var $title = $(this).parents('.facet-dropdown').find('.facet-title');

        if ($title.length) {
          var labelText = $title.text().trim();
          var $label = $('<label>' + labelText + '</label>')
            .addClass('textfield__label')
            .attr('for', 'select2');

          $label.insertAfter($(this));
        }

        $(this).addClass('facet-dropdown-initialized');
      });
    },

    setDropdowns: function() {
      api.setDropdownLabels();

      $('.facet-dropdown-select')
        .css('width', '100%')
        .select2({
          minimumResultsForSearch: Infinity,
          dropdownParent: $('#wrapper')
        });
    }
  };

  api.init = function() {
    
    api.setDropdowns();

    // Handles input focus on search box
    $('.textfield--float-label input').on('focus', function(e) {
      e.preventDefault();
      $(this).closest('.textfield--float-label').find('label').addClass('is-active');
    })

    $('.textfield--float-label input').on('focusout', function(e) {
      e.preventDefault();
      if ($(this).val() === '') {
        $(this).closest('.textfield--float-label').find('label').removeClass('is-active');
      }
    });

    api.initHeaderSearchbox();
  };

  return api;
})(jQuery, document);

XA.register('formSelect', XA.component.formSelect);


/*  component-sitecore-forms  */
XA.component.componentSitecoreForm = (function ($) {
  var api = {
    $scFormComponents: $('.sitecore-form'),
    placeholderFieldTypes:
      'input[type="text"], input[type="password"], input[type="email"], input[type="tel"], input[type="number"], textarea',
    fileUploadFields: 'input[type="file"]',
  };

  /**
   * Executed on pageload by SXA
   */
  api.init = function () {
    initSitecoreForms();
  };

  /**
   * Process all SC form instances on pageload
   */
  initSitecoreForms = function () {
    api.$scFormComponents.each(function () {
      var $form = $(this);

      // Initialize form (single & multipage)
      initSitecoreForm($form);

      // MultiPage form change
      // - detect form page change (new form is appended via Ajax response on change-page)
      $form.on('DOMNodeInserted', function (e) {

        // We detect the change on the main form wrapper element only
        if ($(e.target).attr('data-track-levelcontent')) {

          // reinitialize form elements (labels, dropdowns, datepickers etc)
          initSitecoreForm($form);
        }
      });
    });
  };


  /**
   * Init form inputs by type
   */
  initSitecoreForm = function ($form) {
    setFloatingLabelFields($form);
    setFileUploadFields($form);
    setSelectFields($form);
    setReachingNewformStepForMultiStep($form);
  };

 setReachingNewformStepForMultiStep = function ($form) {
  var isMultiStepForm = $form.find('.formpagestep');
  var hasStepInitiated = isMultiStepForm.hasClass('stepinitiated');
  if (isMultiStepForm.length > 0 && hasStepInitiated == false) {
   isMultiStepForm.addClass('stepinitiated');
   XA.component.SCFormTracking.TrackReachingNewFormStep($form);
  }
  listboxMultipleSelectionIcon($form);
 };

 /**
  * Set Icon for multiSelection Listbox
  */
 listboxMultipleSelectionIcon = function ($form) {
  var multiSelect = document.querySelector('.listbox .ss-multi-selected');
  if (multiSelect != null) {
   var createElement = document.createElement('span');
   createElement.classList.add('ss-arrow');
   var createIcon = document.createElement('span');
   createIcon.classList.add('arrow-down');
   createElement.appendChild(createIcon);
   multiSelect.appendChild(createElement);
   multiSelect.parentElement.previousSibling.slim.afterOpen = function (e) {
    if (this.config.isMultiple && this.slim.multiSelected) {
     this.slim.multiSelected.container.querySelector('.' + this.config.arrow).children[0].classList.remove('arrow-down');
     this.slim.multiSelected.container.querySelector('.' + this.config.arrow).children[0].classList.add('arrow-up');
    }
   }
   multiSelect.parentElement.previousSibling.slim.afterClose = function (e) {
    if (this.config.isMultiple && this.slim.multiSelected) {
     this.slim.multiSelected.container.querySelector('.' + this.config.arrow).children[0].classList.remove('arrow-up');
     this.slim.multiSelected.container.querySelector('.' + this.config.arrow).children[0].classList.add('arrow-down');
    }
   }
  }
 };

  /**
   * Set floating label animation events 
   * Init datepicker inputs if found
   */
  setFloatingLabelFields = function ($form) {
    var $inputs = $form.find(api.placeholderFieldTypes);

    $inputs.each(function () {
      var placeholder = $(this).attr('placeholder');

      if ((placeholder && placeholder.length) || $(this).val().length > 0) {
        activateLabel($form, $(this), true);
      }

      if ($(this).parent().hasClass('date-picker')) {
        initDatePicker(this);
      }

      $(this)
        .on('focus', function () {
          activateLabel($form, $(this), true);
        })
        .on('focusout', function () {
          var placeholder = $(this).attr('placeholder');

          if ($(this).val().length == 0 && !placeholder) {
            activateLabel($form, $(this), false);
          }
        });
    });
  };

  /**
   * Set file upload CTA button, events & labels
   */
  setFileUploadFields = function ($form) {
    var $inputs = $form.find('input[type="file"]');

    $inputs.each(function () {
      var $label = $(this).siblings('label');
      var selectFileTxt = $label.attr('data-select-file'); // "Select file"
      var noFileSelectedTxt = $label.attr('data-no-file-selected'); // "No file selected"

      // Prepend CTA button and labels in place of default file-upload CTA
      if (!$(this).prevAll().hasClass('btn')) {
        var $btn = $('<a></a>')
          .addClass('btn')
          .text(selectFileTxt)
          .click(function () {
            $(this).parent().find('input').trigger('click');
          });

        // Prepend selection labels
        var $selectionLabel = $('<span></span>')
          .addClass('filename-label')
          .text(noFileSelectedTxt);

        $(this).parent().prepend($btn, $selectionLabel);
      }

      if ($(this).is('[multiple]') && $(this).parent().hasClass('file-upload-multiple')) {
        initMultiFileUpload($(this));
      } else {
        $(this).on('change', function (e) {
          handleFileSelectEvent(e, $(this))
        });
      }
    });
  };

  initMultiFileUpload = function ($input) {
    var storedFiles = [];

    $input.on("change", function (e) {
      if (e.target.files.length == 0) {
        return false;
      }
      if (!e.originalEvent.silent) {
        addFiles(e.target.files, $(this));
      }
      e.originalEvent.silent = true;
    });

    $input.parent().on("click", ".remove-file", function (e) {
      removeFile(e);
    });

    function addFiles(files, $input) {
      Array.prototype.slice.call(files).forEach(function (f) {
        storedFiles.push(f);
      });

      updateFileLabels($input);
      updateInputFiles($input);
    }

    function removeFile(e) {
      var file = $(e.target).data("file");
      var $input = $(e.target).closest('.filename-label').siblings('input[type="file"][multiple]');

      for (var i = 0; i < storedFiles.length; i++) {
        if (storedFiles[i].name === file) {
          storedFiles.splice(i, 1);
          break;
        }
      }

      updateFileLabels($input);
      updateInputFiles($input);
    }

    function updateFileLabels($input) {
      var filenameLabel = $input.parent().find('.filename-label');
      filenameLabel.empty();

      if (storedFiles.length === 0) {
        filenameLabel.text($input.siblings('label').attr('data-no-file-selected'));
      } else {
        storedFiles.forEach(function (f) {
          var html = "<div>" + f.name + "<span data-file='" + f.name + "' class='remove-file'></span></div>";
          filenameLabel.append(html);
        });
      }

    }

    function updateInputFiles($input) {
      var emptyFileList = new DataTransfer();
      for (var i = 0; i < storedFiles.length; i++) {
        emptyFileList.items.add(storedFiles[i]);
      }
      var newFileList = emptyFileList.files;
      $input.get(0).files = newFileList;


      var evt = document.createEvent("HTMLEvents");
      evt.initEvent("change", false, true);
      evt.silent = true;
      $input.get(0).dispatchEvent(evt);
    }

  };


  /**
   * On file selection, update input labels
   * Handles remove file
   */
  handleFileSelectEvent = function (e, $input) {
    var noFileSelectedTxt = $input.siblings('label').attr('data-no-file-selected');

    if (e.target.files.length > 0) {
      $input
        .parent()
        .find('.filename-label')
        .text(e.target.files[0].name)
        .addClass('has-file')
        .append(
          $('<span></span>')
            .addClass('filename-label-cancel')
            .click(function () {
              $(this)
                .parent()
                .text(noFileSelectedTxt)
                .removeClass('has-file');
              $(this).remove();
              $input.val(null);
            })
        );
    } else {
      $input
        .parent()
        .find('.filename-label')
        .text(noFileSelectedTxt)
        .removeClass('has-file');
    }
  };

  /**
   * Set active/inactive label for given input ID
   */
  activateLabel = function ($form, $element, activate) {
    var $label = $('label[for="' + $element.attr('id') + '"]', $form);

    if (activate) {
      $label.addClass('is-active');
    } else {
      $label.removeClass('is-active');
    }
  };

  /**
   * Init Datepicker & apply following rules if specified:
   * See: https://mymth.github.io/vanillajs-datepicker/
   * 
   * - data-val-timespan-min="1" => Will allow only past dates
   * - data-val-timespan-max="1" => Will allow only future dates
   * - data-val-timespan-min="18" => Minimum date should be based on data-val-timespan-min value} $input
   */
  initDatePicker = function (input) {
    var $input = $(input);
    var minDate = $input.attr('min');
    var maxDate = $input.attr('max');

    // Disable manual input on datepicker 
    // NOTE: setting "disabled" attribute breaks the datepicker, so this is a working alternative
	//Note : Manual input is disabled for Future Date validator and Past Date Validator otherwise enabled
    $input.on('change keyup input',function() { 
	 var isFutureDateField = $input.data('val-timespan-max');
	 var isPastDateField = $input.data('val-tspastdate-min');
	 if((isFutureDateField != undefined && isFutureDateField == 1) || (isPastDateField != undefined && isPastDateField == 1))
	 {
		$(this).val('');
   }});
	
	
	
	
    // This pastDatesOnly condition needs to be removed once we fix the validation issue
    var pastDatesOnly = $input.data('val-timespan-min') != undefined ? $input.data('val-timespan-min') : $input.data('val-tspastdate');
    var futureDatesOnly = $input.data('val-timespan-max');
    var notAllowTodayDateInDatePicker = $input.data('notallow-todaydate');

    var datepickerConfig = {
      format: $input.attr('data-date-format'),
      todayHighlight: true,
      autohide: true,
      orientation: 'bottom left',
      disableTouchKeyboard: true,
        language: $('html').attr('lang'),
    }

    if ((minDate && minDate.length) || futureDatesOnly) {
      var startDate =
        minDate && minDate.length ? new Date(minDate) : notAllowTodayDateInDatePicker === 'True' ? new Date(Date.now() + (3600 * 1000 * 24)) : new Date();
      datepickerConfig['minDate'] = startDate;
    }

    if ((maxDate && maxDate.length) || pastDatesOnly) {
      var endDate = maxDate && maxDate.length ? new Date(maxDate) : notAllowTodayDateInDatePicker === 'True' ? new Date(Date.now() - (24 * 60 * 60 * 1000)) : new Date();
      datepickerConfig['maxDate'] = endDate;
    }

    // 18-year age limit
    if (pastDatesOnly > 1) {
      var dateMinusYears = new Date();
      dateMinusYears.setFullYear(dateMinusYears.getFullYear() - pastDatesOnly);
      datepickerConfig['maxDate'] = dateMinusYears;
    }

    var datepicker = new Datepicker(input, datepickerConfig);
  };

  /**
   * Process select inputs with Select2 
   * Handles error message on change
   */
  setSelectFields = function ($form) {
    var $selects = $form.find('select');

    $selects.each(function() {
      var $label = $(this).siblings('label');
      $label.addClass('is-active');

      this.slimSelect = new SlimSelect({
        select: this,
        showSearch: false,
        onChange: function(info) {
          if (info.value) {
            $label.addClass('is-active');
          }
        }
      });
    })

    // $selects.each(function () {
    //   $(this).siblings('label').addClass('is-active');

    //   // Initialize select2 on select element
    //   $(this)
    //     .css('width', '100%')
    //     .select2({ minimumResultsForSearch: Infinity });

    //   // Remove error-message updates on change if necessary
    //   $(this).on('change', function () {
    //     var removeError = false;
    //     var $wrapper = $(this).parent('.sc-form-group');
    //     var $multiSelect = $wrapper.find('.select2-container .select2-selection--multiple');

    //     if ($multiSelect.length) {
    //       // check if multiselect dropdown has selected values
    //       var selectedCount = $('ul > li', $multiSelect).length;

    //       if (selectedCount > 0) {
    //         removeError = true;
    //       }
    //     } else {
    //       // check if single-select dropdown has selected value
    //       if ($('.select2-container .select2-selection__rendered', $wrapper).attr('title').length) {
    //         removeError = true;
    //       }
    //     }

    //     // Remove error message & class if valid
    //     if (removeError) {
    //       $wrapper
    //         .removeClass('has-error')
    //         .find('.field-validation-valid, .field-validation-error')
    //         .empty();
    //     }
    //   });
    // });
  }

  return api;
})(jQuery, document);
XA.register('componentSitecoreForm', XA.component.componentSitecoreForm);


/*  component-socialmedia-share  */
XA.component.socialMediaShare = (function($) {
  var api = {
    initInstance: function() {
      this.$button = $('<div/>').addClass('mod-share-bar__button-expand');
      var $icon = $('<span />').addClass('icon icon--expand');
      $icon.appendTo(this.$button);
      this.$component_inner.append(this.$button);
      this.$button.on('click', api.toggleButton.bind(this));
      $(window).resize(this.onWindowResize.bind(this));
      // Manual trigger to show/hide button on page load
      this.onWindowResize();
    },

    toggleButton: function(event) {
      event.preventDefault();
      this.$component.toggleClass('is-expanded');
    },

    getBarWidth: function() {
      // Initial width + padding
      var barWidth =
        parseInt(this.$component.css('paddingLeft')) +
        parseInt(this.$component.css('paddingRight'));
      this.$component.find('.mod-share-bar__bar-item').each(function() {
        barWidth += $(this).width();
      });

      return barWidth;
    },

    expander: function(show) {
      if (show == true) {
        this.$component_inner.addClass('has-opener');
        this.$button.show();
      } else {
        this.$component_inner.removeClass('has-opener');
        this.$button.hide();
      }
    },

    onWindowResize: function() {
      var barWidth = this.getBarWidth(),
        ulWidth = this.$component_inner.width();

      if (ulWidth < barWidth) this.expander(true);
      else this.expander(false);
    }
  };

  api.init = function() {
    this.api.$component = $('.mod-share-bar');
    this.api.$component_inner = $('.mod-share-bar__inner', this.api.$component);
    this.api.initInstance();
  };
  return api;
})(jQuery, document);

XA.register('socialMediaShare', XA.component.socialMediaShare);


/*  component-stage-slider  */
/* global XA, Galleria, $ */
/* global XA, Breakpoints, $ */
/*eslint no-console: ["error", { allow: ["log"] }] */

// Inject values in the gallery slider component's properties
var prepareStageSlider = (function ($) {
    var api = {};
    api.process = function () {
        $('.component.gallery:not(.properties-added)').each(function () {
            var props = $(this).data('properties');
            // These two flags will force the caption to always be visible
            props.showInfo = true;
            props._toggleInfo = false;
            props.wait = true;
            props.autoplay = 4000;
            $(this)
                .data('properties', props) // Inject properties
                .addClass('properties-added'); // Add class to not process this gallery again

            var $downloadButton = $('<a />')
                .addClass('download-button')
                .attr('href', '#');
            var $downloadIcon = $('<span />').addClass('icon icon--download');

            $downloadIcon.appendTo($downloadButton);

            $(this).append($downloadButton);
        });        
    };
    return api;
})(jQuery);


// DOM manipulation needs to happen before the
// XA API initializes the component
XA.registerOnPreInitHandler(prepareStageSlider);

(function ($) {
    // Initialise Breakpoints library
    Breakpoints();

    // Disable image link if not set
    $('.component.image a').click(function (e) {
        if (!$(this).attr('href')) {
            e.preventDefault();
        }
    });

    // Toggle size-xs / size-xl image src on resize
    function checkSliderImage() {
        var $imgs = $('.slide img');

        $.each($imgs, function () {
            var src = $(this).data('size-' + (Breakpoints.is('xs') ? 'xs' : 'xl'));
            $(this).attr('src', src);
			var alt = $(this).data('alt-' + (Breakpoints.is('xs') ? 'xs' : 'xl'));
            $(this).attr('alt', alt);
        });

        var $imghashs = $('img[data-imagehash]');
        var $currentBreakPoint = Breakpoints.current().name;

        //When site open in XL devices default image to load
        if ($currentBreakPoint == 'lg') {
            if ($(window).width() > 1899) {
                $currentBreakPoint = 'xl';
            }
        }

        $.each($imghashs, function () {
            var src = $(this).data('size-' + $currentBreakPoint);
            if (src == undefined) {
                var src = $(this).data('size-lg');
            }

            $(this).attr('src', src);
        });

        //All srcset images are SXA rendervariantfield images
        var $srcSetImages = $('img[srcset]');

        if ($srcSetImages.length > 0) {
            $.each($srcSetImages, function () {
                var $srcSet = $(this).attr('srcset');
                var $srcsetUrls = $srcSet.split(',');

                switch ($currentBreakPoint) {
                    case 'xs':
                        $(this).attr('src', $srcsetUrls[0].split(' ')[0]);
                        break;
                    case 'sm':
                        $(this).attr('src', $srcsetUrls[1].split(' ')[0]);
                        break;
                    case 'md':
                        $(this).attr('src', $srcsetUrls[2].split(' ')[0]);
                        break;
                    case 'lg':
                        $(this).attr('src', $srcsetUrls[3].split(' ')[0]);
                        break;
                }
            });
        }
    }

    // Get gallery container height based on current breakpoint
    function getContainerHeight() {
        switch (true) {
            case (Breakpoints.is('xs') || Breakpoints.is('sm')):
                return 65;
            case Breakpoints.is('md'):
                return 90;
            default:
                return 100; // > md
        }
    }

    // Call on initial load
    checkSliderImage();

    // Call on viewport size change
    $(window).resize(checkSliderImage);

    // Galleria plugin event handlers
    Galleria.on('image', function (e) {
        var ID = '#' + this._target.id;
        var $containerWrapper = $(ID);
        var $container = $(ID + ' > .galleria-container'); 
        
        var $downloadLink = $containerWrapper
            .parent()
            .parent()
            .find('a.download-button');

        if ($downloadLink.length > 0) {
            $downloadLink
                .attr('href', e.imageTarget.src)
                .attr('download', e.imageTarget.src);
        }

        var containerOffset = 70;
        var containerWrapperOffset = getContainerHeight();
        var VERTICAL_MARGIN = 60;
        var LEFT_MARGIN = 10;

        $container.height(e.imageTarget.height + containerOffset);
        $containerWrapper.height(e.imageTarget.height + containerWrapperOffset);

        // Reposition caption
        $(ID + ' .galleria-info').css({            
            bottom: VERTICAL_MARGIN,
            left: LEFT_MARGIN,
            top: 'initial',
            width: e.imageTarget.width
        });
    });

    Galleria.ready(function () {
        var gallery = this;
        $(window).resize(function () {
            gallery.next();
        });
        $('.component.gallery.properties-added').each(function () {
            $('.galleria-container').prepend($('.galleria-image-nav'));
        });
        $(window).on('resize',function(){location.reload();});
    });  
})(jQuery);


XA.component.carouselBackground = (function ($) {
    var api = api || {};
    api.init = function () {
        if ($('.component.carousel').length) {
            var checkExistCarouselImg = setInterval(function () {
                $('.component.carousel').each(function () {
                    if ($('.slides img', this).innerHeight()) {
                        var height = $('.slides', this).innerHeight() + 5;
                        $(this).css('background-size', '100% ' + height + 'px');
                        clearInterval(checkExistCarouselImg);
                    }
                });
            }, 100)
        }
    };
    return api;
})(jQuery, document);
XA.register('carouselBackground', XA.component.carouselBackground);

/*  component-sticky-tabs  */
XA.component.componentStickyTabs = (function($) {

  var api = {
    initStickTabs: function initStickTabs() {
      var $stickyTabs = $('.sticky-tabs');

      // No sticky tabs found on page, exit function
      if (!$stickyTabs.length) {
        return;
      }

      var $tabInner = $stickyTabs.find('.tabs-inner.tabs-inner--desktop');
      var $tabHeading = $tabInner.find('.tabs-heading');
      var $tabsContainer = $tabInner.find('.tabs-container');

      // Disable sticky functionality when in editor
      if ($('body').hasClass('on-page-editor')) {
        $tabInner.addClass('unstick');
        return;
      }

      // Reset tabs headers to active (overrides Sitecore)
      $tabHeading.children('li').each(function() {
        $(this).removeClass('active');
      });

      // Close sticky tab on click away
      $(document).mouseup(function(e) {
        if (!$stickyTabs.is(e.target) && $stickyTabs.has(e.target).length === 0) {
          hideTabs();
        }
      });

      // Stick / unstick tabs on scroll - toggles tab 'active' state accordingly
      $(window).on('resize scroll', function() {
        var elementTop = $stickyTabs.offset().top;
        var elementBottom = elementTop + $stickyTabs.outerHeight();
        var viewportTop = $(window).scrollTop();
        var viewportBottom = viewportTop + $(window).height();

        // Checks to avoid excessive dom manipulation onScroll.
        if (elementBottom > viewportTop && elementTop < viewportBottom) {
          var openTabIdx = findActiveTabIndex();
          if (!$tabInner.hasClass('unstick')) {            
            $tabHeading.find('li').eq(openTabIdx).addClass('active');
            $tabInner.addClass('unstick').height($tabsContainer.outerHeight() + $tabHeading.outerHeight());
          }
        } else {
          if ($tabInner.hasClass('unstick')) {
            $tabInner.removeClass('unstick');
            $tabHeading.find('li').eq(openTabIdx).removeClass('active');
          }
        }
      });

      // When sticky, handle tab-wrapper slide up / down
      $tabHeading.find('li').click(function() {
        $tabInner.removeAttr('style');
        $tabInner.removeClass('is-open');
        if ($tabInner.hasClass('unstick')) {
          return;
        }

        if (!$(this).hasClass('sticky-tab-active')) {
          $(this).addClass('sticky-tab-active').siblings().removeClass('sticky-tab-active');
        } else {
          $(this).removeClass('sticky-tab-active');
          hideTabs();
          return;
        }

        if (!$tabInner.hasClass('is-open')) {
          $tabInner.addClass('is-open');
          if ($tabInner.hasClass('is-open')) {
            $('html').addClass('has-sticky-tab-open');
            $('body').addClass('no-scroll'); 
            $tabInner.height($tabsContainer.outerHeight());
          }
        } 
      });
    },
    initStickTabsMobile: function initStickTabsMobile() {
      var $tabsInnerMobile = $('.sticky-tabs .tabs-inner--mobile, .sticky-tabs .tabs-inner--desktop');

      if (!$tabsInnerMobile.length) {
        return;
      }

      var $stickyTabItems = $tabsInnerMobile.find('li[data-tab-index]');

      $stickyTabItems.each(subscribeOnClickMobile($stickyTabItems));
      subscribeOnPageScrollMobile($tabsInnerMobile);
    },
    /**
     * Tabs mobile: Dropdown init and event handling
     */
    initTabsMobile: function initTabsMobile() {
      // Are we in Edit mode?
      var isEditMode = $('body').hasClass('on-page-editor');

      var $tabDropdown = $('.bootstrap-select.tabs-select');
      if (!$tabDropdown.length) {
        return; // Exit if no tabs found
      }

      $('.bootstrap-select.tabs-select').each(function() {
        var _self = this;

        // Ensure first option is active
        var $firstOption = $(this).find('.selectpicker li').eq(0);

        // Get label for first option 
        $firstOptionText = !isEditMode 
          ? $firstOption.find('.field-heading').text()
          : $firstOption.find('.field-heading .scWebEditInput').text();

        $firstOption.find('.field-heading').addClass('active');

        // Fill default option with active tab label
        if ($firstOptionText) {
          setSelectedDropdownLabel($firstOptionText, this);
        }

        $(this).click(function() {
          $(this).toggleClass('is-open');
        });

        // Handles tab-change on mobile with dropdown
        $(this).find('.selectpicker li').click(function() {
          var idx = $(this).index();
          var text = $(this).find('.field-heading').text();

          var $tabsSelect = $(this).closest('.tabs').find('.tabs-select');
          
          $tabsSelect.find('.selectpicker .field-heading').removeClass('active');
          $(this).find('.field-heading').addClass('active');
          setSelectedDropdownLabel(text, _self);

          var $tabs = $(this).closest('.tabs').find('.tabs-container .tab');
          var $tabHeading = $(this).closest('.tabs').find('.tabs-heading li');
          $tabHeading.removeClass('active');
          $tabHeading.eq(idx).addClass('active');

          $tabs.removeClass('active');
          $tabs.eq(idx).addClass('active');
        });
      });

      // Add selected tab label to dropdown on desktop click
      $('.tabs-heading > li').click(function() {
        var idx = $(this).index();

        var tabLabel = !isEditMode 
          ? $(this).find('.field-heading').text()
          : $(this).find('.field-heading .scWebEditInput').text();

        var $dropdown = $(this).closest('.tabs').find('.bootstrap-select.tabs-select');
        $dropdown.find('.selectpicker .field-heading').removeClass('active');
        $dropdown.find('.selectpicker li').eq(idx).find('.field-heading').addClass('active');
        setSelectedDropdownLabel(tabLabel, $dropdown);
      });
    },

    initInvertedTabs: function initInvertedTabs() {
      var $tabsInverted = $('.tabs-inverted');

      if (!$tabsInverted.length) {
        return;
      }

      $tabsInverted.find('.tabs-container').append('<div class="arrow prev"></div><div class="arrow next"></div>');
      
      $(document).on('click', '.tabs-container .arrow' , function() {
        var isNext = $(this).hasClass('next');
        var $tabs = $(this).closest('.tabs-inner').find('.tabs-heading li');
        var $activeTab = $tabs.filter('.active');
        var idx = $activeTab.index();
        var targetIdx = 0;

        if (isNext) {
          if (!$activeTab.is(':last-child')) {
            targetIdx = idx + 1;
          } 
        } else {
          if ($activeTab.is(':first-child')) {
            targetIdx = $tabs.length - 1;
          } else {
            targetIdx = idx - 1;
          }
        }

        $tabs.eq(targetIdx).click();
      });
    },
    init: function init() {
      this.api.initTabsMobile();
      this.api.initInvertedTabs();
      var initStickTabs, initStickTabsMobile;

      initStickTabs = this.api ? this.api.initStickTabs : this.initStickTabs;
      initStickTabsMobile = this.api ? this.api.initStickTabsMobile : this.initStickTabsMobile; 

      if (typeof initStickTabs === 'function' && typeof initStickTabsMobile === 'function') {
        initStickTabs();
        initStickTabsMobile();
      }
    }
  };

  /// helpers implementation

  function subscribeOnClickMobile($allMobileStickyTabItems) {
    return function callbackfunction (idx, tabClicked) {
      $(tabClicked).on('click', function onMobileStickyTabClick() {
        if (isUnsticked(tabClicked)) {
          var wasActive = $(tabClicked).hasClass('active');

          removeActiveClass($allMobileStickyTabItems);

          if (!wasActive) {
            $(tabClicked).addClass('active');
          } else {
            $(tabClicked).removeClass('active');
          }
        }
        
        // This needs to be uncommented when mobile stickytabs is implemented
        // scrollToStickyTab(tabClicked);

      });
    };
  }

  function setSelectedDropdownLabel(text, dropdown) {
    $(dropdown).find('button span.filter-option').text(text);
  }

  function isUnsticked(tab) {
    if (tab) {
      return $(tab).parents('.unstick').length > 0
    }
    return false;
  }

  function removeActiveClass($tabs) {
    $tabs.each(function (idx, tab) {
      $(tab).removeClass('active');
    });
  }

  function scrollToStickyTab(tab) {
    if (tab) {
      var container = $(tab).parents('.sticky-tabs')[0];

      if (container) {
        $('html,body').animate({
          scrollTop: container.offsetTop - 65
        }, 'slow');
      }
    }
  }

  function subscribeOnPageScrollMobile($tabsInnerMobile) {
    $('body').on('resize scroll', function scrollCallback() {
      var elementTop = $tabsInnerMobile.parents('.sticky-tabs').offset().top;
      var viewportBottom = $(window).height();
      var thresholdOffset = 5; // 5px threshold to capture element

      if (viewportBottom < elementTop - thresholdOffset) {
        $tabsInnerMobile.removeClass('unstick');
      } else {
        $tabsInnerMobile.addClass('unstick');
        var $stickyTabs = $('.sticky-tabs');
        var $tabInner = $stickyTabs.find('.tabs-inner.tabs-inner--desktop');
        var $tabHeading = $tabInner.find('.tabs-heading');
        var openTabIdx = findActiveTabIndex();
          $tabHeading.find('li').eq(openTabIdx).addClass('active');
      }
    });
  }

  /**
   * Find the currently active sticky tab index
   */
  function findActiveTabIndex() {
    var $stickyTabs = $('.sticky-tabs');
    var $tabInner = $stickyTabs.find('.tabs-inner.tabs-inner--desktop');
    var $tabsContainer = $tabInner.find('.tabs-container');
    return $tabsContainer.find('.tab.active').index();
  }

  /**
   * Hides sticky tabs
   */
  function hideTabs() {
    var $stickyTabs = $('.sticky-tabs');
    var $tabInner = $stickyTabs.find('.tabs-inner.tabs-inner--desktop');
    var $tabHeading = $tabInner.find('.tabs-heading');

    $('html').removeClass('has-sticky-tab-open');
    $tabInner.removeClass('is-open');
    $('body').removeClass('no-scroll');
    var openTabIdx = findActiveTabIndex();
    $tabHeading.find('li').eq(openTabIdx).removeClass('active sticky-tab-active');
  }

  return api;
})(jQuery, document);

XA.register('componentStickyTabs', XA.component.componentStickyTabs);


/*  component-story  */
XA.component.componentStory = (function ($) {

    var api = {
        /**
         * Initialise story component slider with Slick carousel
         */
        initStorySlider: function () {

            var $slider = $('.story > .component-content > .mod-story-container > .mod-story-content > .mod-story-content-pages > .story-list > .component-content > ul');

            $slider.each(function () {
                if ($(this)) {
                    $slider.not('.slick-initialized').slick({
                        dots: true,
                        arrows: false,
                        speed: 100,
                        cssEase: "linear",
                        fade: true,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        customPaging: function (slick, index) {
                            return '<a>' + (index - 0) + '</a>';
                        }
                    });
                }
            });

            var $img = $('.mod-story-bg > .background-image > img');

            $img.each(function () {
                var curSrc = $(this).attr('data-src');
                var srcset = $(this).attr('data-srcset');
                var sizes = $(this).attr('data-sizes');
                $(this).removeAttr('data-srcset data-sizes class data-src');
                $(this).attr('src', curSrc);
                $(this).attr('srcset', srcset);
                $(this).attr('sizes', sizes);
            });
        },

        initStoryParallax: function () {

            $(document).ready(function () {
                var story = $('.component.story.mod-story');
                if (story.isVisible()) {
                    $(this).find('.mod-story-title').addClass('is-active');
                    $(this).find('.mod-story-content').addClass('is-active');
                }
            });

            $.fn.isVisible = function () {
                if (this[0] != undefined) {
                    var rect = this[0].getBoundingClientRect();
                    return (
                        (rect.height > 0 || rect.width > 0) &&
                        rect.bottom >= 0 &&
                        rect.right >= 0 &&
                        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
                        rect.left <= (window.innerWidth || document.documentElement.clientWidth)
                    );
                }
            };
        },
    };

    api.init = function () {
        this.api.initStorySlider();
        this.api.initStoryParallax();
    };

    return api;
})(jQuery, document);

XA.register('componentStory', XA.component.componentStory);

/*  component-videobanner  */
/* global videojs, $ */
/*eslint no-console: ["error", { allow: ["log"] }] */
/*eslint no-unused-vars: 0*/

XA.component.componentVideoBanner = (function ($) {
  var api = {   

    /**
     * Set teaser bubbles variant background color on page load
     */
    updateStageBubblesBackground: function () {
      $('.teaser.bubbles > .component-content div[data-bg-color]').each(function() {
        var hexColor = $(this).attr('data-bg-color');

        if (hexColor && hexColor.length) {
          $(this).closest('.teaser.bubbles').css({'background-color': hexColor});
        }
      });

      $('.carousel li.slide .bubbles > .component-content div[data-bg-color]').each(function() {
        var hexColor = $(this).attr('data-bg-color');

        if (hexColor && hexColor.length) {
          $(this).closest('.slide .bubbles').css({'background-color': hexColor});
        }
      });
    },

    /**
     * If screen is low-res, append class to HTML tag
     * Used to regulate media-banner & carousel height on low-res screens
     */
    setLowResolution: function() {
      var isLowRes = window.devicePixelRatio > 1 && window.devicePixelRatio < 2 && screen.height < 730 && screen.height > 690 ? !0 : !1;
      document.documentElement.className += isLowRes ? ' low-resolution' : '';
    }
  };

  api.init = function () {

    $('.mod-stage .video-banner').each(function() {
      var curStage = document.querySelector('.mod-stage--video-player');
      var closeBtn = document.querySelector('.player-close');
      var startBtn = document.querySelector('.player-toggle');   

      var video = $('.mod-stage--video-player').find('video').get(0);      
  
      startBtn.addEventListener('click', function () {
        curStage.classList.add('is-playing'); 
        video.play(); 
      }); 

      closeBtn.addEventListener('click', function () {
        curStage.classList.remove('is-playing');
        video.pause(); 
      });
    }); 

    this.api.updateStageBubblesBackground();
    this.api.setLowResolution();
  };
  return api;
})(jQuery, document);

XA.register('componentVideoBanner', XA.component.componentVideoBanner);


/*  content-slider  */
XA.component.zwpContentSlider = (function($) {

  var api = {
    /**
     * Initialise content slider with Slick carousel
     */
    initContentSlider: function() {

      var $slider = $('.mod-content-slider__inlay');

      // Are we in Edit mode? If so, we need to set infinite mode to false 
      // This is to prevent breaking Sitecore editor JS
      var isEditMode = $('body').hasClass('on-page-editor');
      
      if ($slider) {
        $slider.not('.slick-initialized').slick({
          dots: true,
          speed: 1200,
          cssEase: "ease-in",
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: !isEditMode
        });	
      }
    },
  };

  api.init = function() {
    this.api.initContentSlider();
  };

  return api;
})(jQuery, document);

XA.register('zwpContentSlider', XA.component.zwpContentSlider);

/*  cookies  */
XA.component.zwpCookies = (function($) {

  var api = {
    PRIVACY_COOKIE: 'cookieLaw',
    COOKIE_FLUSH_KEY: 'cookieFlushKey',

    /**
     * Check if a cookie flush has been requested or updated
     */
    checkFlushCookie: function() {
      var flushKey = $('#epoch-value').val();
      var cookieFlushKey = XA.cookies.readCookie(this.COOKIE_FLUSH_KEY);

      if (!flushKey) {
        return;
      }

      // If flushKeys don't match - clear cookie
      if (!cookieFlushKey || (cookieFlushKey !== flushKey)) {
        this.flushCookie(this.PRIVACY_COOKIE, flushKey);
      } 
    },

    /**
     * Removes cookie and updates flush key cookie with new value
     * @param {string} cookieName - the cookie we want to destroy
     * @param {string} flushKey - the new flush key
     */
    flushCookie: function(cookieName, flushKey) {
      XA.cookies.createCookie(this.COOKIE_FLUSH_KEY, flushKey, 365);
      document.cookie = cookieName + '=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
    }
  };

  api.init = function() {
    this.api.checkFlushCookie();
  };

  return api;
})(jQuery, document);

XA.register('zwpCookies', XA.component.zwpCookies);

/*  datepicker  */
var Datepicker = (function () {
  'use strict';

  function hasProperty(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  }

  function lastItemOf(arr) {
    return arr[arr.length - 1];
  }

  // push only the items not included in the array
  function pushUnique(arr, ...items) {
    items.forEach((item) => {
      if (arr.includes(item)) {
        return;
      }
      arr.push(item);
    });
    return arr;
  }
//Adding function to check for validation when manually entering the value
//This is called from Update(inline)
  function ValidateInputInline(datePicker)  
    {
      var dateFormat=datePicker.config.format.toLowerCase();
      var dateFormatParts = dateFormat.match(new RegExp(reFormatTokens, 'g'));
      var dateParts=datePicker.inputField.value.split(new RegExp(reNonDateParts, 'g'));
      
      if(dateParts.length==1 && dateParts[0].toLowerCase()=="today")
      {
        return;
      }
      if(dateParts.length!=3) 
      {
        inputInlineErrorMessage(datePicker);
        return;
      }
      if(dateParts[0].toLowerCase()=="today")
      {
        return;
      }
      
     /** For datePart check**/
       let dateIndex=dateFormatParts.indexOf('dd');
      
      if(isNaN(dateParts[dateIndex]) || parseInt(dateParts[dateIndex])>31 || parseInt(dateParts[dateIndex])<=0)
      {
        inputInlineErrorMessage(datePicker);
        return;
      }

      /**For yearPart check**/
      let yearIndex=dateFormatParts.indexOf('yyyy');

      if(isNaN(dateParts[yearIndex]) || dateParts[yearIndex].length!=4)
      {
        inputInlineErrorMessage(datePicker);
        return;
      }

      /**For MonthPart Check**/
      var monthIndex=dateFormatParts.findIndex(function(item)
        {
          return item.indexOf('m')!==-1;
        });

      if(isNaN(dateParts[monthIndex]))
      {
        const monthName = dateParts[monthIndex].toLowerCase();
        const compareNames = name => name.toLowerCase().startsWith(monthName);
        
        // compare with both short and full names because 
        
        monthIndex = datePicker.config.locale.monthsShort.findIndex(compareNames);
        if (monthIndex < 0) {
          monthIndex = datePicker.config.locale.months.findIndex(compareNames);
        }
        if (monthIndex < 0) {
          inputInlineErrorMessage(datePicker);
          return;
        }
      }    
      else if(dateParts[monthIndex]>12 || dateParts[monthIndex]<1)
        {
          inputInlineErrorMessage(datePicker);
          return;
        }  
      removeInputInlineErrorMessage(datePicker) ;
      return;
    }

    function removeInputInlineErrorMessage(datePicker)
    {
      var getValidationMessageEle=document.querySelector(`[data-valmsg-for="${datePicker.inputField.name}"]`);
      jQuery(datePicker.inputField).removeClass("input-validation-error");
      jQuery(getValidationMessageEle).addClass("field-validation-valid").removeClass("field-validation-error").text("");
      return;
    }
  function inputInlineErrorMessage(datePicker)
    {
      var getValidationMessageEle=document.querySelector(`[data-valmsg-for="${datePicker.inputField.name}"]`);
      var getInvalidFormatErrorMessage=jQuery(datePicker.inputField).attr('invalid-format-message');
      datePicker.inputField.value="";
      jQuery(datePicker.inputField).addClass("input-validation-error");
      jQuery(getValidationMessageEle).addClass("field-validation-error").removeClass("field-validation-valid").text(getInvalidFormatErrorMessage);
      return;
    }
  function stringToArray(str, separator) {
    // convert empty string to an empty array
    return str ? str.split(separator) : [];
  }

  function isInRange(testVal, min, max) {
    const minOK = min === undefined || testVal >= min;
    const maxOK = max === undefined || testVal <= max;
    return minOK && maxOK;
  }

  function limitToRange(val, min, max) {
    if (val < min) {
      return min;
    }
    if (val > max) {
      return max;
    }
    return val;
  }

  function createTagRepeat(tagName, repeat, attributes = {}, index = 0, html = '') {
    const openTagSrc = Object.keys(attributes).reduce((src, attr) => {
      let val = attributes[attr];
      if (typeof val === 'function') {
        val = val(index);
      }
      return `${src} ${attr}="${val}"`;
    }, tagName);
    html += `<${openTagSrc}></${tagName}>`;

    const next = index + 1;
    return next < repeat
      ? createTagRepeat(tagName, repeat, attributes, next, html)
      : html;
  }

  // Remove the spacing surrounding tags for HTML parser not to create text nodes
  // before/after elements
  function optimizeTemplateHTML(html) {
    return html.replace(/>\s+/g, '>').replace(/\s+</, '<');
  }

  function stripTime(timeValue) {
    return new Date(timeValue).setHours(0, 0, 0, 0);
  }

  function today() {
    return new Date().setHours(0, 0, 0, 0);
  }

  // Get the time value of the start of given date or year, month and day
  function dateValue(...args) {
    switch (args.length) {
      case 0:
        return today();
      case 1:
        return stripTime(args[0]);
    }

    // use setFullYear() to keep 2-digit year from being mapped to 1900-1999
    const newDate = new Date(0);
    newDate.setFullYear(...args);
    return newDate.setHours(0, 0, 0, 0);
  }

  function addDays(date, amount) {
    const newDate = new Date(date);
    return newDate.setDate(newDate.getDate() + amount);
  }

  function addWeeks(date, amount) {
    return addDays(date, amount * 7);
  }

  function addMonths(date, amount) {
    // If the day of the date is not in the new month, the last day of the new
    // month will be returned. e.g. Jan 31 + 1 month → Feb 28 (not Mar 03)
    const newDate = new Date(date);
    const monthsToSet = newDate.getMonth() + amount;
    let expectedMonth = monthsToSet % 12;
    if (expectedMonth < 0) {
      expectedMonth += 12;
    }

    const time = newDate.setMonth(monthsToSet);
    return newDate.getMonth() !== expectedMonth ? newDate.setDate(0) : time;
  }

  function addYears(date, amount) {
    // If the date is Feb 29 and the new year is not a leap year, Feb 28 of the
    // new year will be returned.
    const newDate = new Date(date);
    const expectedMonth = newDate.getMonth();
    const time = newDate.setFullYear(newDate.getFullYear() + amount);
    return expectedMonth === 1 && newDate.getMonth() === 2 ? newDate.setDate(0) : time;
  }

  // Calculate the distance bettwen 2 days of the week
  function dayDiff(day, from) {
    return (day - from + 7) % 7;
  }

  // Get the date of the specified day of the week of given base date
  function dayOfTheWeekOf(baseDate, dayOfWeek, weekStart = 0) {
    const baseDay = new Date(baseDate).getDay();
    return addDays(baseDate, dayDiff(dayOfWeek, weekStart) - dayDiff(baseDay, weekStart));
  }

  // Get the ISO week of a date
  function getWeek(date) {
    // start of ISO week is Monday
    const thuOfTheWeek = dayOfTheWeekOf(date, 4, 1);
    // 1st week == the week where the 4th of January is in
    const firstThu = dayOfTheWeekOf(new Date(thuOfTheWeek).setMonth(0, 4), 4, 1);
    return Math.round((thuOfTheWeek - firstThu) / 604800000) + 1;
  }

  // Get the start year of the period of years that includes given date
  // years: length of the year period
  function startOfYearPeriod(date, years) {
    /* @see https://en.wikipedia.org/wiki/Year_zero#ISO_8601 */
    const year = new Date(date).getFullYear();
    return Math.floor(year / years) * years;
  }

  // Convert date to the first/last date of the month/year of the date
  function regularizeDate(date, timeSpan, useLastDate) {
    if (timeSpan !== 1 && timeSpan !== 2) {
      return date;
    }
    const newDate = new Date(date);
    if (timeSpan === 1) {
      useLastDate
        ? newDate.setMonth(newDate.getMonth() + 1, 0)
        : newDate.setDate(1);
    } else {
      useLastDate
        ? newDate.setFullYear(newDate.getFullYear() + 1, 0, 0)
        : newDate.setMonth(0, 1);
    }
    return newDate.setHours(0, 0, 0, 0);
  }

  // pattern for format parts
  const reFormatTokens = /dd?|DD?|mm?|MM?|yy?(?:yy)?/;
  // pattern for non date parts
  const reNonDateParts = /[\s!-/:-@[-`{-~年月日]+/;
  // cache for persed formats
  let knownFormats = {};
  // parse funtions for date parts
  const parseFns = {
    y(date, year) {
      return new Date(date).setFullYear(parseInt(year, 10));
    },
    m(date, month, locale) {
      const newDate = new Date(date);
      let monthIndex = parseInt(month, 10) - 1;

      if (isNaN(monthIndex)) {
        if (!month) {
          return NaN;
        }

        const monthName = month.toLowerCase();
        const compareNames = name => name.toLowerCase().startsWith(monthName);
        // compare with both short and full names because some locales have periods
        // in the short names (not equal to the first X letters of the full names)
        monthIndex = locale.monthsShort.findIndex(compareNames);
        if (monthIndex < 0) {
          monthIndex = locale.months.findIndex(compareNames);
        }
        if (monthIndex < 0) {
          return NaN;
        }
      }

      newDate.setMonth(monthIndex);
      return newDate.getMonth() !== normalizeMonth(monthIndex)
        ? newDate.setDate(0)
        : newDate.getTime();
    },
    d(date, day) {
      return new Date(date).setDate(parseInt(day, 10));
    },
  };
  // format functions for date parts
  const formatFns = {
    d(date) {
      return date.getDate();
    },
    dd(date) {
      return padZero(date.getDate(), 2);
    },
    D(date, locale) {
      return locale.daysShort[date.getDay()];
    },
    DD(date, locale) {
      return locale.days[date.getDay()];
    },
    m(date) {
      return date.getMonth() + 1;
    },
    mm(date) {
      return padZero(date.getMonth() + 1, 2);
    },
    M(date, locale) {
      return locale.monthsShort[date.getMonth()];
    },
    MM(date, locale) {
      return locale.months[date.getMonth()];
    },
    y(date) {
      return date.getFullYear();
    },
    yy(date) {
      return padZero(date.getFullYear(), 2).slice(-2);
    },
    yyyy(date) {
      return padZero(date.getFullYear(), 4);
    },
  };

  // get month index in normal range (0 - 11) from any number
  function normalizeMonth(monthIndex) {
    return monthIndex > -1 ? monthIndex % 12 : normalizeMonth(monthIndex + 12);
  }

  function padZero(num, length) {
    return num.toString().padStart(length, '0');
  }

  function parseFormatString(format) {
    if (typeof format !== 'string') {
      throw new Error("Invalid date format.");
    }
    if (format in knownFormats) {
      return knownFormats[format];
    }

    // sprit the format string into parts and seprators
    const separators = format.split(reFormatTokens);
    const parts = format.match(new RegExp(reFormatTokens, 'g'));
    if (separators.length === 0 || !parts) {
      throw new Error("Invalid date format.");
    }

    // collect format functions used in the format
    const partFormatters = parts.map(token => formatFns[token]);

    // collect parse function keys used in the format
    // iterate over parseFns' keys in order to keep the order of the keys.
    const partParserKeys = Object.keys(parseFns).reduce((keys, key) => {
      const token = parts.find(part => part[0] !== 'D' && part[0].toLowerCase() === key);
      if (token) {
        keys.push(key);
      }
      return keys;
    }, []);

    return knownFormats[format] = {
      parser(dateStr, locale) {
        const dateParts = dateStr.split(reNonDateParts).reduce((dtParts, part, index) => {
          if (part.length > 0 && parts[index]) {
            const token = parts[index][0];
            if (token === 'M') {
              dtParts.m = part;
            } else if (token !== 'D') {
              dtParts[token] = part;
            }
          }
          return dtParts;
        }, {});

        // iterate over partParserkeys so that the parsing is made in the oder
        // of year, month and day to prevent the day parser from correcting last
        // day of month wrongly
        return partParserKeys.reduce((origDate, key) => {
          const newDate = parseFns[key](origDate, dateParts[key], locale);
          // ingnore the part failed to parse
          return isNaN(newDate) ? origDate : newDate;
        }, today());
      },
      formatter(date, locale) {
        let dateStr = partFormatters.reduce((str, fn, index) => {
          return str += `${separators[index]}${fn(date, locale)}`;
        }, '');
        // separators' length is always parts' length + 1,
        return dateStr += lastItemOf(separators);
      },
    };
  }

  function parseDate(dateStr, format, locale) {
    if (dateStr instanceof Date || typeof dateStr === 'number') {
      const date = stripTime(dateStr);
      return isNaN(date) ? undefined : date;
    }
    if (!dateStr) {
      return undefined;
    }
    if (dateStr === 'today') {
      return today();
    }

    if (format && format.toValue) {
      const date = format.toValue(dateStr, format, locale);
      return isNaN(date) ? undefined : stripTime(date);
    }

    return parseFormatString(format).parser(dateStr, locale);
  }

  function formatDate(date, format, locale) {
    if (isNaN(date) || (!date && date !== 0)) {
      return '';
    }

    const dateObj = typeof date === 'number' ? new Date(date) : date;

    if (format.toDisplay) {
      return format.toDisplay(dateObj, format, locale);
    }

    return parseFormatString(format).formatter(dateObj, locale);
  }

  const range = document.createRange();

  function parseHTML(html) {
    return range.createContextualFragment(html);
  }

  function getParent(el) {
    return el.parentElement
      || (el.parentNode instanceof ShadowRoot ? el.parentNode.host : undefined);
  }

  function isActiveElement(el) {
    return el.getRootNode().activeElement === el;
  }

  function hideElement(el) {
    if (el.style.display === 'none') {
      return;
    }
    // back up the existing display setting in data-style-display
    if (el.style.display) {
      el.dataset.styleDisplay = el.style.display;
    }
    el.style.display = 'none';
  }

  function showElement(el) {
    if (el.style.display !== 'none') {
      return;
    }
    if (el.dataset.styleDisplay) {
      // restore backed-up dispay property
      el.style.display = el.dataset.styleDisplay;
      delete el.dataset.styleDisplay;
    } else {
      el.style.display = '';
    }
  }

  function emptyChildNodes(el) {
    if (el.firstChild) {
      el.removeChild(el.firstChild);
      emptyChildNodes(el);
    }
  }

  function replaceChildNodes(el, newChildNodes) {
    emptyChildNodes(el);
    if (newChildNodes instanceof DocumentFragment) {
      el.appendChild(newChildNodes);
    } else if (typeof newChildNodes === 'string') {
      el.appendChild(parseHTML(newChildNodes));
    } else if (typeof newChildNodes.forEach === 'function') {
      newChildNodes.forEach((node) => {
        el.appendChild(node);
      });
    }
  }

  const listenerRegistry = new WeakMap();
  const {addEventListener, removeEventListener} = EventTarget.prototype;

  // Register event listeners to a key object
  // listeners: array of listener definitions;
  //   - each definition must be a flat array of event target and the arguments
  //     used to call addEventListener() on the target
  function registerListeners(keyObj, listeners) {
    let registered = listenerRegistry.get(keyObj);
    if (!registered) {
      registered = [];
      listenerRegistry.set(keyObj, registered);
    }
    listeners.forEach((listener) => {
      addEventListener.call(...listener);
      registered.push(listener);
    });
  }

  function unregisterListeners(keyObj) {
    let listeners = listenerRegistry.get(keyObj);
    if (!listeners) {
      return;
    }
    listeners.forEach((listener) => {
      removeEventListener.call(...listener);
    });
    listenerRegistry.delete(keyObj);
  }

  // Event.composedPath() polyfill for Edge
  // based on https://gist.github.com/kleinfreund/e9787d73776c0e3750dcfcdc89f100ec
  if (!Event.prototype.composedPath) {
    const getComposedPath = (node, path = []) => {
      path.push(node);

      let parent;
      if (node.parentNode) {
        parent = node.parentNode;
      } else if (node.host) { // ShadowRoot
        parent = node.host;
      } else if (node.defaultView) {  // Document
        parent = node.defaultView;
      }
      return parent ? getComposedPath(parent, path) : path;
    };

    Event.prototype.composedPath = function () {
      return getComposedPath(this.target);
    };
  }

  function findFromPath(path, criteria, currentTarget) {
    const [node, ...rest] = path;
    if (criteria(node)) {
      return node;
    }
    if (node === currentTarget || node.tagName === 'HTML' || rest.length === 0) {
      // stop when reaching currentTarget or <html>
      return;
    }
    return findFromPath(rest, criteria, currentTarget);
  }

  // Search for the actual target of a delegated event
  function findElementInEventPath(ev, selector) {
    const criteria = typeof selector === 'function'
      ? selector
      : el => el instanceof Element && el.matches(selector);
    return findFromPath(ev.composedPath(), criteria, ev.currentTarget);
  }

  // default locales
  const locales = {
    en: {
      days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
      months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      today: "Today",
      clear: "Clear",
      titleFormat: "MM y"
      },
      'de-DE': {
          days: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
          daysShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
          daysMin: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
          months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
              'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
          monthsShort: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun',
              'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
          today: "Today",
          clear: "Clear",
          titleFormat: "MM y"
      }
  };

  // config options updatable by setOptions() and their default values
  const defaultOptions = {
    autohide: false,
    beforeShowDay: null,
    beforeShowDecade: null,
    beforeShowMonth: null,
    beforeShowYear: null,
    calendarWeeks: false,
    clearBtn: false,
    dateDelimiter: ',',
    datesDisabled: [],
    daysOfWeekDisabled: [],
    daysOfWeekHighlighted: [],
    defaultViewDate: undefined, // placeholder, defaults to today() by the program
    disableTouchKeyboard: false,
    format: 'mm/dd/yyyy',
    language: 'en',
    maxDate: null,
    maxNumberOfDates: 1,
    maxView: 3,
    minDate: null,
    nextArrow: '»',
    orientation: 'auto',
    pickLevel: 0,
    prevArrow: '«',
    showDaysOfWeek: true,
    showOnClick: true,
    showOnFocus: true,
    startView: 0,
    title: '',
    todayBtn: false,
    todayBtnMode: 0,
    todayHighlight: false,
    updateOnBlur: true,
    weekStart: 0,
  };

  const {
    language: defaultLang,
    format: defaultFormat,
    weekStart: defaultWeekStart,
  } = defaultOptions;

  // Reducer function to filter out invalid day-of-week from the input
  function sanitizeDOW(dow, day) {
    return dow.length < 6 && day >= 0 && day < 7
      ? pushUnique(dow, day)
      : dow;
  }

  function calcEndOfWeek(startOfWeek) {
    return (startOfWeek + 6) % 7;
  }

  // validate input date. if invalid, fallback to the original value
  function validateDate(value, format, locale, origValue) {
    const date = parseDate(value, format, locale);
    return date !== undefined ? date : origValue;
  }

  // Validate viewId. if invalid, fallback to the original value
  function validateViewId(value, origValue, max = 3) {
    const viewId = parseInt(value, 10);
    return viewId >= 0 && viewId <= max ? viewId : origValue;
  }

  // Create Datepicker configuration to set
  function processOptions(options, datepicker) {
    const inOpts = Object.assign({}, options);
    const config = {};
    const locales = datepicker.constructor.locales;
    const rangeSideIndex = datepicker.rangeSideIndex;
    let {
      format,
      language,
      locale,
      maxDate,
      maxView,
      minDate,
      pickLevel,
      startView,
      weekStart,
    } = datepicker.config || {};

    if (inOpts.language) {
      let lang;
      if (inOpts.language !== language) {
        if (locales[inOpts.language]) {
          lang = inOpts.language;
        } else {
          // Check if langauge + region tag can fallback to the one without
          // region (e.g. fr-CA → fr)
          lang = inOpts.language.split('-')[0];
          if (locales[lang] === undefined) {
            lang = false;
          }
        }
      }
      delete inOpts.language;
      if (lang) {
        language = config.language = lang;

        // update locale as well when updating language
        const origLocale = locale || locales[defaultLang];
        // use default language's properties for the fallback
        locale = Object.assign({
          format: defaultFormat,
          weekStart: defaultWeekStart
        }, locales[defaultLang]);
        if (language !== defaultLang) {
          Object.assign(locale, locales[language]);
        }
        config.locale = locale;
        // if format and/or weekStart are the same as old locale's defaults,
        // update them to new locale's defaults
        if (format === origLocale.format) {
          format = config.format = locale.format;
        }
        if (weekStart === origLocale.weekStart) {
          weekStart = config.weekStart = locale.weekStart;
          config.weekEnd = calcEndOfWeek(locale.weekStart);
        }
      }
    }

    if (inOpts.format) {
      const hasToDisplay = typeof inOpts.format.toDisplay === 'function';
      const hasToValue = typeof inOpts.format.toValue === 'function';
      const validFormatString = reFormatTokens.test(inOpts.format);
      if ((hasToDisplay && hasToValue) || validFormatString) {
        format = config.format = inOpts.format;
      }
      delete inOpts.format;
    }

    //*** pick level ***//
    let newPickLevel = pickLevel;
    if (inOpts.pickLevel !== undefined) {
      newPickLevel = validateViewId(inOpts.pickLevel, 2);
      delete inOpts.pickLevel;
    }
    if (newPickLevel !== pickLevel) {
      if (newPickLevel > pickLevel) {
        // complement current minDate/madDate so that the existing range will be
        // expanded to fit the new level later
        if (inOpts.minDate === undefined) {
          inOpts.minDate = minDate;
        }
        if (inOpts.maxDate === undefined) {
          inOpts.maxDate = maxDate;
        }
      }
      // complement datesDisabled so that it will be reset later
      if (!inOpts.datesDisabled) {
        inOpts.datesDisabled = [];
      }
      pickLevel = config.pickLevel = newPickLevel;
    }

    //*** dates ***//
    // while min and maxDate for "no limit" in the options are better to be null
    // (especially when updating), the ones in the config have to be undefined
    // because null is treated as 0 (= unix epoch) when comparing with time value
    let minDt = minDate;
    let maxDt = maxDate;
    if (inOpts.minDate !== undefined) {
      const defaultMinDt = dateValue(0, 0, 1);
      minDt = inOpts.minDate === null
        ? defaultMinDt  // set 0000-01-01 to prevent negative values for year
        : validateDate(inOpts.minDate, format, locale, minDt);
      if (minDt !== defaultMinDt) {
        minDt = regularizeDate(minDt, pickLevel, false);
      }
      delete inOpts.minDate;
    }
    if (inOpts.maxDate !== undefined) {
      maxDt = inOpts.maxDate === null
        ? undefined
        : validateDate(inOpts.maxDate, format, locale, maxDt);
      if (maxDt !== undefined) {
        maxDt = regularizeDate(maxDt, pickLevel, true);
      }
      delete inOpts.maxDate;
    }
    if (maxDt < minDt) {
      minDate = config.minDate = maxDt;
      maxDate = config.maxDate = minDt;
    } else {
      if (minDate !== minDt) {
        minDate = config.minDate = minDt;
      }
      if (maxDate !== maxDt) {
        maxDate = config.maxDate = maxDt;
      }
    }

    if (inOpts.datesDisabled) {
      config.datesDisabled = inOpts.datesDisabled.reduce((dates, dt) => {
        const date = parseDate(dt, format, locale);
        return date !== undefined
          ? pushUnique(dates, regularizeDate(date, pickLevel, rangeSideIndex))
          : dates;
      }, []);
      delete inOpts.datesDisabled;
    }
    if (inOpts.defaultViewDate !== undefined) {
      const viewDate = parseDate(inOpts.defaultViewDate, format, locale);
      if (viewDate !== undefined) {
        config.defaultViewDate = viewDate;
      }
      delete inOpts.defaultViewDate;
    }

    //*** days of week ***//
    if (inOpts.weekStart !== undefined) {
      const wkStart = Number(inOpts.weekStart) % 7;
      if (!isNaN(wkStart)) {
        weekStart = config.weekStart = wkStart;
        config.weekEnd = calcEndOfWeek(wkStart);
      }
      delete inOpts.weekStart;
    }
    if (inOpts.daysOfWeekDisabled) {
      config.daysOfWeekDisabled = inOpts.daysOfWeekDisabled.reduce(sanitizeDOW, []);
      delete inOpts.daysOfWeekDisabled;
    }
    if (inOpts.daysOfWeekHighlighted) {
      config.daysOfWeekHighlighted = inOpts.daysOfWeekHighlighted.reduce(sanitizeDOW, []);
      delete inOpts.daysOfWeekHighlighted;
    }

    //*** multi date ***//
    if (inOpts.maxNumberOfDates !== undefined) {
      const maxNumberOfDates = parseInt(inOpts.maxNumberOfDates, 10);
      if (maxNumberOfDates >= 0) {
        config.maxNumberOfDates = maxNumberOfDates;
        config.multidate = maxNumberOfDates !== 1;
      }
      delete inOpts.maxNumberOfDates;
    }
    if (inOpts.dateDelimiter) {
      config.dateDelimiter = String(inOpts.dateDelimiter);
      delete inOpts.dateDelimiter;
    }

    //*** view ***//
    let newMaxView = maxView;
    if (inOpts.maxView !== undefined) {
      newMaxView = validateViewId(inOpts.maxView, maxView);
      delete inOpts.maxView;
    }
    // ensure max view >= pick level
    newMaxView = pickLevel > newMaxView ? pickLevel : newMaxView;
    if (newMaxView !== maxView) {
      maxView = config.maxView = newMaxView;
    }

    let newStartView = startView;
    if (inOpts.startView !== undefined) {
      newStartView = validateViewId(inOpts.startView, newStartView);
      delete inOpts.startView;
    }
    // ensure pick level <= start view <= max view
    if (newStartView < pickLevel) {
      newStartView = pickLevel;
    } else if (newStartView > maxView) {
      newStartView = maxView;
    }
    if (newStartView !== startView) {
      config.startView = newStartView;
    }

    //*** template ***//
    if (inOpts.prevArrow) {
      const prevArrow = parseHTML(inOpts.prevArrow);
      if (prevArrow.childNodes.length > 0) {
        config.prevArrow = prevArrow.childNodes;
      }
      delete inOpts.prevArrow;
    }
    if (inOpts.nextArrow) {
      const nextArrow = parseHTML(inOpts.nextArrow);
      if (nextArrow.childNodes.length > 0) {
        config.nextArrow = nextArrow.childNodes;
      }
      delete inOpts.nextArrow;
    }

    //*** misc ***//
    if (inOpts.disableTouchKeyboard !== undefined) {
      config.disableTouchKeyboard = 'ontouchstart' in document && !!inOpts.disableTouchKeyboard;
      delete inOpts.disableTouchKeyboard;
    }
    if (inOpts.orientation) {
      const orientation = inOpts.orientation.toLowerCase().split(/\s+/g);
      config.orientation = {
        x: orientation.find(x => (x === 'left' || x === 'right')) || 'auto',
        y: orientation.find(y => (y === 'top' || y === 'bottom')) || 'auto',
      };
      delete inOpts.orientation;
    }
    if (inOpts.todayBtnMode !== undefined) {
      switch(inOpts.todayBtnMode) {
        case 0:
        case 1:
          config.todayBtnMode = inOpts.todayBtnMode;
      }
      delete inOpts.todayBtnMode;
    }

    //*** copy the rest ***//
    Object.keys(inOpts).forEach((key) => {
      if (inOpts[key] !== undefined && hasProperty(defaultOptions, key)) {
        config[key] = inOpts[key];
      }
    });

    return config;
  }

  const pickerTemplate = optimizeTemplateHTML(`<div class="datepicker">
  <div class="datepicker-picker">
    <div class="datepicker-header">
      <div class="datepicker-title"></div>
      <div class="datepicker-controls">
        <button type="button" class="%buttonClass% prev-btn"></button>
        <button type="button" class="%buttonClass% view-switch"></button>
        <button type="button" class="%buttonClass% next-btn"></button>
      </div>
    </div>
    <div class="datepicker-main"></div>
    <div class="datepicker-footer">
      <div class="datepicker-controls">
        <button type="button" class="%buttonClass% today-btn"></button>
        <button type="button" class="%buttonClass% clear-btn"></button>
      </div>
    </div>
  </div>
</div>`);

  const daysTemplate = optimizeTemplateHTML(`<div class="days">
  <div class="days-of-week">${createTagRepeat('span', 7, {class: 'dow'})}</div>
  <div class="datepicker-grid">${createTagRepeat('span', 42)}</div>
</div>`);

  const calendarWeeksTemplate = optimizeTemplateHTML(`<div class="calendar-weeks">
  <div class="days-of-week"><span class="dow"></span></div>
  <div class="weeks">${createTagRepeat('span', 6, {class: 'week'})}</div>
</div>`);

  // Base class of the view classes
  class View {
    constructor(picker, config) {
      Object.assign(this, config, {
        picker,
        element: parseHTML(`<div class="datepicker-view"></div>`).firstChild,
        selected: [],
      });
      this.init(this.picker.datepicker.config);
    }

    init(options) {
      if (options.pickLevel !== undefined) {
        this.isMinView = this.id === options.pickLevel;
      }
      this.setOptions(options);
      this.updateFocus();
      this.updateSelection();
    }

    // Execute beforeShow() callback and apply the result to the element
    // args:
    // - current - current value on the iteration on view rendering
    // - timeValue - time value of the date to pass to beforeShow()
    performBeforeHook(el, current, timeValue) {
      let result = this.beforeShow(new Date(timeValue));
      switch (typeof result) {
        case 'boolean':
          result = {enabled: result};
          break;
        case 'string':
          result = {classes: result};
      }

      if (result) {
        if (result.enabled === false) {
          el.classList.add('disabled');
          pushUnique(this.disabled, current);
        }
        if (result.classes) {
          const extraClasses = result.classes.split(/\s+/);
          el.classList.add(...extraClasses);
          if (extraClasses.includes('disabled')) {
            pushUnique(this.disabled, current);
          }
        }
        if (result.content) {
          replaceChildNodes(el, result.content);
        }
      }
    }
  }

  class DaysView extends View {
    constructor(picker) {
      super(picker, {
        id: 0,
        name: 'days',
        cellClass: 'day',
      });
    }

    init(options, onConstruction = true) {
      if (onConstruction) {
        const inner = parseHTML(daysTemplate).firstChild;
        this.dow = inner.firstChild;
        this.grid = inner.lastChild;
        this.element.appendChild(inner);
      }
      super.init(options);
    }

    setOptions(options) {
      let updateDOW;

      if (hasProperty(options, 'minDate')) {
        this.minDate = options.minDate;
      }
      if (hasProperty(options, 'maxDate')) {
        this.maxDate = options.maxDate;
      }
      if (options.datesDisabled) {
        this.datesDisabled = options.datesDisabled;
      }
      if (options.daysOfWeekDisabled) {
        this.daysOfWeekDisabled = options.daysOfWeekDisabled;
        updateDOW = true;
      }
      if (options.daysOfWeekHighlighted) {
        this.daysOfWeekHighlighted = options.daysOfWeekHighlighted;
      }
      if (options.todayHighlight !== undefined) {
        this.todayHighlight = options.todayHighlight;
      }
      if (options.weekStart !== undefined) {
        this.weekStart = options.weekStart;
        this.weekEnd = options.weekEnd;
        updateDOW = true;
      }
      if (options.locale) {
        const locale = this.locale = options.locale;
        this.dayNames = locale.daysMin;
        this.switchLabelFormat = locale.titleFormat;
        updateDOW = true;
      }
      if (options.beforeShowDay !== undefined) {
        this.beforeShow = typeof options.beforeShowDay === 'function'
          ? options.beforeShowDay
          : undefined;
      }

      if (options.calendarWeeks !== undefined) {
        if (options.calendarWeeks && !this.calendarWeeks) {
          const weeksElem = parseHTML(calendarWeeksTemplate).firstChild;
          this.calendarWeeks = {
            element: weeksElem,
            dow: weeksElem.firstChild,
            weeks: weeksElem.lastChild,
          };
          this.element.insertBefore(weeksElem, this.element.firstChild);
        } else if (this.calendarWeeks && !options.calendarWeeks) {
          this.element.removeChild(this.calendarWeeks.element);
          this.calendarWeeks = null;
        }
      }
      if (options.showDaysOfWeek !== undefined) {
        if (options.showDaysOfWeek) {
          showElement(this.dow);
          if (this.calendarWeeks) {
            showElement(this.calendarWeeks.dow);
          }
        } else {
          hideElement(this.dow);
          if (this.calendarWeeks) {
            hideElement(this.calendarWeeks.dow);
          }
        }
      }

      // update days-of-week when locale, daysOfweekDisabled or weekStart is changed
      if (updateDOW) {
        Array.from(this.dow.children).forEach((el, index) => {
          const dow = (this.weekStart + index) % 7;
          el.textContent = this.dayNames[dow];
          el.className = this.daysOfWeekDisabled.includes(dow) ? 'dow disabled' : 'dow';
        });
      }
    }

    // Apply update on the focused date to view's settings
    updateFocus() {
      const viewDate = new Date(this.picker.viewDate);
      const viewYear = viewDate.getFullYear();
      const viewMonth = viewDate.getMonth();
      const firstOfMonth = dateValue(viewYear, viewMonth, 1);
      const start = dayOfTheWeekOf(firstOfMonth, this.weekStart, this.weekStart);

      this.first = firstOfMonth;
      this.last = dateValue(viewYear, viewMonth + 1, 0);
      this.start = start;
      this.focused = this.picker.viewDate;
    }

    // Apply update on the selected dates to view's settings
    updateSelection() {
      const {dates, rangepicker} = this.picker.datepicker;
      this.selected = dates;
      if (rangepicker) {
        this.range = rangepicker.dates;
      }
    }

     // Update the entire view UI
    render() {
      // update today marker on ever render
      this.today = this.todayHighlight ? today() : undefined;
      // refresh disabled dates on every render in order to clear the ones added
      // by beforeShow hook at previous render
      this.disabled = [...this.datesDisabled];

      const switchLabel = formatDate(this.focused, this.switchLabelFormat, this.locale);
      this.picker.setViewSwitchLabel(switchLabel);
      this.picker.setPrevBtnDisabled(this.first <= this.minDate);
      this.picker.setNextBtnDisabled(this.last >= this.maxDate);

      if (this.calendarWeeks) {
        // start of the UTC week (Monday) of the 1st of the month
        const startOfWeek = dayOfTheWeekOf(this.first, 1, 1);
        Array.from(this.calendarWeeks.weeks.children).forEach((el, index) => {
          el.textContent = getWeek(addWeeks(startOfWeek, index));
        });
      }
      Array.from(this.grid.children).forEach((el, index) => {
        const classList = el.classList;
        const current = addDays(this.start, index);
        const date = new Date(current);
        const day = date.getDay();

        el.className = `datepicker-cell ${this.cellClass}`;
        el.dataset.date = current;
        el.textContent = date.getDate();

        if (current < this.first) {
          classList.add('prev');
        } else if (current > this.last) {
          classList.add('next');
        }
        if (this.today === current) {
          classList.add('today');
        }
        if (current < this.minDate || current > this.maxDate || this.disabled.includes(current)) {
          classList.add('disabled');
        }
        if (this.daysOfWeekDisabled.includes(day)) {
          classList.add('disabled');
          pushUnique(this.disabled, current);
        }
        if (this.daysOfWeekHighlighted.includes(day)) {
          classList.add('highlighted');
        }
        if (this.range) {
          const [rangeStart, rangeEnd] = this.range;
          if (current > rangeStart && current < rangeEnd) {
            classList.add('range');
          }
          if (current === rangeStart) {
            classList.add('range-start');
          }
          if (current === rangeEnd) {
            classList.add('range-end');
          }
        }
        if (this.selected.includes(current)) {
          classList.add('selected');
        }
        if (current === this.focused) {
          classList.add('focused');
        }

        if (this.beforeShow) {
          this.performBeforeHook(el, current, current);
        }
      });
    }

    // Update the view UI by applying the changes of selected and focused items
    refresh() {
      const [rangeStart, rangeEnd] = this.range || [];
      this.grid
        .querySelectorAll('.range, .range-start, .range-end, .selected, .focused')
        .forEach((el) => {
          el.classList.remove('range', 'range-start', 'range-end', 'selected', 'focused');
        });
      Array.from(this.grid.children).forEach((el) => {
        const current = Number(el.dataset.date);
        const classList = el.classList;
        if (current > rangeStart && current < rangeEnd) {
          classList.add('range');
        }
        if (current === rangeStart) {
          classList.add('range-start');
        }
        if (current === rangeEnd) {
          classList.add('range-end');
        }
        if (this.selected.includes(current)) {
          classList.add('selected');
        }
        if (current === this.focused) {
          classList.add('focused');
        }
      });
    }

    // Update the view UI by applying the change of focused item
    refreshFocus() {
      const index = Math.round((this.focused - this.start) / 86400000);
      this.grid.querySelectorAll('.focused').forEach((el) => {
        el.classList.remove('focused');
      });
      this.grid.children[index].classList.add('focused');
    }
  }

  function computeMonthRange(range, thisYear) {
    if (!range || !range[0] || !range[1]) {
      return;
    }

    const [[startY, startM], [endY, endM]] = range;
    if (startY > thisYear || endY < thisYear) {
      return;
    }
    return [
      startY === thisYear ? startM : -1,
      endY === thisYear ? endM : 12,
    ];
  }

  class MonthsView extends View {
    constructor(picker) {
      super(picker, {
        id: 1,
        name: 'months',
        cellClass: 'month',
      });
    }

    init(options, onConstruction = true) {
      if (onConstruction) {
        this.grid = this.element;
        this.element.classList.add('months', 'datepicker-grid');
        this.grid.appendChild(parseHTML(createTagRepeat('span', 12, {'data-month': ix => ix})));
      }
      super.init(options);
    }

    setOptions(options) {
      if (options.locale) {
        this.monthNames = options.locale.monthsShort;
      }
      if (hasProperty(options, 'minDate')) {
        if (options.minDate === undefined) {
          this.minYear = this.minMonth = this.minDate = undefined;
        } else {
          const minDateObj = new Date(options.minDate);
          this.minYear = minDateObj.getFullYear();
          this.minMonth = minDateObj.getMonth();
          this.minDate = minDateObj.setDate(1);
        }
      }
      if (hasProperty(options, 'maxDate')) {
        if (options.maxDate === undefined) {
          this.maxYear = this.maxMonth = this.maxDate = undefined;
        } else {
          const maxDateObj = new Date(options.maxDate);
          this.maxYear = maxDateObj.getFullYear();
          this.maxMonth = maxDateObj.getMonth();
          this.maxDate = dateValue(this.maxYear, this.maxMonth + 1, 0);
        }
      }
      if (this.isMinView) {
        if (options.datesDisabled) {
          this.datesDisabled = options.datesDisabled;
        }
      } else {
        this.datesDisabled = [];
      }
      if (options.beforeShowMonth !== undefined) {
        this.beforeShow = typeof options.beforeShowMonth === 'function'
          ? options.beforeShowMonth
          : undefined;
      }
    }

    // Update view's settings to reflect the viewDate set on the picker
    updateFocus() {
      const viewDate = new Date(this.picker.viewDate);
      this.year = viewDate.getFullYear();
      this.focused = viewDate.getMonth();
    }

    // Update view's settings to reflect the selected dates
    updateSelection() {
      const {dates, rangepicker} = this.picker.datepicker;
      this.selected = dates.reduce((selected, timeValue) => {
        const date = new Date(timeValue);
        const year = date.getFullYear();
        const month = date.getMonth();
        if (selected[year] === undefined) {
          selected[year] = [month];
        } else {
          pushUnique(selected[year], month);
        }
        return selected;
      }, {});
      if (rangepicker && rangepicker.dates) {
        this.range = rangepicker.dates.map(timeValue => {
          const date = new Date(timeValue);
          return isNaN(date) ? undefined : [date.getFullYear(), date.getMonth()];
        });
      }
    }

    // Update the entire view UI
    render() {
      // refresh disabled months on every render in order to clear the ones added
      // by beforeShow hook at previous render
      // this.disabled = [...this.datesDisabled];
      this.disabled = this.datesDisabled.reduce((arr, disabled) => {
        const dt = new Date(disabled);
        if (this.year === dt.getFullYear()) {
          arr.push(dt.getMonth());
        }
        return arr;
      }, []);

      this.picker.setViewSwitchLabel(this.year);
      this.picker.setPrevBtnDisabled(this.year <= this.minYear);
      this.picker.setNextBtnDisabled(this.year >= this.maxYear);

      const selected = this.selected[this.year] || [];
      const yrOutOfRange = this.year < this.minYear || this.year > this.maxYear;
      const isMinYear = this.year === this.minYear;
      const isMaxYear = this.year === this.maxYear;
      const range = computeMonthRange(this.range, this.year);

      Array.from(this.grid.children).forEach((el, index) => {
        const classList = el.classList;
        const date = dateValue(this.year, index, 1);

        el.className = `datepicker-cell ${this.cellClass}`;
        if (this.isMinView) {
          el.dataset.date = date;
        }
        // reset text on every render to clear the custom content set
        // by beforeShow hook at previous render
        el.textContent = this.monthNames[index];

        if (
          yrOutOfRange
          || isMinYear && index < this.minMonth
          || isMaxYear && index > this.maxMonth
          || this.disabled.includes(index)
        ) {
          classList.add('disabled');
        }
        if (range) {
          const [rangeStart, rangeEnd] = range;
          if (index > rangeStart && index < rangeEnd) {
            classList.add('range');
          }
          if (index === rangeStart) {
            classList.add('range-start');
          }
          if (index === rangeEnd) {
            classList.add('range-end');
          }
        }
        if (selected.includes(index)) {
          classList.add('selected');
        }
        if (index === this.focused) {
          classList.add('focused');
        }

        if (this.beforeShow) {
          this.performBeforeHook(el, index, date);
        }
      });
    }

    // Update the view UI by applying the changes of selected and focused items
    refresh() {
      const selected = this.selected[this.year] || [];
      const [rangeStart, rangeEnd] = computeMonthRange(this.range, this.year) || [];
      this.grid
        .querySelectorAll('.range, .range-start, .range-end, .selected, .focused')
        .forEach((el) => {
          el.classList.remove('range', 'range-start', 'range-end', 'selected', 'focused');
        });
      Array.from(this.grid.children).forEach((el, index) => {
        const classList = el.classList;
        if (index > rangeStart && index < rangeEnd) {
          classList.add('range');
        }
        if (index === rangeStart) {
          classList.add('range-start');
        }
        if (index === rangeEnd) {
          classList.add('range-end');
        }
        if (selected.includes(index)) {
          classList.add('selected');
        }
        if (index === this.focused) {
          classList.add('focused');
        }
      });
    }

    // Update the view UI by applying the change of focused item
    refreshFocus() {
      this.grid.querySelectorAll('.focused').forEach((el) => {
        el.classList.remove('focused');
      });
      this.grid.children[this.focused].classList.add('focused');
    }
  }

  function toTitleCase(word) {
    return [...word].reduce((str, ch, ix) => str += ix ? ch : ch.toUpperCase(), '');
  }

  // Class representing the years and decades view elements
  class YearsView extends View {
    constructor(picker, config) {
      super(picker, config);
    }

    init(options, onConstruction = true) {
      if (onConstruction) {
        this.navStep = this.step * 10;
        this.beforeShowOption = `beforeShow${toTitleCase(this.cellClass)}`;
        this.grid = this.element;
        this.element.classList.add(this.name, 'datepicker-grid');
        this.grid.appendChild(parseHTML(createTagRepeat('span', 12)));
      }
      super.init(options);
    }

    setOptions(options) {
      if (hasProperty(options, 'minDate')) {
        if (options.minDate === undefined) {
          this.minYear = this.minDate = undefined;
        } else {
          this.minYear = startOfYearPeriod(options.minDate, this.step);
          this.minDate = dateValue(this.minYear, 0, 1);
        }
      }
      if (hasProperty(options, 'maxDate')) {
        if (options.maxDate === undefined) {
          this.maxYear = this.maxDate = undefined;
        } else {
          this.maxYear = startOfYearPeriod(options.maxDate, this.step);
          this.maxDate = dateValue(this.maxYear, 11, 31);
        }
      }
      if (this.isMinView) {
        if (options.datesDisabled) {
          this.datesDisabled = options.datesDisabled;
        }
      } else {
        this.datesDisabled = [];
      }
      if (options[this.beforeShowOption] !== undefined) {
        const beforeShow = options[this.beforeShowOption];
        this.beforeShow = typeof beforeShow === 'function' ? beforeShow : undefined;
      }
    }

    // Update view's settings to reflect the viewDate set on the picker
    updateFocus() {
      const viewDate = new Date(this.picker.viewDate);
      const first = startOfYearPeriod(viewDate, this.navStep);
      const last = first + 9 * this.step;

      this.first = first;
      this.last = last;
      this.start = first - this.step;
      this.focused = startOfYearPeriod(viewDate, this.step);
    }

    // Update view's settings to reflect the selected dates
    updateSelection() {
      const {dates, rangepicker} = this.picker.datepicker;
      this.selected = dates.reduce((years, timeValue) => {
        return pushUnique(years, startOfYearPeriod(timeValue, this.step));
      }, []);
      if (rangepicker && rangepicker.dates) {
        this.range = rangepicker.dates.map(timeValue => {
          if (timeValue !== undefined) {
            return startOfYearPeriod(timeValue, this.step);
          }
        });
      }
    }

    // Update the entire view UI
    render() {
      // refresh disabled years on every render in order to clear the ones added
      // by beforeShow hook at previous render
      // this.disabled = [...this.datesDisabled];
      this.disabled = this.datesDisabled.map(disabled => new Date(disabled).getFullYear());

      this.picker.setViewSwitchLabel(`${this.first}-${this.last}`);
      this.picker.setPrevBtnDisabled(this.first <= this.minYear);
      this.picker.setNextBtnDisabled(this.last >= this.maxYear);

      Array.from(this.grid.children).forEach((el, index) => {
        const classList = el.classList;
        const current = this.start + (index * this.step);
        const date = dateValue(current, 0, 1);

        el.className = `datepicker-cell ${this.cellClass}`;
        if (this.isMinView) {
          el.dataset.date = date;
        }
        el.textContent = el.dataset.year = current;

        if (index === 0) {
          classList.add('prev');
        } else if (index === 11) {
          classList.add('next');
        }
        if (current < this.minYear || current > this.maxYear || this.disabled.includes(current)) {
          classList.add('disabled');
        }
        if (this.range) {
          const [rangeStart, rangeEnd] = this.range;
          if (current > rangeStart && current < rangeEnd) {
            classList.add('range');
          }
          if (current === rangeStart) {
            classList.add('range-start');
          }
          if (current === rangeEnd) {
            classList.add('range-end');
          }
        }
        if (this.selected.includes(current)) {
          classList.add('selected');
        }
        if (current === this.focused) {
          classList.add('focused');
        }

        if (this.beforeShow) {
          this.performBeforeHook(el, current, date);
        }
      });
    }

    // Update the view UI by applying the changes of selected and focused items
    refresh() {
      const [rangeStart, rangeEnd] = this.range || [];
      this.grid
        .querySelectorAll('.range, .range-start, .range-end, .selected, .focused')
        .forEach((el) => {
          el.classList.remove('range', 'range-start', 'range-end', 'selected', 'focused');
        });
      Array.from(this.grid.children).forEach((el) => {
        const current = Number(el.textContent);
        const classList = el.classList;
        if (current > rangeStart && current < rangeEnd) {
          classList.add('range');
        }
        if (current === rangeStart) {
          classList.add('range-start');
        }
        if (current === rangeEnd) {
          classList.add('range-end');
        }
        if (this.selected.includes(current)) {
          classList.add('selected');
        }
        if (current === this.focused) {
          classList.add('focused');
        }
      });
    }

    // Update the view UI by applying the change of focused item
    refreshFocus() {
      const index = Math.round((this.focused - this.start) / this.step);
      this.grid.querySelectorAll('.focused').forEach((el) => {
        el.classList.remove('focused');
      });
      this.grid.children[index].classList.add('focused');
    }
  }

  function triggerDatepickerEvent(datepicker, type) {
    const detail = {
      date: datepicker.getDate(),
      viewDate: new Date(datepicker.picker.viewDate),
      viewId: datepicker.picker.currentView.id,
      datepicker,
    };
    datepicker.element.dispatchEvent(new CustomEvent(type, {detail}));
  }

  // direction: -1 (to previous), 1 (to next)
  function goToPrevOrNext(datepicker, direction) {
    const {minDate, maxDate} = datepicker.config;
    const {currentView, viewDate} = datepicker.picker;
    let newViewDate;
    switch (currentView.id) {
      case 0:
        newViewDate = addMonths(viewDate, direction);
        break;
      case 1:
        newViewDate = addYears(viewDate, direction);
        break;
      default:
        newViewDate = addYears(viewDate, direction * currentView.navStep);
    }
    newViewDate = limitToRange(newViewDate, minDate, maxDate);
    datepicker.picker.changeFocus(newViewDate).render();
  }

  function switchView(datepicker) {
    const viewId = datepicker.picker.currentView.id;
    if (viewId === datepicker.config.maxView) {
      return;
    }
    datepicker.picker.changeView(viewId + 1).render();
  }

  function unfocus(datepicker) {
    if (datepicker.config.updateOnBlur) {
      datepicker.update({revert: true});
    } else {
      datepicker.refresh('input');
    }
    datepicker.hide();
  }

  function goToSelectedMonthOrYear(datepicker, selection) {
    const picker = datepicker.picker;
    const viewDate = new Date(picker.viewDate);
    const viewId = picker.currentView.id;
    const newDate = viewId === 1
      ? addMonths(viewDate, selection - viewDate.getMonth())
      : addYears(viewDate, selection - viewDate.getFullYear());

    picker.changeFocus(newDate).changeView(viewId - 1).render();
  }

  function onClickTodayBtn(datepicker) {
    const picker = datepicker.picker;
    const currentDate = today();
    if (datepicker.config.todayBtnMode === 1) {
      if (datepicker.config.autohide) {
        datepicker.setDate(currentDate);
        return;
      }
      datepicker.setDate(currentDate, {render: false});
      picker.update();
    }
    if (picker.viewDate !== currentDate) {
      picker.changeFocus(currentDate);
    }
    picker.changeView(0).render();
  }

  function onClickClearBtn(datepicker) {
    datepicker.setDate({clear: true});
  }

  function onClickViewSwitch(datepicker) {
    switchView(datepicker);
  }

  function onClickPrevBtn(datepicker) {
    goToPrevOrNext(datepicker, -1);
  }

  function onClickNextBtn(datepicker) {
    goToPrevOrNext(datepicker, 1);
  }

  // For the picker's main block to delegete the events from `datepicker-cell`s
  function onClickView(datepicker, ev) {
    const target = findElementInEventPath(ev, '.datepicker-cell');
    if (!target || target.classList.contains('disabled')) {
      return;
    }

    const {id, isMinView} = datepicker.picker.currentView;
    if (isMinView) {
      datepicker.setDate(Number(target.dataset.date));
    } else if (id === 1) {
      goToSelectedMonthOrYear(datepicker, Number(target.dataset.month));
    } else {
      goToSelectedMonthOrYear(datepicker, Number(target.dataset.year));
    }
  }

  function onMousedownPicker(ev) {
    ev.preventDefault();
  }

  const orientClasses = ['left', 'top', 'right', 'bottom'].reduce((obj, key) => {
    obj[key] = `datepicker-orient-${key}`;
    return obj;
  }, {});
  const toPx = num => num ? `${num}px` : num;

  function processPickerOptions(picker, options) {
    if (options.title !== undefined) {
      if (options.title) {
        picker.controls.title.textContent = options.title;
        showElement(picker.controls.title);
      } else {
        picker.controls.title.textContent = '';
        hideElement(picker.controls.title);
      }
    }
    if (options.prevArrow) {
      const prevBtn = picker.controls.prevBtn;
      emptyChildNodes(prevBtn);
      options.prevArrow.forEach((node) => {
        prevBtn.appendChild(node.cloneNode(true));
      });
    }
    if (options.nextArrow) {
      const nextBtn = picker.controls.nextBtn;
      emptyChildNodes(nextBtn);
      options.nextArrow.forEach((node) => {
        nextBtn.appendChild(node.cloneNode(true));
      });
    }
    if (options.locale) {
      picker.controls.todayBtn.textContent = options.locale.today;
      picker.controls.clearBtn.textContent = options.locale.clear;
    }
    if (options.todayBtn !== undefined) {
      if (options.todayBtn) {
        showElement(picker.controls.todayBtn);
      } else {
        hideElement(picker.controls.todayBtn);
      }
    }
    if (hasProperty(options, 'minDate') || hasProperty(options, 'maxDate')) {
      const {minDate, maxDate} = picker.datepicker.config;
      picker.controls.todayBtn.disabled = !isInRange(today(), minDate, maxDate);
    }
    if (options.clearBtn !== undefined) {
      if (options.clearBtn) {
        showElement(picker.controls.clearBtn);
      } else {
        hideElement(picker.controls.clearBtn);
      }
    }
  }

  // Compute view date to reset, which will be...
  // - the last item of the selected dates or defaultViewDate if no selection
  // - limitted to minDate or maxDate if it exceeds the range
  function computeResetViewDate(datepicker) {
    const {dates, config} = datepicker;
    const viewDate = dates.length > 0 ? lastItemOf(dates) : config.defaultViewDate;
    return limitToRange(viewDate, config.minDate, config.maxDate);
  }

  // Change current view's view date
  function setViewDate(picker, newDate) {
    const oldViewDate = new Date(picker.viewDate);
    const newViewDate = new Date(newDate);
    const {id, year, first, last} = picker.currentView;
    const viewYear = newViewDate.getFullYear();

    picker.viewDate = newDate;
    if (viewYear !== oldViewDate.getFullYear()) {
      triggerDatepickerEvent(picker.datepicker, 'changeYear');
    }
    if (newViewDate.getMonth() !== oldViewDate.getMonth()) {
      triggerDatepickerEvent(picker.datepicker, 'changeMonth');
    }

    // return whether the new date is in different period on time from the one
    // displayed in the current view
    // when true, the view needs to be re-rendered on the next UI refresh.
    switch (id) {
      case 0:
        return newDate < first || newDate > last;
      case 1:
        return viewYear !== year;
      default:
        return viewYear < first || viewYear > last;
    }
  }

  function getTextDirection(el) {
    return window.getComputedStyle(el).direction;
  }

  // find the closet scrollable ancestor elemnt under the body
  function findScrollParents(el) {
    const parent = getParent(el);
    if (parent === document.body || !parent) {
      return;
    }

    // checking overflow only is enough because computed overflow cannot be
    // visible or a combination of visible and other when either axis is set
    // to other than visible.
    // (Setting one axis to other than 'visible' while the other is 'visible'
    // results in the other axis turning to 'auto')
    return window.getComputedStyle(parent).overflow !== 'visible'
      ? parent
      : findScrollParents(parent);
  }

  // Class representing the picker UI
  class Picker {
    constructor(datepicker) {
      const {config} = this.datepicker = datepicker;

      const template = pickerTemplate.replace(/%buttonClass%/g, config.buttonClass);
      const element = this.element = parseHTML(template).firstChild;
      const [header, main, footer] = element.firstChild.children;
      const title = header.firstElementChild;
      const [prevBtn, viewSwitch, nextBtn] = header.lastElementChild.children;
      const [todayBtn, clearBtn] = footer.firstChild.children;
      const controls = {
        title,
        prevBtn,
        viewSwitch,
        nextBtn,
        todayBtn,
        clearBtn,
      };
      this.main = main;
      this.controls = controls;

      const elementClass = datepicker.inline ? 'inline' : 'dropdown';
      element.classList.add(`datepicker-${elementClass}`);

      processPickerOptions(this, config);
      this.viewDate = computeResetViewDate(datepicker);

      // set up event listeners
      registerListeners(datepicker, [
        [element, 'mousedown', onMousedownPicker],
        [main, 'click', onClickView.bind(null, datepicker)],
        [controls.viewSwitch, 'click', onClickViewSwitch.bind(null, datepicker)],
        [controls.prevBtn, 'click', onClickPrevBtn.bind(null, datepicker)],
        [controls.nextBtn, 'click', onClickNextBtn.bind(null, datepicker)],
        [controls.todayBtn, 'click', onClickTodayBtn.bind(null, datepicker)],
        [controls.clearBtn, 'click', onClickClearBtn.bind(null, datepicker)],
      ]);

      // set up views
      this.views = [
        new DaysView(this),
        new MonthsView(this),
        new YearsView(this, {id: 2, name: 'years', cellClass: 'year', step: 1}),
        new YearsView(this, {id: 3, name: 'decades', cellClass: 'decade', step: 10}),
      ];
      this.currentView = this.views[config.startView];

      this.currentView.render();
      this.main.appendChild(this.currentView.element);
      if (config.container) {
        config.container.appendChild(this.element);
      } else {
        datepicker.inputField.after(this.element);
      }
    }

    setOptions(options) {
      processPickerOptions(this, options);
      this.views.forEach((view) => {
        view.init(options, false);
      });
      this.currentView.render();
    }

    detach() {
      this.element.remove();
    }

    show() {
      if (this.active) {
        return;
      }

      const {datepicker, element} = this;
      if (datepicker.inline) {
        element.classList.add('active');
      } else {
        // ensure picker's direction matches input's
        const inputDirection = getTextDirection(datepicker.inputField);
        if (inputDirection !== getTextDirection(getParent(element))) {
          element.dir = inputDirection;
        } else if (element.dir) {
          element.removeAttribute('dir');
        }

        element.style.visiblity = 'hidden';
        element.classList.add('active');
        this.place();
        element.style.visiblity = '';

        if (datepicker.config.disableTouchKeyboard) {
          datepicker.inputField.blur();
        }
      }
      this.active = true;
      triggerDatepickerEvent(datepicker, 'show');
    }

    hide() {
      if (!this.active) {
        return;
      }
      this.datepicker.exitEditMode();
      this.element.classList.remove('active');
      this.active = false;
      triggerDatepickerEvent(this.datepicker, 'hide');
    }

    place() {
      const {classList, offsetParent, style} = this.element;
      const {config, inputField} = this.datepicker;
      const {
        width: calendarWidth,
        height: calendarHeight,
      } = this.element.getBoundingClientRect();
      const {
        left: inputLeft,
        top: inputTop,
        right: inputRight,
        bottom: inputBottom,
        width: inputWidth,
        height: inputHeight
      } = inputField.getBoundingClientRect();
      let {x: orientX, y: orientY} = config.orientation;
      let left = inputLeft;
      let top = inputTop;

      // caliculate offsetLeft/Top of inputField
      if (offsetParent === document.body || !offsetParent) {
        left += window.scrollX;
        top += window.scrollY;
      } else {
        const offsetParentRect = offsetParent.getBoundingClientRect();
        left -= offsetParentRect.left - offsetParent.scrollLeft;
        top -= offsetParentRect.top - offsetParent.scrollTop;
      }

      // caliculate the boundaries of the visible area that contains inputField
      const scrollParent = findScrollParents(inputField);
      let scrollAreaLeft = 0;
      let scrollAreaTop = 0;
      let {
        clientWidth: scrollAreaRight,
        clientHeight: scrollAreaBottom,
      } = document.documentElement;

      if (scrollParent) {
        const scrollParentRect = scrollParent.getBoundingClientRect();
        if (scrollParentRect.top > 0) {
          scrollAreaTop = scrollParentRect.top;
        }
        if (scrollParentRect.left > 0) {
          scrollAreaLeft = scrollParentRect.left;
        }
        if (scrollParentRect.right < scrollAreaRight) {
          scrollAreaRight = scrollParentRect.right;
        }
        if (scrollParentRect.bottom < scrollAreaBottom) {
          scrollAreaBottom = scrollParentRect.bottom;
        }
      }

      // determine the horizontal orientation and left position
      let adjustment = 0;
      if (orientX === 'auto') {
        if (inputLeft < scrollAreaLeft) {
          orientX = 'left';
          adjustment = scrollAreaLeft - inputLeft;
        } else if (inputLeft + calendarWidth > scrollAreaRight) {
          orientX = 'right';
          if (scrollAreaRight < inputRight) {
            adjustment = scrollAreaRight - inputRight;
          }
        } else if (getTextDirection(inputField) === 'rtl') {
          orientX = inputRight - calendarWidth < scrollAreaLeft ? 'left' : 'right';
        } else {
          orientX = 'left';
        }
      }
      if (orientX === 'right') {
        left += inputWidth - calendarWidth;
      }
      left += adjustment;

      // determine the vertical orientation and top position
      if (orientY === 'auto') {
        if (inputTop - calendarHeight > scrollAreaTop) {
          orientY = inputBottom + calendarHeight > scrollAreaBottom ? 'top' : 'bottom';
        } else {
          orientY = 'bottom';
        }
      }
      if (orientY === 'top') {
        top -= calendarHeight;
      } else {
        top += inputHeight;
      }

      classList.remove(...Object.values(orientClasses));
      classList.add(orientClasses[orientX], orientClasses[orientY]);

      style.left = toPx(left);
      style.top = toPx(top);
    }

    setViewSwitchLabel(labelText) {
      this.controls.viewSwitch.textContent = labelText;
    }

    setPrevBtnDisabled(disabled) {
      this.controls.prevBtn.disabled = disabled;
    }

    setNextBtnDisabled(disabled) {
      this.controls.nextBtn.disabled = disabled;
    }

    changeView(viewId) {
      const oldView = this.currentView;
      const newView =  this.views[viewId];
      if (newView.id !== oldView.id) {
        this.currentView = newView;
        this._renderMethod = 'render';
        triggerDatepickerEvent(this.datepicker, 'changeView');
        this.main.replaceChild(newView.element, oldView.element);
      }
      return this;
    }

    // Change the focused date (view date)
    changeFocus(newViewDate) {
      this._renderMethod = setViewDate(this, newViewDate) ? 'render' : 'refreshFocus';
      this.views.forEach((view) => {
        view.updateFocus();
      });
      return this;
    }

    // Apply the change of the selected dates
    update() {
      const newViewDate = computeResetViewDate(this.datepicker);
      this._renderMethod = setViewDate(this, newViewDate) ? 'render' : 'refresh';
      this.views.forEach((view) => {
        view.updateFocus();
        view.updateSelection();
      });
      return this;
    }

    // Refresh the picker UI
    render(quickRender = true) {
      const renderMethod = (quickRender && this._renderMethod) || 'render';
      delete this._renderMethod;

      this.currentView[renderMethod]();
    }
  }

  // Find the closest date that doesn't meet the condition for unavailable date
  // Returns undefined if no available date is found
  // addFn: function to calculate the next date
  //   - args: time value, amount
  // increase: amount to pass to addFn
  // testFn: function to test the unavailablity of the date
  //   - args: time value; retun: true if unavailable
  function findNextAvailableOne(date, addFn, increase, testFn, min, max) {
    if (!isInRange(date, min, max)) {
      return;
    }
    if (testFn(date)) {
      const newDate = addFn(date, increase);
      return findNextAvailableOne(newDate, addFn, increase, testFn, min, max);
    }
    return date;
  }

  // direction: -1 (left/up), 1 (right/down)
  // vertical: true for up/down, false for left/right
  function moveByArrowKey(datepicker, ev, direction, vertical) {
    const picker = datepicker.picker;
    const currentView = picker.currentView;
    const step = currentView.step || 1;
    let viewDate = picker.viewDate;
    let addFn;
    let testFn;
    switch (currentView.id) {
      case 0:
        if (vertical) {
          viewDate = addDays(viewDate, direction * 7);
        } else if (ev.ctrlKey || ev.metaKey) {
          viewDate = addYears(viewDate, direction);
        } else {
          viewDate = addDays(viewDate, direction);
        }
        addFn = addDays;
        testFn = (date) => currentView.disabled.includes(date);
        break;
      case 1:
        viewDate = addMonths(viewDate, vertical ? direction * 4 : direction);
        addFn = addMonths;
        testFn = (date) => {
          const dt = new Date(date);
          const {year, disabled} = currentView;
          return dt.getFullYear() === year && disabled.includes(dt.getMonth());
        };
        break;
      default:
        viewDate = addYears(viewDate, direction * (vertical ? 4 : 1) * step);
        addFn = addYears;
        testFn = date => currentView.disabled.includes(startOfYearPeriod(date, step));
    }
    viewDate = findNextAvailableOne(
      viewDate,
      addFn,
      direction < 0 ? -step : step,
      testFn,
      currentView.minDate,
      currentView.maxDate
    );
    if (viewDate !== undefined) {
      picker.changeFocus(viewDate).render();
    }
  }

  function onKeydown(datepicker, ev) {
    const key = ev.key;
    if (key === 'Tab') {
      unfocus(datepicker);
      return;
    }

    const picker = datepicker.picker;
    const {id, isMinView} = picker.currentView;
    if (!picker.active) {
      if (key === 'ArrowDown') {
        picker.show();
      } else {
        if (key === 'Enter') {
          datepicker.update();
        } else if (key === 'Escape') {
          picker.show();
        }
        return;
      }
    } else if (datepicker.editMode) {
      if (key === 'Enter') {
        datepicker.exitEditMode({update: true, autohide: datepicker.config.autohide});
      } else if (key === 'Escape') {
        picker.hide();
      }
      return;
    } else {
      if (key === 'ArrowLeft') {
        if (ev.ctrlKey || ev.metaKey) {
          goToPrevOrNext(datepicker, -1);
        } else if (ev.shiftKey) {
          datepicker.enterEditMode();
          return;
        } else {
          moveByArrowKey(datepicker, ev, -1, false);
        }
      } else if (key === 'ArrowRight') {
        if (ev.ctrlKey || ev.metaKey) {
          goToPrevOrNext(datepicker, 1);
        } else if (ev.shiftKey) {
          datepicker.enterEditMode();
          return;
        } else {
          moveByArrowKey(datepicker, ev, 1, false);
        }
      } else if (key === 'ArrowUp') {
        if (ev.ctrlKey || ev.metaKey) {
          switchView(datepicker);
        } else if (ev.shiftKey) {
          datepicker.enterEditMode();
          return;
        } else {
          moveByArrowKey(datepicker, ev, -1, true);
        }
      } else if (key === 'ArrowDown') {
        if (ev.shiftKey && !ev.ctrlKey && !ev.metaKey) {
          datepicker.enterEditMode();
          return;
        }
        moveByArrowKey(datepicker, ev, 1, true);
      } else if (key === 'Enter') {
        if (isMinView) {
          datepicker.setDate(picker.viewDate);
          return;
        }
        picker.changeView(id - 1).render();
      } else {
        if (key === 'Escape') {
          picker.hide();
        } else if (
          key === 'Backspace'
          || key === 'Delete'
          || (key.length === 1 && !ev.ctrlKey && !ev.metaKey)
        ) {
          datepicker.enterEditMode();
        }
        return;
      }
    }
    ev.preventDefault();
  }

  function onFocus(datepicker) {
    if (datepicker.config.showOnFocus && !datepicker._showing) {
      datepicker.show();
    }
  }

  // for the prevention for entering edit mode while getting focus on click
  function onMousedown(datepicker, ev) {
    const el = ev.target;
    if (datepicker.picker.active || datepicker.config.showOnClick) {
      el._active = isActiveElement(el);
      el._clicking = setTimeout(() => {
        delete el._active;
        delete el._clicking;
      }, 2000);
    }
  }

  function onClickInput(datepicker, ev) {
    const el = ev.target;
    if (!el._clicking) {
      return;
    }
    clearTimeout(el._clicking);
    delete el._clicking;

    if (el._active) {
      datepicker.enterEditMode();
    }
    delete el._active;

    if (datepicker.config.showOnClick) {
      datepicker.show();
    }
  }

  function onPaste(datepicker, ev) {
    if (ev.clipboardData.types.includes('text/plain')) {
      datepicker.enterEditMode();
    }
  }

  // for the `document` to delegate the events from outside the picker/input field
  function onClickOutside(datepicker, ev) {
    const {element, picker} = datepicker;
    // check both picker's and input's activeness to make updateOnBlur work in
    // the cases where...
    // - picker is hidden by ESC key press → input stays focused
    // - input is unfocused by closing mobile keyboard → piker is kept shown
    if (!picker.active && !isActiveElement(element)) {
      return;
    }
    const pickerElem = picker.element;
    if (findElementInEventPath(ev, el => el === element || el === pickerElem)) {
      return;
    }
    unfocus(datepicker);
  }

  function stringifyDates(dates, config) {
    return dates
      .map(dt => formatDate(dt, config.format, config.locale))
      .join(config.dateDelimiter);
  }

  // parse input dates and create an array of time values for selection
  // returns undefined if there are no valid dates in inputDates
  // when origDates (current selection) is passed, the function works to mix
  // the input dates into the current selection
  function processInputDates(datepicker, inputDates, clear = false) {
    // const {config, dates: origDates, rangepicker} = datepicker;
    const {config, dates: origDates, rangeSideIndex} = datepicker;
    if (inputDates.length === 0) {
      // empty input is considered valid unless origiDates is passed
      return clear ? [] : undefined;
    }

    // const rangeEnd = rangepicker && datepicker === rangepicker.datepickers[1];
    let newDates = inputDates.reduce((dates, dt) => {
      let date = parseDate(dt, config.format, config.locale);
      if (date === undefined) {
        return dates;
      }
      // adjust to 1st of the month/Jan 1st of the year
      // or to the last day of the monh/Dec 31st of the year if the datepicker
      // is the range-end picker of a rangepicker
      date = regularizeDate(date, config.pickLevel, rangeSideIndex);
      if (
        isInRange(date, config.minDate, config.maxDate)
        && !dates.includes(date)
        && !config.datesDisabled.includes(date)
        && (config.pickLevel > 0 || !config.daysOfWeekDisabled.includes(new Date(date).getDay()))
      ) {
        dates.push(date);
      }
      return dates;
    }, []);
    if (newDates.length === 0) {
      return;
    }
    if (config.multidate && !clear) {
      // get the synmetric difference between origDates and newDates
      newDates = newDates.reduce((dates, date) => {
        if (!origDates.includes(date)) {
          dates.push(date);
        }
        return dates;
      }, origDates.filter(date => !newDates.includes(date)));
    }
    // do length check always because user can input multiple dates regardless of the mode
    return config.maxNumberOfDates && newDates.length > config.maxNumberOfDates
      ? newDates.slice(config.maxNumberOfDates * -1)
      : newDates;
  }

  // refresh the UI elements
  // modes: 1: input only, 2, picker only, 3 both
  function refreshUI(datepicker, mode = 3, quickRender = true) {
    const {config, picker, inputField} = datepicker;
    if (mode & 2) {
      const newView = picker.active ? config.pickLevel : config.startView;
      picker.update().changeView(newView).render(quickRender);
      removeInputInlineErrorMessage(datepicker);
    }
    if (mode & 1 && inputField) {
      inputField.value = stringifyDates(datepicker.dates, config);
    }
  }

  function setDate(datepicker, inputDates, options) {
    let {clear, render, autohide, revert} = options;
    if (render === undefined) {
      render = true;
    }
    if (!render) {
      autohide = false;
    } else if (autohide === undefined) {
      autohide = datepicker.config.autohide;
    }

    const newDates = processInputDates(datepicker, inputDates, clear);
    if (!newDates && !revert) {
      return;
    }
    if (newDates && newDates.toString() !== datepicker.dates.toString()) {
      datepicker.dates = newDates;
      refreshUI(datepicker, render ? 3 : 1);
      triggerDatepickerEvent(datepicker, 'changeDate');
    } else {
      refreshUI(datepicker, 1);
    }

    if (autohide) {
      datepicker.hide();
    }
  }

  /**
   * Class representing a date picker
   */
  class Datepicker {
    /**
     * Create a date picker
     * @param  {Element} element - element to bind a date picker
     * @param  {Object} [options] - config options
     * @param  {DateRangePicker} [rangepicker] - DateRangePicker instance the
     * date picker belongs to. Use this only when creating date picker as a part
     * of date range picker
     */
    constructor(element, options = {}, rangepicker = undefined) {
      element.datepicker = this;
      this.element = element;

      const config = this.config = Object.assign({
        buttonClass: (options.buttonClass && String(options.buttonClass)) || 'button',
        container: null,
        defaultViewDate: today(),
        maxDate: undefined,
        minDate: undefined,
      }, processOptions(defaultOptions, this));
      // configure by type
      const inline = this.inline = element.tagName !== 'INPUT';
      let inputField;
      if (inline) {
        config.container = element;
      } else {
        if (options.container) {
          // omit string type check because it doesn't guarantee to avoid errors
          // (invalid selector string causes abend with sytax error)
          config.container = options.container instanceof HTMLElement
            ? options.container
            : document.querySelector(options.container);
        }
        inputField = this.inputField = element;
        inputField.classList.add('datepicker-input');
      }
      if (rangepicker) {
        // check validiry
        const index = rangepicker.inputs.indexOf(inputField);
        const datepickers = rangepicker.datepickers;
        if (index < 0 || index > 1 || !Array.isArray(datepickers)) {
          throw Error('Invalid rangepicker object.');
        }
        // attach itaelf to the rangepicker here so that processInputDates() can
        // determine if this is the range-end picker of the rangepicker while
        // setting inital values when pickLevel > 0
        datepickers[index] = this;
        // add getter for rangepicker
        Object.defineProperty(this, 'rangepicker', {
          get() {
            return rangepicker;
          },
        });
        Object.defineProperty(this, 'rangeSideIndex', {
          get() {
            return index;
          },
        });
      }

      // set up config
      this._options = options;
      Object.assign(config, processOptions(options, this));

      // set initial dates
      let initialDates;
      if (inline) {
        initialDates = stringToArray(element.dataset.date, config.dateDelimiter);
        delete element.dataset.date;
      } else {
        initialDates = stringToArray(inputField.value, config.dateDelimiter);
      }
      this.dates = [];
      // process initial value
      const inputDateValues = processInputDates(this, initialDates);
      if (inputDateValues && inputDateValues.length > 0) {
        this.dates = inputDateValues;
      }
      if (inputField) {
        inputField.value = stringifyDates(this.dates, config);
      }

      const picker = this.picker = new Picker(this);

      if (inline) {
        this.show();
      } else {
        // set up event listeners in other modes
        const onMousedownDocument = onClickOutside.bind(null, this);
        const listeners = [
          [inputField, 'keydown', onKeydown.bind(null, this)],
          [inputField, 'focus', onFocus.bind(null, this)],
          [inputField, 'mousedown', onMousedown.bind(null, this)],
          [inputField, 'click', onClickInput.bind(null, this)],
          [inputField, 'paste', onPaste.bind(null, this)],
          [document, 'mousedown', onMousedownDocument],
          [document, 'touchstart', onMousedownDocument],
          [window, 'resize', picker.place.bind(picker)]
        ];
        registerListeners(this, listeners);
      }
    }

    /**
     * Format Date object or time value in given format and language
     * @param  {Date|Number} date - date or time value to format
     * @param  {String|Object} format - format string or object that contains
     * toDisplay() custom formatter, whose signature is
     * - args:
     *   - date: {Date} - Date instance of the date passed to the method
     *   - format: {Object} - the format object passed to the method
     *   - locale: {Object} - locale for the language specified by `lang`
     * - return:
     *     {String} formatted date
     * @param  {String} [lang=en] - language code for the locale to use
     * @return {String} formatted date
     */
    static formatDate(date, format, lang) {
      return formatDate(date, format, lang && locales[lang] || locales.en);
    }

    /**
     * Parse date string
     * @param  {String|Date|Number} dateStr - date string, Date object or time
     * value to parse
     * @param  {String|Object} format - format string or object that contains
     * toValue() custom parser, whose signature is
     * - args:
     *   - dateStr: {String|Date|Number} - the dateStr passed to the method
     *   - format: {Object} - the format object passed to the method
     *   - locale: {Object} - locale for the language specified by `lang`
     * - return:
     *     {Date|Number} parsed date or its time value
     * @param  {String} [lang=en] - language code for the locale to use
     * @return {Number} time value of parsed date
     */
    static parseDate(dateStr, format, lang) {
      return parseDate(dateStr, format, lang && locales[lang] || locales.en);
    }

    /**
     * @type {Object} - Installed locales in `[languageCode]: localeObject` format
     * en`:_English (US)_ is pre-installed.
     */
    static get locales() {
      return locales;
    }

    /**
     * @type {Boolean} - Whether the picker element is shown. `true` whne shown
     */
    get active() {
      return !!(this.picker && this.picker.active);
    }

    /**
     * @type {HTMLDivElement} - DOM object of picker element
     */
    get pickerElement() {
      return this.picker ? this.picker.element : undefined;
    }

    /**
     * Set new values to the config options
     * @param {Object} options - config options to update
     */
    setOptions(options) {
      const picker = this.picker;
      const newOptions = processOptions(options, this);
      Object.assign(this._options, options);
      Object.assign(this.config, newOptions);
      picker.setOptions(newOptions);

      refreshUI(this, 3);
    }

    /**
     * Show the picker element
     */
    show() {
      if (this.inputField) {
        if (this.inputField.disabled) {
          return;
        }
        if (!isActiveElement(this.inputField) && !this.config.disableTouchKeyboard) {
          this._showing = true;
          this.inputField.focus();
          delete this._showing;
        }
      }
      this.picker.show();
    }

    /**
     * Hide the picker element
     * Not available on inline picker
     */
    hide() {
      if (this.inline) {
        return;
      }
      this.picker.hide();
      this.picker.update().changeView(this.config.startView).render();
    }

    /**
     * Destroy the Datepicker instance
     * @return {Detepicker} - the instance destroyed
     */
    destroy() {
      this.hide();
      unregisterListeners(this);
      this.picker.detach();
      if (!this.inline) {
        this.inputField.classList.remove('datepicker-input');
      }
      delete this.element.datepicker;
      return this;
    }

    /**
     * Get the selected date(s)
     *
     * The method returns a Date object of selected date by default, and returns
     * an array of selected dates in multidate mode. If format string is passed,
     * it returns date string(s) formatted in given format.
     *
     * @param  {String} [format] - Format string to stringify the date(s)
     * @return {Date|String|Date[]|String[]} - selected date(s), or if none is
     * selected, empty array in multidate mode and untitled in sigledate mode
     */
    getDate(format = undefined) {
      const callback = format
        ? date => formatDate(date, format, this.config.locale)
        : date => new Date(date);

      if (this.config.multidate) {
        return this.dates.map(callback);
      }
      if (this.dates.length > 0) {
        return callback(this.dates[0]);
      }
    }

    /**
     * Set selected date(s)
     *
     * In multidate mode, you can pass multiple dates as a series of arguments
     * or an array. (Since each date is parsed individually, the type of the
     * dates doesn't have to be the same.)
     * The given dates are used to toggle the select status of each date. The
     * number of selected dates is kept from exceeding the length set to
     * maxNumberOfDates.
     *
     * With clear: true option, the method can be used to clear the selection
     * and to replace the selection instead of toggling in multidate mode.
     * If the option is passed with no date arguments or an empty dates array,
     * it works as "clear" (clear the selection then set nothing), and if the
     * option is passed with new dates to select, it works as "replace" (clear
     * the selection then set the given dates)
     *
     * When render: false option is used, the method omits re-rendering the
     * picker element. In this case, you need to call refresh() method later in
     * order for the picker element to reflect the changes. The input field is
     * refreshed always regardless of this option.
     *
     * When invalid (unparsable, repeated, disabled or out-of-range) dates are
     * passed, the method ignores them and applies only valid ones. In the case
     * that all the given dates are invalid, which is distinguished from passing
     * no dates, the method considers it as an error and leaves the selection
     * untouched. (The input field also remains untouched unless revert: true
     * option is used.)
     *
     * @param {...(Date|Number|String)|Array} [dates] - Date strings, Date
     * objects, time values or mix of those for new selection
     * @param {Object} [options] - function options
     * - clear: {boolean} - Whether to clear the existing selection
     *     defualt: false
     * - render: {boolean} - Whether to re-render the picker element
     *     default: true
     * - autohide: {boolean} - Whether to hide the picker element after re-render
     *     Ignored when used with render: false
     *     default: config.autohide
     * - revert: {boolean} - Whether to refresh the input field when all the
     *     passed dates are invalid
     *     default: false
     */
    setDate(...args) {
      const dates = [...args];
      const opts = {};
      const lastArg = lastItemOf(args);
      if (
        typeof lastArg === 'object'
        && !Array.isArray(lastArg)
        && !(lastArg instanceof Date)
        && lastArg
      ) {
        Object.assign(opts, dates.pop());
      }

      const inputDates = Array.isArray(dates[0]) ? dates[0] : dates;
      setDate(this, inputDates, opts);
    }

    /**
     * Update the selected date(s) with input field's value
     * Not available on inline picker
     *
     * The input field will be refreshed with properly formatted date string.
     *
     * In the case that all the entered dates are invalid (unparsable, repeated,
     * disabled or out-of-range), whixh is distinguished from empty input field,
     * the method leaves the input field untouched as well as the selection by
     * default. If revert: true option is used in this case, the input field is
     * refreshed with the existing selection.
     *
     * @param  {Object} [options] - function options
     * - autohide: {boolean} - whether to hide the picker element after refresh
     *     default: false
     * - revert: {boolean} - Whether to refresh the input field when all the
     *     passed dates are invalid
     *     default: false
     */
    update(options = undefined) {
      if (this.inline) {
        return;
      }
      ValidateInputInline(this); //calling function to check for validation when manually entering the value
      const opts = Object.assign(options || {}, {clear: true, render: true});
      const inputDates = stringToArray(this.inputField.value, this.config.dateDelimiter);
      setDate(this, inputDates, opts);
    }

    /**
     * Refresh the picker element and the associated input field
     * @param {String} [target] - target item when refreshing one item only
     * 'picker' or 'input'
     * @param {Boolean} [forceRender] - whether to re-render the picker element
     * regardless of its state instead of optimized refresh
     */
    refresh(target = undefined, forceRender = false) {
      if (target && typeof target !== 'string') {
        forceRender = target;
        target = undefined;
      }

      let mode;
      if (target === 'picker') {
        mode = 2;
      } else if (target === 'input') {
        mode = 1;
      } else {
        mode = 3;
      }
      refreshUI(this, mode, !forceRender);
    }

    /**
     * Enter edit mode
     * Not available on inline picker or when the picker element is hidden
     */
    enterEditMode() {
      if (this.inline || !this.picker.active || this.editMode) {
        return;
      }
      this.editMode = true;
      this.inputField.classList.add('in-edit');
    }

    /**
     * Exit from edit mode
     * Not available on inline picker
     * @param  {Object} [options] - function options
     * - update: {boolean} - whether to call update() after exiting
     *     If false, input field is revert to the existing selection
     *     default: false
     */
    exitEditMode(options = undefined) {
      if (this.inline || !this.editMode) {
        return;
      }
      const opts = Object.assign({update: false}, options);
      delete this.editMode;
      this.inputField.classList.remove('in-edit');
      if (opts.update) {
        this.update(opts);
      }
    }
  }

  return Datepicker;

})();

/*  expert-page  */
XA.component.expertPage = (function($) {
  var CLASS_IS_SCROLLABLE_LEFT = 'is-ht-left';
  var CLASS_IS_SCROLLABLE_RIGHT = 'is-ht-right';
  
  var api=api || {
    /**
     * Article page parallax scrolling
     * TODO: Once 'article-page' class moved to <html>, no need to manually add. Pending BE confirmation
     */
    initStageParallax: function() {
      if (!$('.article-page').length) {
        return; // Only run on article pages
      }

      $('html').addClass('article-page'); // TODO: Remove on BE fix
      
      var $stageImage = $('.container.full-width .component.image .component-content > div');
      var hasImage = $stageImage.find('img');

      // Initialise parallax on first full-width container we find containing an image component
      if ($stageImage.length && hasImage.length) {
        $stageImage.css('transform', 'translateY(' + -(window.pageY * .5) + 'px)')
        
        $(window).scroll(function() {
          $stageImage.css('transform', 'translateY(' + -(window.pageYOffset * .55) + 'px)')
        });
      } else {
        // Image not set - remove wrapper to avoid excess padding
        $('.container.full-width:first-child .component.image').remove();
      }
    },

    /**
     * Remove any empty article results
     */
    removeEmptyArticleResults: function() {
      $('.mod-article-list-search-results ul.items > li').each(function() {
        if (!$(this).children().length) {
          $(this).remove();
        }
      });
    },

    initRelatedArticlesSlider: function() {
      var self = this;

      if (!$('.related-articles').length) {
        return; // Only run if related-articles exist
      }

      var $relatedArticles = $('.related-articles .teaser.teaser-related');
      var $articles =  $('<div></div>').addClass('article-scroll__inlay') .scroll(function(e) {
        var $navGroup = $(e.target);
        self.onArticleScroll($navGroup);
      }).prepend($relatedArticles);

      $('.related-articles .component-content > div').append(
        $('<div></div>').addClass('article-scroll').prepend(  
          $('<button></button>')
              .addClass('article-scroll__btn article-scroll__btn-left')
              .attr('aria-label', 'scroll left')
              .click(self.onArticleScrollClick),
          $articles,
          $('<button></button>')
              .addClass('article-scroll__btn article-scroll__btn-right')
              .attr('aria-label', 'scroll right')
              .click(self.onArticleScrollClick)
        )
      )
    },

    /**
     * Handles scroll event on related articles (hides/shows arrows)
     * @param {} $headingInlay $('.article-scroll__inlay')
     */
    onArticleScroll: function($headingInlay) {
      var headingInlayScrollLeft = $headingInlay.scrollLeft();
      var headingInlayScrollWidth = $headingInlay[0].scrollWidth;
      var headingInlayInnerWidth = $headingInlay.innerWidth();
      var $htScroller = $headingInlay.parents('.article-scroll');

      if (headingInlayScrollWidth > headingInlayInnerWidth) {
        $htScroller.addClass('has-scroller');
      } else {
        $htScroller.removeClass('has-scroller');
      }

      if (headingInlayScrollLeft > 10) {
        $htScroller.addClass(CLASS_IS_SCROLLABLE_LEFT);
      } else {
        $htScroller.removeClass(CLASS_IS_SCROLLABLE_LEFT);
      }

      if (headingInlayScrollLeft + (headingInlayInnerWidth + 10) >= headingInlayScrollWidth) {
        $htScroller.removeClass(CLASS_IS_SCROLLABLE_RIGHT);
      } else {
        $htScroller.addClass(CLASS_IS_SCROLLABLE_RIGHT);
      }
    },

    /**
     * Handles horizontal related-articles scrolling on arrow click
     * @param {Event} e 
     */
    onArticleScrollClick: function(e) {
      var $btnScroller = $(e.target);
      var $htScroller = $btnScroller.siblings('.article-scroll__inlay');

      if ($btnScroller.hasClass('article-scroll__btn-right')) {
        $htScroller.animate({ scrollLeft: '+=250px' }, 300);
      } else {
        $htScroller.animate({ scrollLeft: '-=250px' }, 300);
      }
    },

    /**
     * Check and reset scroll arrows
     */
    checkArticleScrollOnLoad: function() {
      var self = this;
      $('.article-scroll__inlay').each(function() {
        self.onArticleScroll($(this));
      });
    },

    /**
     * Init pageload events
     */
    setEventHandlers: function() {
      var self = this;

      $(window).on('resize', function() {
        self.checkArticleScrollOnLoad();
      });
    },
  };

  
  api.init = function() {
    if ( ($('script[type="IN/MemberProfile"]').length) && $('.teaser--expert').length) {
      $.getScript("//platform.linkedin.com/in.js");
    }

    this.api.initStageParallax();
    this.api.initRelatedArticlesSlider();
    this.api.checkArticleScrollOnLoad();
    this.api.setEventHandlers();
    this.api.removeEmptyArticleResults();
  };

  return api;
})(jQuery, document);

XA.register('expertPage', XA.component.expertPage);


/*  focus-area  */
XA.component.focusAreaComponent = (function($) {
  var api=api || {};

  api.init = function() {
    $('.component.focus-area').each(function() {
      $(this).find('.focus-area-element').wrapAll('<div class="focus-area-wrapper" />');
      $(this).find('h3:only-child').addClass('heading-only');
    });

    $('.focus-area-element a[href]').each(function() {
      $(this).parent().parent().addClass('with-link');  
    });

    $('.focus-area-element p.field-content').each(function() {
      if (!$(this).text().trim().length) {
          $(this).addClass('empty-field-content');
          $(this).siblings('h3').addClass('heading-only');
      }
    });
    
    $('.toggle-on-focus-area').on('click', function($) {
      $.currentTarget.closest('.focus-area').classList.add('is-open')
    });
    $('.toggle-off-focus-area').on('click', function($) {
      $.currentTarget.closest('.focus-area').classList.remove('is-open')
    });

    // Only show toggle if < 5 teaser-focus-element
    $('.focus-area').each(function() {
      var focusCount = $(this).find('.teaser-focus-element').length;

      if (focusCount < 5) {
        $(this).find('.focus-area-toggle').hide();
      }
    })
  };

  return api;
})(jQuery, document);

XA.register('focusAreaComponent', XA.component.focusAreaComponent);





/*  form-tracking  */
XA.component.FormTracking = (function ($) {
    var api = {
        initWFFMTracking: function () {
            //Track Fill-In Event tracking
            $('.form-group input, .form-group textarea').on('focusout input[type!="submit"]', function (e) {
                var formGroup = $(this).parent(".form-group");
                var fieldLabel = $(this).prev('label').text();
                var args = api.GetArgs();
                args['event_eventInfo_label'] = fieldLabel;
                args['event_element_elementName'] = fieldLabel;

                //Track FE-error-validations
                if (formGroup.children("span.field-validation-error").length > 0) {
                    args['event_eventInfo_effect'] = 'appear';
                    args['error_errorInfo_elementName'] = fieldLabel;
                    args['error_errorInfo_message'] = formGroup.children("span.field-validation-error").text();
                    args['error_errorInfo_type'] = 'validation-error-frontend';
                    console.log('fill-in-error' + fieldLabel + JSON.stringify(args));
                }
                else {
                    args['event_eventInfo_effect'] = "fill-in";
                    console.log('Fill-In event of field: ' + fieldLabel + JSON.stringify(args));
                }
                var utagArgs = args;
                utag.link(utagArgs);
            });

            //Error tracking FE on Submit event
            $('.form-submit-border > .btn').on('click', function (e) {
                $('form .form-group .form-control').each(function (index) {
                    var self = $(this).parent();
                    if (($(this).val() == "" && $(this).data("val-required") !== undefined) || ($(this).data("val-regex") !== undefined && $(this).next('span').hasClass('field-validation-error'))) {
                        $(this).next('span.help-block').removeClass('field-validation-valid').addClass('field-validation-error').text($(this).data("val-required"));
                        api.TrackValidationError('validation-error-frontend', self);
                    }
                });

            });
        },

        GetArgs: function () {
            var args = {};
            var trackLevelContent = $('form').parent().data('track-levelcontent');
            if (typeof trackLevelContent != 'undefined' & trackLevelContent != null) {
                var parsedContent = JSON.parse(JSON.stringify(trackLevelContent));
                args['component_componentInfo_componentType'] = parsedContent['component_componentInfo_componentType'];
                args['component_componentInfo_componentID'] = parsedContent['component_componentInfo_componentID'];
                args['event_category_primaryCategory'] = parsedContent['event_category_primaryCategory'];
            }
            return args;
        },

        TrackSubmitEvent: function (self) {
            var args = api.GetArgs();
            var submitAttr = $('.form-submit-border > .btn').data('track-elementcontent');
            submitAttr = $('<div/>').html(submitAttr).text();
            var elementName = '';
            if (typeof submitAttr != 'undefined' & submitAttr != null) {
                var parsedSubmitAttr = JSON.parse(submitAttr);
                elementName = parsedSubmitAttr['element_elementInfo_elementName'];
            }
            args['event_eventInfo_effect'] = 'submit';
            args['event_eventInfo_label'] = 'send-request';
            args['event_element_elementName'] = elementName;
            var utagArgs = args;
            utag.link(utagArgs);
        },

        TrackConfirmEvent: function () {
            var args = api.GetArgs();
            args['event_eventInfo_effect'] = 'complete';
            args['event_eventInfo_label'] = 'request-sent';
            args['conversion_conversionInfo_conversionClass'] = $('#' + $('form').attr('id') + '_conversion-class').val();
            var utagArgs = args;
            utag.link(utagArgs);
        },

        populateUDOCookie: function () {
            var udo_Array = {};
            if (typeof utag_data != 'undefined') {
                if (utag_data['page_pageInfo_language'] != '') {
                    udo_Array['page_pageInfo_language'] = utag_data['page_pageInfo_language'];
                }
                if (utag_data['page_category_primaryCategory'] != '') {
                    udo_Array['page_category_primaryCategory'] = utag_data['page_category_primaryCategory'];
                }
                var relUrl = $('link[rel="canonical"]').attr('href').replace(/^(?:\/\/|[^\/]+)*\//, "")
                var catCount = typeof relUrl !== 'undefined' ? relUrl.split('/').length : 0;
                if (catCount > 0) {
                    for (var n = 1; n < catCount; n++) {
                        if (utag_data['page_category_subCategory' + n] != '') {
                            udo_Array['page_category_subCategory' + n] = utag_data['page_category_subCategory' + n];
                        }
                    }
                }
                if (utag_data['platform_platformInfo_environment'] != '') {
                    udo_Array['platform_platformInfo_environment'] = utag_data['platform_platformInfo_environment'];
                }
                if (utag_data['page_pageInfo_templateType'] != '') {
                    udo_Array['page_pageInfo_templateType'] = utag_data['page_pageInfo_templateType'];
                }
                if (utag_data['content_contentInfo_author'] != '') {
                    udo_Array['content_contentInfo_author'] = utag_data['content_contentInfo_author'];
                }
                if (utag_data['content_attributes_expert'] != '') {
                    udo_Array['content_attributes_expert'] = utag_data['content_attributes_expert'];
                }
                if (utag_data['content_attributes_topic'] != '') {
                    udo_Array['content_attributes_topic'] = utag_data['content_attributes_topic'];
                }
                if (utag_data['content_contentInfo_contentType'] != '') {
                    udo_Array['content_contentInfo_contentType'] = utag_data['content_contentInfo_contentType'];
                }
                if (utag_data['content_contentInfo_publisher'] != '') {
                    udo_Array['content_contentInfo_publisher'] = utag_data['content_contentInfo_publisher'];
                }
                if (utag_data['page_attributes_refMktURL'] != '') {
                    udo_Array['page_attributes_refMktURL'] = utag_data['page_attributes_refMktURL'];
                }
                if (utag_data['platform_platformInfo_platformName'] != '') {
                    udo_Array['platform_platformInfo_platformName'] = utag_data['platform_platformInfo_platformName'];
                }
            }

            var utagDataVal = XA.cookies.readCookie('form_udo');
            if (typeof utagDataVal != 'undefined' && utagDataVal != null) {
                api.deleteCookie('form_udo');
            }
            XA.cookies.createCookie('form_udo', JSON.stringify(udo_Array), 1);
        },

        checkIfThankYouPage: function () {
            var utagData = XA.cookies.readCookie('form_udo');
            if (typeof utagData != 'undefined' && utagData != '') {
                api.deleteCookie('form_udo');
                var udoArgs = utagData.replace(/"/g, '\'');
                utag.link(udoArgs)
            }
        },

        TrackValidationError: function (valType, self) {
            if ($(self).children("span.field-validation-error").length > 0) {
                var args = api.GetArgs();
                var fieldLabel = $(self).children('label').text();
                args['event_eventInfo_effect'] = 'appear';
                args['event_eventInfo_label'] = fieldLabel;
                args['event_element_elementName'] = fieldLabel;

                args['error_errorInfo_elementName'] = fieldLabel;
                args['error_errorInfo_message'] = $(self).children("span.field-validation-error").text();
                args['error_errorInfo_type'] = valType;
                utag.link(args);
            }
        },

        TrackBackendValidation: function () {
            //BE Validation event
            if ($('.list-group-item-warning').length > 0) {
                var errorType = 'validation-error-backend';
                var fieldLabel = 'bg-warning';
                var errorMsg = $('.list-group-item-warning').text();
                var args = api.GetArgs();

                args['event_eventInfo_effect'] = 'appear';
                args['event_eventInfo_label'] = fieldLabel;
                args['event_element_elementName'] = fieldLabel;

                args['error_errorInfo_message'] = errorMsg;
                args['error_errorInfo_type'] = errorType;
                utag.link(args);

                //Field level validations if any
                $('form .form-group').each(function () {
                    var self = this;
                    if ($(self).children("span.field-validation-error").length > 0) {
                        api.TrackValidationError(errorType, self);
                    }
                });
            }
        },

        deleteCookie: function (key) {
            document.cookie = key + '=; expires=Thu, 01-Jan-70 00:00:01 GMT;path=/';
        }
    };

    api.init = function () {
        try {
            if (typeof $('form').data('wffm') !== 'undefined') {
                if (typeof utag != 'undefined' & utag != null)
                    this.api.initWFFMTracking();
            }
            else {
                api.checkIfThankYouPage();
            }
        } catch (e) {
            if (e instanceof ReferenceError) {
                console.log('utag is not defined');
            };
        }
    };
    return api;
})(jQuery, document);
XA.register("FormTracking", XA.component.FormTracking);

/*  google-marker-cluster  */
(function(){var d=null;function e(a){return function(b){this[a]=b}}function h(a){return function(){return this[a]}}var j;
function k(a,b,c){this.extend(k,google.maps.OverlayView);this.c=a;this.a=[];this.f=[];this.ca=[53,56,66,78,90];this.j=[];this.A=!1;c=c||{};this.g=c.gridSize||60;this.l=c.minimumClusterSize||2;this.J=c.maxZoom||d;this.j=c.styles||[];this.X=c.imagePath||this.Q;this.W=c.imageExtension||this.P;this.O=!0;if(c.zoomOnClick!=void 0)this.O=c.zoomOnClick;this.r=!1;if(c.averageCenter!=void 0)this.r=c.averageCenter;l(this);this.setMap(a);this.K=this.c.getZoom();var f=this;google.maps.event.addListener(this.c,
"zoom_changed",function(){var a=f.c.getZoom();if(f.K!=a)f.K=a,f.m()});google.maps.event.addListener(this.c,"idle",function(){f.i()});b&&b.length&&this.C(b,!1)}j=k.prototype;j.Q="http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/images/m";j.P="png";j.extend=function(a,b){return function(a){for(var b in a.prototype)this.prototype[b]=a.prototype[b];return this}.apply(a,[b])};j.onAdd=function(){if(!this.A)this.A=!0,n(this)};j.draw=function(){};
function l(a){if(!a.j.length)for(var b=0,c;c=a.ca[b];b++)a.j.push({url:a.X+(b+1)+"."+a.W,height:c,width:c})}j.S=function(){for(var a=this.o(),b=new google.maps.LatLngBounds,c=0,f;f=a[c];c++)b.extend(f.getPosition());this.c.fitBounds(b)};j.z=h("j");j.o=h("a");j.V=function(){return this.a.length};j.ba=e("J");j.I=h("J");j.G=function(a,b){for(var c=0,f=a.length,g=f;g!==0;)g=parseInt(g/10,10),c++;c=Math.min(c,b);return{text:f,index:c}};j.$=e("G");j.H=h("G");
j.C=function(a,b){for(var c=0,f;f=a[c];c++)q(this,f);b||this.i()};function q(a,b){b.s=!1;b.draggable&&google.maps.event.addListener(b,"dragend",function(){b.s=!1;a.L()});a.a.push(b)}j.q=function(a,b){q(this,a);b||this.i()};function r(a,b){var c=-1;if(a.a.indexOf)c=a.a.indexOf(b);else for(var f=0,g;g=a.a[f];f++)if(g==b){c=f;break}if(c==-1)return!1;b.setMap(d);a.a.splice(c,1);return!0}j.Y=function(a,b){var c=r(this,a);return!b&&c?(this.m(),this.i(),!0):!1};
j.Z=function(a,b){for(var c=!1,f=0,g;g=a[f];f++)g=r(this,g),c=c||g;if(!b&&c)return this.m(),this.i(),!0};j.U=function(){return this.f.length};j.getMap=h("c");j.setMap=e("c");j.w=h("g");j.aa=e("g");
j.v=function(a){var b=this.getProjection(),c=new google.maps.LatLng(a.getNorthEast().lat(),a.getNorthEast().lng()),f=new google.maps.LatLng(a.getSouthWest().lat(),a.getSouthWest().lng()),c=b.fromLatLngToDivPixel(c);c.x+=this.g;c.y-=this.g;f=b.fromLatLngToDivPixel(f);f.x-=this.g;f.y+=this.g;c=b.fromDivPixelToLatLng(c);b=b.fromDivPixelToLatLng(f);a.extend(c);a.extend(b);return a};j.R=function(){this.m(!0);this.a=[]};
j.m=function(a){for(var b=0,c;c=this.f[b];b++)c.remove();for(b=0;c=this.a[b];b++)c.s=!1,a&&c.setMap(d);this.f=[]};j.L=function(){var a=this.f.slice();this.f.length=0;this.m();this.i();window.setTimeout(function(){for(var b=0,c;c=a[b];b++)c.remove()},0)};j.i=function(){n(this)};
function n(a){if(a.A)for(var b=a.v(new google.maps.LatLngBounds(a.c.getBounds().getSouthWest(),a.c.getBounds().getNorthEast())),c=0,f;f=a.a[c];c++)if(!f.s&&b.contains(f.getPosition())){for(var g=a,u=4E4,o=d,v=0,m=void 0;m=g.f[v];v++){var i=m.getCenter();if(i){var p=f.getPosition();if(!i||!p)i=0;else var w=(p.lat()-i.lat())*Math.PI/180,x=(p.lng()-i.lng())*Math.PI/180,i=Math.sin(w/2)*Math.sin(w/2)+Math.cos(i.lat()*Math.PI/180)*Math.cos(p.lat()*Math.PI/180)*Math.sin(x/2)*Math.sin(x/2),i=6371*2*Math.atan2(Math.sqrt(i),
Math.sqrt(1-i));i<u&&(u=i,o=m)}}o&&o.F.contains(f.getPosition())?o.q(f):(m=new s(g),m.q(f),g.f.push(m))}}function s(a){this.k=a;this.c=a.getMap();this.g=a.w();this.l=a.l;this.r=a.r;this.d=d;this.a=[];this.F=d;this.n=new t(this,a.z(),a.w())}j=s.prototype;
j.q=function(a){var b;a:if(this.a.indexOf)b=this.a.indexOf(a)!=-1;else{b=0;for(var c;c=this.a[b];b++)if(c==a){b=!0;break a}b=!1}if(b)return!1;if(this.d){if(this.r)c=this.a.length+1,b=(this.d.lat()*(c-1)+a.getPosition().lat())/c,c=(this.d.lng()*(c-1)+a.getPosition().lng())/c,this.d=new google.maps.LatLng(b,c),y(this)}else this.d=a.getPosition(),y(this);a.s=!0;this.a.push(a);b=this.a.length;b<this.l&&a.getMap()!=this.c&&a.setMap(this.c);if(b==this.l)for(c=0;c<b;c++)this.a[c].setMap(d);b>=this.l&&a.setMap(d);
a=this.c.getZoom();if((b=this.k.I())&&a>b)for(a=0;b=this.a[a];a++)b.setMap(this.c);else if(this.a.length<this.l)z(this.n);else{b=this.k.H()(this.a,this.k.z().length);this.n.setCenter(this.d);a=this.n;a.B=b;a.ga=b.text;a.ea=b.index;if(a.b)a.b.innerHTML=b.text;b=Math.max(0,a.B.index-1);b=Math.min(a.j.length-1,b);b=a.j[b];a.da=b.url;a.h=b.height;a.p=b.width;a.M=b.textColor;a.e=b.anchor;a.N=b.textSize;a.D=b.backgroundPosition;this.n.show()}return!0};
j.getBounds=function(){for(var a=new google.maps.LatLngBounds(this.d,this.d),b=this.o(),c=0,f;f=b[c];c++)a.extend(f.getPosition());return a};j.remove=function(){this.n.remove();this.a.length=0;delete this.a};j.T=function(){return this.a.length};j.o=h("a");j.getCenter=h("d");function y(a){a.F=a.k.v(new google.maps.LatLngBounds(a.d,a.d))}j.getMap=h("c");
function t(a,b,c){a.k.extend(t,google.maps.OverlayView);this.j=b;this.fa=c||0;this.u=a;this.d=d;this.c=a.getMap();this.B=this.b=d;this.t=!1;this.setMap(this.c)}j=t.prototype;
j.onAdd=function(){this.b=document.createElement("DIV");if(this.t)this.b.style.cssText=A(this,B(this,this.d)),this.b.innerHTML=this.B.text;this.getPanes().overlayMouseTarget.appendChild(this.b);var a=this;google.maps.event.addDomListener(this.b,"click",function(){var b=a.u.k;google.maps.event.trigger(b,"clusterclick",a.u);b.O&&a.c.fitBounds(a.u.getBounds())})};function B(a,b){var c=a.getProjection().fromLatLngToDivPixel(b);c.x-=parseInt(a.p/2,10);c.y-=parseInt(a.h/2,10);return c}
j.draw=function(){if(this.t){var a=B(this,this.d);this.b.style.top=a.y+"px";this.b.style.left=a.x+"px"}};function z(a){if(a.b)a.b.style.display="none";a.t=!1}j.show=function(){if(this.b)this.b.style.cssText=A(this,B(this,this.d)),this.b.style.display="";this.t=!0};j.remove=function(){this.setMap(d)};j.onRemove=function(){if(this.b&&this.b.parentNode)z(this),this.b.parentNode.removeChild(this.b),this.b=d};j.setCenter=e("d");
function A(a,b){var c=[];c.push("background-image:url("+a.da+");");c.push("background-position:"+(a.D?a.D:"0 0")+";");typeof a.e==="object"?(typeof a.e[0]==="number"&&a.e[0]>0&&a.e[0]<a.h?c.push("height:"+(a.h-a.e[0])+"px; padding-top:"+a.e[0]+"px;"):c.push("height:"+a.h+"px; line-height:"+a.h+"px;"),typeof a.e[1]==="number"&&a.e[1]>0&&a.e[1]<a.p?c.push("width:"+(a.p-a.e[1])+"px; padding-left:"+a.e[1]+"px;"):c.push("width:"+a.p+"px; text-align:center;")):c.push("height:"+a.h+"px; line-height:"+a.h+
"px; width:"+a.p+"px; text-align:center;");c.push("cursor:pointer; top:"+b.y+"px; left:"+b.x+"px; color:"+(a.M?a.M:"black")+"; position:absolute; font-size:"+(a.N?a.N:11)+"px; font-family:Arial,sans-serif; font-weight:bold");return c.join("")}window.MarkerClusterer=k;k.prototype.addMarker=k.prototype.q;k.prototype.addMarkers=k.prototype.C;k.prototype.clearMarkers=k.prototype.R;k.prototype.fitMapToMarkers=k.prototype.S;k.prototype.getCalculator=k.prototype.H;k.prototype.getGridSize=k.prototype.w;
k.prototype.getExtendedBounds=k.prototype.v;k.prototype.getMap=k.prototype.getMap;k.prototype.getMarkers=k.prototype.o;k.prototype.getMaxZoom=k.prototype.I;k.prototype.getStyles=k.prototype.z;k.prototype.getTotalClusters=k.prototype.U;k.prototype.getTotalMarkers=k.prototype.V;k.prototype.redraw=k.prototype.i;k.prototype.removeMarker=k.prototype.Y;k.prototype.removeMarkers=k.prototype.Z;k.prototype.resetViewport=k.prototype.m;k.prototype.repaint=k.prototype.L;k.prototype.setCalculator=k.prototype.$;
k.prototype.setGridSize=k.prototype.aa;k.prototype.setMaxZoom=k.prototype.ba;k.prototype.onAdd=k.prototype.onAdd;k.prototype.draw=k.prototype.draw;s.prototype.getCenter=s.prototype.getCenter;s.prototype.getSize=s.prototype.T;s.prototype.getMarkers=s.prototype.o;t.prototype.onAdd=t.prototype.onAdd;t.prototype.draw=t.prototype.draw;t.prototype.onRemove=t.prototype.onRemove;
})();

/*  map  */
/* global XA, Breakpoints, $, MarkerClusterer */
/*eslint no-console: ["error", { allow: ["log"] }] */

XA.component.mapComponent = (function($) {
  
  var api = {
    markerCluster: null,
    state: {
      countries: [],
      settings: {},
      sendEmailLabel: '',
      websiteLabel: '',
      showMapLabel: '',
      routePlannerLabel: '',
      telephoneLabel: '',
      faxLabel: ''
    },
    markers: [],
    markerIcon: '-/media/Themes/ZWP/Base/Corp/images/location-marker.png',
    closeButton: '<button value="close" class="btn-close pull-right hidden-xs"><span class="icon i-close"></span></button>',
    styles: [
      {
        stylers: [
          { 
            hue: '#006eff'
          },
          { 
            saturation: -15 
          },
        ]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [
          { 
            color: '#5178ac'
          },
          { 
            lightness: 33
          },
          { 
            saturation: -16 
          }
        ]
      },
      { 
        featureType: 'road',
        stylers: [
          { 
            hue: '#ffa200' 
          },
          { 
            saturation: -56
          }
        ]
      },
      {
        featureType: 'poi.park',
        stylers: [
          { 
            saturation: -100 
          }
        ]
      },
      {
        featureType: 'administrative',
        elementType: 'geometry',
        stylers: [
          { 
            weight: 2.1
          },
          {
            lightness: -6
          }
        ]
      }
    ],
    map: {},
    boxItem: $('.list-holder > .listitem').clone(),
    defaultMap: $('.map-canvas'),
    infoBox: $('.mapinfobox'),
    showMore: $('.list-showmore'),
    isMobile: null,
    isGlobal: null,

    /**
     * 
     * At runtime, if API key is found, attempt to inject Google Maps API script into the DOM.
     * Load map if successful
     */
    injectScript: function() {
      var key = $('.mapholder').data('mapsprovider-key');
      
      if (!key) {
        return;
      }

      var self = this;
      var script = document.createElement('script'),
                src = 'https://maps.googleapis.com/maps/api/js?v=3.exp';
      script.type = 'text/javascript';
      if (typeof key !== 'undefined' && key !== '') {
        src += '&key=' + key;
      } else {
        src += '&signed_in=false';
      }
      src += '&libraries=places&callback=XA.connector.mapsConnector.scriptsLoaded';
      script.src = src;
      script.onload = function() {
        self.loadMap();
      };

      document.body.appendChild(script);
    },

    /**
     * Generates a new Google Maps API instance
     * Uses 'data-json' attribute for map marker and list population
     */
    loadMap: function() {
      var $mapWrapper = $('.mod-Location_finder');
      var data = JSON.parse($mapWrapper.attr('data-json'));

      this.setState(data);
      this.setEventHandlers();

      this.map = new window.google.maps.Map(document.getElementById('mapcanvas'), { 
        streetViewControl: false,
        mapTypeControl: false,
        zoomControl: true,
        fullscreenControl: false,
        scrollwheel: false,
        draggable: true,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        center: this.getCenterPoint(),
        zoom: 5,
        styles: this.styles
      });

      this.isGlobal = $('.mod-Location_finder.global').length;
      
      
      if (!this.isGlobal) {
        var firstCategory = $('.mapnaviholder .category')[0];
        this.setActiveCategory(firstCategory);
      } else {
        this.setMarkers();
        this.setLocationBoxes();
      }
    },

    /**
     * When initialising the map, returns a new center point based on first country found.
     */
    getCenterPoint: function() {
      var ctry = this.state.countries[0];
      var address = ctry.ContactAddress;

      return address 
        ? new window.google.maps.LatLng(address.Latitude, address.Longitude)
        : new window.google.maps.LatLng(67.9, 56.3);
    },

    /**
     * Save country and settings from 'data-json' to api state object
     * @param {object} data 
     */
    setState: function(data) {
      var countries = _.get(data, 'countries', false);
      var settings = _.get(data, 'componentSettings', false);

      if (!settings || !countries) {
        return;
      }

      this.state.countries = countries;
      this.state.settings = settings;
      this.state.sendEmailLabel =  settings.SendEmailLabel;
      this.state.websiteLabel =  settings.WebsiteLabel;
      this.state.showMapLabel =  settings.ShowMapLabel;
      this.state.routePlannerLabel = settings.RoutePlannerlLabel;
      this.state.telephoneLabel = settings.TelephoneLabel;
      this.state.faxLabel = settings.FaxLabel;
    },


    /**
     * Set map markers based on current state countries
     */
    setMarkers: function(selectedCountry, isLocal) {
      var self = this;

      // Clear old markers (Local only)
      if (selectedCountry && !this.isGlobal) {
        for (var i = 0; i < this.markers.length; i++ ) {
          this.markers[i].setMap(null);
        }
        this.markers.length = 0;
      }

      var markers = _.reduce(this.state.countries, function(accum, country) {
        
        if (isLocal) {
          if (selectedCountry && country.ContactAddress.AddressCategory !== selectedCountry.ContactAddress.AddressCategory) {
            return accum; // If selected country Category specified, ignore other categories
          }
        } else {
          if (selectedCountry && country.Category !== selectedCountry.Category) {
            return accum; // If selected country Category specified, ignore other categories
          }
        }

        var address = country.ContactAddress;

        // Add map marker
        var marker = new window.google.maps.Marker({
          position: new window.google.maps.LatLng(address.Latitude, address.Longitude),
          title: country.ContactTitle,
          id: address.AddressPostalCode,
          icon: country.Symbol,
        });

        marker.addListener('click', function() {
          self.showLocationWindow(country, true);
        });

        // Show marker by default (Global only)
        if (self.isGlobal) {
          marker.setMap(self.map);
        }

        return accum.concat(marker);
      }, []);

      // Group markers into clusters (Global only)
      if (!this.isGlobal) {
        if (this.markerCluster) {
          this.markerCluster.clearMarkers(); // Clear markers each time
        }
  
        this.markerCluster = new MarkerClusterer(self.map, markers, { 
          averageCenter: true,
          styles: [{
            textColor: 'black',
            url: '-/media/Themes/ZWP/Base/Base/images/m/1.png',
            height: 55,
            width: 30,
            anchor: [8, 0],
            backgroundPosition: 'top center',
            iconAnchor: [4, 5],
          }]
        });
      }

      this.markers = markers;
    },

    /**
     * Renders POIs to list. Filters by selectedCountry if provided.
     * @param {string} selectedCountry 
     */
    setLocationBoxes: function(selectedCountry, isLocal) {
      var _self = this;
      var listHolder = $('.list-holder');
      var count = 0;
      var limit = _.get(this.state.settings, 'NumberOfResultsToDisplay', 3);

      var html = _.reduce(this.state.countries, function(markup, country) {
        var address = country.ContactAddress;
        var website = country.ContactWebsite;
        var email = country.ContactEmail;

        if (isLocal) {
          if (selectedCountry && selectedCountry !== address.AddressCategory) {
            return markup;
          }
        } else {
          if (selectedCountry && selectedCountry !== address.AddressCountry) {
            return markup;
          }
        }

        var addressBody = address.AddressBody ? address.AddressBody + '<br>' : '';
        var city = address.AddressCity ? address.AddressCity + '<br>' : '';
        var postcode = address.AddressPostalCode ? address.AddressPostalCode + '<br>' : '';

        var box = _self.boxItem.clone();
        box.attr('data-map-scroll-id', country.ContactID);
        box.find('.location-title').text(address.AddressCompanyName);
        box.find('.location-address').html(addressBody + city + postcode);
        box.find('.location-website').attr('href', website).text(_self.state.websiteLabel);
        box.find('.location-email').attr('href', 'mailto:' + email).text(_self.state.sendEmailLabel);
        box.find('.location-phone').text(country.ContactPhone ? _self.state.telephoneLabel + ' ' + country.ContactPhone : '');
        box.find('.location-fax').text(country.ContactFax ? _self.state.faxLabel + ' ' + country.ContactFax : '');
        box.find('.show-map').attr('data-contact-id', country.ContactID).text(_self.state.showMapLabel);

        if (!website) {
          box.find('.location-website').hide();
        }

        if (!email) {
          box.find('.location-email').hide();
        }
        
        // Set box to hidden if index is
        if (count > (limit - 1)) {
          box.hide();
        } else {
          box.show();
        }

        count++;
        return markup += box.prop('outerHTML');
      }, '');

      // // Show / hide "load more" button depending on location count
      if (count > limit) {
        this.showMore.show();
      } else {
        this.showMore.hide();
      }

      

      listHolder.html(html);
    },

    /**
     * Finds and build the country popup window dynamically based on postcode provided
     * @param {string} postcode 
     */
    showLocationWindow: function(country, scroll) {
      if (!country) {
        return;
      }

      var address = country.ContactAddress;
      var routeFinderLink = 'https://maps.google.com/maps?daddr=' + address.Latitude + ',' + address.Longitude + '&amp;ll=';

      var phone = country.ContactPhone ? '<div class="location-phone">Tel ' + country.ContactPhone + '</div>' : '';
      var fax = country.ContactFax ? '<div class="location-phone">Fax ' + country.ContactFax + '</div>' : '';

      var popupMarkup = '<div class="location-finder-popup">' +
      this.closeButton + 
      '<h3 class="location-title">' + address.AddressCompanyName + '</h3>' + 
      '<div class="location-address">' + address.AddressBody + '</div>' + phone + fax;

      if (country.ContactEmail) {
        popupMarkup +=  '<a href="mailto:' + country.ContactEmail + '" class="link link-standard location-email">' + this.state.sendEmailLabel + '</a>';
      }

      popupMarkup += '<a href="'+ routeFinderLink +'" class="link link-standard start-routing">' + this.state.routePlannerLabel + '</a></div>';

      this.infoBox.show().html(popupMarkup);

      if (this.isMobile && scroll) {
        var id = country.ContactID;
        var $listElement = $('div').find("[data-map-scroll-id='" + id + "']");

        $([document.documentElement, document.body]).animate({
          scrollTop: $listElement.offset().top
        }, 500);
      }
    },

    /**
     * Focuses the map on the specified country
     * @param {string} id 
     */
    focusMapToCountry: function(country, zoom, scroll) {
      if (country) {
        var address = country.ContactAddress;
        this.centerOnCoordinates(address.Latitude, address.Longitude, zoom);

        if (scroll) {
          $([document.documentElement, document.body]).animate({
            scrollTop: $("#mapcanvas").offset().top / 2
          }, 500);
        }
      }
    },

    /**
     * Show remaining location boxes, and hide load more button
     */
    onShowMore: function() {
      $('.listitem').show();
      this.showMore.hide();
    },

    /**
     * Global - Handles country select event:
     * - renders list boxes
     * - focuses and zooms map to target
     * @param {string} id 
     */
    onCountrySelected: function(poiId) {
      var country = _.find(this.state.countries, function(ctry) {
        return ctry.ContactID === poiId;
      });

      if (country) {
        this.infoBox.empty();
        this.setLocationBoxes(country.ContactAddress.AddressCountry);
        this.focusMapToCountry(country, 7, false);
      } else {
        this.setLocationBoxes(); // Show all boxes by default
      }
    },

    /**
     * Local - Handles category selection
     * @param {HTMLElement} element 
     */
    setActiveCategory: function(element) {
      var category = $(element).children('.title').text();

      $('.mapnaviholder .category').not(element).removeClass('active');
      $(element).addClass('active');

      var selectedCountry = _.find(this.state.countries, function(ctry) {
        if (ctry.ContactAddress && ctry.ContactAddress.AddressCategory) {
          return ctry.ContactAddress.AddressCategory == category;
        } else {
          return ctry.Category == category;
        }
      });

      if (selectedCountry) {
        var address = selectedCountry.ContactAddress;
        this.centerOnCoordinates(address.Latitude, address.Longitude, 5);
        this.setLocationBoxes(selectedCountry.ContactAddress.AddressCategory, true);
        this.setMarkers(selectedCountry, true);
      }
    },

    /**
     * Set all event handlers needed on initialization
     */
    setEventHandlers: function() {
      var self = this;
      var $geoMsg = $('#mapnavi-error-geo');
      var $selectElem = $('select.country-select');

      if ($selectElem.length) {
        this.slimSelect = new SlimSelect({
          select: $selectElem[0],
          showSearch: false,
          closeOnSelect: true,
          onChange: function(info) {
            var poiId = info.data.poiId;
            self.onCountrySelected(poiId);
          }
        });
      }

      // Local - Handles country selection from list element
      $('.mapnaviholder .category').click(function() {
        self.infoBox.empty();
        self.setActiveCategory(this);
      });

      // Handles 'Locate me' click
      $('.locate-me').click(function() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(result) {

            var coords = _.get(result, 'coords', false);
            if (coords) {
              self.centerOnCoordinates(coords.latitude, coords.longitude, 15);
              $geoMsg.hide();
            }
          }, function() {
            $geoMsg.show();
          });
        } 
      });

      this.showMore.click(function(e) {
        e.preventDefault();
        self.onShowMore();
      });

      // Handles 'Show map' click on location box
      $(document.body).on('click', '.show-map', function(e) {
        e.preventDefault();
        
        var ContactID = $(this).data('contact-id');
        var item = _.find(self.state.countries, function(ctry) {
          return ctry.ContactID === ContactID;
        });

        if (item) {
          self.focusMapToCountry(item, 15, true);
          self.showLocationWindow(item, false);
        }
      });

      Breakpoints();
      this.isMobile = Breakpoints.is('xs');

      Breakpoints.on('xs', {
        enter: function() {
          self.isMobile = true;
        },
        leave: function() {
          self.isMobile = false;
        }
      });
    },

    /**
     * Centers and zooms map to provided lat/long & zoom values
     * @param {string} lat 
     * @param {string} long 
     * @param {number} zoom 
     */
    centerOnCoordinates: function(lat, long, zoom) {
      var center = new window.google.maps.LatLng(lat, long);
      this.map.panTo(center);
      this.map.setZoom(zoom);
    },

    /**
     * Overrides the default map component if exists on page
     */
    loadDefaultMap: function() {
      var self = this;

      // Handles closing map popup window
      $(document.body).on('click', '.location-finder-popup .btn-close', function() {
        self.infoBox.empty();
      });

      if (_.isEmpty(this.defaultMap)) {
        return; // No map-canvas exists
      }
      
      $.each(this.defaultMap, function() {
        var mapId = $(this).attr('id');
        var $mapSizer = $(this).closest('.mapsizer');
        var config = $mapSizer.data('properties');
        $mapSizer.append('<div class="mapinfobox" style="display: none"></div>');
        
        setTimeout(function() {
          var map = new window.google.maps.Map(document.getElementById(mapId), { 
            streetViewControl: false,
            mapTypeControl: false,
            zoomControl: true,
            fullscreenControl: false,
            scrollwheel: false,
            draggable: true,
            mapTypeId: window.google.maps.MapTypeId.ROADMAP,
            center: new window.google.maps.LatLng(config.latitude, config.longitude),
            zoom: 5,
            styles: self.styles
          });

          _.forEach(config.pois, function(poi) {
            var marker = new window.google.maps.Marker({
              position: new window.google.maps.LatLng(poi.Latitude, poi.Longitude),
              title: poi.Title,
              id: poi.Id.Guid,
              icon: self.markerIcon
            });

            marker.addListener('click', function() {
              self.showDefaultLocationWindow(poi, $mapSizer);
            });

            marker.setMap(map);
          });

          // Handles closing map popup window
          $(document.body).on('click', '.location-finder-popup .btn-close', function() {
            $mapSizer.find('.mapinfobox').empty();
          });
        }, 500);
      });
    },

    showDefaultLocationWindow: function(poi, $mapSizer) {
      $mapSizer.find('.mapinfobox').html('<div class="location-finder-popup">' + this.closeButton + poi.Html + '</div>').show();
    },

    moveMapLegendOnLoad: function() {
      if (!$('.mod-Location_finder.country').length) {
        return;
      }

      var $mapLegend = $('.mod-Location_finder.country .mapnaviholder .lower');
      $mapLegend.insertBefore($('.list-holder'));
    }
  };

  api.init = function() {
    this.api.injectScript();
    this.api.loadDefaultMap();
    this.api.moveMapLegendOnLoad();
  };

  return api;
})(jQuery, document);

XA.register('mapComponent', XA.component.mapComponent);


/*  news-page  */
XA.component.newsPage = (function($) {
 var api=api || {};

 api.init = function() {  
    if ($('.news-disclaimer .component-content').children().length == 0) {
      $('.component-content').parent().removeClass('news-disclaimer');
    } 
 };

 return api;
})(jQuery, document);

XA.register('newsPage', XA.component.newsPage);


/*  openOnLoad  */
var openOnLoad = (function ($) {
    var api = {};

    function activateSelected(items, triggerSelector) {
        var regx = /\open-item-\d+/;
        if (items.length) {
            items.each(function () {
                var found = this.className.match(regx);
                if (found) {
                    var index = parseInt(found[0].replace('open-item-', ''));
                    if (index) {
                        $('ul', this)
                            .find(triggerSelector)
                            .eq(index - 1)
                            .click();
                    }
                }
            });
        }
    }

    function hideExceptions() {
        if ($('body').hasClass('on-page-editor') === false) {
            $(".sxa-rendering-error").each(function () { this.outerHTML = "" })
        }
    }

    /**
     * AccordionComponent item scrolling animation functions
     */

    function subscribeToAccordionItemClickEvent(idx, item) {
        $(item).on('click', onAccordionItemClick(item));
    }

    function onAccordionItemClick(item) {
        return function onAccordionItemClickCallback() {
            var isItemBecomeActive = false;
            var isActionInsideAccordionContent = false;

            if (item) {
                isItemBecomeActive = $(item).hasClass('active');
                isActionInsideAccordionContent = $(item).hasClass('accordion-opened');

                if (isItemBecomeActive && !isActionInsideAccordionContent) {
                    $(item).addClass("accordion-opened");
                    scrollToAccordionItem(item);                   
                }

                if (!isItemBecomeActive) {
                    $(item).removeClass("accordion-opened");
                }
            }
        };
    }

    function scrollToAccordionItem(item) {
        if (isMobile()) {
            return; // No scroll on mobile
        }

        var paddingTop = 20, // taken from component-accordion.scss: line 35
            accordionProps = $(item).parents('.accordion').data('properties'),
            debounceTime = accordionProps.canOpenMultiple ? 0 : accordionProps.speed;

        setTimeout(animateAccordionScroll(item, paddingTop), debounceTime);
    }

    function isMobile() {
        return $('.navigation-main-fatdropdown').hasClass('navigation-mobile');
    }

    function animateAccordionScroll(item, paddingTop) {
        return function animateAccordionScrollCallback() {
            if (item) {
                var $toggleHeader = $(item).children('.toggle-header');
                var top = $toggleHeader.offset().top,
                    height = $toggleHeader.height(),
                    scrollTopValue = top - height - paddingTop;

                $('html,body').animate({
                    scrollTop: scrollTopValue
                }, "slow", "linear")
            }
        };
    }

    /**
     * AccordionComponent anchor on page load behavior
     */

    function addAnchorUrlScanForAccordion(hash, accordionItems) {
        if (
            accordionItems instanceof jQuery
            && typeof hash === 'string'
            && hash.indexOf('#') > -1
        ) {
            accordionItems.each(lookupForAnchorWith(hash, function handleAnchorForAccodion(item) {
                openAccordionItem(item);
                scrollToAccordionItem(item);
            }));
        }
    }

    function lookupForAnchorWith(hash, callback) {
        return function lookupForAnchorWithCallback(idx, item) {
            var anchorElement = $(item).find('a' + hash)[0];

            if (anchorElement) {
                callback(item, anchorElement);
            }
        }
    }

    function openAccordionItem(item) {
        if (item) {
            var content = $(item).find('.toggle-content');
            var properties = $(item)
                .parents('.accordion')
                .data("properties");

            $(item).addClass('active');
            content.slideDown({
                duration: properties.speed,
                easing: properties.easing
            });
        }
    }

    /**
     * TabsComponent anchor on page load behavior
     */

    function addAnchorUrlScanForTabs(hash, tabs) {
        if (
            tabs
            && typeof hash === 'string'
            && hash.indexOf('#') > -1
        ) {
            $(tabs).each(lookupForAnchorWith(hash, function handleAnchorForTabs(tabsInstance, anchorElement) {
                var idx = $(anchorElement).parents('.tab').index();
                openTab(tabsInstance, idx);
                scrollToTab(tabsInstance);
            }));
        }
    }

    function openTab(tabsInstance, index) {
        var tabTitles = $(tabsInstance).find('.tabs-heading > li');

        if (tabTitles[index]) {
            $(tabTitles[index]).trigger('click');
        }
    }

    function scrollToTab(tabsInstance) {
        var scrollTopValue = $(tabsInstance).offset().top;
        $('body').scrollTop(scrollTopValue);
    }

    /**
     * Carousel vertical scrolling on mobile
     */

    function enableVerticalScrollForCarouselWrapper(idx, carousel) {
        var wrapper = $(carousel).find('.wrapper');

        if (wrapper[0] && typeof Hammer === 'function' && isCarouselHorizontal(carousel)) {
            var hammer = new Hammer(wrapper[0]);
            hammer.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL });
        }
    }

    function isCarouselHorizontal(carousel) {
        var props = $(carousel).data('properties');
        return props && props.transition === 'SlideHorizontallyTransition';
    }

    /**
     * YouTube Video IE11 workaround
     */

    function hideVideoInitForYouTubeVideo() {
        var $youTubeSource = $('source[type="video/youtube"]');

        if ($youTubeSource && $youTubeSource.length > 0) {
            $youTubeSource.closest('.component-content').find('.video-init').hide();
        }
    }

    function fixSearchBoxPlaceholders() {
        $('.textfield--float-label input').each(function () {
            if ($(this).val() !== '') {
                $(this).closest('.textfield--float-label').find('label').addClass('is-active');
            }
        });
    }

    /**
     * Initialization of the event
     */

    api.init = function () {
        var tabs = $(".tabs[class*='open-item-']");
        var accordions = $(".accordion[class*='open-item-']");
        var carousels = $('.carousel');
        var itemsFromEveryAccordion = $('.accordion .item');
        var allTabsOnPage = $('.tabs');
        var hashFromURL = window.location.hash;

        activateSelected(tabs, 'li');
        activateSelected(accordions, '.toggle-header');

        // Accordion: DISABLED auto-scroll behaviour.
        // TODO: remove when confirmed no longer needed
        // itemsFromEveryAccordion.each(subscribeToAccordionItemClickEvent);
        carousels.each(enableVerticalScrollForCarouselWrapper);

        addAnchorUrlScanForAccordion(hashFromURL, itemsFromEveryAccordion);
        addAnchorUrlScanForTabs(hashFromURL, allTabsOnPage);

        hideExceptions();

        hideVideoInitForYouTubeVideo();

        fixSearchBoxPlaceholders();
    };

    return api;
})(jQuery);

XA.ready(openOnLoad.init);


/*  sc-form-tracking  */
XA.component.SCFormTracking = (function ($) {

    var formType = $('.formpagestep').length > 0 ? "multistepform" : "standardform";

    var api = {
        initSCFormTracking: function () {
            //Track Fill-In Event tracking
            $('.sitecore-form').on('focusout', '.sc-form-group textarea, .sc-form-group input', function (e) {
                var formGroup = $(this).parent(".sc-form-group");
                var fieldLabel = $(this).prev('label').text().replace('*', '').trim();
                var self = $(this);
                var args = api.GetArgs(self);
                args['event_eventInfo_label'] = fieldLabel;
                args['event_element_elementName'] = fieldLabel;

                //Track FE-error-validations
                if (formGroup.children("span.field-validation-error").length > 0) {
                    if (formType == "standardform") {
                        args['event_eventInfo_effect'] = 'appear';
                    }
                    else
                    {
                        args['event_eventInfo_effect'] = 'error';
                        args['event_eventInfo_type'] = 'system';
                    }
                   
                    args['error_errorInfo_elementName'] = fieldLabel;
                    args['error_errorInfo_message'] = formGroup.children("span.field-validation-error").text();
                    args['error_errorInfo_type'] = 'validation-error-frontend';
                    args['error_errorInfo_sourceURL'] = window.location.href;

                    api.GetPageStepLevelAttributes(self, args);
                }
                else {
                    args['event_eventInfo_effect'] = "fill-in";
                    args['event_eventInfo_type'] = "user-interaction";
                }

                api.SubmitEventArgs(args);
            });


            //Error tracking FE validation on Form submit            
            $('.sitecore-form').on('click', 'button[type="submit"]', function (event) {
                var isErrorsOnSubmit = false;
                var self = $(this);
                var scForm = $(this).closest('.sitecore-form');

                //If type = 0, then its a final Submit Button
                //If type = 1, then its a continue button
                //If type = -1, then its a previous button
                var type = $(this).data("navigation-button");

                //No  need to check field validation when clicking on Previous button i.e type -1
                if (type == -1) {
                    api.TrackNextPreviousButtonEvent(self, type);
                }
                else {
                    $(scForm).find('input, textarea').each(function () {
                        if ($(this).data('sc-field-name') != undefined) {
                            if (($(this).val() == "" && $(this).data("val-required") !== undefined) || ($(this).data("val-regex") !== undefined && $(this).next('span').hasClass('field-validation-error'))) {
                                $(this).next('span.help-block').removeClass('field-validation-valid').addClass('field-validation-error').text($(this).data("val-required"));
                                var errorField = $(this);
                                //Self is button where clicked
                                api.TrackValidationError('validation-error-frontend', errorField, self);
                                isErrorsOnSubmit = true;
                            }
                        }
                    });
                    if (isErrorsOnSubmit == false) {
                        if (type == 0) {
                            api.TrackSubmitEvent(self);
                        }
                        else {
                            api.TrackNextPreviousButtonEvent(self, type);
                        }
                    }
                    if ($('input[type=checkbox]:checked').length == 0) {
                        event.preventDefault();
                    }
                    isErrorsOnSubmit = false;
                }
            });
        },

        GetArgs: function (self) {
            var args = {};
            var trackLevelContent = $(self).closest('form').parent().data('track-levelcontent');
            if (typeof trackLevelContent != 'undefined' & trackLevelContent != null) {
                var parsedContent = JSON.parse(JSON.stringify(trackLevelContent));
                args['component_componentInfo_componentType'] = parsedContent['component_componentInfo_componentType'];
                args['component_componentInfo_componentID'] = parsedContent['component_componentInfo_componentID'];
                args['event_category_primaryCategory'] = parsedContent['event_category_primaryCategory'];
            }
            return args;
        },

        GetPageStepLevelAttributes: function (self, args, type) {
            var pageStepAttributes = $(self).closest('form').find('.formpagestep').data('pagestep-levelcontent');
            dataAttributes = $('<div/>').html(pageStepAttributes).text();
            if (typeof dataAttributes != 'undefined' & dataAttributes != null & dataAttributes != "") {
                var parsedPageLevelAttr = JSON.parse(dataAttributes);
                args['component_componentInfo_progress_itemCurrent'] = parsedPageLevelAttr['component_componentInfo_progress_itemCurrent'];
                args['component_componentInfo_progress_itemMax'] = parsedPageLevelAttr['component_componentInfo_progress_itemMax'];
                args['component_componentInfo_progress_itemName'] = parsedPageLevelAttr['component_componentInfo_progress_itemName'];

                //Only for next and previous events
                if (type != undefined && type != 'undefined' && type != 0 && type != 2) {
                    args['event_eventInfo_effect'] = type == 1 ? "next" : "previous";
                    args['event_eventInfo_label'] = self.text();
                    args['event_eventInfo_type'] = "user-interaction";

                    var submitAttr = $(self).data('track-elementcontent');
                    submitAttr = $('<div/>').html(submitAttr).text();
                    var elementName = '';
                    if (typeof submitAttr != 'undefined' & submitAttr != null) {
                        var parsedSubmitAttr = JSON.parse(submitAttr);
                        elementName = parsedSubmitAttr['element_elementInfo_elementName'];
                    }
                    args['event_element_elementName'] = elementName;
                }

                //Only for reaching a new form step
                if (type != undefined && type != 'undefined' && type == 2) {
                    args['event_eventInfo_effect'] = "appear";
                    args['event_eventInfo_type'] = "view";
                }
            }

            return args;
        },

        TrackSubmitEvent: function (self) {
            if (typeof utag !== 'undefined') { 
                var args = api.GetArgs(self);
                var submitAttr = $(self).data('track-elementcontent');
                submitAttr = $('<div/>').html(submitAttr).text();
                var elementName = '';
                if (typeof submitAttr != 'undefined' & submitAttr != null) {
                    var parsedSubmitAttr = JSON.parse(submitAttr);
                    elementName = parsedSubmitAttr['element_elementInfo_elementName'];
                }
                args['event_eventInfo_effect'] = 'submit';
                args['event_eventInfo_label'] = 'send-request';
                args['event_eventInfo_type'] = 'user-interaction';
                args['event_element_elementName'] = elementName;

                //This is submit event hence passing type as 0 by default
                args = api.GetPageStepLevelAttributes(self, args, 0);
                api.SubmitEventArgs(args);
            }
        },

        //After successfull form submission
        TrackConfirmEvent: function (confirmFormId) {
            if (typeof utag !== 'undefined') { 
                var successFormId = "." + confirmFormId;
                var self = $(successFormId);
                var args = api.GetArgs(self);
                args['event_eventInfo_effect'] = 'complete';
                args['event_eventInfo_type'] = 'system';
                args['event_eventInfo_label'] = 'request-sent';
                var conversionDivParent = $(self).closest('form').parents('.sitecore-form');
                args['conversion_conversionInfo_conversionClass'] = conversionDivParent.find('#conversion-class').val();
                api.SubmitEventArgs(args);
            }
        },

        TrackNextPreviousButtonEvent: function (self, type) {
            if (typeof utag !== 'undefined') {
                var args = api.GetArgs(self);
                args = api.GetPageStepLevelAttributes(self, args, type);
                api.SubmitEventArgs(args);
            }
        },

        TrackReachingNewFormStep: function ($form) {
            if (typeof utag !== 'undefined') {               
                var self = $form.find('.formpagestep');
                var args = api.GetArgs(self);
                args = api.GetPageStepLevelAttributes(self, args, 2);
                api.SubmitEventArgs(args);
            }            
        },

        SubmitEventArgs: function (args) {
            if (typeof dice !== 'undefined') {
                dice(args);
            }
        },

        populateUDOCookie: function () {
            var udo_Array = {};
            if (typeof utag_data != 'undefined') {
                if (utag_data['page_pageInfo_language'] != '') {
                    udo_Array['page_pageInfo_language'] = utag_data['page_pageInfo_language'];
                }
                if (utag_data['page_category_primaryCategory'] != '') {
                    udo_Array['page_category_primaryCategory'] = utag_data['page_category_primaryCategory'];
                }
                var relUrl = $('link[rel="canonical"]').attr('href').replace(/^(?:\/\/|[^\/]+)*\//, "")
                var catCount = typeof relUrl !== 'undefined' ? relUrl.split('/').length : 0;
                if (catCount > 0) {
                    for (var n = 1; n < catCount; n++) {
                        if (utag_data['page_category_subCategory' + n] != '') {
                            udo_Array['page_category_subCategory' + n] = utag_data['page_category_subCategory' + n];
                        }
                    }
                }
                if (utag_data['platform_platformInfo_environment'] != '') {
                    udo_Array['platform_platformInfo_environment'] = utag_data['platform_platformInfo_environment'];
                }
                if (utag_data['page_pageInfo_templateType'] != '') {
                    udo_Array['page_pageInfo_templateType'] = utag_data['page_pageInfo_templateType'];
                }
                if (utag_data['content_contentInfo_author'] != '') {
                    udo_Array['content_contentInfo_author'] = utag_data['content_contentInfo_author'];
                }
                if (utag_data['content_attributes_expert'] != '') {
                    udo_Array['content_attributes_expert'] = utag_data['content_attributes_expert'];
                }
                if (utag_data['content_attributes_topic'] != '') {
                    udo_Array['content_attributes_topic'] = utag_data['content_attributes_topic'];
                }
                if (utag_data['content_contentInfo_contentType'] != '') {
                    udo_Array['content_contentInfo_contentType'] = utag_data['content_contentInfo_contentType'];
                }
                if (utag_data['content_contentInfo_publisher'] != '') {
                    udo_Array['content_contentInfo_publisher'] = utag_data['content_contentInfo_publisher'];
                }
                if (utag_data['page_attributes_refMktURL'] != '') {
                    udo_Array['page_attributes_refMktURL'] = utag_data['page_attributes_refMktURL'];
                }
                if (utag_data['platform_platformInfo_platformName'] != '') {
                    udo_Array['platform_platformInfo_platformName'] = utag_data['platform_platformInfo_platformName'];
                }
            }

            var utagDataVal = XA.cookies.readCookie('sc_form_udo');
            if (typeof utagDataVal != 'undefined' && utagDataVal != null) {
                api.deleteCookie('sc_form_udo');
            }
            XA.cookies.createCookie('sc_form_udo', JSON.stringify(udo_Array), 1);
        },

        checkIfThankYouPage: function () {
            var utagData = XA.cookies.readCookie('sc_form_udo');
            if (typeof utagData != 'undefined' && utagData != '') {
                api.deleteCookie('sc_form_udo');
                var udoArgs = utagData.replace(/"/g, '\'');
                dice(udoArgs);
                
            }
        },     

        TrackValidationError: function (valType, errorField, self) {
            if (typeof utag !== 'undefined') {
                var args = api.GetArgs(self);
                var fieldLabel = $(errorField).prev('label').text().replace('*', '').trim();

                if (formType == "standardform")
                {
                    args['event_eventInfo_effect'] = 'appear';
                }
                else
                {
                    args['event_eventInfo_effect'] = 'error';
                }
                
                args['event_eventInfo_type '] = 'system';
                args['event_eventInfo_label'] = fieldLabel;
                args['event_element_elementName'] = fieldLabel;
                args['error_errorInfo_elementName'] = fieldLabel;
                args['error_errorInfo_message'] = $(errorField).next("span.field-validation-error").text();
                args['error_errorInfo_type'] = valType;

                args['error_errorInfo_sourceURL'] = window.location.href;

                args = api.GetPageStepLevelAttributes(self, args);
                dice(args);               
            }
        },

        deleteCookie: function (cookieKey) {
            document.cookie = cookieKey + '=; expires=Thu, 01-Jan-70 00:00:01 GMT;path=/';
        }
    };

    api.init = function () {
        try {
            if (typeof $('form').data('sc-fxb') !== 'undefined') {
                if (typeof utag != 'undefined' & utag != null) 
                    this.api.initSCFormTracking();                         
            }
            else {
                api.checkIfThankYouPage();
            }
        } catch (e) {
            if (e instanceof ReferenceError) {
                console.log('utag is not defined');
            };
        }
    };
    return api;
})(jQuery, document);
XA.register("SCFormTracking", XA.component.SCFormTracking);

/*  sc-media-tracking  */
XA.component.SCMediaTracking = (function ($) {
    var api = {
        initSCMediaTracking: function () {
            $('document').ready(function () {
                setTimeout(function () {
                    try {
                        if (typeof window.videojs !== 'undefined') {
                            window.videojs.getAllPlayers().forEach(function (player) {
                                //console.log(player.mediainfo);

                                player.on('play', function (evt) {
                                    if (api.ConvertToAnalyticsFormat(this.cache_.currentTime) != '00:00:00') {
                                        var args = api.GetBrighcoveArgs(this);
                                        args['event_eventInfo_effect'] = 'resume';
                                        api.SubmitEvent(args);
                                    }
                                });
                                player.on('firstplay', function (evt) {
                                    var args = api.GetBrighcoveArgs(this);
                                    args['event_eventInfo_effect'] = 'start';
                                    api.SubmitEvent(args);
                                });
                                player.on('pause', function (evt) {
                                    // console.log('pause event', this);
                                    var args = api.GetBrighcoveArgs(this);
                                    args['event_eventInfo_effect'] = 'pause';
                                    api.SubmitEvent(args);
                                });
                                player.on('seek', function (evt) {
                                    // console.log('seek event', this);
                                    var args = api.GetBrighcoveArgs(this);
                                    args['event_eventInfo_effect'] = 'seek';
                                    api.SubmitEvent(args);
                                });
                                player.on('ended', function (evt) {
                                    //console.log('ended event', this);
                                    var args = api.GetBrighcoveArgs(this);
                                    args['event_eventInfo_effect'] = 'complete';
                                    api.SubmitEvent(args);
                                });
                            });
                        }

                    } catch (e) {
                        if (e instanceof ReferenceError) {
                            console.log('videojs is not loaded');
                        };
                    }

                }, 3000);

                try {
                    if (typeof mejs !== 'undefined') {
                        $.each(mejs.players, function (index) {
                            //console.log(index);
                            var mePlayer = mejs.players[index];
                            mePlayer.media.addEventListener('play', function (e) {
                                //console.log('play');
                                var args = api.GetYouTubeArgs(e.detail.target);
                                if (api.ConvertToAnalyticsFormat(e.detail.target.getCurrentTime()) != '00:00:00') {
                                    args['event_eventInfo_effect'] = 'resume';
                                }
                                else {
                                    args['event_eventInfo_effect'] = 'start';
                                }
                                api.SubmitEvent(args);
                            });
                            mePlayer.media.addEventListener('pause', function (e) {
                                //console.log("paused");
                                var args = api.GetYouTubeArgs(e.detail.target);
                                args['event_eventInfo_effect'] = 'pause';
                                api.SubmitEvent(args);
                            });
                            mePlayer.media.addEventListener('ended', function (e) {
                                // console.log("ended");
                                var args = api.GetYouTubeArgs(e.detail.target);
                                args['event_eventInfo_effect'] = 'complete';
                                api.SubmitEvent(args);
                            });
                            mePlayer.media.addEventListener('seeked', function (e) {
                                // console.log("seeked");
                                var args = api.GetYouTubeArgs(e.detail.target);
                                args['event_eventInfo_effect'] = 'seek';
                                api.SubmitEvent(args);
                            });
                        });
                    }
                }
                catch (e) {
                    if (e instanceof ReferenceError) {
                        console.log('mejs is not loaded');
                    };
                }

            });
        },
        GetBrighcoveArgs: function (self) {
            var args = {};

            args['event_category_primaryCategory'] = 'media';
            args['event_eventInfo_effect'] = '';
            args['event_eventInfo_type'] = 'user-interaction';
            args['event_media_position'] = api.ConvertToAnalyticsFormat(self.cache_.currentTime);
            args['content_media_length'] = api.ConvertToAnalyticsFormat(self.mediainfo.duration);
            args['content_media_fileName'] = self.mediainfo.id //cant find attribute
            args['content_media_fileTitle'] = self.mediainfo.name
            args['client_device_media_playerName'] = 'brightcove';

            return args;
        },
        GetYouTubeArgs: function (self) {
            var args = {};

            args['event_category_primaryCategory'] = 'media';
            args['event_eventInfo_effect'] = '';
            args['event_eventInfo_type'] = 'user-interaction';
            args['event_media_position'] = api.ConvertToAnalyticsFormat(self.getCurrentTime());
            args['content_media_length'] = api.ConvertToAnalyticsFormat(self.getDuration());
            args['content_media_fileName'] = self.getSrc();
            args['content_media_fileTitle'] = self.getSrc(); //cant find attribute
            args['client_device_media_playerName'] = 'youtube';

            return args;
        },
        SubmitEvent: function (args) {
            if (typeof dice !== 'undefined') {
                dice(args);
            }
        },
        ConvertToAnalyticsFormat(self) {
            return new Date(self * 1000).toISOString().substr(11, 8)
        }
    };

    api.init = function () {
        try {
            //Youtube or brightove
            if (typeof $('video') !== 'undefined') {
                if (typeof utag != 'undefined' & utag != null)
                    this.api.initSCMediaTracking();
            }
        } catch (e) {
            if (e instanceof ReferenceError) {
                console.log('utag is not defined');
            };
        }
    };
    return api;
})(jQuery, document);
XA.register("SCMediaTracking", XA.component.SCMediaTracking);

/*  search-action-tracking  */
XA.component.SearchActionTracking = (function ($) {
    var paginationCount = 1;
    var initialLoad = true;
    var isSortOrderSelected = false;

    var api = {
        initSearchActionTracking: function () {
            $('.search-area-wrapper .facet-dropdown-select').on('change', function () {
                isSortOrderSelected = true;
            });

            XA.component.search.vent.on("results-loaded",
                function (i) {
                    if (isSortOrderSelected == false) {
                        api.TrackSearch(i);
                    }
                    isSortOrderSelected = false; //Setting isSortOrderSelected to false
                });
        },

        TrackSearch: function (results) {
            var args = api.GetArgs(results);
            if (results.loadMore != 'undefined' & results.loadMore) {
                var displayedResults = results.offset > 0 ? results.offset + results.pageSize : results.data.length;
                if (displayedResults > results.dataCount) {
                    displayedResults = results.dataCount;
                }
                args['filter_result_numberDisplayed'] = displayedResults;
                paginationCount = paginationCount + 1;
                args['filter_result_iteration'] = paginationCount;
                args['filter_filterInfo_type'] = $('.search-results').hasClass('global-search-results') ? 'general' : 'section';
                args['event_eventInfo_effect'] = 'pagination';
            }
            else {
                args['event_eventInfo_effect'] = 'appear';
                args['filter_filterInfo_type'] = $('.search-results').hasClass('global-search-results') ? 'general' : 'section';
                args['filter_result_iteration'] = paginationCount = 1;
                args['filter_result_numberDisplayed'] = results.data.length;
            }

            if (typeof utag != 'undefined' & utag != null) {
                utag.link(args);
            }
        },

        GetArgs: function (results) {
            var args = {};
            args['event_attributes_eventType'] = "view";
            args['event_category_primaryCategory'] = "filter";
            args['event_eventInfo_label'] = 'filter_appear';
            args['filter_result_numberReturned'] = results.dataCount;
            args['filter_filterInfo_logic'] = '';

            if (initialLoad) {
                initialLoad = false;
                var searchInput = utag_data['filter_filterInfo_userInput'] !== undefined ? utag_data['filter_filterInfo_userInput'] : '';
                args['filter_filterInfo_term'] = searchInput;
                args['filter_filterInfo_userInput'] = searchInput;
                if (searchInput != '') {
                    args['filter_element_elementName'] = 'freetext';
                    args['filter_element_elementValue'] = 'userinput';
                    args['filter_filterInfo_logic'] = 'literal';
                }
            }
            else {
                var searchInput = encodeURIComponent($('.search-box-input').last().val());
                searchInput = (searchInput !== '' && searchInput !== undefined) ? searchInput : '';
                args['filter_filterInfo_term'] = args['filter_filterInfo_userInput'] = searchInput;
                if (searchInput != '') {
                    args['filter_element_elementName'] = 'freetext';
                    args['filter_element_elementValue'] = 'userinput';
                    args['filter_filterInfo_logic'] = 'literal';
                }

                if (window.location.hash !== '') {
                    //Filter Event tracking
                    if ($('.facet-value').hasClass('active-facet')) {
                        var elementName = [];
                        var elementValue = [];

                        if (searchInput !== '') {
                            elementName.push('freetext');
                            elementValue.push('userinput');
                        }

                        $('.active-facet').each(function () {
                            elementName.push(decodeURIComponent($(this).closest('.contentContainer').parent().find('.facet-title').text().trim()));
                            elementValue.push(decodeURIComponent($(this).data('facetvalue')));
                        });
                        args['filter_element_elementName'] = elementName;
                        args['filter_element_elementValue'] = elementValue;
                    }
                }
                else {
                    args['filter_filterInfo_term'] = '';
                    args['filter_filterInfo_userInput'] = '';
                }
            }

            return args;
        }
    };

    api.init = function () {
        try {
            if ($('.search-results').length) {
                if (typeof utag != 'undefined' & utag != null)
                    this.api.initSearchActionTracking();
            }
        } catch (e) {
            if (e instanceof ReferenceError) {
                console.log('utag is not defined - source: Search-action-tracking.js');
            };
        }
    };
    return api;
})(jQuery, document);
XA.register("SearchActionTracking", XA.component.SearchActionTracking);

/*  search-box  */
var searchBox = (function($) {
    var api = {};
    api.process = function() {

    };
    return api;
})(jQuery);
  
XA.registerOnPreInitHandler(searchBox);

/*  search-filter  */
XA.component.showMoreShowLess = (function ($) {
  var api = {
    initializeClickEvents: function () {
      $('.facet-showmore').on('click', function () {
        var parentFilter = this.closest(".facet-single-selection-list"),
          categoryRow = $(".facet-search-filter", parentFilter).find("p");

        $(this).hide();

        for (var i = 4; i < categoryRow.length; i++) {
          $(categoryRow[i]).show();
        }

        $('.facet-showless', parentFilter).show();
      });

      $('.facet-showless').on('click', function () {
        var parentFilter = this.closest(".facet-single-selection-list"),
          categoryRow = $(".facet-search-filter", parentFilter).find("p");

        $(this).hide();

        for (var i = 4; i < categoryRow.length; i++) {
          $(categoryRow[i]).hide();
        }

        $('.facet-showmore', parentFilter).show();
      });
    },

    /**
     * Check if final URL parameter is a year. If so, run search again
     */
    triggerChange: function () {
      setTimeout(function () {
        var href = window.location.href;
        var param = href.substr(href.lastIndexOf('/') + 1);
        var hasHash = param.indexOf('#');
        var paramClean = param.substring(0, hasHash != -1 ? hasHash : param.length);

        if (paramClean && paramClean.length === 4 && $.isNumeric(paramClean)) {
          $('.facet-dropdown-select').val(paramClean).trigger('change');
        }
      }, 1000);
    }
  };

  api.init = function () {

    this.api.triggerChange();



    // Hides the show more and show less buttons in the first initialization of the page
    $(".facet-single-selection-list").find(".facet-showmore").hide();
    $(".facet-single-selection-list").find(".facet-showless").hide();

    // Add hidden clear filter to single selection facet filters
    $('.facet-single-selection-list').each(function () {
      if (
        ($(this).attr('data-properties').indexOf('"multi":false') >= 0)
        &&
        ($(this).find('.bottom-remove-filter').length <= 0)
      ) {
        $(this).append('<div class="bottom-remove-filter d-none"><button>Clear</button></div>');
      }
    });

    // Handles the event where the filter categories are loaded.
    XA.component.search.vent.on("facet-data-filtered", function () {
      // Handles whether show more and show less buttons are displayed or not. 

      $(".facet-single-selection-list").each(function () {
        var isShowMoreVisible = true,
          isShowLessVisible = false;

        if (isShowMoreVisible && !isShowLessVisible) {
          if ($(".facet-search-filter", this).find("p").length > 4) {
            var categoryRow = $(".facet-search-filter", this).find("p");
            for (var i = 4; i < categoryRow.length; i++) {
              $(categoryRow[i]).hide();
            }

            $('.facet-showless', this).hide();

            $('.facet-showmore', this).show();
          } else {
            $('.facet-showmore, .facet-showless').hide();
          }
        }

        // Handles whether show more and show less buttons are displayed or not.
        if (!isShowMoreVisible && isShowLessVisible) {
          if ($(".facet-search-filter", this).find("p").length > 4) {
            $('.facet-showless', this).show();
            $('.facet-showmore', this).hide();
          }
        }

        $('a.reset-filter').on('click', function () {
          if ($(this).hasClass('active')) {
            $(this).removeClass('active');
          }
          $('.facet-value').removeClass('active-facet');
        });

        // Filter button enabling in multi select checklist filter
        if ($('.facet-single-selection-list').attr('data-properties').indexOf('"multi":false') >= 0) {
          $('.bottom-filter-button').hide();
        } else {
          $('.bottom-filter-button').show();
        }

        // Tracks when user clicks on the filter category
        $('.facet-value').on('click', function () {
          $('.reset-filter').addClass('active');
          // Second click to filter category for resetting
          if ($(this).hasClass('active-facet')) {
            if ($('.facet-single-selection-list').attr('data-properties').indexOf('"multi":false') >= 0) {
              // $(this).addClass('clear-filter');
              $(this).closest('.facet-single-selection-list').find('.bottom-remove-filter button').click();
              $('.reset-filter').removeClass('active');
            } else {
              setTimeout(function () {
                if ($('.facet-value.active-facet').length > 0) {
                  $('.reset-filter').addClass('active');
                } else {
                  $('.reset-filter').removeClass('active');
                }
              }, 400);
            }
          }
          // First click to filter category to select and filter out the results
          else {
            var parentFilter = this.closest(".facet-single-selection-list");
            if ($(".facet-search-filter", parentFilter).find("p").length > 4) {
              if ($('.facet-showmore', parentFilter).is(':visible') && $('.facet-showless', parentFilter).is(':hidden')) {
                isShowMoreVisible = true;
                isShowLessVisible = false;
              }

              else if ($('.facet-showless', parentFilter).is(':visible') && $('.facet-showmore', parentFilter).is(':hidden')) {
                isShowLessVisible = true;
                isShowMoreVisible = false;
              }
            }
          }

          if ($('.facet-showmore', parentFilter).is(':visible') || $('.facet-showless', parentFilter).is(':visible')) {
            $('.facet-showmore', parentFilter).hide();
            $('.facet-showless', parentFilter).hide();
          }
        });
      });
    });

    // Click event register for show more and show less buttons
    this.api.initializeClickEvents();
  };

  return api;
})(jQuery, document);

XA.register('showMoreShowLess', XA.component.showMoreShowLess);

/*  search-results-pagesize  */
// Inject values in the search component's properties
var prepareSearchResults = (function ($) {

  var QUERY_Q = 'q';
  var api = {};

  api.process = function () {
    XA.component.search.vent.on("results-loaded", function (results) {
      if ($(".search-results-count").find(".results-count").length !== 0) {
        $(".search-results-count").find(".results-count").html(
          $(".search-results-count").find(".results-count").html().replace('{pageSize}', $('ul.search-result-list > li').length));

        var result_phrase = '',
          search_phrase = $('.search-box-input.tt-input').val(),
          sortby_value = ($('.facet-dropdown-select').val() === 'Everything' ? 'All' : $('.facet-dropdown-select').val());

        if (sortby_value) {
          if (search_phrase) {
            result_phrase = sortby_value + ', ' + search_phrase;
          } else {
            result_phrase = sortby_value;
          }
        } else {
          result_phrase = search_phrase || 'All';
        }

        // Append search filter values to results text
        var dataProperties = $('#content .search-box').data('properties');
        var signature = '';
        
        if (dataProperties && dataProperties.targetSignature) {
          signature = dataProperties.targetSignature + '_';
        }

        var pageQueryString = getParameterByName(signature + QUERY_Q);

        if (pageQueryString) {
          result_phrase = pageQueryString; // Search query filter text (overrides all others)
        }

        // Append facet category filter to results text if applicable
        var facetDataProperties = $('#content .facet-single-selection-list').data('properties');
        
        if (facetDataProperties && (facetDataProperties.f && facetDataProperties.searchResultsSignature)) {
          var facetSignature = facetDataProperties.searchResultsSignature + '_' + facetDataProperties.f;
          var pageContentQuery = getParameterByName(facetSignature.toLowerCase());
  
          if (pageContentQuery) {
            result_phrase = pageContentQuery; // Category filter text
          }
        }

        $(".search-results-count").find(".results-count").html(
          $(".search-results-count").find(".results-count").html().replace('{searchText}', result_phrase));
      } else {
        return;
      }
    });
  };
  return api;
})(jQuery);

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  var decodedValue = decodeURIComponent(results[2].replace(/\+/g, ' '));
  return sanitizeHTML(decodedValue);
}

function sanitizeHTML(str) {
	var temp = document.createElement('div');
	temp.textContent = str;
	return temp.innerHTML;
};

XA.registerOnPreInitHandler(prepareSearchResults);


/*  search-show-hide-filters  */
XA.component.showHideFilters = (function ($) {
  var api = {};

  api.init = function () {
    var $filters = $('.checklist-filter-wrapper');

    $('.js-nav-drawer-trigger').on('click', function(e) {
      e.preventDefault();
      $filters.css('transform', 'translate3d(0,0,0)');
    });

    $('.navigation-drawer__close').on('click', function(e) {
      e.preventDefault();
      $filters.css('transform', 'translate3d(100%,0,0)');
    });
  };

  return api;
})(jQuery, document);

XA.register('showHideFilters', XA.component.showHideFilters);

/*  select2_min  */
/*! Select2 4.0.6-rc.1 | https://github.com/select2/select2/blob/master/LICENSE.md */!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof module&&module.exports?module.exports=function(b,c){return void 0===c&&(c="undefined"!=typeof window?require("jquery"):require("jquery")(b)),a(c),c}:a(jQuery)}(function(a){var b=function(){if(a&&a.fn&&a.fn.select2&&a.fn.select2.amd)var b=a.fn.select2.amd;var b;return function(){if(!b||!b.requirejs){b?c=b:b={};var a,c,d;!function(b){function e(a,b){return v.call(a,b)}function f(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o=b&&b.split("/"),p=t.map,q=p&&p["*"]||{};if(a){for(a=a.split("/"),g=a.length-1,t.nodeIdCompat&&x.test(a[g])&&(a[g]=a[g].replace(x,"")),"."===a[0].charAt(0)&&o&&(n=o.slice(0,o.length-1),a=n.concat(a)),k=0;k<a.length;k++)if("."===(m=a[k]))a.splice(k,1),k-=1;else if(".."===m){if(0===k||1===k&&".."===a[2]||".."===a[k-1])continue;k>0&&(a.splice(k-1,2),k-=2)}a=a.join("/")}if((o||q)&&p){for(c=a.split("/"),k=c.length;k>0;k-=1){if(d=c.slice(0,k).join("/"),o)for(l=o.length;l>0;l-=1)if((e=p[o.slice(0,l).join("/")])&&(e=e[d])){f=e,h=k;break}if(f)break;!i&&q&&q[d]&&(i=q[d],j=k)}!f&&i&&(f=i,h=j),f&&(c.splice(0,h,f),a=c.join("/"))}return a}function g(a,c){return function(){var d=w.call(arguments,0);return"string"!=typeof d[0]&&1===d.length&&d.push(null),o.apply(b,d.concat([a,c]))}}function h(a){return function(b){return f(b,a)}}function i(a){return function(b){r[a]=b}}function j(a){if(e(s,a)){var c=s[a];delete s[a],u[a]=!0,n.apply(b,c)}if(!e(r,a)&&!e(u,a))throw new Error("No "+a);return r[a]}function k(a){var b,c=a?a.indexOf("!"):-1;return c>-1&&(b=a.substring(0,c),a=a.substring(c+1,a.length)),[b,a]}function l(a){return a?k(a):[]}function m(a){return function(){return t&&t.config&&t.config[a]||{}}}var n,o,p,q,r={},s={},t={},u={},v=Object.prototype.hasOwnProperty,w=[].slice,x=/\.js$/;p=function(a,b){var c,d=k(a),e=d[0],g=b[1];return a=d[1],e&&(e=f(e,g),c=j(e)),e?a=c&&c.normalize?c.normalize(a,h(g)):f(a,g):(a=f(a,g),d=k(a),e=d[0],a=d[1],e&&(c=j(e))),{f:e?e+"!"+a:a,n:a,pr:e,p:c}},q={require:function(a){return g(a)},exports:function(a){var b=r[a];return void 0!==b?b:r[a]={}},module:function(a){return{id:a,uri:"",exports:r[a],config:m(a)}}},n=function(a,c,d,f){var h,k,m,n,o,t,v,w=[],x=typeof d;if(f=f||a,t=l(f),"undefined"===x||"function"===x){for(c=!c.length&&d.length?["require","exports","module"]:c,o=0;o<c.length;o+=1)if(n=p(c[o],t),"require"===(k=n.f))w[o]=q.require(a);else if("exports"===k)w[o]=q.exports(a),v=!0;else if("module"===k)h=w[o]=q.module(a);else if(e(r,k)||e(s,k)||e(u,k))w[o]=j(k);else{if(!n.p)throw new Error(a+" missing "+k);n.p.load(n.n,g(f,!0),i(k),{}),w[o]=r[k]}m=d?d.apply(r[a],w):void 0,a&&(h&&h.exports!==b&&h.exports!==r[a]?r[a]=h.exports:m===b&&v||(r[a]=m))}else a&&(r[a]=d)},a=c=o=function(a,c,d,e,f){if("string"==typeof a)return q[a]?q[a](c):j(p(a,l(c)).f);if(!a.splice){if(t=a,t.deps&&o(t.deps,t.callback),!c)return;c.splice?(a=c,c=d,d=null):a=b}return c=c||function(){},"function"==typeof d&&(d=e,e=f),e?n(b,a,c,d):setTimeout(function(){n(b,a,c,d)},4),o},o.config=function(a){return o(a)},a._defined=r,d=function(a,b,c){if("string"!=typeof a)throw new Error("See almond README: incorrect module build, no module name");b.splice||(c=b,b=[]),e(r,a)||e(s,a)||(s[a]=[a,b,c])},d.amd={jQuery:!0}}(),b.requirejs=a,b.require=c,b.define=d}}(),b.define("almond",function(){}),b.define("jquery",[],function(){var b=a||$;return null==b&&console&&console.error&&console.error("Select2: An instance of jQuery or a jQuery-compatible library was not found. Make sure that you are including jQuery before Select2 on your web page."),b}),b.define("select2/utils",["jquery"],function(a){function b(a){var b=a.prototype,c=[];for(var d in b){"function"==typeof b[d]&&("constructor"!==d&&c.push(d))}return c}var c={};c.Extend=function(a,b){function c(){this.constructor=a}var d={}.hasOwnProperty;for(var e in b)d.call(b,e)&&(a[e]=b[e]);return c.prototype=b.prototype,a.prototype=new c,a.__super__=b.prototype,a},c.Decorate=function(a,c){function d(){var b=Array.prototype.unshift,d=c.prototype.constructor.length,e=a.prototype.constructor;d>0&&(b.call(arguments,a.prototype.constructor),e=c.prototype.constructor),e.apply(this,arguments)}function e(){this.constructor=d}var f=b(c),g=b(a);c.displayName=a.displayName,d.prototype=new e;for(var h=0;h<g.length;h++){var i=g[h];d.prototype[i]=a.prototype[i]}for(var j=(function(a){var b=function(){};a in d.prototype&&(b=d.prototype[a]);var e=c.prototype[a];return function(){return Array.prototype.unshift.call(arguments,b),e.apply(this,arguments)}}),k=0;k<f.length;k++){var l=f[k];d.prototype[l]=j(l)}return d};var d=function(){this.listeners={}};d.prototype.on=function(a,b){this.listeners=this.listeners||{},a in this.listeners?this.listeners[a].push(b):this.listeners[a]=[b]},d.prototype.trigger=function(a){var b=Array.prototype.slice,c=b.call(arguments,1);this.listeners=this.listeners||{},null==c&&(c=[]),0===c.length&&c.push({}),c[0]._type=a,a in this.listeners&&this.invoke(this.listeners[a],b.call(arguments,1)),"*"in this.listeners&&this.invoke(this.listeners["*"],arguments)},d.prototype.invoke=function(a,b){for(var c=0,d=a.length;c<d;c++)a[c].apply(this,b)},c.Observable=d,c.generateChars=function(a){for(var b="",c=0;c<a;c++){b+=Math.floor(36*Math.random()).toString(36)}return b},c.bind=function(a,b){return function(){a.apply(b,arguments)}},c._convertData=function(a){for(var b in a){var c=b.split("-"),d=a;if(1!==c.length){for(var e=0;e<c.length;e++){var f=c[e];f=f.substring(0,1).toLowerCase()+f.substring(1),f in d||(d[f]={}),e==c.length-1&&(d[f]=a[b]),d=d[f]}delete a[b]}}return a},c.hasScroll=function(b,c){var d=a(c),e=c.style.overflowX,f=c.style.overflowY;return(e!==f||"hidden"!==f&&"visible"!==f)&&("scroll"===e||"scroll"===f||(d.innerHeight()<c.scrollHeight||d.innerWidth()<c.scrollWidth))},c.escapeMarkup=function(a){var b={"\\":"&#92;","&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#47;"};return"string"!=typeof a?a:String(a).replace(/[&<>"'\/\\]/g,function(a){return b[a]})},c.appendMany=function(b,c){if("1.7"===a.fn.jquery.substr(0,3)){var d=a();a.map(c,function(a){d=d.add(a)}),c=d}b.append(c)},c.__cache={};var e=0;return c.GetUniqueElementId=function(a){var b=a.getAttribute("data-select2-id");return null==b&&(a.id?(b=a.id,a.setAttribute("data-select2-id",b)):(a.setAttribute("data-select2-id",++e),b=e.toString())),b},c.StoreData=function(a,b,d){var e=c.GetUniqueElementId(a);c.__cache[e]||(c.__cache[e]={}),c.__cache[e][b]=d},c.GetData=function(b,d){var e=c.GetUniqueElementId(b);return d?c.__cache[e]&&null!=c.__cache[e][d]?c.__cache[e][d]:a(b).data(d):c.__cache[e]},c.RemoveData=function(a){var b=c.GetUniqueElementId(a);null!=c.__cache[b]&&delete c.__cache[b]},c}),b.define("select2/results",["jquery","./utils"],function(a,b){function c(a,b,d){this.$element=a,this.data=d,this.options=b,c.__super__.constructor.call(this)}return b.Extend(c,b.Observable),c.prototype.render=function(){var b=a('<ul class="select2-results__options" role="tree"></ul>');return this.options.get("multiple")&&b.attr("aria-multiselectable","true"),this.$results=b,b},c.prototype.clear=function(){this.$results.empty()},c.prototype.displayMessage=function(b){var c=this.options.get("escapeMarkup");this.clear(),this.hideLoading();var d=a('<li role="treeitem" aria-live="assertive" class="select2-results__option"></li>'),e=this.options.get("translations").get(b.message);d.append(c(e(b.args))),d[0].className+=" select2-results__message",this.$results.append(d)},c.prototype.hideMessages=function(){this.$results.find(".select2-results__message").remove()},c.prototype.append=function(a){this.hideLoading();var b=[];if(null==a.results||0===a.results.length)return void(0===this.$results.children().length&&this.trigger("results:message",{message:"noResults"}));a.results=this.sort(a.results);for(var c=0;c<a.results.length;c++){var d=a.results[c],e=this.option(d);b.push(e)}this.$results.append(b)},c.prototype.position=function(a,b){b.find(".select2-results").append(a)},c.prototype.sort=function(a){return this.options.get("sorter")(a)},c.prototype.highlightFirstItem=function(){var a=this.$results.find(".select2-results__option[aria-selected]"),b=a.filter("[aria-selected=true]");b.length>0?b.first().trigger("mouseenter"):a.first().trigger("mouseenter"),this.ensureHighlightVisible()},c.prototype.setClasses=function(){var c=this;this.data.current(function(d){var e=a.map(d,function(a){return a.id.toString()});c.$results.find(".select2-results__option[aria-selected]").each(function(){var c=a(this),d=b.GetData(this,"data"),f=""+d.id;null!=d.element&&d.element.selected||null==d.element&&a.inArray(f,e)>-1?c.attr("aria-selected","true"):c.attr("aria-selected","false")})})},c.prototype.showLoading=function(a){this.hideLoading();var b=this.options.get("translations").get("searching"),c={disabled:!0,loading:!0,text:b(a)},d=this.option(c);d.className+=" loading-results",this.$results.prepend(d)},c.prototype.hideLoading=function(){this.$results.find(".loading-results").remove()},c.prototype.option=function(c){var d=document.createElement("li");d.className="select2-results__option";var e={role:"treeitem","aria-selected":"false"};c.disabled&&(delete e["aria-selected"],e["aria-disabled"]="true"),null==c.id&&delete e["aria-selected"],null!=c._resultId&&(d.id=c._resultId),c.title&&(d.title=c.title),c.children&&(e.role="group",e["aria-label"]=c.text,delete e["aria-selected"]);for(var f in e){var g=e[f];d.setAttribute(f,g)}if(c.children){var h=a(d),i=document.createElement("strong");i.className="select2-results__group";a(i);this.template(c,i);for(var j=[],k=0;k<c.children.length;k++){var l=c.children[k],m=this.option(l);j.push(m)}var n=a("<ul></ul>",{class:"select2-results__options select2-results__options--nested"});n.append(j),h.append(i),h.append(n)}else this.template(c,d);return b.StoreData(d,"data",c),d},c.prototype.bind=function(c,d){var e=this,f=c.id+"-results";this.$results.attr("id",f),c.on("results:all",function(a){e.clear(),e.append(a.data),c.isOpen()&&(e.setClasses(),e.highlightFirstItem())}),c.on("results:append",function(a){e.append(a.data),c.isOpen()&&e.setClasses()}),c.on("query",function(a){e.hideMessages(),e.showLoading(a)}),c.on("select",function(){c.isOpen()&&(e.setClasses(),e.highlightFirstItem())}),c.on("unselect",function(){c.isOpen()&&(e.setClasses(),e.highlightFirstItem())}),c.on("open",function(){e.$results.attr("aria-expanded","true"),e.$results.attr("aria-hidden","false"),e.setClasses(),e.ensureHighlightVisible()}),c.on("close",function(){e.$results.attr("aria-expanded","false"),e.$results.attr("aria-hidden","true"),e.$results.removeAttr("aria-activedescendant")}),c.on("results:toggle",function(){var a=e.getHighlightedResults();0!==a.length&&a.trigger("mouseup")}),c.on("results:select",function(){var a=e.getHighlightedResults();if(0!==a.length){var c=b.GetData(a[0],"data");"true"==a.attr("aria-selected")?e.trigger("close",{}):e.trigger("select",{data:c})}}),c.on("results:previous",function(){var a=e.getHighlightedResults(),b=e.$results.find("[aria-selected]"),c=b.index(a);if(!(c<=0)){var d=c-1;0===a.length&&(d=0);var f=b.eq(d);f.trigger("mouseenter");var g=e.$results.offset().top,h=f.offset().top,i=e.$results.scrollTop()+(h-g);0===d?e.$results.scrollTop(0):h-g<0&&e.$results.scrollTop(i)}}),c.on("results:next",function(){var a=e.getHighlightedResults(),b=e.$results.find("[aria-selected]"),c=b.index(a),d=c+1;if(!(d>=b.length)){var f=b.eq(d);f.trigger("mouseenter");var g=e.$results.offset().top+e.$results.outerHeight(!1),h=f.offset().top+f.outerHeight(!1),i=e.$results.scrollTop()+h-g;0===d?e.$results.scrollTop(0):h>g&&e.$results.scrollTop(i)}}),c.on("results:focus",function(a){a.element.addClass("select2-results__option--highlighted")}),c.on("results:message",function(a){e.displayMessage(a)}),a.fn.mousewheel&&this.$results.on("mousewheel",function(a){var b=e.$results.scrollTop(),c=e.$results.get(0).scrollHeight-b+a.deltaY,d=a.deltaY>0&&b-a.deltaY<=0,f=a.deltaY<0&&c<=e.$results.height();d?(e.$results.scrollTop(0),a.preventDefault(),a.stopPropagation()):f&&(e.$results.scrollTop(e.$results.get(0).scrollHeight-e.$results.height()),a.preventDefault(),a.stopPropagation())}),this.$results.on("mouseup",".select2-results__option[aria-selected]",function(c){var d=a(this),f=b.GetData(this,"data");if("true"===d.attr("aria-selected"))return void(e.options.get("multiple")?e.trigger("unselect",{originalEvent:c,data:f}):e.trigger("close",{}));e.trigger("select",{originalEvent:c,data:f})}),this.$results.on("mouseenter",".select2-results__option[aria-selected]",function(c){var d=b.GetData(this,"data");e.getHighlightedResults().removeClass("select2-results__option--highlighted"),e.trigger("results:focus",{data:d,element:a(this)})})},c.prototype.getHighlightedResults=function(){return this.$results.find(".select2-results__option--highlighted")},c.prototype.destroy=function(){this.$results.remove()},c.prototype.ensureHighlightVisible=function(){var a=this.getHighlightedResults();if(0!==a.length){var b=this.$results.find("[aria-selected]"),c=b.index(a),d=this.$results.offset().top,e=a.offset().top,f=this.$results.scrollTop()+(e-d),g=e-d;f-=2*a.outerHeight(!1),c<=2?this.$results.scrollTop(0):(g>this.$results.outerHeight()||g<0)&&this.$results.scrollTop(f)}},c.prototype.template=function(b,c){var d=this.options.get("templateResult"),e=this.options.get("escapeMarkup"),f=d(b,c);null==f?c.style.display="none":"string"==typeof f?c.innerHTML=e(f):a(c).append(f)},c}),b.define("select2/keys",[],function(){return{BACKSPACE:8,TAB:9,ENTER:13,SHIFT:16,CTRL:17,ALT:18,ESC:27,SPACE:32,PAGE_UP:33,PAGE_DOWN:34,END:35,HOME:36,LEFT:37,UP:38,RIGHT:39,DOWN:40,DELETE:46}}),b.define("select2/selection/base",["jquery","../utils","../keys"],function(a,b,c){function d(a,b){this.$element=a,this.options=b,d.__super__.constructor.call(this)}return b.Extend(d,b.Observable),d.prototype.render=function(){var c=a('<span class="select2-selection" role="combobox"  aria-haspopup="true" aria-expanded="false"></span>');return this._tabindex=0,null!=b.GetData(this.$element[0],"old-tabindex")?this._tabindex=b.GetData(this.$element[0],"old-tabindex"):null!=this.$element.attr("tabindex")&&(this._tabindex=this.$element.attr("tabindex")),c.attr("title",this.$element.attr("title")),c.attr("tabindex",this._tabindex),this.$selection=c,c},d.prototype.bind=function(a,b){var d=this,e=(a.id,a.id+"-results");this.container=a,this.$selection.on("focus",function(a){d.trigger("focus",a)}),this.$selection.on("blur",function(a){d._handleBlur(a)}),this.$selection.on("keydown",function(a){d.trigger("keypress",a),a.which===c.SPACE&&a.preventDefault()}),a.on("results:focus",function(a){d.$selection.attr("aria-activedescendant",a.data._resultId)}),a.on("selection:update",function(a){d.update(a.data)}),a.on("open",function(){d.$selection.attr("aria-expanded","true"),d.$selection.attr("aria-owns",e),d._attachCloseHandler(a)}),a.on("close",function(){d.$selection.attr("aria-expanded","false"),d.$selection.removeAttr("aria-activedescendant"),d.$selection.removeAttr("aria-owns"),d.$selection.focus(),window.setTimeout(function(){d.$selection.focus()},0),d._detachCloseHandler(a)}),a.on("enable",function(){d.$selection.attr("tabindex",d._tabindex)}),a.on("disable",function(){d.$selection.attr("tabindex","-1")})},d.prototype._handleBlur=function(b){var c=this;window.setTimeout(function(){document.activeElement==c.$selection[0]||a.contains(c.$selection[0],document.activeElement)||c.trigger("blur",b)},1)},d.prototype._attachCloseHandler=function(c){a(document.body).on("mousedown.select2."+c.id,function(c){var d=a(c.target),e=d.closest(".select2");a(".select2.select2-container--open").each(function(){a(this),this!=e[0]&&b.GetData(this,"element").select2("close")})})},d.prototype._detachCloseHandler=function(b){a(document.body).off("mousedown.select2."+b.id)},d.prototype.position=function(a,b){b.find(".selection").append(a)},d.prototype.destroy=function(){this._detachCloseHandler(this.container)},d.prototype.update=function(a){throw new Error("The `update` method must be defined in child classes.")},d}),b.define("select2/selection/single",["jquery","./base","../utils","../keys"],function(a,b,c,d){function e(){e.__super__.constructor.apply(this,arguments)}return c.Extend(e,b),e.prototype.render=function(){var a=e.__super__.render.call(this);return a.addClass("select2-selection--single"),a.html('<span class="select2-selection__rendered"></span><span class="select2-selection__arrow" role="presentation"><b role="presentation"></b></span>'),a},e.prototype.bind=function(a,b){var c=this;e.__super__.bind.apply(this,arguments);var d=a.id+"-container";this.$selection.find(".select2-selection__rendered").attr("id",d).attr("role","textbox").attr("aria-readonly","true"),this.$selection.attr("aria-labelledby",d),this.$selection.on("mousedown",function(a){1===a.which&&c.trigger("toggle",{originalEvent:a})}),this.$selection.on("focus",function(a){}),this.$selection.on("blur",function(a){}),a.on("focus",function(b){a.isOpen()||c.$selection.focus()})},e.prototype.clear=function(){var a=this.$selection.find(".select2-selection__rendered");a.empty(),a.removeAttr("title")},e.prototype.display=function(a,b){var c=this.options.get("templateSelection");return this.options.get("escapeMarkup")(c(a,b))},e.prototype.selectionContainer=function(){return a("<span></span>")},e.prototype.update=function(a){if(0===a.length)return void this.clear();var b=a[0],c=this.$selection.find(".select2-selection__rendered"),d=this.display(b,c);c.empty().append(d),c.attr("title",b.title||b.text)},e}),b.define("select2/selection/multiple",["jquery","./base","../utils"],function(a,b,c){function d(a,b){d.__super__.constructor.apply(this,arguments)}return c.Extend(d,b),d.prototype.render=function(){var a=d.__super__.render.call(this);return a.addClass("select2-selection--multiple"),a.html('<ul class="select2-selection__rendered"></ul>'),a},d.prototype.bind=function(b,e){var f=this;d.__super__.bind.apply(this,arguments),this.$selection.on("click",function(a){f.trigger("toggle",{originalEvent:a})}),this.$selection.on("click",".select2-selection__choice__remove",function(b){if(!f.options.get("disabled")){var d=a(this),e=d.parent(),g=c.GetData(e[0],"data");f.trigger("unselect",{originalEvent:b,data:g})}})},d.prototype.clear=function(){var a=this.$selection.find(".select2-selection__rendered");a.empty(),a.removeAttr("title")},d.prototype.display=function(a,b){var c=this.options.get("templateSelection");return this.options.get("escapeMarkup")(c(a,b))},d.prototype.selectionContainer=function(){return a('<li class="select2-selection__choice"><span class="select2-selection__choice__remove" role="presentation">&times;</span></li>')},d.prototype.update=function(a){if(this.clear(),0!==a.length){for(var b=[],d=0;d<a.length;d++){var e=a[d],f=this.selectionContainer(),g=this.display(e,f);f.append(g),f.attr("title",e.title||e.text),c.StoreData(f[0],"data",e),b.push(f)}var h=this.$selection.find(".select2-selection__rendered");c.appendMany(h,b)}},d}),b.define("select2/selection/placeholder",["../utils"],function(a){function b(a,b,c){this.placeholder=this.normalizePlaceholder(c.get("placeholder")),a.call(this,b,c)}return b.prototype.normalizePlaceholder=function(a,b){return"string"==typeof b&&(b={id:"",text:b}),b},b.prototype.createPlaceholder=function(a,b){var c=this.selectionContainer();return c.html(this.display(b)),c.addClass("select2-selection__placeholder").removeClass("select2-selection__choice"),c},b.prototype.update=function(a,b){var c=1==b.length&&b[0].id!=this.placeholder.id;if(b.length>1||c)return a.call(this,b);this.clear();var d=this.createPlaceholder(this.placeholder);this.$selection.find(".select2-selection__rendered").append(d)},b}),b.define("select2/selection/allowClear",["jquery","../keys","../utils"],function(a,b,c){function d(){}return d.prototype.bind=function(a,b,c){var d=this;a.call(this,b,c),null==this.placeholder&&this.options.get("debug")&&window.console&&console.error&&console.error("Select2: The `allowClear` option should be used in combination with the `placeholder` option."),this.$selection.on("mousedown",".select2-selection__clear",function(a){d._handleClear(a)}),b.on("keypress",function(a){d._handleKeyboardClear(a,b)})},d.prototype._handleClear=function(a,b){if(!this.options.get("disabled")){var d=this.$selection.find(".select2-selection__clear");if(0!==d.length){b.stopPropagation();var e=c.GetData(d[0],"data"),f=this.$element.val();this.$element.val(this.placeholder.id);var g={data:e};if(this.trigger("clear",g),g.prevented)return void this.$element.val(f);for(var h=0;h<e.length;h++)if(g={data:e[h]},this.trigger("unselect",g),g.prevented)return void this.$element.val(f);this.$element.trigger("change"),this.trigger("toggle",{})}}},d.prototype._handleKeyboardClear=function(a,c,d){d.isOpen()||c.which!=b.DELETE&&c.which!=b.BACKSPACE||this._handleClear(c)},d.prototype.update=function(b,d){if(b.call(this,d),!(this.$selection.find(".select2-selection__placeholder").length>0||0===d.length)){var e=a('<span class="select2-selection__clear">&times;</span>');c.StoreData(e[0],"data",d),this.$selection.find(".select2-selection__rendered").prepend(e)}},d}),b.define("select2/selection/search",["jquery","../utils","../keys"],function(a,b,c){function d(a,b,c){a.call(this,b,c)}return d.prototype.render=function(b){var c=a('<li class="select2-search select2-search--inline"><input class="select2-search__field" type="search" tabindex="-1" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" role="textbox" aria-autocomplete="list" /></li>');this.$searchContainer=c,this.$search=c.find("input");var d=b.call(this);return this._transferTabIndex(),d},d.prototype.bind=function(a,d,e){var f=this;a.call(this,d,e),d.on("open",function(){f.$search.trigger("focus")}),d.on("close",function(){f.$search.val(""),f.$search.removeAttr("aria-activedescendant"),f.$search.trigger("focus")}),d.on("enable",function(){f.$search.prop("disabled",!1),f._transferTabIndex()}),d.on("disable",function(){f.$search.prop("disabled",!0)}),d.on("focus",function(a){f.$search.trigger("focus")}),d.on("results:focus",function(a){f.$search.attr("aria-activedescendant",a.id)}),this.$selection.on("focusin",".select2-search--inline",function(a){f.trigger("focus",a)}),this.$selection.on("focusout",".select2-search--inline",function(a){f._handleBlur(a)}),this.$selection.on("keydown",".select2-search--inline",function(a){if(a.stopPropagation(),f.trigger("keypress",a),f._keyUpPrevented=a.isDefaultPrevented(),a.which===c.BACKSPACE&&""===f.$search.val()){var d=f.$searchContainer.prev(".select2-selection__choice");if(d.length>0){var e=b.GetData(d[0],"data");f.searchRemoveChoice(e),a.preventDefault()}}});var g=document.documentMode,h=g&&g<=11;this.$selection.on("input.searchcheck",".select2-search--inline",function(a){if(h)return void f.$selection.off("input.search input.searchcheck");f.$selection.off("keyup.search")}),this.$selection.on("keyup.search input.search",".select2-search--inline",function(a){if(h&&"input"===a.type)return void f.$selection.off("input.search input.searchcheck");var b=a.which;b!=c.SHIFT&&b!=c.CTRL&&b!=c.ALT&&b!=c.TAB&&f.handleSearch(a)})},d.prototype._transferTabIndex=function(a){this.$search.attr("tabindex",this.$selection.attr("tabindex")),this.$selection.attr("tabindex","-1")},d.prototype.createPlaceholder=function(a,b){this.$search.attr("placeholder",b.text)},d.prototype.update=function(a,b){var c=this.$search[0]==document.activeElement;if(this.$search.attr("placeholder",""),a.call(this,b),this.$selection.find(".select2-selection__rendered").append(this.$searchContainer),this.resizeSearch(),c){this.$element.find("[data-select2-tag]").length?this.$element.focus():this.$search.focus()}},d.prototype.handleSearch=function(){if(this.resizeSearch(),!this._keyUpPrevented){var a=this.$search.val();this.trigger("query",{term:a})}this._keyUpPrevented=!1},d.prototype.searchRemoveChoice=function(a,b){this.trigger("unselect",{data:b}),this.$search.val(b.text),this.handleSearch()},d.prototype.resizeSearch=function(){this.$search.css("width","25px");var a="";if(""!==this.$search.attr("placeholder"))a=this.$selection.find(".select2-selection__rendered").innerWidth();else{a=.75*(this.$search.val().length+1)+"em"}this.$search.css("width",a)},d}),b.define("select2/selection/eventRelay",["jquery"],function(a){function b(){}return b.prototype.bind=function(b,c,d){var e=this,f=["open","opening","close","closing","select","selecting","unselect","unselecting","clear","clearing"],g=["opening","closing","selecting","unselecting","clearing"];b.call(this,c,d),c.on("*",function(b,c){if(-1!==a.inArray(b,f)){c=c||{};var d=a.Event("select2:"+b,{params:c});e.$element.trigger(d),-1!==a.inArray(b,g)&&(c.prevented=d.isDefaultPrevented())}})},b}),b.define("select2/translation",["jquery","require"],function(a,b){function c(a){this.dict=a||{}}return c.prototype.all=function(){return this.dict},c.prototype.get=function(a){return this.dict[a]},c.prototype.extend=function(b){this.dict=a.extend({},b.all(),this.dict)},c._cache={},c.loadPath=function(a){if(!(a in c._cache)){var d=b(a);c._cache[a]=d}return new c(c._cache[a])},c}),b.define("select2/diacritics",[],function(){return{"Ⓐ":"A","Ａ":"A","À":"A","Á":"A","Â":"A","Ầ":"A","Ấ":"A","Ẫ":"A","Ẩ":"A","Ã":"A","Ā":"A","Ă":"A","Ằ":"A","Ắ":"A","Ẵ":"A","Ẳ":"A","Ȧ":"A","Ǡ":"A","Ä":"A","Ǟ":"A","Ả":"A","Å":"A","Ǻ":"A","Ǎ":"A","Ȁ":"A","Ȃ":"A","Ạ":"A","Ậ":"A","Ặ":"A","Ḁ":"A","Ą":"A","Ⱥ":"A","Ɐ":"A","Ꜳ":"AA","Æ":"AE","Ǽ":"AE","Ǣ":"AE","Ꜵ":"AO","Ꜷ":"AU","Ꜹ":"AV","Ꜻ":"AV","Ꜽ":"AY","Ⓑ":"B","Ｂ":"B","Ḃ":"B","Ḅ":"B","Ḇ":"B","Ƀ":"B","Ƃ":"B","Ɓ":"B","Ⓒ":"C","Ｃ":"C","Ć":"C","Ĉ":"C","Ċ":"C","Č":"C","Ç":"C","Ḉ":"C","Ƈ":"C","Ȼ":"C","Ꜿ":"C","Ⓓ":"D","Ｄ":"D","Ḋ":"D","Ď":"D","Ḍ":"D","Ḑ":"D","Ḓ":"D","Ḏ":"D","Đ":"D","Ƌ":"D","Ɗ":"D","Ɖ":"D","Ꝺ":"D","Ǳ":"DZ","Ǆ":"DZ","ǲ":"Dz","ǅ":"Dz","Ⓔ":"E","Ｅ":"E","È":"E","É":"E","Ê":"E","Ề":"E","Ế":"E","Ễ":"E","Ể":"E","Ẽ":"E","Ē":"E","Ḕ":"E","Ḗ":"E","Ĕ":"E","Ė":"E","Ë":"E","Ẻ":"E","Ě":"E","Ȅ":"E","Ȇ":"E","Ẹ":"E","Ệ":"E","Ȩ":"E","Ḝ":"E","Ę":"E","Ḙ":"E","Ḛ":"E","Ɛ":"E","Ǝ":"E","Ⓕ":"F","Ｆ":"F","Ḟ":"F","Ƒ":"F","Ꝼ":"F","Ⓖ":"G","Ｇ":"G","Ǵ":"G","Ĝ":"G","Ḡ":"G","Ğ":"G","Ġ":"G","Ǧ":"G","Ģ":"G","Ǥ":"G","Ɠ":"G","Ꞡ":"G","Ᵹ":"G","Ꝿ":"G","Ⓗ":"H","Ｈ":"H","Ĥ":"H","Ḣ":"H","Ḧ":"H","Ȟ":"H","Ḥ":"H","Ḩ":"H","Ḫ":"H","Ħ":"H","Ⱨ":"H","Ⱶ":"H","Ɥ":"H","Ⓘ":"I","Ｉ":"I","Ì":"I","Í":"I","Î":"I","Ĩ":"I","Ī":"I","Ĭ":"I","İ":"I","Ï":"I","Ḯ":"I","Ỉ":"I","Ǐ":"I","Ȉ":"I","Ȋ":"I","Ị":"I","Į":"I","Ḭ":"I","Ɨ":"I","Ⓙ":"J","Ｊ":"J","Ĵ":"J","Ɉ":"J","Ⓚ":"K","Ｋ":"K","Ḱ":"K","Ǩ":"K","Ḳ":"K","Ķ":"K","Ḵ":"K","Ƙ":"K","Ⱪ":"K","Ꝁ":"K","Ꝃ":"K","Ꝅ":"K","Ꞣ":"K","Ⓛ":"L","Ｌ":"L","Ŀ":"L","Ĺ":"L","Ľ":"L","Ḷ":"L","Ḹ":"L","Ļ":"L","Ḽ":"L","Ḻ":"L","Ł":"L","Ƚ":"L","Ɫ":"L","Ⱡ":"L","Ꝉ":"L","Ꝇ":"L","Ꞁ":"L","Ǉ":"LJ","ǈ":"Lj","Ⓜ":"M","Ｍ":"M","Ḿ":"M","Ṁ":"M","Ṃ":"M","Ɱ":"M","Ɯ":"M","Ⓝ":"N","Ｎ":"N","Ǹ":"N","Ń":"N","Ñ":"N","Ṅ":"N","Ň":"N","Ṇ":"N","Ņ":"N","Ṋ":"N","Ṉ":"N","Ƞ":"N","Ɲ":"N","Ꞑ":"N","Ꞥ":"N","Ǌ":"NJ","ǋ":"Nj","Ⓞ":"O","Ｏ":"O","Ò":"O","Ó":"O","Ô":"O","Ồ":"O","Ố":"O","Ỗ":"O","Ổ":"O","Õ":"O","Ṍ":"O","Ȭ":"O","Ṏ":"O","Ō":"O","Ṑ":"O","Ṓ":"O","Ŏ":"O","Ȯ":"O","Ȱ":"O","Ö":"O","Ȫ":"O","Ỏ":"O","Ő":"O","Ǒ":"O","Ȍ":"O","Ȏ":"O","Ơ":"O","Ờ":"O","Ớ":"O","Ỡ":"O","Ở":"O","Ợ":"O","Ọ":"O","Ộ":"O","Ǫ":"O","Ǭ":"O","Ø":"O","Ǿ":"O","Ɔ":"O","Ɵ":"O","Ꝋ":"O","Ꝍ":"O","Ƣ":"OI","Ꝏ":"OO","Ȣ":"OU","Ⓟ":"P","Ｐ":"P","Ṕ":"P","Ṗ":"P","Ƥ":"P","Ᵽ":"P","Ꝑ":"P","Ꝓ":"P","Ꝕ":"P","Ⓠ":"Q","Ｑ":"Q","Ꝗ":"Q","Ꝙ":"Q","Ɋ":"Q","Ⓡ":"R","Ｒ":"R","Ŕ":"R","Ṙ":"R","Ř":"R","Ȑ":"R","Ȓ":"R","Ṛ":"R","Ṝ":"R","Ŗ":"R","Ṟ":"R","Ɍ":"R","Ɽ":"R","Ꝛ":"R","Ꞧ":"R","Ꞃ":"R","Ⓢ":"S","Ｓ":"S","ẞ":"S","Ś":"S","Ṥ":"S","Ŝ":"S","Ṡ":"S","Š":"S","Ṧ":"S","Ṣ":"S","Ṩ":"S","Ș":"S","Ş":"S","Ȿ":"S","Ꞩ":"S","Ꞅ":"S","Ⓣ":"T","Ｔ":"T","Ṫ":"T","Ť":"T","Ṭ":"T","Ț":"T","Ţ":"T","Ṱ":"T","Ṯ":"T","Ŧ":"T","Ƭ":"T","Ʈ":"T","Ⱦ":"T","Ꞇ":"T","Ꜩ":"TZ","Ⓤ":"U","Ｕ":"U","Ù":"U","Ú":"U","Û":"U","Ũ":"U","Ṹ":"U","Ū":"U","Ṻ":"U","Ŭ":"U","Ü":"U","Ǜ":"U","Ǘ":"U","Ǖ":"U","Ǚ":"U","Ủ":"U","Ů":"U","Ű":"U","Ǔ":"U","Ȕ":"U","Ȗ":"U","Ư":"U","Ừ":"U","Ứ":"U","Ữ":"U","Ử":"U","Ự":"U","Ụ":"U","Ṳ":"U","Ų":"U","Ṷ":"U","Ṵ":"U","Ʉ":"U","Ⓥ":"V","Ｖ":"V","Ṽ":"V","Ṿ":"V","Ʋ":"V","Ꝟ":"V","Ʌ":"V","Ꝡ":"VY","Ⓦ":"W","Ｗ":"W","Ẁ":"W","Ẃ":"W","Ŵ":"W","Ẇ":"W","Ẅ":"W","Ẉ":"W","Ⱳ":"W","Ⓧ":"X","Ｘ":"X","Ẋ":"X","Ẍ":"X","Ⓨ":"Y","Ｙ":"Y","Ỳ":"Y","Ý":"Y","Ŷ":"Y","Ỹ":"Y","Ȳ":"Y","Ẏ":"Y","Ÿ":"Y","Ỷ":"Y","Ỵ":"Y","Ƴ":"Y","Ɏ":"Y","Ỿ":"Y","Ⓩ":"Z","Ｚ":"Z","Ź":"Z","Ẑ":"Z","Ż":"Z","Ž":"Z","Ẓ":"Z","Ẕ":"Z","Ƶ":"Z","Ȥ":"Z","Ɀ":"Z","Ⱬ":"Z","Ꝣ":"Z","ⓐ":"a","ａ":"a","ẚ":"a","à":"a","á":"a","â":"a","ầ":"a","ấ":"a","ẫ":"a","ẩ":"a","ã":"a","ā":"a","ă":"a","ằ":"a","ắ":"a","ẵ":"a","ẳ":"a","ȧ":"a","ǡ":"a","ä":"a","ǟ":"a","ả":"a","å":"a","ǻ":"a","ǎ":"a","ȁ":"a","ȃ":"a","ạ":"a","ậ":"a","ặ":"a","ḁ":"a","ą":"a","ⱥ":"a","ɐ":"a","ꜳ":"aa","æ":"ae","ǽ":"ae","ǣ":"ae","ꜵ":"ao","ꜷ":"au","ꜹ":"av","ꜻ":"av","ꜽ":"ay","ⓑ":"b","ｂ":"b","ḃ":"b","ḅ":"b","ḇ":"b","ƀ":"b","ƃ":"b","ɓ":"b","ⓒ":"c","ｃ":"c","ć":"c","ĉ":"c","ċ":"c","č":"c","ç":"c","ḉ":"c","ƈ":"c","ȼ":"c","ꜿ":"c","ↄ":"c","ⓓ":"d","ｄ":"d","ḋ":"d","ď":"d","ḍ":"d","ḑ":"d","ḓ":"d","ḏ":"d","đ":"d","ƌ":"d","ɖ":"d","ɗ":"d","ꝺ":"d","ǳ":"dz","ǆ":"dz","ⓔ":"e","ｅ":"e","è":"e","é":"e","ê":"e","ề":"e","ế":"e","ễ":"e","ể":"e","ẽ":"e","ē":"e","ḕ":"e","ḗ":"e","ĕ":"e","ė":"e","ë":"e","ẻ":"e","ě":"e","ȅ":"e","ȇ":"e","ẹ":"e","ệ":"e","ȩ":"e","ḝ":"e","ę":"e","ḙ":"e","ḛ":"e","ɇ":"e","ɛ":"e","ǝ":"e","ⓕ":"f","ｆ":"f","ḟ":"f","ƒ":"f","ꝼ":"f","ⓖ":"g","ｇ":"g","ǵ":"g","ĝ":"g","ḡ":"g","ğ":"g","ġ":"g","ǧ":"g","ģ":"g","ǥ":"g","ɠ":"g","ꞡ":"g","ᵹ":"g","ꝿ":"g","ⓗ":"h","ｈ":"h","ĥ":"h","ḣ":"h","ḧ":"h","ȟ":"h","ḥ":"h","ḩ":"h","ḫ":"h","ẖ":"h","ħ":"h","ⱨ":"h","ⱶ":"h","ɥ":"h","ƕ":"hv","ⓘ":"i","ｉ":"i","ì":"i","í":"i","î":"i","ĩ":"i","ī":"i","ĭ":"i","ï":"i","ḯ":"i","ỉ":"i","ǐ":"i","ȉ":"i","ȋ":"i","ị":"i","į":"i","ḭ":"i","ɨ":"i","ı":"i","ⓙ":"j","ｊ":"j","ĵ":"j","ǰ":"j","ɉ":"j","ⓚ":"k","ｋ":"k","ḱ":"k","ǩ":"k","ḳ":"k","ķ":"k","ḵ":"k","ƙ":"k","ⱪ":"k","ꝁ":"k","ꝃ":"k","ꝅ":"k","ꞣ":"k","ⓛ":"l","ｌ":"l","ŀ":"l","ĺ":"l","ľ":"l","ḷ":"l","ḹ":"l","ļ":"l","ḽ":"l","ḻ":"l","ſ":"l","ł":"l","ƚ":"l","ɫ":"l","ⱡ":"l","ꝉ":"l","ꞁ":"l","ꝇ":"l","ǉ":"lj","ⓜ":"m","ｍ":"m","ḿ":"m","ṁ":"m","ṃ":"m","ɱ":"m","ɯ":"m","ⓝ":"n","ｎ":"n","ǹ":"n","ń":"n","ñ":"n","ṅ":"n","ň":"n","ṇ":"n","ņ":"n","ṋ":"n","ṉ":"n","ƞ":"n","ɲ":"n","ŉ":"n","ꞑ":"n","ꞥ":"n","ǌ":"nj","ⓞ":"o","ｏ":"o","ò":"o","ó":"o","ô":"o","ồ":"o","ố":"o","ỗ":"o","ổ":"o","õ":"o","ṍ":"o","ȭ":"o","ṏ":"o","ō":"o","ṑ":"o","ṓ":"o","ŏ":"o","ȯ":"o","ȱ":"o","ö":"o","ȫ":"o","ỏ":"o","ő":"o","ǒ":"o","ȍ":"o","ȏ":"o","ơ":"o","ờ":"o","ớ":"o","ỡ":"o","ở":"o","ợ":"o","ọ":"o","ộ":"o","ǫ":"o","ǭ":"o","ø":"o","ǿ":"o","ɔ":"o","ꝋ":"o","ꝍ":"o","ɵ":"o","ƣ":"oi","ȣ":"ou","ꝏ":"oo","ⓟ":"p","ｐ":"p","ṕ":"p","ṗ":"p","ƥ":"p","ᵽ":"p","ꝑ":"p","ꝓ":"p","ꝕ":"p","ⓠ":"q","ｑ":"q","ɋ":"q","ꝗ":"q","ꝙ":"q","ⓡ":"r","ｒ":"r","ŕ":"r","ṙ":"r","ř":"r","ȑ":"r","ȓ":"r","ṛ":"r","ṝ":"r","ŗ":"r","ṟ":"r","ɍ":"r","ɽ":"r","ꝛ":"r","ꞧ":"r","ꞃ":"r","ⓢ":"s","ｓ":"s","ß":"s","ś":"s","ṥ":"s","ŝ":"s","ṡ":"s","š":"s","ṧ":"s","ṣ":"s","ṩ":"s","ș":"s","ş":"s","ȿ":"s","ꞩ":"s","ꞅ":"s","ẛ":"s","ⓣ":"t","ｔ":"t","ṫ":"t","ẗ":"t","ť":"t","ṭ":"t","ț":"t","ţ":"t","ṱ":"t","ṯ":"t","ŧ":"t","ƭ":"t","ʈ":"t","ⱦ":"t","ꞇ":"t","ꜩ":"tz","ⓤ":"u","ｕ":"u","ù":"u","ú":"u","û":"u","ũ":"u","ṹ":"u","ū":"u","ṻ":"u","ŭ":"u","ü":"u","ǜ":"u","ǘ":"u","ǖ":"u","ǚ":"u","ủ":"u","ů":"u","ű":"u","ǔ":"u","ȕ":"u","ȗ":"u","ư":"u","ừ":"u","ứ":"u","ữ":"u","ử":"u","ự":"u","ụ":"u","ṳ":"u","ų":"u","ṷ":"u","ṵ":"u","ʉ":"u","ⓥ":"v","ｖ":"v","ṽ":"v","ṿ":"v","ʋ":"v","ꝟ":"v","ʌ":"v","ꝡ":"vy","ⓦ":"w","ｗ":"w","ẁ":"w","ẃ":"w","ŵ":"w","ẇ":"w","ẅ":"w","ẘ":"w","ẉ":"w","ⱳ":"w","ⓧ":"x","ｘ":"x","ẋ":"x","ẍ":"x","ⓨ":"y","ｙ":"y","ỳ":"y","ý":"y","ŷ":"y","ỹ":"y","ȳ":"y","ẏ":"y","ÿ":"y","ỷ":"y","ẙ":"y","ỵ":"y","ƴ":"y","ɏ":"y","ỿ":"y","ⓩ":"z","ｚ":"z","ź":"z","ẑ":"z","ż":"z","ž":"z","ẓ":"z","ẕ":"z","ƶ":"z","ȥ":"z","ɀ":"z","ⱬ":"z","ꝣ":"z","Ά":"Α","Έ":"Ε","Ή":"Η","Ί":"Ι","Ϊ":"Ι","Ό":"Ο","Ύ":"Υ","Ϋ":"Υ","Ώ":"Ω","ά":"α","έ":"ε","ή":"η","ί":"ι","ϊ":"ι","ΐ":"ι","ό":"ο","ύ":"υ","ϋ":"υ","ΰ":"υ","ω":"ω","ς":"σ"}}),b.define("select2/data/base",["../utils"],function(a){function b(a,c){b.__super__.constructor.call(this)}return a.Extend(b,a.Observable),b.prototype.current=function(a){throw new Error("The `current` method must be defined in child classes.")},b.prototype.query=function(a,b){throw new Error("The `query` method must be defined in child classes.")},b.prototype.bind=function(a,b){},b.prototype.destroy=function(){},b.prototype.generateResultId=function(b,c){var d=b.id+"-result-";return d+=a.generateChars(4),null!=c.id?d+="-"+c.id.toString():d+="-"+a.generateChars(4),d},b}),b.define("select2/data/select",["./base","../utils","jquery"],function(a,b,c){function d(a,b){this.$element=a,this.options=b,d.__super__.constructor.call(this)}return b.Extend(d,a),d.prototype.current=function(a){var b=[],d=this;this.$element.find(":selected").each(function(){var a=c(this),e=d.item(a);b.push(e)}),a(b)},d.prototype.select=function(a){var b=this;if(a.selected=!0,c(a.element).is("option"))return a.element.selected=!0,void this.$element.trigger("change");if(this.$element.prop("multiple"))this.current(function(d){var e=[];a=[a],a.push.apply(a,d);for(var f=0;f<a.length;f++){var g=a[f].id;-1===c.inArray(g,e)&&e.push(g)}b.$element.val(e),b.$element.trigger("change")});else{var d=a.id;this.$element.val(d),this.$element.trigger("change")}},d.prototype.unselect=function(a){var b=this;if(this.$element.prop("multiple")){if(a.selected=!1,c(a.element).is("option"))return a.element.selected=!1,void this.$element.trigger("change");this.current(function(d){for(var e=[],f=0;f<d.length;f++){var g=d[f].id;g!==a.id&&-1===c.inArray(g,e)&&e.push(g)}b.$element.val(e),b.$element.trigger("change")})}},d.prototype.bind=function(a,b){var c=this;this.container=a,a.on("select",function(a){c.select(a.data)}),a.on("unselect",function(a){c.unselect(a.data)})},d.prototype.destroy=function(){this.$element.find("*").each(function(){b.RemoveData(this)})},d.prototype.query=function(a,b){var d=[],e=this;this.$element.children().each(function(){var b=c(this);if(b.is("option")||b.is("optgroup")){var f=e.item(b),g=e.matches(a,f);null!==g&&d.push(g)}}),b({results:d})},d.prototype.addOptions=function(a){b.appendMany(this.$element,a)},d.prototype.option=function(a){var d;a.children?(d=document.createElement("optgroup"),d.label=a.text):(d=document.createElement("option"),void 0!==d.textContent?d.textContent=a.text:d.innerText=a.text),void 0!==a.id&&(d.value=a.id),a.disabled&&(d.disabled=!0),a.selected&&(d.selected=!0),a.title&&(d.title=a.title);var e=c(d),f=this._normalizeItem(a);return f.element=d,b.StoreData(d,"data",f),e},d.prototype.item=function(a){var d={};if(null!=(d=b.GetData(a[0],"data")))return d;if(a.is("option"))d={id:a.val(),text:a.text(),disabled:a.prop("disabled"),selected:a.prop("selected"),title:a.prop("title")};else if(a.is("optgroup")){d={text:a.prop("label"),children:[],title:a.prop("title")};for(var e=a.children("option"),f=[],g=0;g<e.length;g++){var h=c(e[g]),i=this.item(h);f.push(i)}d.children=f}return d=this._normalizeItem(d),d.element=a[0],b.StoreData(a[0],"data",d),d},d.prototype._normalizeItem=function(a){a!==Object(a)&&(a={id:a,text:a}),a=c.extend({},{text:""},a);var b={selected:!1,disabled:!1};return null!=a.id&&(a.id=a.id.toString()),null!=a.text&&(a.text=a.text.toString()),null==a._resultId&&a.id&&null!=this.container&&(a._resultId=this.generateResultId(this.container,a)),c.extend({},b,a)},d.prototype.matches=function(a,b){return this.options.get("matcher")(a,b)},d}),b.define("select2/data/array",["./select","../utils","jquery"],function(a,b,c){function d(a,b){var c=b.get("data")||[];d.__super__.constructor.call(this,a,b),this.addOptions(this.convertToOptions(c))}return b.Extend(d,a),d.prototype.select=function(a){var b=this.$element.find("option").filter(function(b,c){return c.value==a.id.toString()});0===b.length&&(b=this.option(a),this.addOptions(b)),d.__super__.select.call(this,a)},d.prototype.convertToOptions=function(a){function d(a){return function(){return c(this).val()==a.id}}for(var e=this,f=this.$element.find("option"),g=f.map(function(){return e.item(c(this)).id}).get(),h=[],i=0;i<a.length;i++){var j=this._normalizeItem(a[i]);if(c.inArray(j.id,g)>=0){var k=f.filter(d(j)),l=this.item(k),m=c.extend(!0,{},j,l),n=this.option(m);k.replaceWith(n)}else{var o=this.option(j);if(j.children){var p=this.convertToOptions(j.children);b.appendMany(o,p)}h.push(o)}}return h},d}),b.define("select2/data/ajax",["./array","../utils","jquery"],function(a,b,c){function d(a,b){this.ajaxOptions=this._applyDefaults(b.get("ajax")),null!=this.ajaxOptions.processResults&&(this.processResults=this.ajaxOptions.processResults),d.__super__.constructor.call(this,a,b)}return b.Extend(d,a),d.prototype._applyDefaults=function(a){var b={data:function(a){return c.extend({},a,{q:a.term})},transport:function(a,b,d){var e=c.ajax(a);return e.then(b),e.fail(d),e}};return c.extend({},b,a,!0)},d.prototype.processResults=function(a){return a},d.prototype.query=function(a,b){function d(){var d=f.transport(f,function(d){var f=e.processResults(d,a);e.options.get("debug")&&window.console&&console.error&&(f&&f.results&&c.isArray(f.results)||console.error("Select2: The AJAX results did not return an array in the `results` key of the response.")),b(f)},function(){"status"in d&&(0===d.status||"0"===d.status)||e.trigger("results:message",{message:"errorLoading"})});e._request=d}var e=this;null!=this._request&&(c.isFunction(this._request.abort)&&this._request.abort(),this._request=null);var f=c.extend({type:"GET"},this.ajaxOptions);"function"==typeof f.url&&(f.url=f.url.call(this.$element,a)),"function"==typeof f.data&&(f.data=f.data.call(this.$element,a)),this.ajaxOptions.delay&&null!=a.term?(this._queryTimeout&&window.clearTimeout(this._queryTimeout),this._queryTimeout=window.setTimeout(d,this.ajaxOptions.delay)):d()},d}),b.define("select2/data/tags",["jquery"],function(a){function b(b,c,d){var e=d.get("tags"),f=d.get("createTag");void 0!==f&&(this.createTag=f);var g=d.get("insertTag");if(void 0!==g&&(this.insertTag=g),b.call(this,c,d),a.isArray(e))for(var h=0;h<e.length;h++){var i=e[h],j=this._normalizeItem(i),k=this.option(j);this.$element.append(k)}}return b.prototype.query=function(a,b,c){function d(a,f){for(var g=a.results,h=0;h<g.length;h++){var i=g[h],j=null!=i.children&&!d({results:i.children},!0);if((i.text||"").toUpperCase()===(b.term||"").toUpperCase()||j)return!f&&(a.data=g,void c(a))}if(f)return!0;var k=e.createTag(b);if(null!=k){var l=e.option(k);l.attr("data-select2-tag",!0),e.addOptions([l]),e.insertTag(g,k)}a.results=g,c(a)}var e=this;if(this._removeOldTags(),null==b.term||null!=b.page)return void a.call(this,b,c);a.call(this,b,d)},b.prototype.createTag=function(b,c){var d=a.trim(c.term);return""===d?null:{id:d,text:d}},b.prototype.insertTag=function(a,b,c){b.unshift(c)},b.prototype._removeOldTags=function(b){this._lastTag;this.$element.find("option[data-select2-tag]").each(function(){this.selected||a(this).remove()})},b}),b.define("select2/data/tokenizer",["jquery"],function(a){function b(a,b,c){var d=c.get("tokenizer");void 0!==d&&(this.tokenizer=d),a.call(this,b,c)}return b.prototype.bind=function(a,b,c){a.call(this,b,c),this.$search=b.dropdown.$search||b.selection.$search||c.find(".select2-search__field")},b.prototype.query=function(b,c,d){function e(b){var c=g._normalizeItem(b);if(!g.$element.find("option").filter(function(){return a(this).val()===c.id}).length){var d=g.option(c);d.attr("data-select2-tag",!0),g._removeOldTags(),g.addOptions([d])}f(c)}function f(a){g.trigger("select",{data:a})}var g=this;c.term=c.term||"";var h=this.tokenizer(c,this.options,e);h.term!==c.term&&(this.$search.length&&(this.$search.val(h.term),this.$search.focus()),c.term=h.term),b.call(this,c,d)},b.prototype.tokenizer=function(b,c,d,e){for(var f=d.get("tokenSeparators")||[],g=c.term,h=0,i=this.createTag||function(a){return{id:a.term,text:a.term}};h<g.length;){var j=g[h];if(-1!==a.inArray(j,f)){var k=g.substr(0,h),l=a.extend({},c,{term:k}),m=i(l);null!=m?(e(m),g=g.substr(h+1)||"",h=0):h++}else h++}return{term:g}},b}),b.define("select2/data/minimumInputLength",[],function(){function a(a,b,c){this.minimumInputLength=c.get("minimumInputLength"),a.call(this,b,c)}return a.prototype.query=function(a,b,c){if(b.term=b.term||"",b.term.length<this.minimumInputLength)return void this.trigger("results:message",{message:"inputTooShort",args:{minimum:this.minimumInputLength,input:b.term,params:b}});a.call(this,b,c)},a}),b.define("select2/data/maximumInputLength",[],function(){function a(a,b,c){this.maximumInputLength=c.get("maximumInputLength"),a.call(this,b,c)}return a.prototype.query=function(a,b,c){if(b.term=b.term||"",this.maximumInputLength>0&&b.term.length>this.maximumInputLength)return void this.trigger("results:message",{message:"inputTooLong",args:{maximum:this.maximumInputLength,input:b.term,params:b}});a.call(this,b,c)},a}),b.define("select2/data/maximumSelectionLength",[],function(){function a(a,b,c){this.maximumSelectionLength=c.get("maximumSelectionLength"),a.call(this,b,c)}return a.prototype.query=function(a,b,c){var d=this;this.current(function(e){var f=null!=e?e.length:0;if(d.maximumSelectionLength>0&&f>=d.maximumSelectionLength)return void d.trigger("results:message",{message:"maximumSelected",args:{maximum:d.maximumSelectionLength}});a.call(d,b,c)})},a}),b.define("select2/dropdown",["jquery","./utils"],function(a,b){function c(a,b){this.$element=a,this.options=b,c.__super__.constructor.call(this)}return b.Extend(c,b.Observable),c.prototype.render=function(){var b=a('<span class="select2-dropdown"><span class="select2-results"></span></span>');return b.attr("dir",this.options.get("dir")),this.$dropdown=b,b},c.prototype.bind=function(){},c.prototype.position=function(a,b){},c.prototype.destroy=function(){this.$dropdown.remove()},c}),b.define("select2/dropdown/search",["jquery","../utils"],function(a,b){function c(){}return c.prototype.render=function(b){var c=b.call(this),d=a('<span class="select2-search select2-search--dropdown"><input class="select2-search__field" type="search" tabindex="-1" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" role="textbox" /></span>');return this.$searchContainer=d,this.$search=d.find("input"),c.prepend(d),c},c.prototype.bind=function(b,c,d){var e=this;b.call(this,c,d),this.$search.on("keydown",function(a){e.trigger("keypress",a),e._keyUpPrevented=a.isDefaultPrevented()}),this.$search.on("input",function(b){a(this).off("keyup")}),this.$search.on("keyup input",function(a){e.handleSearch(a)}),c.on("open",function(){e.$search.attr("tabindex",0),e.$search.focus(),window.setTimeout(function(){e.$search.focus()},0)}),c.on("close",function(){e.$search.attr("tabindex",-1),e.$search.val(""),e.$search.blur()}),c.on("focus",function(){c.isOpen()||e.$search.focus()}),c.on("results:all",function(a){if(null==a.query.term||""===a.query.term){e.showSearch(a)?e.$searchContainer.removeClass("select2-search--hide"):e.$searchContainer.addClass("select2-search--hide")}})},c.prototype.handleSearch=function(a){if(!this._keyUpPrevented){var b=this.$search.val();this.trigger("query",{term:b})}this._keyUpPrevented=!1},c.prototype.showSearch=function(a,b){return!0},c}),b.define("select2/dropdown/hidePlaceholder",[],function(){function a(a,b,c,d){this.placeholder=this.normalizePlaceholder(c.get("placeholder")),a.call(this,b,c,d)}return a.prototype.append=function(a,b){b.results=this.removePlaceholder(b.results),a.call(this,b)},a.prototype.normalizePlaceholder=function(a,b){return"string"==typeof b&&(b={id:"",text:b}),b},a.prototype.removePlaceholder=function(a,b){for(var c=b.slice(0),d=b.length-1;d>=0;d--){var e=b[d];this.placeholder.id===e.id&&c.splice(d,1)}return c},a}),b.define("select2/dropdown/infiniteScroll",["jquery"],function(a){function b(a,b,c,d){this.lastParams={},a.call(this,b,c,d),this.$loadingMore=this.createLoadingMore(),this.loading=!1}return b.prototype.append=function(a,b){this.$loadingMore.remove(),this.loading=!1,a.call(this,b),this.showLoadingMore(b)&&this.$results.append(this.$loadingMore)},b.prototype.bind=function(b,c,d){var e=this;b.call(this,c,d),c.on("query",function(a){e.lastParams=a,e.loading=!0}),c.on("query:append",function(a){e.lastParams=a,e.loading=!0}),this.$results.on("scroll",function(){var b=a.contains(document.documentElement,e.$loadingMore[0]);if(!e.loading&&b){e.$results.offset().top+e.$results.outerHeight(!1)+50>=e.$loadingMore.offset().top+e.$loadingMore.outerHeight(!1)&&e.loadMore()}})},b.prototype.loadMore=function(){this.loading=!0;var b=a.extend({},{page:1},this.lastParams);b.page++,this.trigger("query:append",b)},b.prototype.showLoadingMore=function(a,b){return b.pagination&&b.pagination.more},b.prototype.createLoadingMore=function(){var b=a('<li class="select2-results__option select2-results__option--load-more"role="treeitem" aria-disabled="true"></li>'),c=this.options.get("translations").get("loadingMore");return b.html(c(this.lastParams)),b},b}),b.define("select2/dropdown/attachBody",["jquery","../utils"],function(a,b){function c(b,c,d){this.$dropdownParent=d.get("dropdownParent")||a(document.body),b.call(this,c,d)}return c.prototype.bind=function(a,b,c){var d=this,e=!1;a.call(this,b,c),b.on("open",function(){d._showDropdown(),d._attachPositioningHandler(b),e||(e=!0,b.on("results:all",function(){d._positionDropdown(),d._resizeDropdown()}),b.on("results:append",function(){d._positionDropdown(),d._resizeDropdown()}))}),b.on("close",function(){d._hideDropdown(),d._detachPositioningHandler(b)}),this.$dropdownContainer.on("mousedown",function(a){a.stopPropagation()})},c.prototype.destroy=function(a){a.call(this),this.$dropdownContainer.remove()},c.prototype.position=function(a,b,c){b.attr("class",c.attr("class")),b.removeClass("select2"),b.addClass("select2-container--open"),b.css({position:"absolute",top:-999999}),this.$container=c},c.prototype.render=function(b){var c=a("<span></span>"),d=b.call(this);return c.append(d),this.$dropdownContainer=c,c},c.prototype._hideDropdown=function(a){this.$dropdownContainer.detach()},c.prototype._attachPositioningHandler=function(c,d){var e=this,f="scroll.select2."+d.id,g="resize.select2."+d.id,h="orientationchange.select2."+d.id,i=this.$container.parents().filter(b.hasScroll);i.each(function(){b.StoreData(this,"select2-scroll-position",{x:a(this).scrollLeft(),y:a(this).scrollTop()})}),i.on(f,function(c){var d=b.GetData(this,"select2-scroll-position");a(this).scrollTop(d.y)}),a(window).on(f+" "+g+" "+h,function(a){e._positionDropdown(),e._resizeDropdown()})},c.prototype._detachPositioningHandler=function(c,d){var e="scroll.select2."+d.id,f="resize.select2."+d.id,g="orientationchange.select2."+d.id;this.$container.parents().filter(b.hasScroll).off(e),a(window).off(e+" "+f+" "+g)},c.prototype._positionDropdown=function(){var b=a(window),c=this.$dropdown.hasClass("select2-dropdown--above"),d=this.$dropdown.hasClass("select2-dropdown--below"),e=null,f=this.$container.offset();f.bottom=f.top+this.$container.outerHeight(!1);var g={height:this.$container.outerHeight(!1)};g.top=f.top,g.bottom=f.top+g.height;var h={height:this.$dropdown.outerHeight(!1)},i={top:b.scrollTop(),bottom:b.scrollTop()+b.height()},j=i.top<f.top-h.height,k=i.bottom>f.bottom+h.height,l={left:f.left,top:g.bottom},m=this.$dropdownParent;"static"===m.css("position")&&(m=m.offsetParent());var n=m.offset();l.top-=n.top,l.left-=n.left,c||d||(e="below"),k||!j||c?!j&&k&&c&&(e="below"):e="above",("above"==e||c&&"below"!==e)&&(l.top=g.top-n.top-h.height),null!=e&&(this.$dropdown.removeClass("select2-dropdown--below select2-dropdown--above").addClass("select2-dropdown--"+e),this.$container.removeClass("select2-container--below select2-container--above").addClass("select2-container--"+e)),this.$dropdownContainer.css(l)},c.prototype._resizeDropdown=function(){var a={width:this.$container.outerWidth(!1)+"px"};this.options.get("dropdownAutoWidth")&&(a.minWidth=a.width,a.position="relative",a.width="auto"),this.$dropdown.css(a)},c.prototype._showDropdown=function(a){this.$dropdownContainer.appendTo(this.$dropdownParent),this._positionDropdown(),this._resizeDropdown()},c}),b.define("select2/dropdown/minimumResultsForSearch",[],function(){function a(b){for(var c=0,d=0;d<b.length;d++){var e=b[d];e.children?c+=a(e.children):c++}return c}function b(a,b,c,d){this.minimumResultsForSearch=c.get("minimumResultsForSearch"),this.minimumResultsForSearch<0&&(this.minimumResultsForSearch=1/0),a.call(this,b,c,d)}return b.prototype.showSearch=function(b,c){return!(a(c.data.results)<this.minimumResultsForSearch)&&b.call(this,c)},b}),b.define("select2/dropdown/selectOnClose",["../utils"],function(a){function b(){}return b.prototype.bind=function(a,b,c){var d=this;a.call(this,b,c),b.on("close",function(a){d._handleSelectOnClose(a)})},b.prototype._handleSelectOnClose=function(b,c){if(c&&null!=c.originalSelect2Event){var d=c.originalSelect2Event;if("select"===d._type||"unselect"===d._type)return}var e=this.getHighlightedResults();if(!(e.length<1)){var f=a.GetData(e[0],"data");null!=f.element&&f.element.selected||null==f.element&&f.selected||this.trigger("select",{data:f})}},b}),b.define("select2/dropdown/closeOnSelect",[],function(){function a(){}return a.prototype.bind=function(a,b,c){var d=this;a.call(this,b,c),b.on("select",function(a){d._selectTriggered(a)}),b.on("unselect",function(a){d._selectTriggered(a)})},a.prototype._selectTriggered=function(a,b){var c=b.originalEvent;c&&c.ctrlKey||this.trigger("close",{originalEvent:c,originalSelect2Event:b})},a}),b.define("select2/i18n/en",[],function(){return{errorLoading:function(){return"The results could not be loaded."},inputTooLong:function(a){var b=a.input.length-a.maximum,c="Please delete "+b+" character";return 1!=b&&(c+="s"),c},inputTooShort:function(a){return"Please enter "+(a.minimum-a.input.length)+" or more characters"},loadingMore:function(){return"Loading more results…"},maximumSelected:function(a){var b="You can only select "+a.maximum+" item";return 1!=a.maximum&&(b+="s"),b},noResults:function(){return"No results found"},searching:function(){return"Searching…"}}}),b.define("select2/defaults",["jquery","require","./results","./selection/single","./selection/multiple","./selection/placeholder","./selection/allowClear","./selection/search","./selection/eventRelay","./utils","./translation","./diacritics","./data/select","./data/array","./data/ajax","./data/tags","./data/tokenizer","./data/minimumInputLength","./data/maximumInputLength","./data/maximumSelectionLength","./dropdown","./dropdown/search","./dropdown/hidePlaceholder","./dropdown/infiniteScroll","./dropdown/attachBody","./dropdown/minimumResultsForSearch","./dropdown/selectOnClose","./dropdown/closeOnSelect","./i18n/en"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C){function D(){this.reset()}return D.prototype.apply=function(l){if(l=a.extend(!0,{},this.defaults,l),null==l.dataAdapter){if(null!=l.ajax?l.dataAdapter=o:null!=l.data?l.dataAdapter=n:l.dataAdapter=m,l.minimumInputLength>0&&(l.dataAdapter=j.Decorate(l.dataAdapter,r)),l.maximumInputLength>0&&(l.dataAdapter=j.Decorate(l.dataAdapter,s)),l.maximumSelectionLength>0&&(l.dataAdapter=j.Decorate(l.dataAdapter,t)),l.tags&&(l.dataAdapter=j.Decorate(l.dataAdapter,p)),null==l.tokenSeparators&&null==l.tokenizer||(l.dataAdapter=j.Decorate(l.dataAdapter,q)),null!=l.query){var C=b(l.amdBase+"compat/query");l.dataAdapter=j.Decorate(l.dataAdapter,C)}if(null!=l.initSelection){var D=b(l.amdBase+"compat/initSelection");l.dataAdapter=j.Decorate(l.dataAdapter,D)}}if(null==l.resultsAdapter&&(l.resultsAdapter=c,null!=l.ajax&&(l.resultsAdapter=j.Decorate(l.resultsAdapter,x)),null!=l.placeholder&&(l.resultsAdapter=j.Decorate(l.resultsAdapter,w)),l.selectOnClose&&(l.resultsAdapter=j.Decorate(l.resultsAdapter,A))),null==l.dropdownAdapter){if(l.multiple)l.dropdownAdapter=u;else{var E=j.Decorate(u,v);l.dropdownAdapter=E}if(0!==l.minimumResultsForSearch&&(l.dropdownAdapter=j.Decorate(l.dropdownAdapter,z)),l.closeOnSelect&&(l.dropdownAdapter=j.Decorate(l.dropdownAdapter,B)),null!=l.dropdownCssClass||null!=l.dropdownCss||null!=l.adaptDropdownCssClass){var F=b(l.amdBase+"compat/dropdownCss");l.dropdownAdapter=j.Decorate(l.dropdownAdapter,F)}l.dropdownAdapter=j.Decorate(l.dropdownAdapter,y)}if(null==l.selectionAdapter){if(l.multiple?l.selectionAdapter=e:l.selectionAdapter=d,null!=l.placeholder&&(l.selectionAdapter=j.Decorate(l.selectionAdapter,f)),l.allowClear&&(l.selectionAdapter=j.Decorate(l.selectionAdapter,g)),l.multiple&&(l.selectionAdapter=j.Decorate(l.selectionAdapter,h)),null!=l.containerCssClass||null!=l.containerCss||null!=l.adaptContainerCssClass){var G=b(l.amdBase+"compat/containerCss");l.selectionAdapter=j.Decorate(l.selectionAdapter,G)}l.selectionAdapter=j.Decorate(l.selectionAdapter,i)}if("string"==typeof l.language)if(l.language.indexOf("-")>0){var H=l.language.split("-"),I=H[0];l.language=[l.language,I]}else l.language=[l.language];if(a.isArray(l.language)){var J=new k;l.language.push("en");for(var K=l.language,L=0;L<K.length;L++){var M=K[L],N={};try{N=k.loadPath(M)}catch(a){try{M=this.defaults.amdLanguageBase+M,N=k.loadPath(M)}catch(a){l.debug&&window.console&&console.warn&&console.warn('Select2: The language file for "'+M+'" could not be automatically loaded. A fallback will be used instead.');continue}}J.extend(N)}l.translations=J}else{var O=k.loadPath(this.defaults.amdLanguageBase+"en"),P=new k(l.language);P.extend(O),l.translations=P}return l},D.prototype.reset=function(){function b(a){function b(a){return l[a]||a}return a.replace(/[^\u0000-\u007E]/g,b)}function c(d,e){if(""===a.trim(d.term))return e;if(e.children&&e.children.length>0){for(var f=a.extend(!0,{},e),g=e.children.length-1;g>=0;g--){null==c(d,e.children[g])&&f.children.splice(g,1)}return f.children.length>0?f:c(d,f)}var h=b(e.text).toUpperCase(),i=b(d.term).toUpperCase();return h.indexOf(i)>-1?e:null}this.defaults={amdBase:"./",amdLanguageBase:"./i18n/",closeOnSelect:!0,debug:!1,dropdownAutoWidth:!1,escapeMarkup:j.escapeMarkup,language:C,matcher:c,minimumInputLength:0,maximumInputLength:0,maximumSelectionLength:0,minimumResultsForSearch:0,selectOnClose:!1,sorter:function(a){return a},templateResult:function(a){return a.text},templateSelection:function(a){return a.text},theme:"default",width:"resolve"}},D.prototype.set=function(b,c){var d=a.camelCase(b),e={};e[d]=c;var f=j._convertData(e);a.extend(!0,this.defaults,f)},new D}),b.define("select2/options",["require","jquery","./defaults","./utils"],function(a,b,c,d){function e(b,e){if(this.options=b,null!=e&&this.fromElement(e),this.options=c.apply(this.options),e&&e.is("input")){var f=a(this.get("amdBase")+"compat/inputData");this.options.dataAdapter=d.Decorate(this.options.dataAdapter,f)}}return e.prototype.fromElement=function(a){var c=["select2"];null==this.options.multiple&&(this.options.multiple=a.prop("multiple")),null==this.options.disabled&&(this.options.disabled=a.prop("disabled")),null==this.options.language&&(a.prop("lang")?this.options.language=a.prop("lang").toLowerCase():a.closest("[lang]").prop("lang")&&(this.options.language=a.closest("[lang]").prop("lang"))),null==this.options.dir&&(a.prop("dir")?this.options.dir=a.prop("dir"):a.closest("[dir]").prop("dir")?this.options.dir=a.closest("[dir]").prop("dir"):this.options.dir="ltr"),a.prop("disabled",this.options.disabled),a.prop("multiple",this.options.multiple),d.GetData(a[0],"select2Tags")&&(this.options.debug&&window.console&&console.warn&&console.warn('Select2: The `data-select2-tags` attribute has been changed to use the `data-data` and `data-tags="true"` attributes and will be removed in future versions of Select2.'),d.StoreData(a[0],"data",d.GetData(a[0],"select2Tags")),d.StoreData(a[0],"tags",!0)),d.GetData(a[0],"ajaxUrl")&&(this.options.debug&&window.console&&console.warn&&console.warn("Select2: The `data-ajax-url` attribute has been changed to `data-ajax--url` and support for the old attribute will be removed in future versions of Select2."),a.attr("ajax--url",d.GetData(a[0],"ajaxUrl")),d.StoreData(a[0],"ajax-Url",d.GetData(a[0],"ajaxUrl")));var e={};e=b.fn.jquery&&"1."==b.fn.jquery.substr(0,2)&&a[0].dataset?b.extend(!0,{},a[0].dataset,d.GetData(a[0])):d.GetData(a[0]);var f=b.extend(!0,{},e);f=d._convertData(f);for(var g in f)b.inArray(g,c)>-1||(b.isPlainObject(this.options[g])?b.extend(this.options[g],f[g]):this.options[g]=f[g]);return this},e.prototype.get=function(a){return this.options[a]},e.prototype.set=function(a,b){this.options[a]=b},e}),b.define("select2/core",["jquery","./options","./utils","./keys"],function(a,b,c,d){var e=function(a,d){null!=c.GetData(a[0],"select2")&&c.GetData(a[0],"select2").destroy(),this.$element=a,this.id=this._generateId(a),d=d||{},this.options=new b(d,a),e.__super__.constructor.call(this);var f=a.attr("tabindex")||0;c.StoreData(a[0],"old-tabindex",f),a.attr("tabindex","-1");var g=this.options.get("dataAdapter");this.dataAdapter=new g(a,this.options);var h=this.render();this._placeContainer(h);var i=this.options.get("selectionAdapter");this.selection=new i(a,this.options),this.$selection=this.selection.render(),this.selection.position(this.$selection,h);var j=this.options.get("dropdownAdapter");this.dropdown=new j(a,this.options),this.$dropdown=this.dropdown.render(),this.dropdown.position(this.$dropdown,h);var k=this.options.get("resultsAdapter");this.results=new k(a,this.options,this.dataAdapter),this.$results=this.results.render(),this.results.position(this.$results,this.$dropdown);var l=this;this._bindAdapters(),this._registerDomEvents(),this._registerDataEvents(),this._registerSelectionEvents(),this._registerDropdownEvents(),this._registerResultsEvents(),this._registerEvents(),this.dataAdapter.current(function(a){l.trigger("selection:update",{data:a})}),a.addClass("select2-hidden-accessible"),a.attr("aria-hidden","true"),this._syncAttributes(),c.StoreData(a[0],"select2",this),a.data("select2",this)};return c.Extend(e,c.Observable),e.prototype._generateId=function(a){var b="";return b=null!=a.attr("id")?a.attr("id"):null!=a.attr("name")?a.attr("name")+"-"+c.generateChars(2):c.generateChars(4),b=b.replace(/(:|\.|\[|\]|,)/g,""),b="select2-"+b},e.prototype._placeContainer=function(a){a.insertAfter(this.$element);var b=this._resolveWidth(this.$element,this.options.get("width"));null!=b&&a.css("width",b)},e.prototype._resolveWidth=function(a,b){var c=/^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i;if("resolve"==b){var d=this._resolveWidth(a,"style");return null!=d?d:this._resolveWidth(a,"element")}if("element"==b){var e=a.outerWidth(!1);return e<=0?"auto":e+"px"}if("style"==b){var f=a.attr("style");if("string"!=typeof f)return null;for(var g=f.split(";"),h=0,i=g.length;h<i;h+=1){var j=g[h].replace(/\s/g,""),k=j.match(c);if(null!==k&&k.length>=1)return k[1]}return null}return b},e.prototype._bindAdapters=function(){this.dataAdapter.bind(this,this.$container),this.selection.bind(this,this.$container),this.dropdown.bind(this,this.$container),this.results.bind(this,this.$container)},e.prototype._registerDomEvents=function(){var b=this;this.$element.on("change.select2",function(){b.dataAdapter.current(function(a){b.trigger("selection:update",{data:a})})}),this.$element.on("focus.select2",function(a){b.trigger("focus",a)}),this._syncA=c.bind(this._syncAttributes,this),this._syncS=c.bind(this._syncSubtree,this),this.$element[0].attachEvent&&this.$element[0].attachEvent("onpropertychange",this._syncA);var d=window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver;null!=d?(this._observer=new d(function(c){a.each(c,b._syncA),a.each(c,b._syncS)}),this._observer.observe(this.$element[0],{attributes:!0,childList:!0,subtree:!1})):this.$element[0].addEventListener&&(this.$element[0].addEventListener("DOMAttrModified",b._syncA,!1),this.$element[0].addEventListener("DOMNodeInserted",b._syncS,!1),this.$element[0].addEventListener("DOMNodeRemoved",b._syncS,!1))},e.prototype._registerDataEvents=function(){var a=this;this.dataAdapter.on("*",function(b,c){a.trigger(b,c)})},e.prototype._registerSelectionEvents=function(){var b=this,c=["toggle","focus"];this.selection.on("toggle",function(){b.toggleDropdown()}),this.selection.on("focus",function(a){b.focus(a)}),this.selection.on("*",function(d,e){-1===a.inArray(d,c)&&b.trigger(d,e)})},e.prototype._registerDropdownEvents=function(){var a=this;this.dropdown.on("*",function(b,c){a.trigger(b,c)})},e.prototype._registerResultsEvents=function(){var a=this;this.results.on("*",function(b,c){a.trigger(b,c)})},e.prototype._registerEvents=function(){var a=this;this.on("open",function(){a.$container.addClass("select2-container--open")}),this.on("close",function(){a.$container.removeClass("select2-container--open")}),this.on("enable",function(){a.$container.removeClass("select2-container--disabled")}),this.on("disable",function(){a.$container.addClass("select2-container--disabled")}),this.on("blur",function(){a.$container.removeClass("select2-container--focus")}),this.on("query",function(b){a.isOpen()||a.trigger("open",{}),this.dataAdapter.query(b,function(c){a.trigger("results:all",{data:c,query:b})})}),this.on("query:append",function(b){this.dataAdapter.query(b,function(c){a.trigger("results:append",{data:c,query:b})})}),this.on("keypress",function(b){var c=b.which;a.isOpen()?c===d.ESC||c===d.TAB||c===d.UP&&b.altKey?(a.close(),b.preventDefault()):c===d.ENTER?(a.trigger("results:select",{}),b.preventDefault()):c===d.SPACE&&b.ctrlKey?(a.trigger("results:toggle",{}),b.preventDefault()):c===d.UP?(a.trigger("results:previous",{}),b.preventDefault()):c===d.DOWN&&(a.trigger("results:next",{}),b.preventDefault()):(c===d.ENTER||c===d.SPACE||c===d.DOWN&&b.altKey)&&(a.open(),b.preventDefault())})},e.prototype._syncAttributes=function(){this.options.set("disabled",this.$element.prop("disabled")),this.options.get("disabled")?(this.isOpen()&&this.close(),this.trigger("disable",{})):this.trigger("enable",{})},e.prototype._syncSubtree=function(a,b){var c=!1,d=this;if(!a||!a.target||"OPTION"===a.target.nodeName||"OPTGROUP"===a.target.nodeName){if(b)if(b.addedNodes&&b.addedNodes.length>0)for(var e=0;e<b.addedNodes.length;e++){var f=b.addedNodes[e];f.selected&&(c=!0)}else b.removedNodes&&b.removedNodes.length>0&&(c=!0);else c=!0;c&&this.dataAdapter.current(function(a){d.trigger("selection:update",{data:a})})}},e.prototype.trigger=function(a,b){var c=e.__super__.trigger,d={open:"opening",close:"closing",select:"selecting",unselect:"unselecting",clear:"clearing"};if(void 0===b&&(b={}),a in d){var f=d[a],g={prevented:!1,name:a,args:b};if(c.call(this,f,g),g.prevented)return void(b.prevented=!0)}c.call(this,a,b)},e.prototype.toggleDropdown=function(){this.options.get("disabled")||(this.isOpen()?this.close():this.open())},e.prototype.open=function(){this.isOpen()||this.trigger("query",{})},e.prototype.close=function(){this.isOpen()&&this.trigger("close",{})},e.prototype.isOpen=function(){return this.$container.hasClass("select2-container--open")},e.prototype.hasFocus=function(){return this.$container.hasClass("select2-container--focus")},e.prototype.focus=function(a){this.hasFocus()||(this.$container.addClass("select2-container--focus"),this.trigger("focus",{}))},e.prototype.enable=function(a){this.options.get("debug")&&window.console&&console.warn&&console.warn('Select2: The `select2("enable")` method has been deprecated and will be removed in later Select2 versions. Use $element.prop("disabled") instead.'),null!=a&&0!==a.length||(a=[!0]);var b=!a[0];this.$element.prop("disabled",b)},e.prototype.data=function(){this.options.get("debug")&&arguments.length>0&&window.console&&console.warn&&console.warn('Select2: Data can no longer be set using `select2("data")`. You should consider setting the value instead using `$element.val()`.');var a=[];return this.dataAdapter.current(function(b){a=b}),a},e.prototype.val=function(b){if(this.options.get("debug")&&window.console&&console.warn&&console.warn('Select2: The `select2("val")` method has been deprecated and will be removed in later Select2 versions. Use $element.val() instead.'),null==b||0===b.length)return this.$element.val();var c=b[0];a.isArray(c)&&(c=a.map(c,function(a){return a.toString()})),this.$element.val(c).trigger("change")},e.prototype.destroy=function(){this.$container.remove(),this.$element[0].detachEvent&&this.$element[0].detachEvent("onpropertychange",this._syncA),null!=this._observer?(this._observer.disconnect(),this._observer=null):this.$element[0].removeEventListener&&(this.$element[0].removeEventListener("DOMAttrModified",this._syncA,!1),this.$element[0].removeEventListener("DOMNodeInserted",this._syncS,!1),this.$element[0].removeEventListener("DOMNodeRemoved",this._syncS,!1)),this._syncA=null,this._syncS=null,this.$element.off(".select2"),this.$element.attr("tabindex",c.GetData(this.$element[0],"old-tabindex")),this.$element.removeClass("select2-hidden-accessible"),this.$element.attr("aria-hidden","false"),c.RemoveData(this.$element[0]),this.$element.removeData("select2"),this.dataAdapter.destroy(),this.selection.destroy(),this.dropdown.destroy(),this.results.destroy(),this.dataAdapter=null,this.selection=null,this.dropdown=null,this.results=null},e.prototype.render=function(){var b=a('<span class="select2 select2-container"><span class="selection"></span><span class="dropdown-wrapper" aria-hidden="true"></span></span>');return b.attr("dir",this.options.get("dir")),this.$container=b,this.$container.addClass("select2-container--"+this.options.get("theme")),c.StoreData(b[0],"element",this.$element),b},e}),b.define("jquery-mousewheel",["jquery"],function(a){return a}),b.define("jquery.select2",["jquery","jquery-mousewheel","./select2/core","./select2/defaults","./select2/utils"],function(a,b,c,d,e){if(null==a.fn.select2){var f=["open","close","destroy"];a.fn.select2=function(b){if("object"==typeof(b=b||{}))return this.each(function(){var d=a.extend(!0,{},b);new c(a(this),d)}),this;if("string"==typeof b){var d,g=Array.prototype.slice.call(arguments,1);return this.each(function(){var a=e.GetData(this,"select2");null==a&&window.console&&console.error&&console.error("The select2('"+b+"') method was called on an element that is not using Select2."),d=a[b].apply(a,g)}),a.inArray(b,f)>-1?this:d}throw new Error("Invalid arguments for Select2: "+b)}}return null==a.fn.select2.defaults&&(a.fn.select2.defaults=d),c}),{define:b.define,require:b.require}}(),c=b.require("jquery.select2");return a.fn.select2.amd=b,c});

/*  slick  */
/*
     _ _      _       _
 ___| (_) ___| | __  (_)___
/ __| | |/ __| |/ /  | / __|
\__ \ | | (__|   < _ | \__ \
|___/_|_|\___|_|\_(_)/ |___/
                   |__/

 Version: 1.9.0
  Author: Ken Wheeler
 Website: http://kenwheeler.github.io
    Docs: http://kenwheeler.github.io/slick
    Repo: http://github.com/kenwheeler/slick
  Issues: http://github.com/kenwheeler/slick/issues

 */
(function(i){"use strict";"function"==typeof define&&define.amd?define(["jquery"],i):"undefined"!=typeof exports?module.exports=i(require("jquery")):i(jQuery)})(function(i){"use strict";var e=window.Slick||{};e=function(){function e(e,o){var s,n=this;n.defaults={accessibility:!0,adaptiveHeight:!1,appendArrows:i(e),appendDots:i(e),arrows:!0,asNavFor:null,prevArrow:'<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',nextArrow:'<button class="slick-next" aria-label="Next" type="button">Next</button>',autoplay:!1,autoplaySpeed:3e3,centerMode:!1,centerPadding:"50px",cssEase:"ease",customPaging:function(e,t){return i('<button type="button" />').text(t+1)},dots:!1,dotsClass:"slick-dots",draggable:!0,easing:"linear",edgeFriction:.35,fade:!1,focusOnSelect:!1,focusOnChange:!1,infinite:!0,initialSlide:0,lazyLoad:"ondemand",mobileFirst:!1,pauseOnHover:!0,pauseOnFocus:!0,pauseOnDotsHover:!1,respondTo:"window",responsive:null,rows:1,rtl:!1,slide:"",slidesPerRow:1,slidesToShow:1,slidesToScroll:1,speed:500,swipe:!0,swipeToSlide:!1,touchMove:!0,touchThreshold:5,useCSS:!0,useTransform:!0,variableWidth:!1,vertical:!1,verticalSwiping:!1,waitForAnimate:!0,zIndex:1e3},n.initials={animating:!1,dragging:!1,autoPlayTimer:null,currentDirection:0,currentLeft:null,currentSlide:0,direction:1,$dots:null,listWidth:null,listHeight:null,loadIndex:0,$nextArrow:null,$prevArrow:null,scrolling:!1,slideCount:null,slideWidth:null,$slideTrack:null,$slides:null,sliding:!1,slideOffset:0,swipeLeft:null,swiping:!1,$list:null,touchObject:{},transformsEnabled:!1,unslicked:!1},i.extend(n,n.initials),n.activeBreakpoint=null,n.animType=null,n.animProp=null,n.breakpoints=[],n.breakpointSettings=[],n.cssTransitions=!1,n.focussed=!1,n.interrupted=!1,n.hidden="hidden",n.paused=!0,n.positionProp=null,n.respondTo=null,n.rowCount=1,n.shouldClick=!0,n.$slider=i(e),n.$slidesCache=null,n.transformType=null,n.transitionType=null,n.visibilityChange="visibilitychange",n.windowWidth=0,n.windowTimer=null,s=i(e).data("slick")||{},n.options=i.extend({},n.defaults,o,s),n.currentSlide=n.options.initialSlide,n.originalSettings=n.options,"undefined"!=typeof document.mozHidden?(n.hidden="mozHidden",n.visibilityChange="mozvisibilitychange"):"undefined"!=typeof document.webkitHidden&&(n.hidden="webkitHidden",n.visibilityChange="webkitvisibilitychange"),n.autoPlay=i.proxy(n.autoPlay,n),n.autoPlayClear=i.proxy(n.autoPlayClear,n),n.autoPlayIterator=i.proxy(n.autoPlayIterator,n),n.changeSlide=i.proxy(n.changeSlide,n),n.clickHandler=i.proxy(n.clickHandler,n),n.selectHandler=i.proxy(n.selectHandler,n),n.setPosition=i.proxy(n.setPosition,n),n.swipeHandler=i.proxy(n.swipeHandler,n),n.dragHandler=i.proxy(n.dragHandler,n),n.keyHandler=i.proxy(n.keyHandler,n),n.instanceUid=t++,n.htmlExpr=/^(?:\s*(<[\w\W]+>)[^>]*)$/,n.registerBreakpoints(),n.init(!0)}var t=0;return e}(),e.prototype.activateADA=function(){var i=this;i.$slideTrack.find(".slick-active").attr({"aria-hidden":"false"}).find("a, input, button, select").attr({tabindex:"0"})},e.prototype.addSlide=e.prototype.slickAdd=function(e,t,o){var s=this;if("boolean"==typeof t)o=t,t=null;else if(t<0||t>=s.slideCount)return!1;s.unload(),"number"==typeof t?0===t&&0===s.$slides.length?i(e).appendTo(s.$slideTrack):o?i(e).insertBefore(s.$slides.eq(t)):i(e).insertAfter(s.$slides.eq(t)):o===!0?i(e).prependTo(s.$slideTrack):i(e).appendTo(s.$slideTrack),s.$slides=s.$slideTrack.children(this.options.slide),s.$slideTrack.children(this.options.slide).detach(),s.$slideTrack.append(s.$slides),s.$slides.each(function(e,t){i(t).attr("data-slick-index",e)}),s.$slidesCache=s.$slides,s.reinit()},e.prototype.animateHeight=function(){var i=this;if(1===i.options.slidesToShow&&i.options.adaptiveHeight===!0&&i.options.vertical===!1){var e=i.$slides.eq(i.currentSlide).outerHeight(!0);i.$list.animate({height:e},i.options.speed)}},e.prototype.animateSlide=function(e,t){var o={},s=this;s.animateHeight(),s.options.rtl===!0&&s.options.vertical===!1&&(e=-e),s.transformsEnabled===!1?s.options.vertical===!1?s.$slideTrack.animate({left:e},s.options.speed,s.options.easing,t):s.$slideTrack.animate({top:e},s.options.speed,s.options.easing,t):s.cssTransitions===!1?(s.options.rtl===!0&&(s.currentLeft=-s.currentLeft),i({animStart:s.currentLeft}).animate({animStart:e},{duration:s.options.speed,easing:s.options.easing,step:function(i){i=Math.ceil(i),s.options.vertical===!1?(o[s.animType]="translate("+i+"px, 0px)",s.$slideTrack.css(o)):(o[s.animType]="translate(0px,"+i+"px)",s.$slideTrack.css(o))},complete:function(){t&&t.call()}})):(s.applyTransition(),e=Math.ceil(e),s.options.vertical===!1?o[s.animType]="translate3d("+e+"px, 0px, 0px)":o[s.animType]="translate3d(0px,"+e+"px, 0px)",s.$slideTrack.css(o),t&&setTimeout(function(){s.disableTransition(),t.call()},s.options.speed))},e.prototype.getNavTarget=function(){var e=this,t=e.options.asNavFor;return t&&null!==t&&(t=i(t).not(e.$slider)),t},e.prototype.asNavFor=function(e){var t=this,o=t.getNavTarget();null!==o&&"object"==typeof o&&o.each(function(){var t=i(this).slick("getSlick");t.unslicked||t.slideHandler(e,!0)})},e.prototype.applyTransition=function(i){var e=this,t={};e.options.fade===!1?t[e.transitionType]=e.transformType+" "+e.options.speed+"ms "+e.options.cssEase:t[e.transitionType]="opacity "+e.options.speed+"ms "+e.options.cssEase,e.options.fade===!1?e.$slideTrack.css(t):e.$slides.eq(i).css(t)},e.prototype.autoPlay=function(){var i=this;i.autoPlayClear(),i.slideCount>i.options.slidesToShow&&(i.autoPlayTimer=setInterval(i.autoPlayIterator,i.options.autoplaySpeed))},e.prototype.autoPlayClear=function(){var i=this;i.autoPlayTimer&&clearInterval(i.autoPlayTimer)},e.prototype.autoPlayIterator=function(){var i=this,e=i.currentSlide+i.options.slidesToScroll;i.paused||i.interrupted||i.focussed||(i.options.infinite===!1&&(1===i.direction&&i.currentSlide+1===i.slideCount-1?i.direction=0:0===i.direction&&(e=i.currentSlide-i.options.slidesToScroll,i.currentSlide-1===0&&(i.direction=1))),i.slideHandler(e))},e.prototype.buildArrows=function(){var e=this;e.options.arrows===!0&&(e.$prevArrow=i(e.options.prevArrow).addClass("slick-arrow"),e.$nextArrow=i(e.options.nextArrow).addClass("slick-arrow"),e.slideCount>e.options.slidesToShow?(e.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),e.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),e.htmlExpr.test(e.options.prevArrow)&&e.$prevArrow.prependTo(e.options.appendArrows),e.htmlExpr.test(e.options.nextArrow)&&e.$nextArrow.appendTo(e.options.appendArrows),e.options.infinite!==!0&&e.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true")):e.$prevArrow.add(e.$nextArrow).addClass("slick-hidden").attr({"aria-disabled":"true",tabindex:"-1"}))},e.prototype.buildDots=function(){var e,t,o=this;if(o.options.dots===!0&&o.slideCount>o.options.slidesToShow){for(o.$slider.addClass("slick-dotted"),t=i("<ul />").addClass(o.options.dotsClass),e=0;e<=o.getDotCount();e+=1)t.append(i("<li />").append(o.options.customPaging.call(this,o,e)));o.$dots=t.appendTo(o.options.appendDots),o.$dots.find("li").first().addClass("slick-active")}},e.prototype.buildOut=function(){var e=this;e.$slides=e.$slider.children(e.options.slide+":not(.slick-cloned)").addClass("slick-slide"),e.slideCount=e.$slides.length,e.$slides.each(function(e,t){i(t).attr("data-slick-index",e).data("originalStyling",i(t).attr("style")||"")}),e.$slider.addClass("slick-slider"),e.$slideTrack=0===e.slideCount?i('<div class="slick-track"/>').appendTo(e.$slider):e.$slides.wrapAll('<div class="slick-track"/>').parent(),e.$list=e.$slideTrack.wrap('<div class="slick-list"/>').parent(),e.$slideTrack.css("opacity",0),e.options.centerMode!==!0&&e.options.swipeToSlide!==!0||(e.options.slidesToScroll=1),i("img[data-lazy]",e.$slider).not("[src]").addClass("slick-loading"),e.setupInfinite(),e.buildArrows(),e.buildDots(),e.updateDots(),e.setSlideClasses("number"==typeof e.currentSlide?e.currentSlide:0),e.options.draggable===!0&&e.$list.addClass("draggable")},e.prototype.buildRows=function(){var i,e,t,o,s,n,r,l=this;if(o=document.createDocumentFragment(),n=l.$slider.children(),l.options.rows>0){for(r=l.options.slidesPerRow*l.options.rows,s=Math.ceil(n.length/r),i=0;i<s;i++){var d=document.createElement("div");for(e=0;e<l.options.rows;e++){var a=document.createElement("div");for(t=0;t<l.options.slidesPerRow;t++){var c=i*r+(e*l.options.slidesPerRow+t);n.get(c)&&a.appendChild(n.get(c))}d.appendChild(a)}o.appendChild(d)}l.$slider.empty().append(o),l.$slider.children().children().children().css({width:100/l.options.slidesPerRow+"%",display:"inline-block"})}},e.prototype.checkResponsive=function(e,t){var o,s,n,r=this,l=!1,d=r.$slider.width(),a=window.innerWidth||i(window).width();if("window"===r.respondTo?n=a:"slider"===r.respondTo?n=d:"min"===r.respondTo&&(n=Math.min(a,d)),r.options.responsive&&r.options.responsive.length&&null!==r.options.responsive){s=null;for(o in r.breakpoints)r.breakpoints.hasOwnProperty(o)&&(r.originalSettings.mobileFirst===!1?n<r.breakpoints[o]&&(s=r.breakpoints[o]):n>r.breakpoints[o]&&(s=r.breakpoints[o]));null!==s?null!==r.activeBreakpoint?(s!==r.activeBreakpoint||t)&&(r.activeBreakpoint=s,"unslick"===r.breakpointSettings[s]?r.unslick(s):(r.options=i.extend({},r.originalSettings,r.breakpointSettings[s]),e===!0&&(r.currentSlide=r.options.initialSlide),r.refresh(e)),l=s):(r.activeBreakpoint=s,"unslick"===r.breakpointSettings[s]?r.unslick(s):(r.options=i.extend({},r.originalSettings,r.breakpointSettings[s]),e===!0&&(r.currentSlide=r.options.initialSlide),r.refresh(e)),l=s):null!==r.activeBreakpoint&&(r.activeBreakpoint=null,r.options=r.originalSettings,e===!0&&(r.currentSlide=r.options.initialSlide),r.refresh(e),l=s),e||l===!1||r.$slider.trigger("breakpoint",[r,l])}},e.prototype.changeSlide=function(e,t){var o,s,n,r=this,l=i(e.currentTarget);switch(l.is("a")&&e.preventDefault(),l.is("li")||(l=l.closest("li")),n=r.slideCount%r.options.slidesToScroll!==0,o=n?0:(r.slideCount-r.currentSlide)%r.options.slidesToScroll,e.data.message){case"previous":s=0===o?r.options.slidesToScroll:r.options.slidesToShow-o,r.slideCount>r.options.slidesToShow&&r.slideHandler(r.currentSlide-s,!1,t);break;case"next":s=0===o?r.options.slidesToScroll:o,r.slideCount>r.options.slidesToShow&&r.slideHandler(r.currentSlide+s,!1,t);break;case"index":var d=0===e.data.index?0:e.data.index||l.index()*r.options.slidesToScroll;r.slideHandler(r.checkNavigable(d),!1,t),l.children().trigger("focus");break;default:return}},e.prototype.checkNavigable=function(i){var e,t,o=this;if(e=o.getNavigableIndexes(),t=0,i>e[e.length-1])i=e[e.length-1];else for(var s in e){if(i<e[s]){i=t;break}t=e[s]}return i},e.prototype.cleanUpEvents=function(){var e=this;e.options.dots&&null!==e.$dots&&(i("li",e.$dots).off("click.slick",e.changeSlide).off("mouseenter.slick",i.proxy(e.interrupt,e,!0)).off("mouseleave.slick",i.proxy(e.interrupt,e,!1)),e.options.accessibility===!0&&e.$dots.off("keydown.slick",e.keyHandler)),e.$slider.off("focus.slick blur.slick"),e.options.arrows===!0&&e.slideCount>e.options.slidesToShow&&(e.$prevArrow&&e.$prevArrow.off("click.slick",e.changeSlide),e.$nextArrow&&e.$nextArrow.off("click.slick",e.changeSlide),e.options.accessibility===!0&&(e.$prevArrow&&e.$prevArrow.off("keydown.slick",e.keyHandler),e.$nextArrow&&e.$nextArrow.off("keydown.slick",e.keyHandler))),e.$list.off("touchstart.slick mousedown.slick",e.swipeHandler),e.$list.off("touchmove.slick mousemove.slick",e.swipeHandler),e.$list.off("touchend.slick mouseup.slick",e.swipeHandler),e.$list.off("touchcancel.slick mouseleave.slick",e.swipeHandler),e.$list.off("click.slick",e.clickHandler),i(document).off(e.visibilityChange,e.visibility),e.cleanUpSlideEvents(),e.options.accessibility===!0&&e.$list.off("keydown.slick",e.keyHandler),e.options.focusOnSelect===!0&&i(e.$slideTrack).children().off("click.slick",e.selectHandler),i(window).off("orientationchange.slick.slick-"+e.instanceUid,e.orientationChange),i(window).off("resize.slick.slick-"+e.instanceUid,e.resize),i("[draggable!=true]",e.$slideTrack).off("dragstart",e.preventDefault),i(window).off("load.slick.slick-"+e.instanceUid,e.setPosition)},e.prototype.cleanUpSlideEvents=function(){var e=this;e.$list.off("mouseenter.slick",i.proxy(e.interrupt,e,!0)),e.$list.off("mouseleave.slick",i.proxy(e.interrupt,e,!1))},e.prototype.cleanUpRows=function(){var i,e=this;e.options.rows>0&&(i=e.$slides.children().children(),i.removeAttr("style"),e.$slider.empty().append(i))},e.prototype.clickHandler=function(i){var e=this;e.shouldClick===!1&&(i.stopImmediatePropagation(),i.stopPropagation(),i.preventDefault())},e.prototype.destroy=function(e){var t=this;t.autoPlayClear(),t.touchObject={},t.cleanUpEvents(),i(".slick-cloned",t.$slider).detach(),t.$dots&&t.$dots.remove(),t.$prevArrow&&t.$prevArrow.length&&(t.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),t.htmlExpr.test(t.options.prevArrow)&&t.$prevArrow.remove()),t.$nextArrow&&t.$nextArrow.length&&(t.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),t.htmlExpr.test(t.options.nextArrow)&&t.$nextArrow.remove()),t.$slides&&(t.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function(){i(this).attr("style",i(this).data("originalStyling"))}),t.$slideTrack.children(this.options.slide).detach(),t.$slideTrack.detach(),t.$list.detach(),t.$slider.append(t.$slides)),t.cleanUpRows(),t.$slider.removeClass("slick-slider"),t.$slider.removeClass("slick-initialized"),t.$slider.removeClass("slick-dotted"),t.unslicked=!0,e||t.$slider.trigger("destroy",[t])},e.prototype.disableTransition=function(i){var e=this,t={};t[e.transitionType]="",e.options.fade===!1?e.$slideTrack.css(t):e.$slides.eq(i).css(t)},e.prototype.fadeSlide=function(i,e){var t=this;t.cssTransitions===!1?(t.$slides.eq(i).css({zIndex:t.options.zIndex}),t.$slides.eq(i).animate({opacity:1},t.options.speed,t.options.easing,e)):(t.applyTransition(i),t.$slides.eq(i).css({opacity:1,zIndex:t.options.zIndex}),e&&setTimeout(function(){t.disableTransition(i),e.call()},t.options.speed))},e.prototype.fadeSlideOut=function(i){var e=this;e.cssTransitions===!1?e.$slides.eq(i).animate({opacity:0,zIndex:e.options.zIndex-2},e.options.speed,e.options.easing):(e.applyTransition(i),e.$slides.eq(i).css({opacity:0,zIndex:e.options.zIndex-2}))},e.prototype.filterSlides=e.prototype.slickFilter=function(i){var e=this;null!==i&&(e.$slidesCache=e.$slides,e.unload(),e.$slideTrack.children(this.options.slide).detach(),e.$slidesCache.filter(i).appendTo(e.$slideTrack),e.reinit())},e.prototype.focusHandler=function(){var e=this;e.$slider.off("focus.slick blur.slick").on("focus.slick","*",function(t){var o=i(this);setTimeout(function(){e.options.pauseOnFocus&&o.is(":focus")&&(e.focussed=!0,e.autoPlay())},0)}).on("blur.slick","*",function(t){i(this);e.options.pauseOnFocus&&(e.focussed=!1,e.autoPlay())})},e.prototype.getCurrent=e.prototype.slickCurrentSlide=function(){var i=this;return i.currentSlide},e.prototype.getDotCount=function(){var i=this,e=0,t=0,o=0;if(i.options.infinite===!0)if(i.slideCount<=i.options.slidesToShow)++o;else for(;e<i.slideCount;)++o,e=t+i.options.slidesToScroll,t+=i.options.slidesToScroll<=i.options.slidesToShow?i.options.slidesToScroll:i.options.slidesToShow;else if(i.options.centerMode===!0)o=i.slideCount;else if(i.options.asNavFor)for(;e<i.slideCount;)++o,e=t+i.options.slidesToScroll,t+=i.options.slidesToScroll<=i.options.slidesToShow?i.options.slidesToScroll:i.options.slidesToShow;else o=1+Math.ceil((i.slideCount-i.options.slidesToShow)/i.options.slidesToScroll);return o-1},e.prototype.getLeft=function(i){var e,t,o,s,n=this,r=0;return n.slideOffset=0,t=n.$slides.first().outerHeight(!0),n.options.infinite===!0?(n.slideCount>n.options.slidesToShow&&(n.slideOffset=n.slideWidth*n.options.slidesToShow*-1,s=-1,n.options.vertical===!0&&n.options.centerMode===!0&&(2===n.options.slidesToShow?s=-1.5:1===n.options.slidesToShow&&(s=-2)),r=t*n.options.slidesToShow*s),n.slideCount%n.options.slidesToScroll!==0&&i+n.options.slidesToScroll>n.slideCount&&n.slideCount>n.options.slidesToShow&&(i>n.slideCount?(n.slideOffset=(n.options.slidesToShow-(i-n.slideCount))*n.slideWidth*-1,r=(n.options.slidesToShow-(i-n.slideCount))*t*-1):(n.slideOffset=n.slideCount%n.options.slidesToScroll*n.slideWidth*-1,r=n.slideCount%n.options.slidesToScroll*t*-1))):i+n.options.slidesToShow>n.slideCount&&(n.slideOffset=(i+n.options.slidesToShow-n.slideCount)*n.slideWidth,r=(i+n.options.slidesToShow-n.slideCount)*t),n.slideCount<=n.options.slidesToShow&&(n.slideOffset=0,r=0),n.options.centerMode===!0&&n.slideCount<=n.options.slidesToShow?n.slideOffset=n.slideWidth*Math.floor(n.options.slidesToShow)/2-n.slideWidth*n.slideCount/2:n.options.centerMode===!0&&n.options.infinite===!0?n.slideOffset+=n.slideWidth*Math.floor(n.options.slidesToShow/2)-n.slideWidth:n.options.centerMode===!0&&(n.slideOffset=0,n.slideOffset+=n.slideWidth*Math.floor(n.options.slidesToShow/2)),e=n.options.vertical===!1?i*n.slideWidth*-1+n.slideOffset:i*t*-1+r,n.options.variableWidth===!0&&(o=n.slideCount<=n.options.slidesToShow||n.options.infinite===!1?n.$slideTrack.children(".slick-slide").eq(i):n.$slideTrack.children(".slick-slide").eq(i+n.options.slidesToShow),e=n.options.rtl===!0?o[0]?(n.$slideTrack.width()-o[0].offsetLeft-o.width())*-1:0:o[0]?o[0].offsetLeft*-1:0,n.options.centerMode===!0&&(o=n.slideCount<=n.options.slidesToShow||n.options.infinite===!1?n.$slideTrack.children(".slick-slide").eq(i):n.$slideTrack.children(".slick-slide").eq(i+n.options.slidesToShow+1),e=n.options.rtl===!0?o[0]?(n.$slideTrack.width()-o[0].offsetLeft-o.width())*-1:0:o[0]?o[0].offsetLeft*-1:0,e+=(n.$list.width()-o.outerWidth())/2)),e},e.prototype.getOption=e.prototype.slickGetOption=function(i){var e=this;return e.options[i]},e.prototype.getNavigableIndexes=function(){var i,e=this,t=0,o=0,s=[];for(e.options.infinite===!1?i=e.slideCount:(t=e.options.slidesToScroll*-1,o=e.options.slidesToScroll*-1,i=2*e.slideCount);t<i;)s.push(t),t=o+e.options.slidesToScroll,o+=e.options.slidesToScroll<=e.options.slidesToShow?e.options.slidesToScroll:e.options.slidesToShow;return s},e.prototype.getSlick=function(){return this},e.prototype.getSlideCount=function(){var e,t,o,s,n=this;return s=n.options.centerMode===!0?Math.floor(n.$list.width()/2):0,o=n.swipeLeft*-1+s,n.options.swipeToSlide===!0?(n.$slideTrack.find(".slick-slide").each(function(e,s){var r,l,d;if(r=i(s).outerWidth(),l=s.offsetLeft,n.options.centerMode!==!0&&(l+=r/2),d=l+r,o<d)return t=s,!1}),e=Math.abs(i(t).attr("data-slick-index")-n.currentSlide)||1):n.options.slidesToScroll},e.prototype.goTo=e.prototype.slickGoTo=function(i,e){var t=this;t.changeSlide({data:{message:"index",index:parseInt(i)}},e)},e.prototype.init=function(e){var t=this;i(t.$slider).hasClass("slick-initialized")||(i(t.$slider).addClass("slick-initialized"),t.buildRows(),t.buildOut(),t.setProps(),t.startLoad(),t.loadSlider(),t.initializeEvents(),t.updateArrows(),t.updateDots(),t.checkResponsive(!0),t.focusHandler()),e&&t.$slider.trigger("init",[t]),t.options.accessibility===!0&&t.initADA(),t.options.autoplay&&(t.paused=!1,t.autoPlay())},e.prototype.initADA=function(){var e=this,t=Math.ceil(e.slideCount/e.options.slidesToShow),o=e.getNavigableIndexes().filter(function(i){return i>=0&&i<e.slideCount});e.$slides.add(e.$slideTrack.find(".slick-cloned")).attr({"aria-hidden":"true",tabindex:"-1"}).find("a, input, button, select").attr({tabindex:"-1"}),null!==e.$dots&&(e.$slides.not(e.$slideTrack.find(".slick-cloned")).each(function(t){var s=o.indexOf(t);if(i(this).attr({role:"tabpanel",id:"slick-slide"+e.instanceUid+t,tabindex:-1}),s!==-1){var n="slick-slide-control"+e.instanceUid+s;i("#"+n).length&&i(this).attr({"aria-describedby":n})}}),e.$dots.attr("role","tablist").find("li").each(function(s){var n=o[s];i(this).attr({role:"presentation"}),i(this).find("button").first().attr({role:"tab",id:"slick-slide-control"+e.instanceUid+s,"aria-controls":"slick-slide"+e.instanceUid+n,"aria-label":s+1+" of "+t,"aria-selected":null,tabindex:"-1"})}).eq(e.currentSlide).find("button").attr({"aria-selected":"true",tabindex:"0"}).end());for(var s=e.currentSlide,n=s+e.options.slidesToShow;s<n;s++)e.options.focusOnChange?e.$slides.eq(s).attr({tabindex:"0"}):e.$slides.eq(s).removeAttr("tabindex");e.activateADA()},e.prototype.initArrowEvents=function(){var i=this;i.options.arrows===!0&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.off("click.slick").on("click.slick",{message:"previous"},i.changeSlide),i.$nextArrow.off("click.slick").on("click.slick",{message:"next"},i.changeSlide),i.options.accessibility===!0&&(i.$prevArrow.on("keydown.slick",i.keyHandler),i.$nextArrow.on("keydown.slick",i.keyHandler)))},e.prototype.initDotEvents=function(){var e=this;e.options.dots===!0&&e.slideCount>e.options.slidesToShow&&(i("li",e.$dots).on("click.slick",{message:"index"},e.changeSlide),e.options.accessibility===!0&&e.$dots.on("keydown.slick",e.keyHandler)),e.options.dots===!0&&e.options.pauseOnDotsHover===!0&&e.slideCount>e.options.slidesToShow&&i("li",e.$dots).on("mouseenter.slick",i.proxy(e.interrupt,e,!0)).on("mouseleave.slick",i.proxy(e.interrupt,e,!1))},e.prototype.initSlideEvents=function(){var e=this;e.options.pauseOnHover&&(e.$list.on("mouseenter.slick",i.proxy(e.interrupt,e,!0)),e.$list.on("mouseleave.slick",i.proxy(e.interrupt,e,!1)))},e.prototype.initializeEvents=function(){var e=this;e.initArrowEvents(),e.initDotEvents(),e.initSlideEvents(),e.$list.on("touchstart.slick mousedown.slick",{action:"start"},e.swipeHandler),e.$list.on("touchmove.slick mousemove.slick",{action:"move"},e.swipeHandler),e.$list.on("touchend.slick mouseup.slick",{action:"end"},e.swipeHandler),e.$list.on("touchcancel.slick mouseleave.slick",{action:"end"},e.swipeHandler),e.$list.on("click.slick",e.clickHandler),i(document).on(e.visibilityChange,i.proxy(e.visibility,e)),e.options.accessibility===!0&&e.$list.on("keydown.slick",e.keyHandler),e.options.focusOnSelect===!0&&i(e.$slideTrack).children().on("click.slick",e.selectHandler),i(window).on("orientationchange.slick.slick-"+e.instanceUid,i.proxy(e.orientationChange,e)),i(window).on("resize.slick.slick-"+e.instanceUid,i.proxy(e.resize,e)),i("[draggable!=true]",e.$slideTrack).on("dragstart",e.preventDefault),i(window).on("load.slick.slick-"+e.instanceUid,e.setPosition),i(e.setPosition)},e.prototype.initUI=function(){var i=this;i.options.arrows===!0&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.show(),i.$nextArrow.show()),i.options.dots===!0&&i.slideCount>i.options.slidesToShow&&i.$dots.show()},e.prototype.keyHandler=function(i){var e=this;i.target.tagName.match("TEXTAREA|INPUT|SELECT")||(37===i.keyCode&&e.options.accessibility===!0?e.changeSlide({data:{message:e.options.rtl===!0?"next":"previous"}}):39===i.keyCode&&e.options.accessibility===!0&&e.changeSlide({data:{message:e.options.rtl===!0?"previous":"next"}}))},e.prototype.lazyLoad=function(){function e(e){i("img[data-lazy]",e).each(function(){var e=i(this),t=i(this).attr("data-lazy"),o=i(this).attr("data-srcset"),s=i(this).attr("data-sizes")||r.$slider.attr("data-sizes"),n=document.createElement("img");n.onload=function(){e.animate({opacity:0},100,function(){o&&(e.attr("srcset",o),s&&e.attr("sizes",s)),e.attr("src",t).animate({opacity:1},200,function(){e.removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading")}),r.$slider.trigger("lazyLoaded",[r,e,t])})},n.onerror=function(){e.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),r.$slider.trigger("lazyLoadError",[r,e,t])},n.src=t})}var t,o,s,n,r=this;if(r.options.centerMode===!0?r.options.infinite===!0?(s=r.currentSlide+(r.options.slidesToShow/2+1),n=s+r.options.slidesToShow+2):(s=Math.max(0,r.currentSlide-(r.options.slidesToShow/2+1)),n=2+(r.options.slidesToShow/2+1)+r.currentSlide):(s=r.options.infinite?r.options.slidesToShow+r.currentSlide:r.currentSlide,n=Math.ceil(s+r.options.slidesToShow),r.options.fade===!0&&(s>0&&s--,n<=r.slideCount&&n++)),t=r.$slider.find(".slick-slide").slice(s,n),"anticipated"===r.options.lazyLoad)for(var l=s-1,d=n,a=r.$slider.find(".slick-slide"),c=0;c<r.options.slidesToScroll;c++)l<0&&(l=r.slideCount-1),t=t.add(a.eq(l)),t=t.add(a.eq(d)),l--,d++;e(t),r.slideCount<=r.options.slidesToShow?(o=r.$slider.find(".slick-slide"),e(o)):r.currentSlide>=r.slideCount-r.options.slidesToShow?(o=r.$slider.find(".slick-cloned").slice(0,r.options.slidesToShow),e(o)):0===r.currentSlide&&(o=r.$slider.find(".slick-cloned").slice(r.options.slidesToShow*-1),e(o))},e.prototype.loadSlider=function(){var i=this;i.setPosition(),i.$slideTrack.css({opacity:1}),i.$slider.removeClass("slick-loading"),i.initUI(),"progressive"===i.options.lazyLoad&&i.progressiveLazyLoad()},e.prototype.next=e.prototype.slickNext=function(){var i=this;i.changeSlide({data:{message:"next"}})},e.prototype.orientationChange=function(){var i=this;i.checkResponsive(),i.setPosition()},e.prototype.pause=e.prototype.slickPause=function(){var i=this;i.autoPlayClear(),i.paused=!0},e.prototype.play=e.prototype.slickPlay=function(){var i=this;i.autoPlay(),i.options.autoplay=!0,i.paused=!1,i.focussed=!1,i.interrupted=!1},e.prototype.postSlide=function(e){var t=this;if(!t.unslicked&&(t.$slider.trigger("afterChange",[t,e]),t.animating=!1,t.slideCount>t.options.slidesToShow&&t.setPosition(),t.swipeLeft=null,t.options.autoplay&&t.autoPlay(),t.options.accessibility===!0&&(t.initADA(),t.options.focusOnChange))){var o=i(t.$slides.get(t.currentSlide));o.attr("tabindex",0).focus()}},e.prototype.prev=e.prototype.slickPrev=function(){var i=this;i.changeSlide({data:{message:"previous"}})},e.prototype.preventDefault=function(i){i.preventDefault()},e.prototype.progressiveLazyLoad=function(e){e=e||1;var t,o,s,n,r,l=this,d=i("img[data-lazy]",l.$slider);d.length?(t=d.first(),o=t.attr("data-lazy"),s=t.attr("data-srcset"),n=t.attr("data-sizes")||l.$slider.attr("data-sizes"),r=document.createElement("img"),r.onload=function(){s&&(t.attr("srcset",s),n&&t.attr("sizes",n)),t.attr("src",o).removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading"),l.options.adaptiveHeight===!0&&l.setPosition(),l.$slider.trigger("lazyLoaded",[l,t,o]),l.progressiveLazyLoad()},r.onerror=function(){e<3?setTimeout(function(){l.progressiveLazyLoad(e+1)},500):(t.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),l.$slider.trigger("lazyLoadError",[l,t,o]),l.progressiveLazyLoad())},r.src=o):l.$slider.trigger("allImagesLoaded",[l])},e.prototype.refresh=function(e){var t,o,s=this;o=s.slideCount-s.options.slidesToShow,!s.options.infinite&&s.currentSlide>o&&(s.currentSlide=o),s.slideCount<=s.options.slidesToShow&&(s.currentSlide=0),t=s.currentSlide,s.destroy(!0),i.extend(s,s.initials,{currentSlide:t}),s.init(),e||s.changeSlide({data:{message:"index",index:t}},!1)},e.prototype.registerBreakpoints=function(){var e,t,o,s=this,n=s.options.responsive||null;if("array"===i.type(n)&&n.length){s.respondTo=s.options.respondTo||"window";for(e in n)if(o=s.breakpoints.length-1,n.hasOwnProperty(e)){for(t=n[e].breakpoint;o>=0;)s.breakpoints[o]&&s.breakpoints[o]===t&&s.breakpoints.splice(o,1),o--;s.breakpoints.push(t),s.breakpointSettings[t]=n[e].settings}s.breakpoints.sort(function(i,e){return s.options.mobileFirst?i-e:e-i})}},e.prototype.reinit=function(){var e=this;e.$slides=e.$slideTrack.children(e.options.slide).addClass("slick-slide"),e.slideCount=e.$slides.length,e.currentSlide>=e.slideCount&&0!==e.currentSlide&&(e.currentSlide=e.currentSlide-e.options.slidesToScroll),e.slideCount<=e.options.slidesToShow&&(e.currentSlide=0),e.registerBreakpoints(),e.setProps(),e.setupInfinite(),e.buildArrows(),e.updateArrows(),e.initArrowEvents(),e.buildDots(),e.updateDots(),e.initDotEvents(),e.cleanUpSlideEvents(),e.initSlideEvents(),e.checkResponsive(!1,!0),e.options.focusOnSelect===!0&&i(e.$slideTrack).children().on("click.slick",e.selectHandler),e.setSlideClasses("number"==typeof e.currentSlide?e.currentSlide:0),e.setPosition(),e.focusHandler(),e.paused=!e.options.autoplay,e.autoPlay(),e.$slider.trigger("reInit",[e])},e.prototype.resize=function(){var e=this;i(window).width()!==e.windowWidth&&(clearTimeout(e.windowDelay),e.windowDelay=window.setTimeout(function(){e.windowWidth=i(window).width(),e.checkResponsive(),e.unslicked||e.setPosition()},50))},e.prototype.removeSlide=e.prototype.slickRemove=function(i,e,t){var o=this;return"boolean"==typeof i?(e=i,i=e===!0?0:o.slideCount-1):i=e===!0?--i:i,!(o.slideCount<1||i<0||i>o.slideCount-1)&&(o.unload(),t===!0?o.$slideTrack.children().remove():o.$slideTrack.children(this.options.slide).eq(i).remove(),o.$slides=o.$slideTrack.children(this.options.slide),o.$slideTrack.children(this.options.slide).detach(),o.$slideTrack.append(o.$slides),o.$slidesCache=o.$slides,void o.reinit())},e.prototype.setCSS=function(i){var e,t,o=this,s={};o.options.rtl===!0&&(i=-i),e="left"==o.positionProp?Math.ceil(i)+"px":"0px",t="top"==o.positionProp?Math.ceil(i)+"px":"0px",s[o.positionProp]=i,o.transformsEnabled===!1?o.$slideTrack.css(s):(s={},o.cssTransitions===!1?(s[o.animType]="translate("+e+", "+t+")",o.$slideTrack.css(s)):(s[o.animType]="translate3d("+e+", "+t+", 0px)",o.$slideTrack.css(s)))},e.prototype.setDimensions=function(){var i=this;i.options.vertical===!1?i.options.centerMode===!0&&i.$list.css({padding:"0px "+i.options.centerPadding}):(i.$list.height(i.$slides.first().outerHeight(!0)*i.options.slidesToShow),i.options.centerMode===!0&&i.$list.css({padding:i.options.centerPadding+" 0px"})),i.listWidth=i.$list.width(),i.listHeight=i.$list.height(),i.options.vertical===!1&&i.options.variableWidth===!1?(i.slideWidth=Math.ceil(i.listWidth/i.options.slidesToShow),i.$slideTrack.width(Math.ceil(i.slideWidth*i.$slideTrack.children(".slick-slide").length))):i.options.variableWidth===!0?i.$slideTrack.width(5e3*i.slideCount):(i.slideWidth=Math.ceil(i.listWidth),i.$slideTrack.height(Math.ceil(i.$slides.first().outerHeight(!0)*i.$slideTrack.children(".slick-slide").length)));var e=i.$slides.first().outerWidth(!0)-i.$slides.first().width();i.options.variableWidth===!1&&i.$slideTrack.children(".slick-slide").width(i.slideWidth-e)},e.prototype.setFade=function(){var e,t=this;t.$slides.each(function(o,s){e=t.slideWidth*o*-1,t.options.rtl===!0?i(s).css({position:"relative",right:e,top:0,zIndex:t.options.zIndex-2,opacity:0}):i(s).css({position:"relative",left:e,top:0,zIndex:t.options.zIndex-2,opacity:0})}),t.$slides.eq(t.currentSlide).css({zIndex:t.options.zIndex-1,opacity:1})},e.prototype.setHeight=function(){var i=this;if(1===i.options.slidesToShow&&i.options.adaptiveHeight===!0&&i.options.vertical===!1){var e=i.$slides.eq(i.currentSlide).outerHeight(!0);i.$list.css("height",e)}},e.prototype.setOption=e.prototype.slickSetOption=function(){var e,t,o,s,n,r=this,l=!1;if("object"===i.type(arguments[0])?(o=arguments[0],l=arguments[1],n="multiple"):"string"===i.type(arguments[0])&&(o=arguments[0],s=arguments[1],l=arguments[2],"responsive"===arguments[0]&&"array"===i.type(arguments[1])?n="responsive":"undefined"!=typeof arguments[1]&&(n="single")),"single"===n)r.options[o]=s;else if("multiple"===n)i.each(o,function(i,e){r.options[i]=e});else if("responsive"===n)for(t in s)if("array"!==i.type(r.options.responsive))r.options.responsive=[s[t]];else{for(e=r.options.responsive.length-1;e>=0;)r.options.responsive[e].breakpoint===s[t].breakpoint&&r.options.responsive.splice(e,1),e--;r.options.responsive.push(s[t])}l&&(r.unload(),r.reinit())},e.prototype.setPosition=function(){var i=this;i.setDimensions(),i.setHeight(),i.options.fade===!1?i.setCSS(i.getLeft(i.currentSlide)):i.setFade(),i.$slider.trigger("setPosition",[i])},e.prototype.setProps=function(){var i=this,e=document.body.style;i.positionProp=i.options.vertical===!0?"top":"left",
"top"===i.positionProp?i.$slider.addClass("slick-vertical"):i.$slider.removeClass("slick-vertical"),void 0===e.WebkitTransition&&void 0===e.MozTransition&&void 0===e.msTransition||i.options.useCSS===!0&&(i.cssTransitions=!0),i.options.fade&&("number"==typeof i.options.zIndex?i.options.zIndex<3&&(i.options.zIndex=3):i.options.zIndex=i.defaults.zIndex),void 0!==e.OTransform&&(i.animType="OTransform",i.transformType="-o-transform",i.transitionType="OTransition",void 0===e.perspectiveProperty&&void 0===e.webkitPerspective&&(i.animType=!1)),void 0!==e.MozTransform&&(i.animType="MozTransform",i.transformType="-moz-transform",i.transitionType="MozTransition",void 0===e.perspectiveProperty&&void 0===e.MozPerspective&&(i.animType=!1)),void 0!==e.webkitTransform&&(i.animType="webkitTransform",i.transformType="-webkit-transform",i.transitionType="webkitTransition",void 0===e.perspectiveProperty&&void 0===e.webkitPerspective&&(i.animType=!1)),void 0!==e.msTransform&&(i.animType="msTransform",i.transformType="-ms-transform",i.transitionType="msTransition",void 0===e.msTransform&&(i.animType=!1)),void 0!==e.transform&&i.animType!==!1&&(i.animType="transform",i.transformType="transform",i.transitionType="transition"),i.transformsEnabled=i.options.useTransform&&null!==i.animType&&i.animType!==!1},e.prototype.setSlideClasses=function(i){var e,t,o,s,n=this;if(t=n.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden","true"),n.$slides.eq(i).addClass("slick-current"),n.options.centerMode===!0){var r=n.options.slidesToShow%2===0?1:0;e=Math.floor(n.options.slidesToShow/2),n.options.infinite===!0&&(i>=e&&i<=n.slideCount-1-e?n.$slides.slice(i-e+r,i+e+1).addClass("slick-active").attr("aria-hidden","false"):(o=n.options.slidesToShow+i,t.slice(o-e+1+r,o+e+2).addClass("slick-active").attr("aria-hidden","false")),0===i?t.eq(t.length-1-n.options.slidesToShow).addClass("slick-center"):i===n.slideCount-1&&t.eq(n.options.slidesToShow).addClass("slick-center")),n.$slides.eq(i).addClass("slick-center")}else i>=0&&i<=n.slideCount-n.options.slidesToShow?n.$slides.slice(i,i+n.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false"):t.length<=n.options.slidesToShow?t.addClass("slick-active").attr("aria-hidden","false"):(s=n.slideCount%n.options.slidesToShow,o=n.options.infinite===!0?n.options.slidesToShow+i:i,n.options.slidesToShow==n.options.slidesToScroll&&n.slideCount-i<n.options.slidesToShow?t.slice(o-(n.options.slidesToShow-s),o+s).addClass("slick-active").attr("aria-hidden","false"):t.slice(o,o+n.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false"));"ondemand"!==n.options.lazyLoad&&"anticipated"!==n.options.lazyLoad||n.lazyLoad()},e.prototype.setupInfinite=function(){var e,t,o,s=this;if(s.options.fade===!0&&(s.options.centerMode=!1),s.options.infinite===!0&&s.options.fade===!1&&(t=null,s.slideCount>s.options.slidesToShow)){for(o=s.options.centerMode===!0?s.options.slidesToShow+1:s.options.slidesToShow,e=s.slideCount;e>s.slideCount-o;e-=1)t=e-1,i(s.$slides[t]).clone(!0).attr("id","").attr("data-slick-index",t-s.slideCount).prependTo(s.$slideTrack).addClass("slick-cloned");for(e=0;e<o+s.slideCount;e+=1)t=e,i(s.$slides[t]).clone(!0).attr("id","").attr("data-slick-index",t+s.slideCount).appendTo(s.$slideTrack).addClass("slick-cloned");s.$slideTrack.find(".slick-cloned").find("[id]").each(function(){i(this).attr("id","")})}},e.prototype.interrupt=function(i){var e=this;i||e.autoPlay(),e.interrupted=i},e.prototype.selectHandler=function(e){var t=this,o=i(e.target).is(".slick-slide")?i(e.target):i(e.target).parents(".slick-slide"),s=parseInt(o.attr("data-slick-index"));return s||(s=0),t.slideCount<=t.options.slidesToShow?void t.slideHandler(s,!1,!0):void t.slideHandler(s)},e.prototype.slideHandler=function(i,e,t){var o,s,n,r,l,d=null,a=this;if(e=e||!1,!(a.animating===!0&&a.options.waitForAnimate===!0||a.options.fade===!0&&a.currentSlide===i))return e===!1&&a.asNavFor(i),o=i,d=a.getLeft(o),r=a.getLeft(a.currentSlide),a.currentLeft=null===a.swipeLeft?r:a.swipeLeft,a.options.infinite===!1&&a.options.centerMode===!1&&(i<0||i>a.getDotCount()*a.options.slidesToScroll)?void(a.options.fade===!1&&(o=a.currentSlide,t!==!0&&a.slideCount>a.options.slidesToShow?a.animateSlide(r,function(){a.postSlide(o)}):a.postSlide(o))):a.options.infinite===!1&&a.options.centerMode===!0&&(i<0||i>a.slideCount-a.options.slidesToScroll)?void(a.options.fade===!1&&(o=a.currentSlide,t!==!0&&a.slideCount>a.options.slidesToShow?a.animateSlide(r,function(){a.postSlide(o)}):a.postSlide(o))):(a.options.autoplay&&clearInterval(a.autoPlayTimer),s=o<0?a.slideCount%a.options.slidesToScroll!==0?a.slideCount-a.slideCount%a.options.slidesToScroll:a.slideCount+o:o>=a.slideCount?a.slideCount%a.options.slidesToScroll!==0?0:o-a.slideCount:o,a.animating=!0,a.$slider.trigger("beforeChange",[a,a.currentSlide,s]),n=a.currentSlide,a.currentSlide=s,a.setSlideClasses(a.currentSlide),a.options.asNavFor&&(l=a.getNavTarget(),l=l.slick("getSlick"),l.slideCount<=l.options.slidesToShow&&l.setSlideClasses(a.currentSlide)),a.updateDots(),a.updateArrows(),a.options.fade===!0?(t!==!0?(a.fadeSlideOut(n),a.fadeSlide(s,function(){a.postSlide(s)})):a.postSlide(s),void a.animateHeight()):void(t!==!0&&a.slideCount>a.options.slidesToShow?a.animateSlide(d,function(){a.postSlide(s)}):a.postSlide(s)))},e.prototype.startLoad=function(){var i=this;i.options.arrows===!0&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.hide(),i.$nextArrow.hide()),i.options.dots===!0&&i.slideCount>i.options.slidesToShow&&i.$dots.hide(),i.$slider.addClass("slick-loading")},e.prototype.swipeDirection=function(){var i,e,t,o,s=this;return i=s.touchObject.startX-s.touchObject.curX,e=s.touchObject.startY-s.touchObject.curY,t=Math.atan2(e,i),o=Math.round(180*t/Math.PI),o<0&&(o=360-Math.abs(o)),o<=45&&o>=0?s.options.rtl===!1?"left":"right":o<=360&&o>=315?s.options.rtl===!1?"left":"right":o>=135&&o<=225?s.options.rtl===!1?"right":"left":s.options.verticalSwiping===!0?o>=35&&o<=135?"down":"up":"vertical"},e.prototype.swipeEnd=function(i){var e,t,o=this;if(o.dragging=!1,o.swiping=!1,o.scrolling)return o.scrolling=!1,!1;if(o.interrupted=!1,o.shouldClick=!(o.touchObject.swipeLength>10),void 0===o.touchObject.curX)return!1;if(o.touchObject.edgeHit===!0&&o.$slider.trigger("edge",[o,o.swipeDirection()]),o.touchObject.swipeLength>=o.touchObject.minSwipe){switch(t=o.swipeDirection()){case"left":case"down":e=o.options.swipeToSlide?o.checkNavigable(o.currentSlide+o.getSlideCount()):o.currentSlide+o.getSlideCount(),o.currentDirection=0;break;case"right":case"up":e=o.options.swipeToSlide?o.checkNavigable(o.currentSlide-o.getSlideCount()):o.currentSlide-o.getSlideCount(),o.currentDirection=1}"vertical"!=t&&(o.slideHandler(e),o.touchObject={},o.$slider.trigger("swipe",[o,t]))}else o.touchObject.startX!==o.touchObject.curX&&(o.slideHandler(o.currentSlide),o.touchObject={})},e.prototype.swipeHandler=function(i){var e=this;if(!(e.options.swipe===!1||"ontouchend"in document&&e.options.swipe===!1||e.options.draggable===!1&&i.type.indexOf("mouse")!==-1))switch(e.touchObject.fingerCount=i.originalEvent&&void 0!==i.originalEvent.touches?i.originalEvent.touches.length:1,e.touchObject.minSwipe=e.listWidth/e.options.touchThreshold,e.options.verticalSwiping===!0&&(e.touchObject.minSwipe=e.listHeight/e.options.touchThreshold),i.data.action){case"start":e.swipeStart(i);break;case"move":e.swipeMove(i);break;case"end":e.swipeEnd(i)}},e.prototype.swipeMove=function(i){var e,t,o,s,n,r,l=this;return n=void 0!==i.originalEvent?i.originalEvent.touches:null,!(!l.dragging||l.scrolling||n&&1!==n.length)&&(e=l.getLeft(l.currentSlide),l.touchObject.curX=void 0!==n?n[0].pageX:i.clientX,l.touchObject.curY=void 0!==n?n[0].pageY:i.clientY,l.touchObject.swipeLength=Math.round(Math.sqrt(Math.pow(l.touchObject.curX-l.touchObject.startX,2))),r=Math.round(Math.sqrt(Math.pow(l.touchObject.curY-l.touchObject.startY,2))),!l.options.verticalSwiping&&!l.swiping&&r>4?(l.scrolling=!0,!1):(l.options.verticalSwiping===!0&&(l.touchObject.swipeLength=r),t=l.swipeDirection(),void 0!==i.originalEvent&&l.touchObject.swipeLength>4&&(l.swiping=!0,i.preventDefault()),s=(l.options.rtl===!1?1:-1)*(l.touchObject.curX>l.touchObject.startX?1:-1),l.options.verticalSwiping===!0&&(s=l.touchObject.curY>l.touchObject.startY?1:-1),o=l.touchObject.swipeLength,l.touchObject.edgeHit=!1,l.options.infinite===!1&&(0===l.currentSlide&&"right"===t||l.currentSlide>=l.getDotCount()&&"left"===t)&&(o=l.touchObject.swipeLength*l.options.edgeFriction,l.touchObject.edgeHit=!0),l.options.vertical===!1?l.swipeLeft=e+o*s:l.swipeLeft=e+o*(l.$list.height()/l.listWidth)*s,l.options.verticalSwiping===!0&&(l.swipeLeft=e+o*s),l.options.fade!==!0&&l.options.touchMove!==!1&&(l.animating===!0?(l.swipeLeft=null,!1):void l.setCSS(l.swipeLeft))))},e.prototype.swipeStart=function(i){var e,t=this;return t.interrupted=!0,1!==t.touchObject.fingerCount||t.slideCount<=t.options.slidesToShow?(t.touchObject={},!1):(void 0!==i.originalEvent&&void 0!==i.originalEvent.touches&&(e=i.originalEvent.touches[0]),t.touchObject.startX=t.touchObject.curX=void 0!==e?e.pageX:i.clientX,t.touchObject.startY=t.touchObject.curY=void 0!==e?e.pageY:i.clientY,void(t.dragging=!0))},e.prototype.unfilterSlides=e.prototype.slickUnfilter=function(){var i=this;null!==i.$slidesCache&&(i.unload(),i.$slideTrack.children(this.options.slide).detach(),i.$slidesCache.appendTo(i.$slideTrack),i.reinit())},e.prototype.unload=function(){var e=this;i(".slick-cloned",e.$slider).remove(),e.$dots&&e.$dots.remove(),e.$prevArrow&&e.htmlExpr.test(e.options.prevArrow)&&e.$prevArrow.remove(),e.$nextArrow&&e.htmlExpr.test(e.options.nextArrow)&&e.$nextArrow.remove(),e.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden","true").css("width","")},e.prototype.unslick=function(i){var e=this;e.$slider.trigger("unslick",[e,i]),e.destroy()},e.prototype.updateArrows=function(){var i,e=this;i=Math.floor(e.options.slidesToShow/2),e.options.arrows===!0&&e.slideCount>e.options.slidesToShow&&!e.options.infinite&&(e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false"),e.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false"),0===e.currentSlide?(e.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true"),e.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false")):e.currentSlide>=e.slideCount-e.options.slidesToShow&&e.options.centerMode===!1?(e.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")):e.currentSlide>=e.slideCount-1&&e.options.centerMode===!0&&(e.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")))},e.prototype.updateDots=function(){var i=this;null!==i.$dots&&(i.$dots.find("li").removeClass("slick-active").end(),i.$dots.find("li").eq(Math.floor(i.currentSlide/i.options.slidesToScroll)).addClass("slick-active"))},e.prototype.visibility=function(){var i=this;i.options.autoplay&&(document[i.hidden]?i.interrupted=!0:i.interrupted=!1)},i.fn.slick=function(){var i,t,o=this,s=arguments[0],n=Array.prototype.slice.call(arguments,1),r=o.length;for(i=0;i<r;i++)if("object"==typeof s||"undefined"==typeof s?o[i].slick=new e(o[i],s):t=o[i].slick[s].apply(o[i].slick,n),"undefined"!=typeof t)return t;return o}});

/*  slimselect_min  */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.SlimSelect=t():e.SlimSelect=t()}(window,function(){return s={},n.m=i=[function(e,t,i){"use strict";function s(e,t){t=t||{bubbles:!1,cancelable:!1,detail:void 0};var i=document.createEvent("CustomEvent");return i.initCustomEvent(e,t.bubbles,t.cancelable,t.detail),i}var n;t.__esModule=!0,t.hasClassInTree=function(e,t){function s(e,t){return t&&e&&e.classList&&e.classList.contains(t)?e:null}return s(e,t)||function e(t,i){return t&&t!==document?s(t,i)?t:e(t.parentNode,i):null}(e,t)},t.ensureElementInView=function(e,t){var i=e.scrollTop+e.offsetTop,s=i+e.clientHeight,n=t.offsetTop,a=n+t.clientHeight;n<i?e.scrollTop-=i-n:s<a&&(e.scrollTop+=a-s)},t.putContent=function(e,t,i){var s=e.offsetHeight,n=e.getBoundingClientRect(),a=i?n.top:n.top-s,o=i?n.bottom:n.bottom+s;return a<=0?"below":o>=window.innerHeight?"above":i?t:"below"},t.debounce=function(n,a,o){var l;return void 0===a&&(a=100),void 0===o&&(o=!1),function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];var i=self,s=o&&!l;clearTimeout(l),l=setTimeout(function(){l=null,o||n.apply(i,e)},a),s&&n.apply(i,e)}},t.isValueInArrayOfObjects=function(e,t,i){if(!Array.isArray(e))return e[t]===i;for(var s=0,n=e;s<n.length;s++){var a=n[s];if(a&&a[t]&&a[t]===i)return!0}return!1},t.highlight=function(e,t,i){var s=e,n=new RegExp("("+t.trim()+")(?![^<]*>[^<>]*</)","i");if(!e.match(n))return e;var a=e.match(n).index,o=a+e.match(n)[0].toString().length,l=e.substring(a,o);return s=s.replace(n,'<mark class="'+i+'">'+l+"</mark>")},t.kebabCase=function(e){var t=e.replace(/[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g,function(e){return"-"+e.toLowerCase()});return e[0]===e[0].toUpperCase()?t.substring(1):t},"function"!=typeof(n=window).CustomEvent&&(s.prototype=n.Event.prototype,n.CustomEvent=s)},function(e,t,i){"use strict";t.__esModule=!0;var s=(n.prototype.newOption=function(e){return{id:e.id?e.id:String(Math.floor(1e8*Math.random())),value:e.value?e.value:"",text:e.text?e.text:"",innerHTML:e.innerHTML?e.innerHTML:"",selected:!!e.selected&&e.selected,display:void 0===e.display||e.display,disabled:!!e.disabled&&e.disabled,placeholder:!!e.placeholder&&e.placeholder,class:e.class?e.class:void 0,data:e.data?e.data:{},mandatory:!!e.mandatory&&e.mandatory}},n.prototype.add=function(e){this.data.push({id:String(Math.floor(1e8*Math.random())),value:e.value,text:e.text,innerHTML:"",selected:!1,display:!0,disabled:!1,placeholder:!1,class:void 0,mandatory:e.mandatory,data:{}})},n.prototype.parseSelectData=function(){this.data=[];for(var e=0,t=this.main.select.element.childNodes;e<t.length;e++){var i=t[e];if("OPTGROUP"===i.nodeName){for(var s={label:i.label,options:[]},n=0,a=i.childNodes;n<a.length;n++){var o=a[n];if("OPTION"===o.nodeName){var l=this.pullOptionData(o);s.options.push(l),l.placeholder&&""!==l.text.trim()&&(this.main.config.placeholderText=l.text)}}this.data.push(s)}else"OPTION"===i.nodeName&&(l=this.pullOptionData(i),this.data.push(l),l.placeholder&&""!==l.text.trim()&&(this.main.config.placeholderText=l.text))}},n.prototype.pullOptionData=function(e){return{id:!!e.dataset&&e.dataset.id||String(Math.floor(1e8*Math.random())),value:e.value,text:e.text,innerHTML:e.innerHTML,selected:e.selected,disabled:e.disabled,placeholder:"true"===e.dataset.placeholder,class:e.className,style:e.style.cssText,data:e.dataset,mandatory:!!e.dataset&&"true"===e.dataset.mandatory}},n.prototype.setSelectedFromSelect=function(){if(this.main.config.isMultiple){for(var e=[],t=0,i=this.main.select.element.options;t<i.length;t++){var s=i[t];if(s.selected){var n=this.getObjectFromData(s.value,"value");n&&n.id&&e.push(n.id)}}this.setSelected(e,"id")}else{var a=this.main.select.element;if(-1!==a.selectedIndex){var o=a.options[a.selectedIndex].value;this.setSelected(o,"value")}}},n.prototype.setSelected=function(e,t){void 0===t&&(t="id");for(var i=0,s=this.data;i<s.length;i++){var n=s[i];if(n.hasOwnProperty("label")){if(n.hasOwnProperty("options")){var a=n.options;if(a)for(var o=0,l=a;o<l.length;o++){var r=l[o];r.placeholder||(r.selected=this.shouldBeSelected(r,e,t))}}}else n.selected=this.shouldBeSelected(n,e,t)}},n.prototype.shouldBeSelected=function(e,t,i){if(void 0===i&&(i="id"),Array.isArray(t))for(var s=0,n=t;s<n.length;s++){var a=n[s];if(i in e&&String(e[i])===String(a))return!0}else if(i in e&&String(e[i])===String(t))return!0;return!1},n.prototype.getSelected=function(){for(var e={text:"",placeholder:this.main.config.placeholderText},t=[],i=0,s=this.data;i<s.length;i++){var n=s[i];if(n.hasOwnProperty("label")){if(n.hasOwnProperty("options")){var a=n.options;if(a)for(var o=0,l=a;o<l.length;o++){var r=l[o];r.selected&&(this.main.config.isMultiple?t.push(r):e=r)}}}else n.selected&&(this.main.config.isMultiple?t.push(n):e=n)}return this.main.config.isMultiple?t:e},n.prototype.addToSelected=function(e,t){if(void 0===t&&(t="id"),this.main.config.isMultiple){var i=[],s=this.getSelected();if(Array.isArray(s))for(var n=0,a=s;n<a.length;n++){var o=a[n];i.push(o[t])}i.push(e),this.setSelected(i,t)}},n.prototype.removeFromSelected=function(e,t){if(void 0===t&&(t="id"),this.main.config.isMultiple){for(var i=[],s=0,n=this.getSelected();s<n.length;s++){var a=n[s];String(a[t])!==String(e)&&i.push(a[t])}this.setSelected(i,t)}},n.prototype.onDataChange=function(){this.main.onChange&&this.isOnChangeEnabled&&this.main.onChange(JSON.parse(JSON.stringify(this.getSelected())))},n.prototype.getObjectFromData=function(e,t){void 0===t&&(t="id");for(var i=0,s=this.data;i<s.length;i++){var n=s[i];if(t in n&&String(n[t])===String(e))return n;if(n.hasOwnProperty("options")&&n.options)for(var a=0,o=n.options;a<o.length;a++){var l=o[a];if(String(l[t])===String(e))return l}}return null},n.prototype.search=function(n){if(""!==(this.searchValue=n).trim()){var a=this.main.config.searchFilter,e=this.data.slice(0);n=n.trim();var t=e.map(function(e){if(e.hasOwnProperty("options")){var t=e,i=[];if(t.options&&(i=t.options.filter(function(e){return a(e,n)})),0!==i.length){var s=Object.assign({},t);return s.options=i,s}}return e.hasOwnProperty("text")&&a(e,n)?e:null});this.filtered=t.filter(function(e){return e})}else this.filtered=null},n);function n(e){this.contentOpen=!1,this.contentPosition="below",this.isOnChangeEnabled=!0,this.main=e.main,this.searchValue="",this.data=[],this.filtered=null,this.parseSelectData(),this.setSelectedFromSelect()}function r(e){return void 0!==e.text||(console.error("Data object option must have at least have a text value. Check object: "+JSON.stringify(e)),!1)}t.Data=s,t.validateData=function(e){if(!e)return console.error("Data must be an array of objects"),!1;for(var t=0,i=0,s=e;i<s.length;i++){var n=s[i];if(n.hasOwnProperty("label")){if(n.hasOwnProperty("options")){var a=n.options;if(a)for(var o=0,l=a;o<l.length;o++){r(l[o])||t++}}}else r(n)||t++}return 0===t},t.validateOption=r},function(e,t,i){"use strict";t.__esModule=!0;var s=i(3),n=i(4),a=i(5),r=i(1),o=i(0),l=(c.prototype.validate=function(e){var t="string"==typeof e.select?document.querySelector(e.select):e.select;if(!t)throw new Error("Could not find select element");if("SELECT"!==t.tagName)throw new Error("Element isnt of type select");return t},c.prototype.selected=function(){if(this.config.isMultiple){for(var e=[],t=0,i=n=this.data.getSelected();t<i.length;t++){var s=i[t];e.push(s.value)}return e}var n;return(n=this.data.getSelected())?n.value:""},c.prototype.set=function(e,t,i,s){void 0===t&&(t="value"),void 0===i&&(i=!0),void 0===s&&(s=!0),this.config.isMultiple&&!Array.isArray(e)?this.data.addToSelected(e,t):this.data.setSelected(e,t),this.select.setValue(),this.data.onDataChange(),this.render(),i&&this.close()},c.prototype.setSelected=function(e,t,i,s){void 0===t&&(t="value"),void 0===i&&(i=!0),void 0===s&&(s=!0),this.set(e,t,i,s)},c.prototype.setData=function(e){if(r.validateData(e)){for(var t=JSON.parse(JSON.stringify(e)),i=this.data.getSelected(),s=0;s<t.length;s++)t[s].value||t[s].placeholder||(t[s].value=t[s].text);if(this.config.isAjax&&i)if(this.config.isMultiple)for(var n=0,a=i.reverse();n<a.length;n++){var o=a[n];t.unshift(o)}else{for(t.unshift(i),s=0;s<t.length;s++)t[s].placeholder||t[s].value!==i.value||t[s].text!==i.text||delete t[s];var l=!1;for(s=0;s<t.length;s++)t[s].placeholder&&(l=!0);l||t.unshift({text:"",placeholder:!0})}this.select.create(t),this.data.parseSelectData(),this.data.setSelectedFromSelect()}else console.error("Validation problem on: #"+this.select.element.id)},c.prototype.addData=function(e){r.validateData([e])?(this.data.add(this.data.newOption(e)),this.select.create(this.data.data),this.data.parseSelectData(),this.data.setSelectedFromSelect(),this.render()):console.error("Validation problem on: #"+this.select.element.id)},c.prototype.open=function(){var e=this;if(this.config.isEnabled&&!this.data.contentOpen){if(this.beforeOpen&&this.beforeOpen(),this.config.isMultiple&&this.slim.multiSelected?this.slim.multiSelected.plus.classList.add("ss-cross"):this.slim.singleSelected&&(this.slim.singleSelected.arrowIcon.arrow.classList.remove("arrow-down"),this.slim.singleSelected.arrowIcon.arrow.classList.add("arrow-up")),this.slim[this.config.isMultiple?"multiSelected":"singleSelected"].container.classList.add("above"===this.data.contentPosition?this.config.openAbove:this.config.openBelow),this.config.addToBody){var t=this.slim.container.getBoundingClientRect();this.slim.content.style.top=t.top+t.height+window.scrollY+"px",this.slim.content.style.left=t.left+window.scrollX+"px",this.slim.content.style.width=t.width+"px"}if(this.slim.content.classList.add(this.config.open),"up"===this.config.showContent.toLowerCase()||"down"!==this.config.showContent.toLowerCase()&&"above"===o.putContent(this.slim.content,this.data.contentPosition,this.data.contentOpen)?this.moveContentAbove():this.moveContentBelow(),!this.config.isMultiple){var i=this.data.getSelected();if(i){var s=i.id,n=this.slim.list.querySelector('[data-id="'+s+'"]');n&&o.ensureElementInView(this.slim.list,n)}}setTimeout(function(){e.data.contentOpen=!0,e.config.searchFocus&&e.slim.search.input.focus(),e.afterOpen&&e.afterOpen()},this.config.timeoutDelay)}},c.prototype.close=function(){var e=this;this.data.contentOpen&&(this.beforeClose&&this.beforeClose(),this.config.isMultiple&&this.slim.multiSelected?(this.slim.multiSelected.container.classList.remove(this.config.openAbove),this.slim.multiSelected.container.classList.remove(this.config.openBelow),this.slim.multiSelected.plus.classList.remove("ss-cross")):this.slim.singleSelected&&(this.slim.singleSelected.container.classList.remove(this.config.openAbove),this.slim.singleSelected.container.classList.remove(this.config.openBelow),this.slim.singleSelected.arrowIcon.arrow.classList.add("arrow-down"),this.slim.singleSelected.arrowIcon.arrow.classList.remove("arrow-up")),this.slim.content.classList.remove(this.config.open),this.data.contentOpen=!1,this.search(""),setTimeout(function(){e.slim.content.removeAttribute("style"),e.data.contentPosition="below",e.config.isMultiple&&e.slim.multiSelected?(e.slim.multiSelected.container.classList.remove(e.config.openAbove),e.slim.multiSelected.container.classList.remove(e.config.openBelow)):e.slim.singleSelected&&(e.slim.singleSelected.container.classList.remove(e.config.openAbove),e.slim.singleSelected.container.classList.remove(e.config.openBelow)),e.slim.search.input.blur(),e.afterClose&&e.afterClose()},this.config.timeoutDelay))},c.prototype.moveContentAbove=function(){var e=0;this.config.isMultiple&&this.slim.multiSelected?e=this.slim.multiSelected.container.offsetHeight:this.slim.singleSelected&&(e=this.slim.singleSelected.container.offsetHeight);var t=e+this.slim.content.offsetHeight-1;this.slim.content.style.margin="-"+t+"px 0 0 0",this.slim.content.style.height=t-e+1+"px",this.slim.content.style.transformOrigin="center bottom",this.data.contentPosition="above",this.config.isMultiple&&this.slim.multiSelected?(this.slim.multiSelected.container.classList.remove(this.config.openBelow),this.slim.multiSelected.container.classList.add(this.config.openAbove)):this.slim.singleSelected&&(this.slim.singleSelected.container.classList.remove(this.config.openBelow),this.slim.singleSelected.container.classList.add(this.config.openAbove))},c.prototype.moveContentBelow=function(){this.data.contentPosition="below",this.config.isMultiple&&this.slim.multiSelected?(this.slim.multiSelected.container.classList.remove(this.config.openAbove),this.slim.multiSelected.container.classList.add(this.config.openBelow)):this.slim.singleSelected&&(this.slim.singleSelected.container.classList.remove(this.config.openAbove),this.slim.singleSelected.container.classList.add(this.config.openBelow))},c.prototype.enable=function(){this.config.isEnabled=!0,this.config.isMultiple&&this.slim.multiSelected?this.slim.multiSelected.container.classList.remove(this.config.disabled):this.slim.singleSelected&&this.slim.singleSelected.container.classList.remove(this.config.disabled),this.select.triggerMutationObserver=!1,this.select.element.disabled=!1,this.slim.search.input.disabled=!1,this.select.triggerMutationObserver=!0},c.prototype.disable=function(){this.config.isEnabled=!1,this.config.isMultiple&&this.slim.multiSelected?this.slim.multiSelected.container.classList.add(this.config.disabled):this.slim.singleSelected&&this.slim.singleSelected.container.classList.add(this.config.disabled),this.select.triggerMutationObserver=!1,this.select.element.disabled=!0,this.slim.search.input.disabled=!0,this.select.triggerMutationObserver=!0},c.prototype.search=function(t){if(this.data.searchValue!==t)if(this.slim.search.input.value=t,this.config.isAjax){var i=this;this.config.isSearching=!0,this.render(),this.ajax&&this.ajax(t,function(e){i.config.isSearching=!1,Array.isArray(e)?(e.unshift({text:"",placeholder:!0}),i.setData(e),i.data.search(t),i.render()):"string"==typeof e?i.slim.options(e):i.render()})}else this.data.search(t),this.render()},c.prototype.setSearchText=function(e){this.config.searchText=e},c.prototype.render=function(){this.config.isMultiple?this.slim.values():(this.slim.placeholder(),this.slim.deselect()),this.slim.options()},c.prototype.destroy=function(e){void 0===e&&(e=null);var t=e?document.querySelector("."+e+".ss-main"):this.slim.container,i=e?document.querySelector("[data-ssid="+e+"]"):this.select.element;if(t&&i&&(document.removeEventListener("click",this.documentClick),"auto"===this.config.showContent&&window.removeEventListener("scroll",this.windowScroll,!1),i.style.display="",delete i.dataset.ssid,i.slim=null,t.parentElement&&t.parentElement.removeChild(t),this.config.addToBody)){var s=e?document.querySelector("."+e+".ss-content"):this.slim.content;if(!s)return;document.body.removeChild(s)}},c);function c(e){var t=this;this.ajax=null,this.addable=null,this.beforeOnChange=null,this.onChange=null,this.beforeOpen=null,this.afterOpen=null,this.beforeClose=null,this.afterClose=null,this.windowScroll=o.debounce(function(e){t.data.contentOpen&&("above"===o.putContent(t.slim.content,t.data.contentPosition,t.data.contentOpen)?t.moveContentAbove():t.moveContentBelow())}),this.documentClick=function(e){e.target&&!o.hasClassInTree(e.target,t.config.id)&&t.close()};var i=this.validate(e);i.dataset.ssid&&this.destroy(i.dataset.ssid),e.ajax&&(this.ajax=e.ajax),e.addable&&(this.addable=e.addable),this.config=new s.Config({select:i,isAjax:!!e.ajax,showSearch:e.showSearch,searchPlaceholder:e.searchPlaceholder,searchText:e.searchText,searchingText:e.searchingText,searchFocus:e.searchFocus,searchHighlight:e.searchHighlight,searchFilter:e.searchFilter,closeOnSelect:e.closeOnSelect,showContent:e.showContent,placeholderText:e.placeholder,allowDeselect:e.allowDeselect,allowDeselectOption:e.allowDeselectOption,hideSelectedOption:e.hideSelectedOption,deselectLabel:e.deselectLabel,isEnabled:e.isEnabled,valuesUseText:e.valuesUseText,showOptionTooltips:e.showOptionTooltips,selectByGroup:e.selectByGroup,limit:e.limit,timeoutDelay:e.timeoutDelay,addToBody:e.addToBody}),this.select=new n.Select({select:i,main:this}),this.data=new r.Data({main:this}),this.slim=new a.Slim({main:this}),this.select.element.parentNode&&this.select.element.parentNode.insertBefore(this.slim.container,this.select.element.nextSibling),e.data?this.setData(e.data):this.render(),document.addEventListener("click",this.documentClick),"auto"===this.config.showContent&&window.addEventListener("scroll",this.windowScroll,!1),e.beforeOnChange&&(this.beforeOnChange=e.beforeOnChange),e.onChange&&(this.onChange=e.onChange),e.beforeOpen&&(this.beforeOpen=e.beforeOpen),e.afterOpen&&(this.afterOpen=e.afterOpen),e.beforeClose&&(this.beforeClose=e.beforeClose),e.afterClose&&(this.afterClose=e.afterClose),this.config.isEnabled||this.disable()}t.default=l},function(e,t,i){"use strict";t.__esModule=!0;var s=(n.prototype.searchFilter=function(e,t){return-1!==e.text.toLowerCase().indexOf(t.toLowerCase())},n);function n(e){this.id="",this.isMultiple=!1,this.isAjax=!1,this.isSearching=!1,this.showSearch=!0,this.searchFocus=!0,this.searchHighlight=!1,this.closeOnSelect=!0,this.showContent="auto",this.searchPlaceholder="Search",this.searchText="No Results",this.searchingText="Searching...",this.placeholderText="Select Value",this.allowDeselect=!1,this.allowDeselectOption=!1,this.hideSelectedOption=!1,this.deselectLabel="x",this.isEnabled=!0,this.valuesUseText=!1,this.showOptionTooltips=!1,this.selectByGroup=!1,this.limit=0,this.timeoutDelay=200,this.addToBody=!1,this.main="ss-main",this.singleSelected="ss-single-selected",this.arrow="ss-arrow",this.multiSelected="ss-multi-selected",this.add="ss-add",this.plus="ss-plus",this.values="ss-values",this.value="ss-value",this.valueText="ss-value-text",this.valueDelete="ss-value-delete",this.content="ss-content",this.open="ss-open",this.openAbove="ss-open-above",this.openBelow="ss-open-below",this.search="ss-search",this.searchHighlighter="ss-search-highlight",this.addable="ss-addable",this.list="ss-list",this.optgroup="ss-optgroup",this.optgroupLabel="ss-optgroup-label",this.optgroupLabelSelectable="ss-optgroup-label-selectable",this.option="ss-option",this.optionSelected="ss-option-selected",this.highlighted="ss-highlighted",this.disabled="ss-disabled",this.hide="ss-hide",this.id="ss-"+Math.floor(1e5*Math.random()),this.style=e.select.style.cssText,this.class=e.select.className.split(" "),this.isMultiple=e.select.multiple,this.isAjax=e.isAjax,this.showSearch=!1!==e.showSearch,this.searchFocus=!1!==e.searchFocus,this.searchHighlight=!0===e.searchHighlight,this.closeOnSelect=!1!==e.closeOnSelect,e.showContent&&(this.showContent=e.showContent),this.isEnabled=!1!==e.isEnabled,e.searchPlaceholder&&(this.searchPlaceholder=e.searchPlaceholder),e.searchText&&(this.searchText=e.searchText),e.searchingText&&(this.searchingText=e.searchingText),e.placeholderText&&(this.placeholderText=e.placeholderText),this.allowDeselect=!0===e.allowDeselect,this.allowDeselectOption=!0===e.allowDeselectOption,this.hideSelectedOption=!0===e.hideSelectedOption,e.deselectLabel&&(this.deselectLabel=e.deselectLabel),e.valuesUseText&&(this.valuesUseText=e.valuesUseText),e.showOptionTooltips&&(this.showOptionTooltips=e.showOptionTooltips),e.selectByGroup&&(this.selectByGroup=e.selectByGroup),e.limit&&(this.limit=e.limit),e.searchFilter&&(this.searchFilter=e.searchFilter),null!=e.timeoutDelay&&(this.timeoutDelay=e.timeoutDelay),this.addToBody=!0===e.addToBody}t.Config=s},function(e,t,i){"use strict";t.__esModule=!0;var s=i(0),n=(a.prototype.setValue=function(){if(this.main.data.getSelected()){if(this.main.config.isMultiple)for(var e=this.main.data.getSelected(),t=0,i=this.element.options;t<i.length;t++){var s=i[t];s.selected=!1;for(var n=0,a=e;n<a.length;n++)a[n].value===s.value&&(s.selected=!0)}else e=this.main.data.getSelected(),this.element.value=e?e.value:"";this.main.data.isOnChangeEnabled=!1,this.element.dispatchEvent(new CustomEvent("change",{bubbles:!0})),this.main.data.isOnChangeEnabled=!0}},a.prototype.addAttributes=function(){this.element.tabIndex=-1,this.element.style.display="none",this.element.dataset.ssid=this.main.config.id},a.prototype.addEventListeners=function(){var t=this;this.element.addEventListener("change",function(e){t.main.data.setSelectedFromSelect(),t.main.render()})},a.prototype.addMutationObserver=function(){var t=this;this.main.config.isAjax||(this.mutationObserver=new MutationObserver(function(e){t.triggerMutationObserver&&(t.main.data.parseSelectData(),t.main.data.setSelectedFromSelect(),t.main.render(),e.forEach(function(e){"class"===e.attributeName&&t.main.slim.updateContainerDivClass(t.main.slim.container)}))}),this.observeMutationObserver())},a.prototype.observeMutationObserver=function(){this.mutationObserver&&this.mutationObserver.observe(this.element,{attributes:!0,childList:!0,characterData:!0})},a.prototype.disconnectMutationObserver=function(){this.mutationObserver&&this.mutationObserver.disconnect()},a.prototype.create=function(e){this.element.innerHTML="";for(var t=0,i=e;t<i.length;t++){var s=i[t];if(s.hasOwnProperty("options")){var n=s,a=document.createElement("optgroup");if(a.label=n.label,n.options)for(var o=0,l=n.options;o<l.length;o++){var r=l[o];a.appendChild(this.createOption(r))}this.element.appendChild(a)}else this.element.appendChild(this.createOption(s))}},a.prototype.createOption=function(t){var i=document.createElement("option");return i.value=""!==t.value?t.value:t.text,i.innerHTML=t.innerHTML||t.text,t.selected&&(i.selected=t.selected),!1===t.display&&(i.style.display="none"),t.disabled&&(i.disabled=!0),t.placeholder&&i.setAttribute("data-placeholder","true"),t.mandatory&&i.setAttribute("data-mandatory","true"),t.class&&t.class.split(" ").forEach(function(e){i.classList.add(e)}),t.data&&"object"==typeof t.data&&Object.keys(t.data).forEach(function(e){i.setAttribute("data-"+s.kebabCase(e),t.data[e])}),i},a);function a(e){this.triggerMutationObserver=!0,this.element=e.select,this.main=e.main,this.element.disabled&&(this.main.config.isEnabled=!1),this.addAttributes(),this.addEventListeners(),this.mutationObserver=null,this.addMutationObserver(),this.element.slim=e.main}t.Select=n},function(e,t,i){"use strict";t.__esModule=!0;var a=i(0),o=i(1),s=(n.prototype.containerDiv=function(){var e=document.createElement("div");return e.style.cssText=this.main.config.style,this.updateContainerDivClass(e),e},n.prototype.updateContainerDivClass=function(e){this.main.config.class=this.main.select.element.className.split(" "),e.className="",e.classList.add(this.main.config.id),e.classList.add(this.main.config.main);for(var t=0,i=this.main.config.class;t<i.length;t++){var s=i[t];""!==s.trim()&&e.classList.add(s)}},n.prototype.singleSelectedDiv=function(){var t=this,e=document.createElement("div");e.classList.add(this.main.config.singleSelected);var i=document.createElement("span");i.classList.add("placeholder"),e.appendChild(i);var s=document.createElement("span");s.innerHTML=this.main.config.deselectLabel,s.classList.add("ss-deselect"),s.onclick=function(e){e.stopPropagation(),t.main.config.isEnabled&&t.main.set("")},e.appendChild(s);var n=document.createElement("span");n.classList.add(this.main.config.arrow);var a=document.createElement("span");return a.classList.add("arrow-down"),n.appendChild(a),e.appendChild(n),e.onclick=function(){t.main.config.isEnabled&&(t.main.data.contentOpen?t.main.close():t.main.open())},{container:e,placeholder:i,deselect:s,arrowIcon:{container:n,arrow:a}}},n.prototype.placeholder=function(){var e=this.main.data.getSelected();if(null===e||e&&e.placeholder){var t=document.createElement("span");t.classList.add(this.main.config.disabled),t.innerHTML=this.main.config.placeholderText,this.singleSelected&&(this.singleSelected.placeholder.innerHTML=t.outerHTML)}else{var i="";e&&(i=e.innerHTML&&!0!==this.main.config.valuesUseText?e.innerHTML:e.text),this.singleSelected&&(this.singleSelected.placeholder.innerHTML=e?i:"")}},n.prototype.deselect=function(){if(this.singleSelected){if(!this.main.config.allowDeselect)return void this.singleSelected.deselect.classList.add("ss-hide");""===this.main.selected()?this.singleSelected.deselect.classList.add("ss-hide"):this.singleSelected.deselect.classList.remove("ss-hide")}},n.prototype.multiSelectedDiv=function(){var t=this,e=document.createElement("div");e.classList.add(this.main.config.multiSelected);var i=document.createElement("div");i.classList.add(this.main.config.values),e.appendChild(i);var s=document.createElement("div");s.classList.add(this.main.config.add);var n=document.createElement("span");return n.classList.add(this.main.config.plus),n.onclick=function(e){t.main.data.contentOpen&&(t.main.close(),e.stopPropagation())},s.appendChild(n),e.appendChild(s),e.onclick=function(e){t.main.config.isEnabled&&(e.target.classList.contains(t.main.config.valueDelete)||(t.main.data.contentOpen?t.main.close():t.main.open()))},{container:e,values:i,add:s,plus:n}},n.prototype.values=function(){if(this.multiSelected){for(var e,t=this.multiSelected.values.childNodes,i=this.main.data.getSelected(),s=[],n=0,a=t;n<a.length;n++){var o=a[n];e=!0;for(var l=0,r=i;l<r.length;l++){var c=r[l];String(c.id)===String(o.dataset.id)&&(e=!1)}e&&s.push(o)}for(var d=0,h=s;d<h.length;d++){var u=h[d];u.classList.add("ss-out"),this.multiSelected.values.removeChild(u)}for(t=this.multiSelected.values.childNodes,c=0;c<i.length;c++){e=!1;for(var p=0,m=t;p<m.length;p++)o=m[p],String(i[c].id)===String(o.dataset.id)&&(e=!0);e||(0!==t.length&&HTMLElement.prototype.insertAdjacentElement?0===c?this.multiSelected.values.insertBefore(this.valueDiv(i[c]),t[c]):t[c-1].insertAdjacentElement("afterend",this.valueDiv(i[c])):this.multiSelected.values.appendChild(this.valueDiv(i[c])))}if(0===i.length){var f=document.createElement("span");f.classList.add(this.main.config.disabled),f.innerHTML=this.main.config.placeholderText,this.multiSelected.values.innerHTML=f.outerHTML}}},n.prototype.valueDiv=function(a){var o=this,e=document.createElement("div");e.classList.add(this.main.config.value),e.dataset.id=a.id;var t=document.createElement("span");if(t.classList.add(this.main.config.valueText),t.innerHTML=a.innerHTML&&!0!==this.main.config.valuesUseText?a.innerHTML:a.text,e.appendChild(t),!a.mandatory){var i=document.createElement("span");i.classList.add(this.main.config.valueDelete),i.innerHTML=this.main.config.deselectLabel,i.onclick=function(e){e.preventDefault(),e.stopPropagation();var t=!1;if(o.main.beforeOnChange||(t=!0),o.main.beforeOnChange){for(var i=o.main.data.getSelected(),s=JSON.parse(JSON.stringify(i)),n=0;n<s.length;n++)s[n].id===a.id&&s.splice(n,1);!1!==o.main.beforeOnChange(s)&&(t=!0)}t&&(o.main.data.removeFromSelected(a.id,"id"),o.main.render(),o.main.select.setValue(),o.main.data.onDataChange())},e.appendChild(i)}return e},n.prototype.contentDiv=function(){var e=document.createElement("div");return e.classList.add(this.main.config.content),e},n.prototype.searchDiv=function(){var n=this,e=document.createElement("div"),s=document.createElement("input"),a=document.createElement("div");e.classList.add(this.main.config.search);var t={container:e,input:s};return this.main.config.showSearch||(e.classList.add(this.main.config.hide),s.readOnly=!0),s.type="search",s.placeholder=this.main.config.searchPlaceholder,s.tabIndex=0,s.setAttribute("aria-label",this.main.config.searchPlaceholder),s.setAttribute("autocapitalize","off"),s.setAttribute("autocomplete","off"),s.setAttribute("autocorrect","off"),s.onclick=function(e){setTimeout(function(){""===e.target.value&&n.main.search("")},10)},s.onkeydown=function(e){"ArrowUp"===e.key?(n.main.open(),n.highlightUp(),e.preventDefault()):"ArrowDown"===e.key?(n.main.open(),n.highlightDown(),e.preventDefault()):"Tab"===e.key?n.main.data.contentOpen?n.main.close():setTimeout(function(){n.main.close()},n.main.config.timeoutDelay):"Enter"===e.key&&e.preventDefault()},s.onkeyup=function(e){var t=e.target;if("Enter"===e.key){if(n.main.addable&&e.ctrlKey)return a.click(),e.preventDefault(),void e.stopPropagation();var i=n.list.querySelector("."+n.main.config.highlighted);i&&i.click()}else"ArrowUp"===e.key||"ArrowDown"===e.key||("Escape"===e.key?n.main.close():n.main.config.showSearch&&n.main.data.contentOpen?n.main.search(t.value):s.value="");e.preventDefault(),e.stopPropagation()},s.onfocus=function(){n.main.open()},e.appendChild(s),this.main.addable&&(a.classList.add(this.main.config.addable),a.innerHTML="+",a.onclick=function(e){if(n.main.addable){e.preventDefault(),e.stopPropagation();var t=n.search.input.value;if(""===t.trim())return void n.search.input.focus();var i=n.main.addable(t),s="";if(!i)return;"object"==typeof i?o.validateOption(i)&&(n.main.addData(i),s=i.value?i.value:i.text):(n.main.addData(n.main.data.newOption({text:i,value:i})),s=i),n.main.search(""),setTimeout(function(){n.main.set(s,"value",!1,!1)},100),n.main.config.closeOnSelect&&setTimeout(function(){n.main.close()},100)}},e.appendChild(a),t.addable=a),t},n.prototype.highlightUp=function(){var e=this.list.querySelector("."+this.main.config.highlighted),t=null;if(e)for(t=e.previousSibling;null!==t&&t.classList.contains(this.main.config.disabled);)t=t.previousSibling;else{var i=this.list.querySelectorAll("."+this.main.config.option+":not(."+this.main.config.disabled+")");t=i[i.length-1]}if(t&&t.classList.contains(this.main.config.optgroupLabel)&&(t=null),null===t){var s=e.parentNode;if(s.classList.contains(this.main.config.optgroup)&&s.previousSibling){var n=s.previousSibling.querySelectorAll("."+this.main.config.option+":not(."+this.main.config.disabled+")");n.length&&(t=n[n.length-1])}}t&&(e&&e.classList.remove(this.main.config.highlighted),t.classList.add(this.main.config.highlighted),a.ensureElementInView(this.list,t))},n.prototype.highlightDown=function(){var e=this.list.querySelector("."+this.main.config.highlighted),t=null;if(e)for(t=e.nextSibling;null!==t&&t.classList.contains(this.main.config.disabled);)t=t.nextSibling;else t=this.list.querySelector("."+this.main.config.option+":not(."+this.main.config.disabled+")");if(null===t&&null!==e){var i=e.parentNode;i.classList.contains(this.main.config.optgroup)&&i.nextSibling&&(t=i.nextSibling.querySelector("."+this.main.config.option+":not(."+this.main.config.disabled+")"))}t&&(e&&e.classList.remove(this.main.config.highlighted),t.classList.add(this.main.config.highlighted),a.ensureElementInView(this.list,t))},n.prototype.listDiv=function(){var e=document.createElement("div");return e.classList.add(this.main.config.list),e},n.prototype.options=function(e){void 0===e&&(e="");var t,i=this.main.data.filtered||this.main.data.data;if((this.list.innerHTML="")!==e)return(t=document.createElement("div")).classList.add(this.main.config.option),t.classList.add(this.main.config.disabled),t.innerHTML=e,void this.list.appendChild(t);if(this.main.config.isAjax&&this.main.config.isSearching)return(t=document.createElement("div")).classList.add(this.main.config.option),t.classList.add(this.main.config.disabled),t.innerHTML=this.main.config.searchingText,void this.list.appendChild(t);if(0===i.length){var s=document.createElement("div");return s.classList.add(this.main.config.option),s.classList.add(this.main.config.disabled),s.innerHTML=this.main.config.searchText,void this.list.appendChild(s)}for(var n=function(e){if(e.hasOwnProperty("label")){var t=e,n=document.createElement("div");n.classList.add(c.main.config.optgroup);var i=document.createElement("div");i.classList.add(c.main.config.optgroupLabel),c.main.config.selectByGroup&&c.main.config.isMultiple&&i.classList.add(c.main.config.optgroupLabelSelectable),i.innerHTML=t.label,n.appendChild(i);var s=t.options;if(s){for(var a=0,o=s;a<o.length;a++){var l=o[a];n.appendChild(c.option(l))}if(c.main.config.selectByGroup&&c.main.config.isMultiple){var r=c;i.addEventListener("click",function(e){e.preventDefault(),e.stopPropagation();for(var t=0,i=n.children;t<i.length;t++){var s=i[t];-1!==s.className.indexOf(r.main.config.option)&&s.click()}})}}c.list.appendChild(n)}else c.list.appendChild(c.option(e))},c=this,a=0,o=i;a<o.length;a++)n(o[a])},n.prototype.option=function(r){if(r.placeholder){var e=document.createElement("div");return e.classList.add(this.main.config.option),e.classList.add(this.main.config.hide),e}var t=document.createElement("div");t.classList.add(this.main.config.option),r.class&&r.class.split(" ").forEach(function(e){t.classList.add(e)}),r.style&&(t.style.cssText=r.style);var c=this.main.data.getSelected();t.dataset.id=r.id,this.main.config.searchHighlight&&this.main.slim&&r.innerHTML&&""!==this.main.slim.search.input.value.trim()?t.innerHTML=a.highlight(r.innerHTML,this.main.slim.search.input.value,this.main.config.searchHighlighter):r.innerHTML&&(t.innerHTML=r.innerHTML),this.main.config.showOptionTooltips&&t.textContent&&t.setAttribute("title",t.textContent);var d=this;t.addEventListener("click",function(e){e.preventDefault(),e.stopPropagation();var t=this.dataset.id;if(!0===r.selected&&d.main.config.allowDeselectOption){var i=!1;if(d.main.beforeOnChange&&d.main.config.isMultiple||(i=!0),d.main.beforeOnChange&&d.main.config.isMultiple){for(var s=d.main.data.getSelected(),n=JSON.parse(JSON.stringify(s)),a=0;a<n.length;a++)n[a].id===t&&n.splice(a,1);!1!==d.main.beforeOnChange(n)&&(i=!0)}i&&(d.main.config.isMultiple?(d.main.data.removeFromSelected(t,"id"),d.main.render(),d.main.select.setValue(),d.main.data.onDataChange()):d.main.set(""))}else{if(r.disabled||r.selected)return;if(d.main.config.limit&&Array.isArray(c)&&d.main.config.limit<=c.length)return;if(d.main.beforeOnChange){var o=void 0,l=JSON.parse(JSON.stringify(d.main.data.getObjectFromData(t)));l.selected=!0,d.main.config.isMultiple?(o=JSON.parse(JSON.stringify(c))).push(l):o=JSON.parse(JSON.stringify(l)),!1!==d.main.beforeOnChange(o)&&d.main.set(t,"id",d.main.config.closeOnSelect)}else d.main.set(t,"id",d.main.config.closeOnSelect)}});var i=c&&a.isValueInArrayOfObjects(c,"id",r.id);return(r.disabled||i)&&(t.onclick=null,d.main.config.allowDeselectOption||t.classList.add(this.main.config.disabled),d.main.config.hideSelectedOption&&t.classList.add(this.main.config.hide)),i?t.classList.add(this.main.config.optionSelected):t.classList.remove(this.main.config.optionSelected),t},n);function n(e){this.main=e.main,this.container=this.containerDiv(),this.content=this.contentDiv(),this.search=this.searchDiv(),this.list=this.listDiv(),this.options(),this.singleSelected=null,this.multiSelected=null,this.main.config.isMultiple?(this.multiSelected=this.multiSelectedDiv(),this.multiSelected&&this.container.appendChild(this.multiSelected.container)):(this.singleSelected=this.singleSelectedDiv(),this.container.appendChild(this.singleSelected.container)),this.main.config.addToBody?(this.content.classList.add(this.main.config.id),document.body.appendChild(this.content)):this.container.appendChild(this.content),this.content.appendChild(this.search.container),this.content.appendChild(this.list)}t.Slim=s}],n.c=s,n.d=function(e,t,i){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var s in t)n.d(i,s,function(e){return t[e]}.bind(null,s));return i},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=2).default;function n(e){if(s[e])return s[e].exports;var t=s[e]={i:e,l:!1,exports:{}};return i[e].call(t.exports,t,t.exports,n),t.l=!0,t.exports}var i,s});

/*  startup  */
/* global XA, Breakpoints, $ */
// TODO:
// Use breakpoints.min.js - https://github.com/thecreation/breakpoints-js
// TODO: any chance to use ES2015???

var zwp9 = (function($, Breakpoints) {
  var api = {};

  // TODO: Check https://github.com/thecreation/breakpoints-js breakpoint defaults and verify that they match Zurich SDK
  var onBreakPointChange = function() {
    // console.log('breakpoint change!');
    // $(document).trigger('breakpointChange', [{ size: size }]);
  };

  api.init = function() {
    Breakpoints();
    Breakpoints.on('change', onBreakPointChange);
  };

  return api;
})($, Breakpoints);

XA.ready(zwp9.init);


/*  tabs  */
XA.component.zwpTabs = (function($) {
  var CLASS_IS_SCROLLABLE_LEFT = 'is-ht-left';
  var CLASS_IS_SCROLLABLE_RIGHT = 'is-ht-right';

  var api = {
    /**
     * Adds scroll wrapper and buttons to tabs on page load
     */
    initTabScroll: function initTabScroll() {
      var self = this;
      $('.tabs:not(.sticky-tabs) .tabs-inner').each(function() {
        var $tabsHeading = $('> .tabs-heading', this);

        $(this).prepend(
          $('<div></div>').addClass('js-ht-scroller').prepend(
            $('<button></button>')
              .addClass('js-ht-scroller__btn js-ht-scroller__btn-left')
              .attr('aria-label', 'scroll left')
              .click(self.onTabScrollClick),
            $('<div></div>')
              .addClass('js-ht-scroller__inlay')
              .scroll(function(e) {
                var $navGroup = $(e.target);
                self.onTabScroll($navGroup);
              })
              .prepend($tabsHeading),
            $('<button></button>')
              .addClass('js-ht-scroller__btn js-ht-scroller__btn-right')
              .attr('aria-label', 'scroll right')
              .click(self.onTabScrollClick)
          )
        )       

        var nestedTabs = $('.tabs').find('.tabs-container .tab').find('.tabs').addClass('nestedTabs');
        $(nestedTabs).parentsUntil($('component' ), '.tabs' ).addClass('hasNestedTabs');

        $('.hasNestedTabs').find('.tabs-container > .tab').addClass('level1Tabs');
        $('.level1Tabs').find('.tabs-container > .tab').removeClass('level1Tabs').addClass('level2Tabs');

        var $level1Tabs = $(this).closest('.tabs').find('.level1Tabs');   

        $(' > li', $tabsHeading).click(function() { 
          var idx = $(this).index(); 

          if($level1Tabs.length == 0) {
            var $tabs = $(this).closest('.tabs').find('.tabs-container .tab');
          } else {
            var $tabs = $(this).closest('.tabs').find('.level1Tabs');
          } 

          $tabsHeading.removeClass('active');
          $tabsHeading.eq(idx).addClass('active');

          $tabs.removeClass('active'); 
          $tabs.eq(idx).addClass('active');

        }); 
      });
    }, 

    /**
     * Handles scroll event on tab header (hides/shows arrows)
     * @param {} $headingInlay $('js-ht-scroller__inlay')
     */
    onTabScroll: function($headingInlay) {
      var headingInlayScrollLeft = $headingInlay.scrollLeft();
      var headingInlayScrollWidth = $headingInlay[0].scrollWidth;
      var headingInlayInnerWidth = $headingInlay.innerWidth();
      var $htScroller = $headingInlay.parents('.js-ht-scroller');

      if (headingInlayScrollWidth > headingInlayInnerWidth) {
        $htScroller.addClass('has-scroller');
      } else {
        $htScroller.removeClass('has-scroller');
      }

      if (headingInlayScrollLeft > 10) {
        $htScroller.addClass(CLASS_IS_SCROLLABLE_LEFT);
      } else {
        $htScroller.removeClass(CLASS_IS_SCROLLABLE_LEFT);
      }

      if (headingInlayScrollLeft + (headingInlayInnerWidth + 10) >= headingInlayScrollWidth) {
        $htScroller.removeClass(CLASS_IS_SCROLLABLE_RIGHT);
      } else {
        $htScroller.addClass(CLASS_IS_SCROLLABLE_RIGHT);
      }
    },

    /**
     * Handless tab scroll-button click
     * @param {Event} e 
     */
    onTabScrollClick: function(e) {
      var $btnScroller = $(e.target);
      var $htScroller = $btnScroller.siblings('.js-ht-scroller__inlay');

      if ($btnScroller.hasClass('js-ht-scroller__btn-right')) {
        $htScroller.animate({ scrollLeft: '+=250px' }, 300);
      } else {
        $htScroller.animate({ scrollLeft: '-=250px' }, 300);
      }
    }, 

    /**
     * Check and reset scroll arrows
     */
    checkTabScrollOnLoad: function() {
      var self = this;

      $('.tabs:not(.sticky-tabs) .tabs-inner .js-ht-scroller__inlay').each(function() {

        var $tabComponent = $(this);

        self.onTabScroll($tabComponent);
        self.handleAccordionOpen($tabComponent);
      });
    },

    /**
     * If Tab inside Accordion, ensures scroll-arrows are reset when opening accordion item
     * @param {HTMLElement} $tabComponent - .tab
     */
    handleAccordionOpen: function($tabComponent) {
      var self = this;

      $tabComponent.closest('.accordion .item').on('click', function() {
        if ($(this).hasClass('active')) {
          self.onTabScroll($tabComponent);
        }
      });
    },

    setEventHandlers: function() {
      var self = this;

      $(window).on('resize', function() {
        self.checkTabScrollOnLoad();
      });
    },

    init: function init() {
      this.api.initTabScroll();
      this.api.checkTabScrollOnLoad();
      this.api.setEventHandlers(); 
    }
  };

  return api;
})(jQuery, document);

XA.register('zwpTabs', XA.component.zwpTabs);


/*  video-component-brightcove  */
/* global videojs, $ */
/*eslint no-console: ["error", { allow: ["log"] }] */
/*eslint no-unused-vars: 0*/

XA.component.videoComponentBrightcove = (function ($) {
  var api = {
    
  };

  api.init = function () {
    $('video.video-js').each(function() {
      var accountId = $(this).data('account');
      var playerId = $(this).data('player');

      if (playerId != null && playerId != '' && accountId != null && accountId != null) {
        $.ajax({
          url: '//players.brightcove.net/' + accountId + '/' + playerId + '_default/index.min.js',
          dataType: 'script',
          cache: false
        });
      }
    });
  };
  return api;
})(jQuery, document);

XA.register('videoComponentBrightcove', XA.component.videoComponentBrightcove);


/*  zwp-component-breadcrumb  */
/* global XA, $ */
XA.component.breadcrumbwrapper = (function($) {
  var api=api || {};

  api.init = function() {
    
  };
  return api;
  })(jQuery, document);
XA.register('breadcrumbwrapper', XA.component.breadcrumbwrapper);

/*  zwp-component-search-facet-dropdown  */
XA.component.search.facet.dropdown = (function ($, document) {

    "use strict";

    var api = {},
        urlHelperModel,
        queryModel,
        initialized = false,
        $headLineTitle = $('.title--headline-underline').find(".field-title"),
        headLineText = $headLineTitle.text();

    var FacetDropdownModel = XA.component.search.baseModel.extend({
        defaults: {
            template: "<% _.forEach(results, function(result){" +
                "%><option data-facetName='<%= result.Name !== '' ? result.Name : '_empty_' %>' <%= result.Selected !== undefined ? 'selected' : '' %> ><%= result.Name !== '' ? result.Name : emptyText %></option><%" +
                "}); %>",
            dataProperties: {},
            blockNextRequest: false,
            resultData: {},
            optionSelected: false,
            sig: []
        },
        initialize: function () {
            //event to get data at the begining or in case that there are no hash parameters in the url - one request for all controls
            XA.component.search.vent.on("facet-data-loaded", this.processData.bind(this));

            //event to get filtered data
            XA.component.search.vent.on("facet-data-filtered", this.processData.bind(this));

            //if in the url hash we have this control facet name (someone clicked this control) then we have to listen for partial filtering
            XA.component.search.vent.on("facet-data-partial-filtered", this.processData.bind(this));

            //event after change of hash
            XA.component.search.vent.on("hashChanged", this.updateComponent.bind(this));
        },
        toggleBlockRequests: function () {
            var state = this.get("blockNextRequest");
            this.set(this.get("blockNextRequest"), !state);
        },
        processData: function (data) {
            var inst = this,
                hashObj = queryModel.parseHashParameters(window.location.hash),
                sig = inst.get("sig"),
                dataProperties = this.get("dataProperties"),
                searchResultsSignature = dataProperties.searchResultsSignature.split(','),
                sortOrder = dataProperties.sortOrder,
                facet = dataProperties.f,
                facetItem,
                facedData,
                i, j;

            for (j = 0; j < searchResultsSignature.length; j++) {
                if (data.Facets.length > 0 && (data.Signature === searchResultsSignature[j]) || data.Signature === "" || data.Signature === null) {
                    facedData = _.find(data.Facets, function (f) {
                        return f.Key.toLowerCase() === facet.toLowerCase();
                    });

                    if (facedData === undefined) {
                        return;
                    }

                    for (i = 0; i < sig.length; i++) {
                        if (!jQuery.isEmptyObject(_.pick(hashObj, sig[i]))) {
                            if (hashObj[sig[i]] !== "") {
                                facetItem = _.where(facedData.Values, { Name: hashObj[sig[i]] });
                                if (facetItem.length === 0) {
                                    facetItem = _.where(facedData.Values, { Name: "" });
                                }
                                if (facetItem.length > 0) {
                                    facetItem[0].Selected = true;
                                    inst.optionSelected = true;
                                }
                            }
                        }
                    }

                    this.sortFacetArray(sortOrder, facedData.Values);
                    inst.set({ resultData: facedData.Values });
                }
            }
        },
        updateComponent: function (hash) {
            var sig = this.get("sig"), i, facetPart;

            for (i = 0; i < sig.length; i++) {
                facetPart = sig[i].toLowerCase();
                if (hash.hasOwnProperty(facetPart) && hash[facetPart] !== "") {
                    this.set({ optionSelected: true });
                    if (hash[facetPart] !== 'undefined' && typeof hash[facetPart] !== 'undefined') {
                        $headLineTitle.text(hash[facetPart]);
                    }
                    else {
                        $headLineTitle.text(headLineText);
                    }
                } else {
                    this.set({ optionSelected: false });
                    $headLineTitle.text('');
                    $headLineTitle.text(headLineText);
                }
            }
        }
    });

    var FacetDropdownView = XA.component.search.baseView.extend({
        initialize: function () {
            var dataProperties = this.$el.data();
            this.properties = dataProperties.properties;

            if (this.model) {
                this.model.set({ dataProperties: this.properties });
                this.model.set("sig", this.translateSignatures(this.properties.searchResultsSignature, this.properties.f));
            }

            this.model.on("change", this.render, this);
        },
        events: {
            "change .facet-dropdown-select": "updateFacet",
            "click .bottom-remove-filter, .clear-filter": "clearFilter"
        },
        updateFacet: function (param) {
            var $selectedOption = this.$el.find(".facet-dropdown-select").find("option:selected"),
                facetName = $selectedOption.data("facetname"),
                sig = this.model.get("sig");

            if (facetName === "") {
                this.model.set({ optionSelected: false });
            } else {
                this.model.set({ optionSelected: true });
            }
            queryModel.updateHash(this.updateSignaturesHash(sig, facetName, {}));
        },
        render: function () {
            var inst = this,
                resultData = inst.model.get("resultData"),
                dropdown = this.$el.find(".facet-dropdown-select"),
                emptyValueText = inst.model.get('dataProperties').emptyValueText,
                facetClose = this.$el.find(".facet-heading > span"),
                notSelectedOption = dropdown.find("option:first"),
                notSelectedOptionEntry = $("<option />"),
                template = _.template(inst.model.get("template")),
                templateResult = template({ results: resultData, emptyText: emptyValueText });


            notSelectedOptionEntry.text(notSelectedOption.text());
            notSelectedOptionEntry.data("facetname", "");

            if (this.model.get("optionSelected")) {
                facetClose.addClass("has-active-facet");
            } else if (notSelectedOption.data("facetname") === "") {
                facetClose.removeClass("has-active-facet");
            }

            dropdown.empty().append(notSelectedOptionEntry).append(templateResult);
        },
        clearFilter: function () {
            var dropdown = this.$el.find(".facet-dropdown-select"),
                facetClose = this.$el.find(".facet-heading > span"),
                sig = this.model.get("sig");

            queryModel.updateHash(this.updateSignaturesHash(sig, "", {}));
            this.model.set({ optionSelected: false });
            facetClose.removeClass("has-active-facet");
            dropdown.val(dropdown.find("option:first").val());
        }
    });


    api.init = function () {
        if ($("body").hasClass("on-page-editor") || initialized) {
            return;
        }
        queryModel = XA.component.search.query;
        urlHelperModel = XA.component.search.url;

        var facetDropdownList = $(".facet-dropdown");
        _.each(facetDropdownList, function (elem) {
            var view = new FacetDropdownView({ el: $(elem), model: new FacetDropdownModel() });
        });

        initialized = true;
    };

    api.getFacetDataRequestInfo = function () {
        var facetDropdownList = $(".facet-dropdown"),
            result = [];

        _.each(facetDropdownList, function (elem) {
            var properties = $(elem).data().properties,
                signatures = properties.searchResultsSignature.split(','),
                i;

            for (i = 0; i < signatures.length; i++) {
                result.push({
                    signature: signatures[i] === null ? "" : signatures[i],
                    facetName: properties.f,
                    endpoint: properties.endpoint,
                    filterWithoutMe: true
                });
            }
        });

        return result;
    };

    return api;

}(jQuery, document));

XA.register("facetDropdown", XA.component.search.facet.dropdown);

/*  zwp-component-teaser  */
 XA.component.zwpComponentTeaser = (function ($) {
     var api=api || {};
  
     api.init = function() {
        if($('.component.teaser .teaser--wrapper > a').attr('href') === undefined) {
            $('.component.teaser .teaser--wrapper > a').css("cursor","initial");
        }

        // image ratio adjustments
        $('.component.teaser.flexembed.flexembed--16by9').each(function(){
            $('.field-promoicon img', this).innerHeight( $('.field-promoicon img', this).innerWidth() * 9 / 16 )
        });
        
        $('.component.teaser.flexembed.flexembed--1by1').each(function(){
            $('.field-promoicon img', this).innerHeight( $('.field-promoicon img', this).innerWidth() * 1 / 1 )
        });
        
        $('.component.teaser.flexembed.flexembed--2by1').each(function(){
            $('.field-promoicon img', this).innerHeight( $('.field-promoicon img', this).innerWidth() * 1 / 2 )
        });
        
        $('.component.teaser.flexembed.flexembed--3by1').each(function(){
            $('.field-promoicon img', this).innerHeight( $('.field-promoicon img', this).innerWidth() * 1 / 3 )
        });
        
        $('.component.teaser.flexembed.flexembed--4by3').each(function(){
            $('.field-promoicon img', this).innerHeight( $('.field-promoicon img', this).innerWidth() * 3 / 4 )
        });

        $('.teaser--tile .teaser__content .teaser__title').each(function(){
            $(this).wrapInner('<span></span>'); 
        }); 

        $('.teaser--text').each(function() { 
            $(this).find('h6:only-child').addClass('heading-only');
        });

        $(window).on('scroll', function() {
            $('.teaser--tile, .teaser-related').each(function() {
              if ($(window).width() < 769) { 
                if (isScrolledIntoView($(this))) { 
                    $(this).addClass('sm-visible');  
                } else { 
                    $(this).removeClass('sm-visible');
                }
             } else { 
                $(this).removeClass('sm-visible');
             }
            });
          });
          
        function isScrolledIntoView(elem) {
            var docViewTop = $(window).scrollTop();
            var docViewBottom = docViewTop + $(window).height();
            
            var elemTop = $(elem).offset().top;
            var elemBottom = elemTop + $(elem).height();
            
            return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
        }
        
        if ($(document).find('.teaser--hover')) {
            if ($('body').hasClass('on-page-editor') || $(document).width() < 1200) {
                $('.teaser--hover .teaser__content .field-promotext').css('display', 'block');
                $('.default-device .teaser--hover .teaser__content').css('transform', 'scale(1)');
                $('.default-device .teaser--hover .teaser__content').css('position', 'relative');
                $('.default-device .teaser--hover .teaser__content').css('top', '0px');
                $('.on-page-editor .show--slider .teaser--hover').parent().css('height','100%');
                var teaserHovers = $('.teaser--hover');
                $(teaserHovers).parent().addClass('d-lg-flex d-md-flex d-flex');
                $(teaserHovers).parent().css('flex-direction', 'column');
                $.each($(teaserHovers), function () {
                    if (!$(this).parents().hasClass('show--slider')) {
                        var teaserContet = $(this).find('.teaser__content');
                        var teaserHeight = $(this).parent().height();
                        if ($(teaserContet).height() < teaserHeight) {
                            $(teaserContet).css('height', (teaserHeight - 165));
                        }
                    }
                });
            }
        }       
     };

     function equalTeaserHeight(teasersWithBG) {
        $.each(teasersWithBG, function () {
            if ($(this).hasClass('bg-height')) {
                        $(this).css({'height':'calc(100% - 10px)','margin-bottom':'40px','padding':'15px !important'});
                        $(this).parent().css('flex-direction','column');
                        $(this).parent().addClass('d-flex d-md-flex d-lg-flex');
            }
        });
    }
    var teasersWithBG = $(".column-splitter:not(.show--slider)").find('.teaser.bg-height');
    $.each(teasersWithBG, function () {
        equalTeaserHeight(teasersWithBG);
    });
     return api;
   })(jQuery, document);
  
XA.register('zwpComponentTeaser', XA.component.zwpComponentTeaser);

/*  zwp-event-list  */
XA.component.zwpEventList = (function ($) {
    var api = {
        initEventListEvents: function () {
            var $openEvent = $('.eventdataresult');
            var $closeEvent = $('.c-results__close');

            $('.c_results__copy-hidden').hide();

            $openEvent.before().click(function (e) {
                e.preventDefault();
                var expandElement = $(this).parent().siblings(".c_results__copy-hidden");               
                expandElement.toggle();
            });

            $closeEvent.before().click(function (e) {
                e.preventDefault();
                var collapseElement = $(this).parents(".c_results__copy-hidden");
                collapseElement.toggle();
            });
        },
    };

    api.init = function () {
        this.api.initEventListEvents();
    };

    return api;
})(jQuery, document);

XA.register('zwpEventList', XA.component.zwpEventList);


/*  zwp-teaser-slider  */
XA.component.zwpTeaserSlider = (function ($) {
  var CLASS_IS_SCROLLABLE_LEFT = 'is-ht-left';
  var CLASS_IS_SCROLLABLE_RIGHT = 'is-ht-right';

  var api = {
    /**
     * Adds scroll wrapper and buttons to teasers on page load
     */
    initTeaserSrolls: function initTeaserSrolls() {
      var self = this;
      $('.show--slider > .component-content > ul').each(function () {
        var count = $(this).children('li');
        switch (true) {
          case count.length == 1:
            $(this).parent().parent().addClass('single');
          case count.length == 2:
            $(this).parent().parent().addClass('two');
          default:
            $(this).parent().parent().addClass('multiple');
        }
      });

      /* getting width of teasers */
      if ($(window).width() > '767') {
        var $flexValues = $('.show--slider ul li >div');
        $.each($flexValues, function () {
          $(this).parent().css('flex-basis', $(this).css('flex-basis'));
          $(this)
            .parent()
            .css({ 'flex-grow': '0', 'flex-shrink': '0', display: 'block' });
        });
      }

      $('.show--slider.multiple > .component-content').each(function () {
        var $ul = $('> ul', this);
        var $downloads = $('<div></div>')
          .addClass('teaser-scroll__inlay')
          .scroll(function (e) {
            var $navGroup = $(e.target);
            self.onTeaserScroll($navGroup);
          })
          .prepend($ul);
        $(this).append(
          $('<div></div>')
            .addClass('teaser-scroll')
            .prepend(
              $('<button></button>')
                .addClass('teaser-scroll__btn teaser-scroll__btn-left')
                .click(self.onTeaserScrollClick),
              $downloads,
              $('<button></button>')
                .addClass('teaser-scroll__btn teaser-scroll__btn-right')
                .click(self.onTeaserScrollClick)
            )
        );
      });
    },

    /**
     * Handles scroll event on Teasers (hides/shows arrows)
     * @param {} $headingInlay $('.teaser-scroll__inlay')
     */

    onTeaserScroll: function ($headingInlay) {
      var headingInlayScrollLeft = $headingInlay.scrollLeft();
      var headingInlayScrollWidth = $headingInlay[0].scrollWidth;
      var headingInlayInnerWidth = $headingInlay.innerWidth();
      var $htScroller = $headingInlay.parents('.teaser-scroll');

      if (headingInlayScrollWidth > headingInlayInnerWidth) {
        $htScroller.addClass('has-scroller');
      } else {
        $htScroller.removeClass('has-scroller');
      }

      if (headingInlayScrollLeft > 10) {
        $htScroller.addClass(CLASS_IS_SCROLLABLE_LEFT);
      } else {
        $htScroller.removeClass(CLASS_IS_SCROLLABLE_LEFT);
      }

      if (
        headingInlayScrollLeft + (headingInlayInnerWidth + 10) >=
        headingInlayScrollWidth
      ) {
        $htScroller.removeClass(CLASS_IS_SCROLLABLE_RIGHT);
      } else {
        $htScroller.addClass(CLASS_IS_SCROLLABLE_RIGHT);
      }
    },

    /**
     * Handles horizontal Teasers scrolling on arrow click
     * @param {Event} e
     */

    onTeaserScrollClick: function (e) {
      var $btnScroller = $(e.target);
      var $htScroller = $btnScroller.siblings('.teaser-scroll__inlay');

      if ($btnScroller.hasClass('teaser-scroll__btn-right')) {
        $htScroller.animate({ scrollLeft: '+=400px' }, 300);
      } else {
        $htScroller.animate({ scrollLeft: '-=400px' }, 300);
      }
    },

    /**
     * Check and reset scroll arrows
     */

    checkTeaserScrollOnLoad: function () {
      var self = this;
      $('.teaser-scroll__inlay').each(function () {
        self.onTeaserScroll($(this));
      });
    },

    /**
     * Init pageload events
     */

    setEventHandlers: function () {
      var self = this;

      $(window).on('resize', function () {
        self.checkTeaserScrollOnLoad();
      });
    },

    SetTeaserSliderHeight: function () {
      function equalTeaserSliderHeight(teaserSliderBG) {
        $.each(teaserSliderBG, function () {
          var teaserBg = $(this).find('.bg-height');
          if (teaserBg.length == 0) {
            return;
          }

          $(teaserBg).css('padding', '0px');
          $(this).css({
            'background-color': teaserBg.css('background-color'),
            'padding-top': '15px',
          });
        });
      }
      var teaserSliderBG = $('.column-splitter.show--slider').find('li');
      equalTeaserSliderHeight(teaserSliderBG);
      var teaserText = $('.column-splitter.show--slider').find('.teaser--text');
      $.each(teaserText, function () {
        $(this).parent().css({ height: 'calc(100% )', 'flex-grow': '1' });
        $(this)
          .closest('li')
          .css({ margin: '0px', 'background-color': '#fff' });
        $(this).css({ height: 'calc(100% - 20px)', padding: '15px' });
        if ($(this).hasClass('bg-height') && $(window).width() < '767') {
          $(this).css({ height: '100%', padding: '15px' });
        }
      });
    },
    setTeaserHoverHeightInMobile: function () {
      if ($(window).width() < '1200') {
        $('.show--slider .teaser--hover').parent().css('height', '100%');
      }
    },
  };
  api.init = function () {
    this.api.initTeaserSrolls();
    this.api.checkTeaserScrollOnLoad();
    this.api.setEventHandlers();
    this.api.SetTeaserSliderHeight();
    this.api.setTeaserHoverHeightInMobile();
  };
  return api;
})(jQuery, document);

XA.register('zwpTeaserSlider', XA.component.zwpTeaserSlider);


