var board = []
var pieces = []
var playerChance = 1
var picked = -1
var undoMove
var button, player1Name, player2Name, undoButton

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
    var piece,placedSquare
    for( var i in pieces){
        piece = pieces[i]
        placedSquare = board[piece.x][piece.y]
        placedSquare.element.append( piece.element )
        placedSquare.occupied = Number(i)
    }
}


//----functions to calculate all the moveable positions starts here-----

function getDropCutPlaces(piece){
    var dropPlaces = []
    var cutPlaces = []
    var x,y ,type
    x = piece.x
    y = piece.y
    type = piece.type

    switch(type){
        case 'pawn': getPawnPlaces( x, y, dropPlaces, cutPlaces )
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


function getPawnPlaces( x, y, dropPlaces, cutPlaces ){
    var occupiedBy
    var player = playerChance

    if ( player == 1 ){
        x++
        occupiedBy = board[x][y].occupied
        if(x < 8 )
        {

            if ( occupiedBy === -1 ){
                dropPlaces.push( { x: x, y: y } ) 
            }
            y++
            if( y < 8 && isPlayer2Piece( board[x][y].occupied ) ){
                cutPlaces.push( { x: x, y: y } )
            }
            y-=2
            if( y > 0 && isPlayer2Piece( board[x][y].occupied ) ){
                cutPlaces.push( { x: x, y: y } )
            }
        }
    }else{
        x--
        occupiedBy = board[x][y].occupied
        if(x >0)
        {
            if ( occupiedBy === -1 ){
                dropPlaces.push( { x: x, y: y } ) 
            }
            y++
            if( y < 8 && isPlayer1Piece( board[x][y].occupied ) ){
                cutPlaces.push( { x: x, y: y } )
            }
            y-=2
            if( y > 0 && isPlayer1Piece( board[x][y].occupied ) ){
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
                if( isPlayer2Piece( occupiedBy ) ){
                    cutPlaces.push( { x: x, y: y } )
                    return false
                }else{
                    return false
                }
            }else{
                if( isPlayer1Piece( occupiedBy ) ){
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


function isPlayer1Piece( pieceId ){
    return pieceId < 16 && pieceId > -1
}


function isPlayer2Piece( pieceId ){
    return pieceId > 15
}

function occupiedById( x, y ){
    return board[x][y].occupied
}

//--future feature
function isKingInDanger( KingPlayer ){
    // var kingPosX, kingPosY
    // if ( KingPlayer == 1 )
    // {
    //     pieces
    // }

    // if 
}

//highlights all the places where we can cut other player's piece
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

//highlights all the places where we can place our piece
function activateDropPlaces(arr){
    var square, place
    for(i in arr){
        place = arr[i]
        square = board [ place.x ][ place.y ].element
        square.setAttribute('class', 'drop')
        square.addEventListener('click', drop)
    }
}

//invoke highlighting functions
function pick(e){
    pieceId = Number(e.target.id)
    piece = pieces[ pieceId ]
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
    var target = e.target
    if(target.nodeName == 'I'){
        target = target.parentNode
    }
    var dropSquareX = Number( target.getAttribute('x') )
    var dropSquareY = Number( target.getAttribute('Y') )
    
    var piece = pieces[picked]
    var pickedSquare = board[piece.x][piece.y]
    var dropSquare = board[dropSquareX][dropSquareY]
    var dropPiece = pieces[dropSquare.occupied]
    
    undoMove = {
                    pickedSquare: pickedSquare,
                    dropSquare: dropSquare,
                    pickedSquareCord: [piece.x, piece.y],
                    dropSquareCord: [dropSquareX, dropSquareY],
                    pickedPiece: piece,
                    cutPiece: dropPiece
                }

    piece.x = dropSquareX
    piece.y = dropSquareY
    
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
    var target = e.target
    var dropSquareX = Number( target.getAttribute('x') )
    var dropSquareY = Number( target.getAttribute('Y') )
    var piece = pieces[picked]
    var pickedSquare = board[piece.x][piece.y]
    var dropSquare = board[dropSquareX][dropSquareY]
    
    undoMove = {
                pickedSquare: pickedSquare,
                dropSquare: dropSquare,
                pickedSquareCord: [piece.x, piece.y],
                dropSquareCord: [dropSquareX, dropSquareY],
                pickedPiece: piece,
                cutPiece: null
               }
    
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

//clear event listener and classes of chess board divs
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
    setTimeout( clearAlert, 1500 )
}


function clearAlert(){
    var playerChanceDiv = document.querySelector('.alert')
    playerChanceDiv.textContent = ''
}


function setPlayerChance(){
    var playerChanceDiv = document.querySelector('.playerChance')
    playerChanceDiv.textContent = (playerChance == 1 ? player1Name : player2Name) + ' Chance'
}


function startMatch(){
    var p1Input = document.getElementById('p1')
    var p2Input = document.getElementById('p2')
    var statsDiv = p1.parentNode
    undoButton = document.createElement('button')
    undoButton.textContent = 'Undo'
    undoButton.addEventListener('click', undo)

    statsDiv.append( undoButton )
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


function undo(){
    if(!undoMove){
        setAlert('No moves to undo')
        return
    }
    
    var pickedSquare = undoMove.pickedSquare
    var pickedPiece = undoMove.pickedPiece
    var pickedSquareCord = undoMove.pickedSquareCord
    var pickedPieceId = Number( pickedPiece.element.id ) 

    var dropSquare = undoMove.dropSquare
    var dropSquareCord = undoMove.dropSquareCord
    var cutPiece = undoMove.cutPiece
    var cutPieceId = -1
    
    pickedSquare.element.append( pickedPiece.element )
    pickedPiece.x = pickedSquareCord[0]
    pickedPiece.y = pickedSquareCord[1]
    pickedSquare.occupied = pickedPieceId
    
    if(cutPiece){
        cutPieceId = Number( cutPiece.element.id )
        dropSquare.element.append( cutPiece.element )
        cutPiece.x = dropSquareCord[0]
        cutPiece.y = dropSquareCord[1]
    }
    dropSquare.occupied = cutPieceId

    playerChance = playerChance === 1 ? 2 : 1
    setPlayerChance()
    undoMove = null


}


function reset(){
    board = []
    pieces = []
    playerChance = 1
    undoMove = null
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