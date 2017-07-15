

var formdesigner = {
	
	initialise: function() {
		
		that = this;
		this.formArea = $("#formarea");
		
		this.defaultTitles = {
			'grid': 'Grid',
			'text': 'Text field title',
			'radio': 'Radio buttons title',
			'droplist': 'Drop-down list title',
			'url': 'Web site address',
			'name': 'Name',
			'date': 'Date',
			'phone': 'Telephone',
			'info': 'Information',
			'infolink': 'Information',
			'infolinkpop': 'Information',
			'yesno': 'Yes No Title',
			'break': 'Line break title',
			'time': 'Time',
			'number': 'Number title',
			'email': 'Email Address',
			'postal': 'Postal Address',
			'check': 'Check boxes title',
			'area': 'Text area title',
			'docupload': 'Document upload',
			'maturitymatrix': 'Maturity matrix'

		};
		this.defaultField = {
			'id': 0,
			'type': 'text',
			'qno': '',
			'title': 'title',
			'description': '',
			'displaydesc': 'Display', // Display|Hide|Icon|Icon Blue
			'cats': ['0'],
			'perm': ['0'],
			'required': 0, // 0|1
			'hidenumber' : 0, //0|1
			'fieldSize': 20,
			'rows': 3,
			'options': [],
			'changed': true,
			'defaultvalue': ''
		};
		// 1 - value, 3 - id, 5 - type, 7 - checked
		this.newOption = ['<input type="text" name="option" size="25" value="','','" id="opt_','0','" /><input type="','','" name="optSelect" title="Default this option" ','',' /> <img src="/img/add.png" height="16" width="16" alt="Create a new entry" /> <img src="/img/delete.png" height="16" width="16" alt="Delete this entry" />'];

		this.bound = {
			'fields': this.addField.bind(this),
			'apply': this.applyEdit.bind(this),
			'addhighlight': this.addhighlight.bind(this),
			'delhighlight': this.delhighlight.bind(this),
			'selectcell': this.selectcell.bind(this)
		};
		$('.toolbox .btn').click(this.bound.fields);
		$(".gridcell").on('mouseover', this.bound.addhighlight);
		$(".gridcell").on('mouseout', this.bound.delhighlight);
		$(".gridcell").on('click', this.bound.selectcell);
	

		this.settingsdlg = $( "#settingsdlg" ).dialog({
		  autoOpen: false,
		  title: "Control Settings",
		  height: 350,
		  width: 500,
		  modal: true,
		  resizable: false,
		  buttons: {
				"Apply": this.apply
			},
		  close: function() {
			  $(this).dialog( "close" );
		  }
		});	
	
		return this;
	},

	addField: function(e) {
		e.preventDefault();
		var type = e.target.id.slice(3);
		var fieldTmp = jQuery.extend(true, {}, this.defaultField);
		var field = jQuery.extend(true, fieldTmp, {
			'type': type,
			'title': this.defaultTitles[type]
		});
		
		if (type.match('grid')) {
				var el = $("<div class='grid-container'/>").appendTo(this.formArea);
				el.append("<span class='addgridleft glyphicon glyphicon-step-backward'/>")
				el.append("<span class='addgridright glyphicon glyphicon-step-forward'/>")
				el.append("<div class='grid'/>");
				el.find(".grid").append("<div class='gridcell grid-2'/><div class='gridcell grid-2'/>");
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

	// outputs fields in display section
	build: function(field) {
		var fieldTmp = jQuery.extend(true, {}, this.defaultField);
		var fieldTmp2 = jQuery.extend(true, fieldTmp, field);
		field = fieldTmp2;

		var display = [];
		if (field.type.match('text')) {
			display.push.apply(display, ['<label class="well"><span class="title">',field.title,'</span><br /><input type="text" size="',field.fieldSize,'" value="',field.defaultvalue,'" /></label>']);
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
			display.push.apply(display, ['<label class="well"><span class="title">',field.title,'</span><br /><input type="text" name="field" value="http://" size="',field.fieldSize,'" /></label>']);
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
			display.push('<span class="typeLabel">'+field.type+'</span></div>');

			var el = jQuery('<div class="formfield ' + field.type + '"></div>').html(display.join('')).appendTo(".selected-grid");
			//var el = $(".selected-grid").html(display.join(''));
			
			var fieldData = {}
			$.extend(true, fieldData, field);

			el.data('prop', fieldData).on('click', $.proxy(this.edit, this));

			if (this.sort) {
				this.sort.sortable('destroy');
				this.sort = this.formArea.sortable(this.sortOptions);
			}

			if (field.type === 'droplist') {
				el.find('select').change(this.fixOptions);
			} else if (field.type.match('radio|check')) {
				el.find('input').click(this.fixOptions).keyup(this.fixOptions);
			} else if (field.type === 'info') {
				el.find('a').click(this.stopLink);
			}
		}
	},
	
	edit: function(el) {

		if(el.target.nodeName == 'div' && $(el.target).hasClass('formfield'))
			el = $(el.target);
		else
			el = $(el.target).parents('div.formfield');

		$('#current').removeAttr('id');
		el.attr('id', 'current');

		this.selected = el.get(0);

		this.settingsdlg.dialog("open");
		this.settingsdlg.tabs();

		this.settingsdlg.control_id = el.data('prop').id;

		console.log(el.data('prop'));
	},


	applyEdit: function(e) {
		var el = $(that.selected);
		var eMsg = [];

		el.data('prop').changed = true;

		$('#linkDisplay').css('visibility', 'hidden');

		if (el.data('prop').type.match('droplist|check|radio|maturitymatrix')) {
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
				eMsg.push('This question type requires ' + reqOptions + ' or more possible options.');
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
					var place = el.find('.typeLabel');

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

		el.data('prop').qno = this.edits.qno.val();
		el.data('prop').title = this.edits.title.val();

		this.edits.desc.val(tinyMCE.get('description').getContent());
		el.data('prop').description = this.edits.desc.val();
		el.data('prop').description = tinyMCE.get('description').getContent();
		
		el.data('prop').defaultvalue = this.edits.defaultvalue.val();

		el.data('prop').required = (this.edits.req.get(0).checked) ? 1 : 0;

		el.data('prop').displaydesc = this.edits.display.val();
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

		if(e.target.id && (e.target.id == 'apply' || e.target.id == 'apply2')) {
			$('#current').removeAttr('id');
		}
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
			console.log('del key pressed');
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
		$(this).find(".addgridleft").show();
		$(this).find(".addgridright").show();
	});

	$(document).on('mouseout', '.grid-container', function(e) {
		$(".addgridleft").hide();
		$(".addgridright").hide();
	});

	
	$(document).on('click', '.addgridleft', function(e) {
		var cellcount = $(this).parent().find(".gridcell").length;
		
		if (cellcount < 6) {
			$(this).parent().find(".gridcell").each(function() {
				$(this).removeClass();
				$(this).addClass("gridcell grid-" + parseInt(cellcount+1))
			});
			
			$(this).parent().find(".grid").prepend("<div class='gridcell grid-" + parseInt(cellcount+1) +"'/>");
		}
	});

	$(document).on('click', '.addgridright', function(e) {
		var cellcount = $(this).parent().find(".gridcell").length;

		if (cellcount < 6) {
			$(this).parent().find(".gridcell").each(function() {
				$(this).removeClass();
				$(this).addClass("gridcell grid-" + parseInt(cellcount+1))
			});
		
			$(this).parent().find(".grid").append("<div class='gridcell grid-" + parseInt(cellcount+1) +"'/>");
		}
	});
});

