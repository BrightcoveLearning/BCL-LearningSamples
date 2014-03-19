//
//  ViewController.m
//  SampleCustomControls
//
// Copyright (c) 2014 Brightcove, Inc. All rights reserved.
// License: https://accounts.brightcove.com/en/terms-and-conditions
//

#import "ViewController.h"

#import "ControlsViewController.h"
#import "RACEXTScope.h"


// ** Customize Here **
static NSString * const kViewControllerCatalogToken = @"nFCuXstvl910WWpPnCeFlDTNrpXA5mXOO9GPkuTCoLKRyYpPF1ikig..";
static NSString * const kViewControllerPlaylistID = @"2149006311001";
static NSTimeInterval const kViewControllerControlsVisibleDuration = 5.;
static NSTimeInterval const kViewControllerFadeControlsInAnimationDuration = .1;
static NSTimeInterval const kViewControllerFadeControlsOutAnimationDuration = .2;


@interface ViewController ()

@property (nonatomic, strong) BCOVCatalogService *catalogService;
@property (nonatomic, strong) id<BCOVPlaybackController> playbackController;
@property (nonatomic, weak) AVPlayer *currentPlayer;

@property (nonatomic, weak) IBOutlet UIView *videoContainerView;
@property (nonatomic, weak) IBOutlet UIView *controlsContainerView;
@property (nonatomic, strong) NSTimer *controlTimer;

@end


@implementation ViewController

- (id)init
{
    self = [super init];
    if (self)
	{
        [self configure];
    }
    return self;
}

-(id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self)
	{
        [self configure];
    }
    return self;
}

-(void)awakeFromNib
{
    [super awakeFromNib];
    [self configure];
}

-(void)configure
{
    BCOVPlayerSDKManager *playbackManager = [BCOVPlayerSDKManager sharedManager];
    
    id<BCOVPlaybackController> playbackController = [playbackManager createPlaybackController];
    playbackController.delegate = self;
    self.playbackController = playbackController;
    
    self.catalogService = [[BCOVCatalogService alloc] initWithToken:kViewControllerCatalogToken];
    [self requestContentFromCatalog];
}

- (void)requestContentFromCatalog
{
    @weakify(self);
    [self.catalogService findPlaylistWithPlaylistID:kViewControllerPlaylistID parameters:nil completion:^(BCOVPlaylist *playlist, NSDictionary *jsonResponse, NSError *error) {
        
        @strongify(self);
        
        if (playlist)
        {
            [self.playbackController setVideos:playlist.videos];
        }
        else
        {
            NSLog(@"ViewController Debug - Error retrieving playlist: %@", error);
        }
        
    }];
}

- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view, typically from a nib.
    
    // This example uses the BCOVPlaybackSessionConsumer and
    // BCOVDelegatingSessionConsumer APIs.
    
    // Control logic is broken up into a seperate UIViewController
    ControlsViewController *controlsViewController = [[ControlsViewController alloc] init];
    [self addChildViewController:controlsViewController];
    [self.controlsContainerView addSubview:controlsViewController.view];
    [self configureConstraintsForControlsView:controlsViewController.view];
    [controlsViewController didMoveToParentViewController:self];
    
    // This provides delegate methods similar to the BCOVPlaybackSession delegate
    // methods.
    BCOVDelegatingSessionConsumer *delegatingSessionConsumer = [[BCOVDelegatingSessionConsumer alloc] initWithDelegate:controlsViewController];
    [self.playbackController addSessionConsumer:delegatingSessionConsumer];
    
    self.playbackController.view.frame = self.videoContainerView.bounds;
    self.playbackController.view.autoresizingMask = UIViewAutoresizingFlexibleHeight | UIViewAutoresizingFlexibleWidth;
    [self.videoContainerView insertSubview:self.playbackController.view belowSubview:self.controlsContainerView];
    
    // Used for hiding and showing the controls.
    UITapGestureRecognizer *tapRecognizer = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(tapDetected:)];
    tapRecognizer.numberOfTapsRequired = 1;
    tapRecognizer.numberOfTouchesRequired = 1;
    tapRecognizer.delegate = self;
    [self.view addGestureRecognizer:tapRecognizer];
}

#pragma mark BCOVPlaybackControllerDelegate

- (void)playbackController:(id<BCOVPlaybackController>)controller didAdvanceToPlaybackSession:(id<BCOVPlaybackSession>)session
{
    self.currentPlayer = session.player;
    [self invalidateTimerAndShowControls];
}

- (void)playbackController:(id<BCOVPlaybackController>)controller playbackSession:(id<BCOVPlaybackSession>)session didReceiveLifecycleEvent:(BCOVPlaybackSessionLifecycleEvent *)lifecycleEvent
{
    if ([kBCOVPlaybackSessionLifecycleEventPlay isEqualToString:lifecycleEvent.eventType])
    {
        [self reestablishTimer];
    }
    else if([kBCOVPlaybackSessionLifecycleEventPause isEqualToString:lifecycleEvent.eventType])
    {
        [self invalidateTimerAndShowControls];
    }
    else if ([kBCOVPlaybackSessionLifecycleEventEnd isEqualToString:lifecycleEvent.eventType])
    {
        [self invalidateTimerAndShowControls];
    }
}

#pragma mark Controls View Hiding/Fading

- (void)fadeControlsIn
{
    [UIView animateWithDuration:kViewControllerFadeControlsInAnimationDuration animations:^{
        
        [self showControls];
        
    } completion:^(BOOL finished) {
        
        if(finished)
        {
            [self reestablishTimer];
        }
        
    }];
}

- (void)fadeControlsOut
{
    [UIView animateWithDuration:kViewControllerFadeControlsOutAnimationDuration animations:^{
        
        [self hideControls];
        
    }];
}

- (void)hideControls
{
    self.controlsContainerView.alpha = 0.f;
}

- (void)showControls
{
    self.controlsContainerView.alpha = 1.f;
}

- (void)reestablishTimer
{
    [self.controlTimer invalidate];
    self.controlTimer = [NSTimer scheduledTimerWithTimeInterval:kViewControllerControlsVisibleDuration target:self selector:@selector(fadeControlsOut) userInfo:nil repeats:NO];
}

-(BOOL)gestureRecognizer:(UIGestureRecognizer *)gestureRecognizer shouldReceiveTouch:(UITouch *)touch
{
    if([touch.view isKindOfClass:[UIButton class]] || [touch.view isKindOfClass:[UISlider class]])
    {
        return NO;
    }
    
    return YES;
}

- (void)tapDetected:(UIGestureRecognizer *)gestureRecognizer
{
    if(self.currentPlayer.rate > 0)
    {
        if(self.controlsContainerView.alpha == 0.f)
        {
            [self fadeControlsIn];
        }
        else if (self.controlsContainerView.alpha == 1.f)
        {
            [self fadeControlsOut];
        }
    }
}

- (void)invalidateTimerAndShowControls
{
    [self.controlTimer invalidate];
    [self showControls];
}

#pragma mark UI

- (void)configureConstraintsForControlsView:(UIView *)controlsView
{
    [controlsView setTranslatesAutoresizingMaskIntoConstraints:NO];
    
    NSLayoutConstraint *fixedHeightConstraint = [NSLayoutConstraint constraintWithItem:controlsView attribute:NSLayoutAttributeHeight relatedBy:NSLayoutRelationEqual toItem:Nil attribute:NSLayoutAttributeNotAnAttribute multiplier:1 constant:50];
    [self.controlsContainerView addConstraint:fixedHeightConstraint];
    
    NSLayoutConstraint *pinToBottomConstraint = [NSLayoutConstraint constraintWithItem:controlsView attribute:NSLayoutAttributeBottom relatedBy:NSLayoutRelationEqual toItem:self.controlsContainerView attribute:NSLayoutAttributeBottom multiplier:1 constant:0];
    [self.controlsContainerView addConstraint:pinToBottomConstraint];
    
    NSLayoutConstraint *equalWidthConstraint = [NSLayoutConstraint constraintWithItem:controlsView attribute:NSLayoutAttributeWidth relatedBy:NSLayoutRelationEqual toItem:self.controlsContainerView attribute:NSLayoutAttributeWidth multiplier:1 constant:0];
    [self.controlsContainerView addConstraint:equalWidthConstraint];
    
    NSLayoutConstraint *centerXConstraint = [NSLayoutConstraint constraintWithItem:controlsView attribute:NSLayoutAttributeCenterX relatedBy:NSLayoutRelationEqual toItem:self.controlsContainerView attribute:NSLayoutAttributeCenterX multiplier:1 constant:0];
    [self.controlsContainerView addConstraint:centerXConstraint];
}

- (UIStatusBarStyle)preferredStatusBarStyle
{
    return UIStatusBarStyleLightContent;
}

@end
