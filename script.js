var board = []
var pieces = []
var playerChance = 1
var picked = -1
var button, player1Name, player2Name

function createBoard(){
    var div
    var arr, i, j, square
    for( i = 0 ; i < 8; i++ ){
        arr = []
        for( j = 0 ; j < 8; j++ ){
            div = document.createElement('div')
            div.setAttribute('x',i)
            div.setAttribute('y',j)
            square = {occupied :-1, element:div}
            arr.push(square)
        }
        board.push(arr)    
    }
}


function createPieces(){
    createPiece( 0, 0, 1, 'rook', 'white')
    createPiece( 0, 1, 1, 'knight', 'white')
    createPiece( 0, 2, 1, 'bishop', 'white')
    createPiece( 0, 3, 1, 'queen', 'white')
    createPiece( 0, 4, 1, 'king', 'white')
    createPiece( 0, 5, 1, 'bishop', 'white')
    createPiece( 0, 6, 1, 'knight', 'white')
    createPiece( 0, 7, 1, 'rook', 'white')

    for( i = 0 ; i < 8; i++ ){
        createPiece( 1, i, 1, 'pawn', 'white')
    }

    for( i = 0 ; i < 8; i++ ){
        createPiece( 6, i, 2, 'pawn', 'black')
    }
    
    createPiece( 7, 0, 2, 'rook', 'black')
    createPiece( 7, 1, 2, 'knight', 'black')
    createPiece( 7, 2, 2, 'bishop', 'black')
    createPiece( 7, 3, 2, 'queen', 'black')
    createPiece( 7, 4, 2, 'king', 'black')
    createPiece( 7, 5, 2, 'bishop', 'black')
    createPiece( 7, 6, 2, 'knight', 'black')
    createPiece( 7, 7, 2, 'rook', 'black')
}


function createPiece(x, y , player, type , color){
    var icon =  document.createElement('i')
    icon.setAttribute('class', 'fas fa-3x fa-chess-' + type + ' ' + color)
    icon.setAttribute('id', pieces.length)
    icon.addEventListener( 'click', pick )

    piece={
            x: x,
            y: y,
            player: player,
            element: icon,
            type: type
            }

    pieces.push(piece)
}


function renderBoard(){
    var chessDiv = document.querySelector( '.chessBoard' )
    chessDiv.textContent = ''
    var square
    for( i = 0 ; i < 8; i++ ){
        for( j = 0 ; j < 8; j++ ){
            square  = board[i][j]
            chessDiv.append( square.element )
        }
    }
}


function renderPieces(){
    console.log(pieces)
    console.log(board)
    var piece,placedSquare
    for( var i in pieces){
        piece = pieces[i]
        placedSquare = board[piece.x][piece.y]
        placedSquare.element.append( piece.element )
        placedSquare.occupied = Number(i)
    }
}


//----fuctions to claculate all the moveable positions starts here-----

function getDropCutPlaces(piece){
    var dropPlaces = []
    var cutPlaces = []
    var x,y ,type
    x = piece.x
    y = piece.y
    console.log(x,y)
    player = piece.player
    type = piece.type

    switch(type){
        case 'pawn': getPawnPlaces( x, y, player, dropPlaces, cutPlaces )
                        break

        case 'bishop': getBishopPlaces( x, y, dropPlaces, cutPlaces )
                        break

        case 'rook': getRookPlaces( x, y, dropPlaces, cutPlaces )
                        break
        
        case 'queen': getBishopPlaces( x, y, dropPlaces, cutPlaces )
                        getRookPlaces( x, y, dropPlaces, cutPlaces )
                        break

        case 'knight': getKnightPlaces( x, y, dropPlaces, cutPlaces )
                        break

        case 'king':   getKingPlaces( x, y, dropPlaces, cutPlaces )
                        break
    }
    return [dropPlaces , cutPlaces]
}


function getPawnPlaces( x, y, player, dropPlaces, cutPlaces ){
    if ( player == 1 ){
        x++
        if(x < 8 )
        {
            if ( board[x][y].occupied === -1 ){
                dropPlaces.push( { x: x, y: y } ) 
            }
            y++
            if( y < 8 && board[x][y].occupied > 15){
                cutPlaces.push( { x: x, y: y } )
            }
            y-=2
            if( y > 0 && board[x][y].occupied > 15){
                cutPlaces.push( { x: x, y: y } )
            }
        }
    }else{
        x--
        if(x >0)
        {
            if ( board[x][y].occupied === -1 ){
                dropPlaces.push( { x: x, y: y } ) 
            }
            y++
            if( y < 8 && board[x][y].occupied < 16 && board[x][y].occupied !== -1 ){
                cutPlaces.push( { x: x, y: y } )
            }
            y-=2
            if( y > 0 && board[x][y].occupied < 16  && board[x][y].occupied !== -1 ){
                cutPlaces.push( { x: x, y: y } )
            }
        }
    }
}


function getBishopPlaces( x, y, dropPlaces, cutPlaces ){
    var main_x = x
    var main_y = y
    
    x--,y--
    while( validate( x, y, dropPlaces, cutPlaces ) ){
            x--,y--
    }
    
    x = main_x
    y = main_y 
    x++,y++
    while( validate( x, y, dropPlaces, cutPlaces ) ){
            x++,y++
    }

    x = main_x
    y = main_y 
    x--,y++
    while( validate( x, y, dropPlaces, cutPlaces ) ){
            x--,y++
    }

    x = main_x
    y = main_y 
    x++,y--
    while( validate( x, y, dropPlaces, cutPlaces ) ){
            x++,y--
    }
}


function getRookPlaces( x, y, dropPlaces, cutPlaces ){
    var main_x = x
    var main_y = y
    
    y--
    while( validate( x, y, dropPlaces, cutPlaces ) ){
        y--
    }
    
    x = main_x
    y = main_y 
    x--
    while( validate( x, y, dropPlaces, cutPlaces ) ){
        x--
    }

    x = main_x
    y = main_y 
    y++
    while( validate( x, y, dropPlaces, cutPlaces ) ){
        y++
    }

    x = main_x
    y = main_y 
    x++
    while( validate( x, y, dropPlaces, cutPlaces ) ){
        x++
    }
}


function getKnightPlaces( x, y, dropPlaces, cutPlaces ){

    validate( x + 2 ,y + 1 , dropPlaces, cutPlaces )
    validate( x + 2 ,y - 1 , dropPlaces, cutPlaces )
    validate( x - 2 ,y + 1 , dropPlaces, cutPlaces )
    validate( x - 2 ,y - 1 , dropPlaces, cutPlaces )
    validate( x - 1 ,y + 2 , dropPlaces, cutPlaces )
    validate( x + 1 ,y + 2 , dropPlaces, cutPlaces )
    validate( x - 1 ,y - 2 , dropPlaces, cutPlaces )
    validate( x + 1 ,y - 2 , dropPlaces, cutPlaces )
}


function getKingPlaces( x, y, dropPlaces, cutPlaces ){

    validate( x + 1 ,y , dropPlaces, cutPlaces )
    validate( x ,y + 1 , dropPlaces, cutPlaces )
    validate( x - 1 ,y , dropPlaces, cutPlaces )
    validate( x ,y - 1 , dropPlaces, cutPlaces )
    validate( x - 1 ,y - 1 , dropPlaces, cutPlaces )
    validate( x + 1 ,y + 1 , dropPlaces, cutPlaces )
    validate( x - 1 ,y + 1 , dropPlaces, cutPlaces )
    validate( x + 1 ,y - 1 , dropPlaces, cutPlaces )

}

//validate if position is present on the board and check if occupied by other player piece
function validate( x ,y , dropPlaces, cutPlaces ){
    var square,occupiedBy
    
    if(x >= 0 && x < 8 && y >= 0 && y < 8 )
    {
        square = board[x][y]
        occupiedBy = square.occupied
        if( occupiedBy == -1 ){
            dropPlaces.push( { x: x, y: y } )
            return true
        }else{
            if( playerChance === 1 ){
                if( occupiedBy > 15 ){
                    cutPlaces.push( { x: x, y: y } )
                    return false
                }else{
                    return false
                }
            }else{
                if( occupiedBy < 16 ){
                    cutPlaces.push( { x: x, y: y } )
                    return false
                }else{
                    return false
                }
            }
        }
    }
}

//------movable position functions ends here-------


//higlights all the places where we can cut other player's piece
function activateCutPlaces(arr){
    var square, place
    for(i in arr)
    {
        place = arr[i]
        square = board [ place.x ][ place.y ].element
        square.setAttribute('class', 'cut')
        square.addEventListener('click', cut)
    }
}

//higlights all the places where we can place our piece
function activateDropPlaces(arr){
    var square, place
    for(i in arr)
    {
        place = arr[i]
        square = board [ place.x ][ place.y ].element
        square.setAttribute('class', 'drop')
        square.addEventListener('click', drop)

    }
}

//invoke higlighting functions
function pick(e){
    pieceId = Number(e.target.id)
    piece = pieces[ pieceId ]
    setAlert('')
    if(piece.player != playerChance){
        setAlert( 'You can not pick this' )
        return
    }

    clearBoard()
    picked =  pieceId
    var dropCutPlaces = getDropCutPlaces(piece)
    var dropPlaces = dropCutPlaces[0]
    var cutPlaces = dropCutPlaces[1]
    
    square = board[ piece.x ][ piece.y ]
    square.element.setAttribute('class', 'picked')
    
    activateDropPlaces(dropPlaces)
    activateCutPlaces(cutPlaces)
}

//cut the existing piece from that square with moving piece
function cut(e){
    setAlert('')
    var target = e.target
    if(target.nodeName == 'I'){
        target = target.parentNode
    }
    var dropSquareX = Number( target.getAttribute('x') )
    var dropSquareY = Number( target.getAttribute('Y') )
    
    var piece = pieces[picked]
    var pickedSquare = board[piece.x][piece.y]
    var dropSquare = board[dropSquareX][dropSquareY]
    piece.x = dropSquareX
    piece.y = dropSquareY
    
    var dropPiece = dropSquare.occupied
    dropPiece.x = dropPiece.y = -1
    dropSquare.element.textContent = ''
    
    dropSquare.occupied = picked
    dropSquare.element.append(piece.element)
    pickedSquare.occupied = -1
    
    playerChance = playerChance === 1 ? 2 : 1
    picked = -1
    setPlayerChance()
    clearBoard()
}

//drop the moving piece to a square
function drop(e){
    setAlert('')
    var target = e.target
    var dropSquareX = Number( target.getAttribute('x') )
    var dropSquareY = Number( target.getAttribute('Y') )
    var piece = pieces[picked]
    var pickedSquare = board[piece.x][piece.y]
    var dropSquare = board[dropSquareX][dropSquareY]
    
    piece.x = dropSquareX
    piece.y = dropSquareY
    

    dropSquare.occupied = picked
    dropSquare.element.append(piece.element)
    pickedSquare.occupied = -1
    
    playerChance = playerChance === 1 ? 2 : 1
    picked = -1
    setPlayerChance()
    clearBoard()
}


//clear event listner and classes of chess board divs
function clearBoard(){
    for( i = 0 ; i < 8; i++ ){
        for( j = 0 ; j < 8; j++ ){
            square  = board[i][j]
            square.element.removeAttribute('class')
            square.element.removeEventListener('click', drop)
            square.element.removeEventListener('click',cut)
        }
    }
}


function setAlert( txt ){
    var playerChanceDiv = document.querySelector('.alert')
    playerChanceDiv.textContent = txt
}


function setPlayerChance(){
    var playerChanceDiv = document.querySelector('.playerChance')
    playerChanceDiv.textContent = (playerChance == 1 ? player1Name : player2Name) + ' Chance'
}


function startMatch(){
    var p1Input = document.getElementById('p1')
    var p2Input = document.getElementById('p2')
    player1Name = p1Input.value
    player2Name = p2Input.value
    p1Input.remove()
    p2Input.remove()
    
    button.removeEventListener('click', startMatch)
    button.textContent = 'Reset Match'
    button.addEventListener('click', reset)

    createPieces()
    renderPieces()
    setPlayerChance()
}


function reset(){
    board = []
    pieces = []
    playerChance = 1
    createBoard()
    renderBoard()
    createPieces()
    renderPieces()
    setPlayerChance()
}

    
window.addEventListener('load',function(){
    button = document.getElementById('button')
    button.addEventListener('click', startMatch)
    createBoard()
    renderBoard()
    
})