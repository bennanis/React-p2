import React, { Component }              from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { withNavigation }                from 'react-navigation';

export class Card extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const props = this.props;
        return (
            <View style={styles.container}>
                <Image style={styles.avatar}
                       source={{ uri: props.owner.avatar }}/>
                <View style={styles.content}>
                    <Text style={styles.name}
                          onPress={() => this.props.navigation.navigate('Profile', { owner: props.owner })}>
                        {props.owner.name}
                    </Text>
                    <Text style={styles.text} numberOfLines={5}>
                        {props.text}
                    </Text>
                    <Text style={styles.light}>{props.createdAt}</Text>
                </View>
            </View>
        );
    }
}

export const CardWithNav = withNavigation(Card);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: '#fff',
        borderBottomWidth: 0.5,
        borderBottomColor: '#d2d8cb',
        padding: 16,
        width: '100%'
    },
    content: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'flex-start',
        marginLeft: 6
    },
    name: {
        textAlign: 'left',
        color: '#1d1d1d',
        fontSize: 16,
        fontWeight: 'bold'
    },
    text: {
        textAlign: 'left',
        color: '#061229',
        fontSize: 14

    },
    avatar: {
        height: 64,
        width: 64
    },
    light: {
        fontSize: 10,
        fontStyle: 'italic',
        color: '#636363',
        textAlign: 'right',
        marginTop: 4,
        width: '100%'
    }
});
