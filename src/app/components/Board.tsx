'use client'

import classNames from 'classnames'
import { useEffect, useState } from 'react'

const rules = (board: boolean[][], row: number, col: number) => {
  let cellCount = 0

  for (let r = row - 1; r < row + 2; r++) {
    for (let c = col - 1; c < col + 2; c++) {
      if (r < 0 || c < 0 || r >= board.length || c >= board.length) continue // out of bounds
      if (c === col && r === row) continue // middle cell
      if (board[r][c] === true) {
        cellCount++
      }
    }
  }

  if (board[row][col] === true) {
    return cellCount === 2 || cellCount === 3
  } else {
    return cellCount === 3
  }
}

const buildBoard = (cellNumber: number) => {
  const board = new Array(cellNumber)
    .fill(new Array(cellNumber).fill(false))
    .map((row) => row.map(() => Math.random() > 0.5))

  return board
}

export const Board = ({ cellNumber = 10 }: { cellNumber: number }) => {
  const [board, setBoard] = useState<boolean[][] | undefined>()
  const boardSize = 200
  const cellSize = boardSize / cellNumber

  // INITIALIZE BOARD
  useEffect(() => {
    setBoard(buildBoard(10))
  }, [])

  // LOOP
  useEffect(() => {
    const interval = setInterval(() => {
      setBoard((prevBoard) => {
        if (!prevBoard) return
        const newBoard = prevBoard.map((row, rowIdx) => {
          return row.map((_, cellIdx) => {
            return rules(prevBoard, rowIdx, cellIdx)
          })
        })
        return newBoard
      })
    }, 500)
    return () => clearInterval(interval)
  }, [])

  if (!board)
    return (
      <div className="flex items-center justify-center w-screen h-screen border border-red-500">
        <h1 className="text-2xl">Loading</h1>
      </div>
    )

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen gap-2 border border-red-500">
      <div className={`w-[${boardSize}px] h-[${boardSize}px]`}>
        {board.map((rows, rowIdx) => {
          return (
            <div className="flex" key={`row-${rowIdx}`}>
              {rows.map((cell, cellIdx) => {
                return (
                  <div
                    key={`cell-${cellIdx}`}
                    className={classNames(
                      `flex w-[${cellSize}px] h-[${cellSize}px] border border-white`,
                      cell && 'bg-white',
                    )}
                  ></div>
                )
              })}
            </div>
          )
        })}
      </div>
      <button
        className="px-3 py-1 bg-pink-900 rounded-lg"
        onClick={() => setBoard(buildBoard(10))}
      >
        RESET
      </button>
    </div>
  )
}
