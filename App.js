/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    ScrollView,
    StyleSheet
}                           from 'react-native';
import {
    createDrawerNavigator,
    createStackNavigator,
    createSwitchNavigator,
    DrawerItems,
    SafeAreaView
}                           from 'react-navigation';
import {
    HomeScreen,
    ProfileDetailsScreen,
    ProfileScreen
}                           from './src/ContentScreens';
import {
    AuthLoadingScreen,
    LoginScreen,
	RegisterScreen,

}                           from './src/AuthScreens';
import { DrawerHeader }     from "./src/CustomDrawer";

const customDrawerContentComponent = (props) => (
    <ScrollView>
        <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
            <DrawerHeader/>
            <DrawerItems {...props} />
        </SafeAreaView>
    </ScrollView>
);

const AppStack = createDrawerNavigator(
    {
        Home: HomeScreen,
		ProfileDetails: ProfileDetailsScreen,
        Profile: ProfileScreen
    },
    {
        initialRouteName: 'Home',
        navigationOptions: {
            headerStyle: {
                backgroundColor: '#328df4',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        },
        contentComponent: customDrawerContentComponent
    }
);

const AuthStack = createStackNavigator(
    {
        Login: LoginScreen,
		Register: RegisterScreen
    },
    {
        initialRouteName: 'Login',
        navigationOptions: {
            headerStyle: {
                backgroundColor: '#6a51ae',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        },
    }
);

const RootStack = createSwitchNavigator(
    {
        AuthLoading: AuthLoadingScreen,
        App: AppStack,
        Auth: AuthStack,
    },
    {
        initialRouteName: 'AuthLoading',
    }
);

export default class App extends Component {
    render() {
        return <RootStack/>;
    }
}

styles = StyleSheet.create({
    container: {
        flex: 1
    }
});