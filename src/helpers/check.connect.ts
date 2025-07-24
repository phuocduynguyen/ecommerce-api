'use strict'
import mongoose from 'mongoose'

const countConnections = () => {
  const numberOfConnections = mongoose.connections.length
  console.log(`Number of active MongoDB connections: ${numberOfConnections}`)
}

const checkOverloadedConnections = () => {
  const maxConnections = 5 // Example threshold
  const currentConnections = mongoose.connections.length
  if (currentConnections > maxConnections) {
    console.warn(
      `Warning: Current connections (${currentConnections}) exceed the maximum threshold (${maxConnections})`
    )
  } else {
    console.log(`Current connections (${currentConnections}) are within the acceptable range.`)
  }
}

export { countConnections, checkOverloadedConnections }
