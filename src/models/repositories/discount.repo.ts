import { getSelectData, getUnSelectData } from '~/utils'
import discountModel from '../discount.model'

const getAllDiscountCodesUnSelect = async ({
  limit = 50,
  sort,
  page = 1,
  filter,
  unSelect
}: {
  limit: number
  sort: string
  page: number
  filter?: object
  unSelect: string[]
}) => {
  const skip = (page - 1) * limit
  const query = { ...filter }
  return await discountModel
    .find(query)
    .sort({ [sort]: -1 })
    .limit(limit)
    .skip(skip)
    .select(getUnSelectData(unSelect))
    .exec()
}

const getAllDiscountCodesSelect = async ({
  limit = 50,
  sort,
  page = 1,
  filter,
  select
}: {
  limit: number
  sort: string
  page: number
  filter?: object
  select: string[]
}) => {
  const skip = (page - 1) * limit
  const query = { ...filter }
  return await discountModel
    .find(query)
    .sort({ [sort]: -1 })
    .limit(limit)
    .skip(skip)
    .select(getSelectData(select))
    .exec()
}

const checkDiscountExists = async ({ filter }: { filter: object }) => await discountModel.findOne(filter).lean()

export { getAllDiscountCodesUnSelect, getAllDiscountCodesSelect, checkDiscountExists }
