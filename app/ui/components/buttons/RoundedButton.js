//REACT
import React, { Component } from 'react';
import{
    View,
    TouchableHighlight,
    Text,
    StyleSheet
} from 'react-native';

//DEFINITIONS
import{
    BLACK,
    WHITE
} from 'WalkWestCentral/app/util/Definitions';

//CLASS
export default class RoundedButton extends Component{
    constructor(props){
        super(props);
    }

    //called when the user presses the button.
    //  the onPress prop must be passed in.
    onPress(){
        if(typeof this.props.onPress === 'function'){
            this.props.onPress();
        }
    }

    render(){
        return(
            <TouchableHighlight
                underlayColor={'rgba(0,0,0,0)'}
                onPress={this.onPress.bind(this)}>
                <View style={[styles.container, {backgroundColor: this.props.backgroundColor}]}>
                    <Text style={styles.text}>{this.props.title}</Text>
                </View>
            </TouchableHighlight>
        )
    }
}


const styles = StyleSheet.create({
    container:{
        borderRadius: 10,
        padding: 10,
        margin: 10,
        backgroundColor: BLACK,
        borderColor: WHITE,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        width: 150,
    },
    text:{
        fontSize: 14,
        color: WHITE,
        fontWeight: 'bold'
    }
});
