import React, { Component }              from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export class DrawerHeader extends Component {
    render() {
        return (
            <View style={styles.headerWrapper}>
                <Image style={styles.headerAvatar} source={require("../img/default-avatar.gif")}/>
                <Text style={styles.headerText}>Yellow Car</Text>
            </View>
        )
    }
}

export class DrawerFooter extends Component {
    render() {
        return <View style={styles.footerWrapper}>
            <Text style={styles.footerText}>Random text going into the footer.</Text>
        </View>
    }
}

const styles = StyleSheet.create({
    headerWrapper: {
        flex: 1,
        width: '100%',
        height: 160,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#6a51ae',
        opacity: 60
    },
    headerAvatar: {
        height: 36,
        width: 36,
        borderRadius: 24,
        borderColor: '#fff',
        borderWidth: 2,
        margin: 6
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#e6e6e6',
        textShadowOffset: { width: 1, height: 2 },
        textShadowColor: '#111111',
        textShadowRadius: 12
    },
    footerWrapper: {
        flex: 1,
        width: '100%',
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        // backgroundColor: '#f3f3f3',
        bottom: 0
    },
    footerText: {
        fontWeight: 'normal',
        fontSize: 12,
        color: '#959595'
    }
});