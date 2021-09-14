//REACT
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    Image,
    TouchableHighlight
} from 'react-native';
//STYLES
import LinearGradient from 'react-native-linear-gradient';
import {
    HEADER_MAX_HEIGHT,
    HEADER_MIN_HEIGHT,
    HEADER_SCROLL_DISTANCE,
    STATUS_BAR_STYLES,
    TITLE_TEXT_STYLES
} from 'WalkWestCentral/app/util/Definitions';
//COMPONENTS
import MenuHeader from 'WalkWestCentral/app/ui/components/list_views/headers/MenuHeader';
//CLASS
export default class ScreenBase extends Component {
    static navigationOptions = {
        header: ({state, setParams}) => ({visible: false})
    };

    constructor(props){
        super(props);
    }

    //go to the previous screen in the stack
    handleBackButton() {
        this.props.navigation.goBack();
        let prevView = this.props.navigation.state.params.prevView;
        if(prevView){
            prevView.backToView();
        }
    }

    //go to a new screen from the current screen
    navigateToScreen(arg = {screen: '', args: {}}){
        const {navigate} = this.props.navigation;
        navigate(arg.screen, this.setNavigateParameters(arg.args));
    }

    //empty the screen stack and then go to a new screen
    resetStackAndNavigateToScreen(arg = {screen: '', args: {}}){
        this.props.navigation.goBack('reset');
        this.navigateToScreen({screen: arg.screen, args: arg.args});
    }

    //should be implemented by sub classes.
    //  called on the previous screen when the back button is pressed
    backToView(){ }

    setNavigateParameters(arg = {}){
        if(arg == null){ arg = {};}
        arg.prevView = this;
        return arg;
    }

    //creates the back button
    renderBackButton(){
        return(
            <TouchableHighlight
                style={styles.buttonContainer}
                underlayColor={'rgba(0,0,0,0)'}
                onPress={this.handleBackButton.bind(this)}>
                <View style={styles.backButtonContainer}>
                    <Image style={styles.backButton} source={require('WalkWestCentral/app/resources/img/back_button.png')}/>
                </View>
            </TouchableHighlight>
        );
    }

    //makes the top view where the back button and the logo is located
    renderHeader(hideBackButton) {
        //if we want to hide the back button, just put a generic view in its place
        let backButton = hideBackButton ? (<View/>) : this.renderBackButton();
        return (
            <View style={styles.container}>
                <View style={STATUS_BAR_STYLES}/>
                <View style={styles.header}>
                    <View style={styles.headerTextContainer}>
                        <Text style={[TITLE_TEXT_STYLES, styles.headerText]}>{'WALK WEST CENTRAL'}</Text>
                    </View>
                    {backButton}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        alignSelf: 'stretch',
    },
    header: {
        height: HEADER_MIN_HEIGHT,
        zIndex: 0,
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    headerImage:{
        height: null,
        width: null,
        alignSelf: 'stretch',
        resizeMode: 'contain',
        opacity: 1,
        height: HEADER_MIN_HEIGHT/2,
    },
    headerTextContainer:{
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText:{
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
        padding: 0,
    },
    spacerView:{
      flex: 1
    },
    buttonContainer:{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 10,
        height: HEADER_MIN_HEIGHT,
        width: 30,
    },
    backButtonContainer:{
        flex: 1,
        alignSelf: 'stretch'
    },
    backButton: {
        flex: 1,
        alignSelf: 'stretch',
        resizeMode: 'contain',
        zIndex: 20,
    }
});
