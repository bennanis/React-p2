import React, { Component } from 'react';
import { AsyncStorage }     from 'react-native';

String.prototype.hashCode = () => {
    let hash = 0;
    if (this.length === 0) {
        return hash;
    }
    for (let i = 0; i < this.length; i++) {
        let char = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
};

export class Storage extends Component {
    static clear() {
        AsyncStorage.multiRemove(['userData', 'login_expiration'])
            .then(() => console.log("Storage : Cleared succesfully."));
    }
}

export class AuthStorage extends Component {
    static rememberLogin = async (userData) => {
        try {
            await AsyncStorage.setItem('userData', JSON.stringify(userData));
        } catch (error) {
            console.error("Could not store login info : " + error);
        }
        try {
            let targetDate = new Date();
            targetDate.setDate(targetDate.getDate() + 30);
            await AsyncStorage.setItem('login_expiration', targetDate);
        } catch (error) {
            console.error("Could not store login info : " + error);
        }
    };

    static checkLogin = async () => {
        try {
            const userData = await AsyncStorage.getItem('userData');
            const loginExp = new Date(await AsyncStorage.getItem('login_expiration'));
            if (userData !== null) { // We have data
                //console.log('AuthStorage : User logged in: '+userData);
                //console.log('AuthStorage : Login expires at '+loginExp.toDateString());
                if (loginExp < new Date()) {
                    console.log('AuthStorage : Login expired');
                    this.clear();
                    return null;
                }
                return JSON.parse(userData)[0];
            } else {
                console.log('AuthStorage : No user login ');
                return null;
            }
        } catch (error) {
            console.error("AuthStorage : Login lookup failed");
        }
    };

    static clear() {
        AsyncStorage.multiRemove(['userData', 'login_expiration'])
            .then(() => console.log("AuthStorage : Cleared succesfully."));
    }

    render() {
        return null;
    }
}