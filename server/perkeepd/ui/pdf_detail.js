/*
Copyright 2019 The Perkeep Authors

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

	http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

goog.provide('cam.PdfDetail');

// Renders PDFs. This matches files with a "mimeType" of "application/pdf",
// and displays them by embedding the PDF in an iframe.
//
// It would be easy to extend this to any content that browsers know how
// to render themselves.
cam.PdfDetail = React.createClass({
	displayName: 'PdfDetail',

	propTypes: {
		height: React.PropTypes.number.isRequired,
		resolvedMeta: React.PropTypes.object.isRequired,
		width: React.PropTypes.number.isRequired,
	},

	render: function() {
		var rm = this.props.resolvedMeta;
		var downloadUrl = goog.string.subs(
			'%s%s/%s?inline=1',
			goog.global.CAMLISTORE_CONFIG.downloadHelper,
			rm.blobRef,
			rm.file.fileName
		);
		return React.DOM.iframe({
			src: downloadUrl,
			style: {
				width: this.props.width,
				height: this.props.height,
				border: 'none',
			},
		});
	},
});

cam.PdfDetail.getAspect = function(blobref, searchSession) {
	if(!blobref) {
		return null;
	}

	var rm = searchSession.getResolvedMeta(blobref);
	var pm = searchSession.getMeta(blobref);

	if (!pm) {
		return null;
	}

	if (pm.camliType != 'permanode') {
		pm = null;
	}


	if(rm.camliType !== 'file' || rm.file.mimeType !== 'application/pdf') {
		return null;
	}

	return {
		fragment: 'document',
		title: 'Document',
		createContent: function(size, backwardPiggy) {
			return React.createElement(cam.PdfDetail, {
				resolvedMeta: rm,
				height: size.height,
				width: size.width,
			})
		},
	}
}
