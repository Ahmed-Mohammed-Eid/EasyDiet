import { configureStore } from '@reduxjs/toolkit'
import {createWrapper} from "next-redux-wrapper";
// SLICES
import layoutSlice from "@/redux/slices/Admin/layout-slice";
import mealsSlice from "@/redux/slices/Admin/meals-slice";
import packagesSlice from "@/redux/slices/Admin/packages-slice";
import usersSlice from "@/redux/slices/Admin/users-slice";
import createmealSlice from "@/redux/slices/Admin/createmeal-slice";
import editMealSlice from "@/redux/slices/Admin/editmeal-slice";
import createpackageSlice from "@/redux/slices/Admin/createpackage-slice";
import editPackageSlice from "@/redux/slices/Admin/editpackage-slice";
import editCustompackageSlice from "@/redux/slices/Admin/editCustompackage-slice";
import createEmployeeSlice from "@/redux/slices/Admin/createEmployee-slice";
import editEmployeeSlice from "@/redux/slices/Admin/editEmployee-slice";
import createUserSlice from "@/redux/slices/Admin/createUser-slice";
import branchManager from "@/redux/slices/Admin/branchManager-slice";
import defaultMealsSlice from "@/redux/slices/Admin/defaultmeals_slice";
import customPackagesMealsSlice from "@/redux/slices/Admin/custom_packages_meals_slice";
//USER
import packages from "@/redux/slices/user/packages";
import menuSlice from "@/redux/slices/user/menu";
import subscriptionSlice from "@/redux/slices/user/subscription_info";
import dayMealsSlice from "@/redux/slices/user/daymeals_slice";
import profileSlice from "@/redux/slices/user/profile_slice";
import nutrition_specialistSlice from "@/redux/slices/user/nutritionspecialist_slice";
// AUTH
import resetPasswordSlice from "@/redux/slices/Auth/resetPasswordSlice";
// GLOBAL
import homeSlice from "@/redux/slices/user/home-slice";

export const store = configureStore({
    reducer: {
        // GLOBAL
        [homeSlice.name]: homeSlice.reducer,
        // ADMIN
        [layoutSlice.name]: layoutSlice.reducer,
        [packagesSlice.name]: packagesSlice.reducer,
        [mealsSlice.name]: mealsSlice.reducer,
        [usersSlice.name]: usersSlice.reducer,
        [createmealSlice.name]: createmealSlice.reducer,
        [editMealSlice.name]: editMealSlice.reducer,
        [createpackageSlice.name]: createpackageSlice.reducer,
        [editPackageSlice.name]: editPackageSlice.reducer,
        [editCustompackageSlice.name]: editCustompackageSlice.reducer,
        [createEmployeeSlice.name]: createEmployeeSlice.reducer,
        [editEmployeeSlice.name]: editEmployeeSlice.reducer,
        [createUserSlice.name]: createUserSlice.reducer,
        [branchManager.name]: branchManager.reducer,
        [defaultMealsSlice.name]: defaultMealsSlice.reducer,
        [customPackagesMealsSlice.name]: customPackagesMealsSlice.reducer,
        //USER
        [packages.name]: packages.reducer,
        [menuSlice.name]: menuSlice.reducer,
        [subscriptionSlice.name]: subscriptionSlice.reducer,
        [dayMealsSlice.name]: dayMealsSlice.reducer,
        [profileSlice.name]: profileSlice.reducer,
        [nutrition_specialistSlice.name]: nutrition_specialistSlice.reducer,
        // AUTH
        [resetPasswordSlice.name]: resetPasswordSlice.reducer,
    },
})

const makeStore = () => store
const wrapper = createWrapper(makeStore)

export default wrapper
