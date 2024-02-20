import { Translation } from '../globals';

export type Languages = 'VN' | 'ENG';
export enum Contents {
    PAYMENT_FOLLOW_UP_TITLE,
    PAYMENT_FOLLOW_UP_TITLE1,
    PAYMENT_FOLLOW_UP_CONTENT,
    PAYMENT_FOLLOW_UP_DONE,

    BOOTING,
    ROTATE_PHONE,

    ABOUT_OPENSOURCE,
    ABOUT_NOTMICROSOFT,
    ABOUT_CREATIVE,
    ABOUT_TITLE,
    ABOUT_LICENSED,
    ABOUT_ALSONOT,
    ABOUT_MICROSOFTCOPYWRITE,
    ABOUT_UNDERSTAND,
    ABOUT_CONTACT,

    STORE_FEATURED_APP,
    STORE_FEATURED_APP_INFOR,
    STORE_FEATURED_GAME,
    STORE_FEATURED_GAME_INFO,

    STORE_FREE,
    STORE_OWNED,
    STORE_RENT,
    STORE_FEATURES,
    STORE_RATINGSR,
    STORE_DESCRIPTIONR,

    CAMERA_TAKE_PHOTOR,
    KNOW_THINKMAY_VIA,
    GETSTARTED_COUNTRY,
    GETSTARTED_ANOTHERKEYBOARDR,
    MY_FRIEND,
    OTHER_SOURCE,

    TEST,
    SUGGEST,
    UNSPECIFIC,
    ALREADY_DEPLOYED,
    NOT_ALLOW,
    RUN_OUT_OF_GPU_STOCK,
    NOT_READY,
    NOT_RUNNING,
    NOT_PAUSED,
    PAUSED,
    NOT_PINGED,
    REMOTE_TIMEOUT,
    UNKNOWN_ERROR,
    IS_LOCKED,
    NOT_FOUND,
    TIME_OUT,
    STARTAPP,
    INSTALLAPP,
    PAUSEAPP,
    THANKS,
    THANKPARAPHRASE,
    LA,
    WITHOUTACC,
    CLOSEDEMO,
    STARTAT,
    ENDAT,
    TIME,
    INACTIVEUSER,
    APP_NOT_AVAILABLE,
    GUIDELINE,
    PENDING,
    SUCCESS,
    REJECTED,
    FETCH_APP,
    INSTALL_APP,
    DEMO_APP,
    START_APP,
    PAUSE_APP,
    DELETE_APP,
    RESET_APP,
    ACCESS_APP,
    WELCOME_LINE1,
    WELCOME_LINE2,
    WELCOME_LINE3,
    WELCOME_LINE4,
    HAVE_ACCOUNT,
    SIGN_IN,

    DEVICE_YOU_PLAY,
    DEVICE_PC,
    DEVICE_LAPTOP,
    DEVICE_MACBOOK,
    DEVICE_CHROMEBOOK,
    DEVICE_IPHONE,
    DEVICE_ANDROID,
    DEVICE_TV,

    WHAT_LOOK_FOR,
    COMFORTABLE,
    HARDCORE,
    PROFESSIONAL,
    EXPLORE,
    DONT_KNOW,

    BEST_EXP,
    HEADER_1,
    HEADER_2,
    CONTENT_1,
    CONTENT_2,
    CONTENT_3,
    CONTENT_4,
    CONTENT_5,
    CONTENT_6,
    CONTENT_7,
    CONTENT_8,
    SURVEY_COMPLETED,
    FAIL_DEMO_REGION,
    FAIL_DEMO_TEMP,
    DEMO,
    SUPPORT,
    BOOKING_DEMO,
    DEMO_SUGGESSTION,
    EXPLORE_WEB,
    SETTING,
    LOW_PERIOD,
    VIDEO_TOGGLE,
    RESET_VIDEO,
    HOMESCREEN,
    FULLSCREEN,
    RELATIVE_MOUSE,
    SCAN_CODE,
    EXTERNAL_TAB,
    QUALITY,
    FRAMERATE,
    DEMO_TUTORIAL_HEAD,
    DEMO_TUTORIAL_1,
    DEMO_TUTORIAL_2,
    DEMO_TUTORIAL_3,
    DEMO_TUTORIAL_4,
    DEMO_TUTORIAL_5,

    START_DEMO,
    READ_USER_MANUAL,
    PRO_TIP_DEMO_0,
    PRO_TIP_DEMO_1,
    PRO_TIP_DEMO_2,
    PRO_TIP_DEMO_3,
    FB_TERRIBLE,
    FB_BAD,
    FB_GOOD,
    FB_AMAZING,
    FB_CONTROL,
    FB_KEYBOARD,
    FB_MOUSE,
    FB_GAMEPAD,
    FB_TOUCH,
    FB_CONNECT,
    FB_BLACKSCREEN,
    FB_LAG,
    FB_NOSHOWVIDEO,
    FB_GAME,
    FB_OTHER,
    FB_ISSUE,
    FB_SUBMIT,
    FB_DETAIL,
    DEMO_QUEUED,
    DEMO_NOTE,
    ALREADY_DEMO,
    THINKMAY_HEADER,
    THINKMAY_DESC,
    PLAN_USAGE_TIME,
    ADDITIONAL_TIME
}

export function language() {
    const t: Translation = new Map<Languages, Map<Contents, string>>();
    const vn = new Map<Contents, string>();
    t.set('VN', vn);
    const en = new Map<Contents, string>();
    t.set('ENG', en);

    en.set(
        Contents.PAYMENT_FOLLOW_UP_TITLE,
        'We will help you setup the payment for thinknmay service'
    );
    vn.set(
        Contents.PAYMENT_FOLLOW_UP_TITLE,
        'Chúng mình sẽ hỗ trợ bạn thực hiện thanh toán dịch vụ'
    );

    en.set(
        Contents.PAYMENT_FOLLOW_UP_CONTENT,
        'At the moment, you can pay us using bank transfer (VietQR, ZaloPay)'
    );
    vn.set(
        Contents.PAYMENT_FOLLOW_UP_CONTENT,
        'Hiện tại, bạn có thể thanh toán thông qua chuyển khoản ngân hàng (VietQR, ZaloPay)'
    );

    en.set(
        Contents.PAYMENT_FOLLOW_UP_TITLE1,
        'Please make payment to the following bank account'
    );
    vn.set(
        Contents.PAYMENT_FOLLOW_UP_TITLE1,
        'Bạn chuyển khoản đến số tài khoản sau'
    );

    en.set(
        Contents.PAYMENT_FOLLOW_UP_DONE,
        'Thank you for your payment, it will take us a few hours to verify your transaction'
    );
    vn.set(
        Contents.PAYMENT_FOLLOW_UP_DONE,
        'Cảm ơn bạn đã thanh toán dịch vụ thinkmay, chúng mình sẽ cần một vài giờ để xác minh giao dịch trên'
    );

    en.set(
        Contents.ABOUT_OPENSOURCE,
        'win11React is an open source project made in the hope to replicate the Windows 11 desktop experience on web, using standard web technologies like React, CSS, and JavaScript.'
    );
    vn.set(
        Contents.ABOUT_OPENSOURCE,
        'win11React is an open source project made in the hope to replicate the Windows 11 desktop experience on web, using standard web technologies like React, CSS, and JavaScript.'
    );

    en.set(
        Contents.ABOUT_NOTMICROSOFT,
        "This project is not in anyway affiliated with Microsoft and should not be confused with Microsoft's Operating System or Products."
    );
    vn.set(
        Contents.ABOUT_NOTMICROSOFT,
        "This project is not in anyway affiliated with Microsoft and should not be confused with Microsoft's Operating System or Products."
    );

    en.set(Contents.ABOUT_CREATIVE, 'Creative-Commons');
    vn.set(Contents.ABOUT_CREATIVE, 'Creative-Commons');

    en.set(Contents.ABOUT_TITLE, 'About');
    vn.set(Contents.ABOUT_TITLE, 'About');

    en.set(Contents.ABOUT_LICENSED, 'This project is licensed under');
    vn.set(Contents.ABOUT_LICENSED, 'This project is licensed under');

    en.set(Contents.ABOUT_ALSONOT, 'This is also not');
    vn.set(Contents.ABOUT_ALSONOT, 'This is also not');

    en.set(
        Contents.ABOUT_MICROSOFTCOPYWRITE,
        'Microsoft, Windows and Other demonstrated Products in this project are trademarks of the Microsoft group of companies'
    );
    vn.set(
        Contents.ABOUT_MICROSOFTCOPYWRITE,
        'Microsoft, Windows and Other demonstrated Products in this project are trademarks of the Microsoft group of companies'
    );

    en.set(Contents.ABOUT_UNDERSTAND, 'Ok, I understand');
    vn.set(Contents.ABOUT_UNDERSTAND, 'Ok, I understand');

    en.set(Contents.ABOUT_CONTACT, 'contact');
    vn.set(Contents.ABOUT_CONTACT, 'contact');

    en.set(Contents.STORE_FEATURED_APP, 'Cloud PC');
    vn.set(Contents.STORE_FEATURED_APP, 'Cloud PC');

    en.set(
        Contents.STORE_FEATURED_APP_INFOR,
        'Data visualization, 3D Rendering,... any heavy workload run on cloud'
    );
    vn.set(
        Contents.STORE_FEATURED_APP_INFOR,
        'Một lựa chọn hợp ví cho những ai có nhu cầu làm việc cần máy tính cấu hình cao'
    );

    en.set(Contents.STORE_FEATURED_GAME, 'Cloud Gaming');
    vn.set(Contents.STORE_FEATURED_GAME, 'Cloud Gaming-VN');

    en.set(
        Contents.STORE_FEATURED_GAME_INFO,
        'AAA gaming from your browser without download'
    );
    vn.set(
        Contents.STORE_FEATURED_GAME_INFO,
        'Chiến game AAA ngay trên trình duyệt, mọi lúc mọi nơi.'
    );

    en.set(Contents.STORE_FREE, 'FREE');
    vn.set(Contents.STORE_FREE, 'FREE');

    en.set(Contents.BOOTING, 'Your device is booting');
    vn.set(Contents.BOOTING, 'Thinkmay đang khởi động, bạn đợi chút nhé');

    en.set(
        Contents.ROTATE_PHONE,
        'Please rotate your phone horizontally to continue'
    );
    vn.set(
        Contents.ROTATE_PHONE,
        'Hãy xoay ngang màn hình để tiếp tục sử dụng'
    );

    en.set(Contents.STORE_OWNED, 'Owned');
    vn.set(Contents.STORE_OWNED, 'Owned');

    en.set(Contents.STORE_RENT, 'Rent');
    vn.set(Contents.STORE_RENT, 'Rent');

    en.set(Contents.STORE_FEATURES, 'Features');
    vn.set(Contents.STORE_FEATURES, 'Features');

    en.set(Contents.STORE_RATINGSR, 'Ratings and reviews');
    vn.set(Contents.STORE_RATINGSR, 'Ratings and reviews');

    en.set(Contents.STORE_DESCRIPTIONR, 'Description');
    vn.set(Contents.STORE_DESCRIPTIONR, 'Description');

    en.set(Contents.CAMERA_TAKE_PHOTOR, 'Take photo');
    vn.set(Contents.CAMERA_TAKE_PHOTOR, 'Take photo');

    // don't modify this
    en.set(Contents.GETSTARTED_COUNTRY, "I'm from");
    vn.set(Contents.GETSTARTED_COUNTRY, "I'm from");

    en.set(Contents.MY_FRIEND, 'My friend introduce');
    vn.set(Contents.MY_FRIEND, 'Bạn bè giới thiệu');

    en.set(Contents.OTHER_SOURCE, 'Other');
    vn.set(Contents.OTHER_SOURCE, 'Khác');

    en.set(Contents.KNOW_THINKMAY_VIA, 'I know thinkmay via');
    vn.set(Contents.KNOW_THINKMAY_VIA, 'Bạn biết đến Thinkmay thông qua');

    en.set(
        Contents.GETSTARTED_ANOTHERKEYBOARDR,
        'If you also use another keyboard layout, you can add that next'
    );
    vn.set(
        Contents.GETSTARTED_ANOTHERKEYBOARDR,
        'If you also use another keyboard layout, you can add that next'
    );

    en.set(Contents.TEST, 'ENlish');
    vn.set(Contents.TEST, 'Vietnamese');

    en.set(Contents.SUGGEST, 'Please reload and try it again, in fews minutes');
    vn.set(Contents.SUGGEST, 'Vui lòng thử lại sau ít phút');

    en.set(Contents.UNSPECIFIC, 'Something went wrong.');
    vn.set(Contents.UNSPECIFIC, 'Something went wrong.');

    en.set(Contents.ALREADY_DEPLOYED, "You've installed 1 game");
    vn.set(
        Contents.ALREADY_DEPLOYED,
        'Được cài 3 máy và chạy 1 máy cùng một thời điểm. Xóa hoặc tắt máy cũ trước khi mở máy mới'
    );

    en.set(Contents.NOT_ALLOW, "Your account doesn't register our services");
    vn.set(Contents.NOT_ALLOW, 'Tài khoản chưa đăng kí dịch vụ.');

    en.set(Contents.RUN_OUT_OF_GPU_STOCK, 'We are running out of computer!');
    vn.set(
        Contents.RUN_OUT_OF_GPU_STOCK,
        'Chúng mình hiện tại đang tạm hết máy, bạn đợi thêm nhé!'
    );

    en.set(Contents.NOT_READY, "Installing, wait 3-5' until game logo appears");
    vn.set(
        Contents.NOT_READY,
        "Game đang tải xuống vui lòng đợi 3-5' cho đến khi logo game xuất hiện"
    );

    en.set(
        Contents.NOT_RUNNING,
        "Game is pasued or installing, run 'Start app' to open"
    );
    vn.set(
        Contents.NOT_RUNNING,
        "Game đã được PAUSED, chạy 'Start app' để mở game"
    );

    en.set(Contents.NOT_PAUSED, 'Game is running or installing, try again!');
    vn.set(Contents.NOT_PAUSED, 'Game đang chạy');

    en.set(Contents.PAUSED, 'Game is pasued or installing, try again!');
    vn.set(Contents.PAUSED, 'Game đã được paused!');

    en.set(Contents.NOT_PINGED, 'Game is pasued, reload and run Start app!');
    vn.set(
        Contents.NOT_PINGED,
        'Game đã được pasued, reload và start app lại nhé!'
    );

    en.set(
        Contents.REMOTE_TIMEOUT,
        'Remote request timed out, could you try run reset app?'
    );
    vn.set(
        Contents.REMOTE_TIMEOUT,
        'Yêu cầu kết nối hết hạn, bạn thử reset app nhé!'
    );

    en.set(Contents.UNKNOWN_ERROR, 'Unknown error happened');
    vn.set(Contents.UNKNOWN_ERROR, 'Lỗi không xác định đã xảy ra');

    en.set(
        Contents.IS_LOCKED,
        'Your data is uploading to cloud, please wait a fews minutes'
    );
    vn.set(
        Contents.IS_LOCKED,
        'Đang trong quá trình upload data lên cloud, quá trình này diễn ra trong ~15 phút !'
    );

    en.set(Contents.NOT_FOUND, 'Resources not found!');
    vn.set(Contents.NOT_FOUND, 'Không tìm thấy app yêu cầu.');

    en.set(Contents.TIME_OUT, 'Installing timeout!');
    vn.set(
        Contents.TIME_OUT,
        "Yêu cầu đã hết hạn. KHÔNG gửi lại yêu cầu để tránh lỗi data. RELOAD lại sau mỗi 1-2' cho đến khi game lên. Nếu quá 10' hãy báo lỗi cho page."
    );

    en.set(
        Contents.STARTAPP,
        'It take a fews minutes. Please pause app when not using'
    );
    vn.set(
        Contents.STARTAPP,
        'Khi muốn tắt máy và được lưu data                                                                                     Chuột phải => pause app'
    );

    en.set(
        Contents.INSTALLAPP,
        'It take a fews minutes, wait until logo appears'
    );
    vn.set(
        Contents.INSTALLAPP,
        'Khi có logo installing, đợi 1 vài phút cho đến khi logo game xuất hiện'
    );

    en.set(
        Contents.PAUSEAPP,
        'Tips, Right click => Power On app to play continuously'
    );
    vn.set(
        Contents.PAUSEAPP,
        'Chuột phải => Power On app khi muốn chơi lại tiến trình cũ, Nếu gặp vấn đề hãy nhắn tin cho bọn mình để hỗ trợ!'
    );

    en.set(Contents.THANKS, 'Thanks you<3');
    vn.set(Contents.THANKS, 'Xin cảm ơn bạn ^^');

    en.set(
        Contents.THANKPARAPHRASE,
        'Your feedback helps us so much for improvement!, Luv <3'
    );
    vn.set(
        Contents.THANKPARAPHRASE,
        'Feedback của bạn sẽ giúp Thinkmay rất nhiều trong quá trình cải thiện sản phẩm, Luv <3'
    );

    en.set(Contents.LA, 'Low Availability');
    vn.set(Contents.LA, 'Hàng chờ cao');

    en.set(Contents.WITHOUTACC, 'Support account');
    vn.set(Contents.WITHOUTACC, 'Hộ trợ tài khoản');

    en.set(
        Contents.CLOSEDEMO,
        'Demo is closed, Please contact us through Fanpage for supporting'
    );
    vn.set(
        Contents.CLOSEDEMO,
        'Đang đóng demo, bạn vui lòng truy cập fanpage để được hướng dẫn'
    );

    en.set(Contents.STARTAT, 'Start at');
    vn.set(Contents.STARTAT, 'Ngày bắt đầu');

    en.set(Contents.ENDAT, 'End');
    vn.set(Contents.ENDAT, 'Ngày hết hạn');

    en.set(Contents.TIME, 'Total usage');
    vn.set(Contents.TIME, 'Tổng thời gian sử dụng');

    en.set(Contents.INACTIVEUSER, 'Account is inactive!');
    vn.set(
        Contents.INACTIVEUSER,
        'Tài khoản chưa kích hoạt, truy cập fanpage để được hướng dẫn'
    );

    en.set(Contents.APP_NOT_AVAILABLE, "App isn't ready");
    vn.set(Contents.APP_NOT_AVAILABLE, 'Đang hết máy có game!');

    en.set(Contents.GUIDELINE, 'Guideline');
    vn.set(Contents.GUIDELINE, 'Hướng dẫn');

    en.set(Contents.PENDING, 'Pending to: ');
    vn.set(Contents.PENDING, 'Đang ');

    en.set(Contents.SUCCESS, 'Completed: ');
    vn.set(Contents.SUCCESS, 'Thành công ');

    en.set(Contents.REJECTED, 'Failed to: ');
    vn.set(Contents.REJECTED, 'Có lỗi khi ');

    en.set(Contents.FETCH_APP, 'Fetch your PC data');
    vn.set(Contents.FETCH_APP, 'Load danh sách app');

    en.set(Contents.INSTALL_APP, 'Install PC to remote');
    vn.set(Contents.INSTALL_APP, 'Cài máy để remote');

    en.set(Contents.DEMO_APP, 'Open demo PC');
    vn.set(Contents.DEMO_APP, 'Mở game trải nghiệm');

    en.set(Contents.START_APP, 'Start PC');
    vn.set(Contents.START_APP, 'Mở máy remote');

    en.set(Contents.PAUSE_APP, 'Shutdown PC');
    vn.set(Contents.PAUSE_APP, 'Tắt máy remote');

    en.set(Contents.DELETE_APP, 'Delete PC');
    vn.set(Contents.DELETE_APP, 'Xóa máy remote');

    en.set(Contents.RESET_APP, 'Reset session');
    vn.set(Contents.RESET_APP, 'Reset máy remote');

    en.set(Contents.ACCESS_APP, 'Access PC');
    vn.set(Contents.ACCESS_APP, 'Truy cập máy remote');

    en.set(Contents.WELCOME_LINE1, 'Welcome to Thinkmay cloud gaming');
    vn.set(
        Contents.WELCOME_LINE1,
        'Chào mừng bạn đến với Thinkmay - CloudPc đầu tiên tại Việt Nam'
    );

    en.set(Contents.WELCOME_LINE2, 'We will setup 15 minutes demo gameplay');
    vn.set(
        Contents.WELCOME_LINE2,
        'Bạn có 15 phút miễn phí trải nghiệm dịch vụ'
    );

    en.set(Contents.WELCOME_LINE3, 'before you subscribe for our service,');
    vn.set(Contents.WELCOME_LINE3, 'trước khi đăng kí');

    en.set(
        Contents.WELCOME_LINE4,
        'Is this the first time you try our service'
    );
    vn.set(
        Contents.WELCOME_LINE4,
        'Đây có phải lần đầu bạn ghé thăm Thinkmay^^'
    );

    en.set(Contents.HAVE_ACCOUNT, 'Have an account');
    vn.set(Contents.HAVE_ACCOUNT, 'Đã có tài khoản');

    en.set(Contents.SIGN_IN, 'Sign In');
    vn.set(Contents.SIGN_IN, 'Đăng nhập');

    en.set(Contents.DEVICE_YOU_PLAY, 'I often game on');
    vn.set(Contents.DEVICE_YOU_PLAY, 'Bạn thường chơi game bằng');

    en.set(Contents.DEVICE_PC, 'PC');
    vn.set(Contents.DEVICE_PC, 'Máy tính bàn Windows');

    en.set(Contents.DEVICE_LAPTOP, 'Laptop');
    vn.set(Contents.DEVICE_LAPTOP, 'Máy tính xách tay Windows');

    en.set(Contents.DEVICE_MACBOOK, 'Macbook');
    vn.set(Contents.DEVICE_MACBOOK, 'Macbook');

    en.set(Contents.DEVICE_CHROMEBOOK, 'Chromebook');
    vn.set(Contents.DEVICE_CHROMEBOOK, 'Chromebook');

    en.set(Contents.DEVICE_IPHONE, 'IPhone');
    vn.set(Contents.DEVICE_IPHONE, 'IPhone');

    en.set(Contents.DEVICE_ANDROID, 'Android');
    vn.set(Contents.DEVICE_ANDROID, 'Android');

    en.set(Contents.DEVICE_TV, 'TV');
    vn.set(Contents.DEVICE_TV, 'TV');

    en.set(Contents.WHAT_LOOK_FOR, "I'm looking for");
    vn.set(Contents.WHAT_LOOK_FOR, 'Bạn đang tìm kiếm trải nghiệm');

    en.set(Contents.COMFORTABLE, 'Comfortable gaming experience');
    vn.set(Contents.COMFORTABLE, 'Chơi game thư giãn');

    en.set(Contents.HARDCORE, 'Hardcore gaming experience');
    vn.set(Contents.HARDCORE, 'Chơi game hardcore');

    en.set(Contents.PROFESSIONAL, 'Professional work');
    vn.set(Contents.PROFESSIONAL, 'Làm việc chuyên nghiệp');

    en.set(Contents.EXPLORE, 'Explore new technologies');
    vn.set(Contents.EXPLORE, 'Khám phá công nghệ mới');

    en.set(Contents.DONT_KNOW, "I don't know yet");
    vn.set(Contents.DONT_KNOW, 'Mình chưa biết');

    en.set(Contents.BEST_EXP, 'How to get the best experience');
    vn.set(Contents.BEST_EXP, 'Để có trải nghiệm tốt nhất hãy ');

    en.set(
        Contents.HEADER_1,
        "You'll need an internet connection to continue the setting up your device."
    );
    vn.set(
        Contents.HEADER_1,
        'Để tiếp tục set-up, bạn cần kết nối mạng ổn định'
    );

    en.set(
        Contents.HEADER_2,
        "Once connected, you'll get the latest features and security updates."
    );
    vn.set(
        Contents.HEADER_2,
        'Phiên bản mới sẽ được tự động cập nhật, ngay sau khi bạn kết nối'
    );

    en.set(Contents.CONTENT_1, 'Turn off you VPN');
    vn.set(Contents.CONTENT_1, 'Tắt VPN');

    en.set(Contents.CONTENT_2, 'VPN downgrade');
    vn.set(Contents.CONTENT_2, 'Nếu bạn ở Việt Nam');

    en.set(Contents.CONTENT_3, 'Use 5Ghz wifi if possible');
    vn.set(Contents.CONTENT_3, 'Sử dụng wifi 5Ghz nếu có thể');

    en.set(Contents.CONTENT_4, '5Ghz wifi will help you get better connection');
    vn.set(
        Contents.CONTENT_4,
        '5Ghz sẽ giúp bạn có chất lượng kết nối tốt hơn'
    );

    en.set(Contents.CONTENT_5, 'Contact our customer support');
    vn.set(Contents.CONTENT_5, 'Nhắn tin qua fanpage');

    en.set(Contents.CONTENT_6, 'If you have connectivity problems');
    vn.set(Contents.CONTENT_6, 'Nếu bạn gặp vấn đề');

    en.set(Contents.CONTENT_7, 'Join our community to request games');
    vn.set(Contents.CONTENT_7, 'Tham gia Discord của Thinkmay');

    en.set(Contents.CONTENT_8, 'Join our discord to get lastest updates');
    vn.set(Contents.CONTENT_8, 'Để nhận được thông báo sớm nhất');

    en.set(Contents.SURVEY_COMPLETED, 'The setup has completed.');
    vn.set(Contents.SURVEY_COMPLETED, 'Máy demo đã sẵn sàng.');

    en.set(
        Contents.FAIL_DEMO_REGION,
        'Your region has not yet been supported, join our community to get more infomation.'
    );
    vn.set(Contents.FAIL_DEMO_REGION, 'Khu vực của bạn chưa được hỗ trợ.');

    en.set(Contents.FAIL_DEMO_TEMP, 'Demo gameplay is temporarily closed.');
    vn.set(
        Contents.FAIL_DEMO_TEMP,
        'Trải nghiệm miễn phí sẽ mở vào khung giờ 7:00 tới 11:00 và 14:00 tới 17:00 hàng ngày.'
    );

    en.set(Contents.DEMO, 'Get demo');
    vn.set(Contents.DEMO, 'Trải nghiệm');

    en.set(Contents.SUPPORT, 'Support now!');
    vn.set(Contents.SUPPORT, 'Hỗ trợ ngay!');

    en.set(
        Contents.DEMO_SUGGESSTION,
        "If you'd like a demo at a different time, please book an appointment for better assistance."
    );
    vn.set(
        Contents.DEMO_SUGGESSTION,
        'Nếu bạn muốn trải nghiệm ở khung giờ khác, vui lòng đặt lịch để Thinkmay phục vụ tốt nhất.'
    );

    en.set(Contents.DEMO_TUTORIAL_HEAD, 'User manual');
    vn.set(Contents.DEMO_TUTORIAL_HEAD, 'Hướng dẫn sử dụng');

    en.set(Contents.DEMO_TUTORIAL_1, '- Your game locate at volume D');
    vn.set(Contents.DEMO_TUTORIAL_1, '- Game demo nằm ở ổ D.');

    en.set(Contents.DEMO_TUTORIAL_2, '- Adjust quality and fps');
    vn.set(
        Contents.DEMO_TUTORIAL_2,
        '- Đừng quên chỉnh "Chất lượng", "FPS" và "Làm mới liên tục" phù hợp với điều kiện mạng.'
    );

    en.set(Contents.DEMO_TUTORIAL_3, '- Fix keyboard is not working');
    vn.set(
        Contents.DEMO_TUTORIAL_3,
        '- Click "Fix kẹt phím" nếu game không nhận bàn phím.'
    );

    en.set(Contents.DEMO_TUTORIAL_4, '- Fullscreen');
    vn.set(
        Contents.DEMO_TUTORIAL_4,
        '- Bật "toàn màn hình" khi chơi game (hoặc Ctrl Shift F).'
    );

    en.set(Contents.DEMO_TUTORIAL_5, '- Support now!');
    vn.set(
        Contents.DEMO_TUTORIAL_5,
        '- Click "Hỗ trợ ngay" nếu cần hỗ trợ kỹ thuật.'
    );

    en.set(Contents.BOOKING_DEMO, 'Booking demo');
    vn.set(Contents.BOOKING_DEMO, 'Đặt lịch');

    en.set(Contents.EXPLORE_WEB, 'Explore Thinkmay');
    vn.set(Contents.EXPLORE_WEB, 'Khám phá Thinkmay');

    en.set(Contents.SETTING, 'Setting');
    vn.set(Contents.SETTING, 'Cài đặt');

    en.set(Contents.VIDEO_TOGGLE, 'Show/Hide Video');
    vn.set(Contents.VIDEO_TOGGLE, 'Ẩn/ hiện remote');

    en.set(Contents.RESET_VIDEO, 'Reset Video');
    vn.set(Contents.RESET_VIDEO, 'Reset đường truyền');

    en.set(Contents.HOMESCREEN, 'Hide windows');
    vn.set(Contents.HOMESCREEN, 'Ẩn game/app');

    en.set(Contents.LOW_PERIOD, 'Auto refresh');
    vn.set(Contents.LOW_PERIOD, 'Làm mới liên tục');

    en.set(Contents.FULLSCREEN, 'Fullscreen');
    vn.set(Contents.FULLSCREEN, 'Toàn màn hình');

    en.set(Contents.RELATIVE_MOUSE, 'Gaming mode');
    vn.set(Contents.RELATIVE_MOUSE, 'Chế độ gaming');

    en.set(Contents.SCAN_CODE, 'Fix keyboard');
    vn.set(Contents.SCAN_CODE, 'Fix lỗi phím');

    en.set(Contents.EXTERNAL_TAB, 'Open external tab');
    vn.set(Contents.EXTERNAL_TAB, 'Mở tab riêng');

    en.set(Contents.QUALITY, 'Quality');
    vn.set(Contents.QUALITY, 'MBps: Chất lượng video -> tốc độ mạng');

    en.set(Contents.FRAMERATE, 'FPS');
    vn.set(Contents.FRAMERATE, 'FPS: Số khung hình hiển thị/ giây');

    en.set(Contents.START_DEMO, 'Start Demo');
    vn.set(Contents.START_DEMO, 'Bắt Đầu');

    en.set(Contents.READ_USER_MANUAL, 'Will start in ');
    vn.set(Contents.READ_USER_MANUAL, 'Sẽ bắt đầu sau ');
    en.set(
        Contents.PRO_TIP_DEMO_0,
        'Demo time is 15 minutes, if you want more demo, click "Support Now"'
    );
    vn.set(
        Contents.PRO_TIP_DEMO_0,
        'Thời gian Demo là 15 phút, nếu muốn demo thêm hãy click "Hỗ Trợ Ngay"'
    );

    en.set(Contents.PRO_TIP_DEMO_1, 'Open settings in the lower right corner');
    vn.set(Contents.PRO_TIP_DEMO_1, 'Mở "Setting" góc dưới bên phải');

    en.set(Contents.PRO_TIP_DEMO_2, 'Full screen when playing games');
    vn.set(Contents.PRO_TIP_DEMO_2, 'Nên bật "Toàn màn hình" khi chơi game');

    en.set(
        Contents.PRO_TIP_DEMO_3,
        'Click "Support now" to receive the earliest technical support'
    );
    vn.set(
        Contents.PRO_TIP_DEMO_3,
        'Click "Hỗ trợ ngay" để được hỗ trợ kỹ thuật sớm nhất.'
    );

    // -----------------------------------------------
    // FEEDBACK
    en.set(Contents.FB_TERRIBLE, 'Terrible');
    vn.set(Contents.FB_TERRIBLE, 'Rất tệ');

    en.set(Contents.FB_BAD, 'Bad');
    vn.set(Contents.FB_BAD, 'Tệ');

    en.set(Contents.FB_GOOD, 'Good');
    vn.set(Contents.FB_GOOD, 'Tốt');

    en.set(Contents.FB_AMAZING, 'Amazing');
    vn.set(Contents.FB_AMAZING, 'Tuyệt vời');

    en.set(Contents.FB_CONTROL, 'Control');
    vn.set(Contents.FB_CONTROL, 'Điều khiển');

    en.set(Contents.FB_KEYBOARD, 'Keyboard');
    vn.set(Contents.FB_KEYBOARD, 'Bàn phím');

    en.set(Contents.FB_MOUSE, 'Mouse');
    vn.set(Contents.FB_MOUSE, 'Chuột');

    en.set(Contents.FB_GAMEPAD, 'Gamepad');
    vn.set(Contents.FB_GAMEPAD, 'Tay cầm');

    en.set(Contents.FB_TOUCH, 'Touch');
    vn.set(Contents.FB_TOUCH, 'Cảm ứng');

    en.set(Contents.FB_CONNECT, 'Connect');
    vn.set(Contents.FB_CONNECT, 'Kết nối');

    en.set(Contents.FB_BLACKSCREEN, 'Black screen');
    vn.set(Contents.FB_BLACKSCREEN, 'Màn hình đen');

    en.set(Contents.FB_LAG, 'Lag');
    vn.set(Contents.FB_LAG, 'Lag');

    en.set(Contents.FB_NOSHOWVIDEO, 'No show video');
    vn.set(Contents.FB_NOSHOWVIDEO, 'Không hiện máy tính');

    en.set(Contents.FB_GAME, 'Game');
    vn.set(Contents.FB_GAME, 'Game');

    en.set(Contents.FB_OTHER, 'Other');
    vn.set(Contents.FB_OTHER, 'Khác');

    en.set(Contents.FB_ISSUE, 'You have problems with:');
    vn.set(Contents.FB_ISSUE, 'Bạn gặp vấn đề với:');

    en.set(Contents.FB_SUBMIT, 'Submit');
    vn.set(Contents.FB_SUBMIT, 'Gửi');

    en.set(Contents.FB_DETAIL, 'Detail:');
    vn.set(Contents.FB_DETAIL, 'Chi Tiết:');

    en.set(Contents.DEMO_QUEUED, 'Your demo turns are:');
    vn.set(Contents.DEMO_QUEUED, 'Số thự tự DEMO của bạn là:');

    en.set(Contents.DEMO_NOTE, '*Exiting the page will forfeit the demo turn.');
    vn.set(Contents.DEMO_NOTE, '*Thoát trang sẽ mất lượt demo');

    en.set(Contents.ALREADY_DEMO, 'You are already demo services');
    vn.set(Contents.ALREADY_DEMO, 'Bạn đã demo rồi 😎');

    en.set(Contents.THINKMAY_HEADER, 'Thinkmay - Cloud PC');
    vn.set(Contents.THINKMAY_HEADER, 'Thinkmay - Cloud PC');

    en.set(
        Contents.THINKMAY_DESC,
        'Play AAA Games, professionally graphic work on any device.'
    );
    vn.set(
        Contents.THINKMAY_DESC,
        'Chơi game khủng, làm đồ họa nặng trên mọi thiết bị.'
    );
    en.set(Contents.PLAN_USAGE_TIME, 'Plan usage time');
    vn.set(Contents.PLAN_USAGE_TIME, 'Thời gian của gói');
    en.set(Contents.ADDITIONAL_TIME, 'Additional time');
    vn.set(Contents.ADDITIONAL_TIME, 'Thời gian cộng thêm');
    return t;
}
