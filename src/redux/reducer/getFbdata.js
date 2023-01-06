let initialData = {
  userList: [],
};
export default function (state = initialData, action) {
  switch (action.type) {
    case 'FB_USER_LIST': {
        // console.log(action.payload,"reducer-->")
      return {
        ...state,
        userList: action.payload,
      };
    }
    default:
      return {...state};
  }
}
