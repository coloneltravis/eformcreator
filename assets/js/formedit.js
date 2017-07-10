


$(document).ready(function() {
	
	$(".gridcell").mouseover(function() { 
		$(this).addClass("highlight-grid");
	});

	$(".gridcell").mouseout(function() {
		$(this).removeClass("highlight-grid");
	});

	$(".gridcell").click(function() {
		$(".selected-grid").each(function() {
			$(this).removeClass("selected-grid");
		});
		$(this).addClass("selected-grid");
	});

});

