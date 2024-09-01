import {createSlice} from "@reduxjs/toolkit";

//Initial Value
const initialValue = {
    bundleId: '',
    name: '',
    nameEn: '',
    textOnCard: '',
    textOnCardEn: '',
    realTime: '',
    packagePrice: '',
    numberOfMeals: '',
    numberOfSnacks: '',
    offerDays: '',
    fridayIncluded: false,
    packageMeals: [],
    breakfast: false,
    lunch: false,
    dinner: false,
    stopThePackage: false,
};

const editPackageSlice = createSlice({
    name: 'edit_package',
    initialState: initialValue,
    reducers: {
        onInputChange: (state, action) => {
            state[action.payload.key] = action.payload.value
        },
        onMealChecked: (state, action) => {
            // GET COPY OF MEALS
            const packageMealsCopy = [...state.packageMeals];
            let isMealExist = false;
            // CHECK IF THE MEAL EXIST
            if (packageMealsCopy.length > 0) {
                packageMealsCopy.forEach((cur) => {
                    if (cur === action.payload.id) {
                        isMealExist = true;
                        // Remove it from the Array
                        const indexOfItem = packageMealsCopy.indexOf(action.payload.id);
                        packageMealsCopy.splice(indexOfItem, 1);
                        //Reset the State
                        state.packageMeals = packageMealsCopy;
                    }
                })
            }
            // Add the meal id if it's not exist
            if(isMealExist === false){
                packageMealsCopy.push(action.payload.id);
                state.packageMeals = packageMealsCopy
            }
        },
        onSelectAll: (state, action) => {
            // GET THE MEALS IDS
            state.packageMeals = action.payload.mealIds;
            // GET A COPY OF THE MEALS IDS
            const packageMealsCopy = [...state.packageMeals];
            // MERGE THE MEALS IDS WITH THE MEALS IDS OF THE PACKAGE
            action.payload.mealIds.forEach((cur) => {
                if (packageMealsCopy.indexOf(cur) === -1) {
                    packageMealsCopy.push(cur);
                }
            });

            // UPDATE THE STATE
            state.packageMeals = packageMealsCopy;
        },
        onUnSelectAll: (state, action) => {
            // Update the state
            state.packageMeals = [];
        },
        setAll: (state, action) => {
            state.bundleId = action.payload.bundleId;
            state.name = action.payload.name;
            state.nameEn = action.payload.nameEn;
            state.textOnCard = action.payload.textOnCard;
            state.textOnCardEn = action.payload.textOnCardEn;
            state.realTime = action.payload.realTime;
            state.packagePrice = action.payload.packagePrice;
            state.numberOfMeals = action.payload.numberOfMeals;
            state.numberOfSnacks = action.payload.numberOfSnacks;
            state.offerDays = action.payload.offerDays;
            state.fridayIncluded = action.payload.fridayIncluded;
            state.packageMeals = action.payload.packageMeals;
            state.breakfast = action.payload.breakfast;
            state.lunch = action.payload.lunch;
            state.dinner = action.payload.dinner;
            state.stopThePackage = action.payload.stopThePackage;
        },
        clearAll: (state) => {
            state.name = '';
            state.nameEn = '';
            state.textOnCard = '';
            state.textOnCardEn = '';
            state.realTime = '';
            state.packagePrice = '';
            state.numberOfMeals = '';
            state.numberOfSnacks = '';
            state.offerDays = '';
            state.fridayIncluded = false;
            state.packageMeals = [];
            state.breakfast = false;
            state.lunch = false;
            state.dinner = false;
            state.stopThePackage = false;
        }
    },
})


export const {onInputChange, clearAll, onMealChecked, setAll, onSelectAll, onUnSelectAll} = editPackageSlice.actions;
export default editPackageSlice;