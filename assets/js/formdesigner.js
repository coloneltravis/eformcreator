

var formdesigner = {
	
	initialise: function() {
		
		that = this;
		this.formArea = $("#formarea");
		
		this.defaultTitles = {
			'grid': 'Grid',
			'lbl': 'Label field',
			'text': 'Text field title',
			'radio': 'Radio buttons title',
			'droplist': 'Drop-down list title',
			'url': 'Web site address',
			'name': 'Name',
			'date': 'Date',
			'phone': 'Telephone',
			'infolink': 'infolink',
			'pushbutton': 'Push button',
			'yesno': 'Yes No Title',
			'break': 'Line break title',
			'time': 'Time',
			'number': 'Number title',
			'email': 'Email Address',
			'postal': 'Postal Address',
			'check': 'Check boxes title',
			'area': 'Text area title',
			'docupload': 'Document upload',
		};
		this.defaultField = {
			'id': 0,
			'type': 'text',
			'title': 'title',
			'description': '',
			'displaydesc': 'Display', // Display|Hide|Icon|Icon Blue
			'required': 0, // 0|1
			'fieldSize': 12,
			'rows': 3,
			'options': [],
			'changed': true,
			'defaultvalue': '',
			'cssClass': ''
		};
		// 1 - value, 3 - id, 5 - type, 7 - checked
		this.newOption = ['<input type="text" name="option" size="25" value="','','" id="opt_','0','" /><input type="','','" name="optSelect" title="Default this option" ','',' /> <img src="/img/add.png" height="16" width="16" alt="Create a new entry" /> <img src="/img/delete.png" height="16" width="16" alt="Delete this entry" />'];

		
		this.ed = {
			'opt': $('#options_label'),
			'fieldSize': $('#size_label'),
			'req': $('#required_label'),
			'desc': $('#description_label'),
			'def': $('#default_label'),
			'minmax': $('minmax_label'),
			'datatype': $('datatype_label')
		};

		this.edits = {
			'id': $('#control_id'),
			'title': $('#title'),
			'desc': $('#description'),
			'display': $('#visibility'),
			'options': $('#options_label ol'),
			'req': $('#required'),
			'dataType': $('#data_type'),
			'fieldSize': $('#field_size'),
			'defaultvalue': $('#defaultvalue'),
			'cssClass': $('css_class'),
			'tooltip': $('#tooltip'),
			'minvalue': $('#min_value'),
			'maxvalue': $('#max_value'),
			'input_mask': $('#input_mask')
		};		

		this.bound = {
			'fields': this.addField.bind(this),
			'applyEdit': this.applyEdit.bind(this),
			'editOption': this.editOption.bind(this),
			'addhighlight': this.addhighlight.bind(this),
			'delhighlight': this.delhighlight.bind(this),
			'selectcell': this.selectcell.bind(this),
			'save': this.save.bind(this)
		};
		$('.toolbox .btn').click(this.bound.fields);
		$(".gridcell").on('mouseover', this.bound.addhighlight);
		$(".gridcell").on('mouseout', this.bound.delhighlight);
		$(".gridcell").on('click', this.bound.selectcell);
		$("#save").on('click', this.bound.save);
	
		if ($("#formJson").val().length) {
			//console.log($("#formJson").val());
			var json = JSON.parse($("#formJson").val());
			if (json != '')
				this.load(json);
		}

		this.autonumber = 1;

		this.settingsdlg = $( "#settingsdlg" ).dialog({
		  autoOpen: false,
		  title: "Control Settings",
		  classes: { "ui-dialog-titlebar-close": "ui-icon ui-icon-close" },
		  height: 350,
		  width: 500,
		  modal: true,
		  resizable: false
		});	

		$('#options_label').click(this.bound.editOption);			

		return this;
	},

	
	// when a new control is selected from the left toolbar to add to the selected gridcell
	addField: function(e) {
		e.preventDefault();
		
		var selectedCell = $(".selected-grid");
		if ($.trim(selectedCell.html()) != '') {
			return;
		}
			
		var type = e.target.id.slice(3);
		var fieldTmp = jQuery.extend(true, {}, this.defaultField);
		var field = jQuery.extend(true, fieldTmp, {
			'id': 'control_' + parseInt(this.autonumber),
			'type': type,
			'title': this.defaultTitles[type]
		});
		this.autonumber++;
	
		if (type.match('grid')) {
				var container = $("<div class='grid-container'/>").appendTo(this.formArea);
				container.append("<div class='addrows'/>");
				container.append("<div class='addcols'/>");
				container.find(".addrows").append("<span class='addrowup glyphicon glyphicon-chevron-up'/>")
					.append("<span class='addrowdown glyphicon glyphicon-chevron-down'/>");
				container.find(".addcols").append("<span class='addcellleft glyphicon glyphicon-chevron-left'/>")
					.append("<span class='addcellright glyphicon glyphicon-chevron-right'/>");
				var addgrid = $("<div class='grid'/>").appendTo(container);
				var addrow = $("<div class='gridrow'/>").appendTo(addgrid);
				addrow.append("<div class='gridcell grid-2'/><div class='gridcell grid-2'/>");
		}
		else {
			if (type.match('droplist|radio|check')) {
				field.options = [
					{'selected': false, 'id': 0, 'value': 'Options 1'},
					{'selected': false, 'id': 0, 'value': 'Options 2'},
					{'selected': false, 'id': 0, 'value': 'Options 3'}
				]
			}

			this.build(field);
		}
	},


	// build the html for the selected control type
	build: function(field, dest = null) {
		var fieldTmp = jQuery.extend(true, {}, this.defaultField);
		var fieldTmp2 = jQuery.extend(true, fieldTmp, field);
		field = fieldTmp2;

		var display = [];
		if (field.type.match('text')) {
			display.push.apply(display, ['<label class="well"><span class="title">',field.title,'</span><br /><input type="text" size="',field.fieldSize,'" value="',field.defaultvalue,'" /></label>']);
		} else if (field.type.match('lbl')) {
			display.push.apply(display, ['<label class="well"><span class="title">',field.title,'</span><br /></label>']);
		} else if (field.type.match('date')) {
			display.push.apply(display, ['<label class="well"><span class="title">',field.title,'</span><br /><input type="date" size="',field.fieldSize,'" value="',field.defaultvalue,'" /></label>']);
		} else if (field.type.match('phone')) {
			display.push.apply(display, ['<label class="well"><span class="title">',field.title,'</span><br /><input type="tel" size="',field.fieldSize,'" value="',field.defaultvalue,'" /></label>']);
		} else if (field.type.match('email')) {
			display.push.apply(display, ['<label class="well"><span class="title">',field.title,'</span><br /><input type="email" size="',field.fieldSize,'" value="',field.defaultvalue,'" /></label>']);
		} else if (field.type.match('number')) {
			display.push.apply(display, ['<label class="well"><span class="title">',field.title,'</span><br /><input type="number" size="',field.fieldSize,'" value="',field.defaultvalue,'" /></label>']);
		} else if (field.type === 'area') {
			field.rows = (field.fieldSize > 20) ? Math.round(field.fieldSize/20) : 3;
			display.push.apply(display, ['<label class="well"><span class="title">',field.title,'</span><br /><textarea name="field" id="field" cols="',field.fieldSize,'" rows="',field.rows,'"></textarea></label>']);
		} else if (field.type.match('radio|check|yesno')) {
			if (field.type === 'yesno') {
				field.type = 'radio';
				field.title = 'Yes No Title';
				field.options = [{'selected': false, 'id': 0, 'value': 'Yes'},{'selected': false, 'id': 0, 'value': 'No'}];
			}
			var typ = (field.type === 'check') ? 'checkbox' : field.type;
			display.push.apply(display, ['<span class="title">',field.title,'</span><br />']);
			jQuery.each(field.options, function(o, opt) {
				display.push.apply(display, ['<div><label><input type="',typ,'" name="field_',that.radioSet,'" value="',o,'" title="',opt.value,'" ']);
				if (opt.selected) display.push('checked="checked"');
				display.push.apply(display, [' /> ',opt.value,'</label></div>']);
			});
			this.radioSet += 1;
		} else if (field.type === 'droplist') {
			display.push.apply(display, ['<label class="well"><span class="title">',field.title,'</span><br /><select style="width:',field.fieldSize,'ex;">']);
			jQuery.each(field.options, function(o, opt) {
				display.push.apply(display, ['<option value="',o,'" title="',opt.value,'" ']);
				if (opt.selected) display.push('selected="selected"');
				display.push.apply(display, ['>',opt.value,'</option></div>']);
			});
			display.push('</select></label>');
		} else if (field.type === 'cluster') {
			display.push.apply(display, ['<label class="well"><span class="title">',field.title,'</span><br />']);
			display.push.apply(display, ['Health Board:&nbsp;<select style="width:100%',field.fieldSize,'ex;">']);
			display.push('<option title="select a health board" value="0">Select a Health Board</option></select></label>&nbsp;&nbsp;&nbsp;');
			display.push.apply(display, ['<label class="well">Cluster:&nbsp;<select style="width:100%',field.fieldSize,'ex;">']);
			display.push('<option title="select a cluster" value="0">Select a Cluster</option></select></label>');
		} else if (field.type === 'postal') {
			display.push.apply(display, ['<span class="title">',field.title,'</span><br /><label>Address 1<br /><input type="text" size="30" /></label><br /><label>Address 2<br /><input type="text" size="30" /></label><br /><label>City/Town<br /><input type="text" size="20" /></label><br /><label>Postcode<br /><input type="text" size="10" /></label>']);
		} else if (field.type === 'url') {
			display.push.apply(display, ['<label class="well"><a href="#"><span class="title">',field.title,'</span></a><br /></label>']);
		} else if (field.type === 'pushbutton') {
			display.push.apply(display, ['<label class="well"><button name="field" value="',field.title,'"><span class="title">',field.title,'</span></button></label>']);
		} else if (field.type === 'name') {
			display.push.apply(display, ['<span class="title">',field.title,'</span><table><tr><td><input type="text" name="field" size="5" /></td><td><input type="text" name="field" size="20" /></td><td><input type="text" name="field" size="20" /></td></tr><tr><td>[Title]</td><td>[Firstname]</td><td>[Lastname]</td></tr></table>']);
		} else if (field.type === 'time') {
			display.push.apply(display, ['<span class="title">',field.title,'</span><table><tr><td><input type="text" name="field" size="2" maxlength="2" /> :</td><td><input type="text" name="field" size="2" maxlength="2" /> :</td><td><input type="text" name="field" size="2" maxlength="2" /> .</td><td><select><option value="am">AM</option><option value="pm">PM</option></select></td></tr><tr><td>[hh]</td><td>[mm]</td><td>[ss]</td><td>[am/pm]</td></tr></table>']);
		} else if (field.type === 'break') {
			display.push.apply(display, ['<span class="title">',field.title,'</span><div style="margin:2px 3px; border-bottom:1px solid #554E3A"></div>']);
		} else if (field.type === 'docupload') {
			display.push.apply(display, ['<label class="well"><span class="title">',field.title,'</span><br /><input type="file" size="',field.fieldSize,'" /></label>']);
		} else if (field.type.match(/^info(link|linkpop)?$/)) {
			if (field.type == 'infolink') field.description = '<a href="http://add-site-here/">Add-text-here</a>';
			else if (field.type == 'infolinkpop') field.description = '<a href="http://add-site-here/" target="_blank">Add-text-here</a>';
			field.type = 'info';
			display.push.apply(display, ['<div><span class="title">',field.title,'</span></div><div class="desc">',field.description,'</div>']);

			var typ = 'radio';
			jQuery.each(field.options, function(o, opt) {
				display.push.apply(display, ['<div><label class="well"><input type="',typ,'" name="field_',that.radioSet,'" value="',o,'" title="',opt.value,'" ']);
				if (opt.selected) display.push('checked="checked"');
				display.push.apply(display, [' /> ',opt.value,'</label>']);
				display.push.apply(display, ['</div>']);
			});
			this.radioSet += 1;
		}

		if (display.length > 0) {
			display.unshift('<div class="field">');
			//display.push('<span class="typeLabel">'+field.type+'</span></div>');

			var dest_el = dest;
			if (!dest) {
				dest_el = $(".selected-grid");
			}
			
			var el = jQuery('<div class="formfield ' + field.type + '"></div>').html(display.join('')).appendTo(dest_el);
			//var el = $(".selected-grid").html(display.join(''));
			
			var fieldData = {}
			$.extend(true, fieldData, field);

			el.data('prop', fieldData).on('click', $.proxy(this.edit, this));

			if (field.type === 'droplist') {
				el.find('select').change(this.fixOptions);
			} else if (field.type.match('radio|check')) {
				el.find('input').click(this.fixOptions).keyup(this.fixOptions);
			} else if (field.type === 'info') {
				el.find('a').click(this.stopLink);
			}
		}
	},
	
	
	// when a control field is clicked to edit its properties
	edit: function(el) {

		if(el.target.nodeName == 'div' && $(el.target).hasClass('formfield'))
			el = $(el.target);
		else
			el = $(el.target).parents('div.formfield');

		$('#current').removeAttr('id');
		el.attr('id', 'current');

		this.selected = el.get(0);

		this.settingsdlg.dialog("option", "buttons", [ { text: "Delete",
														  icon: "ui-icon-remove",
														  click: function(e) {that.deleteEdit(el);
																			  $(this).dialog("close");
																			}
														},
														{ text: "Apply",
														  icon: "ui-icon-",
														  click: function(e) {that.applyEdit(e);
																				$(this).dialog("close");
																			}
														}
													 ] );
		this.settingsdlg.dialog("open");
		this.settingsdlg.tabs();

		var optType = (el.data('prop').type == 'check') ? 'checkbox' : 'radio';
		var checkit, newOpt, itemid;
		this.edits.options.html('');
		jQuery.each(el.data('prop').options, function(i, item) {
			checkit = (item.selected || item.checked) ? 'checked="checked"' : '';
			// 1 - value, 3 - id, 5 - type, 7 - checked

			newOpt = that.newOption.slice();
			newOpt[1] = item.value;	newOpt[3] = item.id;
			newOpt[5] = optType;	newOpt[7] = checkit;
			$('<li>' + newOpt.join('') + '</li>').appendTo(that.edits.options);
		});


		if (el.data('prop').type.match('(text|url|phone|number|email)')) {
			this.ed.opt.hide();
			this.ed.fieldSize.show();
			this.ed.def.show();
		} else if (el.data('prop').type == 'area') {
			this.ed.opt.hide();
			this.ed.fieldSize.show();
			this.ed.def.hide();
		} else if (el.data('prop').type.match('(radio|check|droplist)')) {
			this.ed.def.hide();
			if (el.data('prop').type == 'droplist') this.ed.fieldSize.show();
			else this.ed.fieldSize.hide();

			this.ed.opt.show();
			this.ed.opt.find('a#options_add').show();


		} else if (el.data('prop').type.match('(break|info)')) {
			this.ed.def.hide();
			this.ed.opt.hide();
			this.ed.fieldSize.hide();
			this.ed.req.hide();
			if (el.data('prop').type == 'break') this.ed.desc.hide();
			else this.ed.desc.show();
		} else {
			this.ed.opt.hide();
			this.ed.fieldSize.hide();
			this.ed.def.hide();
		}

		if (!el.data('prop').type.match('(break|info)')) {
			this.ed.desc.show();
			this.ed.req.show();
		}
		// Load field properties
		this.edits.id.val(el.data('prop').id);
		this.edits.title.val(el.data('prop').title);
		this.edits.defaultvalue.val(el.data('prop').defaultvalue);
		this.edits.desc.val(el.data('prop').description);
		this.edits.cssClass.val(el.data('prop').cssClass);

		this.edits.req.get(0).checked = (el.data('prop').required == 1) ? true : false;
		this.edits.display.find('option').each(function() {
			this.selected = (this.value == el.data('prop').displaydesc);
		});
		this.edits.fieldSize.find('option').each(function() {
			this.selected = (this.value == el.data('prop').fieldSize);
		});
	},


	deleteEdit: function(el) {
		if (confirm('Are you sure you want to delete this control?')) {
			el.remove();
		}
	},


	// when the edited properties are applied from the settings dialog box
	applyEdit: function(e) {
		var el = $(that.selected);
		var eMsg = [];

		el.data('prop').changed = true;
		
		$('#linkDisplay').css('visibility', 'hidden');

		if (el.data('prop').type.match('droplist|check|radio')) {
			var optType = (el.data('prop').type == 'check') ? 'checkbox' : 'radio';
			var options = this.edits.options.find('li');
			var opts = [];
			var text = [];

			options.each(function() {
				ip = $(this).find('input[type=text]');

				opts.push({
					'selected': $(this).find('input[type='+optType+']').get(0).checked,
					'value': ip.val(),
					'id': ip.attr('id').split('_')[1]
				});

				if (ip.val().length == 0) ip.addClass('error');
				if ($.inArray(ip.val(), text) == -1) text.push(ip.val());
				else ip.addClass('error');
			});

			var eLen = eMsg.length;
			var reqOptions = (optType == 'checkbox') ? 1 : 2;
			if (opts.length < reqOptions) {
				$('#options_label').addClass('error');
				eMsg.push('This control type requires ' + reqOptions + ' or more possible options.');
			}

			if (this.edits.options.find('.error').length > 0) {
				eMsg.push('All options must be unique and not empty.');
			}

			if (eMsg.length == 0) {
				var newOpts = [];
				var hidden1 = [];
				var hidden2 = [];
				if (el.data('prop').type == 'droplist') {
					sel = el.find('select').get(0);
					sel.options.length = 0;
					$.each(opts, function(index, opt) {
						sel.options[index] = new Option(opt.value, opt.id);
						sel.options[index].selected = (opt.selected);
					});
				}
				else {
					el.find('.field div').each(function() {
						$(this).remove();
					});
					var place = el.find('.formfield');

					$.each(opts, function(index, opt) {
						newOpts = ['<label><input type="',optType,'" title="',opt.value,'" value="',opt.id,'" name="field_',that.radioSet,'"',(opt.selected) ? 'checked="checked"' : '','/> ',opt.value,'</label>'];

						var optid = opt.id;
						if (opt.id == 0) optid = index;

						place.before($('<div>' + newOpts.join('') + '</div>'));
					});

					this.radioSet += 1;

				}
				el.data('prop').options = opts;
			}
		}
		if (eMsg.length > 0) {
			eMsg.push('Changes have NOT been applied.');
			alert(eMsg.join('\n\n'));
			return;
		}

		el.data('prop').id = this.edits.id.val();
		el.data('prop').title = this.edits.title.val();
		el.data('prop').description = this.edits.desc.val();
		el.data('prop').defaultvalue = this.edits.defaultvalue.val();
		el.data('prop').cssClass = this.edits.cssClass.val();

		el.data('prop').required = this.edits.req.get(0).checked ? 1 : 0;
		el.data('prop').visibility = this.edits.display.val();
		el.data('prop').fieldSize = this.edits.fieldSize.val();
		el.find('.title').html(el.data('prop').title);

		if (el.data('prop').type == 'info') {
			el.find('div.desc').html(el.data('prop').description);
		}

		if (el.data('prop').type.match('text|number|date|phone|email|url')) {
			el.find('input[type=text]').size = el.data('prop').fieldSize;
			el.find('input[type=text]').val(el.data('prop').defaultvalue);
		} else if (el.data('prop').type == 'area') {
			el.data('prop').cols = (el.data('prop').fieldSize > 20) ? Math.round(el.data('prop').fieldSize/10) : 3;
			el.find('textarea').attr({
				'cols': el.data('prop').fieldSize,
				'rows': el.data('prop').cols
			});
		} else if (el.data('prop').type == 'droplist') {
			el.find('select').css('width', el.data('prop').size + 'ex');
		}

		if(e.target.id && e.target.id == 'apply') {
			$('#current').removeAttr('id');
		}
	},	

	
	editOption: function(e) {
		var el = e.target;
		if (el.nodeName == 'A') {
			e.preventDefault();
			if (el.id == 'option_add') {
				// 5 - type
				var newOpt = that.newOption.slice();
				newOpt[5] = ($(that.selected).data('prop').type == 'check') ? 'checkbox' : 'radio';
				$('<li>' + newOpt.join('') + '</li>').prependTo(this.edits.options);
				this.ed.opt.show();
			} else {
				this.edits.options.find('input[type=checkbox], input[type=radio]').each(function(){
					this.checked = false;
				});
			}
		} else if (el.nodeName == 'IMG') {
			var item = $(el).parents('li').get(0);
			if (el.alt == 'Create a new entry') {
				var newOpt = that.newOption.slice();
				// 5 - type
				newOpt[5] = ($(that.selected).data('prop').type == 'check') ? 'checkbox' : 'radio';
				$(item).after($('<li>' + newOpt.join('') + '</li>'));
				this.ed.opt.show();
			}
			else if (el.alt == 'Delete this entry') {
				$(item).remove();
				this.ed.opt.show();
			}
			else if (el.alt == 'Additional information') {
				//item.remove();
				this.ed.opt.show();
			}
		}
	},

	
	load: function(json) {

			
		var formdoc = json;	
		//console.log(formdoc);

		for (f in formdoc) {
			var grid = formdoc[f].grid;
			//console.log(grid);

			var container = $("<div class='grid-container'/>").appendTo(this.formArea);
			var addrows = $("<div class='addrows'/>").appendTo(container);
			var addcols = $("<div class='addcols'/>").appendTo(container);
			addrows.append("<span class='addrowup glyphicon glyphicon-chevron-up'/>");
			addrows.append("<span class='addrowdown glyphicon glyphicon-chevron-down'/>");
			addcols.append("<span class='addcellleft glyphicon glyphicon-chevron-left'/>");
			addcols.append("<span class='addcellright glyphicon glyphicon-chevron-right'/>");

			var addgrid = $("<div class='grid'/>").appendTo(container);
	

			var addgridrow = $("<div class='gridrow'/>").appendTo(addgrid);
			
			for (r in grid.rows) {
				var gridrow = grid.rows[r];
				//console.log(gridrow);

				for (c in gridrow.cols) {
					
					var fld = gridrow.cols[c];
					//console.log(fld);

					var addgridcell = $('<div class="gridcell grid-' + gridrow.cols.length + '"/>').appendTo(addgridrow);

					if (fld != null) {
						this.build(fld, addgridcell);
					}
				}
			}
		}
	},

	
	save: function(e) {
		if (e)
			e.preventDefault();
		var eMsg = [];
		
		$('.error').removeClass('error');

		if (eMsg.length > 0) {
			eMsg.push('Changes have NOT been saved.');
			alert(eMsg.join('\n\n'));
		}
		else {
			this.buildSave();
			this.leaving = true;
			$('#sectionForm').submit();
		}
	},


	buildSave: function() {
		var formdoc = [];

		$('#formarea > .grid-container').each(function() {
			
			$(this).find(".grid").each(function() {

				var grid = { rows: [] };

				$(this).children(".gridrow").each(function() {
					
					var gridrow = { cols: [] };					
					
					$(this).children(".gridcell").each( function() {
						var control = $(this).children('.formfield').data('prop');
						gridrow.cols.push(control);					
					});
					
					grid.rows.push(gridrow);
				});
				
				formdoc.push({"grid": grid});
			});

		});
		$('#formJson').val(JSON.stringify(formdoc));
	},

	
	addhighlight: function(e) {
		$(this).addClass("highlight-grid");
	},
	
	delhighlight: function(e) {
		$(this).removeClass("highlight-grid");
	},
	
	selectcell: function(e) {
		$(".selected-grid").each(function() {
			$(this).removeClass("selected-grid");
		});
		$(this).addClass("selected-grid");
	},
	
	deletecell: function(e) {
		console.log(e);
		if (e.keyCode == 46) {
			$(".selected-grid").remove();
		}
	}

}




$(document).ready(function() {

	var fd = formdesigner.initialise("#formarea");


	
	$(document).on("mouseover", ".gridcell", fd.addhighlight);
	$(document).on("mouseout", ".gridcell", fd.delhighlight);
	$(document).on("click", ".gridcell", fd.selectcell);
	$(document).on("keydown", ".selected-grid", fd.deletecell);

	$(document).on('mouseover', '.grid-container', function(e) {
		$(this).find(".addrows").show();
		$(this).find(".addcols").show();
			
		if ($(e.target).hasClass("gridcell")) {
			$(".delcol").remove();
			$("<div class='delcol' id='" + "col" + $(e.target).index() + "'><span class='glyphicon glyphicon-trash'/></div>").prependTo(this);
			$(".delcol").css("margin-left", $(e.target).position().left + ($(e.target).width()/3));
			$(".delcol").css("margin-top", "10px");

			$(".delrow").remove();
			$("<div class='delrow' id='" + "row" + $(e.target).parent().index() + "'><span class='glyphicon glyphicon-trash'/></div>").prependTo(this);
			$(".delrow").css("top", $(e.target).position().top + ($(e.target).height()/3));
			$(".delrow").css("left", "10px");
		}
	});


	$(document).on('mouseout', '.grid-container', function(e) {
		$(".addrows").hide();
		$(".addcols").hide();

		if (!$(e.target).hasClass("gridcell")) {
			$(".delcol").remove();
		}
	});


	$(document).on('click', '.delcol', function(e) {
		var col = parseInt($(this).attr("id").slice(3));
		var container = $(this).parent();
		var cellcount = container.find(".gridrow:first > .gridcell").length;

		if (cellcount > 0) {
			container.find(".gridrow").each(function() {
				$(this).find(".gridcell").eq(col).remove();

				$(this).find(".gridcell").each(function() {
					$(this).removeClass("grid-" + cellcount);
					$(this).addClass("grid-" + parseInt(cellcount-1));
				});

			});
		}
		else container.remove();
	});


	$(document).on('click', '.delrow', function(e) {
		var row = parseInt($(this).attr("id").slice(3));
		var container = $(this).parent();
		var rowcount = container.find(".gridrow").length;

		console.log(rowcount);

		if (rowcount > 0) {
			container.find(".gridrow").eq(row).remove();
		}
		else container.remove();
	});

	
	$(document).on('click', '.addcellleft', function(e) {
		//console.log('addcellleft');

		var container = $(this).parent().parent();
		var cellcount = container.find(".grid:first .gridrow:first > .gridcell").length;
3
		if (cellcount < 4) {
			container.find(".gridrow").each(function() {
				$(this).find(".gridcell").each(function() {
					$(this).removeClass();
					$(this).addClass("gridcell grid-" + parseInt(cellcount+1))
				});
				
				$(this).prepend("<div class='gridcell grid-" + parseInt(cellcount+1) +"'/>");		
			});
		}
	});

	$(document).on('click', '.addcellright', function(e) {
		//console.log('addcellright');
		var cellcount = $(this).parent().parent().find(".grid:first .gridrow:first > .gridcell").length;
		var container = $(this).parent().parent();
		
		if (cellcount < 4) {
			container.find(".gridrow").each(function() {
				$(this).find(".gridcell").each(function() {
					$(this).removeClass();
					$(this).addClass("gridcell grid-" + parseInt(cellcount+1))
				});

				$(this).append("<div class='gridcell grid-" + parseInt(cellcount+1) +"'/>");		
			});
		}
	});

	
	$(document).on('click', '.addrowup', function(e) {
		console.log('addrowup');

		var cellcount = $(this).parent().parent().find(".gridcell").length;
		if ($(this).parent().parent().find(".gridrow .gridcell").hasClass("grid-1")) cellcount = 1;
		if ($(this).parent().parent().find(".gridrow .gridcell").hasClass("grid-2")) cellcount = 2;
		if ($(this).parent().parent().find(".gridrow .gridcell").hasClass("grid-3")) cellcount = 3;
		if ($(this).parent().parent().find(".gridrow .gridcell").hasClass("grid-4")) cellcount = 4;
		
		var newrow = ['<div class="gridrow">'];
		for (i=0; i<cellcount; i++)
			newrow.push('<div class="gridcell grid-' + cellcount + '"/>');
		newrow.push('</div>');
		$(this).parent().parent().find(".grid").prepend(newrow.join(''));
	});

	$(document).on('click', '.addrowdown', function(e) {
		console.log('addrowdown');
		
		var cellcount = $(this).parent().parent().find(".gridcell").length;
		if ($(this).parent().parent().find(".gridcell").hasClass("grid-1")) cellcount = 1;
		if ($(this).parent().parent().find(".gridcell").hasClass("grid-2")) cellcount = 2;
		if ($(this).parent().parent().find(".gridcell").hasClass("grid-3")) cellcount = 3;
		if ($(this).parent().parent().find(".gridcell").hasClass("grid-4")) cellcount = 4;

		var newrow = ['<div class="gridrow">'];
		for (i=0; i<cellcount; i++)
			newrow.push('<div class="gridcell grid-' + cellcount + '"/>');
		newrow.push('</div>');
		$(this).parent().parent().find(".grid").append(newrow.join(''));
	});
});

