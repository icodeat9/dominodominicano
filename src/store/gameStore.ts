import { defineStore } from 'pinia'
import { startGame, getGame, play, draw } from '../services/gameService'
import router from '../router'
import { useUserStore } from './userStore'
import consumer from '../cable'

export const useGameStore = defineStore('game', {
  state: () => ({
    currentGame: null,
    currentHand: null,
    teamMateHand: null,
    currentPlayerAtTurn: null,
    board: [],
    widthGridSize: 100,
    heightGridSize: 75,
    center: { x: 0, y: 0 },
    tileDeck: [],
  }),
  getters: {
    playerHand: (state) => state.currentHand,
  },
  actions: {
    async get(gameId: number) {
      try {
        const userStore = useUserStore()
        const game = await getGame(gameId)
        this.initializeGameState(game, userStore.currentUser.id)
        this.listenToSocketEvents(game.current_round.id)
      } catch (error) {
        console.error('Failed to get game:', error)
      }
    },
    initializeGameState(game, userId) {
      this.currentGame = game
      this.currentHand = game.current_round.player_hands.find(
        (playerHand) => playerHand.user_id === userId,
      )
      this.teamMateHand = game.current_round.player_hands.find(
        (playerHand) => playerHand.user_id !== userId,
      )
      game.current_round.played_tiles.forEach((tile) => {
        this.removeTileFromHand(tile)
      })

      this.board = game.current_round.played_tiles

      this.calculateTilesPosition()
      this.currentPlayerAtTurn = game.current_round.current_player_at_turn
      this.tileDeck = game.current_round.drawable_tiles
    },
    listenToSocketEvents(roundId: number) {
      consumer.subscriptions.create(
        { channel: 'RoundsChannel', round_id: roundId },
        {
          received: (data) => this.handleSocketEvent(data),
        },
      )
    },
    handleSocketEvent(data) {
      if (data.action === 'play') {
        this.currentPlayerAtTurn = data.current_player_at_turn
        this.removeTileFromHand(data.tile)
      } else if (data.action === 'played_tiles_updated') {
        this.updatePlayedTiles(data.played_tiles)
      } else if (data.action === 'drawable_tiles_updated') {
        this.tileDeck = data.drawable_tiles
      }
    },
    updatePlayedTiles(playedTiles) {
      this.board = playedTiles
      this.calculateTilesPosition()
    },
    async start(tableId: number) {
      try {
        const game = await startGame(tableId)
        this.currentGame = game
        router.push({ name: 'GameTable', params: { gameId: this.currentGame.id } })
      } catch (error) {
        console.error('Failed to start game:', error)
      }
    },
    async playTile(gameId: number, tile: any, boardTile: any) {
      try {
        await play(gameId, tile, boardTile)
        this.removeTileFromHand(tile)
      } catch (error) {
        console.error('Failed to play tile:', error)
      }
    },
    async drawTile(gameId: number, tile: any) {
      try {
        await draw(gameId, tile)
        this.updateTileDeck(tile)
        this.currentHand.tiles.push(tile)
      } catch (error) {
        console.error('Failed to draw tile:', error)
      }
    },
    updateTileDeck(tile) {
      this.tileDeck = this.tileDeck.filter((t) => t.id !== tile.id)
    },
    calculateTilesPosition() {
      const offset = this.widthGridSize + 5
      const limit = 4
      const otherLimit = 3
      const centerIndex = this.board.findIndex((tile) => tile.core === true)

      const getTilePosition = (tile, index) => {
        if (tile.core) {
          return {
            x: this.center.x - this.widthGridSize / 2,
            y: this.center.y - this.heightGridSize,
          }
        }

        if (index > centerIndex) {
          return getTilePositionAfterCenter(tile, index)
        } else if (index < centerIndex) {
          return getTilePositionBeforeCenter(tile, index)
        }
      }

      const getTilePositionAfterCenter = (tile, index) => {
        const getPreviousPosition = (idx) => getTilePosition(this.board[idx], idx)
        const getPivotPosition = (idx) => getTilePosition(this.board[idx], idx)

        if (index === centerIndex + limit) {
          const previousPosition = getPreviousPosition(index - 1)
          return tile.type === 'double'
            ? { x: previousPosition.x, y: previousPosition.y + offset }
            : { x: previousPosition.x + 25, y: previousPosition.y + offset - 25 }
        }
        if (index > centerIndex + limit) {
          const pivotPosition = getPivotPosition(centerIndex + limit)
          return tile.type === 'double'
            ? {
                x: pivotPosition.x + offset * (index - centerIndex - limit),
                y: pivotPosition.y - offset + 105,
              }
            : {
                x: pivotPosition.x + offset * (index - centerIndex - limit),
                y: pivotPosition.y - offset + 105,
              }
        }
        const previousPosition = getPreviousPosition(index - 1)
        return this.board[index - 1].type === 'double'
          ? { x: previousPosition.x, y: previousPosition.y + offset - 25 }
          : { x: previousPosition.x, y: previousPosition.y + offset }
      }

      const getTilePositionBeforeCenter = (tile, index) => {
        const getPreviousPosition = (idx) => getTilePosition(this.board[idx], idx)
        const getPivotPosition = (idx) => getTilePosition(this.board[idx], idx)

        if (index === centerIndex - limit) {
          const previousPosition = getPreviousPosition(index + 1)
          return tile.type === 'double'
            ? { x: previousPosition.x, y: previousPosition.y - offset + 25 }
            : { x: previousPosition.x, y: previousPosition.y - offset }
        }
        if (index < centerIndex - limit) {
          if (index < centerIndex - limit - limit) {
            const pivotPosition = getPivotPosition(centerIndex - limit - limit)
            return {
              x: pivotPosition.x * (centerIndex - index - limit - limit),
              y: pivotPosition.y + offset,
            }
          }
          const pivotPosition = getPivotPosition(centerIndex - limit)
          return {
            x: pivotPosition.x - offset * (centerIndex - index - limit),
            y: pivotPosition.y + offset - 101,
          }
        }
        const previousPosition = getPreviousPosition(index + 1)
        return this.board[index + 1].type === 'double'
          ? { x: previousPosition.x, y: previousPosition.y - offset + 25 }
          : { x: previousPosition.x, y: previousPosition.y - offset }
      }

      this.board = this.board.map((tile, index) => {
        const position = getTilePosition(tile, index)
        const orientation = index % 2 === 0 ? 'horizontal' : 'vertical'
        return { ...tile, position, orientation }
      })
    },
    removeTileFromHand(tile) {
      if (this.currentHand) {
        this.currentHand.tiles = this.currentHand.tiles.filter((t) => t.id !== tile.id)
      }
      if (this.teamMateHand) {
        this.teamMateHand.tiles = this.teamMateHand.tiles.filter((t) => t.id !== tile.id)
      }
    },
  },
})
