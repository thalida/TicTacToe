'use strict';

angular.module('app').component('game', {
    templateUrl: './game/game.html',
    bindings: {},
    controller: function(){
        var $ctrl = this;

        $ctrl.init = function(){
            $ctrl.isGameOver = false;
            $ctrl.hasWinner = false;
            $ctrl.winner = null;

            $ctrl.boardSize = 3;
            $ctrl.board = [
                new Array(3).fill(''),
                new Array(3).fill(''),
                new Array(3).fill('')
            ];
            $ctrl.players = [
                {index: 0, icon: 'x', name: 'X'},
                {index: 1, icon: 'o', name: 'O'}
            ];
            $ctrl.totalPlayers = $ctrl.players.length;

            $ctrl.currentPlayerId = -1;
            $ctrl.setNextPlayer();
        }

        $ctrl.setNextPlayer = function(){
            $ctrl.currentPlayerId += 1;

            if( $ctrl.currentPlayerId >= $ctrl.totalPlayers ){
                $ctrl.currentPlayerId = 0;
            }

            $ctrl.currentPlayer = $ctrl.players[ $ctrl.currentPlayerId ];
        }

        $ctrl.makeMove = function( row, col ){
            $ctrl.board[row][col] = $ctrl.currentPlayer.icon;
            $ctrl.checkGame({ x: row, y: col });
            $ctrl.setNextPlayer();
        }

        $ctrl.checkGame = function( move ){
            $ctrl.isGameOver = _.every(_.flatten($ctrl.board), function(space) { return space.length > 0; });
            $ctrl.hasWinner = false;

            // http://stackoverflow.com/a/1058804
            var player = $ctrl.currentPlayer.icon;
            var col = 0;
            var row = 0;
            var diag = 0;
            var rdiag = 0;

            for( var i = 0; i < $ctrl.boardSize; i += 1 ){
                if( $ctrl.board[move.x][i] === player ){
                    col += 1;
                }
                if( $ctrl.board[i][move.y] === player ){
                    row += 1;
                }
                if( $ctrl.board[i][i] === player ){
                    diag += 1;
                }
                if( $ctrl.board[i][$ctrl.boardSize - i + 1] === player ){
                    rdiag += 1;
                }
            }

            if( [col, row, diag, rdiag].indexOf( $ctrl.boardSize ) >= 0 ){
                $ctrl.isGameOver = true;
                $ctrl.hasWinner = true;
                $ctrl.winner = $ctrl.currentPlayer;
            }
        }

        $ctrl.events = {
            onSpaceClick: function( row, col ){
                if( $ctrl.isGameOver || $ctrl.board[row][col].length > 0){
                    return;
                }

                $ctrl.makeMove( row, col );
            }
        };

        $ctrl.init();
    }
});
