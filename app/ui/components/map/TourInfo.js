//REACT
import React, {Component} from 'react';
import {StyleSheet, Text, View, LayoutAnimation, ScrollView} from 'react-native';
//STYLES
import {TITLE_TEXT_STYLES, MAIN_TEXT_STYLES} from 'WalkWestCentral/app/util/Definitions';
//COMPONENTS
import AudioController from 'WalkWestCentral/app/ui/components/audio/AudioController';

//CLASS
export default class TourInfo extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.textViewContainer}>
                    <ScrollView style={styles.scrollView}>
                        <Text style={[MAIN_TEXT_STYLES, styles.mainText]}>
                            {this.props.description}
                        </Text>
                    </ScrollView>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    textViewContainer: {
        flex: 1,
        alignSelf: 'stretch'
    },
    mainText: {},
    scrollView: {
        marginTop: 20,
        paddingLeft: 40,
        paddingRight: 40,
        flex: 1,
        alignSelf: 'stretch'
    },
    titleText: {},
    audioContoller: {
        flex: 1,
        alignSelf: 'stretch'
    }
});


Map.propTypes = {
    description: React.PropTypes.string.isRequired,
}
