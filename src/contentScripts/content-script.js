"use strict";

(() => {

    function processBoard(board) {
        let highlightable = board.querySelectorAll('.notion-collection-item div[data-content-editable-leaf]');

        if (!!highlightable) {
            highlightable.forEach(e => {
                if (e.textContent.startsWith('==')) {
                    e.textContent = e.textContent.substring(2).trim();
                    var backgroundHolder = e.closest('.notion-page-block').firstElementChild;
                    if (!!backgroundHolder)
                        backgroundHolder.style.backgroundColor = 'rgba(191,191,190,.15)';
                }
            });
        }
    }


    function processPage() {
        let boards = document.querySelectorAll('.notion-board-view');
        if (!!boards) {
            boards.forEach(b => processBoard(b));
        }
    }


    // workaround for not finding a good event of notion rendering updated content
    window.setInterval(processPage, 50);

})();