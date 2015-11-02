//var baseUrl = 'http://localhost:65220/';
var baseUrl = 'https://www.citethisforme.com/';

$(function () {
		
	// load any previously saved setting
	chrome.storage.sync.get(function(value){
		if (value.style !== undefined) {
			$('.styles li a').removeClass('selected');
			$('a[data-style="'+value.style+'"]').addClass('selected');
		}
		
		citeCurrentPage();
	});	
	
	chrome.runtime.onMessage.addListener(function(message) {
		if (message.type === "tbsHighlightedText"){
			$('.quote-wrapper textarea').val(message.content);
		}
	});
	
	$(document).on('click', '.close-btn', function() {
		chrome.runtime.sendMessage({
			type: 'bgToggleFrame',
			content: 'toggleFrame'
		});
	});
		
	$(document).on('click', '.styles li a', function () {
		$('.styles li a').removeClass('selected');
		var $selectedStyle = $(this);		
		$selectedStyle.addClass('selected');
		
		var selectedStyle = $selectedStyle.data('style');
		
		// save it for the future
		chrome.storage.sync.set({'style': selectedStyle});

		citeCurrentPage();
	});	
	
	$(document).on('click', '.selectable', function() {
        $(this).selectText();
    });
	
	$('#bib-form').on('submit', function(e) {	
		e.preventDefault();
		
		var addToBibliographyJsString = 'javascript:var form = document.createElement("form");form.setAttribute("method", "post");form.setAttribute("action", "'+baseUrl+'cite/website/autocite");var urlField = document.createElement("input");urlField.setAttribute("type", "hidden");urlField.setAttribute("name", "autociteUrl");urlField.setAttribute("value", "'+$('#Url').val()+'");form.appendChild(urlField);var quoteField = document.createElement("input");quoteField.setAttribute("type", "hidden");quoteField.setAttribute("name", "quote");quoteField.setAttribute("value", "'+$('#Quote').val()+'");form.appendChild(quoteField);document.body.appendChild(form);form.submit();';
		chrome.runtime.sendMessage({type:'bgOpenUrl', content: addToBibliographyJsString});
	});
});

function getWebsiteNameFromUrl(url) {
	url = url.replace('http://', '').replace('https://', '').replace('www.', '').replace(/\/.*/g, '');
	
	return url.charAt(0).toUpperCase() + url.slice(1);
}

function toggleError () {
	$('#spinner').hide(0, function () {
		$('#failed-wrapper').show(0);
	});
}

function citeCurrentPage() {
	$('#result-wrapper').hide(0); // hide existing citation
	$('#failed-wrapper').hide(0); // hide any error messages too

	var style = $('.styles .selected').data('style');
	var date = new Date();
	accessedOnDay = date.getDate();
	accessedOnMonth = date.getMonth() + 1; // +1 because .getMonth() is zero based
	accessedOnYear = date.getFullYear();	

	chrome.runtime.sendMessage({type: 'bgGetUrl'}, function(response) {
		var urlToCite = response;
		// check to make sure we're not on a Chrome options page
		var chromePage = urlToCite.indexOf('chrome://');
		if (chromePage !== -1)
		{
			toggleError();
			return;
		}
		
		// or the chrome extensions gallery (this can't be injected into)
		var extensionsPage = urlToCite.indexOf('chrome.google.com/webstore');
		if (extensionsPage !== -1)
		{
			toggleError();
			return;
		}

		$('#spinner').show(0, function () {
			$.ajax({
				url: baseUrl+'api/autocite/website?url='+encodeURIComponent(urlToCite)+'&style='+style,						
				success: function(data) {
					if (data.status === 'ok') {
					// populate the visible area
					$('.authorName').text(data.author);
					$('.sourceType').html(data.sourceType);
					$('.referenceString').html(data.referenceString);
					$('#Url').val(urlToCite);
					
					// Then show it
					$('#spinner').hide(0, function () {
						$('#result-wrapper').fadeIn('slow');
					});
					}
					else {
						toggleError();
					}
				},
				error: function(e) {
					toggleError();
				}
			});
		});	
		
	});
}