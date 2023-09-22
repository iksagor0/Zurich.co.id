setTimeout(function() {
	var get_breadcrumb = document.querySelectorAll('.breadcrumb nav');
	var select_main = document.querySelectorAll('#content>.component');
	var title = select_main[2].querySelectorAll('.title');
	var image = select_main[0].querySelector("img");
	title[0].classList.add('breadcrumb');
	title[0].prepend(get_breadcrumb[0]);
	var description = title[0].nextElementSibling.children;
	var jumlah_desc = description.length;
	for (var i = 0; i < jumlah_desc; i++) {
		title[0].append(description[0]);
	}
	title[0].append(image);


},500)