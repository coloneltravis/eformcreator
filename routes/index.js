var express = require('express');
var router = express.Router();

var sqlite3 = require('sqlite3');



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Form editor' });
});


router.get('/forms', function(req, res, next) {

	var forms = [];
	var db = new sqlite3.Database('formsdb.db');

	db.serialize(function() {
		db.each('SELECT id, title, desc FROM forms', function(err, row) {
			forms.push( row );
		}, function(err, rows) {
			res.render('forms', { title: 'Forms', formslist: forms });
		});
	});

	db.close();
});



router.get('/formadd', function(req, res, next) {
	  res.render('formadd', { title: 'Create a Form' });
});



router.get('/formedit/:id', function(req, res, next) {

	var db = new sqlite3.Database('formsdb.db');

	var fields = [];
	var fld = {id: req.params.id, type: 'text', description: 'text field', cats: null, perm: 0};
	fields.push(fld);
	//console.log(fields);

	db.serialize(function() {
		var stmt = db.prepare('SELECT id, title, desc, formJson FROM forms WHERE id=?');
		stmt.all(req.params.id, function(err, row) {
			//console.log(row);
			//res.render('formedit', { title: 'Edit Form', formid: row.id, formtitle: row.title, formdesc: row.desc });
			res.render('formedit', { title: 'Edit Form', form: row, fields: fields });
		});
		stmt.finalize();
	});

	db.close();
});


router.post('/formsave', function(req, res, next) {

	//console.log(req.body.formJson);

	var db = new sqlite3.Database('formsdb.db');
	db.serialize(function() {
      db.run("UPDATE forms SET formJson = $json WHERE id = $id", {
          $json: req.body.formJson,
          $id: req.body.formid
      });
	});
	db.close();

	res.redirect('/forms');
});



router.get('/formview/:id', function(req, res, next) {

	var db = new sqlite3.Database('formsdb.db');

	db.serialize(function() {
		var stmt = db.prepare('SELECT id, title, desc, formJson FROM forms WHERE id=?');
		stmt.all(req.params.id, function(err, row) {

			console.log(row[0].formJson);
			var form = JSON.parse(row[0].formJson);
			console.dir(form[0].grid);
			console.dir(form[0].grid.rows);

			res.render('formview', { form: form, title: row[0].title, desc: row[0].desc });
		});
		stmt.finalize();
	});

	db.close();
});




router.get('/admin', function(req, res, next) {
	  res.render('index', { title: 'Admin' });
});



router.post('/formcreate', function(req, res, next) {

	console.log(req.body);

	var db = new sqlite3.Database('formsdb.db');
	db.serialize(function() {
		var stmt = db.prepare('INSERT INTO forms (title, desc, orgname) VALUES (?,?,?)');
		stmt.run(req.body.formtitle, req.body.formdesc, req.body.orgname);
		stmt.finalize();
	});
	db.close();

	res.redirect('/forms');
});



module.exports = router;
