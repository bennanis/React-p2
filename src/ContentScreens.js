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
