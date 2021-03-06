var ttc = (function() {
    const LEVEL = 3;
    var model,
    turn = false,
    endGame = true,
    valueMap = {
        O: -1,
        X: 1
    },
    cellModel = {
        create: function() {
            return { sum: 0, count: 0, items: [] }
        }
    },
    cellCollectionModel = {
        create: function(n) {
            let model = {};
            for(let i = 1; i <= n; i++) {
                model[i] = cellModel.create()
            }
            return model;
        }
    };


    return {
        init: init
    }
    
    function initializeGame() {
        var cell = cellModel.create();

        model = {
            row: cellCollectionModel.create(3),
            column: cellCollectionModel.create(3),
            digonal: cellCollectionModel.create(2)
        };
    }

    function addStep(character, row, column) {
        let pattern;
        updateModel(character, row, column);
        pattern = checkPattern(row, column);
        if(pattern) {
            markCompleted(pattern);
        }

    }
    
    function checkPattern(row, col) {
        var r = model.row[row],
            c = model.column[col],
            d1 = model.digonal[1], 
            d2 = model.digonal[2],
            sum_positive = LEVEL,
            sum_negative = -LEVEL; 
        
        endGame = true;
        
        if(r.count === LEVEL && (r.sum === sum_positive || r.sum === sum_negative)) {
            return `row-${row}`;
        }

        if(c.count === LEVEL && (c.sum === sum_positive || c.sum === sum_negative)) {
            return `column-${col}`;
        }

        if(d1.count === LEVEL && (d1.sum === sum_positive || d1.sum === sum_negative)){
            return `diagonal-1`;
        }
        if(d2.count === LEVEL && (d2.sum === sum_positive || d2.sum === sum_negative)){
            return `diagonal-2`;
        }
        endGame = false;

        return endGame;
    }

    function updateModel(character, row, column) {
        var r = model.row[row],
            c = model.column[column];

        r.sum += valueMap[character];
        r.count += 1;
        model.row[row].items[column] = valueMap[character];
        
        c.sum += valueMap[character];
        c.count += 1;
        model.column[column].items[row] = valueMap[character];

        if(row === column) {
            let d = model.digonal[1];
            d.sum += valueMap[character];
            d.count += 1;
        }

        if(Number(row) + Number(column) === 4) {
            let d = model.digonal[2];
            d.sum += valueMap[character];
            d.count += 1;
        }

    }

    function init() {
        var container = document.querySelector('.game-container');
        initializeGame();        
        container.addEventListener('click', handleClick);
        endGame = false;

    }
    
    function handleClick(event) {
        var el = event.srcElement,
            parentEl = el.parentElement,
            char = ''
        if(el.classList.contains('column')) {
            var col = el.dataset.i,
                row = parentEl.dataset.i,
                char;
            if(isEmptyCell(row, col)) {
                char = turn ? 'O' : 'X';
                turn = !turn;
                addStep(char, row, col);
                updateDom(el, char);
            }
        }
    }

    function updateDom(element, char) {
        element.innerText = char;
    }

    function isEmptyCell(row, column) {
        if(endGame || model.row[row].items[column]) {
            return false;
        }
        return true;
    }

    function markCompleted(pattern) {
        if(endGame && pattern) {
            let p = pattern.split('-'),
                patternType = p[0],
                index = p[1],
                elements = getDomCellCollection(patternType, index);
            
            elements.forEach(function(el) {
                el.classList.add('marked');
            });
        }
        
    }

    function getDomCellCollection(type, index) {
        let query = '';
        if(type === 'diagonal') {
            let qArr = [];
            if(index == 1) {
                for(let i = 1; i <= LEVEL ; i++) {
                    qArr.push(`.row[data-i="${i}"] > .column[data-i="${i}"]`);
                }

            }

            if(index == 2) {
                let j = LEVEL;
                for(let i = 1; i <= LEVEL ; i++) {
                    qArr.push(`.row[data-i="${i}"] > .column[data-i="${j--}"]`);
                }
            }
            
            query = qArr.join(',');
        } else {
            query = `.${type}[data-i="${index}"]`;
        }
        return document.querySelectorAll(query);
    }

    
})();