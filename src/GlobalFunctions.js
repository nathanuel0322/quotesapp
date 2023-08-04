import Globals from './GlobalValues';

export default {
    hideNavBar: (navigation) => {
        navigation.setOptions({
            tabBarStyle: {
              display: "none",
            }
        });
    },
    showNavBar: (navigation) => {
        navigation.setOptions({
            tabBarStyle: {
                display: 'flex',
                position: 'absolute',
                bottom: 25,
                left: 20,
                right: 20,
                elevation: 24,
                backgroundColor: GlobalStyles.colorSet.primary1,
                borderRadius: 25,
                height: 70,
                width: Globals.globalDimensions.width * 0.914666667,
                shadowOffset: {
                    width: 0,
                    height: 12,
                },
                shadowOpacity: 0.58,
                shadowRadius: 16.0,
                opacity: 1,
            },
        });
    }
}