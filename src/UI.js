import React, { Component }                                  from 'react';
import { Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native';

/*@props : {title, navigation}*/
export class Header extends Component {
    render() {
        return (
            <View style={styles.headerWrapper}>
                <TouchableHighlight onPress={() => this.props.navigation.toggleDrawer()}>
                    <Image style={styles.headerMenu} source={require("../img/menu100.png")}/>
                </TouchableHighlight>
                <Text style={styles.headerText}>{this.props.title}</Text>
            </View>
        )
    }
}

/*@props : {offset:{top, right, left, bottom}, navigation}*/
export class ActionButton extends Component {
    constructor(props) {
        super(props);
        this.actionButtonStyle = StyleSheet.create({
            surface: {
                width: 80,
                height: 80,
                borderRadius: 80,
                backgroundColor: '#6e53b4',
                position: 'absolute',
                top: this.props.offset.top,
                left: this.props.offset.left,
                right: this.props.offset.right,
                bottom: this.props.offset.bottom,
                borderWidth: 1,
                borderColor: '#6a51ae',
                elevation: 8
            }
        });
    }

    render() {
        return <TouchableHighlight style={this.actionButtonStyle.surface}
                                   onPress={() => this.props.navigation.toggleDrawer()}>
            <View style={styles.actionButtonInside}>
                <Image style={{ width: 50, height: 50, tintColor: '#fff' }}
                       source={require("../img/quill100.png")}/>
            </View>
        </TouchableHighlight>
    }
}

const styles = StyleSheet.create({
    headerWrapper: {
        flex: 0,
        width: '100%',
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#6a51ae'
    },
    headerMenu: {
        height: 28,
        width: 28,
        marginHorizontal: 12,
        tintColor: '#fff'
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#e6e6e6'
    },
    actionButtonSurface: {
        width: 80,
        height: 80,
        borderRadius: 80,
        backgroundColor: '#6e53b4',
        position: 'absolute',
        bottom: 10,
        right: 10,
        borderWidth: 1,
        borderColor: '#6a51ae',
        elevation: 8
    },
    actionButtonInside: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: 80,
    },
});