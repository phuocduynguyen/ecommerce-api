import { pick } from 'lodash'
const getInfoData = ({ field = [], object = {} }: { field: string[]; object: object }) => {
  return pick(object, field)
}

export { getInfoData }
