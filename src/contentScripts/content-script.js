"use strict";

(() => {

    let isDarkMode;
    let databaseViewConf = {};

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


    function findBlockId(databaseView) {
        let blockIdHolder = databaseView.querySelector('.notion-collection_view_page-block');
        if (!!blockIdHolder) {
            return blockIdHolder.getAttribute('data-block-id');
        }
        return null;
    }

    function updateDataBaseViewConfiguration(databaseView) {
        let blockId = findBlockId(databaseView);
        databaseViewConf[blockId] = {"hotkeyProperty": ""};
    }

    function processPage() {
        isDarkMode = document.querySelector('.notion-dark-theme');

        let boards = document.querySelectorAll('.notion-board-view');
        if (!!boards) {
            boards.forEach(b => processBoard(b));
        }
    }

    function updateConfiguration() {
        let databaseViews = document.querySelectorAll('.notion-collection-view-body');
        if (!!databaseViews) {
            databaseViews.forEach(v => updateDataBaseViewConfiguration(v));
        }
    }


    // workaround for not finding a good event of notion rendering updated content
    window.setInterval(processPage, 50);
    // configuration does not change that often, so using longer timeout
    window.setInterval(updateConfiguration, 600);

})();