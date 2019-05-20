/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component }                                                      from 'react';
import { ActivityIndicator, FlatList, Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import { AuthStorage }                                                           from "./StorageManager";
import { ActionButton, Header }                                                  from './UI';
import { CardWithNav }                                                           from "./Card";

//--------PROFILEDETAILSSCREEN--------
export class ProfileDetailsScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('name', 'Profile'),
            drawerLabel: () => null
        };
    };

    constructor(props) {
        super(props);
    }

    render() {
        const owner = this.props.navigation.getParam('owner', null);
        const nav = this.props.navigation;
        const props = this.props;
        return (
            <View style={styles.profileContainer}>
                {console.log(JSON.stringify(owner))}
                <StatusBar
                    barStyle="light-content"
                    backgroundColor="#6a51ae"
                />
                <View style={styles.profileInfo}>
                    <Image style={styles.profileAvatar}
                           source={{ uri: owner.avatar || 'http://www.51allout.co.uk/wp-content/uploads/2012/02/Image-not-found.gif' }}/>
                    <Text style={styles.profileText}>Joined Clausae : {owner._created || 'quite some time ago'}</Text>
                    <Text style={styles.profileText}>Total posts : {'a bunch'}</Text>
                    <Text style={styles.profileText}>Last seen : {'a little while now'}</Text>
                </View>

                <View style={styles.profileContent}>
                    <Text style={styles.profileName}>
                        {owner.name || 'Clausae Member'}
                    </Text>
                    <Text style={styles.text}>
                        Enim iusto ipsa illo architecto quod eligendi reiciendis. Omnis vel veritatis facilis accusamus.
                        Qui numquam qui dolores corrupti consequatur quasi qui asperiores. Ad reiciendis dolorem ut quia
                        dolorem sapiente sint.
                    </Text>
                    <Text style={styles.light}>12/05/2018 16:09</Text>
                </View>
            </View>
        );
    }
}

//--------PROFILESCREEN--------
export class ProfileScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Profile',
            drawerLabel: () => 'Profile',
            drawerIcon: ({ tintColor }) => (
                <Image
                    source={{ uri: '../img/user.png' }}
                    style={{ tintColor: tintColor }}
                />
            )
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            user: null
        };
    }

    componentDidMount() {
        AuthStorage.checkLogin().then((data) => {
            this.setState({ user: data });
        });
    }

    render() {
        const nav = this.props.navigation;
        const props = this.props;

        if (!this.state.user) {
            return (
                <ActivityIndicator
                    animating={true}
                    style={styles.indicator}
                    size="large"
                />
            );
        }
        return (

            <View style={styles.profileContainer}>
                {console.log(JSON.stringify(this.state.user))}
                <StatusBar
                    barStyle="light-content"
                    backgroundColor="#6a51ae"
                />

                <View style={styles.profileInfo}>
                    <Image style={styles.profileAvatar}
                           source={require("../img/default-avatar.gif")}/>
                    <Text style={styles.profileText}>Joined Clausae
                        : {this.state.user._created || 'quite some time ago'}</Text>
                    <Text style={styles.profileText}>Total posts : {'a bunch'}</Text>
                    <Text style={styles.profileText}>Last seen : {'a little while now'}</Text>
                </View>

                <View style={styles.profileContent}>
                    <Text style={styles.profileName}>
                        {this.state.user.name || 'Clausae Member'}
                    </Text>
                    <Text style={styles.text}>
                        Enim iusto ipsa illo architecto quod eligendi reiciendis. Omnis vel veritatis facilis accusamus.
                        Qui numquam qui dolores corrupti consequatur quasi qui asperiores. Ad reiciendis dolorem ut quia
                        dolorem sapiente sint.
                    </Text>
                    <Text style={styles.light}>12/05/2018 16:09</Text>
                </View>
            </View>
        );
    }
}

//--------HOMESCREEN--------
export class HomeScreen extends Component {
    static navigationOptions = {
        title: 'Clausae',
        drawerLabel: 'Feed',
        drawerIcon: ({ tintColor }) => (
            <Image
                source={{ uri: '../img/home.png' }}
                style={{ tintColor: tintColor }}
            />
        )
    };
    makeRemoteRequest = () => {
        const url = `https://clausae-2f57.restdb.io/rest/posts`;
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
                //console.log(JSON.stringify(res));
                this.setState({
                    data: res,
                    error: res.error || null,
                    loading: false
                });
            })
            .catch(error => {
                this.setState({ error, loading: false });
            });
    };

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: null,
            data: {}
        };
    }

    componentDidMount() {
        this.makeRemoteRequest();
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar
                    barStyle="light-content"
                    backgroundColor="#6a51ae"
                />
                <Header
                    title={this.props.navigation.getParam('title', 'Clausae')}
                    navigation={this.props.navigation}
                />

                {this.state.loading && <Text style={styles.loading} selectable={false}>LOADING...</Text>}
				
				{!this.state.loading &&
                <FlatList
                    style={styles.postsList}
                    keyExtractor={(item, index) => item._id}
                    data={this.state.data}
                    renderItem={({ item }) => <CardWithNav
                        owner={item.owner[0]}
                        createdAt={item._created}
                        text={item.text}
                    />}
                />
                }


                <ActionButton offset={{ left: undefined, right: 12, bottom: 16, top: undefined }}
                              navigation={this.props.navigation}/>
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
    profileContainer: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: '#e3e9ec',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#a3a89e',
        margin: 10,
        padding: 8
    },
    profileContent: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'flex-start',
        padding: 6
    },
    profileInfo: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'flex-start',
        padding: 6,
        maxWidth: 128,
        marginRight: 6
    },
    profileName: {
        textAlign: 'left',
        color: '#6d240e',
        fontSize: 16,
        fontWeight: 'bold'
    },
    profileText: {
        textAlign: 'left',
        color: '#061229',
        fontSize: 14
    },
    profileAvatar: {
        height: 128,
        width: 128
    },
    profileLightText: {
        fontSize: 10,
        fontStyle: 'italic',
        color: '#636363',
        textAlign: 'right',
        marginTop: 4,
        width: '100%'
    },
    postsList: {
        width: '100%'
    },
    loading: {
        textAlign: 'center',
        textAlignVertical: 'center',
        height: '100%',
        width: '100%'
    },
    activity: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 80
    },
    errorText: {
        margin: 24,
        padding: 12,
        color: '#e21527',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#e21527',
        borderRadius: 5
    }
});
