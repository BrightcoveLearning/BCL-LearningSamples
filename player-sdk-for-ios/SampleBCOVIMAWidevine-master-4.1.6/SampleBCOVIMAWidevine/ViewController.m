//
//  ViewController.m
//  SampleBCOVIMAWidevine
//
// Copyright (c) 2014 Brightcove, Inc. All rights reserved.
// License: https://accounts.brightcove.com/en/terms-and-conditions
//

#import "BCOVIMA.h"
#import "BCOVWidevine.h"

#import "ViewController.h"
#import "IMAAdEvent.h"
#import "RACEXTScope.h"


// ** Customize Here **
static NSString * const kViewControllerIMAPublisherID = @"insertyourpidhere";
static NSString * const kViewControllerIMALanguage = @"en";
static NSString * const kViewControllerIMAVMAPResponseAdTag = @"http://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=%2F15018773%2Feverything2&ciu_szs=300x250%2C468x60%2C728x90&impl=s&gdfp_req=1&env=vp&output=xml_vast2&unviewed_position_start=1&url=dummy&correlator=[timestamp]&cmsid=133&vid=10XWSh7W4so&ad_rule=1";
static NSString * const kViewControllerCatalogToken = @"FqicLlYykdimMML7pj65Gi8IHl8EVReWMJh6rLDcTjTMqdb5ay_xFA..";
static NSString * const kViewControllerPlaylistReferenceID = @"ios_videos";


@interface ViewController ()

@property (nonatomic, assign) BOOL adIsPlaying;
@property (nonatomic, strong) BCOVCatalogService *catalogService;
@property (nonatomic, weak) id<BCOVPlaybackSession> currentPlaybackSession;
@property (nonatomic, strong) id<BCOVPlaybackController> playbackController;
@property (nonatomic, weak) IBOutlet UIView *videoContainerView;

@end


@implementation ViewController

-(void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self name:UIApplicationWillEnterForegroundNotification object:nil];
}

- (id)init
{
    self = [super init];
    if (self)
	{
        [self setup];
    }
    return self;
}

-(id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self)
	{
        [self setup];
    }
    return self;
}

-(void)awakeFromNib
{
    [super awakeFromNib];
    [self setup];
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
    
    self.playbackController.view.frame = self.videoContainerView.bounds;
    self.playbackController.view.autoresizingMask = UIViewAutoresizingFlexibleHeight | UIViewAutoresizingFlexibleWidth;
    [self.videoContainerView addSubview:self.playbackController.view];
}


-(void)setup
{
    self.adIsPlaying = NO;
    
    BCOVPlayerSDKManager *playbackManager = [BCOVPlayerSDKManager sharedManager];
    
    // In order to use Widevine and IMA together, we are going to compose a
    // Widevine session provider and a IMA session provider together. We will
    // create a pipeline that starts with the Widevine provider and ends with the
    // IMA provider.
    
    // Create the Widevine session provider.
    id<BCOVPlaybackSessionProvider> widevineSessionProvider = [playbackManager createWidevineSessionProviderWithOptions:[[BCOVWidevineSessionProviderOptions alloc] init]];
    
    IMASettings *imaSettings = [[IMASettings alloc] init];
    imaSettings.ppid = kViewControllerIMAPublisherID;
    imaSettings.language = kViewControllerIMALanguage;
    
    IMAAdsRenderingSettings *renderSettings = [[IMAAdsRenderingSettings alloc] init];
    renderSettings.webOpenerPresentingController = self;
    
    // Create an IMA session provider. We pass the Widevine session provider
    // as the upstream session provider, thus creating our pipeline.
    // When using IMA and Widevine together, Widevine *must* be placed first.
    id<BCOVPlaybackSessionProvider> imaSessionProvider = [playbackManager createIMASessionProviderWithSettings:imaSettings adsRenderingSettings:renderSettings upstreamSessionProvider:widevineSessionProvider options:[[BCOVIMASessionProviderOptions alloc] init]];
    
    // We use the IMA session (and pipeline) to create a playback controller
    // that can play Widevine content and provide ads through IMA.
    id<BCOVPlaybackController> playbackController = [playbackManager createPlaybackControllerWithSessionProvider:imaSessionProvider viewStrategy:[self viewStrategyWithFrame:CGRectMake(0, 0, 400, 400)]];
    playbackController.delegate = self;
    self.playbackController = playbackController;
    
    // When the app goes to the background, the Google IMA library will pause
    // the ad. This code demonstrates how you would resume the ad when entering
    // the foreground.
    // We will use @weakify(self)/@strongify(self) a few times later in the code.
    // For more info on weakify/strongify, visit https://github.com/jspahrsummers/libextobjc.
    @weakify(self);
    [[NSNotificationCenter defaultCenter] addObserverForName:UIApplicationWillEnterForegroundNotification object:self queue:nil usingBlock:^(NSNotification *note) {
        
        @strongify(self);
        
        if (self.adIsPlaying)
        {
            [self.playbackController resumeAd];
        }
        
    }];
    
    self.catalogService = [[BCOVCatalogService alloc] initWithToken:kViewControllerCatalogToken];
    [self requestContentFromCatalog];
}

-(void)playbackController:(id<BCOVPlaybackController>)controller didAdvanceToPlaybackSession:(id<BCOVPlaybackSession>)session
{
    self.currentPlaybackSession = session;
    NSLog(@"ViewController Debug - Advanced to new session.");
}

-(void)playbackController:(id<BCOVPlaybackController>)controller playbackSession:(id<BCOVPlaybackSession>)session didReceiveLifecycleEvent:(BCOVPlaybackSessionLifecycleEvent *)lifecycleEvent
{
    // Widevine and Ad events are emmited though lifecycle events. The events
    // are defined in BCOVWidevineComponent.h and BCOVIMAComponent.h respectively.
    
    NSString *type = lifecycleEvent.eventType;
    
    if ([type isEqualToString:kBCOVIMALifecycleEventAdsLoaderLoaded])
    {
        NSLog(@"ViewController Debug - Ads loaded.");
    }
    else if ([type isEqualToString:kBCOVIMALifecycleEventAdsManagerDidReceiveAdEvent])
    {
        IMAAdEvent *adEvent = lifecycleEvent.properties[@"adEvent"];
        
        switch (adEvent.type)
        {
            case kIMAAdEvent_STARTED:
                NSLog(@"ViewController Debug - Ad Started.");
                self.adIsPlaying = YES;
                break;
            case kIMAAdEvent_COMPLETE:
                NSLog(@"ViewController Debug - Ad Completed.");
                self.adIsPlaying = NO;
                break;
            case kIMAAdEvent_ALL_ADS_COMPLETED:
                NSLog(@"ViewController Debug - All ads completed.");
                break;
            default:
                break;
        }
        
    }
    else if ([type isEqualToString:kBCOVWidevineLifecycleEventWViOsApi])
    {
        NSLog(@"ViewController Debug - Widevine Event: %@", lifecycleEvent.properties);
    }
}

- (void)requestContentFromCatalog
{
    // In order to play back content, we are going to request a playlist from the
    // catalog service. The Widevine component offers methods for retrieving Widevine
    // Content. The data in the catalog does not have the required
    // VMAP tag on the video, so this code demonstrates how to update a playlist
    // to set the ad tags on the video.
    // You are responsible for determining where the ad tag should originate from.
    // We advise that if you choose to hard code it into your app, that you provide
    // a mechanism to update it without having to submit an update to your app.
    @weakify(self);
    [self.catalogService findWidevinePlaylistWithReferenceID:kViewControllerPlaylistReferenceID parameters:nil completion:^(BCOVPlaylist *playlist, NSDictionary *jsonResponse, NSError *error) {
        
        @strongify(self);
        
        if (playlist)
        {
            BCOVPlaylist *updatedPlaylist = [playlist update:^(id<BCOVMutablePlaylist> mutablePlaylist) {
                
                NSMutableArray *newVideos = [NSMutableArray arrayWithCapacity:mutablePlaylist.videos.count];
                
                for (BCOVVideo *video in mutablePlaylist.videos)
                {
                    // Update each video to add the tag.
                    BCOVVideo *updatedVideo = [video update:^(id<BCOVMutableVideo> mutableVideo) {
                        
                        // The BCOVIMA plugin will look for the presence of kBCOVIMAAdTag in
                        // the video's properties when using server side ad rules. This URL returns
                        // a VMAP response that is handled by the Google IMA library.
                        NSDictionary *adProperties = @{ @"kBCOVIMAAdTag" : kViewControllerIMAVMAPResponseAdTag };
                        
                        NSMutableDictionary *propertiesToUpdate = [mutableVideo.properties mutableCopy];
                        [propertiesToUpdate addEntriesFromDictionary:adProperties];
                        mutableVideo.properties = propertiesToUpdate;
                        
                    }];
                    
                    [newVideos addObject:updatedVideo];
                }
                
                mutablePlaylist.videos = newVideos;
                
            }];
            
            [self.playbackController setVideos:updatedPlaylist.videos];
        }
        else
        {
            NSLog(@"ViewController Debug - Error retrieving playlist: %@", error);
        }
        
    }];
}

- (BCOVPlaybackControllerViewStrategy)viewStrategyWithFrame:(CGRect)frame
{
    BCOVPlayerSDKManager *manager = [BCOVPlayerSDKManager sharedManager];
    
    // In this example, we use the defaultControlsViewStrategy. In real app, you
    // wouldn't be using this.  You would add your controls and container view
    // in the composedViewStrategy block below.
    BCOVPlaybackControllerViewStrategy defaultControlsViewStrategy = [manager defaultControlsViewStrategy];
    BCOVPlaybackControllerViewStrategy imaViewStrategy = [manager BCOVIMAAdViewStrategy];
    
    // We create a composed view strategy using the defaultControlsViewStrategy
    // and the BCOVIMAAdViewStrategy.  The purpose of this block is to ensure
    // that the ads appear above above the controls so that we don't need to
    // implement any logic to show and hide the controls.  This should be customized
    // how you see fit.
    // This block is not executed until the playbackController.view property is
    // accessed, even though it is an initialization property. You can
    // use the playbackController property to add an object as a session consumer.
    BCOVPlaybackControllerViewStrategy composedViewStrategy = ^ UIView * (UIView *videoView, id<BCOVPlaybackController> playbackController) {
        
        videoView.frame = frame;
        
        UIView *viewWithControls = defaultControlsViewStrategy(videoView, playbackController); //Replace this with your own container view.
        UIView *viewWithAdsAndControls = imaViewStrategy(viewWithControls, playbackController);
        
        return viewWithAdsAndControls;
        
    };
    
    return [composedViewStrategy copy];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (UIStatusBarStyle)preferredStatusBarStyle
{
    return UIStatusBarStyleLightContent;
}

@end
