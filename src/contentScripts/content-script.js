"use strict";

(() => {

    let isDarkMode;
    let focusedDatabaseBlockId = null;
    let focusedDatabaseId = null;


    function renderCustomDividers(board) {
        let highlightable = board.querySelectorAll('.notion-collection-item div[data-content-editable-leaf]');

        if (!!highlightable) {
            highlightable.forEach(e => {
                if (e.textContent.startsWith('==')) {
                    e.textContent = e.textContent.substring(2).trim();
                    var backgroundHolder = e.closest('.notion-page-block').firstElementChild;
                    if (!!backgroundHolder) {
                        if (!isDarkMode) {
                            backgroundHolder.style.background = 'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 17px, rgba(248,245,241,1) 17px, rgba(248,245,241,1) 100%)';
                        } else {
                            backgroundHolder.style.background = '#191919';
                            // box-shadow makes the dark backdrop too blurry
                            backgroundHolder.style.boxShadow = null;
                        }
                    }
                }
            });
        }
    }

    function processBoard(board) {
        renderCustomDividers(board);
    }


    function findDbBlockId(databaseView) {
        let blockIdHolder = databaseView.querySelector('.notion-collection_view_page-block');
        if (!!blockIdHolder) {
            return blockIdHolder.getAttribute('data-block-id');
        }
        blockIdHolder = databaseView.querySelector('.notion-page-block');
        if (!!blockIdHolder) {
            return blockIdHolder.getAttribute('data-block-id');
        }
        return null;
    }

    function findParentBlockId(element) {
        let blockIdHolder = element.closest('.notion-page-block');
        if (!!blockIdHolder) {
            return blockIdHolder.getAttribute('data-block-id');
        }
        return null;
    }

    function processPage() {
        isDarkMode = document.querySelector('.notion-dark-theme');

        let boards = document.querySelectorAll('.notion-board-view');
        if (!!boards) {
            boards.forEach(b => processBoard(b));
        }
    }

    function isDbItemShortcut(key) {
        // ascii 0, 1, .. 9
        let code = key.charCodeAt(0);
        return code >= 48 && code <= 57;
    }

    function init() {
        // track block id under the mouse
        // though need also to track when element changes to outside the focusable or if there is a modal
        document.addEventListener("mousemove",
            function (e) {
                let element = document.elementFromPoint(e.clientX, e.clientY);
                if (!element || !element.closest('.notion-collection-item')) {
                    focusedDatabaseBlockId = null;
                    focusedDatabaseId = null;
                } else {
                    focusedDatabaseBlockId = findParentBlockId(element);
                    focusedDatabaseId = findDbBlockId(element.closest('.notion-collection_view_page-block'));
                    console.log(focusedDatabaseBlockId);
                    console.log(focusedDatabaseId);
                }
            });

        document.addEventListener("keydown",
            function (e) {
                if (!!focusedDatabaseBlockId && isDbItemShortcut(e.key)) {
                    chrome.runtime.sendMessage({
                        action: "hotkey",
                        value: e.key.charCodeAt(0),
                        altKey: e.altKey,
                        target: {blockId: focusedDatabaseBlockId, dbId: focusedDatabaseId}
                    });
                    console.log("hotkey action detected")
                }
            });

        // workaround for not finding a good event in notion rendering updated content
        window.setInterval(processPage, 50);
    }

    init();

})();