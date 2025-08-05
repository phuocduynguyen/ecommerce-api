import { pick } from 'lodash'
const getInfoData = ({ field = [], object = {} }: { field: string[]; object: object }) => {
  return pick(object, field)
}

// ['product_name', 'product_price', 'product_quantity', 'product_type'] => { product_name: 1, product_price: 1, product_quantity: 1, product_type: 1 }
const getSelectData = (select: string[]) => {
  return Object.fromEntries(
    select.map((item) => {
      return [item, 1]
    })
  )
}

const getUnSelectData = (select: string[]) => {
  return Object.fromEntries(
    select.map((item) => {
      return [item, 0]
    })
  )
}

export { getInfoData, getSelectData,getUnSelectData }
