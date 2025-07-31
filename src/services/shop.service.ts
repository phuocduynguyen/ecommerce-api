import shopModel from '~/models/shop.model'

const findByEmail = async ({
  email,
  select = {
    email: 1,
    password: 1,
    name: 1,
    roles: 1,
    status: 1
  }
}: {
  email: string
  select?: Record<string, 1 | 0>
}) => {
  return await shopModel.findOne({ email }).select(select).lean()
}
export { findByEmail }
