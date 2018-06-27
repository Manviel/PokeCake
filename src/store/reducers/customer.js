import { GET_CUSTOMERS } from '../actions/const'

const customerReducer = (state = [], { type, payload }) => {
  switch (type) {
    case GET_CUSTOMERS:
      return payload
    default:
      return state
  }
}

export default customerReducer;
