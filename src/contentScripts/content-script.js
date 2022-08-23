"use strict";

(() => {

    let isDarkMode;

    function processBoard(board) {
        let highlightable = board.querySelectorAll('.notion-collection-item div[data-content-editable-leaf]');

        if (!!highlightable) {
            highlightable.forEach(e => {
                if (e.textContent.startsWith('==')) {
                    e.textContent = e.textContent.substring(2).trim();
                    var backgroundHolder = e.closest('.notion-page-block').firstElementChild;
                    if (!!backgroundHolder) {
                        if (!isDarkMode) {
                            backgroundHolder.style.background = 'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 17px, rgba(248,245,241,1) 17px, rgba(248,245,241,1) 100%)';
                        }
                        else {
                            backgroundHolder.style.background = '#191919';
                            // box-shadow makes the dark backdrop too blurry
                            backgroundHolder.style.boxShadow = null;
                        }
                    }
                }
            });
        }
    }


    function processPage() {
        isDarkMode = document.querySelector('.notion-dark-theme');

        let boards = document.querySelectorAll('.notion-board-view');
        if (!!boards) {
            boards.forEach(b => processBoard(b));
        }
    }


    // workaround for not finding a good event of notion rendering updated content
    window.setInterval(processPage, 50);

})();