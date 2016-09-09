#import "AppDelegate.h"
#import "ViewController.h"
#import <React/RCTRootView.h>
#import <React/RCTLinkingManager.h>
#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>
#import <Fabric/Fabric.h>
#import <Crashlytics/Crashlytics.h>
#import <SalesforceSDKCore/SFPushNotificationManager.h>
#import <SalesforceSDKCore/SFDefaultUserManagementViewController.h>
#import <SalesforceSDKCore/SalesforceSDKManager.h>
#import <SalesforceSDKCore/SFUserAccountManager.h>
#import <SalesforceSDKCore/SFLogger.h>
#import <SmartStore/SalesforceSDKManagerWithSmartStore.h>


// Fill these in when creating a new Connected Application on Force.com
static NSString * const RemoteAccessConsumerKey = @"3MVG9Iu66FKeHhINkB1l7xt7kR8czFcCTUhgoA8Ol2Ltf1eYHOU4SqQRSEitYFDUpqRWcoQ2.dBv_a1Dyu5xa";
static NSString * const OAuthRedirectURI        = @"testsfdc:///mobilesdk/detect/oauth/done";

@implementation AppDelegate

@synthesize mainViewController;
@synthesize appViewController;
@synthesize shouldRotate;

NSString *const ReturnToHomeEvent = @"returnToHome";

float const kFlipTransitionDuration = 0.4f;
int const kFlipTransitionType = UIViewAnimationOptionTransitionFlipFromRight;

- (id)init
{
  self = [super init];
  if (self) {
    [SFLogger setLogLevel:SFLogLevelDebug];
    [SalesforceSDKManager setInstanceClass:[SalesforceSDKManagerWithSmartStore class]];
    [SalesforceSDKManager sharedManager].connectedAppId = RemoteAccessConsumerKey;
    [SalesforceSDKManager sharedManager].connectedAppCallbackUri = OAuthRedirectURI;
    [SalesforceSDKManager sharedManager].authScopes = @[ @"web", @"api" ];
    __weak AppDelegate *weakSelf = self;
    [SalesforceSDKManager sharedManager].postLaunchAction = ^(SFSDKLaunchAction launchActionList) {
      //
      // If you wish to register for push notifications, uncomment the line below.  Note that,
      // if you want to receive push notifications from Salesforce, you will also need to
      // implement the application:didRegisterForRemoteNotificationsWithDeviceToken: method (below).
      //
      // [[SFPushNotificationManager sharedInstance] registerForRemoteNotifications];
      //
      [weakSelf log:SFLogLevelInfo format:@"Post-launch: launch actions taken: %@", [SalesforceSDKManager launchActionsStringRepresentation:launchActionList]];
      [weakSelf setupRootViewController];
    };
    [SalesforceSDKManager sharedManager].launchErrorAction = ^(NSError *error, SFSDKLaunchAction launchActionList) {
      [weakSelf log:SFLogLevelError format:@"Error during SDK launch: %@", [error localizedDescription]];
      [weakSelf initializeAppViewState];
      [[SalesforceSDKManager sharedManager] launch];
    };
    [SalesforceSDKManager sharedManager].postLogoutAction = ^{
      [weakSelf handleSdkManagerLogout];
    };
    [SalesforceSDKManager sharedManager].switchUserAction = ^(SFUserAccount *fromUser, SFUserAccount *toUser) {
      [weakSelf handleUserSwitch:fromUser toUser:toUser];
    };
  }
  
  return self;
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.launchOptions = launchOptions;
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  [self initializeAppViewState];
  [[SalesforceSDKManager sharedManager] launch];
  return YES;
}

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  //
  // Uncomment the code below to register your device token with the push notification manager
  //
  // [[SFPushNotificationManager sharedInstance] didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
  // if ([SFUserAccountManager sharedInstance].currentUser.credentials.accessToken != nil) {
  //    [[SFPushNotificationManager sharedInstance] registerForSalesforceNotifications];
  // }
  //
}

- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
  // Respond to any push notification registration errors here.
}

#pragma mark - Private methods

- (void)initializeAppViewState
{
  if (![NSThread isMainThread]) {
    dispatch_async(dispatch_get_main_queue(), ^{
      [self initializeAppViewState];
    });
    return;
  }
  
  [Fabric with:@[[Crashlytics class]]];
}

- (void)setupRootViewController
{
  NSURL *initialJSBundleURL;
  NSString *initialModuleName;
  
  NSString *suppliedModuleName = [[NSUserDefaults standardUserDefaults] stringForKey:@"moduleName"];
  NSString *suppliedAppUrl = [[NSUserDefaults standardUserDefaults] stringForKey:@"bundleUrl"];
  
  if (suppliedAppUrl) {
    
    initialJSBundleURL = [NSURL URLWithString:suppliedAppUrl];
    initialModuleName = suppliedModuleName;
    
  } else {
    
    // NOTE: Uncomment this line before release
    //    initialJSBundleURL = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
    
    // NOTE: Comment out this line before release
    initialJSBundleURL = [NSURL URLWithString:@"http://localhost:8081/index.ios.bundle?platform=ios&dev=true"];
    
    initialModuleName = @"RNPlayNative";
  }
  
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:initialJSBundleURL
                                                      moduleName:initialModuleName
                                               initialProperties:NULL
                                                   launchOptions:self.launchOptions];
  
  
  rootView.loadingView = [self spinner];
  rootView.loadingViewFadeDelay = 0.0;
  rootView.loadingViewFadeDuration = 0.15;
  
  mainViewController = [[UIViewController alloc] init];
  [mainViewController setView:rootView];
  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  self.window.rootViewController = mainViewController;
  self.window.backgroundColor = [UIColor blackColor];
  [self.window makeKeyAndVisible];
  
  UILongPressGestureRecognizer *exitGesture = [[UILongPressGestureRecognizer alloc]
                                               initWithTarget:self action:@selector(goToHomeScreen:)];
  [exitGesture setMinimumPressDuration:1.5f];
  [exitGesture setNumberOfTouchesRequired:2];
  [self.window addGestureRecognizer:exitGesture];
}

- (void)resetViewState:(void (^)(void))postResetBlock
{
  if ([self.window.rootViewController presentedViewController]) {
    [self.window.rootViewController dismissViewControllerAnimated:NO completion:^{
      postResetBlock();
    }];
  } else {
    postResetBlock();
  }
}

- (void)handleSdkManagerLogout
{
  [self log:SFLogLevelDebug msg:@"SFAuthenticationManager logged out.  Resetting app."];
  [self resetViewState:^{
    [self initializeAppViewState];
    
    // Multi-user pattern:
    // - If there are two or more existing accounts after logout, let the user choose the account
    //   to switch to.
    // - If there is one existing account, automatically switch to that account.
    // - If there are no further authenticated accounts, present the login screen.
    //
    // Alternatively, you could just go straight to re-initializing your app state, if you know
    // your app does not support multiple accounts.  The logic below will work either way.
    NSArray *allAccounts = [SFUserAccountManager sharedInstance].allUserAccounts;
    if ([allAccounts count] > 1) {
      SFDefaultUserManagementViewController *userSwitchVc = [[SFDefaultUserManagementViewController alloc] initWithCompletionBlock:^(SFUserManagementAction action) {
        [self.window.rootViewController dismissViewControllerAnimated:YES completion:NULL];
      }];
      [self.window.rootViewController presentViewController:userSwitchVc animated:YES completion:NULL];
    } else {
      if ([allAccounts count] == 1) {
        [SFUserAccountManager sharedInstance].currentUser = ([SFUserAccountManager sharedInstance].allUserAccounts)[0];
      }
      
      [[SalesforceSDKManager sharedManager] launch];
    }
  }];
}

- (void)handleUserSwitch:(SFUserAccount *)fromUser
                  toUser:(SFUserAccount *)toUser
{
  [self log:SFLogLevelDebug format:@"SFUserAccountManager changed from user %@ to %@.  Resetting app.",
   fromUser.userName, toUser.userName];
  [self resetViewState:^{
    [self initializeAppViewState];
    [[SalesforceSDKManager sharedManager] launch];
  }];
}

//// NEW


- (NSUInteger)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window {
  NSUInteger orientations;

  orientations = UIInterfaceOrientationMaskPortrait;

  if (appViewController && shouldRotate == YES) {

    orientations = UIInterfaceOrientationMaskAllButUpsideDown;
  }

  return orientations;
}


- (UIActivityIndicatorView *)spinner {

  UIActivityIndicatorView *spinner = [[UIActivityIndicatorView alloc] init];
  [spinner setActivityIndicatorViewStyle:UIActivityIndicatorViewStyleWhiteLarge];
  [spinner setColor:[UIColor colorWithRed:113.0f/255.0f green:47.0f/255.0f blue:169.0f/255.0f alpha:1.0f]];
  [spinner startAnimating];
  return spinner;
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {
  return [RCTLinkingManager application:application openURL:url sourceApplication:sourceApplication annotation:annotation];
}

- (void)goToHomeScreen:(UISwipeGestureRecognizer*)swipeGesture {

  if (self.appViewController) {
    self.appViewController = nil;
    shouldRotate = NO;

    [UIView transitionWithView:self.window
                      duration:kFlipTransitionDuration
                       options:kFlipTransitionType
                    animations:^{
                      self.window.rootViewController = mainViewController;
                    }
                    completion: ^(BOOL finished){
                      if (finished) {
                        RCTBridge *bridge = [(RCTRootView *)self.window.rootViewController.view bridge];
                        [bridge.eventDispatcher sendAppEventWithName:ReturnToHomeEvent body:@{
                          @"returnToHome": @"true"
                        }];
                      }
                    }];
  }
}

@end
