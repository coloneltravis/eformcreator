function escapeHtml(str) {
    return String(str)
 //       .replace(/&/g, "&amp;")
 //       .replace(/</g, "&lt;")
 //       .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
 //       .replace(/'/g, "&#039;")
 //       .replace(/\//g, "&#x2F;")
};


Array.prototype.remove = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};


var dialog, up; //, usefallback;

var FormBuilder = {
	initialize: function(json, formArea) {

		that = this;

		this.formArea = $(formArea);
		this.moveId = null;
		this.selected = null;
		this.leaving = false; // Tells the difference between leaving and leaving via the cancel button
		this.defaultTitles = {
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

		// 1 - value, 3 - id, 5 - type, 7 - checked, 9 - popup id
		this.newLevel = ['<input type="text" name="option" size="25" value="',
		                 '',   				// value
		                 '" id="opt_',
		                 '0',				// id
		                 '" /><input type="',
		                 '' ,				// type
		                 '" name="optSelect" title="Default this option" ',
		                 '',				// checkit
		                 ' /> <a href="#" class="popup_',
		                 '0',				// popup id
		                 '"><span class="glyphicon glyphicon-info-sign ',
		                 'matrixinfo-clean',  // status of popup icon
		                 '" aria-hidden="true"></span></a>'];

		// 1 - value, 3 - id, 5 - name
		this.newExtraInfo = ['<input type="hidden" value="',
		                     '',   				// value
		                     '" id="extrainfo_',
		                     '0',
		                     '" name="extrainfo_',
		                     '0',				// name
		                     '" />'];

		// 1 - value, 3 - id, 5 - name
		this.newExamples = ['<input type="hidden" value="',
		                     '',   				// value
		                     '" id="examples_',
		                     '0',				// id
		                     '" name="examples_',
		                     '0',				// name
		                     '" />'];

		this.radioSet = 0;
		//var form = jQuery.parseJSON(json);
		var form = json;

		jQuery.each(form, function(i, val) {

			val.perm = val.perm.split(',').remove('');
			val.cats = val.cats.split(',').remove('');
			val.changed = false;
			that.build(val);
		});

		this.sortOptions = {};
		this.sort = this.formArea.sortable(this.sortOptions);

		this.ed = {
			'opt': $('#options_label'),
			'fieldSize': $('#size_label'),
			'req': $('#required_label'),
			'hidenum': $('#hidenumber_label'),
			'perm': $('#perm_label'),
			'cats': $('#cats_label'),
			'desc': $('#description_label'),
			'def': $('#defaultvalue_label')
		};

		/*for (f in this.ed) {
			this.ed[f].$eff = new Fx.Slide(this.ed[f], {transition: Fx.Transitions.Circ.easeInOut});
		}*/

		this.edits = {
			'id': $('#recordid'),
			'qno' : $('#qno'),
			'title': $('#title'),
			'desc': $('#description'),
			'display': $('#displayselect'),
			'options': $('#options_label ol'),
			'req': $('#required'),
			'hidenum': $('#hidenumber'),
			'fieldSize': $('#size'),
			'cats': $('#cats'),
			'permAll': $('#all'),
			'permGroups': $('#perm'),
			'defaultvalue': $('#defaultvalue')
		};
		//this.ip = $('#inputForm');
		//this.ip.$eff = this.ip.effect('padding-top');
		this.bound = {
			'fields': this.addField.bind(this),
			'applyEdit': this.applyEdit.bind(this),
			'copyEdit': this.copyEdit.bind(this),
			'deleteEdit': this.deleteEdit.bind(this),
			'editOption': this.editOption.bind(this),
			'save': this.save.bind(this),
			'clear': this.clear.bind(this),
			'cancel': this.cancel.bind(this),
			'going': this.going.bind(this),
			'linkInsert': this.linkInsert.bind(this),
			'deleteForm': this.deleteForm.bind(this)
		};
		$('#actionForm button').click(this.bound.fields);
		$('#apply, #apply2').click(this.bound.applyEdit);
		$('#clone, #clone2').click(this.bound.copyEdit);
		$('#delete, #delete2').click(this.bound.deleteEdit);
		$('#options_label').click(this.bound.editOption);
		$('#save').click(this.bound.save);
		$('#clear').click(this.bound.clear);
		$('#cancelButton').click(this.bound.cancel);
		$('#all').click(this.togglePerm);
		$('#header a').click(this.bound.going);
		$('#linkDialog').click(this.linkShow);
		$('#linkCancel').click(this.linkHide);
		$('#linkInsert').click(this.bound.linkInsert);
		//$('#formLinks').change(this.updateSecs);
		if ($('#deleteButton')) $('#deleteButton').click(this.bound.deleteForm);
		//$('#formLinks').get(0).selectedIndex = 0;
		if ($('#relative')) $('#relative').change(this.checkRelative);
		$('#tab3, #tab4').on('change', 'input:text, select, textarea', this.bound.applyEdit);
		//$('#tab3, #tab4').on('change', 'input:text, select, textarea', this.bound.applyEdit);
		//$('#tab3, #tab4').on('click', 'input:checkbox, input:radio', this.bound.applyEdit);

		$('#sectionButton').tab('show');
		return this;
	},

	checkRelative: function(e) {
		var ele = $('#relative option:selected').get(0);
		if (ele.title == '0') {
			$('#pos_sub').get(0).checked = true;
			$('#pos_next').get(0).parentNode.style.display = 'none';
		} else {
			$('#pos_next').get(0).parentNode.style.display = '';
		}
	},

	deleteForm: function(e) {
		e.preventDefault();
		if (confirm('Are you sure you want to delete this whole section?')) {
			$('#action').val('Delete');
			this.leaving = true;
			$('#sectionForm').submit();
		}
	},

	togglePerm: function() {
		/*var perms = $('#all').get(0).checked;
		if (perms) {
			$('#perm').selectedIndex = -1;
		}
		$('#perm').disabled = perms;*/
	},

	linkShow: function(e) {
		e.preventDefault();
		$('#linkTitle').val('');
		$('#linkDisplay').css('visibility', 'visible');
	},

	updateSecs: function(e) {
		var formId = $('#formLinks').val();
		if (formId > 0) {
			$('#secLinks').get(0).disabled = true;
			$('#linkInsert').get(0).disabled = true;
			var jr = new Json.Remote('/ajax/sections.cfm', {
				method: 'get',
				onComplete: function(sections) {
					var secs = $('secLinks');
					secs.options.length = 1;
					for (var row = 0; row < sections.records.recordcount; row++) {
						secs.options[row+1] = new Option(sections.records.data.treestructure[row] + ' ' + sections.records.data.title[row], sections.records.data.id[row]);
					}
					$('#secLinks').get(0).disabled = false;
					$('#linkInsert').get(0).disabled = false;
				}
			}).send({'formId': formId});
		}
	},

	linkInsert: function(e) {
		e = new Event(e).stop();
		var eMsg = [];
		$ES('.error', $('linkDisplay')).removeClass('error');
		if ($('linkTitle').value.length == 0) {
			$('linkTitle').addClass('error');
			eMsg.push('Links require title text.');
		}
		if ($('formLinks').value == 0) {
			$('formLinks').addClass('error');
			eMsg.push('Please make sure you select a form.');
		}
		if (eMsg.length > 0) {
			eMsg.push('The link has NOT been created.');
			alert(eMsg.join('\n\n'));
		} else {
			link = ['<a target="_blank" href="form.cfm?form=',$('#formLinks').val()];
			if ($('secLinks').value > 0) link.push.apply(link, ['&amp;section=',$('#secLinks').val()]);
			if (!$('navLinks').checked) link.push('&amp;nav=false');
			link.push.apply(link, ['">',$('#linkTitle').val(),'</a>']);
			$('#description').val($('#description').val() + link.join(''));
			$('#linkDisplay').css('visibility', 'hidden');
		}
	},

	linkHide: function(e) {
		e.preventDefault();
		$('#linkDisplay').css('visibility', 'hidden');
	},

	// handles updates to field details in left side panel
	edit: function(el) {
		if(el.target.nodeName == 'LI' && $(el.target).hasClass('question'))
			el = $(el.target);
		else
			el = $(el.target).parents('li.question');

		$('#current').removeAttr('id');
		el.attr('id', 'current');

		this.selected = el.get(0);

		if (this.moveId) clearTimeout(this.moveId);
		$('.error').removeClass('error');
		$('#linkDisplay').css('visibility', 'hidden');
		$('#editButton, #edit2Button').css('visibility', 'visible');

		$('#editButton').tab('show');
		//this.tabber.open('tab3');

		var maturityMatrix = false;
		if (el.data('prop').type == 'maturitymatrix') maturityMatrix = true;

		var optType = (el.data('prop').type == 'check') ? 'checkbox' : 'radio';
		var checkit, newOpt, itemid;
		this.edits.options.html('');
		jQuery.each(el.data('prop').options, function(i, item) {
			checkit = (item.selected || item.checked) ? 'checked="checked"' : '';
			// 1 - value, 3 - id, 5 - type, 7 - checked

			if (!maturityMatrix) newOpt = that.newOption.slice();
			else newOpt = that.newLevel.slice();

			newOpt[1] = item.value;	newOpt[3] = item.id;
			newOpt[5] = optType;	newOpt[7] = checkit;

			if (maturityMatrix) {
				if (item.id == 0) itemid = i;
				else itemid = item.id;

				newOpt[9] = itemid;
				newOpt[11] = 'matrixinfo-clean';

				if (item.extrainfo || item.examples) {
					if ((item.extrainfo.length > 0) || (item.examples.length > 0)) newOpt[11] = 'matrixinfo-dirty';
					else newOpt[11] = 'matrixinfo-clean';
				}

				var newExtraInfo = that.newExtraInfo.slice();
				newExtraInfo[1] = "";
				newExtraInfo[3] = itemid;
				newExtraInfo[5] = itemid;

				var newExamples = that.newExamples.slice();
				newExamples[1] = "";
				newExamples[3] = itemid;
				newExamples[5] = itemid;

				$('<li>' + newOpt.join('') + newExtraInfo.join('') + newExamples.join('') + '</li>').appendTo(that.edits.options);
				$('#build #extrainfo_' + itemid).get(0).value = item.extrainfo || '';
				$('#build #examples_' + itemid).get(0).value = item.examples || '';
			}
			else $('<li>' + newOpt.join('') + '</li>').appendTo(that.edits.options);
		});


		if (el.data('prop').type.match('(text|url|phone|number|email)')) {
			this.ed.opt.hide();
			this.ed.fieldSize.show();
			this.ed.def.show();
		} else if (el.data('prop').type == 'area') {
			this.ed.opt.hide();
			this.ed.fieldSize.show();
			this.ed.def.hide();
		} else if (el.data('prop').type.match('(radio|check|droplist|maturitymatrix)')) {
			this.ed.def.hide();
			if (el.data('prop').type == 'droplist') this.ed.fieldSize.show();
			else this.ed.fieldSize.hide();

			this.ed.opt.show();
			if (el.data('prop').type == 'maturitymatrix') this.ed.opt.find('a#options_add').hide();
			else this.ed.opt.find('a#options_add').show();


		} else if (el.data('prop').type.match('(break|info)')) {
			this.ed.def.hide();
			this.ed.cats.hide();
			this.ed.opt.hide();
			this.ed.fieldSize.hide();
			this.ed.req.hide();
			this.ed.hidenum.hide();
			this.ed.perm.hide();
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
			this.ed.hidenum.show();
			this.ed.perm.show();
			this.ed.cats.show();
		}
		// Load field properties
		this.edits.id.val(el.data('prop').id);
		this.edits.qno.val(el.data('prop').qno);
		this.edits.title.val(el.data('prop').title);
		this.edits.defaultvalue.val(el.data('prop').defaultvalue);

	
		this.edits.desc.val(el.data('prop').description);
		if (tinyMCE.initialized) tinyMCE.get('description').setContent(el.data('prop').description);

		this.edits.req.get(0).checked = (el.data('prop').required == 1) ? true : false;
		//this.edits.hidenum.get(0).checked = (el.data('prop').hidenumber == 1) ? true : false;
		//this.edits.permAll.get(0).checked = (el.data('prop').perm.indexOf('0') != -1) ? true : false;
		this.edits.display.find('option').each(function() {
			this.selected = (this.value == el.data('prop').displaydesc);
		});
		this.edits.fieldSize.find('option').each(function() {
			this.selected = (this.value == el.data('prop').fieldSize);
		});
		this.edits.cats.find('option').each(function() {
			this.selected = (el.data('prop').cats.indexOf(this.value) != -1);
		});
		this.edits.permGroups.find('option').each(function() {
			this.selected = (el.data('prop').perm.indexOf(this.value) != -1);
		});
		this.togglePerm();

		if (maturityMatrix) liveLinks();

		//tinyMCE.get('title').setContent(this.edits.title.val());
		tinyMCE.get('description').setContent(this.edits.desc.val());
	},



	applyEdit: function(e) {
		//e.preventDefault();
		var el = $(that.selected);
		var eMsg = [];
		el.data('prop').changed = true;
		$('.error').removeClass('error');
		$('#linkDisplay').css('visibility', 'hidden');

		/*if (this.edits.title.val().length > 500) {
			this.edits.title.addClass('error');
			eMsg.push('Question text must not be more than 500 characters (currently ' + this.edits.title.val().length + '.');
		}*/

		if (el.data('prop').type.match('droplist|check|radio|maturitymatrix')) {
			var matrix = (el.data('prop').type == 'maturitymatrix') ? true : false;
			var optType = (el.data('prop').type == 'check') ? 'checkbox' : 'radio';
			var options = this.edits.options.find('li');
			var opts = [];
			var text = [];

			options.each(function() {
				ip = $(this).find('input[type=text]');

				if (matrix) {
					var h1 = $(this).find('input[name^=extrainfo_]');
					var h2 = $(this).find('input[name^=examples_]');

					opts.push({
						'selected': $(this).find('input[type='+optType+']').get(0).checked,
						'value': ip.val(),
						'id': ip.attr('id').split('_')[1],
						'extrainfo': h1.val(),
						'examples': h2.val()
					});
				}
				else {
					opts.push({
						'selected': $(this).find('input[type='+optType+']').get(0).checked,
						'value': ip.val(),
						'id': ip.attr('id').split('_')[1]
					});
				}
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

						//if (el.data('prop').type == 'maturitymatrix') {
						//	hidden1 = ['<input type="hidden" id="extrainfo_',optid,'" name="extrainfo_',optid,'" value="', opt.extrainfo, '" />'];
						//	hidden2 = ['<input type="hidden" id="examples_',optid,'" name="examples_',optid,'" value="', opt.examples, '" />'];
						//	place.before($('<div>' + newOpts.join('') + hidden1.join('') + hidden2.join('') + '</div>'));
						//}
						//else
						place.before($('<div>' + newOpts.join('') + '</div>'));
					});

					//if (el.data('prop').type == 'maturitymatrix') {
					//	place.before(['<div class="areagroup"><label>Key Strengths<br/><textarea name="field" id="field" cols="20" rows="3"></textarea></label><br /><label>Constraints<br/><textarea name="field" id="field" cols="20" rows="3"></textarea></label><br /><label>Actions<br/><textarea name="field" id="field" cols="20" rows="3"></textarea></label></div>'].join(''));
					//}
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

		//this.edits.title.val(tinyMCE.get('title').getContent());
		el.data('prop').title = this.edits.title.val();
		//el.data('prop').title = tinyMCE.get('title').getContent();

		this.edits.desc.val(tinyMCE.get('description').getContent());
		el.data('prop').description = this.edits.desc.val();
		el.data('prop').description = tinyMCE.get('description').getContent();
		
		el.data('prop').defaultvalue = this.edits.defaultvalue.val();

		el.data('prop').required = (this.edits.req.get(0).checked) ? 1 : 0;
		//el.data('prop').hidenumber = (this.edits.hidenum.get(0).checked) ? 1 : 0;

		/*if (this.edits.permAll.get(0).checked) {
			el.data('prop').perm = ['0'];
		} else {
			el.data('prop').perm = [];
			$.each(this.edits.permGroups.find('option'), function(idx, item) {
				if (item.selected) el.data('prop').perm.push(item.value);
			});
		}*/

		el.data('prop').displaydesc = this.edits.display.val();
		el.data('prop').fieldSize = this.edits.fieldSize.val();
		//el.data('prop').cats = [];

		/*$.each(this.edits.cats.find('option'), function(idx, item) {
			if (item.selected) el.data('prop').cats.push(item.value);
		});*/

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
			$('#fieldButton').tab('show');
			$('#editButton, #edit2Button').css('visibility', 'hidden');
			$('#current').removeAttr('id');
		}

		//this.tabber.open('tab2');
	},

	copyEdit: function(e) {
		e.preventDefault();
		if (confirm('Are you sure you want to copy this item?')) {
			var el = $(this.selected).clone(true, true);

			var data = {};
			$.extend(data, el.data('prop'), true);
			el.data('prop', data);

			el.first().attr('id', '');
			el.wrap('<li class=" + this.selected.className + "></li>');
			$(that.selected).after(el);

			el.data('prop').id = 0;

			/*if (el.data('prop').type === 'droplist') {
				el.find('select').on('change', this.fixSelect);
			}*/

			this.sort.sortable('destroy');
			this.sort = this.formArea.sortable(this.sortOptions);
		}
	},

	deleteEdit: function(e) {
		e.preventDefault();
		if (confirm('Are you sure you want to delete this item?')) {
			this.sort.sortable('destroy');
			$(that.selected).remove();

			$('#fieldButton').tab('show');
			//this.tabber.open('tab2');

			$('#editButton, #edit2Button').css('visibility', 'hidden');
			this.sort = this.formArea.sortable(this.sortOptions);
		}
	},

	editOption: function(e) {
		var el = e.target;
		if (el.nodeName == 'A') {
			e.preventDefault();
			if (el.id == 'options_add') {
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

	addField: function(e) {
		e.preventDefault();
		var type = e.target.id.slice(3);
		var fieldTmp = jQuery.extend(true, {}, this.defaultField);
		var field = jQuery.extend(true, fieldTmp, {
			'type': type,
			'title': this.defaultTitles[type]
		});
		if (type.match('droplist|radio|check')) {
			field.options = [
				{'selected': false, 'id': 0, 'value': 'Options 1'},
				{'selected': false, 'id': 0, 'value': 'Options 2'},
				{'selected': false, 'id': 0, 'value': 'Options 3'}
			]
		}
		if (type.match('maturitymatrix')) {
			field.options = [
				{'selected': false, 'id': 0, 'value': 'Level 0'},
				{'selected': false, 'id': 0, 'value': 'Level 1'},
				{'selected': false, 'id': 0, 'value': 'Level 2'},
				{'selected': false, 'id': 0, 'value': 'Level 3'},
				{'selected': false, 'id': 0, 'value': 'Level 4'},
				{'selected': false, 'id': 0, 'value': 'Level 5'},
			]
		}
		this.build(field);

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
		} else if (field.type === 'maturitymatrix') {
			display.push.apply(display, ['<span class="title">',field.title,'</span><br />']);

			var typ = 'radio';
			jQuery.each(field.options, function(o, opt) {
				display.push.apply(display, ['<div><label class="well"><input type="',typ,'" name="field_',that.radioSet,'" value="',o,'" title="',opt.value,'" ']);
				if (opt.selected) display.push('checked="checked"');
				display.push.apply(display, [' /> ',opt.value,'</label>']);

				//console.log(opt);
				//display.push.apply(display, ['<input type="hidden" id="extrainfo_',opt.id,'" name="extrainfo_',opt.id,'" value="',opt.extrainfo,'" />']);
				//display.push.apply(display, ['<input type="hidden" id="examples_',opt.id,'" name="examples_',opt.id,'" value="',opt.examples,'" /> </div>']);
				display.push.apply(display, ['</div>']);
			});
			this.radioSet += 1;

			//display.push.apply(display, ['<div class="areagroup"><label>Key Strengths<br/><textarea name="field" id="field" cols="',field.fieldSize,'" rows="',field.rows,'"></textarea></label><br /><label>Constraints<br/><textarea name="field" id="field" cols="',field.fieldSize,'" rows="',field.rows,'"></textarea></label><br /><label>Actions<br/><textarea name="field" id="field" cols="',field.fieldSize,'" rows="',field.rows,'"></textarea></label></div>']);
		}

		if (display.length > 0) {
			display.unshift('<div class="field">');
			display.push('<span class="typeLabel">'+field.type+'</span></div>');
			var el = jQuery('<li class="question ' + field.type + '"></li>').html(display.join('')).appendTo(this.formArea);

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

	stopLink: function(e) {
		e.preventDefault();
	},

	// Because there's no easy way of stopping the user using selects or even radio/checkboxes without disabling them, we'll catch the events and reset their selected/checked status.
	fixOptions: function(e) {
		var el = $(e.target).parents('li');

		if (el.data('prop').type == 'droplist') {
			jQuery.each(el.data('prop').options, function(index, item) {
				if (item.selected) e.target.selectedIndex = index;
			});
		} else {
			jQuery.each(el.data('prop').options, function(index, item) {
				if (e.target.title == item.value) e.target.checked = item.selected;
			});
		}
	},

	buildSave: function() {
		section = [];
		$('#formList > li').each(function() {
			if ($(this).data('prop').cats)
				$(this).data('prop').cats = $(this).data('prop').cats.join(',');

			if ($(this).data('prop').perm)
				$(this).data('prop').perm = $(this).data('prop').perm.join(',');

			section.push($(this).data('prop'));
		});
		$('#sectionJson').val(JSON.stringify(section));
	},

	clear: function(e) {
		e.preventDefault();
		if (confirm('Are you sure you want to clear this whole section?')) {
			this.sort.sortable('destroy');
			//$('#build').setStyle('padding-top', 0);
			$('#formList').empty();
			this.sort = this.formArea.sortable(this.sortOptions);
		}
	},

	going: function(e) {
		if (!this.leaving) {
			while (e.target.nodeName != 'A') {
				e.target = e.target.parentNode;
			}
			var loc = e.target.href;
			if (window.location.href.split('#')[0] != loc.split('#')[0]) {
				if (confirm('Warning: You are navigating away from this page.\nAny changes you\'ve made will be lost.\n\nClick - OK - To save changes\n\nClick - Cancel - To NOT save changes')) {
					e.preventDefault();
					this.save();
				}
			}
		}
	},

	save: function(e) {
		if (e) e.preventDefault();
		var eMsg = [];

		$('#sectionButton').tab('show');

		$('.error').removeClass('error');
		if ($('#sectionTitle').val().length > 250 || $('#sectionTitle').val().length < 3) {
			$('#sectionTitle').addClass('error');
			eMsg.push('Section title must be between 3 and 250 characters (currently ' + $('#sectionTitle').val().length + ').');
		}
		if ($('#sectionTitle').val().length > 2000) {
			$('#sectionTitle').addClass('error');
			eMsg.push('Section description must be between 3 and 250 characters (currently ' + $('#sectionTitle').val().length + ').');
		}
		if (eMsg.length > 0) {
			eMsg.push('Changes have NOT been saved.');
			alert(eMsg.join('\n\n'));
		} else {
			this.buildSave();
			this.leaving = true;
			$('#sectionForm').submit();
		}
	},

	cancel: function(e) {
		if (confirm("Are you sure you want to cancel changes to this section?\n\nAll changes will be lost.")) {
			this.leaving = true;
			window.location.href = 'formEdit.cfm?formId=' + $('#formId').val();
		}
	}
};


var saveMaturityInfo = function(e) {

	e.preventDefault();

	$('.maturityinfo,.mce-content-body').each(function() {
		var areaid = $(this).attr('id').split('_')[1];
		//alert(areaid);

		/*if (tinyMCE.get('additionalInfo_' + areaid) && tinyMCE.get('exampleEvidence_' + areaid)) {
			$('#additionalInfo_' + areaid).html( tinyMCE.get('additionalInfo_' + areaid).getContent() );
			$('#exampleEvidence_' + areaid).html( tinyMCE.get('exampleEvidence_' + areaid).getContent() );
		}*/
		console.log(tinyMCE.get('additionalInfo_' + areaid).getContent());
		console.log(escapeHtml(tinyMCE.get('additionalInfo_' + areaid).getContent()));

		$('#extrainfo_' + areaid).get(0).value = tinyMCE.get('additionalInfo_' + areaid).getContent();
		$('#examples_' + areaid).get(0).value =  tinyMCE.get('exampleEvidence_' + areaid).getContent();
		console.log($('#extrainfo_' + areaid).val());

		if (($('#extrainfo_' + areaid).val() != '') || ($('#examples_' + areaid).val() != '')) {
			$('.popup_' + areaid).children('span').removeClass('matrixinfo-clean');
			$('.popup_' + areaid).children('span').addClass('matrixinfo-dirty');
		}
		else {
			$('.popup_' + areaid).children('span').removeClass('matrixinfo-dirty');
			$('.popup_' + areaid).children('span').addClass('matrixinfo-clean');
		}
	});

	$('#maturityModal').modal('hide');
	that.applyEdit(e);
}


var updateMaturityInfo = function(itemid) {
	$('#additionalInfo_' + itemid).val( $('#extrainfo_' + itemid).val() );
	$('#exampleEvidence_' + itemid).val( $('#examples_' + itemid).val() );

		var toolbar1 = [
			   			 "fontsizeselect | bold italic underline strikethrough | subscript superscript",
				   		 "undo redo | forecolor backcolor | bullist numlist | link unlink | charmap"
			   		   ];


		tinymce.init({selector: "textarea[name^=additionalInfo]",
		   body_id: "additionalInfo",
		   plugins: "link charmap textcolor paste",
		   content_css: "/css/bootstrap.css",
		   toolbar: toolbar1,
		   width:550, height:150,
		   entity_encoding: "named",
		   menubar: false,
		   forced_root_block : 'p',
		   init_instance_callback: function (editor) {
			   $(editor.getContainer()).find(".mce-path").css("visibility", "hidden");
			   editor.on('change', function(e) {builder.applyEdit(e);});
		   }
		});

		tinymce.init({selector: "textarea[name^=exampleEvidence]",
		   body_id: "exampleEvidence",
		   plugins: "link charmap textcolor paste",
		   content_css: "/css/bootstrap.css",
		   toolbar: toolbar1,
		   width:550, height:150,
		   entity_encoding: "named",
		   menubar: false,
		   forced_root_block : 'p',
		   init_instance_callback: function (editor) {
			   $(editor.getContainer()).find(".mce-path").css("visibility", "hidden");
			   editor.on('change', function(e) {builder.applyEdit(e);});
		   }
		});

		$(document).on('focusin', function(e) {
		    if ($(e.target).closest(".mce-window").length) {
		        e.stopImmediatePropagation();
		    }
		});
}


var liveLinks = function(e) {
	$('a[class^=popup_]').on('click', function(e){
		e.preventDefault();

		if(e.target.nodeName == 'A') {
			el = $(e.target);
		} else {
			el = $(e.target).parents('a');
		}

		var itemid = el.attr('class').split('_')[1];

		tinyMCE.remove('.maturityinfo');
		$('#maturityModal').modal();
		$('.modal-body').load('/ajax/maturityPopup.cfm?itemid=' + itemid, function() {updateMaturityInfo(itemid); });

		$('#savematurityinfo').on('click', function(e) {saveMaturityInfo(e);} );
	});
}


var addRTE = function() {
	var toolbar1 = [ "bold italic underline strikethrough | superscript subscript | charmap",
			   		  "fontsizeselect | forecolor backcolor | bullist numlist | link unlink | undo redo | code" ];

	tinyMCE.init({selector: "textarea[name^=description]",
		   body_id: "descRTE",
		   content_css: "/css/bootstrap.css",
		   plugins: "link charmap textcolor paste code",
       paste_use_dialog : false,
       paste_auto_cleanup_on_paste : true,
       paste_convert_headers_to_strong : false,
       paste_strip_class_attributes : "all",
       paste_remove_spans : true,
       paste_remove_styles : true,
       paste_retain_style_properties : "",
		   toolbar: toolbar1,
		   menubar: false,
		   forced_root_block: 'p',
		   entity_encoding: "named",
		   //onchange_callback: builder.applyEdit,
		   init_instance_callback: function (editor) {
			   $(editor.getContainer()).find(".mce-path").css("visibility", "hidden");
			   editor.on('change', function(e) {builder.applyEdit(e);});
		   }
		});
}

var builder;

var MoveNav = function(e) {
	var col = $('#build');
	var p = col.position();
	var pad = parseInt(col.css('padding-top'), 10);
	var bodyPad = parseInt($('body').css('padding-top'), 10);
	var padTop = p.top + pad;
	var boxPos = $('#content').position();
	var fBottom = $('#formBox').position().top + $('#formBox').get(0).offsetHeight;
	var w = {top: $(window).scrollTop()};
	w.bottom = w.top + $(window).height();
	shift = null;
	if (w.top + bodyPad < p.top) shift = 0;
	else if (w.top + bodyPad >= fBottom) shift = fBottom - p.top;
	else if (w.top + bodyPad > padTop && w.bottom > w.top + col.height() - pad) shift = w.top + bodyPad - p.top;
	else if (w.top + bodyPad <= padTop) shift = w.top + bodyPad - p.top;
	else if (w.bottom > p.bottom) shift = pad + (w.bottom - p.bottom);
	if (shift != null) col.css('padding-top', shift.toString() + 'px');
};


$(document).ready(function() {
	if (!Array.prototype.indexOf) {
	    Array.prototype.indexOf = function(val) {
	        return jQuery.inArray(val, this);
	    };
	}

	builder = FormBuilder.initialize($('#formJSON').val(), '#formlist');
	addRTE();

	//$(window).on('scroll', MoveNav).on('resize', MoveNav);
	/*$(document).on('focusin', function(e) {
		if ($(e.target).closest(".mce-window").length) {
        	e.stopImmediatePropagation();
    	}
	});*/
	//MoveNav();

	/* $('#build').affix({
		  offset: {
		    top: 10,
		    bottom: function () {
		      return (this.bottom = $('#build').outerHeight(true))
		    }
		  }
	}); */

	$('#tabs').tabs();
});
