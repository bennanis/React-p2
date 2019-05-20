// @flow
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button,
    TextInput,
    StatusBar
}                           from 'react-native';
import { AuthStorage }      from "./StorageManager";

//--------LOGINSCREEN--------
export class LoginScreen extends Component<Props> {
    static navigationOptions = {
        title: 'Log in'
    };

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: null,
            data: {},
            username: "",
            pwd: ""
        };
    }

    authenticateUser = () => {
        const url = 'https://clausae-2f57.restdb.io/rest/people?q=' +
            '{"$and": [{"$or": [{"name":"' + this.state.username + '"}, {"email":"' + this.state.username + '"}]}, {"pwd": "' + this.state.pwd + '"}]}';
        console.info("Requesting : " + url);
        this.setState({ loading: true });
        fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-apikey': 'b37453b52f8afed8e54b1261b5b96eff9391a'
            }
        }).then(res => res.json())
            .then(res => {
                console.log(JSON.stringify(res));
                this.setState({
                    data: res,
                    error: res.error || null,
                    loading: false
                });

                if (!res.message && res.length > 0) { //If not an error from RESTdb
                    console.log("Valid login");
                    AuthStorage.rememberLogin(res);
                    this.props.navigation.navigate('Home');
                } else {
                    console.log("Invalid login");
                    this.setState({ error: 'The credentials are invalid. Try again.' });
                }

            })
            .catch(error => {
                this.setState({ error, loading: false });
            });
    };

    forgotPasswordHandler = () => {
        if (this.state.username !== null)
            this.props.navigation.navigate("ForgotPassword", { username: this.state.username });
        else
            this.props.navigation.navigate("ForgotPassword");
    };

    registerHandler = () => {
        if (this.state.username !== null)
            this.props.navigation.navigate("Register", { username: this.state.username, password: this.state.pwd });
        else
            this.props.navigation.navigate("Register");
    };

    render() {
        return (
            <View style={styles.loginContainer}>
                <StatusBar
                    barStyle="light-content"
                    backgroundColor="#6a51ae"
                />
                {this.state.loading &&
                <Text style={styles.loading} selectable={false}>LOADING...</Text>
                }
                {!this.state.loading &&
                <View style={styles.loginWrapper}>
                    <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Welcome hhhh!</Text>
                    <Text style={{ fontSize: 16, marginTop: 12 }}>Log in to your Clausae account to continue.</Text>
                    <TextInput
                        multiline={false}
                        blurOnSubmit={false}
                        autoCorrect={false}
                        placeholder={"Full name or e-mail"}
                        onChangeText={(username) => this.setState({ username })}
                        keyboardType={'email-address'}
                        autoFocus={true}
                        returnKeyType={"next"}
                        onSubmitEditing={() => this.refs.pwd.focus()}
                    />
                    <TextInput
                        ref={"pwd"}
                        blurOnSubmit={true}
                        multiline={false}
                        autoCorrect={false}
                        secureTextEntry={true}
                        placeholder={'Password'}
                        onChangeText={(pwd) => this.setState({ pwd })}
                        returnKeyType={"done"}
                        onSubmitEditing={() => {
                            if (this.state.username.length >= 4 && this.state.pwd.length >= 6)
                                this.authenticateUser()
                        }}
                    />
                    <Button
                        style={{ marginTop: 8 }}
                        title="Login"
                        onPress={() => this.authenticateUser()}
                        disabled={this.state.username.length < 4 || this.state.pwd.length < 6}
                    />
                    <View>
                        <Text style={styles.subLoginOptions} onPress={this.forgotPasswordHandler}>I forgot my
                            password</Text>
                        <Text style={styles.subLoginOptions} onPress={this.registerHandler}>Create a new account</Text>
                    </View>

                    {this.state.error && <Text style={styles.errorText}>{this.state.error}</Text>}
                </View>
                }
            </View>
        );
    }
}



//--------AUTHLOADINGSCREEN--------
export class AuthLoadingScreen extends Component<Props> {
    static navigationOptions = {
        title: 'Loading...'
    };

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: null,
            data: {},
            username: "",
            pwd: ""
        };
    }

    componentDidMount() {
        AuthStorage.checkLogin().then((val) => {
            console.log("AuthStorage : Login checkup returned " + val);
            if (val !== null) {
                this.props.navigation.navigate('App');
            } else {
                this.props.navigation.navigate('Auth');
            }
        });
    }

    render() {
        return (
            <View style={styles.loginContainer}>
                <Text>LOADING...</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: '#F5FCFF',

    },
    loginContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: 8,
    },
    loading: {
        textAlign: 'center',
        textAlignVertical: 'center',
        height: '100%',
        width: '100%'
    },
    loginWrapper: {
        width: '75%',
    },
    subLoginOptions: {
        marginTop: 8,
        textAlign: 'right',
        fontSize: 16,
        color: '#328df4'
    },
    formAdvice: {
        marginTop: 12,
        fontStyle: 'italic',
        color: '#909090'
    },
    errorText: {
        margin: 24,
        padding: 12,
        color: '#e21527',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#e21527',
        borderRadius: 5,
        fontWeight: 'bold'
    },
    successText: {
        margin: 24,
        padding: 12,
        color: '#388E3C',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#388E3C',
        borderRadius: 5,
        fontWeight: 'bold'
    }
});