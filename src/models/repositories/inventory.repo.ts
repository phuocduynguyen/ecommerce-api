import { Types } from 'mongoose'
import inventoryModel from '../inventory.model'

interface InventoryInput {
  inven_productId: Types.ObjectId
  inven_location?: string
  inven_stock: number
  inven_shopId: Types.ObjectId
}

const insertInventory = async ({ payload }: { payload: InventoryInput }) => {
  const newInventory = await inventoryModel.create(payload)
  return newInventory
}

export { insertInventory }
