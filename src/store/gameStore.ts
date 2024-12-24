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
    playerHandState: { tiles: [] },
    board: [],
    gridSize: 60,
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
        this.currentGame = game
        this.currentHand = game.current_round.player_hands.find(
          (playerHand) => playerHand.user_id === userStore.currentUser.id,
        )
        this.teamMateHand = game.current_round.player_hands.find(
          (playerHand) => playerHand.user_id !== userStore.currentUser.id,
        )
        game.current_round.played_tiles.forEach((tile) => {
          this.removeTileFromHand(tile)
          this.addTileToBoard(tile)
        })

        this.tileDeck = game.current_round.drawable_tiles

        this.listenToSocketEvents(game.current_round.id)
      } catch (error) {
        console.error('Failed to get game:', error)
      }
    },
    listenToSocketEvents(roundId: number) {
      consumer.subscriptions.create(
        { channel: 'RoundsChannel', round_id: roundId },
        {
          received: (data) => {
            if (data.action === 'play') {
              this.removeTileFromHand(data.tile)
            } else if (data.action === 'played_tiles_updated') {
              this.board = data.played_tiles.map((tile) => {
                const orientation = data.played_tiles.length === 0 ? 'horizontal' : 'vertical'
                return { ...tile, orientation }
              })
            } else if (data.action === 'drawable_tiles_updated') {
              this.tileDeck = data.drawable_tiles
            }
          },
        },
      )
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
    async playTile(gameId: number, tile: any) {
      try {
        await play(gameId, tile)
        this.removeTileFromHand(tile)
      } catch (error) {
        console.error('Failed to play tile:', error)
      }
    },
    async drawTile(gameId: number, tile: any) {
      try {
        await draw(gameId, tile)
        this.tileDeck = this.tileDeck.filter((t) => t.id !== tile.id)
        this.currentHand.tiles.push(tile)
      } catch (error) {
        console.error('Failed to draw tile:', error)
      }
    },
    addTileToBoard(tile) {
      const lastTile = this.board.length > 0 ? this.board[this.board.length - 1] : null
      const newPosition = this.calculateNewPosition(lastTile, tile)
      const orientation = this.board.length === 0 ? 'horizontal' : 'vertical'
      this.board.push({ ...tile, position: newPosition, orientation })
    },
    calculateNewPosition(lastTile, tile) {
      return lastTile
        ? { x: lastTile.position.x, y: lastTile.position.y - this.gridSize }
        : { x: this.center.x, y: this.center.y }
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
