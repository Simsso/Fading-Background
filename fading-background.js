function FadingBackground(element) {
	if (typeof element === 'undefined' || !element.nodeName) {
		throw Error("No valid DOM element passed");
	}

	this.element = element;

	this.helperBackground = document.createElement('div');
	this.helperBackground.className = "fading-background-helper-background";

	this.primaryBackground = document.createElement('div');
	this.primaryBackground.className = "fading-background-primary-background";

	this.element.insertBefore(this.helperBackground, this.element.firstChild);
	this.element.insertBefore(this.primaryBackground, this.element.firstChild);
}

FadingBackground.imageURLToCSSValue = function(imageURL) {
	return "url('" + imageURL + "')";
};


FadingBackground.prototype.element = null;
FadingBackground.prototype.helperBackground = null;
FadingBackground.prototype.primaryBackground = null;
FadingBackground.prototype.imageURLs = [];
FadingBackground.prototype.milliseconds = 6000;
FadingBackground.prototype.shownImageIndex = -1;

FadingBackground.prototype.preloadImages = function() {
	for (var i = 0; i < this.imageURLs.length; i++) {
		var imageURL = this.imageURLs[i];

		var div = document.createElement('div');
		div.className = 'fading-background-hidden';
		div.style.backgroundImage = FadingBackground.imageURLToCSSValue(imageURL);
		this.element.insertBefore(div, this.element.firstChild);
	}
};

FadingBackground.prototype.setImageURLs = function(stringArray) {
	if (!Array.isArray(stringArray)) {
		throw Error("Invalid argument. Argument must be an array.");
	}
	this.imageURLs = stringArray;
};

FadingBackground.prototype.getNextImageURL = function() {
	this.shownImageIndex++;
	if (this.shownImageIndex >= this.imageURLs.length) {
		this.shownImageIndex = 0;
	}
	return this.imageURLs[this.shownImageIndex];
};

FadingBackground.prototype.showNextImage = function(continueTimeout) {
	var cssValue = FadingBackground.imageURLToCSSValue(this.getNextImageURL());

	this.primaryBackground.style.backgroundImage = this.helperBackground.style.backgroundImage;
	var prevClassName = this.helperBackground.className;
	this.helperBackground.className += " fading-background-hidden";

	setTimeout(function() {
		this.helperBackground.style.backgroundImage = cssValue;
		this.helperBackground.className = prevClassName;
	}.bind(this), this.milliseconds / 2);

	if (continueTimeout) {
		setTimeout(this.showNextImage.bind(this), this.milliseconds, continueTimeout);
	}
};

FadingBackground.prototype.start = function(milliseconds) {
	if (this.imageURLs.length === 0) {
		throw Error("No image URLs set. Use method setImageURLs before starting.");
	}
	
	if (typeof milliseconds === 'number') {
		this.milliseconds = milliseconds;
	}
	else if (typeof milliseconds !== 'undefined') {
		throw Error("Invalid milliseconds argument.");
	}

	this.showNextImage(true);
};