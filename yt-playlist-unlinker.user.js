// ==UserScript==
// @name        YouTube Playlist Unlinker
// @description Replaces YouTube links in playlist with new links that aren't attached to the original playlist when clicking on thumbnail.
// @namespace   https://github.com/nicholaszako
// @version     1.0.0
// @author      nicholaszako
// @match       *://www.youtube.com/playlist?list=*
// @run-at      document-idle
// ==/UserScript==

// MutationObserver needed needed to cut links live, as thumbnails are loaded.
const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      // If the added node is an anchor with the ytd-thumbnail class, cut the link
      if (node.nodeName === "A" && node.classList.contains("ytd-thumbnail")) {
        cutLink(node);
      }
    });
  });
});

// Start observing the document for changes
observer.observe(document, { childList: true, subtree: true });

function cutLink(e) {
  const link = e.href
  e.href = link.substr(0, link.indexOf("&list"))
}
