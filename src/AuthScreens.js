// @flow
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button,
    TextInput,
    StatusBar
} from 'react-native';
import { AuthStorage } from "./StorageManager";

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
                'x-apikey': 'HIDDEN_API'
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
                        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Welcome ! !</Text>
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

//--------FORGOTPASSWORDSCREEN--------
export class ForgotPasswordScreen extends Component<Props> {
    static navigationOptions = {
        title: 'Password recovery'
    };

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: "",
            success: "",
            data: {},
            username: this.props.navigation.getParam("username", "")
        };
    }

    resetPassword = () => {
        let url = 'https://clausae-2f57.restdb.io/rest/people?q=' +
            '{"$or": [{"name":"' + this.state.username + '"}, {"email":"' + this.state.username + '"}]}';
        this.setState({ loading: true });
        console.info("Requesting " + url);
        fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-apikey': 'HIDDEN_API'
            }
        }).then(res => res.json())
            .then(res => {
                console.log("Lookup response : " + JSON.stringify(res));
                if (!res.message && Object.keys(res).length > 0) { //If not an error from RESTdb
                    console.log("FP : The account exists");
                    res = res[0];
                    url = 'https://api.sendgrid.com/v3/mail/send';
                    fetch(url, {
                        method: 'POST',
                        headers: {
                            Authorization: 'Bearer HIDDEN_API',
                            Accept: 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            "personalizations": [{
                                "to": [{
                                    "email": res.email,
                                    "name": res.name
                                }], "subject": "Clausae - Password recovery"
                            }],
                            "from": { "email": "noreply@clausae.com", "name": "Do Not Reply" },
                            "reply_to": { "email": "sam.smith@example.com", "name": "Sam Smith" },
                            "content": [{ "type": "text/plain", "value": "Here is your new password xxxxx." }]
                        })
                    }).then(res => {
                        console.log("Mail POST request returned : " + JSON.stringify(res));
                        if (res.ok)
                            this.setState({ success: "The email has been sent." });
                        else
                            this.setState({ error: "The email service encountered an issue." });
                    }, res => {
                        console.log("Mail POST request failed : " + JSON.stringify(res));
                        this.setState({ error: "A connection problem occurred." });
                    });
                } else {
                    console.log("Invalid username/email");
                    this.setState({ error: "Your credentials are invalid." });
                }

                this.setState({
                    data: res,
                    loading: false,
                    username: ""
                });
            })
            .catch(error => {
                this.setState({ error, loading: false });
            });
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
                        {this.state.error.length > 0 && <Text style={styles.errorText}>{this.state.error}</Text>}
                        {this.state.success.length > 0 && <Text style={styles.successText}>{this.state.success}</Text>}
                        <Text style={{ fontSize: 16 }}>We will send you an e-mail with your new password so you can access
                        you account.</Text>
                        <TextInput
                            blurOnSubmit={false}
                            multiline={false}
                            autoCorrect={false}
                            value={this.state.username}
                            keyboardType={"email-address"}
                            placeholder={'Full name or e-mail'}
                            onChangeText={(username) => this.setState({ username })}
                            autoFocus={true}
                            returnKeyType={"done"}
                            onSubmitEditing={() => {
                                if (this.state.username.length >= 4)
                                    this.resetPassword()
                            }}
                        />
                        <Button
                            style={{ marginTop: 8 }}
                            title="Send me a password"
                            onPress={() => this.resetPassword()}
                            disabled={this.state.username.length < 4}
                        />
                        <Text style={styles.formAdvice}>
                            If you still can't access your account, feel free to contact our support at support@clausae.com
                            for further assitance.
                    </Text>
                    </View>
                }
            </View>
        );
    }
}


//--------REGISTERSCREEN--------
export class RegisterScreen extends Component<Props> {
    static navigationOptions = {
        title: 'Register'
    };

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: "",
            data: {},
            username: this.props.navigation.getParam("username", ""),
            email: "",
            pwd: "",
            pwd2: ""
        };
    }

    registerUser = () => {
        const url = 'https://clausae-2f57.restdb.io/rest/people';
        this.setState({ loading: true });
        fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-apikey': 'HIDDEN_API'
            },
            body: JSON.stringify({
                name: this.state.username,
                pwd: this.state.pwd,
                email: this.state.email,
                avatar: '../img/default-avatar.gif'
            })
        }).then(res => res.json())
            .then(res => {
                console.log(JSON.stringify(res));
                this.setState({
                    data: res,
                    loading: false
                });
                console.log("res.message=" + res.message + ", res.length=" + Object.keys(res).length);
                if (!res.message && Object.keys(res).length > 0) { //If not an error from RESTdb
                    console.log("Valid registration");
                    //AuthStorage.rememberLogin(res);
                    //this.props.navigation.navigate('Home');
                } else {
                    console.log("Invalid registration");
                    let listOfErrors = "There is some issues with your data :\n";
                    for (let err of res.list)
                        listOfErrors += err.message[0] + '\n';

                    this.setState({ error: listOfErrors });
                }

            })
            .catch(error => {
                this.setState({ error, loading: false });
            });
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
                        {this.state.error.length > 0 && <Text style={styles.errorText}>{this.state.error}</Text>}
                        <Text style={{ fontSize: 16 }}>Fill in this form to create your new Clausae account.</Text>
                        <TextInput
                            multiline={false}
                            blurOnSubmit={false}
                            autoCorrect={false}
                            value={this.state.username}
                            placeholder={"Full name (also your public username)"}
                            onChangeText={(username) => this.setState({ username })}
                            keyboardType={'email-address'}
                            autoFocus={true}
                            returnKeyType={"next"}
                            onSubmitEditing={() => this.refs.email.focus()}
                        />
                        <TextInput
                            ref={"email"}
                            blurOnSubmit={false}
                            multiline={false}
                            autoCorrect={false}
                            placeholder={"E-mail"}
                            onChangeText={(email) => this.setState({ email })}
                            keyboardType={'email-address'}
                            returnKeyType={"next"}
                            onSubmitEditing={() => this.refs.pwd.focus()}
                        />
                        <TextInput
                            ref={"pwd"}
                            blurOnSubmit={false}
                            multiline={false}
                            autoCorrect={false}
                            secureTextEntry={true}
                            placeholder={'Password'}
                            onChangeText={(pwd) => this.setState({ pwd })}
                            returnKeyType={"next"}
                            onSubmitEditing={() => this.refs.pwd2.focus()}
                        />
                        <TextInput
                            ref={"pwd2"}
                            blurOnSubmit={true}
                            multiline={false}
                            autoCorrect={false}
                            secureTextEntry={true}
                            placeholder={'Repeat your password'}
                            onChangeText={(pwd2) => this.setState({ pwd2 })}
                            returnKeyType={"done"}
                            onSubmitEditing={() => {
                                if (this.state.username.length >= 4
                                    && this.state.pwd.length >= 6
                                    && this.state.pwd2.length >= 6
                                    && this.state.email.length >= 9)
                                    this.registerUser()
                            }}
                        />
                        <Button
                            style={{ marginTop: 8 }}
                            title="Create my account"
                            onPress={() => this.registerUser()}
                            disabled={this.state.username.length < 4
                                || this.state.pwd.length < 6
                                || this.state.pwd2.length < 6
                                || this.state.email.length < 9}
                        />
                        <Text style={styles.formAdvice}>
                            Ensure that :{'\n'}
                            -Your full name is at least 4 characters{'\n'}
                            -Your e-mail is at least 9 characters{'\n'}
                            -Your password is at least 6 characters{'\n'}
                            -Both password fields are the same{'\n'}
                        </Text>
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
