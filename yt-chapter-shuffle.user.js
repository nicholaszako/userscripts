// ==UserScript==
// @name        YouTube Chapter Shuffle
// @description Shuffles the chapters of a video as if they were items on a playlist.
// @namespace   https://github.com/nicholaszako
// @version     1.0.0
// @author      nicholaszako
// @match       *://www.youtube.com/*
// @run-at      document-idle
// ==/UserScript==

const anchors = new Array();
const panels = document.getElementsByTagName("ytd-engagement-panel-section-list-renderer");
let chapterPanel;

const times = new Array();
let currentTime = 0;
let totalTime;

const progressBar = document.getElementsByClassName("ytp-progress-bar")[0];
progressBar.addEventListener('DOMAttrModified', updateCurrentTime);

// Wait for chapter panel to be loaded in
function searchChapterPanel() {

  for (let i = 0; i < panels.length; i++) {
    const thisPanel = panels[i];

    if (thisPanel.getAttribute("target-id") === "engagement-panel-macro-markers-description-chapters") {
      chapterPanel = thisPanel;
      parseTimestamps();
      break;
    }

  }

  if (!chapterPanel){ setTimeout(searchChapterPanel, 100); }

}

// Find anchor elements associated each chapter and start time
function parseTimestamps() {

  const els = chapterPanel.querySelectorAll("#endpoint");

  els.forEach(function(a) {
    const thisHref = a.href;

    const thisTimeStr = thisHref.substring(thisHref.indexOf("&t=")+3, thisHref.length - 1);
    const thisTimeInt = parseInt(thisTimeStr);

    // Duplicate elements may exist
    if (!times.includes(thisTimeInt)){
      times.push(thisTimeInt);
      anchors.push(a);
    }

  })

  anchors.sort(() => Math.random() - 0.5); // Shuffle the anchors -> order to be played

}

// Keep track of time and load next chapter when current chapter is done
function updateCurrentTime() {

  if (!totalTime) {
    totalTime = parseInt(progressBar.getAttribute("aria-valuemax"));
  }

  currentTime = parseInt(progressBar.getAttribute("aria-valuenow"));

  const isInitialChapter = anchors.length === times.length && anchors.length > 0;
  const isEndOfChapter = times.includes(currentTime + 1);
  const isEndOfLastChapter =  currentTime === totalTime - 1; // Since there is no chapter that begins after the last chapter

  if (isInitialChapter || isEndOfChapter || isEndOfLastChapter) {
    const nextChapter = anchors.pop();
    nextChapter.click();
  }

}

searchChapterPanel();
