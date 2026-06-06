// import { loginFailure, loginStart, loginSuccess } from "./userRedux";
import { publicRequest, userRequest } from "../requestMethods";
import { getProductsFailure,
  getProductsStart, 
  getProductsSuccess,
  deleteProductsStart,
  deleteProductsSuccess,
  deleteProductsFailure,
  updateProductsStart,
  updateProductsSuccess,
  updateProductsFailure,
  addProductsStart,
  addProductsSuccess,
  addProductsFailure
} from "./productRedux";

// export const login = async (dispatch, user) => {
//   dispatch(loginStart());
//   try {
//     const res = await publicRequest.post("/auth/login", user);
//     dispatch(loginSuccess(res.data));
//     console.log("success")
//   } catch (err) {
//     console.log("LOGIN ADMIN DISPATCH ERR")
//     dispatch(loginFailure());
//   }
// };

export const getProducts = async (dispatch) => {
  dispatch(getProductsStart())
  try{
    const res = await publicRequest.get("/products")
    dispatch(getProductsSuccess(res.data))
  }catch(err){
    dispatch(getProductsFailure())
  }
}

export const deleteProducts = async (id,dispatch) => {
  dispatch(deleteProductsStart())
  try{
    const res = await userRequest.delete(`/products/${id}`)
    dispatch(deleteProductsSuccess(id))
  }catch(err){
    dispatch(deleteProductsFailure())
  }
}
export const updateProducts = async (id,product,dispatch) => {
  dispatch(updateProductsStart())
  try{
    dispatch(updateProductsSuccess({id,product}))
  }catch(err){
    dispatch(updateProductsFailure())
  }
}

export const addProducts = async (product,dispatch) => {
  dispatch(addProductsStart())
  try{
    // console.log("api calls")
    // console.log(product)
    const res = await userRequest.post(`/products`,product)
    // console.log("res")
    // console.log(res)
    dispatch(addProductsSuccess(res.data))
  }catch(err){
    dispatch(addProductsFailure())
  }
}