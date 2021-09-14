//CONSTANTS
//AWS
const TOUR_BUCKET_ID = 'dornsifetours';
const BUSINESS_BUCKET_ID = 'dornsifebusiness';
const IMAGE_BUCKET_ID = 'dornsifeimage';
const AUDIO_BUCKET_ID = 'dornsifeaudio';
const MISC_BUCKET_ID = 'dornsifemisc';
const BUSINESS_IMAGES_JSON = 'businessImages.json'
const AWS_BASE_URL = 'https://s3-us-west-2.amazonaws.com/';

//FILEMANAGER
const MY_WEST_CENTRAL_KEY = '__MyWestCentral__';

//BUSINESS CATEGORIES
BUSINESS_CAT = 'business';
INFORMATION_CAT = 'informational',
VOLUNTEER_CAT = 'volunteer';
WORSHIP_CAT = 'worship';

//ICONS
//RED
const BUSINESS_ICON_RED = require('WalkWestCentral/app/resources/img/businessicon_red.png');
const INFORMATION_ICON_RED = require('WalkWestCentral/app/resources/img/informationalicon_red.png');
const VOLUNTEER_ICON_RED = require('WalkWestCentral/app/resources/img/volunteericon_red.png');
const WORSHIP_ICON_RED = require('WalkWestCentral/app/resources/img/worshipicon_red.png');

//WHITE
const BUSINESS_ICON_WHITE = require('WalkWestCentral/app/resources/img/businessicon_white.png');
const INFORMATION_ICON_WHITE = require('WalkWestCentral/app/resources/img/informationalicon_white.png');
const VOLUNTEER_ICON_WHITE = require('WalkWestCentral/app/resources/img/volunteericon_white.png');
const WORSHIP_ICON_WHITE = require('WalkWestCentral/app/resources/img/worshipicon_white.png');

//BLACK
const BUSINESS_ICON_BLACK = require('WalkWestCentral/app/resources/img/businessicon_black.png');
const INFORMATION_ICON_BLACK = require('WalkWestCentral/app/resources/img/informationalicon_black.png');
const VOLUNTEER_ICON_BLACK = require('WalkWestCentral/app/resources/img/volunteericon_black.png');
const WORSHIP_ICON_BLACK = require('WalkWestCentral/app/resources/img/worshipicon_black.png');

//NO CIRCLE
const BUSINESS_ICON_MENU = require('WalkWestCentral/app/resources/img/businessicon_white_nocircle.png');
const INFORMATION_ICON_MENU = require('WalkWestCentral/app/resources/img/informationalicon_white_nocircle.png');
const VOLUNTEER_ICON_MENU = require('WalkWestCentral/app/resources/img/volunteericon_white_nocircle.png');
const WORSHIP_ICON_MENU = require('WalkWestCentral/app/resources/img/worshipicon_white_nocircle.png');

//COLOR CHOICE
const BUSINESS_ICON = BUSINESS_ICON_BLACK;
const INFORMATION_ICON = INFORMATION_ICON_BLACK;
const VOLUNTEER_ICON = VOLUNTEER_ICON_BLACK;
const WORSHIP_ICON = WORSHIP_ICON_BLACK;
const PHONE_ICON = require('WalkWestCentral/app/resources/img/phoneicon.png');
const ADDRESS_ICON = require('WalkWestCentral/app/resources/img/addressicon1.png');
const WEBSITE_ICON = require('WalkWestCentral/app/resources/img/websiteicon.png');
const SAVED_ICON = require('WalkWestCentral/app/resources/img/saved.png');
const SAVED_ICON_WHITE = require('WalkWestCentral/app/resources/img/saved_white.png');
const UNSAVED_ICON = require('WalkWestCentral/app/resources/img/unsaved.png');
const WALKING_ICON = require('WalkWestCentral/app/resources/img/walking.png');

//UI
const HEADER_MAX_HEIGHT = 200;
const HEADER_MIN_HEIGHT = 60;
const HEADER_SCROLL_DISTANCE = (HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT);
const TITLE_FONT = 'Verdana';
const TITLE_FONT_WEIGHT = 'bold';
const TITLE_FONT_SIZE = 20;
const MAIN_FONT_SIZE = 14;
const MAIN_TEXT_LINE_HEIGHT = 20;
const MAIN_FONT = 'Verdana';
const LIGHT_BLUE = '#67BAAF';
const BLUE = '#007C89';
const GOLD = '#C7B683';
const RED = '#C22033';
const BLACK = '#000000';
const GREY = '#bdbdbd';
const WHITE = '#FFFFFF';

const MAIN_TEXT_STYLES = {
    color: WHITE,
    fontFamily: MAIN_FONT,
    fontSize: MAIN_FONT_SIZE,
    textAlign: 'auto',
    lineHeight: MAIN_TEXT_LINE_HEIGHT
}

const TITLE_TEXT_STYLES = {
    color: WHITE,
    textAlign: 'center',
    padding: 10,
    fontFamily: TITLE_FONT,
    fontWeight: TITLE_FONT_WEIGHT,
    fontSize: TITLE_FONT_SIZE
}

const STATUS_BAR_STYLES = {
    backgroundColor: BLACK,
    height: 20,
    alignSelf: 'stretch',
}

module.exports = {
    //STYLES
    HEADER_MAX_HEIGHT: HEADER_MAX_HEIGHT,
    HEADER_MIN_HEIGHT: HEADER_MIN_HEIGHT,
    HEADER_SCROLL_DISTANCE: HEADER_SCROLL_DISTANCE,
    TITLE_FONT: TITLE_FONT,
    TITLE_FONT_WEIGHT: TITLE_FONT_WEIGHT,
    TITLE_FONT_SIZE: TITLE_FONT_SIZE,
    MAIN_FONT_SIZE: MAIN_FONT_SIZE,
    MAIN_TEXT_LINE_HEIGHT: MAIN_TEXT_LINE_HEIGHT,
    MAIN_FONT: MAIN_FONT,
    LIGHT_BLUE: LIGHT_BLUE,
    BLUE: BLUE,
    GOLD: GOLD,
    RED: RED,
    BLACK: BLACK,
    GREY: GREY,
    WHITE: WHITE,
    MAIN_TEXT_STYLES: MAIN_TEXT_STYLES,
    TITLE_TEXT_STYLES: TITLE_TEXT_STYLES,
    STATUS_BAR_STYLES: STATUS_BAR_STYLES,

    //BUCKETS
    TOUR_BUCKET_ID: TOUR_BUCKET_ID,
    BUSINESS_BUCKET_ID: BUSINESS_BUCKET_ID,
    AUDIO_BUCKET_ID: AUDIO_BUCKET_ID,
    MISC_BUCKET_ID: MISC_BUCKET_ID,
    BUSINESS_IMAGES_JSON: BUSINESS_IMAGES_JSON,
    IMAGE_BUCKET_ID: IMAGE_BUCKET_ID,
    AWS_BASE_URL: AWS_BASE_URL,
    MY_WEST_CENTRAL_KEY: MY_WEST_CENTRAL_KEY,

    //CATEGORIES
    BUSINESS_CAT: BUSINESS_CAT,
    INFORMATION_CAT: INFORMATION_CAT,
    VOLUNTEER_CAT: VOLUNTEER_CAT,
    WORSHIP_CAT: WORSHIP_CAT,

    //ICONS
    BUSINESS_ICON: BUSINESS_ICON,
    BUSINESS_ICON_RED: BUSINESS_ICON_RED,
    BUSINESS_ICON_WHITE: BUSINESS_ICON_WHITE,
    BUSINESS_ICON_BLACK: BUSINESS_ICON_BLACK,

    INFORMATION_ICON: INFORMATION_ICON,
    INFORMATION_ICON_RED: INFORMATION_ICON_RED,
    INFORMATION_ICON_WHITE: INFORMATION_ICON_WHITE,
    INFORMATION_ICON_BLACK: INFORMATION_ICON_BLACK,

    WORSHIP_ICON: WORSHIP_ICON,
    WORSHIP_ICON_RED: WORSHIP_ICON_RED,
    WORSHIP_ICON_WHITE: WORSHIP_ICON_WHITE,
    WORSHIP_ICON_BLACK: WORSHIP_ICON_BLACK,

    VOLUNTEER_ICON: VOLUNTEER_ICON,
    VOLUNTEER_ICON_RED: VOLUNTEER_ICON_RED,
    VOLUNTEER_ICON_WHITE: VOLUNTEER_ICON_WHITE,
    VOLUNTEER_ICON_BLACK: VOLUNTEER_ICON_BLACK,

    PHONE_ICON: PHONE_ICON,
    WEBSITE_ICON: WEBSITE_ICON,
    ADDRESS_ICON: ADDRESS_ICON,
    SAVED_ICON: SAVED_ICON,
    SAVED_ICON_WHITE: SAVED_ICON_WHITE,
    UNSAVED_ICON: UNSAVED_ICON,
    WALKING_ICON: WALKING_ICON
}
